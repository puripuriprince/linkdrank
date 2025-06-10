"use client";

import { ChartTooltip } from "@/components/ui/chart";
import {
	PolarAngleAxis,
	PolarGrid,
	Radar,
	RadarChart,
	ResponsiveContainer,
} from "recharts";

interface LinkedInProfile {
	name: string;
	title: string;
	picture: string;
	color: string;
	metrics: {
		followers: number;
		connections: number;
		experiences: number;
		educations: number;
		skills: number;
		projects: number;
		honors: number;
	};
}

interface ProfileMetricsRadarProps {
	profile: LinkedInProfile;
}

export function ProfileMetricsRadar({ profile }: ProfileMetricsRadarProps) {
	const metrics = profile.metrics;

	// Normalize values for better visualization
	const maxValues = {
		followers: 500,
		connections: 500,
		experiences: 10,
		educations: 5,
		skills: 20,
		projects: 10,
		honors: 15,
	};

	// Transform and normalize data for chart
	const chartData = [
		{
			skill: "Followers",
			value: Math.min(10, (metrics.followers / maxValues.followers) * 10),
			originalValue: metrics.followers,
		},
		{
			skill: "Connections",
			value: Math.min(10, (metrics.connections / maxValues.connections) * 10),
			originalValue: metrics.connections,
		},
		{
			skill: "Experience",
			value: Math.min(10, (metrics.experiences / maxValues.experiences) * 10),
			originalValue: metrics.experiences,
		},
		{
			skill: "Education",
			value: Math.min(10, (metrics.educations / maxValues.educations) * 10),
			originalValue: metrics.educations,
		},
		{
			skill: "Skills",
			value: Math.min(10, (metrics.skills / maxValues.skills) * 10),
			originalValue: metrics.skills,
		},
		{
			skill: "Projects",
			value: Math.min(10, (metrics.projects / maxValues.projects) * 10),
			originalValue: metrics.projects,
		},
		{
			skill: "Honors",
			value: Math.min(10, (metrics.honors / maxValues.honors) * 10),
			originalValue: metrics.honors,
		},
	];

	return (
		<div className="h-[240px]">
			<ResponsiveContainer width="100%" height="100%">
				<RadarChart
					data={chartData}
					margin={{ top: 10, right: 30, bottom: 10, left: 30 }}
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
					<Radar
						name={profile.name}
						dataKey="value"
						stroke={profile.color}
						fill={profile.color}
						fillOpacity={0.2}
					/>
					<ChartTooltip content={<CustomTooltip />} />
				</RadarChart>
			</ResponsiveContainer>
		</div>
	);
}

interface TooltipProps {
	active?: boolean;
	payload?: Array<{
		payload: {
			skill: string;
			value: number;
			originalValue: number;
		};
	}>;
}

function CustomTooltip({ active, payload }: TooltipProps) {
	if (active && payload && payload.length) {
		return (
			<div className="rounded border bg-background p-2 shadow-sm">
				<p className="font-medium">{`${payload[0].payload.skill}: ${payload[0].payload.originalValue}`}</p>
			</div>
		);
	}
	return null;
} 