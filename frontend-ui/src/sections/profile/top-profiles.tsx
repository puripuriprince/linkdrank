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
import { Profile } from "@/types/profile";
import { ProfileButtons } from "./components";
import { toast } from "sonner";
import { CONFIG } from "@/global-config";
import { Skeleton } from "@/components/ui/skeleton";

export type ProfileGalleryProps = {
  profiles: Profile[];
  loading?: boolean;
};

interface DesktopProfileDisplayProps {
  profile: Profile;
}

const DesktopProfileDisplaySkeleton: React.FC = () => {
  return (
    <div className="relative h-full w-full overflow-hidden border-r-[0.5px] border-black/[0.13] dark:border-white/[0.13]">
      <Image
        src={`${CONFIG.assetsDir}/logo/logo.svg`}
        alt={"Linky"}
        width={500}
        height={500}
        className="rounded-full object-cover animate-pulse"
      />
    </div>
  );
};

const MobileProfileDisplaySkeleton: React.FC = () => {
  return (
    <Image
      src={`${CONFIG.assetsDir}/logo/logo.svg`}
      alt={"Linky"}
      width={400}
      height={400}
      className="rounded-full object-cover animate-pulse"
    />
  );
};

const DesktopProfileDisplay: React.FC<DesktopProfileDisplayProps> = ({
  profile,
}) => {
  return (
    <div className="relative h-full w-full overflow-hidden border-r-[0.5px] border-black/[0.13] dark:border-white/[0.13]">
      <div className="flex h-full w-full items-center justify-center">
        <div className="relative flex h-full w-full flex-col items-center justify-center">
          {/* Top overlay */}
          <div className="absolute left-8 top-9 z-20">
            <h1 className="line-clamp-3 text-xl font-semibold text-black dark:text-white drop-shadow">
              Most Relevant Profiles
            </h1>
          </div>
          <div className="absolute right-8 top-9 flex gap-1 z-20">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.info("Added to favorites!")}
            >
              <Icon icon="mdi:heart" width="16" height="16" /> Favorite
            </Button>
          </div>
          {/* Main display */}
          <div className="flex h-full w-full gap-12 items-center justify-center p-10">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative h-24 w-24">
                <Image
                  src={profile.picture || `${CONFIG.assetsDir}/logo/logo.svg`}
                  alt={profile.name}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <div className="text-center">
                <h1 className="text-xl font-bold text-black dark:text-white">
                  {profile.name}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-300">
                  {profile.title}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 w-1/2">
              <ProfileButtons profile={profile} />
            </div>
          </div>
          {/* Bottom button */}
          <div className="mt-auto pb-10">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(profile.linkedinUrl)}
            >
              <Icon icon="mdi:linkedin" width="16" height="16" /> View on
              LinkedIn
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface DesktopViewProps {
  selectedProfile: Profile;
  profiles: Profile[];
  onProfileSelect: (profile: Profile) => void;
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
  profile: Profile;
}

const MobileProfileDisplay: React.FC<MobileProfileDisplayProps> = ({
  profile,
}) => {
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative h-40 w-40">
        <Image
          src={profile.picture || `${CONFIG.assetsDir}/logo/logo.svg`}
          alt={profile.title}
          fill
          className="rounded-full object-cover"
        />
      </div>
      <div className="text-center">
        <h1 className="text-xl font-bold text-black dark:text-white">
          {profile.name}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-300">
          {profile.title}
        </p>
      </div>
    </div>
  );
};

interface MobileViewProps {
  selectedProfile: Profile;
  profiles: Profile[];
  onProfileSelect: (profile: Profile) => void;
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
              onClick={() => window.open(selectedProfile.linkedinUrl)}
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
                          profile.picture || `${CONFIG.assetsDir}/logo/logo.svg`
                        }
                        alt={profile.name}
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
  const [selectedProfile, setSelectedProfile] = useState<Profile>(
    profiles.length > 0 ? profiles[0] : ({} as Profile),
  );

  useEffect(() => {
    if (profiles.length > 0) {
      setSelectedProfile(profiles[0]);
    }
  }, [profiles]);

  const handleProfileSelect = (profile: Profile) => {
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
