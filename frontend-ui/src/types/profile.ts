// Types for profile data structures based on Drizzle schema

// Re-export all Drizzle-generated types
export type {
  Profile,
  Location,
  Industry,
  School,
  Organization,
  Education,
  Experience,
  Certification,
  Skill,
  UserSkill,
  Language,
  UserLanguage,
  Volunteer,
  Publication,
  Award,
  Project,
  ProfileWithRelations,
  NewProfile,
  NewLocation,
  NewEducation,
  NewExperience,
  NewCertification,
  NewSkill,
  NewUserSkill,
  NewLanguage,
  NewUserLanguage,
  NewVolunteer,
  NewPublication,
  NewAward,
  NewProject
} from '@/lib/db/types';

export interface ProfileLocation {
  city: string;
  state?: string;
  country: string;
}

export interface ProfileExperience {
  title: string;
  companyName: string;
  organizationName: string;
  employmentType: string;
  location: string;
  workMode: string;
  startDate: string;
  endDate: string;
  duration: string;
  description: string;
  logo: string;
  logoUrl: string;
}

export interface ProfileEducation {
  school: string;
  schoolName: string;
  degree: string;
  degreeName: string;
  fieldOfStudy: string;
  companyLogo: string;
  logoUrl: string;
  startYear: string;
  endYear: string;
  description?: string;
}

export interface ProfileProject {
  title: string;
  startDate: string;
  endDate: string;
  description: string;
  logo: string;
}

export interface ProfileHonor {
  title: string;
  issuer: string;
  date: string;
  description: string;
  logo: string;
}

export interface ProfileCertification {
  name: string;
  authority: string;
  displaySource: string;
  licenseNumber: string;
  url: string;
  startDate: string;
  endDate: string;
}

export interface ProfileLanguage {
  name: string;
  proficiency: 'NATIVE_OR_BILINGUAL' | 'FULL_PROFESSIONAL' | 'PROFESSIONAL_WORKING' | 'LIMITED_WORKING' | 'ELEMENTARY';
}

// Sample profile type that includes all necessary fields for our sample data
// This extends the basic Profile type with additional computed/legacy fields
export interface SampleProfile {
  // Core profile fields from Drizzle schema
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
  lastUpdated: Date | null;
  
  // Computed/legacy fields for backward compatibility
  name: string; // firstName + lastName
  title: string; // alias for headline
  picture: string; // alias for profilePictureUrl
  about: string; // alias for summary
  linkedinUrl: string; // computed from linkedinId
  linkedin_url: string; // legacy field
  followers: number; // alias for followersCount
  connections: number; // alias for connectionsCount
  
  // Related data (simplified for sample data)
  location: {
    city: string;
    state?: string;
    country: string;
  };
  skills: string[];
  experiences: Array<{
    title: string;
    companyName: string;
    organizationName: string;
    employmentType: string;
    location: string;
    workMode: string;
    startDate: string;
    endDate: string;
    duration: string;
    description: string;
    logo: string;
    logoUrl: string;
  }>;
  educations: Array<{
    school: string;
    schoolName: string;
    degree: string;
    degreeName: string;
    fieldOfStudy: string;
    companyLogo: string;
    logoUrl: string;
    startYear: string;
    endYear: string;
    description?: string;
  }>;
  projects: Array<{
    title: string;
    startDate: string;
    endDate: string;
    description: string;
    logo: string;
  }>;
  honors: Array<{
    title: string;
    issuer: string;
    date: string;
    description: string;
    logo: string;
  }>;
  certifications: Array<{
    name: string;
    authority: string;
    displaySource: string;
    licenseNumber: string;
    url: string;
    startDate: string;
    endDate: string;
  }>;
  languages: Array<{
    name: string;
    proficiency: 'NATIVE_OR_BILINGUAL' | 'FULL_PROFESSIONAL' | 'PROFESSIONAL_WORKING' | 'LIMITED_WORKING' | 'ELEMENTARY';
  }>;
  
  // Legacy fields for complete backward compatibility
  company?: null;
  job_title?: null;
}

// Flexible type for profile results that can come from database or sample data
export interface ProfileResult {
  id: number;
  name: string;
  title?: string;
  picture?: string;
  linkedin_url?: string;
  linkedinUrl?: string;
  location?: ProfileLocation | string;
  about?: string;
  experiences?: ProfileExperience[];
  educations?: ProfileEducation[];
  projects?: ProfileProject[];
  honors?: ProfileHonor[];
  followers?: number;
  connections?: number;
  skills?: string[];
  // Allow additional properties for flexibility
  [key: string]: unknown;
}

// Type for profile search/preview results
export type ProfileSearchResult = Pick<SampleProfile, 
  'id' | 'name' | 'title' | 'picture' | 'linkedin_url' | 'location' | 'followers' | 'connections'
> & {
  picture?: string;
  [key: string]: unknown; // Allow additional properties from database
};
