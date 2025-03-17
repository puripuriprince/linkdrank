require('dotenv').config();
let puppeteer;

//this shit doesnt work rn

try {
  // Try to use full puppeteer first
  puppeteer = require('puppeteer');
} catch (e) {
  try {
    // Fall back to puppeteer-core if available
    puppeteer = require('puppeteer-core');
    console.log('Using puppeteer-core instead of full puppeteer');
  } catch (e2) {
    console.error('Neither puppeteer nor puppeteer-core is installed.');
    console.error('Please install one of them: npm install puppeteer');
    process.exit(1);
  }
}

const { createClient } = require('@supabase/supabase-js');
const { generateEmbedding } = require('../services/vectorization');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// LinkedIn credentials
const LINKEDIN_USERNAME = process.env.LINKEDIN_USERNAME;
const LINKEDIN_PASSWORD = process.env.LINKEDIN_PASSWORD;

// Configuration
const MAX_PROFILES = parseInt(process.env.MAX_PROFILES || '1000');
const TARGET_SCHOOLS = ['McGill', 'Concordia'];
const CRAWL_DEPTH = parseInt(process.env.CRAWL_DEPTH || '3');
const DELAY_MIN = parseInt(process.env.DELAY_MIN || '5000'); // Minimum delay between requests
const DELAY_MAX = parseInt(process.env.DELAY_MAX || '10000'); // Maximum delay between requests

// Set to keep track of processed profiles to avoid duplicates
const processedProfiles = new Set();
const queuedProfiles = new Set();

/**
 * Login to LinkedIn
 * @param {Object} page - Puppeteer page
 * @returns {Promise<void>}
 */
async function loginToLinkedIn(page) {
  console.log('Logging in to LinkedIn...');
  await page.goto('https://www.linkedin.com/login', { waitUntil: 'networkidle2' });
  
  await page.type('#username', LINKEDIN_USERNAME);
  await page.type('#password', LINKEDIN_PASSWORD);
  await page.click('[type="submit"]');
  
  // Wait for login to complete
  await page.waitForNavigation({ waitUntil: 'networkidle2' });
  console.log('Login successful.');
  
  // Wait a bit after login to avoid suspicion
  await page.waitForTimeout(getRandomDelay());
}

/**
 * Extract profile data from LinkedIn profile page
 * @param {Object} page - Puppeteer page
 * @returns {Promise<Object>} - Profile data
 */
async function extractProfileData(page) {
  console.log('Extracting profile data...');
  
  // Wait for profile sections to load
  await page.waitForSelector('.pv-top-card', { timeout: 5000 }).catch(() => {});
  
  // Extract data using page.evaluate
  const profileData = await page.evaluate(() => {
    // Name
    const nameElement = document.querySelector('.pv-top-card h1');
    const name = nameElement ? nameElement.innerText.trim() : '';
    
    // Headline/Title
    const headlineElement = document.querySelector('.pv-top-card .pv-top-card--list .text-body-medium');
    const headline = headlineElement ? headlineElement.innerText.trim() : '';
    
    // Location
    const locationElement = document.querySelector('.pv-top-card .pv-top-card--list.mt2 .text-body-small');
    const location = locationElement ? locationElement.innerText.trim() : '';
    
    // About/Summary
    const aboutElement = document.querySelector('.pv-shared-text-with-see-more .visually-hidden');
    const summary = aboutElement ? aboutElement.innerText.trim() : '';
    
    // Experience
    const experienceElements = document.querySelectorAll('.experience-section .pv-entity__summary-info, .experience-item');
    const experience = Array.from(experienceElements).map(item => {
      const role = item.querySelector('h3, .t-bold')?.innerText.trim() || '';
      const company = item.querySelector('.pv-entity__secondary-title, .t-normal')?.innerText.trim() || '';
      const duration = item.querySelector('.pv-entity__date-range span:not(:first-child), .date-range')?.innerText.trim() || '';
      return `${role} at ${company} (${duration})`;
    }).join(', ');
    
    // Education
    const educationElements = document.querySelectorAll('.education-section .pv-entity__summary-info, .education-item');
    const education = Array.from(educationElements).map(item => {
      const school = item.querySelector('h3, .t-bold')?.innerText.trim() || '';
      const degree = item.querySelector('.pv-entity__secondary-title.pv-entity__degree-name span:not(:first-child), .education-item__degree-info')?.innerText.trim() || '';
      const field = item.querySelector('.pv-entity__secondary-title.pv-entity__fos span:not(:first-child), .education-item__field-of-study')?.innerText.trim() || '';
      return `${degree} in ${field} from ${school}`;
    }).join(', ');
    
    // Skills
    const skillElements = document.querySelectorAll('.pv-skill-categories-section li .pv-skill-category-entity__name-text, .skill-category-entity__name');
    const skills = Array.from(skillElements).map(skill => skill.innerText.trim());
    
    // LinkedIn URL
    const linkedinUrl = window.location.href.split('?')[0];
    
    return {
      name,
      headline,
      location,
      summary,
      experience,
      education,
      skills,
      linkedin_url: linkedinUrl
    };
  });
  
  console.log(`Extracted profile data for ${profileData.name}`);
  return profileData;
}

