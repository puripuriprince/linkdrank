"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartTooltip } from "@/components/ui/chart";
import { BarChart3 } from "lucide-react";
import {
	PolarAngleAxis,
	PolarGrid,
	Radar,
	RadarChart,
	ResponsiveContainer,
} from "recharts";

export interface UserMetrics {
	followers: number;
	connections: number;
	projects: number;
	experiences?: number;
	educations?: number;
	awards?: number;
}

export interface UserSkillsRadarProps {
	metrics: UserMetrics;
	className?: string;
}

export default function UserSkillsRadar({
	metrics,
	className,
}: UserSkillsRadarProps) {
	// Default values for metrics that might be missing
	const userMetrics = {
		followers: metrics.followers || 0,
		connections: metrics.connections || 0,
		projects: metrics.projects || 0,
		experiences: metrics.experiences || 0,
		educations: metrics.educations || 0,
		awards: metrics.awards || 0,
	};

	// Normalize values for better visualization
	const maxValues = {
		connections: 3000,
		followers: 250,
		projects: 150,
		experiences: 100,
		educations: 25,
		awards: 25,
	};

	// Transform and normalize data for chart
	const chartData = [
		{
			skill: "Connections",
			value: Math.min(10, (userMetrics.connections / maxValues.connections) * 10),
			originalValue: userMetrics.connections,
		},
		{
			skill: "Followers",
			value: Math.min(10, (userMetrics.followers / maxValues.followers) * 10),
			originalValue: userMetrics.followers,
		},
		{
			skill: "Projects",
			value: Math.min(10, (userMetrics.projects / maxValues.projects) * 10),
			originalValue: userMetrics.projects,
		},
		{
			skill: "Experiences",
			value: Math.min(10, (userMetrics.experiences / maxValues.experiences) * 10),
			originalValue: userMetrics.experiences,
		},
		{
			skill: "Educations",
			value: Math.min(10, (userMetrics.educations / maxValues.educations) * 10),
			originalValue: userMetrics.educations,
		},
		{
			skill: "Awards",
			value: Math.min(10, (userMetrics.awards / maxValues.awards) * 10),
			originalValue: userMetrics.awards,
		},
	];

	return (
		<Card className={className}>
			<CardHeader className="pb-2">
				<CardTitle className="flex items-center font-medium text-lg">
					<BarChart3 className="mr-2 h-4 w-4 text-primary" />
					Metrics
				</CardTitle>
			</CardHeader>
			<CardContent>
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
								name="User Metrics"
								dataKey="value"
								stroke="var(--primary)"
								fill="var(--primary)"
								fillOpacity={0.2}
							/>
							<ChartTooltip content={<CustomTooltip />} />
						</RadarChart>
					</ResponsiveContainer>
				</div>
			</CardContent>
		</Card>
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