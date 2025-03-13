'use client';
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// ----------------------------------------------------------------------


export interface ProfilePreviewProps {
    name: string;
    title: string;
    picture?: string | null;
}

export const ProfilePreview: React.FC<ProfilePreviewProps> = ({
                                                     name,
                                                     title, picture = "/api/placeholder/150/150",
                                                 }) => {
    return (
        <Card className="w-56 p-4 bg-white dark:bg-black/80 shadow-md rounded-lg">
            {/* Profile Image */}
            <div className="flex justify-center mb-2">
                <Avatar className="h-28 w-28">
                    <AvatarImage src={picture ?? ''} alt={`${name}'s profile picture`} />
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
