// utils.ts
/**
 * Remove query parameters from a URL.
 */
export function removeQueryParams(url: string): string {
    try {
        const parsed = new URL(url);
        return parsed.origin + parsed.pathname;
    } catch (error) {
        return url;
    }
}

/**
 * A helper function to extract the image link from an element.
 * (You may need to adjust this based on the LinkedIn DOM structure.)
 */
export async function getImgLink(element: any): Promise<string> {
    return (await element.getAttribute("src")) || "";
}
