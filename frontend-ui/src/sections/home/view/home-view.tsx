"use client";

// ----------------------------------------------------------------------

import { HomeProfiles } from "@/sections/home/home-profiles";

import { HomeHero } from "../home-hero";

export function HomeView() {
  return (
    <>
      <HomeHero />
      <HomeProfiles />
    </>
  );
}
