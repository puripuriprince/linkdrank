import { PersistentCurriculumVitae } from "@/types/cv";

export interface LaTeXExportOptions {
	filename?: string;
	template?: "modern" | "classic" | "compact";
	fontSize?: "10pt" | "11pt" | "12pt";
	margins?: "narrow" | "normal" | "wide";
	colorScheme?: "blue" | "black" | "green" | "red";
}

/**
 * Escapes LaTeX special characters in a string
 */
function escapeLatex(text: string): string {
	if (!text) return "";
	return text
		.replace(/\\/g, "\\textbackslash{}")
		.replace(/\{/g, "\\{")
		.replace(/\}/g, "\\}")
		.replace(/\$/g, "\\$")
		.replace(/&/g, "\\&")
		.replace(/%/g, "\\%")
		.replace(/#/g, "\\#")
		.replace(/\^/g, "\\textasciicircum{}")
		.replace(/_/g, "\\_")
		.replace(/~/g, "\\textasciitilde{}")
		.replace(/\|/g, "\\textbar{}")
		.replace(/</g, "\\textless{}")
		.replace(/>/g, "\\textgreater{}")
		.replace(/"/g, "\\textquotedbl{}")
		.replace(/'/g, "\\textquotesingle{}")
		.replace(/`/g, "\\textasciigrave{}");
}

/**
 * Formats a URL for LaTeX (makes it clickable)
 */
function formatLatexUrl(url: string, displayText?: string): string {
	if (!url) return "";
	
	// Ensure URL has protocol
	const formattedUrl = url.startsWith("http") ? url : `https://${url}`;
	const display = displayText || url;
	
	return `\\href{${formattedUrl}}{${escapeLatex(display)}}`;
}

/**
 * Generates LaTeX document preamble based on template and options
 */
function generatePreamble(options: LaTeXExportOptions): string {
	const { template = "modern", fontSize = "11pt", margins = "normal", colorScheme = "blue" } = options;
	
	const marginSettings = {
		narrow: "margin=0.5in",
		normal: "margin=0.75in",
		wide: "margin=1in"
	};
	
	const colorSettings = {
		blue: "\\definecolor{accent}{RGB}{0,102,204}",
		black: "\\definecolor{accent}{RGB}{0,0,0}",
		green: "\\definecolor{accent}{RGB}{0,128,0}",
		red: "\\definecolor{accent}{RGB}{178,34,34}"
	};
	
	return `\\documentclass[${fontSize},letterpaper]{article}

% Packages
\\usepackage[${marginSettings[margins]}]{geometry}
\\usepackage{titlesec}
\\usepackage{titling}
\\usepackage{enumitem}
\\usepackage{xcolor}
\\usepackage{microtype}
\\usepackage{parskip}
\\usepackage[hidelinks,colorlinks=true,linkcolor=black,urlcolor=blue,citecolor=black]{hyperref}

% Color scheme
${colorSettings[colorScheme]}

% Font settings (compatible with pdfLaTeX)
\\usepackage{lmodern}
\\usepackage[T1]{fontenc}
\\usepackage[utf8]{inputenc}

% Custom commands
\\newcommand{\\cvheader}[1]{\\textbf{\\Large #1}}
\\newcommand{\\cvsection}[1]{\\textbf{\\textcolor{accent}{\\MakeUppercase{#1}}}\\vspace{0.5em}\\hrule\\vspace{0.5em}}
\\newcommand{\\cvsubsection}[4]{\\textbf{#1} \\hfill \\textit{#2} \\\\ \\textit{#3} \\hfill #4}
\\newcommand{\\cvitem}[2]{\\textbf{#1}: #2}

% Section formatting
\\titleformat{\\section}{\\large\\bfseries\\textcolor{accent}}{}{0em}{}[\\titlerule]
\\titlespacing{\\section}{0pt}{12pt}{6pt}

% Remove page numbers
\\pagestyle{empty}

% Reduce spacing
\\setlength{\\parindent}{0pt}
\\setlength{\\itemsep}{0pt}
\\setlength{\\parsep}{0pt}
\\setlength{\\topsep}{0pt}
\\setlength{\\partopsep}{0pt}

\\begin{document}`;
}

/**
 * Generates LaTeX for CV header section
 */
function generateHeader(cvData: PersistentCurriculumVitae): string {
	const { fullName, email, phone, location, websiteUrl, linkedInHandle, githubHandle } = cvData;
	
	let header = "";
	
	if (fullName) {
		header += `\\begin{center}
\\cvheader{${escapeLatex(fullName)}}
\\end{center}

`;
	}
	
	// Contact information
	const contactInfo = [];
	if (email) contactInfo.push(formatLatexUrl(`mailto:${email}`, email));
	if (phone) contactInfo.push(formatLatexUrl(`tel:${phone}`, phone));
	if (location) contactInfo.push(escapeLatex(location));
	if (websiteUrl) contactInfo.push(formatLatexUrl(websiteUrl));
	if (linkedInHandle) {
		const linkedinUrl = linkedInHandle.startsWith("http") ? linkedInHandle : `https://linkedin.com/${linkedInHandle.startsWith("in/") ? linkedInHandle : `in/${linkedInHandle}`}`;
		contactInfo.push(formatLatexUrl(linkedinUrl, linkedInHandle));
	}
	if (githubHandle) {
		const githubUrl = githubHandle.startsWith("http") ? githubHandle : `https://github.com/${githubHandle}`;
		contactInfo.push(formatLatexUrl(githubUrl, githubHandle));
	}
	
	if (contactInfo.length > 0) {
		header += `\\begin{center}
${contactInfo.join(" \\textbar{} ")}
\\end{center}

`;
	}
	
	return header;
}

/**
 * Generates LaTeX for summary section
 */
function generateSummary(summary: string): string {
	if (!summary) return "";
	
	return `\\cvsection{Summary}
${escapeLatex(summary)}

`;
}

/**
 * Generates LaTeX for experience section
 */
function generateExperience(experience: PersistentCurriculumVitae["experience"]): string {
	if (!experience || experience.length === 0) return "";
	
	let latex = "\\cvsection{Experience}\n\n";
	
	experience.forEach((exp) => {
		const { title, company, location, dateRangeFrom, dateRangeTo, bullets, techStack } = exp;
		
		// Job header
		latex += `\\cvsubsection{${escapeLatex(title || "")}}{${escapeLatex(company || "")}}{${escapeLatex(location || "")}}{${escapeLatex(dateRangeFrom || "")} -- ${escapeLatex(dateRangeTo || "")}}

`;
		
		// Bullets
		if (bullets && bullets.length > 0) {
			latex += "\\begin{itemize}[leftmargin=*,noitemsep]\n";
			bullets.forEach((bullet) => {
				latex += `\\item ${escapeLatex(bullet.content)}\n`;
			});
			latex += "\\end{itemize}\n\n";
		}
		
		// Tech stack
		if (techStack && techStack.length > 0) {
			const techList = techStack.map(tech => escapeLatex(tech.content)).join(", ");
			latex += `\\textbf{Technologies:} ${techList}

`;
		}
	});
	
	return latex;
}

/**
 * Generates LaTeX for education section
 */
function generateEducation(education: PersistentCurriculumVitae["education"]): string {
	if (!education || education.length === 0) return "";
	
	let latex = "\\cvsection{Education}\n\n";
	
	education.forEach((edu) => {
		const { degree, institution, location, dateRangeFrom, dateRangeTo } = edu;
		
		latex += `\\cvsubsection{${escapeLatex(degree || "")}}{${escapeLatex(institution || "")}}{${escapeLatex(location || "")}}{${escapeLatex(dateRangeFrom || "")} -- ${escapeLatex(dateRangeTo || "")}}

`;
	});
	
	return latex;
}

/**
 * Generates LaTeX for projects section
 */
function generateProjects(projects: PersistentCurriculumVitae["projects"]): string {
	if (!projects || projects.length === 0) return "";
	
	let latex = "\\cvsection{Projects}\n\n";
	
	projects.forEach((project) => {
		const { name, bullets, techStack } = project;
		
		latex += `\\textbf{${escapeLatex(name || "")}}

`;
		
		// Bullets
		if (bullets && bullets.length > 0) {
			latex += "\\begin{itemize}[leftmargin=*,noitemsep]\n";
			bullets.forEach((bullet) => {
				latex += `\\item ${escapeLatex(bullet.content)}\n`;
			});
			latex += "\\end{itemize}\n\n";
		}
		
		// Tech stack
		if (techStack && techStack.length > 0) {
			const techList = techStack.map(tech => escapeLatex(tech.content)).join(", ");
			latex += `\\textbf{Technologies:} ${techList}

`;
		}
	});
	
	return latex;
}

/**
 * Generates LaTeX for skills section
 */
function generateSkills(skills: PersistentCurriculumVitae["skills"]): string {
	if (!skills || skills.length === 0) return "";
	
	const skillsList = skills.map(skill => escapeLatex(skill.content)).join(", ");
	
	return `\\cvsection{Skills}
${skillsList}

`;
}

/**
 * Generates LaTeX for interests section
 */
function generateInterests(interests: PersistentCurriculumVitae["interests"]): string {
	if (!interests || interests.length === 0) return "";
	
	const interestsList = interests.map(interest => escapeLatex(interest.content)).join(", ");
	
	return `\\cvsection{Interests}
${interestsList}

`;
}

/**
 * Converts CV data to LaTeX document
 */
export function convertCVToLatex(cvData: PersistentCurriculumVitae, options: LaTeXExportOptions = {}): string {
	let latex = generatePreamble(options);
	
	// Header
	latex += generateHeader(cvData);
	
	// Summary
	if (cvData.summary) {
		latex += generateSummary(cvData.summary);
	}
	
	// Experience
	latex += generateExperience(cvData.experience);
	
	// Education
	latex += generateEducation(cvData.education);
	
	// Projects
	latex += generateProjects(cvData.projects);
	
	// Skills
	latex += generateSkills(cvData.skills);
	
	// Interests
	latex += generateInterests(cvData.interests);
	
	latex += "\\end{document}";
	
	return latex;
}

/**
 * Downloads LaTeX source as a .tex file
 */
export function downloadLatexSource(cvData: PersistentCurriculumVitae, options: LaTeXExportOptions = {}): void {
	const latex = convertCVToLatex(cvData, options);
	const filename = options.filename || `${cvData.fullName || "CV"}.tex`;
	
	const blob = new Blob([latex], { type: "text/plain" });
	const url = URL.createObjectURL(blob);
	
	const a = document.createElement("a");
	a.href = url;
	a.download = filename.replace(/\.pdf$/, ".tex");
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	
	URL.revokeObjectURL(url);
}

/**
 * Compiles LaTeX to PDF using a web service
 */
export async function compileLatexToPDF(
	cvData: PersistentCurriculumVitae,
	options: LaTeXExportOptions = {}
): Promise<void> {
	const latex = convertCVToLatex(cvData, options);
	const filename = options.filename || `${cvData.fullName || "CV"}.pdf`;
	
	try {
		// Using a LaTeX compilation service (you'll need to set up an endpoint)
		const response = await fetch("/api/latex-compile", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				latex,
				filename: filename.replace(/\.tex$/, ".pdf"),
			}),
		});
		
		if (!response.ok) {
			throw new Error(`LaTeX compilation failed: ${response.statusText}`);
		}
		
		const blob = await response.blob();
		const url = URL.createObjectURL(blob);
		
		const a = document.createElement("a");
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		
		URL.revokeObjectURL(url);
	} catch (error) {
		console.error("LaTeX compilation error:", error);
		throw new Error("Failed to compile LaTeX to PDF. Please try downloading the LaTeX source instead.");
	}
}