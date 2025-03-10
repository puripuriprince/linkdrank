import { chromium, Page } from "playwright";
import { LoginManager } from "./LoginManager";
import { PersonProfile, ProfileConfig, PeopleSearchConfig } from "./Models";
import { PeopleSearch } from "./PeopleSearch";
import * as dotenv from "dotenv";
import {PersonProfileScraper} from "./PeopleProfile";

dotenv.config();

export class LinkedInScraper {
    private page!: Page;

    async init(): Promise<void> {
        console.log("Initializing LinkedInScraper...");
        const browser = await chromium.launch({headless: false});
        const context = await browser.newContext();
        this.page = await context.newPage();
        const loginManager = new LoginManager(this.page);
        await loginManager.login(
            process.env.LINKEDIN_USER!,
            process.env.LINKEDIN_PASSWORD!
        );
    }

    async searchPeople(searchConfig: PeopleSearchConfig): Promise<any[]> {
        const peopleSearch = new PeopleSearch(this.page, searchConfig);
        await peopleSearch.scrapePeople();
        return peopleSearch.peopleResults;
    }

    async getProfile(url: string, searchConfig: ProfileConfig): Promise<PersonProfile> {
        const person = new PersonProfileScraper(this.page, searchConfig);
        return await person.scrapeProfile(url);
    }
}