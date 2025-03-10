import { chromium, Page } from "playwright";
import { LoginManager } from "./LoginManager";
import { PersonProfile } from "./PersonProfile";
import { ScraperConfig } from "./ScraperConfig";
import * as dotenv from "dotenv";

dotenv.config();

export class LinkedInScraper {
    private page!: Page;

    constructor(private config: ScraperConfig) {}

    async init() {
        console.log("Initializing LinkedInScraper...");
        const browser = await chromium.launch({ headless: false });
        const context = await browser.newContext();
        this.page = await context.newPage();
        const loginManager = new LoginManager(this.page);
        await loginManager.login(
            process.env.LINKEDIN_USER!,
            process.env.LINKEDIN_PASSWORD!
        );
    }

    async scrapeProfile(url: string): Promise<PersonProfile> {
        console.log(`Scraping profile: ${url}`);
        await this.page.goto(url, { waitUntil: "domcontentloaded" });
        await this.page.waitForSelector("h1", { timeout: 10000 });
        await this.autoScroll();
        await this.page.waitForTimeout(1000);

        const profile = new PersonProfile();

        if (this.config.scrapeName)
            profile.name = await this.extractText("h1");
        if (this.config.scrapeTitle)
            profile.title = await this.extractText(".text-body-medium.break-words");
        if (this.config.scrapeLocation)
            profile.location = await this.extractText(
                ".text-body-small.inline.t-black--light"
            );
        if (this.config.scrapePicture)
            profile.picture =
                (await this.extractAttribute(".pv-top-card__photo img", "src")) ||
                (await this.extractAttribute(".display-flex img", "src"));
        if (this.config.scrapeAbout)
            profile.about = await this.extractAbout();
        if (this.config.scrapeExperience) {
            profile.experiences = await this.extractExperienceFromDetails(url);
            console.log("Experience extraction complete.");
        }
        if (this.config.scrapeEducation) {
            profile.educations = await this.extractEducationFromDetails(url);
            console.log("Education extraction complete.");
        }
        if (this.config.scrapeProjects) {
            profile.projects = await this.extractProjectsFromDetails(url);
            console.log("Projects extraction complete.");
        }
        if (this.config.scrapeRecommendations) {
            profile.recommendations = await this.extractRecommendationsFromDetails(url);
            console.log("Recommendations extraction complete.");
        }
        if (this.config.scrapeHonors) {
            profile.honors = await this.extractHonorsFromDetails(url);
            console.log("Honors extraction complete.");
        }
        return profile;
    }

    // Generic text extraction with a timeout.
    private async extractText(selector: string): Promise<string> {
        try {
            await this.page.waitForSelector(selector, { timeout: 5000 });
            const element = await this.page.$(selector);
            return element ? (await element.textContent())?.trim() || "" : "";
        } catch {
            return "";
        }
    }

    private async extractAttribute(selector: string, attr: string): Promise<string> {
        try {
            await this.page.waitForSelector(selector, { timeout: 5000 });
            const element = await this.page.$(selector);
            return element ? (await element.getAttribute(attr)) || "" : "";
        } catch {
            return "";
        }
    }

    // A helper to perform auto-scrolling.
    private async autoScroll(maxScrolls = 20) {
        await this.page.evaluate(async (maxScrolls) => {
            await new Promise<void>((resolve) => {
                let scrollCount = 0;
                const distance = 300;
                const delay = 100;
                const timer = setInterval(() => {
                    window.scrollBy(0, distance);
                    scrollCount++;
                    if (scrollCount >= maxScrolls) {
                        clearInterval(timer);
                        resolve();
                    }
                }, delay);
            });
        }, maxScrolls);
    }

    // Click all "See more" buttons on the page.
    private async clickSeeMoreButtons() {
        const buttons = await this.page.$$("button:has-text('See more')");
        for (const button of buttons) {
            try {
                await button.click();
                await this.page.waitForTimeout(1000);
            } catch (e) {
                console.log("Failed to click 'See more' button:", e);
            }
        }
    }

    // A helper to extract and deduplicate text inside the browser context.
    private static deduplicateScript = `
    (s) => {
      if (!s) return "";
      s = s.trim();
      const mid = Math.floor(s.length / 2);
      return (s.slice(0, mid) === s.slice(mid)) ? s.slice(0, mid).trim() : s;
    }
  `;

