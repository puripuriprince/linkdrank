import { CONFIG } from "src/global-config";

import {
  _id,
  _ages,
  _roles,
  _prices,
  _emails,
  _ratings,
  _nativeS,
  _nativeM,
  _nativeL,
  _percents,
  _booleans,
  _sentences,
  _lastNames,
  _fullNames,
  _tourNames,
  _jobTitles,
  _taskNames,
  _fileNames,
  _postTitles,
  _firstNames,
  _eventNames,
  _courseNames,
  _fullAddress,
  _companyNames,
  _productNames,
  _descriptions,
  _phoneNumbers,
  _countryNames,
} from "./assets";
import { PersistentCurriculumVitae } from "@/types/cv";

// ----------------------------------------------------------------------

export const _mock = {
  id: (index: number) => _id[index],
  time: () => new Date().toISOString(),
  boolean: (index: number) => _booleans[index],
  role: (index: number) => _roles[index],
  // Text
  courseNames: (index: number) => _courseNames[index],
  fileNames: (index: number) => _fileNames[index],
  eventNames: (index: number) => _eventNames[index],
  taskNames: (index: number) => _taskNames[index],
  postTitle: (index: number) => _postTitles[index],
  jobTitle: (index: number) => _jobTitles[index],
  tourName: (index: number) => _tourNames[index],
  productName: (index: number) => _productNames[index],
  sentence: (index: number) => _sentences[index],
  description: (index: number) => _descriptions[index],
  // Contact
  email: (index: number) => _emails[index],
  phoneNumber: (index: number) => _phoneNumbers[index],
  fullAddress: (index: number) => _fullAddress[index],
  // Name
  firstName: (index: number) => _firstNames[index],
  lastName: (index: number) => _lastNames[index],
  fullName: (index: number) => _fullNames[index],
  companyNames: (index: number) => _companyNames[index],
  countryNames: (index: number) => _countryNames[index],
  // Number
  number: {
    percent: (index: number) => _percents[index],
    rating: (index: number) => _ratings[index],
    age: (index: number) => _ages[index],
    price: (index: number) => _prices[index],
    nativeS: (index: number) => _nativeS[index],
    nativeM: (index: number) => _nativeM[index],
    nativeL: (index: number) => _nativeL[index],
  },
  // Image
  image: {
    cover: (index: number) =>
      `${CONFIG.assetsDir}/assets/images/mock/cover/cover-${index + 1}.webp`,
    avatar: (index: number) =>
      `${CONFIG.assetsDir}/assets/images/mock/avatar/avatar-${index + 1}.webp`,
    travel: (index: number) =>
      `${CONFIG.assetsDir}/assets/images/mock/travel/travel-${index + 1}.webp`,
    course: (index: number) =>
      `${CONFIG.assetsDir}/assets/images/mock/course/course-${index + 1}.webp`,
    company: (index: number) =>
      `${CONFIG.assetsDir}/assets/images/mock/company/company-${index + 1}.webp`,
    product: (index: number) =>
      `${CONFIG.assetsDir}/assets/images/mock/m-product/product-${index + 1}.webp`,
    portrait: (index: number) =>
      `${CONFIG.assetsDir}/assets/images/mock/portrait/portrait-${index + 1}.webp`,
  },
};

