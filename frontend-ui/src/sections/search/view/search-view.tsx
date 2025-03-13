'use client';

import {useCallback, useEffect, useState} from "react";
import {ProfilePreview, ProfilePreviewProps} from "@/components/profile-preview";
import {searchProfiles} from "@/src/actions/profiles";
import {InfiniteScroll} from "@/components/infinite-scroll";
import {useSearchParams} from "src/routes/hooks";

// ----------------------------------------------------------------------

export function SearchView() {
    const searchParams = useSearchParams();
    const { query } = searchParams;
    const [search, setSearch] = useState<string>(query ?? "");
    const [profiles, setProfiles] = useState<ProfilePreviewProps[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const fetchNextPage = useCallback(async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
            const newProfiles = await searchProfiles(search, page);

            if (!newProfiles?.length) {
                setHasMore(false);
            } else {
                setProfiles(prev => [...prev, ...newProfiles]);
                setPage(prev => prev + 1);
            }
        } catch (error) {
            console.error("Failed to fetch profiles:", error);
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    }, [page, loading, hasMore, search]);

    useEffect(() => {
        setProfiles([]);
        setPage(1);
        setHasMore(true);
        setSearch(query);
        console.log("Search query:", query);
    }, [query]);

    useEffect(() => {
        fetchNextPage();
    }, [search]);


    return (
        <section className="flex flex-col min-h-screen mx-auto">
            {profiles.length > 0 ? (
                <InfiniteScroll
                    loadMore={fetchNextPage}
                    hasMore={hasMore}
                    isLoading={loading}
                    className="w-full"
                >
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 auto-rows-fr">
                        {profiles.map(profile => (
                            <ProfilePreview key={profile.name} {...profile} />
                        ))}
                    </div>
                </InfiniteScroll>
            ) : !loading ? (
                <div className="flex flex-col items-center justify-center min-h-[70vh]">
                    <div className="flex space-x-6 opacity-50">
                        <img alt="Shark with hat emoji" src="https://imgproxy.attic.sh/tmspyjhNCNhVuRgC0S28InUtanef5Rr3YcreO5KmKPY/rs:fit:540:540:1:1/t:1:FF00FF:false:false/aHR0cHM6Ly9hdHRp/Yy5zaC9ydW5wb2Qv/YjgwNGMyNjItZWVl/Yi00ZWYxLWFkZTEt/YzEwZTgxODc2MjA0/LnBuZw.webp" width={100} height={100} className="rotate-12" />
                        <img alt="Cat with sunglasses emoji" src="https://imgproxy.attic.sh/ZxkQMTfASzT8xlmuT6kfiUEcjo_T98aNJjb_rYpKgPw/rs:fit:540:540:1:1/t:1:FF00FF:false:false/aHR0cHM6Ly9hdHRp/Yy5zaC9ydW5wb2Qv/ZTc4MDBiZGYtODM4/OS00MWM2LWJjZmEt/MmY5ZjZmMjMzMzUy/LnBuZw.webp" width={100} height={100} />
                        <img alt="Party TRex Emoji" src="https://imgproxy.attic.sh/cmzYsCyQ8syPgZvn1BCK6juAA0PW4JOGSbfxMegQV5U/rs:fit:540:540:1:1/t:1:FF00FF:false:false/aHR0cHM6Ly9hdHRp/Yy5zaC9ydW5wb2Qv/MDdmMTZjNmEtMTcx/Zi00Njc4LWEyNzQt/YzU3MGEyN2U1NjFj/LnBuZw.webp" width={100} height={100} className="-rotate-12" />
                    </div>
                    <h2 className="text-2xl font-semibold mt-6">No results found</h2>
                    <p className="text-gray-500">We couldn't find any profiles matching your search.</p>
                </div>
            ) : null}
        </section>
    );
}