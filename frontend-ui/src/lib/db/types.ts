import { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { 
  profiles, 
  location, 
  industry, 
  school, 
  organization, 
  education, 
  experience, 
  certification, 
  skill, 
  userSkill, 
  language, 
  userLanguage, 
  volunteer, 
  publication, 
  award, 
  project 
} from './schema';

// Select types (what you get when querying)
export type Profile = InferSelectModel<typeof profiles>;
export type Location = InferSelectModel<typeof location>;
export type Industry = InferSelectModel<typeof industry>;
export type School = InferSelectModel<typeof school>;
export type Organization = InferSelectModel<typeof organization>;
export type Education = InferSelectModel<typeof education>;
export type Experience = InferSelectModel<typeof experience>;
export type Certification = InferSelectModel<typeof certification>;
export type Skill = InferSelectModel<typeof skill>;
export type UserSkill = InferSelectModel<typeof userSkill>;
export type Language = InferSelectModel<typeof language>;
export type UserLanguage = InferSelectModel<typeof userLanguage>;
export type Volunteer = InferSelectModel<typeof volunteer>;
export type Publication = InferSelectModel<typeof publication>;
export type Award = InferSelectModel<typeof award>;
export type Project = InferSelectModel<typeof project>;

// Insert types (what you need when creating new records)
export type NewProfile = InferInsertModel<typeof profiles>;
export type NewLocation = InferInsertModel<typeof location>;
export type NewIndustry = InferInsertModel<typeof industry>;
export type NewSchool = InferInsertModel<typeof school>;
export type NewOrganization = InferInsertModel<typeof organization>;
export type NewEducation = InferInsertModel<typeof education>;
export type NewExperience = InferInsertModel<typeof experience>;
export type NewCertification = InferInsertModel<typeof certification>;
export type NewSkill = InferInsertModel<typeof skill>;
export type NewUserSkill = InferInsertModel<typeof userSkill>;
export type NewLanguage = InferInsertModel<typeof language>;
export type NewUserLanguage = InferInsertModel<typeof userLanguage>;
export type NewVolunteer = InferInsertModel<typeof volunteer>;
export type NewPublication = InferInsertModel<typeof publication>;
export type NewAward = InferInsertModel<typeof award>;
export type NewProject = InferInsertModel<typeof project>;

// Enhanced profile type with relations
export type ProfileWithRelations = Profile & {
  location?: Location;
  industry?: Industry;
  educations: (Education & { school: School })[];
  experiences: (Experience & { 
    organization: Organization; 
    location?: Location;
  })[];
  certifications: Certification[];
  skills: (UserSkill & { skill: Skill })[];
  languages: (UserLanguage & { language: Language })[];
  volunteers: (Volunteer & { organization: Organization })[];
  publications: Publication[];
  awards: Award[];
  projects: Project[];
};

// Minimal profile data for profile previews
export interface ProfilePreviewData {
  linkedinId: string;
  firstName: string;
  lastName: string;
  headline: string | null;
  profilePictureUrl: string | null;
  currentCompany?: {
    name: string;
    logoUrl: string;
  } | null;
} 