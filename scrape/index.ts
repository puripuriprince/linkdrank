import { LinkedInScraper } from "./LinkedInScraper";
import { ProfileConfig, PeopleSearchConfig } from "./Models";

(async () => {
    const config = new ProfileConfig();

    const scraper = new LinkedInScraper();
    await scraper.init();

    const profile = await scraper.getProfile("https://www.linkedin.com/in/amine-arrachid-3468922aa/", config);
    console.log(profile.toJSON());
    const profile2 = await scraper.getProfile("https://www.linkedin.com/in/matthewdukepan/", config);
    console.log(profile2.toJSON());

})();