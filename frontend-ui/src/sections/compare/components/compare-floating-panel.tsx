"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { paths } from "@/routes/paths";
import { Scale, Trash2 } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";
import { useEffect, useState } from "react";

export function CompareFloatingPanel() {
	const router = useRouter();
	const pathname = usePathname();
	const [selectedProfiles, setSelectedProfiles] = useQueryState(
		"u",
		parseAsArrayOf(parseAsString, ",").withDefault([]),
	);
	const [isVisible, setIsVisible] = useState(false);

	// Mostrar el panel solo si hay perfiles seleccionados y no estamos en la página de comparación
	useEffect(() => {
		const isOnComparePage = pathname === paths.compare.root || pathname.startsWith(paths.compare.root);
		setIsVisible(selectedProfiles.length > 0 && !isOnComparePage);
	}, [selectedProfiles, pathname]);

	const handleCompare = () => {
		router.push(paths.compare.details(selectedProfiles.join(",")));
	};

	const handleClear = () => {
		setSelectedProfiles([]);
	};

	if (!isVisible) return null;

	return (
		<div className="-translate-x-1/2 fixed bottom-4 left-1/2 z-50 transform">
			<div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 shadow-lg">
				<Button
					variant="default"
					size="sm"
					onClick={handleCompare}
					className="rounded-full"
				>
					<Scale className="mr-2 h-4 w-4" />
					Comparar {selectedProfiles.length > 0 ? `(${selectedProfiles.length})` : ""}
				</Button>
				<Separator orientation="vertical" className="h-6" />
				<Button
					variant="ghost"
					size="icon"
					onClick={handleClear}
					className="rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive"
				>
					<Trash2 className="h-4 w-4" />
					<span className="sr-only">Limpiar selección</span>
				</Button>
			</div>
		</div>
	);
}