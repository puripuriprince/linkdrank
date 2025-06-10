"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookCopy, Code2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface ExperienceCardSectionProps {
	experiences: any;
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
							const companyName = experience.companyName;

							const isCurrentExperience = experience.endDate === "Present";

							return (
								<div
									key={experience.title}
									className="overflow-hidden rounded-lg border border-border/50 bg-muted/10 transition-all hover:border-primary/20 hover:shadow-sm"
								>
									<div className="flex items-center justify-between border-border/40 border-b bg-muted px-4 py-2 dark:bg-muted/20">
										<div className="flex items-center gap-1.5">
											<Code2 className="h-3.5 w-3.5" />
											<h3 className="mb-1 font-semibold text-[#2300A7] hover:underline dark:text-[#75A9FF]">
												<Link
													href={experience.logo}
													target="_blank"
													rel="noopener noreferrer"
												>
													{companyName}
												</Link>
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