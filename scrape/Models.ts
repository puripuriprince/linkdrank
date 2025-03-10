export interface Person {
    linkedinUrl: string;
    name: string;
    picture: string;
    location: string;
    title: string;
}

export interface PeopleSearchConfig {
    baseUrl?: string;         // Base URL for LinkedIn search
    pagesToScrape?: number;   // Maximum number of pages to scrape
    waitForTimeout: number;  // Timeout between actions (in milliseconds)
    filters?: {               // Filters for the search query – add new filters by adding a new key/value here.
        [key: string]: string | undefined;
    };
}

export class PersonProfile {
    name: string = "";
    title: string = "";
    location: string = "";
    picture: string = "";
    about: string = "";
    linkedinUrl: string = "";
    experiences: any[] = [];
    educations: any[] = [];
    projects: any[] = [];
    recommendations: { received: any[]; given: any[] } = { received: [], given: [] };
    honors: any[] = [];
    toJSON() {
        return {
            name: this.name,
            title: this.title,
            location: this.location,
            picture: this.picture,
            about: this.about,
            linkedinUrl: this.linkedinUrl,
            experiences: this.experiences.map(exp => ({ ...exp })),
            educations: this.educations.map(edu => ({ ...edu })),
            projects: this.projects.map(proj => ({ ...proj })),
            RecReceived: this.recommendations.received.map(rec => ({ ...rec })),
            RecGiven: this.recommendations.given.map(rec => ({ ...rec })),
            honors: this.honors.map(hon => ({ ...hon }))
        };
    }
}

export class ProfileConfig {
    scrapeName: boolean = true;
    scrapeTitle: boolean = true;
    scrapeLocation: boolean = true;
    scrapeAbout: boolean = true;
    scrapePicture: boolean = true;
    scrapeExperience: boolean = true;
    scrapeEducation: boolean = true;
    scrapeProjects: boolean = true;
    scrapeRecommendations: boolean = true;
    scrapeHonors: boolean = true;
}