import { generateObject } from "ai";

import { redis } from "@/lib/redis";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { SearchParams, ProficiencyLevel } from "./types";

const mainQuerySchema = z.object({
	// Profile basic fields
	headline: z.array(z.string()).optional(),
	summary: z.array(z.string()).optional(),
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	
	// Location filters
	location: z.object({
		cities: z.array(z.string()).optional(),
		states: z.array(z.string()).optional(),
		countries: z.array(z.string()).optional(),
	}).optional(),
	
	// Industry filter
	industries: z.array(z.string()).optional(),
	
	// Connection/follower metrics
	minConnections: z.number().optional(),
	maxConnections: z.number().optional(),
	minFollowers: z.number().optional(),
	maxFollowers: z.number().optional(),
	
	// Skills filters
	skills: z.array(z.string()).optional(),
	
	// Education filters
	education: z.object({
		schools: z.array(z.string()).optional(),
		degreeNames: z.array(z.string()).optional(),
		fieldsOfStudy: z.array(z.string()).optional(),
		startYear: z.number().optional(),
		endYear: z.number().optional(),
	}).optional(),
	
	// Experience filters
	experience: z.object({
		organizations: z.array(z.string()).optional(),
		titles: z.array(z.string()).optional(),
		startYear: z.number().optional(),
		endYear: z.number().optional(),
		locationCities: z.array(z.string()).optional(),
		locationStates: z.array(z.string()).optional(),
		locationCountries: z.array(z.string()).optional(),
	}).optional(),
	
	// Certification filters
	certifications: z.object({
		names: z.array(z.string()).optional(),
		authorities: z.array(z.string()).optional(),
		startYear: z.number().optional(),
		endYear: z.number().optional(),
	}).optional(),
	
	// Language filters
	languages: z.object({
		names: z.array(z.string()).optional(),
		proficiencies: z.array(z.enum(['NATIVE_OR_BILINGUAL', 'FULL_PROFESSIONAL', 'PROFESSIONAL_WORKING', 'LIMITED_WORKING', 'ELEMENTARY'])).optional(),
	}).optional(),
});

const relatedProfileTagSchema = z.object({
	id: z.string(),
	label: z.string(),
	sqlParams: z.object({
		// Core profile fields
		headline: z.array(z.string()).optional(),
		summary: z.array(z.string()).optional(),
		firstName: z.array(z.string()).optional(),
		lastName: z.array(z.string()).optional(),
		
		// Location parameters
		location: z.object({
			cities: z.array(z.string()).optional(),
			states: z.array(z.string()).optional(),
			countries: z.array(z.string()).optional(),
		}).optional(),
		
		// Industry parameters
		industries: z.array(z.string()).optional(),
		
		// Skills parameters
		skills: z.array(z.string()).optional(),
		
		// Education parameters
		education: z.object({
			schools: z.array(z.string()).optional(),
			degreeNames: z.array(z.string()).optional(),
			fieldsOfStudy: z.array(z.string()).optional(),
			yearRange: z.object({
				startYear: z.number().optional(),
				endYear: z.number().optional(),
			}).optional(),
		}).optional(),
		
		// Experience parameters
		experience: z.object({
			organizations: z.array(z.string()).optional(),
			titles: z.array(z.string()).optional(),
			yearRange: z.object({
				startYear: z.number().optional(),
				endYear: z.number().optional(),
			}).optional(),
			locations: z.object({
				cities: z.array(z.string()).optional(),
				states: z.array(z.string()).optional(),
				countries: z.array(z.string()).optional(),
			}).optional(),
		}).optional(),
		
		// Certification parameters
		certifications: z.object({
			names: z.array(z.string()).optional(),
			authorities: z.array(z.string()).optional(),
			yearRange: z.object({
				startYear: z.number().optional(),
				endYear: z.number().optional(),
			}).optional(),
		}).optional(),
		
		// Language parameters
		languages: z.object({
			names: z.array(z.string()).optional(),
			proficiencies: z.array(z.enum(['NATIVE_OR_BILINGUAL', 'FULL_PROFESSIONAL', 'PROFESSIONAL_WORKING', 'LIMITED_WORKING', 'ELEMENTARY'])).optional(),
		}).optional(),
		
		// Metric filters
		metrics: z.object({
			minConnections: z.number().optional(),
			maxConnections: z.number().optional(),
			minFollowers: z.number().optional(),
			maxFollowers: z.number().optional(),
		}).optional(),
	}),
});

export async function getQueryParams(query: string): Promise<SearchParams> {
	const cacheKey = `search:profiles:${query}`;
	let searchParams: SearchParams | null = null;
	
	try {
		const cached = await redis.hgetall(cacheKey);
		if (cached && Object.keys(cached).length > 0) {
			searchParams = cached as SearchParams;
		}
	} catch (error) {
		console.warn('Redis cache error:', error);
	}

	if (!searchParams) {
		const results = await generateObject({
			model: openai("gpt-4o-mini"),
			schema: z.object({
				mainQuery: mainQuerySchema,
				relatedProfileTags: z.array(relatedProfileTagSchema),
			}),
			prompt: `Extract LinkedIn profile search parameters from the following query based on this database schema:

TABLES AVAILABLE:
- profiles: linkedin_id, first_name, last_name, headline, summary, profile_picture_url, connections_count, followers_count
- location: city, state, country
- industry: name
- education: degree_name, field_of_study, start_date, end_date + school(name)
- experience: title, description, start_date, end_date + organization(name) + location
- skill: name (via user_skill junction table)
- certification: name, authority, start_date, end_date
- language: name (via user_language with proficiency levels)
- volunteer: role, cause + organization(name)
- publication: name, publisher, pub_date
- award: title, issuer, award_date
- project: title, description, start_date, end_date

1. Main Query Parameters (for ProfileGallery):
   Extract relevant search criteria from the query that match the database schema:
   - Profile fields: headline keywords, summary terms, names
   - Location: cities, states, countries from the location table
   - Industries: from the industry table
   - Skills: from the skill table (accessed via user_skill junction)
   - Education: school names, degree names, fields of study
   - Experience: organization names, job titles
   - Certifications: certification names, authorities
   - Languages: language names, proficiency levels
   - Metrics: connection/follower counts if mentioned

2. Related Profile Tags (generate 6-8 diverse tags):
   Create tags that help users discover related profiles using database fields:
   
   Examples based on query analysis:
   - "Similar Role" → headline keywords from experience titles
   - "Same Industry" → industry table values
   - "Alumni Network" → education school names
   - "Company Peers" → experience organization names
   - "Similar Skills" → skill table values
   - "Same Location" → location table values (city, state, country)
   - "Language Speakers" → language table values
   - "Certification Holders" → certification names/authorities
   - "Experience Level" → metrics ranges
   - "Publication Authors" → publication fields
   - "Award Winners" → award fields

   Each tag should have SQL parameters that target specific database tables and fields.
   Use year ranges for date-based filtering (education, experience, certifications, etc.).

Query to analyze: "${query}"

Generate parameters that directly map to the database schema fields.`,
		});

		searchParams = {
			mainQuery: results.object.mainQuery,
			relatedProfileTags: results.object.relatedProfileTags,
		};

		try {
			await redis.hset(cacheKey, searchParams as Record<string, any>);
		} catch (error) {
			console.warn('Redis cache save error:', error);
		}
	}

	return searchParams || {
		mainQuery: {},
		relatedProfileTags: [],
	};
}