    // -------------------------
    // EXPERIENCE EXTRACTION
    // -------------------------
    private async extractExperienceFromDetails(baseUrl: string): Promise<any[]> {
        const normalized = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
        const detailsUrl = `${normalized}/details/experience/`;
        console.log(`Navigating to Experience Details: ${detailsUrl}`);
        try {
            await this.page.goto(detailsUrl, { waitUntil: "domcontentloaded", timeout: 30000 });
            await this.page.waitForSelector(".pvs-list__container", { timeout: 15000 });
        } catch (e) {
            console.log("Experience extraction error:", e);
            return [];
        }
        await this.autoScroll();
        await this.page.waitForTimeout(2000);
        await this.clickSeeMoreButtons();

        return await this.page.evaluate(
            (dedupFunc: string) => {
                const deduplicate = eval(dedupFunc);
                function parseDelimited(text: string) {
                    const parts = text.split("·").map(p => p.trim());
                    return { first: parts[0] || "", second: parts[1] || "" };
                }
                function parseDateInfo(text: string) {
                    const parts = text.split("·").map(p => p.trim());
                    let dateRange = parts[0] || "";
                    let duration = parts[1] || "";
                    let startDate = "", endDate = "";
                    if (dateRange.includes(" - ")) {
                        [startDate, endDate] = dateRange.split(" - ").map(s => s.trim());
                    }
                    return { startDate, endDate, duration };
                }
                const items = document.querySelectorAll("li.pvs-list__paged-list-item");
                const experiences: any[] = [];
                items.forEach(item => {
                    const spans = Array.from(item.querySelectorAll("span[aria-hidden='true']"));
                    let title = "", companyRaw = "", dateText = "", locationRaw = "";
                    if (spans.length >= 4) {
                        title = deduplicate(spans[0].textContent);
                        companyRaw = deduplicate(spans[1].textContent);
                        dateText = deduplicate(spans[2].textContent);
                        locationRaw = deduplicate(spans[3].textContent);
                    } else if (spans.length === 3) {
                        title = deduplicate(spans[0].textContent);
                        companyRaw = deduplicate(spans[1].textContent);
                        dateText = deduplicate(spans[2].textContent);
                    } else if (spans.length === 2) {
                        title = deduplicate(spans[0].textContent);
                        companyRaw = deduplicate(spans[1].textContent);
                    }
                    let company = companyRaw, contractType = "";
                    if (companyRaw.includes("·")) {
                        const parsed = parseDelimited(companyRaw);
                        company = parsed.first;
                        contractType = parsed.second;
                    }
                    let location = locationRaw, workMode = "";
                    if (locationRaw && locationRaw.includes("·")) {
                        const parsed = parseDelimited(locationRaw);
                        location = parsed.first;
                        workMode = parsed.second;
                    }
                    const { startDate, endDate, duration } = parseDateInfo(dateText);
                    const logoElem = item.querySelector("img");
                    const logo = logoElem ? logoElem.getAttribute("src") || "" : "";
                    experiences.push({ title, company, contractType, location, workMode, startDate, endDate, duration, logo });
                });
                return experiences;
            },
            LinkedInScraper.deduplicateScript
        );
    }

