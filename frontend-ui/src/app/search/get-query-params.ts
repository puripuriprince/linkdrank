"use server";

import { generateObject } from "ai";

import { redis } from "@/lib/redis";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { SearchParams } from "./types";

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
			model: openai("gpt-4o"),
			schema: z.object({
				mainQuery: mainQuerySchema,
				relatedProfileTags: z.array(relatedProfileTagSchema),
			}),
			prompt: `You are a LinkedIn profile search parameter extraction expert. Extract search parameters from the query and generate related profile tags.

QUERY: "${query}"

DATABASE SCHEMA:
- profiles: linkedin_id, first_name, last_name, headline, summary, profile_picture_url, connections_count, followers_count
- location: city, state, country
- industry: name (e.g., "Technology", "Finance", "Healthcare")
- education: degree_name, field_of_study, start_date, end_date + school(name)
- experience: title, description, start_date, end_date + organization(name) + location
- skill: name (via user_skill junction table)
- certification: name, authority, start_date, end_date
- language: name (via user_language with proficiency levels)

EXTRACTION RULES:

1. MAIN QUERY PARAMETERS:
   - headline: Extract role-related keywords (e.g., "co-founder", "founder", "CEO", "startup", "entrepreneur")
   - summary: Extract broader context keywords (e.g., "startup", "entrepreneurship", "innovation")
   - education.schools: Extract school names (e.g., "Concordia", "Stanford", "MIT")
   - experience.organizations: Extract company names (e.g., "Meta", "Google", "Apple")
   - experience.titles: Extract job titles and roles (e.g., "Co-founder", "Founder", "CEO", "CTO")
   - industries: Infer industries from context (e.g., "Technology", "Software", "Internet")
   - skills: Infer relevant skills from context (e.g., "Entrepreneurship", "Leadership", "Product Management")

2. KEYWORD EXTRACTION STRATEGY:
   - Look for company names, school names, job titles, and role descriptors
   - Extract both exact matches and related terms
   - For "startup" context, include terms like "entrepreneur", "founder", "co-founder"
   - For company names, use both current and previous company filters
   - For schools, always extract the exact school name mentioned

3. RELATED PROFILE TAGS (Generate 6-8 diverse tags with ACTUAL VALUES):
   
   Based on the query, generate tags like:
   - "Co-founders" → experience.titles: ["Co-founder", "Founder", "CEO"]
   - "Startup Experience" → headline: ["startup", "entrepreneur"] + experience.titles: ["Founder", "Co-founder"]
   - "[School] Alumni" → education.schools: ["extracted_school_name"]
   - "[Company] Alumni" → experience.organizations: ["extracted_company_name"]
   - "Tech Entrepreneurs" → industries: ["Technology"] + headline: ["startup", "entrepreneur"]
   - "Similar Background" → combine education + experience filters
   - "Industry Leaders" → experience.titles: ["CEO", "CTO", "VP"] + industries: ["Technology"]
   - "Innovation Focus" → headline: ["innovation", "product", "startup"] + skills: ["Product Management", "Innovation"]

4. EXAMPLES:
   Query: "concordia-alumni-who-co-founded-a-startup-and-work-at-meta"
   Should extract:
   - education.schools: ["Concordia"]
   - experience.organizations: ["Meta"]
   - experience.titles: ["Co-founder"]
   - headline: ["co-founder", "startup", "entrepreneur"]
   - industries: ["Technology"]
   - skills: ["Entrepreneurship", "Leadership"]

5. TAG GENERATION RULES:
   - Always fill in actual values, not empty arrays
   - Make labels specific to the extracted content
   - Ensure each tag targets different aspects of the profile
   - Use database field names exactly as specified in the schema

Generate parameters that directly map to database schema fields with meaningful values.`,
		});

		console.log(JSON.stringify(results.object, null, 2));

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