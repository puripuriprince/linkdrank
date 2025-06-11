import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Code, ExternalLink, User } from "lucide-react";
import { Share2 } from "lucide-react";
import Image from "next/image";
import { SAMPLE_PROFILES } from "@/actions/profiles";
import { getProfileForComponents } from "@/actions/profiles-db";
import type { ProfileForComponents } from "@/types/profile-components";
import UserSkillsRadar from "../../../components/user-skills-radar";
import { ExperienceCardSection } from "@/sections/profile/components/experience-card-section";
import { EducationCardSection } from "@/sections/profile/components/education-card-section";
import { ProjectsCardSection } from "@/sections/profile/components/projects-card-section";
import { AwardsCardSection } from "@/sections/profile/components/awards-card-section";
import { CertificationsCardSection } from "@/sections/profile/components/certifications-card-section";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CONFIG } from "@/global-config";

interface ProfileViewProps {
    handle: string;
}

export async function ProfileView({ handle }: ProfileViewProps) {
    // Try to fetch from database first, then fall back to sample data
    let userData: ProfileForComponents | any;
    try {
        userData = await getProfileForComponents(handle);
    } catch (error) {
        console.error('Database error, falling back to sample data:', error);
    }
    
    // If not found in database, try sample data
    if (!userData) {
        userData = SAMPLE_PROFILES.find(profile => profile.linkedinId === handle);
    }

    // If profile not found, show 404-like message
    if (!userData) {
        return (
            <div className="flex min-h-screen flex-col bg-background">
                <main className="flex-1">
                    <div className="mx-auto w-full px-4 py-8 lg:px-10 lg:py-16">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold text-foreground mb-4">Profile Not Found</h1>
                            <p className="text-muted-foreground mb-8">
                                The profile you&#39;re looking for doesn&#39;t exist or has been removed.
                            </p>
                            <Button asChild>
                                <Link href="/browse">Browse Profiles</Link>
                            </Button>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <main className="flex-1">
                <div className="mx-auto w-full px-4 py-2 lg:px-10 lg:py-8">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
                        {/* Left column - Profile sidebar */}
                        <div className="md:col-span-3">
                            <div className="md:sticky md:top-20">
                                <Card className="gap-0 overflow-hidden pt-0">
                                    <CardHeader className="p-0">
                                        <div className="relative border-border/50 border-b bg-muted p-4 text-center dark:border-border/20 dark:bg-muted/20">
                                            <div className="mx-auto h-24 w-24 overflow-hidden rounded-full border-2 border-background shadow-sm">
                                                <Avatar className="h-full w-full object-cover">
                                                    <AvatarImage
                                                        src={userData.profilePictureUrl ?? `${CONFIG.assetsDir}/logo/logo.svg`}
                                                        alt={`${userData.firstName} ${userData.lastName}'s profile picture`}
                                                    />
                                                    <AvatarFallback>{userData.firstName ? userData.firstName[0].toUpperCase() : "U"}</AvatarFallback>
                                                </Avatar>
                                            </div>
                                            <h1 className="mt-3 font-semibold text-[#2300A7] text-xl dark:text-[#75A9FF]">
                                                {`${userData.firstName} ${userData.lastName}`}
                                            </h1>
                                            <div className="flex items-center justify-center gap-1 text-[#008080] text-sm dark:text-[#98FEE3]">
                                                <Link
                                                    href={`https://www.linkedin.com/in/${userData.linkedinId}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-0.5 hover:underline"
                                                >
                                                    @{userData.linkedinId}
                                                    <ExternalLink className="h-3 w-3 text-muted-foreground" />
                                                </Link>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="p-4">
                                        {/* Stats grid */}
                                        <div className="mb-4 grid grid-cols-2 gap-2">
                                            <div className="rounded-md bg-muted/20 p-2 text-center">
                                                <div className="font-semibold text-lg text-primary">
                                                    {userData.experiences?.length ?? 0}
                                                </div>
                                                <div className="text-muted-foreground text-xs">
                                                    {(userData.experiences?.length ?? 0) !== 1 ? 'Experiences' : 'Experience'}
                                                </div>
                                            </div>
                                            <div className="rounded-md bg-muted/20 p-2 text-center">
                                                <div className="font-semibold text-lg text-primary">
                                                    {userData.projects?.length ?? 0}
                                                </div>
                                                <div className="text-muted-foreground text-xs">
                                                    {(userData.projects?.length ?? 0) !== 1 ? 'Projects' : 'Project'}
                                                </div>
                                            </div>
                                            <div className="rounded-md bg-muted/20 p-2 text-center">
                                                <div className="font-semibold text-lg text-primary">
                                                    {userData.followersCount ?? 0}
                                                </div>
                                                <div className="text-muted-foreground text-xs">
                                                    Followers
                                                </div>
                                            </div>
                                            <div className="rounded-md bg-muted/20 p-2 text-center">
                                                <div className="font-semibold text-lg text-primary">
                                                    {userData.connectionsCount ?? 0}
                                                </div>
                                                <div className="text-muted-foreground text-xs">
                                                    Connections
                                                </div>
                                            </div>
                                        </div>

                                        {/* Location */}
                                        {userData.location && (userData.location.city || userData.location.country) && (
                                            <div className="mb-3 flex items-center gap-2 text-sm">
                                                <span className="text-muted-foreground">
                                                    {[userData.location?.city, userData.location?.state, userData.location?.country]
                                                        .filter(Boolean)
                                                        .join(", ")}
                                                </span>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {/* Middle and Right columns */}
                        <div className="md:col-span-9">
                            {/* Top section with 2 columns layout */}
                            <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Left column - About and Tech Stack stacked vertically */}
                                <div className="flex flex-col gap-6">
                                    {/* About section */}
                                    <Card className="flex-1 gap-0">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="flex items-center font-medium text-lg">
                                                <User className="mr-2 h-4 w-4 text-primary" />
                                                About
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-muted-foreground text-sm">
                                                {userData.summary || "No information available"}
                                            </p>
                                        </CardContent>
                                    </Card>

                                    {/* Stack section */}
                                    <Card className="flex-1">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="flex items-center font-medium text-lg">
                                                <Code className="mr-2 h-4 w-4 text-primary" />
                                                Skills
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex flex-wrap gap-2">
                                                {userData.skills && userData.skills.length > 0 ? (
                                                    userData.skills.map((userSkill: any) => (
                                                        <span
                                                            key={`${userSkill.userId}-${userSkill.skillId}`}
                                                            className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 font-medium text-primary text-xs"
                                                        >
                                                            {userSkill.skill.name}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <p className="text-muted-foreground text-sm">
                                                        No skills information available
                                                    </p>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Right column - User Metrics */}
                                <div>
                                    <UserSkillsRadar
                                        metrics={{
                                            followers: userData.followersCount ?? 0,
                                            connections: userData.connectionsCount ?? 0,
                                            projects: userData.projects?.length ?? 0,
                                            experiences: userData.experiences?.length ?? 0,
                                            educations: userData.educations?.length ?? 0,
                                            awards: userData.awards?.length ?? 0,
                                        }}
                                        className="h-full"
                                    />
                                </div>
                            </div>

                            {/* Bottom section - Full width sections */}
                            <div className="w-full space-y-6">
                                <ExperienceCardSection
                                    experiences={userData.experiences || []}
                                />
                                <EducationCardSection
                                    educations={userData.educations || []}
                                />
                                <ProjectsCardSection
                                    projects={userData.projects || []}
                                />
                                <AwardsCardSection
                                    awards={userData.awards || []}
                                />
                                <CertificationsCardSection
                                    certifications={userData.certifications || []}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}