// Types for profile components that match database schema
export interface ProfileForComponents {
  id: number;
  linkedinId: string;
  firstName: string;
  lastName: string;
  headline: string | null;
  summary: string | null;
  profilePictureUrl: string | null;
  backgroundImageUrl: string | null;
  connectionsCount: number | null;
  followersCount: number | null;
  location?: LocationForComponents | null;
  industry?: IndustryForComponents | null;
  experiences: ExperienceForComponents[];
  educations: EducationForComponents[];
  projects: ProjectForComponents[];
  awards: AwardForComponents[];
  certifications: CertificationForComponents[];
  skills: SkillForComponents[];
  languages: LanguageForComponents[];
  volunteers: VolunteerForComponents[];
  publications: PublicationForComponents[];
}

export interface LocationForComponents {
  id: number;
  city: string | null;
  state: string | null;
  country: string | null;
}

export interface IndustryForComponents {
  id: number;
  name: string;
}

export interface ExperienceForComponents {
  id: number;
  userId: number;
  title: string | null;
  description: string | null;
  startDate: CustomDate | null;
  endDate: CustomDate | null;
  organization: OrganizationForComponents;
  location?: LocationForComponents | null;
}

export interface EducationForComponents {
  id: number;
  userId: number;
  description: string | null;
  startDate: CustomDate | null;
  endDate: CustomDate | null;
  degreeName: string | null;
  fieldOfStudy: string | null;
  school: SchoolForComponents;
}

export interface ProjectForComponents {
  id: number;
  userId: number;
  title: string;
  description: string | null;
  startDate: CustomDate | null;
  endDate: CustomDate | null;
}

export interface AwardForComponents {
  id: number;
  userId: number;
  title: string;
  description: string | null;
  awardDate: CustomDate | null;
  issuer: string | null;
}

export interface CertificationForComponents {
  id: number;
  userId: number;
  name: string;
  authority: string | null;
  displaySource: string | null;
  licenseNumber: string | null;
  url: string | null;
  startDate: CustomDate | null;
  endDate: CustomDate | null;
}

export interface SkillForComponents {
  userId: number;
  skillId: number;
  skill: {
    id: number;
    name: string;
  };
}

export interface LanguageForComponents {
  userId: number;
  languageId: number;
  language: {
    id: number;
    name: string;
  };
}

export interface VolunteerForComponents {
  id: number;
  userId: number;
  role: string | null;
  description: string | null;
  startDate: CustomDate | null;
  endDate: CustomDate | null;
  organization: OrganizationForComponents;
}

export interface PublicationForComponents {
  id: number;
  userId: number;
  name: string;
  pubDate: CustomDate | null;
  publisher: string | null;
  url: string | null;
}

export interface OrganizationForComponents {
  id: number;
  name: string;
  logoUrl: string | null;
  linkedinUrl: string | null;
}

export interface SchoolForComponents {
  id: number;
  name: string;
  logoUrl: string | null;
}

export interface CustomDate {
  year: number;
  month?: number;
} 