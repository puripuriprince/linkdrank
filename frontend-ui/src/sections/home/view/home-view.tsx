'use client';

// ----------------------------------------------------------------------

import {HomeHero} from "../home-hero";
import {HomeProfiles} from "@/src/sections/home/home-profiles";

export function HomeView() {

  return (
    <>
      <HomeHero/>
      <HomeProfiles/>
    </>
  );
}