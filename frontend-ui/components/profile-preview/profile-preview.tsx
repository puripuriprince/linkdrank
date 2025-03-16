'use client';
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipTrigger } from '@radix-ui/react-tooltip';
import {TooltipContent} from "@/components/ui/tooltip";
import {CONFIG} from "@/src/global-config";
import {ProfileData} from "@/src/sections/profile/top-profiles";

// ----------------------------------------------------------------------


export interface ProfilePreviewProps {
    name: string;
    title: string;
    picture: string | null;
    currentCompany?: {
        name: string;
        logo: string;
    }
}

export const ProfilePreview: React.FC<ProfilePreviewProps> = ({
                                                     name,
                                                     title, picture,
                                                                  currentCompany
                                                 }) => {
    return (
        <Card className="relative w-56 p-4 bg-white dark:bg-black/80 shadow-md rounded-lg">

            {currentCompany && (
                <Tooltip>
                    <TooltipTrigger className="absolute top-2 right-2 bg-white dark:bg-gray-900 p-1 rounded-full shadow-md">
                        <img src={currentCompany.logo} alt="Company Logo" className="h-8 w-8 rounded-full"/>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{currentCompany.name}</p>
                    </TooltipContent>
                </Tooltip>
            )}

            {/* Profile Image */}
            <div className="flex justify-center mb-2">
                <Avatar className="h-16 w-16">
                    <AvatarImage src={picture ?? `${CONFIG.assetsDir}/logo/logo.svg`} alt={`${name}'s profile picture`} />
                    <AvatarFallback>{ name ? name[0].toUpperCase() : 'U' }</AvatarFallback>
                </Avatar>
            </div>

            {/* Profile Information */}
            <CardContent className="p-0 flex flex-col items-center text-center">
                <h3 className="font-bold text-lg text-black dark:text-white">{name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-300">{title}</p>
            </CardContent>
        </Card>
    );
};

interface ProfilePreviewHorizontalProps {
    profile: ProfileData;
    selected: boolean;
    onClick: () => void;
}

export const ProfilePreviewHorizontal: React.FC<ProfilePreviewHorizontalProps> = ({
                                                                                      profile,
                                                                                      selected,
                                                                                      onClick,
                                                                                  }) => {
    return (
        <Card
            onClick={onClick}
            className={`flex flex-row items-center gap-4 p-4 bg-white dark:bg-black/80 shadow-md rounded-lg cursor-pointer transition-all hover:shadow-xl ${
                selected ? "ring-2 ring-yellow-500" : "ring-0"
            }`}
        >
            <Avatar className="h-16 w-16">
                <AvatarImage src={profile.picture ?? `${CONFIG.assetsDir}/logo/logo.svg`} alt={`${profile.name}'s profile picture`} />
                <AvatarFallback>{ profile.name ? profile.name[0].toUpperCase() : 'U' }</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
                <h3 className="font-bold text-lg text-black dark:text-white">
                    {profile.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-300">
                    {profile.title}
                </p>
            </div>
        </Card>
    );
};