import type { Metadata } from "next";
import { ProfileView } from "@/sections/profile/view/profile-view";

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: "",
  description: "",
};

export default function Page() {
  return <ProfileView />;
}
