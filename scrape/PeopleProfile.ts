import { Page } from "playwright";
import { PersonProfile, ProfileConfig } from "./Models";
import {autoScroll, removeQueryParams} from "./common";

export class PersonProfileScraper {
    private readonly page: Page;

    constructor(page: Page, private config: ProfileConfig) {
        this.page = page;
    }

    async scrapeProfile(url: string): Promise<PersonProfile> {
        console.log(`Scraping profile: ${url}`);
        await this.page.goto(url, { waitUntil: "domcontentloaded" });
        await this.page.waitForSelector("h1", { timeout: 10000 });
        await autoScroll(this.page);
        await this.page.waitForTimeout(1000);

        const profile = new PersonProfile();

        profile.linkedinUrl = removeQueryParams(url);

        if (this.config.scrapeName)
            profile.name = await this.extractText("h1");
        if (this.config.scrapeTitle)
            profile.title = await this.extractText(".text-body-medium.break-words");
        if (this.config.scrapeLocation)
            profile.location = await this.extractText(".text-body-small.inline.t-black--light");
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

    // --- Helper Methods ---

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

    private async clickSeeMoreButtons(): Promise<void> {
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

    private static deduplicateScript = `
    (s) => {
      if (!s) return "";
      s = s.trim();
      const mid = Math.floor(s.length / 2);
      return (s.slice(0, mid) === s.slice(mid)) ? s.slice(0, mid).trim() : s;
    }
  `;

    // --- Extraction Methods for Experience, Education, Projects, etc. ---

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
        await autoScroll(this.page);
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

                const items = document.querySelectorAll(".scaffold-finite-scroll__content > ul > li.pvs-list__paged-list-item:not(li li)")
                const experiences: any[] = [];
                items.forEach(item => {

                    const isNested = item.querySelector("li.pvs-list__paged-list-item");

                    if (isNested) {
                        const nestedContainer = item.querySelector("ul")
                        const companyLogoElem = item.querySelector("img");
                        const companyLogo = companyLogoElem ? companyLogoElem.getAttribute("src") || "" : "";

                        const companyInfoSpan = item.querySelector("span[aria-hidden='true']");
                        const companyName = companyInfoSpan ? deduplicate(companyInfoSpan.textContent) : "";

                        const roleItems = nestedContainer?.querySelectorAll("li.pvs-list__paged-list-item");
                        roleItems?.forEach(roleItem => {
                            const roleSpans = Array.from(roleItem.querySelectorAll("span[aria-hidden='true']"));
                            let title = "", employmentType = "", dateText = "", location = "";
                            if (roleSpans.length >= 3) {
                                title = deduplicate(roleSpans[0].textContent);
                                employmentType = deduplicate(roleSpans[1].textContent);
                                dateText = deduplicate(roleSpans[2].textContent);
                                if (roleSpans.length >= 4) {
                                    location = deduplicate(roleSpans[3].textContent);
                                }
                            }
                            const { startDate, endDate, duration } = parseDateInfo(dateText);
                            experiences.push({
                                title,
                                companyName,
                                employmentType,
                                location,
                                workMode: "",
                                startDate,
                                endDate,
                                duration,
                                companyLogo
                            });
                        });
                    } else {
                        // No nested roles
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
                        let companyName = companyRaw, employmentType = "";
                        if (companyRaw.includes("·")) {
                            const parsed = parseDelimited(companyRaw);
                            companyName = parsed.first;
                            employmentType = parsed.second;
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
                        experiences.push({
                            title,
                            companyName,
                            employmentType,
                            location,
                            workMode,
                            startDate,
                            endDate,
                            duration,
                            logo
                        });
                    }
                });

                return experiences;
            },
            PersonProfileScraper.deduplicateScript
        );
    }

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
        await autoScroll(this.page);
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
                    const companyLogo = logoElem ? logoElem.getAttribute("src") || "" : "";
                    educations.push({ school, degree, companyLogo, ...yearInfo });
                });
                return educations;
            },
            PersonProfileScraper.deduplicateScript
        );
    }

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
        await autoScroll(this.page);
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
            PersonProfileScraper.deduplicateScript
        );
    }

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
        await autoScroll(this.page);
        await this.page.waitForTimeout(2000);
        await this.clickSeeMoreButtons();

        const extractRecs = async (): Promise<any[]> => {
            return await this.page.evaluate((dedupFunc: string) => {
                const deduplicate = eval(dedupFunc);
                const recs: any[] = [];
                const items = document.querySelectorAll("li.pvs-list__paged-list-item");
                items.forEach(item => {
                    const nameElem = item.querySelector("div.t-bold");
                    const name = nameElem ? deduplicate(nameElem.textContent) : "";
                    const pictureElem = item.querySelector("a.optional-action-target-wrapper img");
                    const picture = pictureElem ? pictureElem.getAttribute("src") || "" : "";
                    const titleElem = item.querySelector("span.t-14:not(.t-black--light)");
                    const title = titleElem ? deduplicate(titleElem.textContent) : "";
                    const connectionElem = item.querySelector("span.pvs-entity__supplementary-info");
                    const connection = connectionElem ? deduplicate(connectionElem.textContent) : "";
                    let date = "", relationship = "";
                    const captionElem = item.querySelector("span.pvs-entity__caption-wrapper");
                    if (captionElem) {
                        const captionText = deduplicate(captionElem.textContent);
                        const parts = captionText.split(",");
                        date = parts[0] && parts[1] ? `${parts[0].trim()}, ${parts[1].trim()}` : "";
                        relationship = parts.slice(2).join(",").trim();
                    }
                    const textElem = item.querySelector("div.t-14.t-normal.t-black");
                    const text = textElem ? deduplicate(textElem.textContent) : "";
                    if (name || text) {
                        recs.push({ name, picture, title, date, relationship, text });
                    }
                });
                return recs;
            }, PersonProfileScraper.deduplicateScript);
        };

        const received = await extractRecs();

        try {
            await this.page.click("button:has-text('Given')");
            await this.page.waitForTimeout(2000);
        } catch (e) {
            console.log("Could not switch to Given recommendations:", e);
        }
        const given = await extractRecs();

        return { received, given };
    }

    private async extractAbout(): Promise<string> {
        return await this.page.evaluate((dedupFunc: string) => {
            const deduplicate = eval(dedupFunc);
            const aboutElem = document.getElementById("about");
            if (aboutElem) {
                const parent = aboutElem.parentElement;
                if (parent) {
                    const flexElem = parent.querySelector(".display-flex");
                    if (flexElem) return deduplicate(flexElem.textContent);
                }
            }
            return "";
        }, PersonProfileScraper.deduplicateScript);
    }

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
        await autoScroll(this.page);
        await this.page.waitForTimeout(2000);
        await this.clickSeeMoreButtons();
        return await this.page.evaluate((dedupFunc: string) => {
            const deduplicate = eval(dedupFunc);

            function parseDelimited(text: string) {
                const parts = text.split("·").map(p => p.trim());
                return { first: parts[0] || "", second: parts[1] || "" };
            }

            const items = document.querySelectorAll("li.pvs-list__paged-list-item");
            const honors: any[] = [];
            items.forEach(item => {
                const titleElem = item.querySelector("div.t-bold");
                const detailElem = item.querySelector("span.t-14.t-normal");
                const title = titleElem ? deduplicate(titleElem.textContent) : "";
                const details = parseDelimited(detailElem ? deduplicate(detailElem.textContent) : "");
                const issuer =  details.first;
                const date = details.second;
                const logoElem = item.querySelector("img");
                const logo = logoElem ? logoElem.getAttribute("src") || "" : "";
                if (title || details || logo) {
                    honors.push({ title, issuer, date, logo });
                }
            });
            return honors;
        }, PersonProfileScraper.deduplicateScript);
    }
}
