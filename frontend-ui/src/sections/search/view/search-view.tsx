"use client";

// ----------------------------------------------------------------------

import { RelatedProfiles } from "@/sections/search/related-profiles";
import { ProfileGallery } from "@/sections/search/top-profiles";
import { SAMPLE_PROFILES } from "@/actions/profiles";
import { CONFIG } from "@/global-config";
import { useEffect, useState } from "react";
import { aiSearch } from "@/actions/search";
import { useSearchParams } from "next/navigation";

export function SearchView() {
  const query = useSearchParams().get("q");
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState<
    { profiles: any[]; relatedTags: any[] } | undefined
  >(undefined);

  useEffect(() => {
    if (query) {
      setLoading(true);
      aiSearch(query)
        .then((profiles) => {
          console.log("AI search results for :", query);
          setSearchResults({
            profiles: SAMPLE_PROFILES.map((p, i) => {
              return {
                id: i,
                ...p,
                picture: p.picture ?? `${CONFIG.assetsDir}/logo/logo.svg`,
              };
            }),
            relatedTags: [
              { id: "accessory", label: "Accessory" },
              { id: "face", label: "Face" },
              { id: "person", label: "Person" },
              { id: "hair", label: "Hair" },
              { id: "man", label: "Man" },
              { id: "hoodie", label: "Hoodie" },
              { id: "necklace", label: "Necklace" },
              { id: "black-bg", label: "Black Background" },
              { id: "purple", label: "Purple" },
              { id: "chain", label: "Chain" },
            ],
          });
        })
        .catch((error) => {
          console.error("Error performing AI search:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [query]);

  console.log("Search results:", searchResults);
  return (
    <>
      <ProfileGallery
        profiles={searchResults ? searchResults.profiles : []}
        loading={loading}
      />
      <RelatedProfiles
        relatedTags={searchResults ? searchResults.relatedTags : []}
        isLoading={loading}
      />
    </>
  );
}
