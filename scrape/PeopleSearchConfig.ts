// PeopleSearchConfig.ts
export interface PeopleSearchConfig {
    baseUrl?: string;         // Base URL for LinkedIn search
    pagesToScrape?: number;   // Maximum number of pages to scrape
    closeOnComplete?: boolean;// Whether to close the browser after scraping
    waitForTimeout?: number;  // Timeout between actions (in milliseconds)
    filters?: {               // Filters for the search query – add new filters by adding a new key/value here.
        [key: string]: string | undefined;
    };
}
