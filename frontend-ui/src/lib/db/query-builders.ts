import { eq, ilike, or, and, exists } from 'drizzle-orm';
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
} from '@/lib/db/schema';
import type { RelatedProfileTagsSQLParams, SearchParams } from '@/app/search/types';

// Helper function to build query conditions from SearchParams mainQuery
export function buildMainQueryConditions(mainQuery: SearchParams['mainQuery']) {
  const conditions = [];

  // Profile basic fields
  if (mainQuery.headline?.length) {
    const headlineConditions = mainQuery.headline.map(keyword => 
      ilike(profiles.headline, `%${keyword}%`)
    );
    conditions.push(or(...headlineConditions));
  }

  if (mainQuery.summary?.length) {
    const summaryConditions = mainQuery.summary.map(keyword => 
      ilike(profiles.summary, `%${keyword}%`)
    );
    conditions.push(or(...summaryConditions));
  }

  if (mainQuery.firstName) {
    conditions.push(ilike(profiles.firstName, `%${mainQuery.firstName}%`));
  }

  if (mainQuery.lastName) {
    conditions.push(ilike(profiles.lastName, `%${mainQuery.lastName}%`));
  }

  // Industry filtering
  if (mainQuery.industries?.length) {
    const industryConditions = mainQuery.industries.map(ind => 
      ilike(industry.name, `%${ind}%`)
    );
    conditions.push(or(...industryConditions));
  }

  // Location filtering
  if (mainQuery.location?.countries?.length) {
    const countryConditions = mainQuery.location.countries.map(country => 
      ilike(location.country, `%${country}%`)
    );
    conditions.push(or(...countryConditions));
  }

  if (mainQuery.location?.states?.length) {
    const stateConditions = mainQuery.location.states.map(state => 
      ilike(location.state, `%${state}%`)
    );
    conditions.push(or(...stateConditions));
  }

  if (mainQuery.location?.cities?.length) {
    const cityConditions = mainQuery.location.cities.map(city => 
      ilike(location.city, `%${city}%`)
    );
    conditions.push(or(...cityConditions));
  }

  // Connection/follower metrics
  if (mainQuery.minConnections) {
    conditions.push(eq(profiles.connectionsCount, mainQuery.minConnections));
  }

  if (mainQuery.maxConnections) {
    conditions.push(eq(profiles.connectionsCount, mainQuery.maxConnections));
  }

  if (mainQuery.minFollowers) {
    conditions.push(eq(profiles.followersCount, mainQuery.minFollowers));
  }

  if (mainQuery.maxFollowers) {
    conditions.push(eq(profiles.followersCount, mainQuery.maxFollowers));
  }

  // Skills filtering - requires exists query due to junction table
  if (mainQuery.skills?.length) {
    const skillConditions = mainQuery.skills.map(skillName =>
      exists(
        db.select()
          .from(userSkill)
          .innerJoin(skill, eq(userSkill.skillId, skill.id))
          .where(
            and(
              eq(userSkill.userId, profiles.id),
              ilike(skill.name, `%${skillName}%`)
            )
          )
      )
    );
    conditions.push(or(...skillConditions));
  }

  // Education filtering - requires exists query
  if (mainQuery.education?.schools?.length) {
    const schoolConditions = mainQuery.education.schools.map(schoolName =>
      exists(
        db.select()
          .from(education)
          .innerJoin(school, eq(education.schoolId, school.id))
          .where(
            and(
              eq(education.userId, profiles.id),
              ilike(school.name, `%${schoolName}%`)
            )
          )
      )
    );
    conditions.push(or(...schoolConditions));
  }

  if (mainQuery.education?.degreeNames?.length) {
    const degreeConditions = mainQuery.education.degreeNames.map(degree =>
      exists(
        db.select()
          .from(education)
          .where(
            and(
              eq(education.userId, profiles.id),
              ilike(education.degreeName, `%${degree}%`)
            )
          )
      )
    );
    conditions.push(or(...degreeConditions));
  }

  if (mainQuery.education?.fieldsOfStudy?.length) {
    const fieldConditions = mainQuery.education.fieldsOfStudy.map(field =>
      exists(
        db.select()
          .from(education)
          .where(
            and(
              eq(education.userId, profiles.id),
              ilike(education.fieldOfStudy, `%${field}%`)
            )
          )
      )
    );
    conditions.push(or(...fieldConditions));
  }

  // Experience filtering - requires exists query
  if (mainQuery.experience?.organizations?.length) {
    const companyConditions = mainQuery.experience.organizations.map(companyName =>
      exists(
        db.select()
          .from(experience)
          .innerJoin(organization, eq(experience.organizationId, organization.id))
          .where(
            and(
              eq(experience.userId, profiles.id),
              ilike(organization.name, `%${companyName}%`)
            )
          )
      )
    );
    conditions.push(or(...companyConditions));
  }

  if (mainQuery.experience?.titles?.length) {
    const titleConditions = mainQuery.experience.titles.map(title =>
      exists(
        db.select()
          .from(experience)
          .where(
            and(
              eq(experience.userId, profiles.id),
              ilike(experience.title, `%${title}%`)
            )
          )
      )
    );
    conditions.push(or(...titleConditions));
  }

  // Certification filtering
  if (mainQuery.certifications?.names?.length) {
    const certConditions = mainQuery.certifications.names.map(certName =>
      exists(
        db.select()
          .from(certification)
          .where(
            and(
              eq(certification.userId, profiles.id),
              ilike(certification.name, `%${certName}%`)
            )
          )
      )
    );
    conditions.push(or(...certConditions));
  }

  if (mainQuery.certifications?.authorities?.length) {
    const authConditions = mainQuery.certifications.authorities.map(authority =>
      exists(
        db.select()
          .from(certification)
          .where(
            and(
              eq(certification.userId, profiles.id),
              ilike(certification.authority, `%${authority}%`)
            )
          )
      )
    );
    conditions.push(or(...authConditions));
  }

  // Language filtering
  if (mainQuery.languages?.names?.length) {
    const langConditions = mainQuery.languages.names.map(langName =>
      exists(
        db.select()
          .from(userLanguage)
          .innerJoin(language, eq(userLanguage.languageId, language.id))
          .where(
            and(
              eq(userLanguage.userId, profiles.id),
              ilike(language.name, `%${langName}%`)
            )
          )
      )
    );
    conditions.push(or(...langConditions));
  }

  if (mainQuery.languages?.proficiencies?.length) {
    const profConditions = mainQuery.languages.proficiencies.map(proficiency =>
      exists(
        db.select()
          .from(userLanguage)
          .where(
            and(
              eq(userLanguage.userId, profiles.id),
              eq(userLanguage.proficiency, proficiency)
            )
          )
      )
    );
    conditions.push(or(...profConditions));
  }

  return conditions.length > 0 ? and(...conditions) : undefined;
}

