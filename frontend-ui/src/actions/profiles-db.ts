"use server";

import { eq, ilike, or, count, desc, asc } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import { 
  profiles, 
  location, 
  industry, 
  school, 
  organization, 
  education, 
  experience, 
  skill, 
  userSkill,
  language,
  userLanguage,
  certification,
  volunteer,
  publication,
  award,
  project
} from '@/lib/db/schema';
import type { ProfileWithRelations } from '@/lib/db/types';
import type { ProfileForComponents } from '@/types/profile-components';

export interface ProfileSearchParams {
  query?: string;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'connections' | 'followers';
  sortOrder?: 'asc' | 'desc';
}

// Minimal profile data for profile previews (home page, browse page, components)
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

// Get profile previews with minimal data and most recent company
export async function getProfilePreviewsFromDB({
  query = '',
  page = 1,
  limit = 10,
  sortBy = 'followers',
  sortOrder = 'desc'
}: ProfileSearchParams = {}) {
  try {
    const offset = (page - 1) * limit;
    
    // Build the query conditions
    const searchConditions = query ? [
      ilike(profiles.firstName, `%${query}%`),
      ilike(profiles.lastName, `%${query}%`),
      ilike(profiles.headline, `%${query}%`)
    ] : [];

    // Build sort condition
    const sortColumn = sortBy === 'connections' ? profiles.connectionsCount :
                      sortBy === 'followers' ? profiles.followersCount :
                      profiles.firstName;
    
    const orderBy = sortOrder === 'desc' ? desc(sortColumn) : asc(sortColumn);

    // Execute the query with minimal data needed for preview
    const profilesData = await db
      .select({
        linkedinId: profiles.linkedinId,
        firstName: profiles.firstName,
        lastName: profiles.lastName,
        headline: profiles.headline,
        profilePictureUrl: profiles.profilePictureUrl,
      })
      .from(profiles)
      .where(searchConditions.length > 0 ? or(...searchConditions) : undefined)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const totalCountResult = await db
      .select({ count: count() })
      .from(profiles)
      .where(searchConditions.length > 0 ? or(...searchConditions) : undefined);

    const totalCount = totalCountResult[0]?.count || 0;

    // For each profile, get the most recent company experience
    const profilesWithCompany = await Promise.all(
      profilesData.map(async (profile) => {
        // Get the most recent experience with organization
        const mostRecentExperience = await db
          .select({
            organizationName: organization.name,
            organizationLogo: organization.logoUrl,
          })
          .from(experience)
          .innerJoin(organization, eq(experience.organizationId, organization.id))
          .innerJoin(profiles, eq(experience.userId, profiles.id))
          .where(eq(profiles.linkedinId, profile.linkedinId))
          .orderBy(desc(experience.startDate))
          .limit(1);

        const currentCompany = mostRecentExperience[0] ? {
          name: mostRecentExperience[0].organizationName,
          logoUrl: mostRecentExperience[0].organizationLogo
        } : null;

        return {
          ...profile,
          currentCompany
        } as ProfilePreviewData;
      })
    );

    return {
      profiles: profilesWithCompany,
      pagination: {
        totalCount,
        currentPage: page,
        pageSize: limit,
        totalPages: Math.ceil(totalCount / limit),
      }
    };
  } catch (error) {
    console.error('Error fetching profile previews from database:', error);
    throw new Error('Failed to fetch profile previews from database');
  }
}

