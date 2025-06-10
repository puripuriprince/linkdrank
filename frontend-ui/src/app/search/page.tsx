"use client";

import { AISearchView } from "@/sections/search/view/ai-search-view";
import { SearchView } from "@/sections/search/view/search-view";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');

  if (query) {
    return <SearchView />;
  }

  return <AISearchView />;
}
