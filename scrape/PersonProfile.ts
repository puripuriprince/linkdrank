export class PersonProfile {
    name: string = "";
    title: string = "";
    location: string = "";
    picture: string = "";
    about: string = "";
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
            experiences: this.experiences.map(exp => ({ ...exp })),
            educations: this.educations.map(edu => ({ ...edu })),
            projects: this.projects.map(proj => ({ ...proj })),
            received: this.recommendations.received.map(rec => ({ ...rec })),
                given: this.recommendations.given.map(rec => ({ ...rec })),
            honors: this.honors.map(hon => ({ ...hon }))
        };
    }
}
