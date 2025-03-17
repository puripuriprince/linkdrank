import { LinkedInScraper } from "./LinkedInScraper";
import { ProfileConfig, PeopleSearchConfig } from "./Models";

(async () => {
    const config = new ProfileConfig();

    const scraper = new LinkedInScraper();
    await scraper.init();

    const profile = await scraper.getProfile("https://www.linkedin.com/in/nikita-kozak/", config);
    console.log(profile.toJSON());

})();