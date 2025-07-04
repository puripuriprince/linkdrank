"use server";

import { db } from "@/lib/db/client";
import { desc, ilike, or } from "drizzle-orm";
import { SearchParams } from "./types";
import { 
	profiles
} from "@/lib/db/schema";
import { ProfileWithRelations } from "@/lib/db/types";
import { buildMainQueryConditions, buildSimplifiedTagConditions } from "@/lib/db/query-builders";

const SEARCH_RESULTS_PER_PAGE = 15;

// Types for the search results
export interface SearchResult {
	profiles: ProfileWithRelations[];
	relatedTags: RelatedTag[];
	totalProfiles: number;
	totalPages: number;
}

export interface RelatedTag {
	id: string;
	label: string;
	count: number;
	sqlParams: SearchParams['relatedProfileTags'][0]['sqlParams'];
}

export async function queryUsers(
	searchParams: SearchParams,
	pageIndex: number = 1,
): Promise<SearchResult> {
	try {
		// Build main query conditions
		const mainQueryConditions = buildMainQueryConditions(searchParams.mainQuery);
		
		// Calculate offset for pagination
		const offset = (pageIndex - 1) * SEARCH_RESULTS_PER_PAGE;
		
		// Execute main query to get profiles with relations
		const rawProfilesResult = await db.query.profiles.findMany({
			where: mainQueryConditions,
			with: {
				location: true,
				industry: true,
				educations: {
					with: {
						school: true
					}
				},
				experiences: {
					with: {
						organization: true,
						location: true
					}
				},
				certifications: true,
				skills: {
					with: {
						skill: true
					}
				},
				languages: {
					with: {
						language: true
					}
				},
				volunteers: {
					with: {
						organization: true
					}
				},
				publications: true,
				awards: true,
				projects: true,
			},
			orderBy: [desc(profiles.followersCount)],
			limit: SEARCH_RESULTS_PER_PAGE,
			offset: offset,
		});

		// Transform to match ProfileWithRelations type (convert null to undefined)
		const profilesResult: ProfileWithRelations[] = rawProfilesResult.map(profile => ({
			...profile,
			location: profile.location || undefined,
			industry: profile.industry || undefined,
			experiences: profile.experiences.map(exp => ({
				...exp,
				location: exp.location || undefined,
			})),
		}));

		// If no results found, try a broader search or fallback to popular profiles
		let finalProfiles = profilesResult;
		if (profilesResult.length === 0 && mainQueryConditions) {
			// Try fallback search with just headline keywords if available
			const fallbackConditions = [];
			if (searchParams.mainQuery.headline?.length) {
				const headlineConditions = searchParams.mainQuery.headline.map(keyword => 
					ilike(profiles.headline, `%${keyword}%`)
				);
				fallbackConditions.push(or(...headlineConditions));
			}
			
			if (fallbackConditions.length > 0) {
				const fallbackResult = await db.query.profiles.findMany({
					where: or(...fallbackConditions),
					with: {
						location: true,
						industry: true,
						educations: {
							with: {
								school: true
							}
						},
						experiences: {
							with: {
								organization: true,
								location: true
							}
						},
						certifications: true,
						skills: {
							with: {
								skill: true
							}
						},
						languages: {
							with: {
								language: true
							}
						},
						volunteers: {
							with: {
								organization: true
							}
						},
						publications: true,
						awards: true,
						projects: true,
					},
					orderBy: [desc(profiles.followersCount)],
					limit: SEARCH_RESULTS_PER_PAGE,
					offset: offset,
				});
				
				finalProfiles = fallbackResult.map(profile => ({
					...profile,
					location: profile.location || undefined,
					industry: profile.industry || undefined,
					experiences: profile.experiences.map(exp => ({
						...exp,
						location: exp.location || undefined,
					})),
				}));
			}
		}

		// Get total count for pagination
		const countResult = await db.query.profiles.findMany({
			where: mainQueryConditions,
			columns: { id: true },
		});

		// Calculate total pages
		const totalProfiles = countResult.length;
		const totalPages = Math.ceil(totalProfiles / SEARCH_RESULTS_PER_PAGE);

		// Get related tags from the searchParams
		const relatedTags: RelatedTag[] = searchParams.relatedProfileTags.map(tag => ({
			id: tag.id,
			label: tag.label,
			count: 0,
			sqlParams: tag.sqlParams
		}));

		return {
			profiles: finalProfiles,
			relatedTags,
			totalProfiles,
			totalPages,
		};
	} catch (error) {
		console.error("Error in queryUsers:", error);
		
		// Return empty result on error
		return {
			profiles: [],
			relatedTags: [],
			totalProfiles: 0,
			totalPages: 0,
		};
	}
}

// Helper function to get profiles by related tag
export async function getProfilesByRelatedTag(
	tagId: string,
	searchParams: SearchParams,
	pageIndex: number = 1,
): Promise<SearchResult> {
	try {
		const tag = searchParams.relatedProfileTags.find(t => t.id === tagId);
		if (!tag) {
			throw new Error(`Tag with id ${tagId} not found`);
		}

		// Build query conditions for this tag using simplified builder for better performance
		const tagConditions = buildSimplifiedTagConditions(tag.sqlParams);
		
		// Calculate offset for pagination
		const offset = (pageIndex - 1) * SEARCH_RESULTS_PER_PAGE;
		
		// Execute main query to get profiles with relations
		const rawProfilesResult = await db.query.profiles.findMany({
			where: tagConditions,
			with: {
				location: true,
				industry: true,
				educations: {
					with: {
						school: true
					}
				},
				experiences: {
					with: {
						organization: true,
						location: true
					}
				},
				// Reduce the number of relations loaded for better performance
				skills: {
					with: {
						skill: true
					},
					limit: 5 // Limit skills to first 5 for performance
				},
				// Skip some heavy relations for tag queries to improve performance
				// certifications: true,
				// languages: true,
				// volunteers: true,
				// publications: true,
				// awards: true,
				// projects: true,
			},
			orderBy: [desc(profiles.followersCount)],
			limit: SEARCH_RESULTS_PER_PAGE,
			offset: offset,
		});

		// Transform to match ProfileWithRelations type (convert null to undefined)
		const profilesResult: ProfileWithRelations[] = rawProfilesResult.map(profile => ({
			...profile,
			location: profile.location || undefined,
			industry: profile.industry || undefined,
			experiences: profile.experiences.map(exp => ({
				...exp,
				location: exp.location || undefined,
			})),
			// Add empty arrays for the relations we're not loading to maintain type compatibility
			certifications: [],
			languages: [],
			volunteers: [],
			publications: [],
			awards: [],
			projects: [],
		}));

		// Get total count for pagination using simplified query
		const countResult = await db.query.profiles.findMany({
			where: tagConditions,
			columns: { id: true },
		});

		// Calculate total pages
		const totalProfiles = countResult.length;
		const totalPages = Math.ceil(totalProfiles / SEARCH_RESULTS_PER_PAGE);

		// Get related tags from the searchParams
		const relatedTags: RelatedTag[] = searchParams.relatedProfileTags.map(relatedTag => ({
			id: relatedTag.id,
			label: relatedTag.label,
			count: 0, // Will be populated with actual counts if needed
			sqlParams: relatedTag.sqlParams
		}));

		const result = {
			profiles: profilesResult,
			relatedTags,
			totalProfiles,
			totalPages,
		};

		return result;
	} catch (error) {
		console.error("Error in getProfilesByRelatedTag:", error);
		
		// Return empty result on error
		return {
			profiles: [],
			relatedTags: [],
			totalProfiles: 0,
			totalPages: 0,
		};
	}
}