    // -------------------------
    // EDUCATION EXTRACTION
    // -------------------------
    private async extractEducationFromDetails(baseUrl: string): Promise<any[]> {
        const normalized = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
        const detailsUrl = `${normalized}/details/education/`;
        console.log(`Navigating to Education Details: ${detailsUrl}`);
        try {
            await this.page.goto(detailsUrl, { waitUntil: "domcontentloaded", timeout: 30000 });
            await this.page.waitForSelector(".pvs-list__container", { timeout: 15000 });
        } catch (e) {
            console.log("Education extraction error:", e);
            return [];
        }
        await this.autoScroll();
        await this.page.waitForTimeout(2000);
        await this.clickSeeMoreButtons();

        return await this.page.evaluate(
            (dedupFunc: string) => {
                const deduplicate = eval(dedupFunc);
                function parseYears(text: string) {
                    const parts = text.split(" - ").map(s => s.trim());
                    return { startYear: parts[0] || "", endYear: parts[1] || "" };
                }
                const items = document.querySelectorAll("li.pvs-list__paged-list-item");
                const educations: any[] = [];
                items.forEach(item => {
                    const spans = Array.from(item.querySelectorAll("span[aria-hidden='true']"));
                    let school = "", degree = "", yearText = "";
                    if (spans.length >= 3) {
                        school = deduplicate(spans[0].textContent);
                        degree = deduplicate(spans[1].textContent);
                        yearText = deduplicate(spans[2].textContent);
                    } else if (spans.length === 2) {
                        school = deduplicate(spans[0].textContent);
                        degree = deduplicate(spans[1].textContent);
                    }
                    const yearInfo = parseYears(yearText);
                    const logoElem = item.querySelector("img");
                    const logo = logoElem ? logoElem.getAttribute("src") || "" : "";
                    educations.push({ school, degree, logo, ...yearInfo });
                });
                return educations;
            },
            LinkedInScraper.deduplicateScript
        );
    }

    // -------------------------
    // PROJECTS EXTRACTION
    // -------------------------
    private async extractProjectsFromDetails(baseUrl: string): Promise<any[]> {
        const normalized = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
        const detailsUrl = `${normalized}/details/projects/`;
        console.log(`Navigating to Projects Details: ${detailsUrl}`);
        try {
            await this.page.goto(detailsUrl, { waitUntil: "domcontentloaded", timeout: 30000 });
            await this.page.waitForSelector(".pvs-list__container", { timeout: 15000 });
        } catch (e) {
            console.log("Projects extraction error:", e);
            return [];
        }
        await this.autoScroll();
        await this.page.waitForTimeout(2000);
        await this.clickSeeMoreButtons();
        return await this.page.evaluate(
            (dedupFunc: string) => {
                const deduplicate = eval(dedupFunc);
                function parseProjectDuration(text: string) {
                    const trimmed = text.trim();
                    if (trimmed.includes(" - ")) {
                        const parts = trimmed.split(" - ").map(s => s.trim());
                        return { startDate: parts[0] || "", endDate: parts[1] || "" };
                    }
                    return { startDate: trimmed, endDate: "" };
                }
                const items = document.querySelectorAll("li.pvs-list__paged-list-item");
                const projects: any[] = [];
                items.forEach(item => {
                    const titleElem = item.querySelector("div.t-bold");
                    const durationElem = item.querySelector("span.t-14.t-normal");
                    const descElem = item.querySelector("div.t-14.t-normal.t-black");
                    const title = titleElem ? deduplicate(titleElem.textContent) : "";
                    const rawDuration = durationElem ? deduplicate(durationElem.textContent) : "";
                    const { startDate, endDate } = parseProjectDuration(rawDuration);
                    const description = descElem ? deduplicate(descElem.textContent) : "";
                    const logoElem = item.querySelector("img");
                    const logo = logoElem ? logoElem.getAttribute("src") || "" : "";
                    if (title || startDate || endDate || description || logo) {
                        projects.push({ title, startDate, endDate, description, logo });
                    }
                });
                return projects;
            },
            LinkedInScraper.deduplicateScript
        );
    }

