import type { Metadata } from "next";

import { CONFIG } from "@/global-config";

import { BrowseView } from "@/sections/browse/view";

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Browse - ${CONFIG.appName}` };

export default function Search() {
  return <BrowseView />;
}
