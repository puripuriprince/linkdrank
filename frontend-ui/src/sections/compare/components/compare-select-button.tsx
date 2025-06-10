"use client";

import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const MAX_PROFILES = 6;

interface CompareSelectButtonProps {
	profileLinkedinUrl: string;
}

export function CompareSelectButton({
	profileLinkedinUrl,
}: CompareSelectButtonProps) {
	// Usando nuqs para manejar el estado de los perfiles seleccionados en la URL
	const [selectedProfiles, setSelectedProfiles] = useQueryState(
		"u",
		parseAsArrayOf(parseAsString, ",").withDefault([]),
	);
	const [isSelected, setIsSelected] = useState(false);
	const [isDisabled, setIsDisabled] = useState(false);

	// Comprobar si este perfil está seleccionado o si se alcanzó el máximo
	useEffect(() => {
		const isProfileSelected = selectedProfiles.includes(profileLinkedinUrl);
		setIsSelected(isProfileSelected);

		// Deshabilitar si ya hay MAX_PROFILES seleccionados y este no está entre ellos
		setIsDisabled(selectedProfiles.length >= MAX_PROFILES && !isProfileSelected);
	}, [selectedProfiles, profileLinkedinUrl]);

	const handleToggle = (checked: boolean) => {
		if (checked) {
			// Añadir este perfil si no excede el máximo
			if (selectedProfiles.length < MAX_PROFILES) {
				setSelectedProfiles([...selectedProfiles, profileLinkedinUrl]);
			}
		} else {
			// Eliminar este perfil
			setSelectedProfiles(selectedProfiles.filter((url) => url !== profileLinkedinUrl));
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
				id={`compare-${profileLinkedinUrl}`}
				checked={isSelected}
				disabled={isDisabled}
				onCheckedChange={handleToggle}
			/>
			<Label
				htmlFor={`compare-${profileLinkedinUrl}`}
				className={`cursor-pointer whitespace-nowrap text-xs ${isDisabled ? "text-muted-foreground" : ""}`}
			>
				Comparar
			</Label>
		</div>
	);
}