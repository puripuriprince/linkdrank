"use client";

import type { SearchContextValue } from "src/types/search";

import { createContext } from "react";

// ----------------------------------------------------------------------

export const SearchContext = createContext<SearchContextValue | undefined>(
  undefined,
);