export const CV_PRESETS: Record<string, PersistentCurriculumVitae> = {
	"railly-hugo": {
		fullName: "Railly Hugo",
		email: "railly.hugo@example.com",
		phone: "+51 987654321",
		location: "Lima, Peru",
		linkedInHandle: "linkedin.com/in/raillyhugo",
		githubHandle: "github.com/raillyhugo",
		websiteUrl: "raillyhugo.dev",
		summary:
			"Frontend Engineer passionate about creating exceptional user experiences with modern web technologies. Specialized in React, Next.js, and TypeScript.",
		education: [
			{
				id: "edu1",
				degree: "Computer Science",
				institution: "Universidad Nacional de Ingeniería",
				location: "Lima, Peru",
				dateRangeFrom: "2018",
				dateRangeTo: "2022",
			},
		],
		experience: [
			{
				id: "exp1",
				title: "Frontend Engineer",
				company: "GitHunter",
				location: "Remote, Peru",
				dateRangeFrom: "2023",
				dateRangeTo: "Present",
				bullets: [
					{
						id: "bullet1",
						content:
							"Built responsive web applications using React and Next.js",
					},
					{
						id: "bullet2",
						content: "Implemented modern UI/UX designs with Tailwind CSS",
					},
				],
				techStack: [
					{ id: "tech1", content: "React" },
					{ id: "tech2", content: "Next.js" },
					{ id: "tech3", content: "TypeScript" },
					{ id: "tech4", content: "Tailwind CSS" },
				],
			},
		],
		projects: [
			{
				id: "proj1",
				name: "GitHunter Platform",
				bullets: [
					{
						id: "projbullet1",
						content: "Frontend development for developer search platform",
					},
				],
				techStack: [
					{ id: "projtech1", content: "Next.js" },
					{ id: "projtech2", content: "React" },
				],
			},
		],
		skills: [
			{ id: "skill1", content: "React" },
			{ id: "skill2", content: "Next.js" },
			{ id: "skill3", content: "TypeScript" },
			{ id: "skill4", content: "Tailwind CSS" },
			{ id: "skill5", content: "JavaScript" },
		],
		interests: [
			{ id: "int1", content: "Frontend Development" },
			{ id: "int2", content: "UI/UX Design" },
			{ id: "int3", content: "Web Performance" },
		],
	},
	"jake-ryan": {
		fullName: "Jake Ryan",
		email: "jake@su.edu",
		phone: "123-456-7890",
		location: "Georgetown, TX",
		linkedInHandle: "linkedin.com/in/jake",
		githubHandle: "github.com/jake",
		websiteUrl: "",
		summary: "",
		education: [
			{
				id: "edu1-jake",
				degree: "Bachelor of Arts in Computer Science, Minor in Business",
				institution: "Southwestern University",
				location: "Georgetown, TX",
				dateRangeFrom: "Aug. 2018",
				dateRangeTo: "May 2021",
			},
			{
				id: "edu2-jake",
				degree: "Associate's in Liberal Arts",
				institution: "Blinn College",
				location: "Bryan, TX",
				dateRangeFrom: "Aug. 2014",
				dateRangeTo: "May 2018",
			},
		],
		experience: [
			{
				id: "exp1-jake",
				title: "Undergraduate Research Assistant",
				company: "Texas A&M University",
				location: "College Station, TX",
				dateRangeFrom: "June 2020",
				dateRangeTo: "Present",
				bullets: [
					{
						id: "exp1-bullet1",
						content: "Developed a REST API using FastAPI and PostgreSQL to store data from learning management systems",
					},
					{
						id: "exp1-bullet2",
						content: "Developed a full-stack web application using Flask, React, PostgreSQL and Docker to analyze GitHub data",
					},
					{
						id: "exp1-bullet3",
						content: "Explored ways to visualize GitHub collaboration in a classroom setting",
					},
				],
			},
			{
				id: "exp2-jake",
				title: "Information Technology Support Specialist",
				company: "Southwestern University",
				location: "Georgetown, TX",
				dateRangeFrom: "Sep. 2018",
				dateRangeTo: "Present",
				bullets: [
					{
						id: "exp2-bullet1",
						content: "Communicate with managers to set up campus computers used on campus",
					},
					{
						id: "exp2-bullet2",
						content: "Assess and troubleshoot computer problems brought by students, faculty and staff",
					},
					{
						id: "exp2-bullet3",
						content: "Maintain upkeep of computers, classroom equipment, and 200 printers across campus",
					},
				],
			},
			{
				id: "exp3-jake",
				title: "Artificial Intelligence Research Assistant",
				company: "Southwestern University",
				location: "Georgetown, TX",
				dateRangeFrom: "May 2019",
				dateRangeTo: "July 2019",
				bullets: [
					{
						id: "exp3-bullet1",
						content: "Explored methods to generate video game dungeons based off of The Legend of Zelda",
					},
					{
						id: "exp3-bullet2",
						content: "Developed a game in Java to test the generated dungeons",
					},
					{
						id: "exp3-bullet3",
						content: "Contributed 50K+ lines of code to an established codebase via Git",
					},
					{
						id: "exp3-bullet4",
						content: "Conducted a human subject study to determine which video game dungeon generation technique is enjoyable",
					},
					{
						id: "exp3-bullet5",
						content: "Wrote an 8-page paper and gave multiple presentations on-campus",
					},
					{
						id: "exp3-bullet6",
						content: "Presented virtually to the World Conference on Computational Intelligence",
					},
				],
			},
		],
		projects: [
			{
				id: "proj1-jake",
				name: "Gitlytics",
				dateRangeFrom: "June 2020",
				dateRangeTo: "Present",
				techStack: [
					{ id: "p1tech1", content: "Python" },
					{ id: "p1tech2", content: "Flask" },
					{ id: "p1tech3", content: "React" },
					{ id: "p1tech4", content: "PostgreSQL" },
					{ id: "p1tech5", content: "Docker" },
				],
				bullets: [
					{
						id: "proj1-bullet1",
						content: "Developed a full-stack web application using with Flask serving a REST API with React as the frontend",
					},
					{
						id: "proj1-bullet2",
						content: "Implemented GitHub OAuth to get data from user's repositories",
					},
					{ id: "proj1-bullet3", content: "Visualized GitHub data to show collaboration" },
					{ id: "proj1-bullet4", content: "Used Celery and Redis for asynchronous tasks" },
				],
			},
			{
				id: "proj2-jake",
				name: "Simple Paintball",
				dateRangeFrom: "May 2018",
				dateRangeTo: "May 2020",
				techStack: [
					{ id: "p2tech1", content: "Spigot API" },
					{ id: "p2tech2", content: "Java" },
					{ id: "p2tech3", content: "Maven" },
					{ id: "p2tech4", content: "TravisCI" },
					{ id: "p2tech5", content: "Git" },
				],
				bullets: [
					{
						id: "proj2-bullet1",
						content: "Developed a Minecraft server plugin to entertain kids during free time for a previous job",
					},
					{
						id: "proj2-bullet2",
						content: "Published plugin to websites gaining 2K+ downloads and an average 4.5/5-star review",
					},
					{
						id: "proj2-bullet3",
						content: "Implemented continuous delivery using TravisCI to build the plugin upon new a release",
					},
					{
						id: "proj2-bullet4",
						content: "Collaborated with Minecraft server administrators to suggest features and get feedback about the plugin",
					},
				],
			},
		],
		skills: [
			{ id: "skill1", content: "Java" },
			{ id: "skill2", content: "Python" },
			{ id: "skill3", content: "C/C++" },
			{ id: "skill4", content: "SQL (Postgres)" },
			{ id: "skill5", content: "JavaScript" },
			{ id: "skill6", content: "HTML/CSS" },
			{ id: "skill7", content: "R" },
			{ id: "skill8", content: "React" },
			{ id: "skill9", content: "Node.js" },
			{ id: "skill10", content: "Flask" },
			{ id: "skill11", content: "JUnit" },
			{ id: "skill12", content: "WordPress" },
			{ id: "skill13", content: "Material-UI" },
			{ id: "skill14", content: "FastAPI" },
			{ id: "skill15", content: "Git" },
			{ id: "skill16", content: "Docker" },
			{ id: "skill17", content: "TravisCI" },
			{ id: "skill18", content: "Google Cloud Platform" },
			{ id: "skill19", content: "VS Code" },
			{ id: "skill20", content: "Visual Studio" },
			{ id: "skill21", content: "PyCharm" },
			{ id: "skill22", content: "IntelliJ" },
			{ id: "skill23", content: "Eclipse" },
			{ id: "skill24", content: "pandas" },
			{ id: "skill25", content: "NumPy" },
			{ id: "skill26", content: "Matplotlib" },
		],
		interests: [],
	},
	"empty-template": {
		fullName: "",
		email: "",
		phone: "",
		location: "",
		linkedInHandle: "",
		githubHandle: "",
		websiteUrl: "",
		summary: "",
		education: [],
		experience: [],
		projects: [],
		skills: [],
		interests: [],
	},
};

export const PRESET_NAMES = {
	"railly-hugo": "Railly Hugo - Frontend Engineer",
	"jake-ryan": "Jake Ryan - Software Engineer",
	"empty-template": "Empty Template",
} as const;

export type PresetKey = keyof typeof CV_PRESETS;