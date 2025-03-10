import { Page, ElementHandle } from "playwright";
import { Person, PeopleSearchConfig } from "./Models";
import {autoScroll, removeQueryParams} from "./common";

export class PeopleSearch {
    public peopleResults: Person[] = [];
    private page: Page;
    private config: PeopleSearchConfig;

    constructor(page: Page, config: PeopleSearchConfig) {
        this.page = page;
        // Merge provided config with default values.
        this.config = {
            baseUrl: "https://www.linkedin.com/search/results/",
            filters: {},
            ...config,
        };
    }

    async scrapePeople(): Promise<void> {
        const url = this.buildUrl();
        await this.page.goto(url, { waitUntil: "domcontentloaded" });
        await autoScroll(this.page);
        await this.page.waitForTimeout(this.config.waitForTimeout);
        await this.scrapePage(1);
    }

    private buildUrl(): string {
        const { baseUrl, filters } = this.config;
        const searchPath = "people";
        const params: string[] = [];
        if (filters) {
            for (const key in filters) {
                if (filters[key]) {
                    params.push(`${key}=${encodeURIComponent(filters[key]!)}`);
                }
            }
        }
        return params.length > 0
            ? `${baseUrl}${searchPath}?${params.join("&")}`
            : `${baseUrl}${searchPath}`;
    }

    private async scrapePage(currentPage: number): Promise<void> {
        console.log(`Scraping page ${currentPage}...`);
        const mainSelector = "div.search-results-container";
        await this.page.waitForSelector(mainSelector, { timeout: 15000 });
        const cardSelector = "div[data-view-name='search-entity-result-universal-template']";
        const cards = await this.page.$$(cardSelector);

        for (const card of cards) {
            try {
                const person = await this.scrapePersonCard(card);
                this.peopleResults.push(person);
            } catch (error) {
                console.error("Error scraping card:", error);
            }
        }

        if (currentPage < (this.config.pagesToScrape || 1)) {
            try {
                const nextButton = await this.page.waitForSelector("button[aria-label='Next']", { timeout: 5000 });
                if (nextButton && (await nextButton.isEnabled())) {
                    await nextButton.click();
                    await this.page.waitForTimeout(this.config.waitForTimeout);
                    await autoScroll(this.page);
                    await this.scrapePage(currentPage + 1);
                } else {
                    console.log("Next button not enabled or not found. Ending scrape.");
                }
            } catch (error) {
                console.error(`No next button found or error encountered on page ${currentPage}:`, error);
            }
        }
    }

    private async scrapePersonCard(card: ElementHandle<Element>): Promise<Person> {
        const linkElem = await card.$('a[data-test-app-aware-link]');
        if (!linkElem) throw new Error("No link element found on card");
        const rawUrl = (await linkElem.getAttribute("href")) || "";
        const linkedinUrl = removeQueryParams(rawUrl);

        const imgElem = await card.$("img");
        const picture = imgElem ? (await imgElem.getAttribute("src")) || "" : "";

        const nameElem = await card.$('a[data-test-app-aware-link] span[aria-hidden="true"]');
        const name = nameElem ? (await nameElem.textContent())?.trim() || "" : "";

        const container = await card.$("div.mb1");

        let title = "";
        let location = "";
        if (container) {
            const titleElem = await container.$("div.t-14.t-black.t-normal");
            title = titleElem ? (await titleElem.textContent())?.trim() || "" : "";

            const locationElem = await container.$("div.t-14.t-normal:not(.t-black)");
            location = locationElem ? (await locationElem.textContent())?.trim() || "" : "";
        }

        return { linkedinUrl, name, picture, title, location };
    }
}
