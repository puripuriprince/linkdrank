"use client";

// ----------------------------------------------------------------------

import React from "react";
import { AddProfileForm } from "@/sections/profile/components/add-profile-form";

export function AddProfileView() {
  return (
    <section className="w-full max-w-sm m-auto">
      <h2 className="mb-2 text-xl font-semibold text-system-marketing-primary">
        Add profile
      </h2>
      <p className="text-sm text-system-marketing-secondary mb-3">
        Add your profile to the linky platform.
      </p>
      <AddProfileForm />
    </section>
  );
}
