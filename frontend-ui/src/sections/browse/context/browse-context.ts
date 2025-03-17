"use client";

import type { SearchContextValue } from "@/types";

import { createContext } from "react";

// ----------------------------------------------------------------------

export const BrowseContext = createContext<SearchContextValue | undefined>(
  undefined,
);
