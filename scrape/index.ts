import { LinkedInScraper } from "./LinkedInScraper";
import { ScraperConfig } from "./ScraperConfig";
import {chromium} from "playwright";
import {PeopleSearchConfig} from "./PeopleSearchConfig";
import {PeopleSearch} from "./PeopleSearch";

(async () => {
    const config = new ScraperConfig();

    const scraper = new LinkedInScraper(config);
    await scraper.init();

    const profile = await scraper.scrapeProfile("https://www.linkedin.com/in/abinaya-ramanathan/");
    console.log(profile.toJSON());
})();

(async () => {
    // Launch the browser.
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    // Define search configuration with filters.
    const config: PeopleSearchConfig = {
        filters: {
            keywords: "Software Engineer",
            currentCompany: "1441",
            schoolFilter: "163191",
        },
        pagesToScrape: 5,
        closeOnComplete: true,
        waitForTimeout: 3000,
    };
    // Create and run the PeopleSearch.
    const peopleSearch = new PeopleSearch(page, config);
    await peopleSearch.scrapePeople();
    console.log(peopleSearch.toJSON());
})();