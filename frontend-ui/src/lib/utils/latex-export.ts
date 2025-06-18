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
	
	return `\\href{${formattedUrl}}{\\underline{${escapeLatex(display)}}}`;
}

/**
 * Generates LaTeX document preamble based on template and options
 */
function generatePreamble(_options: LaTeXExportOptions): string {
	return `\\documentclass[letterpaper,11pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\input{glyphtounicode}

\\pagestyle{fancy}
\\fancyhf{} % clear all header and footer fields
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

% Adjust margins
\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}

\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

% Sections formatting
\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

% Ensure that generate pdf is machine readable/ATS parsable
\\pdfgentounicode=1

%-------------------------
% Custom commands
\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\small#1 & #2 \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

\\begin{document}`;
}

/**
 * Generates LaTeX for CV header section
 */
function generateHeader(cvData: PersistentCurriculumVitae): string {
	const { fullName, email, phone, websiteUrl, linkedInHandle, githubHandle } = cvData;
	
	let header = "";
	
	if (fullName) {
		header += `\\begin{center}
    \\textbf{\\Huge \\scshape ${escapeLatex(fullName)}} \\\\ \\vspace{1pt}
`;
	}
	
	// Contact information
	const contactInfo = [];
	if (websiteUrl) contactInfo.push(formatLatexUrl(websiteUrl));
	if (phone) contactInfo.push(escapeLatex(phone));
	if (email) contactInfo.push(`\\href{mailto:${email}}{\\underline{${escapeLatex(email)}}}`);
	if (linkedInHandle) {
		const handle = linkedInHandle.replace(/^(https?:\/\/)?(www\.)?linkedin\.com\/in\//, "").replace(/\/$/, "");
		contactInfo.push(`\\href{https://linkedin.com/in/${handle}}{\\underline{linkedin.com/in/${escapeLatex(handle)}}}`);
	}
	if (githubHandle) {
		const handle = githubHandle.replace(/^(https?:\/\/)?(www\.)?github\.com\//, "").replace(/\/$/, "");
		contactInfo.push(`\\href{https://github.com/${handle}}{\\underline{github.com/${escapeLatex(handle)}}}`);
	}
	
	if (contactInfo.length > 0) {
		header += `    \\small ${contactInfo.join(" $|$ ")}\n`;
	}
	
	header += `\\end{center}\n\n`;
	
	return header;
}

/**
 * Generates LaTeX for summary section
 */
function generateSummary(summary: string): string {
	if (!summary) return "";

	return `\\section{Summary}
${escapeLatex(summary)}

`;
}

/**
 * Generates LaTeX for experience section
 */
function generateExperience(experience: PersistentCurriculumVitae["experience"]): string {
	if (!experience || experience.length === 0) return "";
	
	let latex = "\\section{Experience}\n";
	latex += "\\resumeSubHeadingListStart\n";
	
	experience.forEach((exp) => {
		const { title, company, location, dateRangeFrom, dateRangeTo, bullets, techStack } = exp;
		
		const from = dateRangeFrom ? escapeLatex(dateRangeFrom) : "";
		const to = dateRangeTo ? escapeLatex(dateRangeTo) : "Present";
		const dateRange = from && to ? `${from} -- ${to}` : "";

		// Job header
		latex += `\\resumeSubheading
      {${escapeLatex(title || "")}}{${dateRange}}
      {${escapeLatex(company || "")}}{${escapeLatex(location || "")}}
`;
		
		// Bullets
		if (bullets && bullets.length > 0) {
			latex += "\\resumeItemListStart\n";
			bullets.forEach((bullet) => {
				latex += `\\resumeItem{${escapeLatex(bullet.content)}}\n`;
			});
			latex += "\\resumeItemListEnd\n";
		}
		
		// Tech stack (optional, not in the example but good to have)
		if (techStack && techStack.length > 0) {
			const techList = techStack.map(tech => escapeLatex(tech.content)).join(", ");
			latex += `\\resumeItem{\\textbf{Technologies:} ${techList}}\n\\vspace{2pt}\n`;
		}
	});
	
	latex += "\\resumeSubHeadingListEnd\n\n";
	
	return latex;
}

/**
 * Generates LaTeX for education section
 */
function generateEducation(education: PersistentCurriculumVitae["education"]): string {
	if (!education || education.length === 0) return "";
	
	let latex = "\\section{Education}\n";
	latex += "\\resumeSubHeadingListStart\n";
	
	education.forEach((edu) => {
		const { degree, institution, location, dateRangeFrom, dateRangeTo } = edu;
		const from = dateRangeFrom ? escapeLatex(dateRangeFrom) : "";
		const to = dateRangeTo ? escapeLatex(dateRangeTo) : "Present";
		const dateRange = from && to ? `${from} -- ${to}` : "";
		
		latex += `\\resumeSubheading
      {${escapeLatex(institution || "")}}{${escapeLatex(location || "")}}
      {${escapeLatex(degree || "")}}{${dateRange}}
`;
	});
	
	latex += "\\resumeSubHeadingListEnd\n\n";
	
	return latex;
}

/**
 * Generates LaTeX for projects section
 */
function generateProjects(projects: PersistentCurriculumVitae["projects"]): string {
	if (!projects || projects.length === 0) return "";
	
	let latex = "\\section{Projects}\n";
	latex += "\\resumeSubHeadingListStart\n";
	
	projects.forEach((project) => {
		const { name, bullets, techStack } = project;
		
		const techList = (techStack || []).map(tech => escapeLatex(tech.content)).join(", ");
		
		latex += `\\resumeProjectHeading
          {\\textbf{${escapeLatex(name || "")}} $|$ \\emph{${techList}}}{}
`;
		
		// Bullets
		if (bullets && bullets.length > 0) {
			latex += "\\resumeItemListStart\n";
			bullets.forEach((bullet) => {
				latex += `\\resumeItem{${escapeLatex(bullet.content)}}\n`;
			});
			latex += "\\resumeItemListEnd\n";
		}
	});
	
	latex += "\\resumeSubHeadingListEnd\n\n";
	
	return latex;
}

/**
 * Generates LaTeX for skills section
 */
function generateSkills(skills: PersistentCurriculumVitae["skills"]): string {
	if (!skills || skills.length === 0) return "";
	
	const skillsList = skills.map((skill) => escapeLatex(skill.content)).join(", ");
	
	return `\\section{Skills}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{${skillsList}}}
 \\end{itemize}

`;
}

/**
 * Generates LaTeX for interests section
 */
function generateInterests(interests: PersistentCurriculumVitae["interests"]): string {
	if (!interests || interests.length === 0) return "";
	
	const interestsList = interests.map((interest) => escapeLatex(interest.content)).join(", ");
	
	return `\\section{Interests}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{${interestsList}}}
 \\end{itemize}

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
	
	// Education
	latex += generateEducation(cvData.education);
	
	// Experience
	latex += generateExperience(cvData.experience);
	
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