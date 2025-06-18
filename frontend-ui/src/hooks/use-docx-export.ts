"use client";

import { useState } from "react";
import { toast } from "sonner";
import { PersistentCurriculumVitae } from "@/types/cv";
import { convertCVToLatex, LaTeXExportOptions } from "@/lib/utils/latex-export";

interface UseDocxExportProps {
	onSuccess?: () => void;
	onError?: (error: Error) => void;
	defaultOptions?: LaTeXExportOptions;
}

export function useDocxExport({
	onSuccess,
	onError,
	defaultOptions,
}: UseDocxExportProps = {}) {
	const [isExporting, setIsExporting] = useState(false);

	const exportDocx = async (
		cvData: PersistentCurriculumVitae,
		exportOptions: { filename: string } & LaTeXExportOptions
	) => {
		setIsExporting(true);
		toast.info("Generating DOCX...");

		try {
			const combinedOptions = { ...defaultOptions, ...exportOptions };
			const latexSource = convertCVToLatex(cvData, combinedOptions);

			const response = await fetch("/api/docx-compile", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ latex: latexSource }),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(
					errorData.error || `DOCX compilation failed: ${response.statusText}`
				);
			}

			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = exportOptions.filename;
			document.body.appendChild(a);
			a.click();
			window.URL.revokeObjectURL(url);
			a.remove();

			toast.success("DOCX exported successfully!");
			if (onSuccess) {
				onSuccess();
			}
		} catch (error) {
			console.error("DOCX export failed:", error);
			const errorMessage =
				error instanceof Error ? error.message : "An unknown error occurred.";
			toast.error(`Failed to export DOCX: ${errorMessage}`);
			if (onError) {
				onError(error as Error);
			}
		} finally {
			setIsExporting(false);
		}
	};

	return { exportDocx, isExporting };
} 