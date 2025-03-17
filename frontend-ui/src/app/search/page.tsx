import type { Metadata } from "next";

import { CONFIG } from "@/global-config";

import { SearchView } from "@/sections/search/view";

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Search - ${CONFIG.appName}` };

export default function Search() {
  return <SearchView />;
}
