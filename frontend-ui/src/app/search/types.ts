export type CustomDate = {
    day?: number;
    month?: number;
    year: number;
};

export type ProficiencyLevel =
    | 'NATIVE_OR_BILINGUAL'
    | 'FULL_PROFESSIONAL'
    | 'PROFESSIONAL_WORKING'
    | 'LIMITED_WORKING'
    | 'ELEMENTARY';

export type RelatedProfileTagsSQLParams = {
    // Core profile fields
    headline?: string[];
    summary?: string[];
    firstName?: string[];
    lastName?: string[];

    // Location parameters (location table)
    location?: {
        cities?: string[];
        states?: string[];
        countries?: string[];
    };

    // Industry parameters (industry table)
    industries?: string[];

    // Skills parameters (skill table via user_skill)
    skills?: string[];

    // Education parameters (education/school tables)
    education?: {
        schools?: string[];
        degreeNames?: string[];
        fieldsOfStudy?: string[];
        yearRange?: {
            startYear?: number;
            endYear?: number;
        };
    };

    // Experience parameters (experience/organization tables)
    experience?: {
        organizations?: string[];
        titles?: string[];
        yearRange?: {
            startYear?: number;
            endYear?: number;
        };
        locations?: {
            cities?: string[];
            states?: string[];
            countries?: string[];
        };
    };

    // Certification parameters (certification table)
    certifications?: {
        names?: string[];
        authorities?: string[];
        yearRange?: {
            startYear?: number;
            endYear?: number;
        };
    };

    // Language parameters (language table via user_language)
    languages?: {
        names?: string[];
        proficiencies?: ProficiencyLevel[];
    };

    // Volunteer parameters (volunteer/organization tables)
    volunteer?: {
        organizations?: string[];
        roles?: string[];
        causes?: string[];
        yearRange?: {
            startYear?: number;
            endYear?: number;
        };
    };

    // Publication parameters (publication table)
    publications?: {
        names?: string[];
        publishers?: string[];
        yearRange?: {
            startYear?: number;
            endYear?: number;
        };
    };

    // Award parameters (award table)
    awards?: {
        titles?: string[];
        issuers?: string[];
        yearRange?: {
            startYear?: number;
            endYear?: number;
        };
    };

    // Project parameters (project table)
    projects?: {
        titles?: string[];
        yearRange?: {
            startYear?: number;
            endYear?: number;
        };
    };

    // Metric filters
    metrics?: {
        minConnections?: number;
        maxConnections?: number;
        minFollowers?: number;
        maxFollowers?: number;
    };
};

export type SearchParams = {
    mainQuery: {
        // Profile basic fields
        headline?: string[];
        summary?: string[];
        firstName?: string;
        lastName?: string;

        // Location filters (from location table)
        location?: {
            cities?: string[];
            states?: string[];
            countries?: string[];
        };

        // Industry filter (from industry table)
        industries?: string[];

        // Connection/follower metrics
        minConnections?: number;
        maxConnections?: number;
        minFollowers?: number;
        maxFollowers?: number;

        // Skills filters (from skill table via user_skill junction)
        skills?: string[];

        // Education filters (from education/school tables)
        education?: {
            schools?: string[];
            degreeNames?: string[];
            fieldsOfStudy?: string[];
            startYear?: number;
            endYear?: number;
        };

        // Experience filters (from experience/organization tables)
        experience?: {
            organizations?: string[];
            titles?: string[];
            startYear?: number;
            endYear?: number;
            locationCities?: string[];
            locationStates?: string[];
            locationCountries?: string[];
        };

        // Certification filters (from certification table)
        certifications?: {
            names?: string[];
            authorities?: string[];
            startYear?: number;
            endYear?: number;
        };

        // Language filters (from language table via user_language junction)
        languages?: {
            names?: string[];
            proficiencies?: ProficiencyLevel[];
        };

        // Volunteer work filters (from volunteer/organization tables)
        volunteer?: {
            organizations?: string[];
            roles?: string[];
            causes?: string[];
            startYear?: number;
            endYear?: number;
        };

        // Publication filters (from publication table)
        publications?: {
            names?: string[];
            publishers?: string[];
            pubYear?: number;
        };

        // Award filters (from award table)
        awards?: {
            titles?: string[];
            issuers?: string[];
            awardYear?: number;
        };

        // Project filters (from project table)
        projects?: {
            titles?: string[];
            startYear?: number;
            endYear?: number;
        };
    };

    // Related profiles tags with corresponding SQL parameters
    relatedProfileTags: {
        id: string;
        label: string;
        sqlParams: RelatedProfileTagsSQLParams;
    }[];
};