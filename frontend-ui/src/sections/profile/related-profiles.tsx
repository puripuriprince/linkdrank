import { ProfilePreviewSkeleton } from "@/components/profile-preview";
import { useState, useEffect, useCallback } from "react";
import { getProfilesPreview } from "@/actions/profiles";
import { ProfilePreview } from "@/components/profile-preview";
import { InfiniteScroll } from "@/components/infinite-scroll";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"
import { Profile } from "@/types/profile";
import { paths } from "@/routes/paths";
import { useRouter } from "@/routes/hooks";
import {Skeleton} from "@/components/ui/skeleton";

interface RelatedProfilesProps {
  relatedTags: { id: string; label: string }[];
  isLoading?: boolean;
}

const PAGE_SIZE = 15;
export function RelatedProfiles({ relatedTags, isLoading }: RelatedProfilesProps) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const router = useRouter();

  const fetchNextPage = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const newProfiles = await getProfilesPreview(page, PAGE_SIZE);
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
  }, [page, loading, hasMore]);

  useEffect(() => {
    setProfiles([]);
    setPage(1);
    setHasMore(true);
  }, [selectedTag]);

  useEffect(() => {
    fetchNextPage();
  }, [selectedTag]);

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
          { isLoading ? "Related Profiles..." : "Related Profiles" }
        </h2>
        {relatedTags && (
          <ScrollArea className="relative flex w-full">
            <div className="flex flex-row gap-2 overflow-x-auto whitespace-nowrap">
              {isLoading ? (
                  Array(7).fill(0).map((_, index) => (
                      <Skeleton className="h-9 w-24" key={`skeleton-${index}`}/>
                  ))) : (
                  <>
              {relatedTags.map((tag) => (
                <Button
                  key={tag.id}
                  variant="outline"
                  className={cn(
                    "capitalize px-4 py-2 text-sm font-semibold",
                    selectedTag === tag.id
                      ? "bg-zinc-200 dark:bg-zinc-700"
                      : "bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700",
                  )}
                  onClick={() => setSelectedTag(tag.id)}
                >
                  {tag.label}
                </Button>
              ))}
                  </>
              )}
            </div>
            <div className="pointer-events-none absolute -right-1 bottom-0 top-0 h-full w-12 bg-gradient-to-l from-white to-transparent backdrop-blur-[2px] [mask-image:linear-gradient(to_left,black_0%,black_30%,transparent_100%)] transition-all duration-300 dark:from-black translate-x-0 opacity-100" />
          </ScrollArea>
        )}

      </div>
      {isLoading ?
          <div
              className="grid grid-cols-1 min-[30rem]:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {renderSkeletons()}
          </div>
            :
            <InfiniteScroll
                loadMore={fetchNextPage}
                hasMore={hasMore}
                isLoading={loading}
                endMessage="You've reached the end. No more profiles to show."
                className="w-full"
            >
              {profiles.length > 0 ? (
                  <div
                      className="grid grid-cols-1 min-[30rem]:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                    {profiles.map((profile, i) => (
                        <div
                            key={`profile-${profile.name}`}
                            className="flex justify-center hover:cursor-pointer rounded-xl"
                        >
                          <ProfilePreview
                              id={i}
                              name={profile.name}
                              title={profile.title}
                              picture={profile.picture}
                              currentCompany={{
                                logo: "https://media.licdn.com/dms/image/v2/C4D0BAQHiNSL4Or29cg/company-logo_100_100/company-logo_100_100/0/1631311446380?e=1749686400&v=beta&t=Gwp7TJ03ucl_lSWXsdG8lCgHnVoQKbH4_zMgayw38XQ",
                                name: "Google",
                              }}
                              onClick={() =>
                                  router.push(paths.people.details(profile.linkedinUrl))
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
      }
          </section>
        );
      }
