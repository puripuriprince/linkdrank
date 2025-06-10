"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ProfilePreviewHorizontal,
  ProfilePreviewHorizontalSkeleton,
} from "@/components/profile-preview";
import { ProfileWithRelations } from "@/lib/db/types";
import { ProfileButtons } from "./components";
import { toast } from "sonner";
import { CONFIG } from "@/global-config";
import { Skeleton } from "@/components/ui/skeleton";

export type ProfileGalleryProps = {
  profiles: ProfileWithRelations[];
  loading?: boolean;
};

interface DesktopProfileDisplayProps {
  profile: ProfileWithRelations;
}

const DesktopProfileDisplaySkeleton: React.FC = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-10">
      <div className="mb-4 h-40 w-40">
        <Skeleton className="h-40 w-40 rounded-full" />
      </div>
      <Skeleton className="mb-2 h-6 w-48" />
      <Skeleton className="mb-6 h-4 w-64" />
      <div className="grid w-full grid-cols-2 gap-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
};

const MobileProfileDisplaySkeleton: React.FC = () => {
  return (
    <div className="flex flex-col items-center space-y-4">
      <Skeleton className="h-40 w-40 rounded-full" />
      <div className="text-center">
        <Skeleton className="mb-2 h-6 w-32" />
        <Skeleton className="h-4 w-48" />
      </div>
    </div>
  );
};

const DesktopProfileDisplay: React.FC<DesktopProfileDisplayProps> = ({
  profile,
}) => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-10">
      <div className="relative mb-4 h-40 w-40">
        <Image
          src={profile.profilePictureUrl || `${CONFIG.assetsDir}/logo/logo.svg`}
          alt={`${profile.firstName} ${profile.lastName}'s profile picture`}
          fill
          className="rounded-full object-cover"
        />
      </div>
      <div className="text-center">
        <h1 className="mb-2 text-2xl font-bold text-black dark:text-white">
          {`${profile.firstName} ${profile.lastName}`}
        </h1>
        <p className="mb-6 text-gray-500 dark:text-gray-300">
          {profile.headline}
        </p>
      </div>
      {/* Buttons Grid */}
      <div className="grid w-full grid-cols-2 gap-3">
        <ProfileButtons profile={profile} />
      </div>
      <div className="py-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(`https://www.linkedin.com/in/${profile.linkedinId}`)}
        >
          <Icon icon="mdi:linkedin" width="16" height="16" /> View on LinkedIn
        </Button>
      </div>
    </div>
  );
};

interface DesktopViewProps {
  selectedProfile: ProfileWithRelations;
  profiles: ProfileWithRelations[];
  onProfileSelect: (profile: ProfileWithRelations) => void;
  isLoading?: boolean;
}

