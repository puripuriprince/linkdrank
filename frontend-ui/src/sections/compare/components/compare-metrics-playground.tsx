"use client";

import { CombinedProfileMetricsRadar } from "../components/combined-profile-metrics-radar";
import { ProfileMetricsRadar } from "../components/profile-metrics-radar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Search, Users, UserPlus, X, MapPin, Award } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { SAMPLE_PROFILES } from "@/actions/profiles";
import { paths } from "@/routes/paths";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CONFIG } from "@/global-config";

// Maximum number of profiles that can be compared
const MAX_PROFILES = 6;

// Base chart colors
const CHART_COLORS = [
	"hsl(220, 70%, 65%)", // Softer Blue
	"hsl(10, 70%, 65%)", // Softer Red
	"hsl(130, 70%, 65%)", // Softer Green
	"hsl(40, 70%, 65%)", // Softer Amber
	"hsl(280, 70%, 65%)", // Softer Purple
	"hsl(170, 70%, 65%)", // Softer Teal
];

interface LinkedInProfile {
	firstName: string;
	lastName: string;
	headline: string;
	profilePictureUrl?: string;
	summary?: string;
	linkedinId: string;
	followersCount?: number;
	connectionsCount?: number;
	location?: {
		city?: string;
		state?: string;
		country?: string;
	};
	skills?: Array<{
		skill: {
			name: string;
		};
	}>;
	experiences?: Array<{
		title: string;
		organization: {
			name: string;
		};
		startDate: string;
		endDate: string;
		duration?: string;
	}>;
	educations?: Array<{
		school: {
			name: string;
		};
		degree: string;
		startYear: string;
		endYear: string;
	}>;
	projects?: Array<{
		title: string;
		description: string;
	}>;
	awards?: Array<{
		title: string;
		issuer: string;
	}>;
	color: string;
	metrics: {
		followers: number;
		connections: number;
		experiences: number;
		educations: number;
		skills: number;
		projects: number;
		awards: number;
	};
}

// Convert profile format to our internal format
function convertToProfileFormat(profile: any): LinkedInProfile {
	return {
		firstName: profile.firstName,
		lastName: profile.lastName,
		headline: profile.headline || "",
		profilePictureUrl: profile.profilePictureUrl || "",
		summary: profile.summary,
		linkedinId: profile.linkedinId,
		followersCount: profile.followersCount,
		connectionsCount: profile.connectionsCount,
		location: typeof profile.location === 'string'
			? { city: profile.location, state: "", country: "" }
			: profile.location,
		skills: profile.skills || [],
		experiences: profile.experiences || [],
		educations: profile.educations || [],
		projects: profile.projects || [],
		awards: profile.awards || [],
		color: "",
		metrics: {
			followers: profile.followersCount || 0,
			connections: profile.connectionsCount || 0,
			experiences: profile.experiences?.length || 0,
			educations: profile.educations?.length || 0,
			skills: profile.skills?.length || 0,
			projects: profile.projects?.length || 0,
			awards: profile.awards?.length || 0,
		},
	};
}

