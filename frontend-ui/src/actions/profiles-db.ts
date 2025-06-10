"use server";

import { eq, ilike, and, or, count, desc, asc } from 'drizzle-orm';
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

export interface ProfileSearchParams {
  query?: string;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'connections' | 'followers';
  sortOrder?: 'asc' | 'desc';
}

// Get profiles with basic pagination and search
export async function getProfilesFromDB({
  query = '',
  page = 1,
  limit = 10,
  sortBy = 'name',
  sortOrder = 'asc'
}: ProfileSearchParams = {}) {
  try {
    const offset = (page - 1) * limit;
    
    // Build the query conditions
    const searchConditions = query ? [
      ilike(profiles.firstName, `%${query}%`),
      ilike(profiles.lastName, `%${query}%`),
      ilike(profiles.headline, `%${query}%`),
      ilike(profiles.summary, `%${query}%`)
    ] : [];

    // Build sort condition
    const sortColumn = sortBy === 'connections' ? profiles.connectionsCount :
                      sortBy === 'followers' ? profiles.followersCount :
                      profiles.firstName;
    
    const orderBy = sortOrder === 'desc' ? desc(sortColumn) : asc(sortColumn);

    // Execute the query with joins
    const profilesData = await db
      .select({
        id: profiles.id,
        linkedinId: profiles.linkedinId,
        firstName: profiles.firstName,
        lastName: profiles.lastName,
        headline: profiles.headline,
        summary: profiles.summary,
        profilePictureUrl: profiles.profilePictureUrl,
        backgroundImageUrl: profiles.backgroundImageUrl,
        connectionsCount: profiles.connectionsCount,
        followersCount: profiles.followersCount,
        location: {
          id: location.id,
          city: location.city,
          state: location.state,
          country: location.country,
        },
        industry: {
          id: industry.id,
          name: industry.name,
        }
      })
      .from(profiles)
      .leftJoin(location, eq(profiles.locationId, location.id))
      .leftJoin(industry, eq(profiles.industryId, industry.id))
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

    // Transform to match the existing Profile interface
    const transformedProfiles = profilesData.map((profile) => ({
      id: profile.id,
      name: `${profile.firstName} ${profile.lastName}`,
      title: profile.headline || '',
      picture: profile.profilePictureUrl || '',
      linkedinUrl: `https://www.linkedin.com/in/${profile.linkedinId}`,
      linkedin_url: `https://www.linkedin.com/in/${profile.linkedinId}`,
      location: profile.location ? `${profile.location.city}${profile.location.state ? `, ${profile.location.state}` : ''}, ${profile.location.country}` : '',
      about: profile.summary || '',
      experiences: [], // Will be loaded separately if needed
      educations: [], // Will be loaded separately if needed
      projects: [], // Will be loaded separately if needed
      honors: [], // Will be loaded separately if needed
    }));

    return {
      profiles: transformedProfiles,
      pagination: {
        totalCount,
        currentPage: page,
        pageSize: limit,
        totalPages: Math.ceil(totalCount / limit),
      }
    };
  } catch (error) {
    console.error('Error fetching profiles from database:', error);
    throw new Error('Failed to fetch profiles from database');
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

// Search profiles with pagination
export async function searchProfilesInDB(query: string, page: number = 1, limit: number = 10) {
  return getProfilesFromDB({
    query,
    page,
    limit,
    sortBy: 'name',
    sortOrder: 'asc'
  });
}

// Get profiles preview (for homepage)
export async function getProfilesPreviewFromDB(page: number = 1, limit: number = 10) {
  return getProfilesFromDB({
    page,
    limit,
    sortBy: 'followers',
    sortOrder: 'desc'
  });
} 