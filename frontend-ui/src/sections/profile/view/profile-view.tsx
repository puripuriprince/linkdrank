import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Code, ExternalLink, User } from "lucide-react";
import { Share2 } from "lucide-react";
import Image from "next/image";
import { SAMPLE_PROFILES } from "@/actions/profiles";
import UserSkillsRadar from "../components/user-skills-radar";
import { ExperienceCardSection } from "../components/experience-card-section";


const userData = SAMPLE_PROFILES[0];

export function ProfileView() {
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
                                                <Image
                                                    src={userData.picture ?? ''}
                                                    alt={`${userData.name}'s profile picture`}
                                                    width={96}
                                                    height={96}
                                                    className="h-full w-full object-cover"
                                                    priority
                                                />
                                            </div>
                                            <h1 className="mt-3 font-semibold text-[#2300A7] text-xl dark:text-[#75A9FF]">
                                                {userData.name}
                                            </h1>
                                            <div className="flex items-center justify-center gap-1 text-[#008080] text-sm dark:text-[#98FEE3]">
                                                <Link
                                                    href={userData.linkedinUrl ?? ''}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-0.5 hover:underline"
                                                >
                                                    @{userData.linkedinUrl?.split('/').pop() ?? ''}
                                                    <ExternalLink className="h-3 w-3 text-muted-foreground" />
                                                </Link>
                                            </div>

                                            <Button
                                                variant="default"
                                                size="sm"
                                                className="mx-auto mt-3 flex w-max items-center"
                                                asChild
                                            >
                                                <Link href={`/new?username=${userData.linkedinUrl?.split('/').pop()}`}>
                                                    <span className="-mt-0.5">Reindex</span>
                                                    <Badge className="text-xs" variant="secondary">
                                                        Plus
                                                    </Badge>
                                                </Link>
                                            </Button>

                                            {/* Social links */}
                                            <div className="mt-3 flex flex-wrap justify-center space-x-2">
                                                {/* Share button */}
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0"
                                                    aria-label="Share profile"
                                                >
                                                    <Share2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="p-4">
                                        {/* Stats grid */}
                                        <div className="mb-4 grid grid-cols-2 gap-2">
                                            <div className="rounded-md bg-muted/20 p-2 text-center">
                                                <div className="font-semibold text-lg text-primary">
                                                    {userData.experiences.length}
                                                </div>
                                                <div className="text-muted-foreground text-xs">
                                                    {userData.experiences.length > 1 ? 'Experiences' : 'Experience'}
                                                </div>
                                            </div>
                                            <div className="rounded-md bg-muted/20 p-2 text-center">
                                                <div className="font-semibold text-lg text-primary">
                                                    {userData.projects?.length ?? 0}
                                                </div>
                                                <div className="text-muted-foreground text-xs">
                                                    {userData.projects?.length ?? 0 > 1 ? 'Projects' : 'Project'}
                                                </div>
                                            </div>
                                            <div className="rounded-md bg-muted/20 p-2 text-center">
                                                <div className="font-semibold text-lg text-primary">
                                                    {userData.followers}
                                                </div>
                                                <div className="text-muted-foreground text-xs">
                                                    Followers
                                                </div>
                                            </div>
                                            <div className="rounded-md bg-muted/20 p-2 text-center">
                                                <div className="font-semibold text-lg text-primary">
                                                    {userData.connections}
                                                </div>
                                                <div className="text-muted-foreground text-xs">
                                                    Connections
                                                </div>
                                            </div>
                                        </div>

                                        {/* Location */}
                                        {(userData.location?.city || userData.location.country) && (
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
                                                {userData.about || "No information available"}
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
                                                    userData.skills.map((skill) => (
                                                        <span
                                                            key={skill}
                                                            className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 font-medium text-primary text-xs"
                                                        >
                                                            {skill}
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

                                {/* Right column - GitHub Metrics */}
                                <div>
                                    <UserSkillsRadar
                                        metrics={{
                                            followers: userData.followers ?? 0,
                                            connections: userData.connections ?? 0,
                                            projects: userData.projects?.length ?? 0,
                                            experiences: userData.experiences?.length ?? 0,
                                            educations: userData.educations?.length ?? 0,
                                            honors: userData.honors?.length ?? 0,
                                        }}
                                        className="h-full"
                                    />
                                </div>
                            </div>

                            {/* Bottom section - Full width sections */}
                            <div className="w-full space-y-6">
                                <ExperienceCardSection
                                    experiences={userData.experiences}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}