// Custom compact profile component
function ProfileItem({
	profile,
	onRemove,
}: {
	profile: LinkedInProfile;
	onRemove: () => void;
}) {
	return (
		<div
			className="group relative overflow-hidden rounded-md border border-border/50 transition-colors hover:bg-muted/20"
			style={{
				backgroundColor: `${profile.color}20`,
				borderLeft: `3px solid ${profile.color}`,
			}}
		>
			<Link
				href={`https://www.linkedin.com/in/${profile.linkedinId}`}
				className="flex items-center gap-3 p-2"
				target="_blank"
				rel="noopener noreferrer"
			>
				<div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border border-border/50">
					<Avatar className="h-full w-full object-cover">
						<AvatarImage
							src={profile.profilePictureUrl ?? `${CONFIG.assetsDir}/logo/logo.svg`}
							alt={`${profile.firstName} ${profile.lastName}'s profile picture`}
						/>
						<AvatarFallback>{profile.firstName ? profile.firstName[0].toUpperCase() : "U"}</AvatarFallback>
					</Avatar>
				</div>
				<div className="min-w-0 flex-1">
					<div className="flex items-center justify-between">
						<h3 className="truncate font-medium text-sm">
							{profile.firstName} {profile.lastName}
						</h3>
						<div className="flex items-center gap-2">
							<div className="flex items-center gap-1 text-xs">
								<Users className="h-3 w-3 text-blue-500" />
								<span>{profile.metrics.followers}</span>
							</div>
						</div>
					</div>
					<div className="mt-1 flex items-center gap-2">
						<p className="truncate text-muted-foreground text-xs">
							{profile.headline}
						</p>
					</div>
					<div className="mt-1 flex items-center gap-2 text-muted-foreground text-xs">
						<span className="flex items-center gap-1">
							<Building2 className="h-3 w-3 text-green-500" />
							{profile.metrics.experiences}
						</span>
						<span className="flex items-center gap-1">
							<Award className="h-3 w-3 text-purple-500" />
							{profile.metrics.awards}
						</span>
					</div>
				</div>
			</Link>
			<Button
				onClick={onRemove}
				size="sm"
				variant="ghost"
				className="-right-1 -top-1 absolute h-6 w-6 rounded-full p-0 opacity-0 transition-opacity group-hover:opacity-100"
			>
				<X className="h-3 w-3" />
				<span className="sr-only">Remove {profile.firstName} {profile.lastName}</span>
			</Button>
		</div>
	);
}

// Profile card with full metrics and radar chart
function ProfileCard({
	profile,
	onRemove,
}: {
	profile: LinkedInProfile;
	onRemove: () => void;
}) {
	return (
		<div
			className="group relative overflow-hidden rounded-lg border border-border/50 bg-card"
			style={{ borderLeftWidth: "3px", borderLeftColor: profile.color }}
		>
			<div className="p-4">
				{/* Header with avatar and name */}
				<div className="mb-3 flex items-start gap-3">
					<div className="h-12 w-12 overflow-hidden rounded-full border border-border/50">
					<Avatar className="h-full w-full object-cover">
						<AvatarImage
							src={profile.profilePictureUrl ?? `${CONFIG.assetsDir}/logo/logo.svg`}
							alt={`${profile.firstName} ${profile.lastName}'s profile picture`}
						/>
						<AvatarFallback>{profile.firstName ? profile.firstName[0].toUpperCase() : "U"}</AvatarFallback>
					</Avatar>
					</div>
					<div className="min-w-0 flex-1">
						<h3
							className="truncate font-medium text-base"
							style={{ color: profile.color }}
						>
							{profile.firstName} {profile.lastName}
						</h3>
						<p className="truncate text-muted-foreground text-xs">
							{profile.headline}
						</p>
						{profile.location && (
							<p className="truncate text-muted-foreground text-xs flex items-center gap-1 mt-1">
								<MapPin className="h-3 w-3" />
								{profile.location.city && profile.location.state
									? `${profile.location.city}, ${profile.location.state}`
									: profile.location.city || profile.location.state || profile.location.country}
							</p>
						)}
					</div>
				</div>

				{/* Metrics */}
				<div className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
					<div className="flex items-center gap-1.5">
						<Users className="h-3.5 w-3.5 text-blue-500" />
						<span>{profile.metrics.followers.toLocaleString()} fols</span>
					</div>
					<div className="flex items-center gap-1.5">
						<Building2 className="h-3.5 w-3.5 text-green-500" />
						<span>{profile.metrics.experiences.toLocaleString()} jobs</span>
					</div>
					<div className="flex items-center gap-1.5">
						<Award className="h-3.5 w-3.5 text-purple-500" />
						<span>{profile.metrics.awards.toLocaleString()} awards</span>
					</div>
					<div className="flex items-center gap-1.5">
						<Users className="h-3.5 w-3.5 text-amber-500" />
						<span>{profile.metrics.connections.toLocaleString()}{profile.metrics.connections >= 500 ? '+' : ''} conn.</span>
					</div>
				</div>

				{/* Radar chart */}
				<div className="mt-3 h-[260px]">
					<ProfileMetricsRadar profile={profile} />
				</div>
			</div>

			{/* Remove button */}
			<Button
				onClick={onRemove}
				size="sm"
				variant="outline"
				className="absolute top-2 right-2 h-7 w-7 rounded-full border-muted-foreground/30 bg-background/80 p-0 opacity-0 backdrop-blur-sm transition-opacity hover:bg-background hover:text-destructive group-hover:opacity-100"
			>
				<X className="h-3.5 w-3.5" />
				<span className="sr-only">Remove {profile.firstName} {profile.lastName}</span>
			</Button>
		</div>
	);
}