// Get a single profile with all relations by LinkedIn URL
export async function getProfileByLinkedInUrl(linkedinUrl: string): Promise<ProfileWithRelations | null> {
  try {
    // Extract LinkedIn ID from URL
    const linkedinId = linkedinUrl.replace('https://www.linkedin.com/in/', '').replace('/', '');
    
    // Get the main profile
    const profileData = await db
      .select()
      .from(profiles)
      .where(eq(profiles.linkedinId, linkedinId))
      .leftJoin(location, eq(profiles.locationId, location.id))
      .leftJoin(industry, eq(profiles.industryId, industry.id))
      .limit(1);

    if (!profileData.length) {
      return null;
    }

    const profile = profileData[0].profiles;
    const profileLocation = profileData[0].location;
    const profileIndustry = profileData[0].industry;

    // Get related data
    const [
      educationsData,
      experiencesData,
      certificationsData,
      skillsData,
      languagesData,
      volunteersData,
      publicationsData,
      awardsData,
      projectsData
    ] = await Promise.all([
      // Educations with schools
      db.select({
        education,
        school
      })
      .from(education)
      .leftJoin(school, eq(education.schoolId, school.id))
      .where(eq(education.userId, profile.id)),

      // Experiences with organizations and locations
      db.select({
        experience,
        organization,
        location
      })
      .from(experience)
      .leftJoin(organization, eq(experience.organizationId, organization.id))
      .leftJoin(location, eq(experience.locationId, location.id))
      .where(eq(experience.userId, profile.id)),

      // Certifications
      db.select()
      .from(certification)
      .where(eq(certification.userId, profile.id)),

      // Skills
      db.select({
        userSkill,
        skill
      })
      .from(userSkill)
      .leftJoin(skill, eq(userSkill.skillId, skill.id))
      .where(eq(userSkill.userId, profile.id)),

      // Languages
      db.select({
        userLanguage,
        language
      })
      .from(userLanguage)
      .leftJoin(language, eq(userLanguage.languageId, language.id))
      .where(eq(userLanguage.userId, profile.id)),

      // Volunteers
      db.select({
        volunteer,
        organization
      })
      .from(volunteer)
      .leftJoin(organization, eq(volunteer.organizationId, organization.id))
      .where(eq(volunteer.userId, profile.id)),

      // Publications
      db.select()
      .from(publication)
      .where(eq(publication.userId, profile.id)),

      // Awards
      db.select()
      .from(award)
      .where(eq(award.userId, profile.id)),

      // Projects
      db.select()
      .from(project)
      .where(eq(project.userId, profile.id))
    ]);

    // Construct the full profile with relations
    const fullProfile: ProfileWithRelations = {
      ...profile,
      location: profileLocation || undefined,
      industry: profileIndustry || undefined,
      educations: educationsData.map(item => ({
        ...item.education,
        school: item.school!
      })),
      experiences: experiencesData.map(item => ({
        ...item.experience,
        organization: item.organization!,
        location: item.location || undefined
      })),
      certifications: certificationsData,
      skills: skillsData.map(item => ({
        ...item.userSkill,
        skill: item.skill!
      })),
      languages: languagesData.map(item => ({
        ...item.userLanguage,
        language: item.language!
      })),
      volunteers: volunteersData.map(item => ({
        ...item.volunteer,
        organization: item.organization!
      })),
      publications: publicationsData,
      awards: awardsData,
      projects: projectsData
    };

    return fullProfile;
  } catch (error) {
    console.error('Error fetching profile by LinkedIn URL:', error);
    return null;
  }
}

// Get basic profile info by LinkedIn ID (for comparison page)
export async function getProfileByLinkedInId(linkedinId: string): Promise<ProfileWithRelations | null> {
  try {
    // Get the main profile
    const profileData = await db
      .select()
      .from(profiles)
      .where(eq(profiles.linkedinId, linkedinId))
      .leftJoin(location, eq(profiles.locationId, location.id))
      .leftJoin(industry, eq(profiles.industryId, industry.id))
      .limit(1);

    if (!profileData.length) {
      return null;
    }

    const profile = profileData[0].profiles;
    const profileLocation = profileData[0].location;
    const profileIndustry = profileData[0].industry;

    // Get related data (same as getProfileByLinkedInUrl but organized differently)
    const [
      educationsData,
      experiencesData,
      certificationsData,
      skillsData,
      languagesData,
      volunteersData,
      publicationsData,
      awardsData,
      projectsData
    ] = await Promise.all([
      // Educations with schools
      db.select({
        education,
        school
      })
      .from(education)
      .leftJoin(school, eq(education.schoolId, school.id))
      .where(eq(education.userId, profile.id)),

      // Experiences with organizations and locations
      db.select({
        experience,
        organization,
        location
      })
      .from(experience)
      .leftJoin(organization, eq(experience.organizationId, organization.id))
      .leftJoin(location, eq(experience.locationId, location.id))
      .where(eq(experience.userId, profile.id)),

      // Certifications
      db.select()
      .from(certification)
      .where(eq(certification.userId, profile.id)),

      // Skills
      db.select({
        userSkill,
        skill
      })
      .from(userSkill)
      .leftJoin(skill, eq(userSkill.skillId, skill.id))
      .where(eq(userSkill.userId, profile.id)),

      // Languages
      db.select({
        userLanguage,
        language
      })
      .from(userLanguage)
      .leftJoin(language, eq(userLanguage.languageId, language.id))
      .where(eq(userLanguage.userId, profile.id)),

      // Volunteers
      db.select({
        volunteer,
        organization
      })
      .from(volunteer)
      .leftJoin(organization, eq(volunteer.organizationId, organization.id))
      .where(eq(volunteer.userId, profile.id)),

      // Publications
      db.select()
      .from(publication)
      .where(eq(publication.userId, profile.id)),

      // Awards
      db.select()
      .from(award)
      .where(eq(award.userId, profile.id)),

      // Projects
      db.select()
      .from(project)
      .where(eq(project.userId, profile.id))
    ]);

    // Construct the full profile with relations
    const fullProfile: ProfileWithRelations = {
      ...profile,
      location: profileLocation || undefined,
      industry: profileIndustry || undefined,
      educations: educationsData.map(item => ({
        ...item.education,
        school: item.school!
      })),
      experiences: experiencesData.map(item => ({
        ...item.experience,
        organization: item.organization!,
        location: item.location || undefined
      })),
      certifications: certificationsData,
      skills: skillsData.map(item => ({
        ...item.userSkill,
        skill: item.skill!
      })),
      languages: languagesData.map(item => ({
        ...item.userLanguage,
        language: item.language!
      })),
      volunteers: volunteersData.map(item => ({
        ...item.volunteer,
        organization: item.organization!
      })),
      publications: publicationsData,
      awards: awardsData,
      projects: projectsData
    };

    return fullProfile;
  } catch (error) {
    console.error('Error fetching profile by LinkedIn ID:', error);
    return null;
  }
}

