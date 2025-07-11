import { ProfilePreviewSkeleton } from "@/components/profile-preview";
import { useState, useEffect, useCallback } from "react";
import { getProfilesPreview } from "@/actions/profiles";
import { ProfilePreview } from "@/components/profile-preview";
import { InfiniteScroll } from "@/components/infinite-scroll";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ProfilePreviewData, ProfileWithRelations } from "@/lib/db/types";
import { paths } from "@/routes/paths";
import { useRouter } from "@/routes/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { getProfilesByRelatedTag, SearchResult } from "@/app/search/get-users";
import { SearchParams } from "@/app/search/types";

interface RelatedProfilesProps {
  relatedTags: { id: string; label: string }[];
  isLoading?: boolean;
  searchParams?: SearchParams;
}

const PAGE_SIZE = 15;
export function RelatedProfiles({
  relatedTags,
  isLoading,
  searchParams,
}: RelatedProfilesProps) {
  const [profiles, setProfiles] = useState<ProfileWithRelations[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [tagSwitching, setTagSwitching] = useState(false);
  const router = useRouter();

  const fetchNextPage = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      let newProfiles: ProfileWithRelations[] = [];
      
      if (selectedTag && searchParams) {
        // Use tag-based search for next page
        const result = await getProfilesByRelatedTag(selectedTag, searchParams, page);
        newProfiles = result.profiles;
      } else {
        // Fallback to preview profiles
        const previewProfiles = await getProfilesPreview(page, PAGE_SIZE);
        newProfiles = previewProfiles?.map(p => ({
          id: 0,
          linkedinId: p.linkedinId,
          firstName: p.firstName,
          lastName: p.lastName,
          headline: p.headline,
          summary: null,
          profilePictureUrl: p.profilePictureUrl,
          backgroundImageUrl: null,
          locationId: null,
          industryId: null,
          connectionsCount: 0,
          followersCount: 0,
          lastUpdated: null,
          location: undefined,
          industry: undefined,
          educations: [],
          experiences: [],
          certifications: [],
          skills: [],
          languages: [],
          volunteers: [],
          publications: [],
          awards: [],
          projects: [],
        })) || [];
      }
      
      if (!newProfiles?.length) {
        setHasMore(false);
      } else {
        setProfiles((prev) => [...prev, ...newProfiles]);
        setPage((prev) => prev + 1);
        setHasMore(newProfiles.length === PAGE_SIZE);
      }
    } catch (error) {
      console.error("Failed to fetch profiles:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, selectedTag, searchParams]);

  // Handle initial load and tag changes with proper state management
  useEffect(() => {
    const fetchInitialData = async () => {
      if (loading) return; // Prevent multiple simultaneous calls
      
      setLoading(true);
      try {
        let newProfiles: ProfileWithRelations[] = [];
        
        if (selectedTag && searchParams) {
          // Use tag-based search - simplified approach for better performance
          const result = await getProfilesByRelatedTag(selectedTag, searchParams, 1);
          newProfiles = result.profiles;
        } else {
          // Fallback to preview profiles when no tag is selected
          const previewProfiles = await getProfilesPreview(1, PAGE_SIZE);
          newProfiles = previewProfiles?.map(p => ({
            id: 0,
            linkedinId: p.linkedinId,
            firstName: p.firstName,
            lastName: p.lastName,
            headline: p.headline,
            summary: null,
            profilePictureUrl: p.profilePictureUrl,
            backgroundImageUrl: null,
            locationId: null,
            industryId: null,
            connectionsCount: 0,
            followersCount: 0,
            lastUpdated: null,
            location: undefined,
            industry: undefined,
            educations: [],
            experiences: [],
            certifications: [],
            skills: [],
            languages: [],
            volunteers: [],
            publications: [],
            awards: [],
            projects: [],
          })) || [];
        }
        
        if (!newProfiles?.length) {
          setProfiles([]);
          setHasMore(false);
        } else {
          setProfiles(newProfiles);
          setPage(2); // Next page to fetch is page 2
          setHasMore(newProfiles.length === PAGE_SIZE);
        }
      } catch (error) {
        console.error("Failed to fetch profiles:", error);
        setProfiles([]);
        setHasMore(false);
      } finally {
        setLoading(false);
        setTagSwitching(false); // Clear tag switching state
      }
    };

    // Reset state and fetch data when selectedTag changes or on mount
    setProfiles([]);
    setPage(1);
    setHasMore(true);
    fetchInitialData();
  }, [selectedTag, searchParams]);

  const handleTagClick = (tagId: string) => {
    setTagSwitching(true);
    setSelectedTag(tagId);
  };

  const renderSkeletons = () =>
    Array(PAGE_SIZE)
      .fill(0)
      .map((_, index) => (
        <div
          key={`skeleton-${index}`}
          className="flex justify-center hover:cursor-pointer rounded-xl"
        >
          <ProfilePreviewSkeleton />
        </div>
      ));

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col space-y-6">
      <div className="mb-4 mt-10">
        <h2 className="mb-2 text-2xl font-semibold">
          {isLoading ? "Related Profiles..." : "Related Profiles"}
        </h2>
        {relatedTags && (
          <ScrollArea className="relative flex w-full">
            <div className="flex flex-row gap-2 overflow-x-auto whitespace-nowrap">
              {isLoading ? (
                Array(7)
                  .fill(0)
                  .map((_, index) => (
                    <Skeleton className="h-9 w-24" key={`skeleton-${index}`} />
                  ))
              ) : (
                <>
                  {relatedTags.map((tag) => (
                    <Button
                      key={tag.id}
                      variant="outline"
                      className={cn(
                        "capitalize px-4 py-2 text-sm font-semibold transition-all duration-200",
                        selectedTag === tag.id
                          ? "bg-zinc-200 dark:bg-zinc-700"
                          : "bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700",
                        tagSwitching && selectedTag === tag.id && "opacity-70"
                      )}
                      onClick={() => handleTagClick(tag.id)}
                      disabled={tagSwitching && selectedTag === tag.id}
                    >
                      {tagSwitching && selectedTag === tag.id ? "Loading..." : tag.label}
                    </Button>
                  ))}
                </>
              )}
            </div>
            <div className="pointer-events-none absolute -right-1 bottom-0 top-0 h-full w-12 bg-gradient-to-l from-white to-transparent backdrop-blur-[2px] [mask-image:linear-gradient(to_left,black_0%,black_30%,transparent_100%)] transition-all duration-300 dark:from-black translate-x-0 opacity-100" />
          </ScrollArea>
        )}
      </div>
      {(isLoading || tagSwitching) ? (
        <div className="grid grid-cols-1 min-[30rem]:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {renderSkeletons()}
        </div>
      ) : (
        <InfiniteScroll
          loadMore={fetchNextPage}
          hasMore={hasMore}
          isLoading={loading}
          endMessage="You've reached the end. No more profiles to show."
          className="w-full"
        >
          {profiles.length > 0 ? (
            <div className="grid grid-cols-1 min-[30rem]:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {profiles.map((profile, i) => (
                <div
                  key={profile.linkedinId}
                  className="flex justify-center hover:cursor-pointer rounded-xl"
                >
                  <ProfilePreview
                    profile={{
                      linkedinId: profile.linkedinId,
                      firstName: profile.firstName,
                      lastName: profile.lastName,
                      headline: profile.headline,
                      profilePictureUrl: profile.profilePictureUrl,
                      currentCompany: profile.experiences?.[0] ? {
                        name: profile.experiences[0].organization.name,
                        logoUrl: profile.experiences[0].organization.logoUrl || "",
                      } : null,
                    }}
                    onClick={() =>
                      router.push(paths.people.details(profile.linkedinId))
                    }
                  />
                </div>
              ))}
              {loading && renderSkeletons()}
            </div>
          ) : !loading ? (
            <div className="flex h-40 w-full items-center justify-center">
              <p className="text-muted-foreground">No profiles found</p>
            </div>
          ) : null}
        </InfiniteScroll>
      )}
    </section>
  );
}
