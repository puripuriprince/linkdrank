"use client";

import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const MAX_PROFILES = 6;

interface CompareSelectButtonProps {
	profileLinkedinId: string;
}

export function CompareSelectButton({
	profileLinkedinId,
}: CompareSelectButtonProps) {
	// Using nuqs to manage selected profile IDs in URL state
	const [selectedProfiles, setSelectedProfiles] = useQueryState(
		"u",
		parseAsArrayOf(parseAsString, ",").withDefault([]),
	);
	const [isSelected, setIsSelected] = useState(false);
	const [isDisabled, setIsDisabled] = useState(false);

	// Check if this profile is selected or if max limit is reached
	useEffect(() => {
		const isProfileSelected = selectedProfiles.includes(profileLinkedinId);
		setIsSelected(isProfileSelected);

		// Disable if MAX_PROFILES are already selected and this one isn't among them
		setIsDisabled(selectedProfiles.length >= MAX_PROFILES && !isProfileSelected);
	}, [selectedProfiles, profileLinkedinId]);

	const handleToggle = (checked: boolean) => {
		if (checked) {
			// Add this profile if it doesn't exceed the maximum
			if (selectedProfiles.length < MAX_PROFILES) {
				setSelectedProfiles([...selectedProfiles, profileLinkedinId]);
			}
		} else {
			// Remove this profile
			setSelectedProfiles(selectedProfiles.filter((id) => id !== profileLinkedinId));
		}
	};

	const handleClick = (e: React.MouseEvent) => {
		e.stopPropagation();
	};

	return (
		<div
			className={`absolute top-2 right-2 flex items-center gap-1 rounded-md border border-border/30 bg-card/80 p-1 shadow-sm backdrop-blur-sm transition-opacity duration-200 ${isSelected ? "opacity-100" : "md:opacity-0 md:group-hover:opacity-100"}`}
			onClick={handleClick}
		>
			<Checkbox
				id={`compare-${profileLinkedinId}`}
				checked={isSelected}
				disabled={isDisabled}
				onCheckedChange={handleToggle}
			/>
			<Label
				htmlFor={`compare-${profileLinkedinId}`}
				className={`cursor-pointer whitespace-nowrap text-xs ${isDisabled ? "text-muted-foreground" : ""}`}
			>
				Comparar
			</Label>
		</div>
	);
}