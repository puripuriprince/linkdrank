import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  pgEnum,
  smallint,
  primaryKey,
  unique,
  json,
  timestamp
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Custom date type as JSON instead of composite
export type CustomDate = {
  day?: number;
  month?: number;
  year: number;
};

// Enums
export const proficiencyLevelEnum = pgEnum('proficiency_level', [
  'NATIVE_OR_BILINGUAL',
  'FULL_PROFESSIONAL', 
  'PROFESSIONAL_WORKING',
  'LIMITED_WORKING',
  'ELEMENTARY'
]);

// Lookup tables
export const location = pgTable('location', {
  id: serial('id').primaryKey(),
  city: varchar('city', { length: 100 }).notNull(),
  state: varchar('state', { length: 100 }),
  country: varchar('country', { length: 100 }).notNull(),
}, (table) => ({
  uniqueLocation: unique().on(table.city, table.state, table.country),
}));

export const industry = pgTable('industry', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
});

export const school = pgTable('school', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  logoUrl: varchar('logo_url', { length: 500 }),
  linkedinUrl: varchar('linkedin_url', { length: 500 }),
});

export const organization = pgTable('organization', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  logoUrl: varchar('logo_url', { length: 500 }),
  linkedinUrl: varchar('linkedin_url', { length: 500 }),
});

// Core profile table
export const profiles = pgTable('profiles', {
  id: serial('id').primaryKey(),
  linkedinId: varchar('linkedin_id', { length: 100 }).notNull().unique(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  headline: varchar('headline', { length: 255 }),
  summary: text('summary'),
  profilePictureUrl: varchar('profile_picture_url', { length: 500 }),
  backgroundImageUrl: varchar('background_image_url', { length: 500 }),
  locationId: integer('location_id').references(() => location.id, { onDelete: 'set null' }),
  industryId: integer('industry_id').references(() => industry.id, { onDelete: 'set null' }),
  connectionsCount: integer('connections_count').default(0),
  followersCount: integer('followers_count').default(0),
  lastUpdated: timestamp('last_updated').defaultNow(),
});

// Education history
export const education = pgTable('education', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  schoolId: integer('school_id').notNull().references(() => school.id, { onDelete: 'restrict' }),
  degreeName: varchar('degree_name', { length: 255 }),
  fieldOfStudy: varchar('field_of_study', { length: 255 }),
  startDate: json('start_date').$type<CustomDate>(),
  endDate: json('end_date').$type<CustomDate>(),
  description: text('description'),
});

// Professional experience
export const experience = pgTable('experience', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  organizationId: integer('organization_id').notNull().references(() => organization.id, { onDelete: 'restrict' }),
  title: varchar('title', { length: 255 }),
  description: text('description'),
  startDate: json('start_date').$type<CustomDate>(),
  endDate: json('end_date').$type<CustomDate>(),
  locationId: integer('location_id').references(() => location.id, { onDelete: 'set null' }),
});

// Certifications
export const certification = pgTable('certification', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  authority: varchar('authority', { length: 100 }),
  displaySource: varchar('display_source', { length: 100 }),
  licenseNumber: varchar('license_number', { length: 100 }),
  url: varchar('url', { length: 500 }),
  startDate: json('start_date').$type<CustomDate>(),
  endDate: json('end_date').$type<CustomDate>(),
});

// Skills
export const skill = pgTable('skill', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
});

export const userSkill = pgTable('user_skill', {
  userId: integer('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  skillId: integer('skill_id').notNull().references(() => skill.id, { onDelete: 'cascade' }),
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.skillId] }),
}));

// Languages
export const language = pgTable('language', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
});

export const userLanguage = pgTable('user_language', {
  userId: integer('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  languageId: integer('language_id').notNull().references(() => language.id, { onDelete: 'cascade' }),
  proficiency: proficiencyLevelEnum('proficiency').notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.languageId] }),
}));

// Volunteer work
export const volunteer = pgTable('volunteer', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  organizationId: integer('organization_id').notNull().references(() => organization.id, { onDelete: 'restrict' }),
  role: varchar('role', { length: 255 }),
  cause: varchar('cause', { length: 100 }),
  description: text('description'),
  startDate: json('start_date').$type<CustomDate>(),
  endDate: json('end_date').$type<CustomDate>(),
});

// Publications
export const publication = pgTable('publication', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  pubDate: json('pub_date').$type<CustomDate>(),
  publisher: varchar('publisher', { length: 255 }),
  url: varchar('url', { length: 500 }),
});

// Awards
export const award = pgTable('award', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  awardDate: json('award_date').$type<CustomDate>(),
  issuer: varchar('issuer', { length: 255 }),
});

// Projects
export const project = pgTable('project', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  startDate: json('start_date').$type<CustomDate>(),
  endDate: json('end_date').$type<CustomDate>(),
});

// Relations
export const profilesRelations = relations(profiles, ({ one, many }) => ({
  location: one(location, {
    fields: [profiles.locationId],
    references: [location.id],
  }),
  industry: one(industry, {
    fields: [profiles.industryId],
    references: [industry.id],
  }),
  educations: many(education),
  experiences: many(experience),
  certifications: many(certification),
  skills: many(userSkill),
  languages: many(userLanguage),
  volunteers: many(volunteer),
  publications: many(publication),
  awards: many(award),
  projects: many(project),
}));

export const educationRelations = relations(education, ({ one }) => ({
  profile: one(profiles, {
    fields: [education.userId],
    references: [profiles.id],
  }),
  school: one(school, {
    fields: [education.schoolId],
    references: [school.id],
  }),
}));

export const experienceRelations = relations(experience, ({ one }) => ({
  profile: one(profiles, {
    fields: [experience.userId],
    references: [profiles.id],
  }),
  organization: one(organization, {
    fields: [experience.organizationId],
    references: [organization.id],
  }),
  location: one(location, {
    fields: [experience.locationId],
    references: [location.id],
  }),
}));

export const userSkillRelations = relations(userSkill, ({ one }) => ({
  profile: one(profiles, {
    fields: [userSkill.userId],
    references: [profiles.id],
  }),
  skill: one(skill, {
    fields: [userSkill.skillId],
    references: [skill.id],
  }),
}));

export const userLanguageRelations = relations(userLanguage, ({ one }) => ({
  profile: one(profiles, {
    fields: [userLanguage.userId],
    references: [profiles.id],
  }),
  language: one(language, {
    fields: [userLanguage.languageId],
    references: [language.id],
  }),
}));
