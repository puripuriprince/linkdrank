"use client";

import { Toaster } from "sonner";

// ----------------------------------------------------------------------

export function Snackbar() {
  return (
    <Toaster
      expand
      gap={12}
      closeButton
      offset={16}
      visibleToasts={4}
      position="top-right"
    />
  );
}
