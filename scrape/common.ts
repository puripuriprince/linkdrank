import { Page } from "playwright";

export async function autoScroll(page: Page, maxScrolls: number = 20): Promise<void> {
    await page.evaluate(async (maxScrolls) => {
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

export function removeQueryParams(url: string): string {
    try {
        const parsed = new URL(url);
        return parsed.origin + parsed.pathname;
    } catch (error) {
        return url;
    }
}