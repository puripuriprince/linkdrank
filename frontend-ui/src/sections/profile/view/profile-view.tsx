"use client";

// ----------------------------------------------------------------------

import { RelatedProfiles } from "@/sections/profile/related-profiles";
import { ProfileGallery } from "@/sections/profile/top-profiles";
import { SAMPLE_PROFILES } from "@/actions/profiles";
import { CONFIG } from "@/global-config";

export function ProfileView() {
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
      <ProfileGallery profiles={profiles} />
      <RelatedProfiles relatedTags={relatedTags} />
    </>
  );
}