// Helper function to build query conditions from RelatedProfile tag sqlParams
export function buildRelatedProfileConditions(sqlParams: RelatedProfileTagsSQLParams) {
  const conditions = [];

  // Core profile fields
  if (sqlParams.headline?.length) {
    const headlineConditions = sqlParams.headline.map(keyword => 
      ilike(profiles.headline, `%${keyword}%`)
    );
    conditions.push(or(...headlineConditions));
  }

  if (sqlParams.summary?.length) {
    const summaryConditions = sqlParams.summary.map(keyword => 
      ilike(profiles.summary, `%${keyword}%`)
    );
    conditions.push(or(...summaryConditions));
  }

  if (sqlParams.firstName?.length) {
    const firstNameConditions = sqlParams.firstName.map(name => 
      ilike(profiles.firstName, `%${name}%`)
    );
    conditions.push(or(...firstNameConditions));
  }

  if (sqlParams.lastName?.length) {
    const lastNameConditions = sqlParams.lastName.map(name => 
      ilike(profiles.lastName, `%${name}%`)
    );
    conditions.push(or(...lastNameConditions));
  }

  // Industry filtering
  if (sqlParams.industries?.length) {
    const industryConditions = sqlParams.industries.map(ind => 
      ilike(industry.name, `%${ind}%`)
    );
    conditions.push(or(...industryConditions));
  }

  // Location filtering
  if (sqlParams.location?.countries?.length) {
    const countryConditions = sqlParams.location.countries.map(country => 
      ilike(location.country, `%${country}%`)
    );
    conditions.push(or(...countryConditions));
  }

  if (sqlParams.location?.states?.length) {
    const stateConditions = sqlParams.location.states.map(state => 
      ilike(location.state, `%${state}%`)
    );
    conditions.push(or(...stateConditions));
  }

  if (sqlParams.location?.cities?.length) {
    const cityConditions = sqlParams.location.cities.map(city => 
      ilike(location.city, `%${city}%`)
    );
    conditions.push(or(...cityConditions));
  }

  // Metrics filtering
  if (sqlParams.metrics?.minConnections) {
    conditions.push(eq(profiles.connectionsCount, sqlParams.metrics.minConnections));
  }

  if (sqlParams.metrics?.maxConnections) {
    conditions.push(eq(profiles.connectionsCount, sqlParams.metrics.maxConnections));
  }

  if (sqlParams.metrics?.minFollowers) {
    conditions.push(eq(profiles.followersCount, sqlParams.metrics.minFollowers));
  }

  if (sqlParams.metrics?.maxFollowers) {
    conditions.push(eq(profiles.followersCount, sqlParams.metrics.maxFollowers));
  }

  // Skills filtering for related profiles
  if (sqlParams.skills?.length) {
    const skillConditions = sqlParams.skills.map(skillName =>
      exists(
        db.select()
          .from(userSkill)
          .innerJoin(skill, eq(userSkill.skillId, skill.id))
          .where(
            and(
              eq(userSkill.userId, profiles.id),
              ilike(skill.name, `%${skillName}%`)
            )
          )
      )
    );
    conditions.push(or(...skillConditions));
  }

  // Experience filtering for related profiles
  if (sqlParams.experience?.organizations?.length) {
    const companyConditions = sqlParams.experience.organizations.map(companyName =>
      exists(
        db.select()
          .from(experience)
          .innerJoin(organization, eq(experience.organizationId, organization.id))
          .where(
            and(
              eq(experience.userId, profiles.id),
              ilike(organization.name, `%${companyName}%`)
            )
          )
      )
    );
    conditions.push(or(...companyConditions));
  }

  if (sqlParams.experience?.titles?.length) {
    const roleConditions = sqlParams.experience.titles.map(title =>
      exists(
        db.select()
          .from(experience)
          .where(
            and(
              eq(experience.userId, profiles.id),
              ilike(experience.title, `%${title}%`)
            )
          )
      )
    );
    conditions.push(or(...roleConditions));
  }

  // Education filtering for related profiles
  if (sqlParams.education?.schools?.length) {
    const schoolConditions = sqlParams.education.schools.map(schoolName =>
      exists(
        db.select()
          .from(education)
          .innerJoin(school, eq(education.schoolId, school.id))
          .where(
            and(
              eq(education.userId, profiles.id),
              ilike(school.name, `%${schoolName}%`)
            )
          )
      )
    );
    conditions.push(or(...schoolConditions));
  }

  if (sqlParams.education?.degreeNames?.length) {
    const degreeConditions = sqlParams.education.degreeNames.map(degree =>
      exists(
        db.select()
          .from(education)
          .where(
            and(
              eq(education.userId, profiles.id),
              ilike(education.degreeName, `%${degree}%`)
            )
          )
      )
    );
    conditions.push(or(...degreeConditions));
  }

  if (sqlParams.education?.fieldsOfStudy?.length) {
    const fieldConditions = sqlParams.education.fieldsOfStudy.map(field =>
      exists(
        db.select()
          .from(education)
          .where(
            and(
              eq(education.userId, profiles.id),
              ilike(education.fieldOfStudy, `%${field}%`)
            )
          )
      )
    );
    conditions.push(or(...fieldConditions));
  }

  // Certification filtering
  if (sqlParams.certifications?.names?.length) {
    const certConditions = sqlParams.certifications.names.map(certName =>
      exists(
        db.select()
          .from(certification)
          .where(
            and(
              eq(certification.userId, profiles.id),
              ilike(certification.name, `%${certName}%`)
            )
          )
      )
    );
    conditions.push(or(...certConditions));
  }

  if (sqlParams.certifications?.authorities?.length) {
    const authConditions = sqlParams.certifications.authorities.map(authority =>
      exists(
        db.select()
          .from(certification)
          .where(
            and(
              eq(certification.userId, profiles.id),
              ilike(certification.authority, `%${authority}%`)
            )
          )
      )
    );
    conditions.push(or(...authConditions));
  }

  // Language filtering
  if (sqlParams.languages?.names?.length) {
    const langConditions = sqlParams.languages.names.map(langName =>
      exists(
        db.select()
          .from(userLanguage)
          .innerJoin(language, eq(userLanguage.languageId, language.id))
          .where(
            and(
              eq(userLanguage.userId, profiles.id),
              ilike(language.name, `%${langName}%`)
            )
          )
      )
    );
    conditions.push(or(...langConditions));
  }

  if (sqlParams.languages?.proficiencies?.length) {
    const profConditions = sqlParams.languages.proficiencies.map(proficiency =>
      exists(
        db.select()
          .from(userLanguage)
          .where(
            and(
              eq(userLanguage.userId, profiles.id),
              eq(userLanguage.proficiency, proficiency)
            )
          )
      )
    );
    conditions.push(or(...profConditions));
  }

  return conditions.length > 0 ? and(...conditions) : undefined;
} 