"use client";

// ----------------------------------------------------------------------

import { RelatedProfiles } from "@/sections/search/related-profiles";
import { ProfileGallery } from "@/sections/search/top-profiles";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getQueryParams } from "@/app/search/get-query-params";
import { queryUsers, SearchResult } from "@/app/search/get-users";
import { SearchParams } from "@/app/search/types";
import { Button } from "@/components/ui/button";
import { SearchX } from "lucide-react";
import Link from "next/link";

export function SearchView() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  
  const [profilesLoading, setProfilesLoading] = useState(true);
  const [relatedTagsLoading, setRelatedTagsLoading] = useState(true);
  
  const [parsedSearchParams, setParsedSearchParams] = useState<SearchParams | undefined>(undefined);
  const [profiles, setProfiles] = useState<SearchResult['profiles']>([]);
  const [relatedTags, setRelatedTags] = useState<SearchResult['relatedTags']>([]);
  
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) {
      setProfilesLoading(false);
      setRelatedTagsLoading(false);
      return;
    }

    const performSearch = async () => {
      try {
        setError(null);
        
        // Step 1: Get parsed search parameters from AI (show tags as soon as this completes)
        const searchParamsData = await getQueryParams(query);
        setParsedSearchParams(searchParamsData);
        setRelatedTags(searchParamsData.relatedProfileTags.map(tag => ({
          id: tag.id,
          label: tag.label,
          count: 0,
          sqlParams: tag.sqlParams
        })));
        setRelatedTagsLoading(false);
        
        // Step 2: Perform the database search (show profiles when this completes)
        const results = await queryUsers(searchParamsData, 1);
        setProfiles(results.profiles);
        setProfilesLoading(false);
        
      } catch (searchError) {
        console.error("Error performing search:", searchError);
        setError("Failed to perform search. Please try again.");
        setProfilesLoading(false);
        setRelatedTagsLoading(false);
        setParsedSearchParams(undefined);
        setProfiles([]);
        setRelatedTags([]);
      }
    };

    performSearch();
  }, [query]);

  // Handle error state
  if (error) {
    return (
      <div className="flex flex-col items-center text-center">
        <div className="mb-5 rounded-full bg-muted p-6">
          <SearchX className="h-12 w-12 text-muted-foreground" />
        </div>
        <h1 className="mb-2 font-bold text-2xl">Search Error</h1>
        <p className="mb-8 max-w-md text-muted-foreground">
          {error}
        </p>
        <div className="flex gap-4">
          <Button 
            onClick={() => window.location.reload()}
            variant="default"
          >
            Retry Search
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <ProfileGallery
        profiles={profiles}
        loading={profilesLoading}
      />
      <RelatedProfiles
        relatedTags={relatedTags}
        isLoading={relatedTagsLoading}
        searchParams={parsedSearchParams}
      />
    </>
  );
}