/**
 * Check if profile education contains one of the target schools
 * @param {string} education - Education text
 * @returns {boolean} - True if profile has target school
 */
function hasTargetSchool(education) {
  if (!education) return false;
  return TARGET_SCHOOLS.some(school => education.toLowerCase().includes(school.toLowerCase()));
}

/**
 * Get connection URLs from a profile's connections page
 * @param {Object} page - Puppeteer page
 * @param {string} profileUrl - Profile URL
 * @returns {Promise<Array<string>>} - Connection URLs
 */
async function getConnectionUrls(page, profileUrl) {
  console.log(`Getting connections for ${profileUrl}...`);
  
  try {
    // Navigate to connections page
    const connectionsUrl = `${profileUrl}/detail/contact-info/`;
    await page.goto(connectionsUrl, { waitUntil: 'networkidle2' });
    
    // Wait for a random delay to avoid detection
    await page.waitForTimeout(getRandomDelay());
    
    // Extract connection URLs
    const connectionUrls = await page.evaluate(() => {
      const linkElements = document.querySelectorAll('a[href*="/in/"]');
      return Array.from(linkElements)
        .map(el => el.href)
        .filter(url => url.includes('linkedin.com/in/'))
        .map(url => url.split('?')[0]); // Remove query parameters
    });
    
    // Remove duplicates
    const uniqueUrls = [...new Set(connectionUrls)];
    console.log(`Found ${uniqueUrls.length} connections.`);
    return uniqueUrls;
  } catch (error) {
    console.error(`Error getting connections for ${profileUrl}:`, error);
    return [];
  }
}

/**
 * Save profile to database
 * @param {Object} profile - Profile data
 * @returns {Promise<Object>} - Saved profile
 */
async function saveProfileToDatabase(profile) {
  try {
    console.log(`Saving profile for ${profile.name} to database...`);
    
    // Check if profile already exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('linkedin_url', profile.linkedin_url)
      .single();
    
    if (existingProfile) {
      console.log(`Profile for ${profile.name} already exists in database.`);
      return existingProfile;
    }
    
    // Generate embedding for vector search
    const profileText = `${profile.name} ${profile.headline} ${profile.summary} ${profile.experience} ${profile.education} ${profile.skills.join(' ')}`;
    const embedding = await generateEmbedding(profileText);
    
    // Insert into Supabase
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        name: profile.name,
        summary: profile.summary || profile.headline,
        experience: profile.experience,
        education: profile.education,
        skills: profile.skills,
        location: profile.location,
        linkedin_url: profile.linkedin_url,
        embedding,
        elo_rating: 1500 // Default Elo rating
      })
      .select();
    
    if (error) {
      console.error('Error saving profile:', error);
      return null;
    }
    
    console.log(`Profile for ${profile.name} saved successfully.`);
    return data[0];
  } catch (err) {
    console.error('Error in saveProfileToDatabase:', err);
    return null;
  }
}

/**
 * Get a random delay between min and max
 * @returns {number} - Random delay in milliseconds
 */
