import { useCallback, useState } from "react";
import { toast } from "sonner";
import { PersistentCurriculumVitae } from "@/types/cv";
import { 
	convertCVToLatex, 
	downloadLatexSource, 
	compileLatexToPDF,
	LaTeXExportOptions 
} from "@/lib/utils/latex-export";

export interface UseLatexExportOptions {
	onSuccess?: (method: string) => void;
	onError?: (error: Error) => void;
	defaultOptions?: LaTeXExportOptions;
}

export function useLatexExport(options: UseLatexExportOptions = {}) {
	const [isExporting, setIsExporting] = useState(false);
	const [exportMethod, setExportMethod] = useState<"source" | "server" | "client" | null>(null);
	const { onSuccess, onError, defaultOptions } = options;

	const exportLatexSource = useCallback(
		async (cvData: PersistentCurriculumVitae, exportOptions?: LaTeXExportOptions) => {
			if (!cvData) {
				const error = new Error("No CV data provided for LaTeX export");
				toast.error("CV data not found");
				onError?.(error);
				return;
			}

			setIsExporting(true);
			setExportMethod("source");
			toast.info("Preparing LaTeX source...", {
				description: "Generating .tex file",
			});

			try {
				const combinedOptions = { ...defaultOptions, ...exportOptions };
				downloadLatexSource(cvData, combinedOptions);

				toast.success("LaTeX source exported successfully!", {
					description: "You can compile this with any LaTeX processor",
				});

				onSuccess?.("source");
			} catch (error) {
				console.error("LaTeX source export error:", error);
				const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";

				toast.error("Failed to export LaTeX source", {
					description: errorMessage,
				});

				onError?.(error instanceof Error ? error : new Error(errorMessage));
			} finally {
				setIsExporting(false);
				setExportMethod(null);
			}
		},
		[defaultOptions, onSuccess, onError],
	);

	const exportLatexPDF = useCallback(
		async (cvData: PersistentCurriculumVitae, exportOptions?: LaTeXExportOptions) => {
			if (!cvData) {
				const error = new Error("No CV data provided for LaTeX PDF export");
				toast.error("CV data not found");
				onError?.(error);
				return;
			}

			setIsExporting(true);
			setExportMethod("server");
			toast.info("Compiling LaTeX to PDF...", {
				description: "This may take a few seconds",
			});

			try {
				const combinedOptions = { ...defaultOptions, ...exportOptions };
				await compileLatexToPDF(cvData, combinedOptions);

				toast.success("LaTeX PDF exported successfully!", {
					description: "Your CV has been compiled and downloaded",
				});

				onSuccess?.("server");
			} catch (error) {
				console.error("LaTeX PDF export error:", error);
				const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";

				toast.error("Failed to compile LaTeX to PDF", {
					description: "Falling back to LaTeX source download",
				});

				// Fallback to source download
				try {
					const combinedOptions = { ...defaultOptions, ...exportOptions };
					downloadLatexSource(cvData, combinedOptions);
					toast.success("LaTeX source downloaded as fallback");
				} catch (fallbackError) {
					onError?.(error instanceof Error ? error : new Error(errorMessage));
				}
			} finally {
				setIsExporting(false);
				setExportMethod(null);
			}
		},
		[defaultOptions, onSuccess, onError],
	);

	// Client-side compilation removed due to bundle size constraints
	// LaTeX.js would add ~3.5MB to the bundle, severely impacting performance
	// Users can download LaTeX source instead for local compilation

	const previewLatex = useCallback(
		(cvData: PersistentCurriculumVitae, exportOptions?: LaTeXExportOptions) => {
			if (!cvData) {
				toast.error("CV data not found");
				return "";
			}

			try {
				const combinedOptions = { ...defaultOptions, ...exportOptions };
				return convertCVToLatex(cvData, combinedOptions);
			} catch (error) {
				console.error("LaTeX preview error:", error);
				toast.error("Failed to generate LaTeX preview");
				return "";
			}
		},
		[defaultOptions],
	);

	return {
		exportLatexSource,
		exportLatexPDF,
		previewLatex,
		isExporting,
		exportMethod,
	};
} 