const DesktopView: React.FC<DesktopViewProps> = ({
  selectedProfile,
  profiles,
  onProfileSelect,
  isLoading,
}) => {
  return (
    <div className="mx-auto hidden h-full w-full max-w-[calc(72rem+2rem)] grid-cols-2 md:grid overflow-hidden rounded-xl border-[0.5px] border-black/[0.13] dark:border-white/[0.13]">
      {/* Left Column */}
      {isLoading ? (
        <DesktopProfileDisplaySkeleton />
      ) : (
        <DesktopProfileDisplay profile={selectedProfile} />
      )}
      {/* Right Column: Horizontal Profile Previews */}
      <div className="flex flex-col p-10 dark:bg-zinc-900/80">
        <div className="mb-6 mt-1">
          <h1 className="line-clamp-3 text-xl font-semibold text-black dark:text-white">
            {isLoading ? "Loading..." : "More Profiles"}
          </h1>
        </div>
        <ScrollArea className="h-96 w-full">
          <div className="space-y-2 p-1">
            {isLoading
              ? Array(10)
                  .fill(0)
                  .map((_, index) => (
                    <ProfilePreviewHorizontalSkeleton
                      key={`skeleton-${index}`}
                    />
                  ))
              : profiles.map((profile) => (
                  <ProfilePreviewHorizontal
                    key={profile.id}
                    profile={profile}
                    selected={selectedProfile.id === profile.id}
                    onClick={() => onProfileSelect(profile)}
                  />
                ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

interface MobileProfileDisplayProps {
  profile: ProfileWithRelations;
}

const MobileProfileDisplay: React.FC<MobileProfileDisplayProps> = ({
  profile,
}) => {
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative h-40 w-40">
        <Image
          src={profile.profilePictureUrl || `${CONFIG.assetsDir}/logo/logo.svg`}
          alt={profile.headline || "Profile"}
          fill
          className="rounded-full object-cover"
        />
      </div>
      <div className="text-center">
        <h1 className="text-xl font-bold text-black dark:text-white">
          {`${profile.firstName} ${profile.lastName}`}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-300">
          {profile.headline}
        </p>
      </div>
    </div>
  );
};

interface MobileViewProps {
  selectedProfile: ProfileWithRelations;
  profiles: ProfileWithRelations[];
  onProfileSelect: (profile: ProfileWithRelations) => void;
  isLoading?: boolean;
}

const MobileView: React.FC<MobileViewProps> = ({
  selectedProfile,
  profiles,
  onProfileSelect,
  isLoading,
}) => {
  return (
    <div className="md:hidden flex flex-col items-center p-4">
      {isLoading ? (
        <MobileProfileDisplaySkeleton />
      ) : (
        <>
          <MobileProfileDisplay profile={selectedProfile} />
          {/* Buttons Grid */}
          <div className="grid grid-cols-2 gap-3 w-full mt-6">
            <ProfileButtons profile={selectedProfile} />
          </div>
          <div className="py-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`https://www.linkedin.com/in/${selectedProfile.linkedinId}`)}
            >
              <Icon icon="mdi:linkedin" width="16" height="16" /> View on
              LinkedIn
            </Button>
          </div>
        </>
      )}
      {/* Mobile Profile Selector */}
      <div className="mt-4 w-full">
        <ScrollArea className="relative w-full h-full">
          <div className="flex space-x-3 p-2">
            {isLoading
              ? Array(10)
                  .fill(0)
                  .map((_, index) => (
                    <Card
                      key={`skeleton-${index}`}
                      className="flex items-center w-40 h-40 cursor-pointer overflow-hidden"
                    >
                      <div className="relative h-24 w-24">
                        <Skeleton className="h-24 w-24 rounded-full" />
                      </div>
                    </Card>
                  ))
              : profiles.map((profile) => (
                  <Card
                    key={profile.id}
                    className={`flex items-center w-40 h-40 cursor-pointer overflow-hidden ${
                      selectedProfile.id === profile.id
                        ? "ring-2 ring-blue-500"
                        : ""
                    }`}
                    onClick={() => onProfileSelect(profile)}
                  >
                    <div className="relative h-24 w-24">
                      <Image
                        src={
                          profile.profilePictureUrl || `${CONFIG.assetsDir}/logo/logo.svg`
                        }
                        alt={`${profile.firstName} ${profile.lastName}`}
                        fill
                        className="object-cover rounded-full"
                      />
                    </div>
                  </Card>
                ))}
          </div>
          <div className="pointer-events-none absolute -right-1 bottom-0 top-0 h-full w-12 bg-gradient-to-l from-white to-transparent backdrop-blur-[2px] [mask-image:linear-gradient(to_left,black_0%,black_30%,transparent_100%)] transition-all duration-300 dark:from-black translate-x-0 opacity-100" />
        </ScrollArea>
      </div>
    </div>
  );
};

export function ProfileGallery({ profiles, loading }: ProfileGalleryProps) {
  const [selectedProfile, setSelectedProfile] = useState<ProfileWithRelations>(
    profiles.length > 0 ? profiles[0] : ({} as ProfileWithRelations),
  );

  useEffect(() => {
    if (profiles.length > 0) {
      setSelectedProfile(profiles[0]);
    }
  }, [profiles]);

  const handleProfileSelect = (profile: ProfileWithRelations) => {
    setSelectedProfile(profile);
  };

  return (
    <div className="flex flex-col h-full w-full">
      <section className="min-h-[34.75rem] md:h-[calc(100vh-10rem)] md:max-h-[31.25rem] md:min-h-[25rem]">
        <DesktopView
          selectedProfile={selectedProfile}
          profiles={profiles}
          onProfileSelect={handleProfileSelect}
          isLoading={loading}
        />
        <MobileView
          selectedProfile={selectedProfile}
          profiles={profiles}
          onProfileSelect={handleProfileSelect}
          isLoading={loading}
        />
      </section>
    </div>
  );
}
