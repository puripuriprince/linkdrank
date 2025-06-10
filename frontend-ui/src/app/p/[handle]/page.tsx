import type { Metadata } from "next";
import { ProfileView } from "@/sections/profile/view/profile-view";

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: "Profile",
  description: "View profile details",
};

interface PageProps {
  params: Promise<{
    handle: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { handle } = await params;
  return <ProfileView handle={handle} />;
}
