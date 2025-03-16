"use client";

// ----------------------------------------------------------------------

import { AISearchForm } from "@/src/sections/profile/components/ai-search-form";
import React from "react";

export function AISearchView() {
  return (
    <section className="w-full max-w-sm m-auto">
      <h2 className="mb-2 text-xl font-semibold text-system-marketing-primary">
        AI Search
      </h2>
      <p className="text-sm text-system-marketing-secondary mb-3">
        Search for peoples profiles using AI. Describe the person you are
        looking for
      </p>
      <AISearchForm />
    </section>
  );
}
