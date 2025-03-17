"use client";

// ----------------------------------------------------------------------

import { RelatedProfiles } from "@/sections/profile/related-profiles";
import { ProfileGallery } from "@/sections/profile/top-profiles";
import { SAMPLE_PROFILES } from "@/actions/profiles";
import { CONFIG } from "@/global-config";
import {useEffect, useState} from "react";
import {aiSearch} from "@/actions/search";
import { usePathname } from "next/navigation";

export function ProfileView() {
  const pathname = usePathname();
  const query = pathname.split(":").pop();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      setLoading(true);
      aiSearch(query)
            .then((profiles) => {
                console.log("AI search results for :", query);
            })
          .catch((error) => {
            console.error("Error performing AI search:", error);
          })
          .finally(() => {
            setLoading(false);
          });
    }
  }, [query]);

  const relatedTags = [
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
  ];

  const profiles = SAMPLE_PROFILES.map((p, i) => {
    return {
      id: i,
      ...p,
      picture: p.picture ?? `${CONFIG.assetsDir}/logo/logo.svg`,
    };
  });
  return (
    <>
      <ProfileGallery profiles={profiles} loading={true}/>
      <RelatedProfiles relatedTags={relatedTags} isLoading={true} />
    </>
  );
}