export default function CompareMetricsPlayground({
	users,
}: { users: string | null }) {
	const router = useRouter();
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedProfiles, setSelectedProfiles] = useState<LinkedInProfile[]>([]);
	const [isSearching, setIsSearching] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// On initial load, check URL for profile linkedinIds to compare
	useEffect(() => {
		async function loadProfilesFromUrl() {
			try {
				if (!users) {
					setIsLoading(false);
					return;
				}

				const profileIds = users.split(",").filter(Boolean);
				if (profileIds.length === 0) {
					setIsLoading(false);
					return;
				}

				// Fetch data for each profile in parallel
				const promises = profileIds.map((id) => fetchProfileData(decodeURIComponent(id)));
				const profiles = await Promise.all(promises);

				// Filter out any null results (profiles not found)
				const validProfiles = profiles.filter(Boolean) as LinkedInProfile[];

				// Assign colors
				validProfiles.forEach((profile, index) => {
					profile.color = CHART_COLORS[index % CHART_COLORS.length];
				});

				setSelectedProfiles(validProfiles);
			} catch (err) {
				console.error("Error loading profiles from URL:", err);
				setError("Failed to load profiles from URL parameters");
			} finally {
				setIsLoading(false);
			}
		}

		loadProfilesFromUrl();
	}, [users]);

	// Add a profile to the comparison
	const addProfile = async () => {
		if (!searchQuery.trim()) return;
		if (selectedProfiles.length >= MAX_PROFILES) {
			setError(
				`Maximum of ${MAX_PROFILES} profiles allowed for comparison`,
			);
			return;
		}

		// Extract linkedinId from search input
		let searchLinkedinId = searchQuery;
		if (searchQuery.includes('linkedin.com/in/')) {
			searchLinkedinId = searchQuery.replace('https://www.linkedin.com/in/', '').replace('/', '');
		}

		// Check if profile is already in the list
		if (
			selectedProfiles.some(
				(profile) => {
					const profileLinkedinId = profile.linkedinId;
					return profileLinkedinId.toLowerCase() === searchLinkedinId.toLowerCase();
				}
			)
		) {
			setError("This profile is already in your comparison");
			return;
		}

		setIsSearching(true);
		setError(null);

		try {
			const profileData = await fetchProfileData(searchQuery);

			if (!profileData) {
				setError(
					"Profile not found. Please check the LinkedIn URL or ID and try again.",
				);
				return;
			}

			// Assign a color from our color palette
			const colorIndex = selectedProfiles.length % CHART_COLORS.length;
			profileData.color = CHART_COLORS[colorIndex];

			setSelectedProfiles([...selectedProfiles, profileData]);
			setSearchQuery("");
		} catch (err) {
			setError("An error occurred while fetching profile data");
			console.error(err);
		} finally {
			setIsSearching(false);
		}
	};

	// Remove a profile from the comparison
	const removeProfile = (profileLinkedinId: string) => {
		setSelectedProfiles(
			selectedProfiles.filter((profile) => {
				const linkedinId = profile.linkedinId;
				return linkedinId !== profileLinkedinId;
			})
		);
	};

	// Update the URL with selected profiles (for sharing)
	const updateUrlWithProfiles = useCallback(() => {
		if (selectedProfiles.length > 0) {
			const profileIds = selectedProfiles.map((profile) => {
				// Extract linkedinId from the linkedinUrl
				const linkedinId = profile.linkedinId;
				return encodeURIComponent(linkedinId);
			}).join(",");
			router.push(paths.compare.details(profileIds), { scroll: false });
		} else {
			router.push(paths.compare.root, { scroll: false });
		}
	}, [selectedProfiles, router]);

	// Update URL when selected profiles change
	useEffect(() => {
		updateUrlWithProfiles();
	}, [updateUrlWithProfiles]);

	// Fetch profile data from the API
	const fetchProfileData = async (searchInput: string): Promise<LinkedInProfile | null> => {
		try {
			// Extract linkedinId from URL or use as-is if it's already just the ID
			let linkedinId = searchInput;
			if (searchInput.includes('linkedin.com/in/')) {
				linkedinId = searchInput.replace('https://www.linkedin.com/in/', '').replace('/', '');
			}

			// Try to fetch from database first
			try {
				const { getProfileForComparison } = await import("@/actions/profiles-db");
				const dbProfile = await getProfileForComparison(linkedinId);
				if (dbProfile) {
					return convertToProfileFormat(dbProfile);
				}
			} catch (error) {
				console.error('Database error, falling back to sample data:', error);
			}

			const profileData = SAMPLE_PROFILES.find(
				p => p.linkedinId === linkedinId
			)

			if (!profileData) {
				return null;
			}

			return convertToProfileFormat(profileData);
		} catch (error) {
			console.error("Error fetching profile data:", error);
			throw error;
		}
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-12">
				<p className="text-muted-foreground">Loading profile data...</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
			{/* Left Column - Profile Input & List */}
			<div className="space-y-4 md:col-span-1">
				<Card className="md:sticky md:top-20">
					<CardContent className="pt-0">
						{error && (
							<Alert variant="destructive" className="mb-4">
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}

						<div className="mb-5 flex gap-2">
							<div className="flex-1">
								<Label
									htmlFor="linkedin-url"
									className="mb-1.5 block font-medium text-sm"
								>
									Add LinkedIn Profile
								</Label>
								<div className="relative">
									<Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
									<Input
										id="linkedin-url"
										placeholder="Enter LinkedIn profile URL..."
										className="pl-9"
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										onKeyDown={(e) => e.key === "Enter" && addProfile()}
										disabled={
											isSearching || selectedProfiles.length >= MAX_PROFILES
										}
									/>
								</div>
							</div>
							<div className="flex items-end">
								<Button
									onClick={addProfile}
									disabled={
										isSearching ||
										!searchQuery.trim() ||
										selectedProfiles.length >= MAX_PROFILES
									}
								>
									<UserPlus className="mr-1 h-4 w-4" />
									Add
								</Button>
							</div>
						</div>

						<div className="mt-6">
							<h3 className="mb-3 font-medium text-muted-foreground text-sm">
								Selected Profiles ({selectedProfiles.length}/
								{MAX_PROFILES})
							</h3>

							<div className="max-h-[400px] space-y-2 overflow-y-auto pr-1">
								{selectedProfiles.length === 0 ? (
									<div className="py-6 text-center text-muted-foreground text-sm">
										Add LinkedIn profiles to compare
									</div>
								) : (
									selectedProfiles.map((profile) => {
										const linkedinId = profile.linkedinId;
										return (
											<ProfileItem
												key={linkedinId}
												profile={profile}
												onRemove={() => removeProfile(linkedinId)}
											/>
										);
									})
								)}
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Right Column - Chart */}
			<div className="h-full md:col-span-2">
				<Card>
					<CardContent className="pt-0 pb-6.5">
						<div className="mb-4">
							<Tabs defaultValue="combined" className="w-full">
								<TabsList className="mb-4">
									<TabsTrigger value="combined">Combined View</TabsTrigger>
									<TabsTrigger value="individual">Individual View</TabsTrigger>
								</TabsList>
								<TabsContent value="combined" className="pt-4">
									<CombinedProfileMetricsRadar profiles={selectedProfiles} />
								</TabsContent>
								<TabsContent value="individual" className="pt-4">
									<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
										{selectedProfiles.map((profile) => {
											const linkedinId = profile.linkedinId;
											return (
												<ProfileCard
													key={linkedinId}
													profile={profile}
													onRemove={() => removeProfile(linkedinId)}
												/>
											);
										})}
									</div>
								</TabsContent>
							</Tabs>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}