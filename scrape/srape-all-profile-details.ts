import { LinkedInScraper } from "./LinkedInScraper";
import { ProfileConfig } from "./Models";
import * as fs from 'fs';
import * as path from 'path';

(async () => {
    const scraper = new LinkedInScraper();
    await scraper.init();
    const config = new ProfileConfig();

    const inputUrls = 'all-urls.json';
    const outputDir = 'profile-details';

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    const urls: string[] = Array.from(JSON.parse(fs.readFileSync(inputUrls, 'utf8')));

    for (const url of urls) {
        console.log(`Processing file: ${url}`);

            const safeName = url
                .replace('https://www.linkedin.com/in/', '')
                .toLowerCase();
            const outputFilePath = path.join(outputDir, `profile_${safeName}.json`);

            if (fs.existsSync(outputFilePath)) {
                console.log(`Skipping already scraped profile: ${url}`);
                continue;
            }

            console.log(`Scraping profile: ${url}`);
            try {
                const profile = await scraper.getProfile(url, config);
                fs.writeFileSync(outputFilePath, JSON.stringify(profile, null, 2));
                console.log(`Saved profile to ${outputFilePath}`);
            } catch (error) {
                console.error(`Error scraping profile ${url}:`, error);
            }
    }

    console.log("Profile scraping complete.");
})();
