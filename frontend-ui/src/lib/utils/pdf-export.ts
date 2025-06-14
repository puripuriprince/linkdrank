import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export interface PDFExportOptions {
	filename?: string;
	quality?: number;
	scale?: number;
	format?: "a4" | "letter";
	margin?: number;
}

// Helper function to detect and log oklch usage
function detectOklchUsage(element: HTMLElement): void {
	console.log("🔍 Scanning for oklch values to override...");

	const allElements = element.querySelectorAll("*");
	let oklchCount = 0;

	// Check CSS custom properties (CSS variables) on root and html
	const rootElement = document.documentElement;
	const rootStyle = window.getComputedStyle(rootElement);

	for (let i = 0; i < rootStyle.length; i++) {
		const prop = rootStyle[i];
		if (prop.startsWith("--")) {
			const value = rootStyle.getPropertyValue(prop);
			if (value?.includes("oklch")) {
				console.log(
					`⚠️ Skipping oklch in CSS variable ${prop} (will be overridden)`,
				);
				oklchCount++;
			}
		}
	}

	for (const el of allElements) {
		const elem = el as HTMLElement;
		const computedStyle = window.getComputedStyle(elem);

		// Check all color-related properties
		const colorProperties = [
			"color",
			"backgroundColor",
			"borderColor",
			"borderTopColor",
			"borderRightColor",
			"borderBottomColor",
			"borderLeftColor",
			"outlineColor",
			"textDecorationColor",
			"caretColor",
		];

		for (const prop of colorProperties) {
			const value = computedStyle.getPropertyValue(prop);
			if (value?.includes("oklch")) {
				console.log(
					`⚠️ Skipping oklch in ${elem.tagName}.${elem.className} - ${prop} (will be overridden)`,
				);
				oklchCount++;
			}
		}

		// Check inline styles
		if (elem.style.cssText?.includes("oklch")) {
			console.log(
				`⚠️ Skipping oklch in inline styles of ${elem.tagName}.${elem.className} (will be overridden)`,
			);
			oklchCount++;
		}

		// Check for CSS variables on this element
		const elemStyle = window.getComputedStyle(elem);
		for (let i = 0; i < elemStyle.length; i++) {
			const prop = elemStyle[i];
			if (prop.startsWith("--")) {
				const value = elemStyle.getPropertyValue(prop);
				if (value?.includes("oklch")) {
					console.log(
						`⚠️ Skipping oklch in CSS variable ${prop} on ${elem.tagName}.${elem.className} (will be overridden)`,
					);
					oklchCount++;
				}
			}
		}
	}

	if (oklchCount === 0) {
		console.log("✅ No oklch values detected");
	} else {
		console.log(
			`✅ Found ${oklchCount} oklch values that will be safely overridden`,
		);
	}
}

