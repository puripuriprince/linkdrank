"use client";

import { useContext } from "react";

import { BrowseContext } from "./browse-context";

// ----------------------------------------------------------------------

export function useBrowseContext() {
  const context = useContext(BrowseContext);

  if (!context)
    throw new Error("useSearchContext must be use inside SearchProvider");

  return context;
}
