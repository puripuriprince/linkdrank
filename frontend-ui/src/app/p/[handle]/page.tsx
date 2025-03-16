import type { Metadata } from "next";

import { ProfileView } from "@/src/sections/profile/view";

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: "",
  description: "",
};

export default function Page() {
  return <ProfileView />;
}
