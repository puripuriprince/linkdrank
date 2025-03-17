"use client";

import type { SearchContextValue } from "@/types";

import { createContext } from "react";

// ----------------------------------------------------------------------

export const SearchContext = createContext<SearchContextValue | undefined>(
  undefined,
);
