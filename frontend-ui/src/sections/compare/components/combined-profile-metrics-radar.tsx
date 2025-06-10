"use client";

import { Legend, PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";

interface LinkedInProfile {
	firstName: string;
	lastName: string;
	headline: string;
	profilePictureUrl?: string;
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

interface CombinedProfileMetricsRadarProps {
	profiles: LinkedInProfile[];
}

export function CombinedProfileMetricsRadar({
	profiles,
}: CombinedProfileMetricsRadarProps) {
	// Early return if no profiles
	if (!profiles.length) {
		return (
			<div className="flex h-[400px] items-center justify-center text-muted-foreground">
				No profiles selected
			</div>
		);
	}

	// Create config object for ChartContainer
	const chartConfig = profiles.reduce(
		(config, profile) => {
			const profileName = `${profile.firstName} ${profile.lastName}`;
			config[profileName] = {
				label: profileName,
				color: profile.color,
			};
			return config;
		},
		{} as Record<string, { label: string; color: string }>,
	);

	// Normalize values for better visualization
	const maxValues = {
		followers: 500,
		connections: 500,
		experiences: 10,
		educations: 5,
		skills: 20,
		projects: 10,
		awards: 15,
	};

	// Define the metrics we want to display
	const metricsToDisplay = [
		{ key: "followers", label: "Followers" },
		{ key: "connections", label: "Connections" },
		{ key: "experiences", label: "Experience" },
		{ key: "educations", label: "Education" },
		{ key: "skills", label: "Skills" },
		{ key: "projects", label: "Projects" },
		{ key: "awards", label: "Awards" },
	];

	// Transform and normalize data for combined chart
	const chartData = metricsToDisplay.map((metric) => {
		const result: Record<string, number | string | undefined> = {
			skill: metric.label,
		};

		// For each profile, normalize their value for this metric
		for (const profile of profiles) {
			const profileName = `${profile.firstName} ${profile.lastName}`;
			let value: number | undefined;

			// Get the value for the current metric from the profile
			if (metric.key === "followers") {
				value = profile.metrics.followers;
			} else if (metric.key === "connections") {
				value = profile.metrics.connections;
			} else if (metric.key === "experiences") {
				value = profile.metrics.experiences;
			} else if (metric.key === "educations") {
				value = profile.metrics.educations;
			} else if (metric.key === "skills") {
				value = profile.metrics.skills;
			} else if (metric.key === "projects") {
				value = profile.metrics.projects;
			} else if (metric.key === "awards") {
				value = profile.metrics.awards;
			}

			// Store original value for tooltip
			result[`${profileName}Original`] = value;

			// Calculate normalized value
			let normalizedValue = 0;

			if (metric.key === "followers") {
				normalizedValue = Math.min(10, ((value ?? 0) / maxValues.followers) * 10);
			} else if (metric.key === "connections") {
				normalizedValue = Math.min(10, ((value ?? 0) / maxValues.connections) * 10);
			} else if (metric.key === "experiences") {
				normalizedValue = Math.min(10, ((value ?? 0) / maxValues.experiences) * 10);
			} else if (metric.key === "educations") {
				normalizedValue = Math.min(10, ((value ?? 0) / maxValues.educations) * 10);
			} else if (metric.key === "skills") {
				normalizedValue = Math.min(10, ((value ?? 0) / maxValues.skills) * 10);
			} else if (metric.key === "projects") {
				normalizedValue = Math.min(10, ((value ?? 0) / maxValues.projects) * 10);
			} else if (metric.key === "awards") {
				normalizedValue = Math.min(10, ((value ?? 0) / maxValues.awards) * 10);
			}

			// Add normalized value to result
			result[profileName] = normalizedValue;
		}

		return result;
	});

	return (
		<div className="h-[400px]">
			<ChartContainer config={chartConfig} className="h-full w-full">
				<RadarChart
					data={chartData}
					margin={{ top: 20, right: 30, bottom: 30, left: 30 }}
				>
					<PolarGrid
						gridType="polygon"
						stroke="#cccccc"
						strokeDasharray="2 2"
					/>
					<PolarAngleAxis
						dataKey="skill"
						tick={{ fill: "#888888", fontSize: 12 }}
					/>

					{profiles.map((profile) => {
						const profileName = `${profile.firstName} ${profile.lastName}`;
						return (
							<Radar
								key={profileName}
								name={profileName}
								dataKey={profileName}
								stroke={profile.color}
								fill={profile.color}
								fillOpacity={0.2}
							/>
						);
					})}

					<Legend />
					<ChartTooltip content={<CombinedTooltip profiles={profiles} />} />
				</RadarChart>
			</ChartContainer>
		</div>
	);
}

interface CombinedTooltipProps {
	active?: boolean;
	payload?: Array<{
		name: string;
		dataKey: string;
		color: string;
		payload: Record<string, unknown>;
	}>;
	profiles: LinkedInProfile[];
}

function CombinedTooltip({
	active,
	payload,
	profiles,
}: CombinedTooltipProps) {
	if (active && payload && payload.length) {
		const skill = payload[0].payload.skill as string;

		return (
			<div className="rounded border bg-background p-2 shadow-sm">
				<p className="mb-1 font-medium">{skill}</p>
				{profiles.map((profile) => {
					const profileName = `${profile.firstName} ${profile.lastName}`;
					return (
						<p key={profileName} style={{ color: profile.color }}>
							{profileName}:{" "}
							{payload[0].payload[`${profileName}Original`] as number}
						</p>
					);
				})}
			</div>
		);
	}
	return null;
} 