"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";

import { CONFIG } from "@/global-config";
import { searchProfiles } from "@/actions/profiles";
import { InfiniteScroll } from "@/components/infinite-scroll";
import { useBrowseContext } from "@/sections/browse/context";
import {
  ProfilePreview,
  ProfilePreviewSkeleton,
} from "@/components/profile-preview";
import { useRouter } from "@/routes/hooks";
import { paths } from "@/routes/paths";
import { ProfilePreviewData } from "@/lib/db/types";

// ----------------------------------------------------------------------

const PAGE_SIZE = 15;
export function BrowseView() {
  const { search } = useBrowseContext();
  const [profiles, setProfiles] = useState<ProfilePreviewData[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState(search);
  const router = useRouter();

  const fetchNextPage = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const newProfiles = await searchProfiles(searchTerm, page, PAGE_SIZE);

      if (!newProfiles || newProfiles.length === 0) {
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
  }, [page, loading, hasMore, searchTerm]);

  // Reset everything when search term changes
  useEffect(() => {
    if (searchTerm !== search) {
      setProfiles([]); // Clear previous results
      setPage(1);
      setHasMore(true);
      setSearchTerm(search);
    }
  }, [search, searchTerm]);

  // Only fetch initial data when searchTerm changes or component mounts
  useEffect(() => {
    const fetchInitialData = async () => {
      if (loading) return; // Prevent multiple simultaneous calls
      
      setLoading(true);
      try {
        const newProfiles = await searchProfiles(searchTerm, 1, PAGE_SIZE);

        if (!newProfiles || newProfiles.length === 0) {
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
      }
    };

    fetchInitialData();
  }, [searchTerm]); // Only depend on searchTerm

  const renderSkeletons = (count: number = PAGE_SIZE) => {
    const safeCount = Math.max(0, Math.floor(count));
    return Array(safeCount)
      .fill(0)
      .map((_, index) => (
        <div
          key={`skeleton-${index}`}
          className="flex justify-center hover:cursor-pointer rounded-xl"
        >
          <ProfilePreviewSkeleton />
        </div>
      ));
  };

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col min-h-screen">
      {profiles.length > 0 || loading ? (
        <InfiniteScroll
          loadMore={fetchNextPage}
          hasMore={hasMore}
          isLoading={loading}
          className="w-full"
        >
          <div className="grid grid-cols-1 min-[30rem]:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {profiles.map((profile, i) => (
              <div
                key={profile.linkedinId}
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
            {loading && renderSkeletons(Math.min(PAGE_SIZE, Math.max(0, 20 - profiles.length)))}
          </div>
        </InfiniteScroll>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[70vh]">
          <div className="flex space-x-6 opacity-50">
            <Image
              alt="No result"
              src={`${CONFIG.assetsDir}/logo/logo.svg`}
              width={100}
              height={100}
            />
          </div>
          <h2 className="text-2xl font-semibold mt-6">No results found</h2>
          <p className="text-gray-500">
            We couldn&#39;t find any profiles matching your search.
          </p>
        </div>
      )}
    </section>
  );
}
