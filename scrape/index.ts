import { LinkedInScraper } from "./LinkedInScraper";
import { ProfileConfig, PeopleSearchConfig } from "./Models";

(async () => {
    const config = new ProfileConfig();
    const config2: PeopleSearchConfig = {
        filters: {
            keywords: "Software Engineer",
            currentCompany: "1337",
            schoolFilter: "163191",
            origin: 'GLOBAL_SEARCH_HEADER',
        },
        pagesToScrape: 3,
        waitForTimeout: 3000,
    };

    const scraper = new LinkedInScraper();
    await scraper.init();

    const profile = await scraper.getProfile("https://www.linkedin.com/in/gwladys-djuikom-6a4770179", config);
    console.log(profile.toJSON());

    const peopleSearch = await scraper.searchPeople(config2);
    console.log(peopleSearch);
})();