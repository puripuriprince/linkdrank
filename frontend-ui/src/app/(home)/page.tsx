import type { Metadata } from "next";

import { HomeView } from "@/sections/home/view";

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: "",
  description: "",
};

export default function Page() {
  return <HomeView />;
}
