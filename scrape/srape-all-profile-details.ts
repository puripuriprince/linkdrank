import { LinkedInScraper } from "./LinkedInScraper";
import { ProfileConfig } from "./Models";
import * as fs from 'fs';
import * as path from 'path';

(async () => {
    const scraper = new LinkedInScraper();
    await scraper.init();
    const config = new ProfileConfig();

    const inputDir = 'profile-links';
    const outputDir = 'profile-details';

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    // Read all files that start with "peopleSearch_" in profile-links
    const files = fs.readdirSync(inputDir).filter(file => file.startsWith('peopleSearch_') && file.endsWith('.json'));

    for (const file of files) {
        const filePath = path.join(inputDir, file);
        console.log(`Processing file: ${filePath}`);

        const peopleData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        for (const person of peopleData) {
            const profileUrl = person.linkedinUrl;
            if (!profileUrl) {
                console.log(`Skipping entry with no profile URL: ${JSON.stringify(person)}`);
                continue;
            }

            const safeName = (person.name || path.basename(profileUrl))
                .replace(/[^a-z0-9]/gi, '_')
                .toLowerCase();
            const outputFilePath = path.join(outputDir, `profile_${safeName}.json`);

            if (fs.existsSync(outputFilePath)) {
                console.log(`Skipping already scraped profile: ${profileUrl}`);
                continue;
            }

            console.log(`Scraping profile: ${profileUrl}`);
            try {
                const profile = await scraper.getProfile(profileUrl, config);
                fs.writeFileSync(outputFilePath, JSON.stringify(profile, null, 2));
                console.log(`Saved profile to ${outputFilePath}`);
            } catch (error) {
                console.error(`Error scraping profile ${profileUrl}:`, error);
            }
        }
    }

    console.log("Profile scraping complete.");
})();
