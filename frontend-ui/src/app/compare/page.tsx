import type { Metadata } from "next";

import { CONFIG } from "@/global-config";

import { CompareView } from "@/sections/compare/view/compare-view";

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Compare - ${CONFIG.appName}` };

export default function Compare() {
  return <CompareView />;
}
