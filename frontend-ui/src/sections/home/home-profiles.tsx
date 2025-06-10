import { ProfilePreviewSkeleton } from "@/components/profile-preview";

import { useState, useEffect, useCallback } from "react";

import { getProfilesPreview } from "@/actions/profiles";
import { ProfilePreview } from "@/components/profile-preview";
import { InfiniteScroll } from "@/components/infinite-scroll";
import { ProfileWithRelations } from "@/lib/db/types";
import { paths } from "@/routes/paths";
import { useRouter } from "@/routes/hooks";

export function HomeProfiles() {
  const [profiles, setProfiles] = useState<ProfileWithRelations[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const router = useRouter();

  const fetchNextPage = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const newProfiles = await getProfilesPreview(page) as ProfileWithRelations[];

      if (!newProfiles?.length) {
        setHasMore(false);
      } else {
        setProfiles((prev) => [...prev, ...newProfiles]);
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Failed to fetch profiles:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);

  // Load initial data
  useEffect(() => {
    fetchNextPage();
  }, []);

  const renderSkeletons = (count: number = 10) =>
    Array(count)
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
      <h2 className="text-2xl font-semibold tracking-tight">
        Discover Profiles
      </h2>

      <InfiniteScroll
        loadMore={fetchNextPage}
        hasMore={hasMore}
        isLoading={loading}
        endMessage="You've reached the end. No more profiles to show."
        className="w-full"
      >
        {profiles.length > 0 ? (
          <div className="grid grid-cols-1 min-[30rem]:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-6">
            {profiles.map((profile, i) => (
              <div
                key={`profile-${profile.firstName}-${profile.lastName}-${profile.id}`}
                className="flex justify-center hover:cursor-pointer rounded-xl"
              >
                <ProfilePreview
                  profile={profile}
                  onClick={() =>
                    router.push(paths.people.details(profile.linkedinId))
                  }
                />
              </div>
            ))}
            {loading && renderSkeletons(Math.max(0, Math.min(10, 20 - profiles.length)))}
          </div>
        ) : !loading ? (
          <div className="flex h-40 w-full items-center justify-center">
            <p className="text-muted-foreground">No profiles found</p>
          </div>
        ) : null}
      </InfiniteScroll>
    </section>
  );
}
