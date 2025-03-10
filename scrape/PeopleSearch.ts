import { Page, ElementHandle } from "playwright";
import { Person } from "./PersonSearch";
import { PeopleSearchConfig } from "./PeopleSearchConfig";
import { removeQueryParams } from "./utils";

export class PeopleSearch {
    private page: Page;
    private config: PeopleSearchConfig;
    public peopleResults: Person[] = [];

    constructor(page: Page, config: PeopleSearchConfig = {}) {
        this.page = page;
        // Set default configuration values and merge with any provided config.
        this.config = {
            baseUrl: "https://www.linkedin.com/search/results/",
            pagesToScrape: 100,
            closeOnComplete: false,
            waitForTimeout: 2000,
            filters: {},
            ...config,
        };
    }

    /**
     * Kick off the scraping process.
     */
    async scrapePeople(): Promise<void> {
        const url = this.buildUrl();
        await this.page.goto(url, { waitUntil: "domcontentloaded" });
        await this.scrollToBottom();
        await this.focus();
        await this.page.waitForTimeout(this.config.waitForTimeout || 2000);
        await this.scrapePage(1);

        if (this.config.closeOnComplete) {
            await this.page.context().browser()?.close();
        }
    }

    /**
     * Build the search URL with filters.
     * To add a new filter, simply add a new key/value pair to the filters config.
     */
    buildUrl(): string {
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

    /**
     * Scrape a single search results page.
     */
    async scrapePage(currentPage: number): Promise<void> {
        console.log(`Scraping page ${currentPage}...`);
        // Wait for the main search results container to load.
        // Adjust the selector if LinkedIn changes its layout.
        const mainSelector = "div.search-results-container, ul.search-results__list";
        await this.page.waitForSelector(mainSelector, { timeout: 15000 });

        // Use a selector for the people card; you might need to update this based on the actual DOM.
        const cardSelector = "div[data-view-id='search-entity-result']";
        const cards = await this.page.$$(cardSelector);

        for (const card of cards) {
            try {
                const person = await this.scrapePersonCard(card);
                this.peopleResults.push(person);
            } catch (error) {
                console.error("Error scraping card:", error);
            }
        }

        // Check if we should proceed to the next page.
        if (currentPage < (this.config.pagesToScrape || 1)) {
            try {
                const nextButton = await this.page.waitForSelector("button[aria-label='Next']", { timeout: 5000 });
                if (nextButton && (await nextButton.isEnabled())) {
                    await nextButton.click();
                    await this.page.waitForTimeout(this.config.waitForTimeout || 2000);
                    await this.focus();
                    await this.scrollToBottom();
                    await this.scrapePage(currentPage + 1);
                } else {
                    console.log("Next button not enabled or not found. Ending scrape.");
                }
            } catch (error) {
                console.error(`No next button found or error encountered on page ${currentPage}:`, error);
            }
        }
    }

    /**
     * Scrape an individual person card.
     * Adjust the selectors based on the current LinkedIn DOM.
     */
    async scrapePersonCard(card: ElementHandle<Element>): Promise<Person> {
        // Get the profile link element.
        const linkElem = await card.$("a");
        if (!linkElem) throw new Error("No link element found on card");
        const linkedinUrlRaw = (await linkElem.getAttribute("href")) || "";
        const linkedinUrl = removeQueryParams(linkedinUrlRaw);

        // Get the image (if any).
        const logoElem = await card.$("img");
        const picture = logoElem ? (await logoElem.getAttribute("src")) || "" : "";

        // Extract name, title, and location.
        const nameElem = await card.$("span.actor-name, span.entity-result__title-text");
        const name = nameElem ? (await nameElem.textContent())?.trim() || "" : "";

        const titleElem = await card.$("div.entity-result__primary-subtitle");
        const title = titleElem ? (await titleElem.textContent())?.trim() || "" : "";

        const locationElem = await card.$("div.entity-result__secondary-subtitle");
        const location = locationElem ? (await locationElem.textContent())?.trim() || "" : "";

        return { linkedinUrl, name, picture, title, location };
    }

    async scrollToBottom(): Promise<void> {
        await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    }

    async focus(): Promise<void> {
        await this.page.evaluate(() => document.body.focus());
    }

    /**
     * Return the results as a JSON string.
     */
    toJSON(indent = 2): string {
        return JSON.stringify(this.peopleResults, null, indent);
    }
}