// Helper function to prepare element for PDF export
function prepareElementForPDF(element: HTMLElement): HTMLElement {
	console.log("🔧 Preparing element for PDF export...");

	// First, detect oklch in original element
	detectOklchUsage(element);

	// Clone the element to avoid modifying the original
	const clonedElement = element.cloneNode(true) as HTMLElement;

	// Generate a unique ID for this PDF export to isolate styles
	const pdfExportId = `pdf-export-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
	clonedElement.id = pdfExportId;

	// Create a comprehensive style element to override ALL CSS, but scope it to this specific element
	const style = document.createElement("style");
	style.setAttribute("data-pdf-export", pdfExportId);
	style.textContent = `
		/* Override CSS custom properties ONLY for this PDF export element */
		#${pdfExportId} {
			--background: #ffffff !important;
			--foreground: #000000 !important;
			--muted-foreground: #6b7280 !important;
			--border: #e5e7eb !important;
			--card: #ffffff !important;
			--card-foreground: #000000 !important;
			--popover: #ffffff !important;
			--popover-foreground: #000000 !important;
			--primary: #000000 !important;
			--primary-foreground: #ffffff !important;
			--secondary: #f1f5f9 !important;
			--secondary-foreground: #000000 !important;
			--muted: #f1f5f9 !important;
			--accent: #f1f5f9 !important;
			--accent-foreground: #000000 !important;
			--destructive: #ef4444 !important;
			--destructive-foreground: #ffffff !important;
			--ring: #000000 !important;
			--radius: 0.5rem !important;
			
			/* Force white background and black text on root */
			background-color: #ffffff !important;
			color: #000000 !important;
		}
		
		/* Reset all colors to safe values - ONLY within the PDF export element */
		#${pdfExportId} *, #${pdfExportId} *::before, #${pdfExportId} *::after {
			color: #000000 !important;
			background-color: transparent !important;
			border-color: #e5e7eb !important;
			outline-color: #000000 !important;
			text-decoration-color: #000000 !important;
			caret-color: #000000 !important;
		}
		
		/* Specific overrides for common classes - ONLY within the PDF export element */
		#${pdfExportId} .text-muted-foreground {
			color: #6b7280 !important;
		}
		#${pdfExportId} .text-foreground {
			color: #000000 !important;
		}
		#${pdfExportId} a, #${pdfExportId} a:visited, #${pdfExportId} a:hover, #${pdfExportId} a:active {
			color: #2563eb !important;
			text-decoration: underline !important;
		}
		#${pdfExportId} .border-border {
			border-color: #e5e7eb !important;
		}
		#${pdfExportId} h1, #${pdfExportId} h2, #${pdfExportId} h3, #${pdfExportId} h4, #${pdfExportId} h5, #${pdfExportId} h6 {
			color: #000000 !important;
		}
		
		/* Container backgrounds - ONLY within the PDF export element */
		#${pdfExportId} [data-cv-content] {
			background-color: #ffffff !important;
		}
		#${pdfExportId} .bg-background {
			background-color: #ffffff !important;
		}
		
		/* Force all backgrounds to be safe - ONLY within the PDF export element */
		#${pdfExportId} div, #${pdfExportId} section, #${pdfExportId} article, #${pdfExportId} main, #${pdfExportId} header, #${pdfExportId} footer, #${pdfExportId} span, #${pdfExportId} p {
			background-color: transparent !important;
		}
	`;

	// Add the style to the cloned element
	clonedElement.appendChild(style);

	// Override CSS variables directly on the cloned element
	clonedElement.style.setProperty("--background", "#ffffff", "important");
	clonedElement.style.setProperty("--foreground", "#000000", "important");
	clonedElement.style.setProperty("--muted-foreground", "#6b7280", "important");
	clonedElement.style.setProperty("--border", "#e5e7eb", "important");
	clonedElement.style.setProperty("--card", "#ffffff", "important");
	clonedElement.style.setProperty("--card-foreground", "#000000", "important");
	clonedElement.style.setProperty("--popover", "#ffffff", "important");
	clonedElement.style.setProperty(
		"--popover-foreground",
		"#000000",
		"important",
	);
	clonedElement.style.setProperty("--primary", "#000000", "important");
	clonedElement.style.setProperty(
		"--primary-foreground",
		"#ffffff",
		"important",
	);
	clonedElement.style.setProperty("--secondary", "#f1f5f9", "important");
	clonedElement.style.setProperty(
		"--secondary-foreground",
		"#000000",
		"important",
	);
	clonedElement.style.setProperty("--muted", "#f1f5f9", "important");
	clonedElement.style.setProperty("--accent", "#f1f5f9", "important");
	clonedElement.style.setProperty(
		"--accent-foreground",
		"#000000",
		"important",
	);
	clonedElement.style.setProperty("--destructive", "#ef4444", "important");
	clonedElement.style.setProperty(
		"--destructive-foreground",
		"#ffffff",
		"important",
	);
	clonedElement.style.setProperty("--ring", "#000000", "important");

	// Remove dark mode classes
	clonedElement.classList.remove("dark");

	// Apply styles to all child elements with aggressive overrides
	const allElements = clonedElement.querySelectorAll("*");
	console.log(`🔄 Processing ${allElements.length} elements...`);

	for (const el of allElements) {
		const elem = el as HTMLElement;
		elem.classList.remove("dark");

		// Force ALL color properties to safe values
		elem.style.setProperty("color", "#000000", "important");
		elem.style.setProperty("background-color", "transparent", "important");
		elem.style.setProperty("border-color", "#e5e7eb", "important");
		elem.style.setProperty("outline-color", "#000000", "important");
		elem.style.setProperty("text-decoration-color", "#000000", "important");
		elem.style.setProperty("caret-color", "#000000", "important");

		// Specific overrides for known classes
		if (elem.classList.contains("text-foreground")) {
			elem.style.setProperty("color", "#000000", "important");
		}
		if (elem.classList.contains("text-muted-foreground")) {
			elem.style.setProperty("color", "#6b7280", "important");
		}
		if (elem.tagName === "A") {
			elem.style.setProperty("color", "#2563eb", "important");
			elem.style.setProperty("text-decoration", "underline", "important");
		}
		if (elem.classList.contains("border-border")) {
			elem.style.setProperty("border-color", "#e5e7eb", "important");
		}

		// Force white background only for the main container
		if (elem.hasAttribute("data-cv-content")) {
			elem.style.setProperty("background-color", "#ffffff", "important");
		}

		// Override CSS variables on each element to ensure inheritance
		elem.style.setProperty("--foreground", "#000000", "important");
		elem.style.setProperty("--muted-foreground", "#6b7280", "important");
		elem.style.setProperty("--background", "#ffffff", "important");
		elem.style.setProperty("--border", "#e5e7eb", "important");
	}

	// Check the prepared element for oklch
	console.log("🔍 Checking prepared element...");
	detectOklchUsage(clonedElement);

	return clonedElement;
}

export async function exportToPDF(
	element: HTMLElement,
	options: PDFExportOptions = {},
): Promise<void> {
	const {
		filename = "cv.pdf",
		quality = 1,
		scale = 2,
		format = "a4",
		margin = 20,
	} = options;

	let preparedElement: HTMLElement | null = null;

	try {
		console.log("📄 Starting PDF export process...");

		// Prepare the element for PDF export
		preparedElement = prepareElementForPDF(element);

		// Temporarily add to DOM for rendering
		preparedElement.style.position = "absolute";
		preparedElement.style.left = "-9999px";
		preparedElement.style.top = "-9999px";
		preparedElement.style.zIndex = "-1000";
		preparedElement.style.pointerEvents = "none";
		preparedElement.style.visibility = "hidden";
		document.body.appendChild(preparedElement);
		console.log("✅ Element added to DOM");

		// Force layout recalculation to ensure styles are applied
		preparedElement.offsetHeight;

		// Get the element's dimensions
		const rect = preparedElement.getBoundingClientRect();
		console.log(`📐 Element dimensions: ${rect.width}x${rect.height}`);

		// Final check before html2canvas
		console.log("🔍 Final oklch check before html2canvas...");
		detectOklchUsage(preparedElement);

		// Create canvas with high quality
		console.log("🎨 Starting html2canvas...");
		const canvas = await html2canvas(preparedElement, {
			scale: scale,
			useCORS: true,
			allowTaint: true,
			backgroundColor: "#ffffff",
			width: rect.width,
			height: rect.height,
			scrollX: 0,
			scrollY: 0,
			windowWidth: rect.width,
			windowHeight: rect.height,
			ignoreElements: (element) => {
				// Ignore elements that might cause issues or should not be in PDF
				return (
					element.classList?.contains("ignore-pdf") ||
					element.classList?.contains("floating") ||
					element.classList?.contains("toolbar") ||
					false
				);
			},
			removeContainer: true,
			logging: false,
		});
		console.log("✅ html2canvas completed successfully");

		// Calculate PDF dimensions
		const imgWidth = canvas.width;
		const imgHeight = canvas.height;

		// A4 dimensions in mm
		const pdfWidth = format === "a4" ? 210 : 216; // A4 or Letter
		const pdfHeight = format === "a4" ? 297 : 279;

		// Calculate scaling to fit content with margins
		const availableWidth = pdfWidth - margin * 2;
		const availableHeight = pdfHeight - margin * 2;

		const widthRatio = availableWidth / (imgWidth * 0.264583); // Convert px to mm
		const heightRatio = availableHeight / (imgHeight * 0.264583);
		const ratio = Math.min(widthRatio, heightRatio);

		const scaledWidth = imgWidth * 0.264583 * ratio;
		const scaledHeight = imgHeight * 0.264583 * ratio;

		// Center the content
		const xOffset = (pdfWidth - scaledWidth) / 2;
		const yOffset = margin;

		// Create PDF
		const pdf = new jsPDF({
			orientation: scaledHeight > scaledWidth ? "portrait" : "landscape",
			unit: "mm",
			format: format === "a4" ? "a4" : "letter",
		});

		// Convert canvas to image
		const imgData = canvas.toDataURL("image/png", quality);

		// Add image to PDF
		pdf.addImage(imgData, "PNG", xOffset, yOffset, scaledWidth, scaledHeight);

		// Save the PDF
		pdf.save(filename);

		console.log("✅ PDF exported successfully");
	} catch (error) {
		console.error("❌ Error generating PDF:", error);
		throw new Error("Failed to generate PDF. Please try again.");
	} finally {
		// CRITICAL: Always clean up the temporary element, even if there are errors
		if (preparedElement) {
			try {
				if (document.body.contains(preparedElement)) {
					document.body.removeChild(preparedElement);
					console.log("🧹 Temporary element cleaned up successfully");
				}
			} catch (cleanupError) {
				console.warn("⚠️ Failed to cleanup temporary element:", cleanupError);
				// Try to force remove by ID if regular removal fails
				try {
					const elementById = document.getElementById(preparedElement.id);
					if (elementById && elementById.parentNode) {
						elementById.parentNode.removeChild(elementById);
						console.log("🧹 Forced cleanup by ID successful");
					}
				} catch (forceCleanupError) {
					console.error("❌ Failed to force cleanup temporary element:", forceCleanupError);
				}
			}
		}
		
		// Additional cleanup: remove any orphaned PDF export styles
		const orphanedStyles = document.querySelectorAll('style[data-pdf-export]');
		orphanedStyles.forEach(style => {
			try {
				style.remove();
			} catch (styleCleanupError) {
				console.warn("⚠️ Failed to cleanup orphaned style:", styleCleanupError);
			}
		});
	}
}

export async function exportCVToPDF(
	cvElement: HTMLElement,
	fullName = "CV",
): Promise<void> {
	const sanitizedName = fullName
		.replace(/[^a-zA-Z0-9\s]/g, "")
		.replace(/\s+/g, "_");
	const filename = `${sanitizedName}_CV.pdf`;

	return exportToPDF(cvElement, {
		filename,
		quality: 0.95,
		scale: 2,
		format: "a4",
		margin: 15,
	});
}

// Utility function to clean up any lingering PDF export elements and styles
export function cleanupPDFExportArtifacts(): void {
	console.log("🧹 Cleaning up PDF export artifacts...");
	
	// Remove any elements with PDF export IDs
	const pdfElements = document.querySelectorAll('[id^="pdf-export-"]');
	pdfElements.forEach(element => {
		try {
			element.remove();
			console.log(`🧹 Removed PDF export element: ${element.id}`);
		} catch (error) {
			console.warn("⚠️ Failed to remove PDF export element:", error);
		}
	});
	
	// Remove any PDF export styles
	const pdfStyles = document.querySelectorAll('style[data-pdf-export]');
	pdfStyles.forEach(style => {
		try {
			style.remove();
			console.log(`🧹 Removed PDF export style: ${style.getAttribute('data-pdf-export')}`);
		} catch (error) {
			console.warn("⚠️ Failed to remove PDF export style:", error);
		}
	});
	
	if (pdfElements.length === 0 && pdfStyles.length === 0) {
		console.log("✅ No PDF export artifacts found");
	} else {
		console.log(`✅ Cleaned up ${pdfElements.length} elements and ${pdfStyles.length} styles`);
	}
}