function getRandomDelay() {
  return Math.floor(Math.random() * (DELAY_MAX - DELAY_MIN + 1)) + DELAY_MIN;
}

/**
 * Crawl LinkedIn profiles starting from a seed profile
 * @param {string} seedUrl - URL of the seed profile
 * @param {number} maxProfiles - Maximum number of profiles to collect
 * @param {number} maxDepth - Maximum crawl depth
 * @returns {Promise<void>}
 */
async function crawlProfiles(seedUrl, maxProfiles = MAX_PROFILES, maxDepth = CRAWL_DEPTH) {
  console.log(`Starting LinkedIn profile crawler with seed: ${seedUrl}`);
  console.log(`Max profiles: ${maxProfiles}, Max depth: ${maxDepth}`);
  console.log(`Target schools: ${TARGET_SCHOOLS.join(', ')}`);
  
  const browser = await puppeteer.launch({
    headless: false, // Set to true in production
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-notifications'],
    defaultViewport: { width: 1280, height: 800 }
  });
  
  try {
    const page = await browser.newPage();
    
    // Set user agent to avoid detection
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    // Login to LinkedIn
    await loginToLinkedIn(page);
    
    // Queue for BFS traversal
    const queue = [{ url: seedUrl, depth: 0 }];
    queuedProfiles.add(seedUrl);
    
    while (queue.length > 0 && processedProfiles.size < maxProfiles) {
      const { url, depth } = queue.shift();
      
      // Skip if already processed or exceeds max depth
      if (processedProfiles.has(url) || depth > maxDepth) {
        continue;
      }
      
      console.log(`Processing profile ${processedProfiles.size + 1}/${maxProfiles} at depth ${depth}: ${url}`);
      
      // Mark as processed
      processedProfiles.add(url);
      
      try {
        // Visit profile page
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
        
        // Wait randomly to avoid triggering LinkedIn's anti-scraping measures
        await page.waitForTimeout(getRandomDelay());
        
        // Extract profile data
        const profileData = await extractProfileData(page);
        
        // Check if profile has McGill or Concordia in education
        const isTargetAlumni = hasTargetSchool(profileData.education);
        
        // Save profile if it has McGill or Concordia in education
        if (isTargetAlumni) {
          console.log(`Found ${TARGET_SCHOOLS.join('/')} alumni: ${profileData.name}`);
          await saveProfileToDatabase(profileData);
        }
        
        // Only add connections if we're not at max depth
        if (depth < maxDepth) {
          const connectionUrls = await getConnectionUrls(page, url);
          
          // Add connections to queue
          for (const connectionUrl of connectionUrls) {
            if (!processedProfiles.has(connectionUrl) && !queuedProfiles.has(connectionUrl)) {
              queue.push({ url: connectionUrl, depth: depth + 1 });
              queuedProfiles.add(connectionUrl);
              console.log(`Queued connection: ${connectionUrl} (depth ${depth + 1})`);
            }
          }
        }
        
        // Respect LinkedIn's rate limits with random delays
        await page.waitForTimeout(getRandomDelay());
      } catch (err) {
        console.error(`Error processing ${url}:`, err);
        // Continue with next profile
      }
    }
    
    console.log(`Profile collection complete. Collected ${processedProfiles.size} profiles.`);
  } catch (err) {
    console.error('Error in crawlProfiles:', err);
  } finally {
    await browser.close();
  }
}

/**
 * Main function to run the crawler
 */
async function main() {
  const seedUrl = process.argv[2];
  if (!seedUrl) {
    console.error('Please provide a seed LinkedIn profile URL.');
    console.error('Usage: node get_data.js <linkedin_profile_url>');
    process.exit(1);
  }
  
  if (!LINKEDIN_USERNAME || !LINKEDIN_PASSWORD) {
    console.error('LinkedIn credentials missing. Set LINKEDIN_USERNAME and LINKEDIN_PASSWORD environment variables.');
    process.exit(1);
  }
  
  await crawlProfiles(seedUrl);
}

// Run the script if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { crawlProfiles, extractProfileData, saveProfileToDatabase };
