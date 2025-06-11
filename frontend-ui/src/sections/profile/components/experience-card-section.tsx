"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookCopy } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { ExperienceForComponents } from "@/types/profile-components";

interface ExperienceCardSectionProps {
	experiences: ExperienceForComponents[];
}

export const ExperienceCardSection = ({
	experiences
}: ExperienceCardSectionProps) => {
	const [visibleExperiencesCount, setVisibleExperiencesCount] = useState(6);

	const visibleExperiences = experiences.slice(0, visibleExperiencesCount);
	const hasMoreExperiences = experiences.length > visibleExperiencesCount;

	return (
		experiences.length > 0 && (
			<Card className="w-full">
				<CardHeader>
					<CardTitle className="flex items-center font-medium text-lg">
						<BookCopy className="mr-2 h-4 w-4 text-primary" />
						Featured Experiences
					</CardTitle>
				</CardHeader>
				<CardContent>
					<section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
						{visibleExperiences.map((experience) => {
							const experienceName = experience.title;
							const companyName = experience.organization.name;

							const isCurrentExperience = !experience.endDate;

							return (
								<div
									key={experience.title}
									className="overflow-hidden rounded-lg border border-border/50 bg-muted/10 transition-all hover:border-primary/20 hover:shadow-sm"
								>
									<div className="flex items-center justify-between border-border/40 border-b bg-muted px-4 py-2 dark:bg-muted/20">
										<div className="flex items-center gap-2">
											<Avatar className="h-6 w-6">
												<AvatarImage 
													src={experience.organization.logoUrl || undefined} 
													alt={`${companyName} logo`} 
												/>
												<AvatarFallback className="text-xs font-medium">
													{companyName.charAt(0).toUpperCase()}
												</AvatarFallback>
											</Avatar>
											<h3 className="mb-1 font-semibold text-[#2300A7] hover:underline dark:text-[#75A9FF]">
												{experience.organization.linkedinUrl ? (
													<Link
														href={experience.organization.linkedinUrl}
														target="_blank"
														rel="noopener noreferrer"
													>
														{companyName}
													</Link>
												) : (
													<span>{companyName}</span>
												)}
											</h3>
										</div>
										<div className="flex items-center gap-1.5">
											{isCurrentExperience && (
												<span className="inline-flex items-center rounded-full bg-[#E87701]/10 px-2 py-0.5 font-medium text-[#E87701] text-xs dark:bg-[#FFC799]/10 dark:text-[#FFC799]">
													Working here
												</span>
											)}
										</div>
									</div>
									<div className="bg-background/50 p-4">
										<p className="mb-3 line-clamp-2 text-muted-foreground text-xs">
											{experience.description || "No description available."}
										</p>
									</div>
								</div>
							);
						})}
					</section>
				</CardContent>
				{hasMoreExperiences && (
					<div className="mt-6 text-center">
						<Button
							variant="outline"
							size="sm"
							onClick={() => setVisibleExperiencesCount((prev) => prev + 6)}
							className="px-4 py-1 text-xs"
						>
							Load More Experiences
						</Button>
					</div>
				)}
			</Card>
		)
	);
};