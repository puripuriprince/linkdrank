"use client";

import { useContext } from "react";

import { SearchContext } from "./search-context";

// ----------------------------------------------------------------------

export function useSearchContext() {
  const context = useContext(SearchContext);

  if (!context)
    throw new Error("useSearchContext must be use inside SearchProvider");

  return context;
}
