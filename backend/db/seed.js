require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { generateEmbedding } = require('../services/vectorization');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const sampleProfiles = [
  {
    name: 'Jane Smith',
    user_id: '00000000-0000-0000-0000-000000000001',
    summary: 'Senior Software Engineer with 8 years of experience in web development, specializing in React and Node.js.',
    experience: 'Senior Software Engineer at Tech Co (2019-Present), Software Developer at WebApp Inc (2015-2019)',
    skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'GraphQL'],
    education: 'B.S. Computer Science, University of Technology',
    linkedin_url: 'https://linkedin.com/in/janesmith'
  },
  {
    name: 'John Doe',
    user_id: '00000000-0000-0000-0000-000000000002',
    summary: 'Product Manager with expertise in SaaS products and 5 years of experience in agile development environments.',
    experience: 'Product Manager at SaaS Co (2018-Present), Associate PM at Product Inc (2016-2018)',
    skills: ['Product Management', 'Agile', 'Scrum', 'User Research', 'Roadmapping'],
    education: 'MBA, Business School University',
    linkedin_url: 'https://linkedin.com/in/johndoe'
  }
];

async function seedDatabase() {
  console.log('Seeding database with sample profiles...');
  for (const profile of sampleProfiles) {
    try {
      // Generate text for embedding
      const profileText = `${profile.name} ${profile.summary} ${profile.experience} ${profile.skills.join(' ')} ${profile.education}`;
      console.log(`Generating embedding for ${profile.name}...`);
      const embedding = await generateEmbedding(profileText);

      // Insert into database
      const { data, error } = await supabase
        .from('profiles')
        .insert({ ...profile, embedding });
      if (error) {
        console.error('Error inserting profile:', error);
      } else {
        console.log(`Successfully inserted profile for ${profile.name}`);
      }
    } catch (err) {
      console.error('Error in seed process:', err);
    }
  }
  console.log('Database seeding completed');
}

seedDatabase().catch(console.error);
