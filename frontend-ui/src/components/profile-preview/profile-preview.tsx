"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipTrigger } from "@radix-ui/react-tooltip";
import { TooltipContent } from "@/components/ui/tooltip";
import { CONFIG } from "@/global-config";
import { ProfileWithRelations } from "@/lib/db/types";
import { CompareSelectButton } from "@/sections/compare/components/compare-select-button";

// ----------------------------------------------------------------------

export interface ProfilePreviewProps {
  profile: ProfileWithRelations;
  onClick: () => void;
}

export const ProfilePreview: React.FC<ProfilePreviewProps> = ({
  profile,
  onClick,
}) => {
  const currentCompany = profile.experiences?.length && profile.experiences[0]?.organization?.logoUrl ? {
    name: profile.experiences[0].organization.name,
    logo: profile.experiences[0].organization.logoUrl
  } : null;
  
  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger onClick if user clicked on the compare button area
    const target = e.target as HTMLElement;
    if (target.closest('[data-compare-button]')) {
      e.stopPropagation();
      return;
    }
    onClick();
  };

  return (
    <Card
      onClick={handleCardClick}
      className="group relative w-56 p-4 bg-white dark:bg-black/80 shadow-md rounded-lg cursor-pointer hover:shadow-lg transition-shadow"
    >
      {/* Compare Select Button */}
      <div data-compare-button>
        <CompareSelectButton
          profileLinkedinId={profile.linkedinId}
        />
      </div>

      {currentCompany && (
        <Tooltip>
          <TooltipTrigger className="absolute top-2 left-2 bg-white dark:bg-gray-900 p-1 rounded-full shadow-md">
            <img
              src={currentCompany.logo}
              alt="Company Logo"
              className="h-8 w-8 rounded-full"
            />
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-white dark:text-black">{currentCompany.name}</p>
          </TooltipContent>
        </Tooltip>
      )}

      {/* Profile Image */}
      <div className="flex justify-center mb-2">
        <Avatar className="h-16 w-16">
          <AvatarImage
            src={profile.profilePictureUrl ?? `${CONFIG.assetsDir}/logo/logo.svg`}
            alt={`${profile.firstName} ${profile.lastName}'s profile picture`}
          />
          <AvatarFallback>{profile.firstName ? profile.firstName[0].toUpperCase() : "U"}</AvatarFallback>
        </Avatar>
      </div>

      {/* Profile Information */}
      <CardContent className="p-0 flex flex-col items-center text-center">
        <h3 className="font-bold text-lg text-black dark:text-white">{`${profile.firstName} ${profile.lastName}`}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-300">{profile.headline}</p>
      </CardContent>
    </Card>
  );
};

interface ProfilePreviewHorizontalProps {
  profile: ProfileWithRelations;
  selected: boolean;
  onClick: () => void;
}

export const ProfilePreviewHorizontal: React.FC<
  ProfilePreviewHorizontalProps
> = ({ profile, selected, onClick }) => {
  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger onClick if user clicked on the compare button area
    const target = e.target as HTMLElement;
    if (target.closest('[data-compare-button]')) {
      e.stopPropagation();
      return;
    }
    onClick();
  };

  return (
    <Card
      onClick={handleCardClick}
      className={`group relative flex flex-row items-center gap-4 p-4 bg-white dark:bg-black/80 shadow-md rounded-lg cursor-pointer transition-all hover:shadow-xl ${
        selected ? "ring-2 ring-yellow-500" : "ring-0"
      }`}
    >
      {/* Compare Select Button */}
      <div data-compare-button>
        <CompareSelectButton
          profileLinkedinId={profile.linkedinId}
        />
      </div>

      <Avatar className="h-16 w-16">
        <AvatarImage
          src={profile.profilePictureUrl ?? `${CONFIG.assetsDir}/logo/logo.svg`}
          alt={`${profile.firstName} ${profile.lastName}'s profile picture`}
        />
        <AvatarFallback>
          {profile.firstName ? profile.firstName[0].toUpperCase() : "U"}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <h3 className="font-bold text-lg text-black dark:text-white">
          {`${profile.firstName} ${profile.lastName}`}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-300">
          {profile.headline}
        </p>
      </div>
    </Card>
  );
};