// Search profiles with pagination (returns preview data)
export async function searchProfilesInDB(query: string, page: number = 1, limit: number = 10) {
  return getProfilePreviewsFromDB({
    query,
    page,
    limit,
    sortBy: 'name',
    sortOrder: 'asc'
  });
}

// Get profiles preview (for homepage) - returns preview data
export async function getProfilesPreviewFromDB(page: number = 1, limit: number = 10) {
  return getProfilePreviewsFromDB({
    page,
    limit,
    sortBy: 'followers',
    sortOrder: 'desc'
  });
}

// Get profile for component display (properly typed)
export async function getProfileForComponents(linkedinId: string): Promise<ProfileForComponents | null> {
  try {
    // Get the main profile
    const profileData = await db
      .select()
      .from(profiles)
      .where(eq(profiles.linkedinId, linkedinId))
      .leftJoin(location, eq(profiles.locationId, location.id))
      .leftJoin(industry, eq(profiles.industryId, industry.id))
      .limit(1);

    if (!profileData.length) {
      return null;
    }

    const profile = profileData[0].profiles;
    const profileLocation = profileData[0].location;
    const profileIndustry = profileData[0].industry;

    // Get related data with proper error handling
    const [
      educationsData,
      experiencesData,
      certificationsData,
      skillsData,
      languagesData,
      volunteersData,
      publicationsData,
      awardsData,
      projectsData
    ] = await Promise.all([
      // Educations with schools
      db.select({
        education,
        school
      })
      .from(education)
      .leftJoin(school, eq(education.schoolId, school.id))
      .where(eq(education.userId, profile.id))
      .catch(() => []),

      // Experiences with organizations and locations
      db.select({
        experience,
        organization,
        location
      })
      .from(experience)
      .leftJoin(organization, eq(experience.organizationId, organization.id))
      .leftJoin(location, eq(experience.locationId, location.id))
      .where(eq(experience.userId, profile.id))
      .catch(() => []),

      // Certifications
      db.select()
      .from(certification)
      .where(eq(certification.userId, profile.id))
      .catch(() => []),

      // Skills
      db.select({
        userSkill,
        skill
      })
      .from(userSkill)
      .leftJoin(skill, eq(userSkill.skillId, skill.id))
      .where(eq(userSkill.userId, profile.id))
      .catch(() => []),

      // Languages
      db.select({
        userLanguage,
        language
      })
      .from(userLanguage)
      .leftJoin(language, eq(userLanguage.languageId, language.id))
      .where(eq(userLanguage.userId, profile.id))
      .catch(() => []),

      // Volunteers
      db.select({
        volunteer,
        organization
      })
      .from(volunteer)
      .leftJoin(organization, eq(volunteer.organizationId, organization.id))
      .where(eq(volunteer.userId, profile.id))
      .catch(() => []),

      // Publications
      db.select()
      .from(publication)
      .where(eq(publication.userId, profile.id))
      .catch(() => []),

      // Awards
      db.select()
      .from(award)
      .where(eq(award.userId, profile.id))
      .catch(() => []),

      // Projects
      db.select()
      .from(project)
      .where(eq(project.userId, profile.id))
      .catch(() => [])
    ]);

    // Build the profile object with proper types
    const result: ProfileForComponents = {
      id: profile.id,
      linkedinId: profile.linkedinId,
      firstName: profile.firstName,
      lastName: profile.lastName,
      headline: profile.headline,
      summary: profile.summary,
      profilePictureUrl: profile.profilePictureUrl,
      backgroundImageUrl: profile.backgroundImageUrl,
      connectionsCount: profile.connectionsCount,
      followersCount: profile.followersCount,
      location: profileLocation ? {
        id: profileLocation.id,
        city: profileLocation.city,
        state: profileLocation.state,
        country: profileLocation.country
      } : null,
      industry: profileIndustry ? {
        id: profileIndustry.id,
        name: profileIndustry.name
      } : null,
      experiences: experiencesData.map(item => ({
        id: item.experience.id,
        userId: item.experience.userId,
        title: item.experience.title,
        description: item.experience.description,
        startDate: item.experience.startDate,
        endDate: item.experience.endDate,
        organization: {
          id: item.organization?.id || 0,
          name: item.organization?.name || 'Unknown Organization',
          logoUrl: item.organization?.logoUrl || null
        },
        location: item.location ? {
          id: item.location.id,
          city: item.location.city,
          state: item.location.state,
          country: item.location.country
        } : null
      })),
      educations: educationsData.map(item => ({
        id: item.education.id,
        userId: item.education.userId,
        description: item.education.description,
        startDate: item.education.startDate,
        endDate: item.education.endDate,
        degreeName: item.education.degreeName,
        fieldOfStudy: item.education.fieldOfStudy,
        school: {
          id: item.school?.id || 0,
          name: item.school?.name || 'Unknown School',
          logoUrl: item.school?.logoUrl || null
        }
      })),
      projects: projectsData.map(project => ({
        id: project.id,
        userId: project.userId,
        title: project.title,
        description: project.description,
        startDate: project.startDate,
        endDate: project.endDate
      })),
      awards: awardsData.map(award => ({
        id: award.id,
        userId: award.userId,
        title: award.title,
        description: award.description,
        awardDate: award.awardDate,
        issuer: award.issuer
      })),
      certifications: certificationsData.map(cert => ({
        id: cert.id,
        userId: cert.userId,
        name: cert.name,
        authority: cert.authority,
        displaySource: cert.displaySource,
        licenseNumber: cert.licenseNumber,
        url: cert.url,
        startDate: cert.startDate,
        endDate: cert.endDate
      })),
      skills: skillsData.map(item => ({
        userId: item.userSkill.userId,
        skillId: item.userSkill.skillId,
        skill: {
          id: item.skill?.id || 0,
          name: item.skill?.name || 'Unknown Skill'
        }
      })),
      languages: languagesData.map(item => ({
        userId: item.userLanguage.userId,
        languageId: item.userLanguage.languageId,
        language: {
          id: item.language?.id || 0,
          name: item.language?.name || 'Unknown Language'
        }
      })),
      volunteers: volunteersData.map(item => ({
        id: item.volunteer.id,
        userId: item.volunteer.userId,
        role: item.volunteer.role,
        description: item.volunteer.description,
        startDate: item.volunteer.startDate,
        endDate: item.volunteer.endDate,
        organization: {
          id: item.organization?.id || 0,
          name: item.organization?.name || 'Unknown Organization',
          logoUrl: item.organization?.logoUrl || null
        }
      })),
             publications: publicationsData.map(pub => ({
         id: pub.id,
         userId: pub.userId,
         name: pub.name,
         pubDate: pub.pubDate,
         publisher: pub.publisher,
         url: pub.url
       }))
    };

    return result;
  } catch (error) {
    console.error('Error fetching profile for components:', error);
    throw new Error('Failed to fetch profile for components');
  }
}

// Get profile for comparison (returns ProfileWithRelations for comparison component)
export async function getProfileForComparison(linkedinId: string): Promise<ProfileWithRelations | null> {
  try {
    // Use the existing getProfileByLinkedInId function but with better error handling
    return await getProfileByLinkedInId(linkedinId);
  } catch (error) {
    console.error('Error fetching profile for comparison:', error);
    return null;
  }
} 