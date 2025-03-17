import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";

export const ProfilePreviewSkeleton: React.FC = () => {
  return (
    <Card className="relative w-56 p-4 bg-white dark:bg-black/80 shadow-md rounded-lg">
      {/* Company Logo Skeleton */}
      <div className="absolute top-2 right-2">
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>

      {/* Profile Image Skeleton */}
      <div className="flex justify-center mb-2">
        <Skeleton className="h-16 w-16 rounded-full" />
      </div>

      {/* Profile Information Skeleton */}
      <CardContent className="p-0 flex flex-col items-center text-center gap-2">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-4 w-32" />
      </CardContent>
    </Card>
  );
};

export const ProfilePreviewHorizontalSkeleton: React.FC = () => {
  return (
    <Card
      className={
        "flex flex-row items-center gap-4 p-4 bg-white dark:bg-black/80 shadow-md rounded-lg cursor-pointer transition-all hover:shadow-xl"
      }
    >
      <Skeleton className="h-16 w-16 rounded-full" />
      <div className="flex flex-col gap-2 w-full">
        <h3 className="font-bold text-lg text-black dark:text-white">
          <Skeleton className="h-5 w-32" />
        </h3>
        <div className="text-sm text-gray-500 dark:text-gray-300">
          <Skeleton className="h-8 w-52" />
        </div>
      </div>
    </Card>
  );
};