    // -------------------------
    // RECOMMENDATIONS EXTRACTION
    // -------------------------
    private async extractRecommendationsFromDetails(baseUrl: string): Promise<{ received: any[]; given: any[] }> {
        const normalized = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
        const detailsUrl = `${normalized}/details/recommendations/`;
        console.log(`Navigating to Recommendations Details: ${detailsUrl}`);
        try {
            await this.page.goto(detailsUrl, { waitUntil: "domcontentloaded", timeout: 30000 });
            await this.page.waitForSelector(".pvs-list__container", { timeout: 15000 });
        } catch (e) {
            console.log("Recommendations extraction error:", e);
            return { received: [], given: [] };
        }
        await this.autoScroll();
        await this.page.waitForTimeout(2000);
        await this.clickSeeMoreButtons();

        // A helper function to extract a list of recommendations from the active tab.
        const extractRecs = async (): Promise<any[]> => {
            return await this.page.evaluate((dedupFunc: string) => {
                const deduplicate = eval(dedupFunc);
                const recs: any[] = [];
                const items = document.querySelectorAll("li.pvs-list__paged-list-item");
                items.forEach(item => {
                    // Extract recommender name.
                    const nameElem = item.querySelector("div.t-bold");
                    const name = nameElem ? deduplicate(nameElem.textContent) : "";
                    // Extract recommender picture.
                    const pictureElem = item.querySelector("a.optional-action-target-wrapper img");
                    const picture = pictureElem ? pictureElem.getAttribute("src") || "" : "";
                    // Extract recommender title (e.g. job title or school role).
                    const titleElem = item.querySelector("span.t-14:not(.t-black--light)");
                    const title = titleElem ? deduplicate(titleElem.textContent) : "";
                    // Extract connection info (like "· 1st").
                    const connectionElem = item.querySelector("span.pvs-entity__supplementary-info");
                    const connection = connectionElem ? deduplicate(connectionElem.textContent) : "";
                    // Extract caption wrapper which contains date and additional relationship details.
                    let date = "", relationship = "";
                    const captionElem = item.querySelector("span.pvs-entity__caption-wrapper");
                    if (captionElem) {
                        const captionText = deduplicate(captionElem.textContent);
                        const parts = captionText.split(",");
                        date = parts[0] && parts[1] ? `${parts[0].trim()}, ${parts[1].trim()}`  : "";
                        relationship = parts.slice(2).join(",").trim();
                    }
                    // Extract recommendation text.
                    const textElem = item.querySelector("div.t-14.t-normal.t-black");
                    const text = textElem ? deduplicate(textElem.textContent) : "";
                    if (name || text) {
                        recs.push({ name, picture, title, date, relationship, text });
                    }
                });
                return recs;
            }, LinkedInScraper.deduplicateScript);
        };

        // Extract recommendations from the "Received" tab.
        const received = await extractRecs();

        // Switch to the "Given" tab and extract those recommendations.
        try {
            await this.page.click("button:has-text('Given')");
            await this.page.waitForTimeout(2000);
        } catch (e) {
            console.log("Could not switch to Given recommendations:", e);
        }
        const given = await extractRecs();

        return { received, given };
    }

    // -------------------------
    // ABOUT EXTRACTION (with deduplication)
    // -------------------------
    private async extractAbout(): Promise<string> {
        return await this.page.evaluate((dedupFunc: string) => {
            const deduplicate = eval(dedupFunc);
            const aboutElem = document.getElementById("about");
            if (aboutElem) {
                const parent = aboutElem.parentElement;
                if (parent) {
                    const flexElem = parent.querySelector(".display-flex");
                    if (flexElem)
                        return deduplicate(flexElem.textContent);
                }
            }
            return "";
        }, LinkedInScraper.deduplicateScript);
    }

    // -------------------------
    // HONORS EXTRACTION (filtering out empty items)
    // -------------------------
    private async extractHonorsFromDetails(baseUrl: string): Promise<any[]> {
        const normalized = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
        const detailsUrl = `${normalized}/details/honors/`;
        console.log(`Navigating to Honors Details: ${detailsUrl}`);
        try {
            await this.page.goto(detailsUrl, { waitUntil: "domcontentloaded", timeout: 30000 });
            await this.page.waitForSelector(".pvs-list__container", { timeout: 15000 });
        } catch (e) {
            console.log("Honors extraction error:", e);
            return [];
        }
        await this.autoScroll();
        await this.page.waitForTimeout(2000);
        await this.clickSeeMoreButtons();
        return await this.page.evaluate((dedupFunc: string) => {
            const deduplicate = eval(dedupFunc);
            const items = document.querySelectorAll("li.pvs-list__paged-list-item");
            const honors: any[] = [];
            items.forEach(item => {
                const titleElem = item.querySelector("div.t-bold");
                const detailElem = item.querySelector("span.t-14.t-normal");
                const title = titleElem ? deduplicate(titleElem.textContent) : "";
                const details = detailElem ? deduplicate(detailElem.textContent) : "";
                const logoElem = item.querySelector("img");
                const logo = logoElem ? logoElem.getAttribute("src") || "" : "";
                if (title || details || logo) {
                    honors.push({ title, details, logo });
                }
            });
            return honors;
        }, LinkedInScraper.deduplicateScript);
    }
}