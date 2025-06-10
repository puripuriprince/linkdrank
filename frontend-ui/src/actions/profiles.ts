import {endpoints} from "@/lib/axios";
import type { ProfileWithRelations } from "@/types/profile";

import {
  searchProfilesInDB, 
  getProfilesPreviewFromDB,
  getProfileByLinkedInUrl,
} from './profiles-db';

// Configuration flag - set to true when you want to use the database
const USE_DATABASE = process.env.NODE_ENV === 'production' || process.env.USE_DATABASE === 'true';

// Sample data that matches the Drizzle ProfileWithRelations structure
export const SAMPLE_PROFILES: ProfileWithRelations[] = [
  {
    // Core Drizzle Profile fields
    id: 1,
    linkedinId: "sarah-chen-ai",
    firstName: "Sarah",
    lastName: "Chen",
    headline: "Senior Software Engineer | AI/ML Specialist",
    summary: "Passionate software engineer with 8+ years of experience in machine learning and artificial intelligence. Led multiple high-impact projects in computer vision and natural language processing.",
    profilePictureUrl: "https://images.unsplash.com/photo-1494790108755-2616b6ca02c4?w=400&h=400&fit=crop&crop=face",
    backgroundImageUrl: null,
    locationId: 1,
    industryId: 1,
    connectionsCount: 1523,
    followersCount: 2847,
    lastUpdated: new Date(),

    // Related data
    location: {
      id: 1,
      city: "San Francisco",
      state: "California",
      country: "United States"
    },
    industry: {
      id: 1,
      name: "Technology"
    },
    educations: [
      {
        id: 1,
        userId: 1,
        schoolId: 1,
        degreeName: "Master of Science",
        fieldOfStudy: "Computer Science",
        startDate: { year: 2017 },
        endDate: { year: 2019 },
        description: "Focus on Machine Learning and Artificial Intelligence",
        school: {
          id: 1,
          name: "Stanford University",
          logoUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=100&h=100&fit=crop",
          linkedinUrl: null
        }
      },
      {
        id: 2,
        userId: 1,
        schoolId: 2,
        degreeName: "Bachelor of Science",
        fieldOfStudy: "Electrical Engineering",
        startDate: { year: 2013 },
        endDate: { year: 2017 },
        description: null,
        school: {
          id: 2,
          name: "UC Berkeley",
          logoUrl: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=100&h=100&fit=crop",
          linkedinUrl: null
        }
      }
    ],
    experiences: [
      {
        id: 1,
        userId: 1,
        organizationId: 1,
        title: "Senior Software Engineer",
        description: "Lead AI/ML initiatives for computer vision products serving 10M+ users. Architected and implemented scalable ML pipelines using AWS and Kubernetes.",
        startDate: { year: 2021, month: 1 },
        endDate: null,
        locationId: 1,
        organization: {
          id: 1,
          name: "TechCorp AI",
          logoUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop",
          linkedinUrl: null
        },
        location: {
          id: 1,
          city: "San Francisco",
          state: "California",
          country: "United States"
        }
      },
      {
        id: 2,
        userId: 1,
        organizationId: 2,
        title: "Machine Learning Engineer",
        description: "Developed deep learning models for image recognition and classification. Improved model accuracy by 23% through novel data augmentation techniques.",
        startDate: { year: 2019, month: 3 },
        endDate: { year: 2020, month: 12 },
        locationId: 2,
        organization: {
          id: 2,
          name: "DataVision Inc",
          logoUrl: "https://images.unsplash.com/photo-1553484771-371a605b060b?w=100&h=100&fit=crop",
          linkedinUrl: null
        },
        location: {
          id: 2,
          city: "Palo Alto",
          state: "California",
          country: "United States"
        }
      }
    ],
    certifications: [
      {
        id: 1,
        userId: 1,
        name: "AWS Certified Machine Learning - Specialty",
        authority: "Amazon Web Services",
        displaySource: "AWS",
        licenseNumber: "AWS-MLS-001234",
        url: "https://www.credly.com/badges/sample-aws-ml",
        startDate: { year: 2023, month: 3 },
        endDate: { year: 2026, month: 3 }
      }
    ],
    skills: [
      {
        userId: 1,
        skillId: 1,
        skill: { id: 1, name: "Machine Learning" }
      },
      {
        userId: 1,
        skillId: 2,
        skill: { id: 2, name: "Python" }
      },
      {
        userId: 1,
        skillId: 3,
        skill: { id: 3, name: "TensorFlow" }
      }
    ],
    languages: [
      {
        userId: 1,
        languageId: 1,
        proficiency: "NATIVE_OR_BILINGUAL",
        language: { id: 1, name: "English" }
      },
      {
        userId: 1,
        languageId: 2,
        proficiency: "NATIVE_OR_BILINGUAL",
        language: { id: 2, name: "Mandarin" }
      }
    ],
    volunteers: [],
    publications: [],
    awards: [
      {
        id: 1,
        userId: 1,
        title: "AI Innovation Award",
        description: "Recognized for outstanding contribution to AI research and development",
        awardDate: { year: 2023 },
        issuer: "TechCorp AI"
      }
    ],
    projects: [
      {
        id: 1,
        userId: 1,
        title: "Real-time Object Detection System",
        description: "Built a real-time object detection system using YOLO v8 and deployed on edge devices. Achieved 45 FPS performance on mobile hardware.",
        startDate: { year: 2023, month: 6 },
        endDate: { year: 2023, month: 11 }
      }
    ]
  },
  {
    // Core Drizzle Profile fields
    id: 2,
    linkedinId: "michael-rodriguez-dev",
    firstName: "Michael",
    lastName: "Rodriguez",
    headline: "Full Stack Developer | React & Node.js Expert",
    summary: "Experienced full-stack developer with expertise in modern web technologies. Passionate about creating efficient, scalable solutions and mentoring junior developers.",
    profilePictureUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    backgroundImageUrl: null,
    locationId: 2,
    industryId: 1,
    connectionsCount: 892,
    followersCount: 1245,
    lastUpdated: new Date(),

    // Related data
    location: {
      id: 2,
      city: "Austin",
      state: "Texas",
      country: "United States"
    },
    industry: {
      id: 1,
      name: "Technology"
    },
    educations: [
      {
        id: 3,
        userId: 2,
        schoolId: 3,
        degreeName: "Bachelor of Science",
        fieldOfStudy: "Computer Science",
        startDate: { year: 2015 },
        endDate: { year: 2019 },
        description: "Focus on Software Engineering and Web Development",
        school: {
          id: 3,
          name: "University of Texas at Austin",
          logoUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=100&h=100&fit=crop",
          linkedinUrl: null
        }
      }
    ],
    experiences: [
      {
        id: 3,
        userId: 2,
        organizationId: 3,
        title: "Senior Full Stack Developer",
        description: "Lead development of React applications and Node.js APIs. Mentored team of 5 junior developers and improved deployment pipeline efficiency by 40%.",
        startDate: { year: 2022, month: 6 },
        endDate: null,
        locationId: 2,
        organization: {
          id: 3,
          name: "WebTech Solutions",
          logoUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&h=100&fit=crop",
          linkedinUrl: null
        },
        location: {
          id: 2,
          city: "Austin",
          state: "Texas",
          country: "United States"
        }
      }
    ],
    certifications: [
      {
        id: 2,
        userId: 2,
        name: "React Developer Certification",
        authority: "Meta",
        displaySource: "Meta",
        licenseNumber: "META-REACT-5678",
        url: "https://www.coursera.org/account/accomplishments/specialization/sample",
        startDate: { year: 2023, month: 8 },
        endDate: null
      }
    ],
    skills: [
      {
        userId: 2,
        skillId: 4,
        skill: { id: 4, name: "React" }
      },
      {
        userId: 2,
        skillId: 5,
        skill: { id: 5, name: "Node.js" }
      },
      {
        userId: 2,
        skillId: 6,
        skill: { id: 6, name: "TypeScript" }
      }
    ],
    languages: [
      {
        userId: 2,
        languageId: 1,
        proficiency: "NATIVE_OR_BILINGUAL",
        language: { id: 1, name: "English" }
      },
      {
        userId: 2,
        languageId: 3,
        proficiency: "PROFESSIONAL_WORKING",
        language: { id: 3, name: "Spanish" }
      }
    ],
    volunteers: [],
    publications: [],
    awards: [],
    projects: [
      {
        id: 2,
        userId: 2,
        title: "E-commerce Platform",
        description: "Built a full-stack e-commerce platform using React, Node.js, and PostgreSQL. Supports 50,000+ concurrent users with 99.9% uptime.",
        startDate: { year: 2023, month: 1 },
        endDate: { year: 2023, month: 8 }
      }
    ]
  },
  {
    // Core Drizzle Profile fields
    id: 3,
    linkedinId: "emily-wang-data",
    firstName: "Emily",
    lastName: "Wang",
    headline: "Data Scientist | Machine Learning Researcher",
    summary: "Data scientist with PhD in Statistics and 6+ years of experience in predictive modeling and data analysis. Published researcher in top-tier ML conferences.",
    profilePictureUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    backgroundImageUrl: null,
    locationId: 3,
    industryId: 1,
    connectionsCount: 1876,
    followersCount: 3421,
    lastUpdated: new Date(),

    // Related data
    location: {
      id: 3,
      city: "Seattle",
      state: "Washington",
      country: "United States"
    },
    industry: {
      id: 1,
      name: "Technology"
    },
    educations: [
      {
        id: 4,
        userId: 3,
        schoolId: 4,
        degreeName: "PhD",
        fieldOfStudy: "Statistics",
        startDate: { year: 2016 },
        endDate: { year: 2020 },
        description: "Dissertation on Advanced Statistical Methods for Machine Learning",
        school: {
          id: 4,
          name: "University of Washington",
          logoUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=100&h=100&fit=crop",
          linkedinUrl: null
        }
      }
    ],
    experiences: [
      {
        id: 4,
        userId: 3,
        organizationId: 4,
        title: "Senior Data Scientist",
        description: "Built predictive models for recommendation systems serving 100M+ users. Published 8 papers in top ML conferences including NeurIPS and ICML.",
        startDate: { year: 2021, month: 2 },
        endDate: null,
        locationId: 3,
        organization: {
          id: 4,
          name: "Amazon",
          logoUrl: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=100&h=100&fit=crop",
          linkedinUrl: null
        },
        location: {
          id: 3,
          city: "Seattle",
          state: "Washington",
          country: "United States"
        }
      }
    ],
    certifications: [
      {
        id: 3,
        userId: 3,
        name: "Google Cloud Professional Data Engineer",
        authority: "Google Cloud",
        displaySource: "Google Cloud",
        licenseNumber: "GCP-PDE-9012",
        url: "https://www.credential.net/sample-gcp-de",
        startDate: { year: 2022, month: 11 },
        endDate: { year: 2025, month: 11 }
      }
    ],
    skills: [
      {
        userId: 3,
        skillId: 2,
        skill: { id: 2, name: "Python" }
      },
      {
        userId: 3,
        skillId: 7,
        skill: { id: 7, name: "R" }
      },
      {
        userId: 3,
        skillId: 8,
        skill: { id: 8, name: "SQL" }
      }
    ],
    languages: [
      {
        userId: 3,
        languageId: 1,
        proficiency: "NATIVE_OR_BILINGUAL",
        language: { id: 1, name: "English" }
      },
      {
        userId: 3,
        languageId: 2,
        proficiency: "NATIVE_OR_BILINGUAL",
        language: { id: 2, name: "Mandarin" }
      }
    ],
    volunteers: [
      {
        id: 1,
        userId: 3,
        organizationId: 5,
        role: "Data Science Mentor",
        cause: "Education",
        description: "Mentor underrepresented students in data science and statistics",
        startDate: { year: 2022, month: 1 },
        endDate: null,
        organization: {
          id: 5,
          name: "Women in Data Science",
          logoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop",
          linkedinUrl: null
        }
      }
    ],
    publications: [
      {
        id: 1,
        userId: 3,
        name: "Advanced Techniques in Deep Learning for Recommendation Systems",
        publisher: "Neural Information Processing Systems (NeurIPS) 2023",
        pubDate: { year: 2023, month: 12 },
        url: "https://papers.nips.cc/sample-publication"
      }
    ],
    awards: [
      {
        id: 2,
        userId: 3,
        title: "Best Paper Award - NeurIPS 2023",
        description: "Awarded for outstanding contribution to machine learning research",
        awardDate: { year: 2023 },
        issuer: "Neural Information Processing Systems"
      }
    ],
    projects: [
      {
        id: 3,
        userId: 3,
        title: "Large-Scale Recommendation Engine",
        description: "Developed a recommendation system handling 1B+ user interactions daily using Apache Spark and deep learning models.",
        startDate: { year: 2022, month: 3 },
        endDate: { year: 2023, month: 9 }
      }
    ]
  },
  {
    id: 4,
    linkedinId: "jessica-wang-designer",
    firstName: "Jessica",
    lastName: "Wang",
    headline: "UX/UI Designer | Design Systems Specialist",
    summary: "Creative UX/UI designer with 6+ years of experience in creating user-centered digital experiences. Passionate about accessibility and inclusive design.",
    profilePictureUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    backgroundImageUrl: null,
    locationId: 3,
    industryId: 1,
    connectionsCount: 1156,
    followersCount: 890,
    lastUpdated: new Date(),
    location: { id: 3, city: "Seattle", state: "Washington", country: "United States" },
    industry: { id: 1, name: "Technology" },
    educations: [
      {
        id: 4,
        userId: 4,
        schoolId: 4,
        degreeName: "Bachelor of Fine Arts",
        fieldOfStudy: "Graphic Design",
        startDate: { year: 2016 },
        endDate: { year: 2020 },
        description: "Focus on digital design and user experience",
        school: { id: 4, name: "Art Center College of Design", logoUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=100&h=100&fit=crop", linkedinUrl: null }
      }
    ],
    experiences: [
      {
        id: 4,
        userId: 4,
        organizationId: 4,
        title: "Senior UX Designer",
        description: "Lead design for mobile applications used by 5M+ users. Established design system reducing development time by 30%.",
        startDate: { year: 2022, month: 1 },
        endDate: null,
        locationId: 3,
        organization: { id: 4, name: "DesignTech Inc", logoUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop", linkedinUrl: null },
        location: { id: 3, city: "Seattle", state: "Washington", country: "United States" }
      }
    ],
    certifications: [],
    skills: [
      { userId: 4, skillId: 9, skill: { id: 9, name: "Figma" } },
      { userId: 4, skillId: 10, skill: { id: 10, name: "Sketch" } },
      { userId: 4, skillId: 11, skill: { id: 11, name: "Adobe Creative Suite" } }
    ],
    languages: [
      { userId: 4, languageId: 1, proficiency: "NATIVE_OR_BILINGUAL", language: { id: 1, name: "English" } }
    ],
    volunteers: [],
    publications: [],
    awards: [],
    projects: [
      {
        id: 4,
        userId: 4,
        title: "Mobile Banking App Redesign",
        description: "Complete redesign of mobile banking application improving user satisfaction by 40%.",
        startDate: { year: 2023, month: 1 },
        endDate: { year: 2023, month: 8 }
      }
    ]
  },
  {
    id: 5,
    linkedinId: "david-kim-marketing",
    firstName: "David",
    lastName: "Kim",
    headline: "Digital Marketing Manager | Growth Specialist",
    summary: "Results-driven marketing professional with expertise in digital campaigns, SEO, and growth hacking. Increased user acquisition by 200% in previous role.",
    profilePictureUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    backgroundImageUrl: null,
    locationId: 4,
    industryId: 2,
    connectionsCount: 2341,
    followersCount: 1876,
    lastUpdated: new Date(),
    location: { id: 4, city: "New York", state: "New York", country: "United States" },
    industry: { id: 2, name: "Marketing" },
    educations: [
      {
        id: 5,
        userId: 5,
        schoolId: 5,
        degreeName: "Master of Business Administration",
        fieldOfStudy: "Marketing",
        startDate: { year: 2018 },
        endDate: { year: 2020 },
        description: "Focus on Digital Marketing and Analytics",
        school: { id: 5, name: "NYU Stern School of Business", logoUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=100&h=100&fit=crop", linkedinUrl: null }
      }
    ],
    experiences: [
      {
        id: 5,
        userId: 5,
        organizationId: 5,
        title: "Digital Marketing Manager",
        description: "Lead digital marketing campaigns across multiple channels. Managed $2M annual ad spend with 150% ROI improvement.",
        startDate: { year: 2021, month: 3 },
        endDate: null,
        locationId: 4,
        organization: { id: 5, name: "GrowthCorp", logoUrl: "https://images.unsplash.com/photo-1553484771-371a605b060b?w=100&h=100&fit=crop", linkedinUrl: null },
        location: { id: 4, city: "New York", state: "New York", country: "United States" }
      }
    ],
    certifications: [
      {
        id: 3,
        userId: 5,
        name: "Google Ads Certification",
        authority: "Google",
        displaySource: "Google",
        licenseNumber: "GADS-2023-5678",
        url: "https://skillshop.credential.net/sample",
        startDate: { year: 2023, month: 1 },
        endDate: { year: 2024, month: 1 }
      }
    ],
    skills: [
      { userId: 5, skillId: 12, skill: { id: 12, name: "Google Analytics" } },
      { userId: 5, skillId: 13, skill: { id: 13, name: "SEO" } },
      { userId: 5, skillId: 14, skill: { id: 14, name: "Facebook Ads" } }
    ],
    languages: [
      { userId: 5, languageId: 1, proficiency: "NATIVE_OR_BILINGUAL", language: { id: 1, name: "English" } },
      { userId: 5, languageId: 3, proficiency: "FULL_PROFESSIONAL", language: { id: 3, name: "Korean" } }
    ],
    volunteers: [],
    publications: [],
    awards: [
      {
        id: 3,
        userId: 5,
        title: "Digital Marketer of the Year",
        description: "Recognized for outstanding digital marketing campaigns",
        awardDate: { year: 2023 },
        issuer: "Marketing Excellence Awards"
      }
    ],
    projects: []
  },
  {
    id: 6,
    linkedinId: "amanda-johnson-hr",
    firstName: "Amanda",
    lastName: "Johnson",
    headline: "HR Director | Talent Acquisition Specialist",
    summary: "Strategic HR leader with 10+ years experience in talent acquisition and organizational development.",
    profilePictureUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face",
    backgroundImageUrl: null,
    locationId: 5,
    industryId: 3,
    connectionsCount: 3241,
    followersCount: 2156,
    lastUpdated: new Date(),
    location: { id: 5, city: "Chicago", state: "Illinois", country: "United States" },
    industry: { id: 3, name: "Human Resources" },
    educations: [
      {
        id: 6,
        userId: 6,
        schoolId: 6,
        degreeName: "Master of Science",
        fieldOfStudy: "Human Resources Management",
        startDate: { year: 2012 },
        endDate: { year: 2014 },
        description: null,
        school: { id: 6, name: "Northwestern University", logoUrl: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=100&h=100&fit=crop", linkedinUrl: null }
      }
    ],
    experiences: [
      {
        id: 6,
        userId: 6,
        organizationId: 6,
        title: "HR Director",
        description: "Lead talent acquisition for 500+ employee organization. Reduced hiring time by 40% through process optimization.",
        startDate: { year: 2020, month: 6 },
        endDate: null,
        locationId: 5,
        organization: { id: 6, name: "TalentFirst Corp", logoUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&h=100&fit=crop", linkedinUrl: null },
        location: { id: 5, city: "Chicago", state: "Illinois", country: "United States" }
      }
    ],
    certifications: [
      {
        id: 4,
        userId: 6,
        name: "SHRM-SCP Certification",
        authority: "SHRM",
        displaySource: "SHRM",
        licenseNumber: "SHRM-SCP-001",
        url: "https://www.shrm.org/certification",
        startDate: { year: 2021, month: 6 },
        endDate: { year: 2024, month: 6 }
      }
    ],
    skills: [
      { userId: 6, skillId: 15, skill: { id: 15, name: "Talent Acquisition" } },
      { userId: 6, skillId: 16, skill: { id: 16, name: "Performance Management" } },
      { userId: 6, skillId: 17, skill: { id: 17, name: "Employee Relations" } }
    ],
    languages: [
      { userId: 6, languageId: 1, proficiency: "NATIVE_OR_BILINGUAL", language: { id: 1, name: "English" } }
    ],
    volunteers: [],
    publications: [],
    awards: [],
    projects: []
  },
  {
    id: 7,
    linkedinId: "robert-taylor-finance",
    firstName: "Robert",
    lastName: "Taylor",
    headline: "Financial Analyst | Investment Banking",
    summary: "Experienced financial analyst with expertise in investment banking and portfolio management.",
    profilePictureUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face",
    backgroundImageUrl: null,
    locationId: 6,
    industryId: 4,
    connectionsCount: 1876,
    followersCount: 1234,
    lastUpdated: new Date(),
    location: { id: 6, city: "Boston", state: "Massachusetts", country: "United States" },
    industry: { id: 4, name: "Finance" },
    educations: [],
    experiences: [],
    certifications: [],
    skills: [],
    languages: [],
    volunteers: [],
    publications: [],
    awards: [],
    projects: []
  },
  {
    id: 8,
    linkedinId: "lisa-chen-product",
    firstName: "Lisa",
    lastName: "Chen",
    headline: "Product Manager | Fintech Innovation",
    summary: "Strategic product manager with 7+ years in fintech. Led product launches that generated $50M+ in revenue.",
    profilePictureUrl: "https://images.unsplash.com/photo-1494790108755-2616b6ca02c4?w=400&h=400&fit=crop&crop=face",
    backgroundImageUrl: null,
    locationId: 1,
    industryId: 1,
    connectionsCount: 2134,
    followersCount: 1876,
    lastUpdated: new Date(),
    location: { id: 1, city: "San Francisco", state: "California", country: "United States" },
    industry: { id: 1, name: "Technology" },
    educations: [],
    experiences: [],
    certifications: [],
    skills: [],
    languages: [],
    volunteers: [],
    publications: [],
    awards: [],
    projects: []
  },
  {
    id: 9,
    linkedinId: "james-wilson-sales",
    firstName: "James",
    lastName: "Wilson",
    headline: "Sales Director | B2B Enterprise Solutions",
    summary: "Results-driven sales leader with 12+ years experience in B2B enterprise sales. Consistently exceeded quotas by 150%+.",
    profilePictureUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    backgroundImageUrl: null,
    locationId: 7,
    industryId: 5,
    connectionsCount: 4321,
    followersCount: 2987,
    lastUpdated: new Date(),
    location: { id: 7, city: "Atlanta", state: "Georgia", country: "United States" },
    industry: { id: 5, name: "Sales" },
    educations: [],
    experiences: [],
    certifications: [],
    skills: [],
    languages: [],
    volunteers: [],
    publications: [],
    awards: [],
    projects: []
  },
  {
    id: 10,
    linkedinId: "maria-garcia-consultant",
    firstName: "Maria",
    lastName: "Garcia",
    headline: "Management Consultant | Strategy & Operations",
    summary: "Experienced management consultant specializing in strategy and operations optimization for Fortune 500 companies.",
    profilePictureUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face",
    backgroundImageUrl: null,
    locationId: 8,
    industryId: 6,
    connectionsCount: 1987,
    followersCount: 1456,
    lastUpdated: new Date(),
    location: { id: 8, city: "Miami", state: "Florida", country: "United States" },
    industry: { id: 6, name: "Consulting" },
    educations: [],
    experiences: [],
    certifications: [],
    skills: [],
    languages: [],
    volunteers: [],
    publications: [],
    awards: [],
    projects: []
  },
  {
    id: 11,
    linkedinId: "alex-brown-dev",
    firstName: "Alex",
    lastName: "Brown",
    headline: "Backend Developer | Microservices Architecture",
    summary: "Senior backend developer with expertise in distributed systems and cloud architecture.",
    profilePictureUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    backgroundImageUrl: null,
    locationId: 3,
    industryId: 1,
    connectionsCount: 987,
    followersCount: 654,
    lastUpdated: new Date(),
    location: { id: 3, city: "Seattle", state: "Washington", country: "United States" },
    industry: { id: 1, name: "Technology" },
    educations: [],
    experiences: [],
    certifications: [],
    skills: [],
    languages: [],
    volunteers: [],
    publications: [],
    awards: [],
    projects: []
  },
  {
    id: 12,
    linkedinId: "jennifer-lee-nurse",
    firstName: "Jennifer",
    lastName: "Lee",
    headline: "Registered Nurse | ICU Specialist",
    summary: "Dedicated healthcare professional with 8+ years in intensive care nursing.",
    profilePictureUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
    backgroundImageUrl: null,
    locationId: 9,
    industryId: 7,
    connectionsCount: 456,
    followersCount: 234,
    lastUpdated: new Date(),
    location: { id: 9, city: "Phoenix", state: "Arizona", country: "United States" },
    industry: { id: 7, name: "Healthcare" },
    educations: [],
    experiences: [],
    certifications: [],
    skills: [],
    languages: [],
    volunteers: [],
    publications: [],
    awards: [],
    projects: []
  },
  {
    id: 13,
    linkedinId: "chris-martin-teacher",
    firstName: "Chris",
    lastName: "Martin",
    headline: "High School Mathematics Teacher | Education Innovation",
    summary: "Passionate educator with 10+ years teaching mathematics and developing innovative curriculum.",
    profilePictureUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    backgroundImageUrl: null,
    locationId: 10,
    industryId: 8,
    connectionsCount: 567,
    followersCount: 345,
    lastUpdated: new Date(),
    location: { id: 10, city: "Denver", state: "Colorado", country: "United States" },
    industry: { id: 8, name: "Education" },
    educations: [],
    experiences: [],
    certifications: [],
    skills: [],
    languages: [],
    volunteers: [],
    publications: [],
    awards: [],
    projects: []
  },
  {
    id: 14,
    linkedinId: "sarah-davis-lawyer",
    firstName: "Sarah",
    lastName: "Davis",
    headline: "Corporate Lawyer | M&A Specialist",
    summary: "Corporate attorney specializing in mergers and acquisitions for mid-market companies.",
    profilePictureUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    backgroundImageUrl: null,
    locationId: 4,
    industryId: 9,
    connectionsCount: 1234,
    followersCount: 876,
    lastUpdated: new Date(),
    location: { id: 4, city: "New York", state: "New York", country: "United States" },
    industry: { id: 9, name: "Legal" },
    educations: [],
    experiences: [],
    certifications: [],
    skills: [],
    languages: [],
    volunteers: [],
    publications: [],
    awards: [],
    projects: []
  },
  {
    id: 15,
    linkedinId: "tom-anderson-architect",
    firstName: "Tom",
    lastName: "Anderson",
    headline: "Software Architect | Cloud Solutions",
    summary: "Senior software architect with expertise in cloud-native applications and enterprise architecture.",
    profilePictureUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face",
    backgroundImageUrl: null,
    locationId: 2,
    industryId: 1,
    connectionsCount: 2345,
    followersCount: 1567,
    lastUpdated: new Date(),
    location: { id: 2, city: "Austin", state: "Texas", country: "United States" },
    industry: { id: 1, name: "Technology" },
    educations: [],
    experiences: [],
    certifications: [],
    skills: [],
    languages: [],
    volunteers: [],
    publications: [],
    awards: [],
    projects: []
  },
  {
    id: 16,
    linkedinId: "rachel-white-scientist",
    firstName: "Rachel",
    lastName: "White",
    headline: "Research Scientist | Biotechnology",
    summary: "Research scientist focused on drug discovery and development in biotechnology.",
    profilePictureUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face",
    backgroundImageUrl: null,
    locationId: 6,
    industryId: 10,
    connectionsCount: 678,
    followersCount: 423,
    lastUpdated: new Date(),
    location: { id: 6, city: "Boston", state: "Massachusetts", country: "United States" },
    industry: { id: 10, name: "Biotechnology" },
    educations: [],
    experiences: [],
    certifications: [],
    skills: [],
    languages: [],
    volunteers: [],
    publications: [],
    awards: [],
    projects: []
  },
  {
    id: 17,
    linkedinId: "kevin-thomas-chef",
    firstName: "Kevin",
    lastName: "Thomas",
    headline: "Executive Chef | Culinary Innovation",
    summary: "Award-winning executive chef with 15+ years experience in fine dining and culinary innovation.",
    profilePictureUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    backgroundImageUrl: null,
    locationId: 11,
    industryId: 11,
    connectionsCount: 345,
    followersCount: 567,
    lastUpdated: new Date(),
    location: { id: 11, city: "Las Vegas", state: "Nevada", country: "United States" },
    industry: { id: 11, name: "Food & Beverage" },
    educations: [],
    experiences: [],
    certifications: [],
    skills: [],
    languages: [],
    volunteers: [],
    publications: [],
    awards: [],
    projects: []
  },
  {
    id: 18,
    linkedinId: "linda-moore-photographer",
    firstName: "Linda",
    lastName: "Moore",
    headline: "Professional Photographer | Portrait Specialist",
    summary: "Professional photographer specializing in portrait and event photography with 12+ years experience.",
    profilePictureUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
    backgroundImageUrl: null,
    locationId: 12,
    industryId: 12,
    connectionsCount: 789,
    followersCount: 1234,
    lastUpdated: new Date(),
    location: { id: 12, city: "Portland", state: "Oregon", country: "United States" },
    industry: { id: 12, name: "Photography" },
    educations: [],
    experiences: [],
    certifications: [],
    skills: [],
    languages: [],
    volunteers: [],
    publications: [],
    awards: [],
    projects: []
  },
  {
    id: 19,
    linkedinId: "steve-clark-mechanic",
    firstName: "Steve",
    lastName: "Clark",
    headline: "Automotive Technician | Electric Vehicle Specialist",
    summary: "Certified automotive technician with specialization in electric vehicle maintenance and repair.",
    profilePictureUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    backgroundImageUrl: null,
    locationId: 13,
    industryId: 13,
    connectionsCount: 234,
    followersCount: 156,
    lastUpdated: new Date(),
    location: { id: 13, city: "Detroit", state: "Michigan", country: "United States" },
    industry: { id: 13, name: "Automotive" },
    educations: [],
    experiences: [],
    certifications: [],
    skills: [],
    languages: [],
    volunteers: [],
    publications: [],
    awards: [],
    projects: []
  },
  {
    id: 20,
    linkedinId: "nancy-taylor-writer",
    firstName: "Nancy",
    lastName: "Taylor",
    headline: "Technical Writer | Documentation Specialist",
    summary: "Experienced technical writer creating clear, user-friendly documentation for software products.",
    profilePictureUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    backgroundImageUrl: null,
    locationId: 3,
    industryId: 1,
    connectionsCount: 456,
    followersCount: 278,
    lastUpdated: new Date(),
    location: { id: 3, city: "Seattle", state: "Washington", country: "United States" },
    industry: { id: 1, name: "Technology" },
    educations: [],
    experiences: [],
    certifications: [],
    skills: [],
    languages: [],
    volunteers: [],
    publications: [],
    awards: [],
    projects: []
  }
];

export async function getProfilesPreview(page: number = 1, limit: number = 10) {
  if (USE_DATABASE) {
    try {
      const result = await getProfilesPreviewFromDB(page, limit);
      return result.profiles;
    } catch (error) {
      console.error('Database error, falling back to sample data:', error);
    }
  }

  await new Promise((resolve) => setTimeout(resolve, 1000));
  return SAMPLE_PROFILES.slice((page - 1) * limit, page * limit);
}

export async function searchProfiles(
  query: string,
  page: number = 1,
  limit: number = 10,
) {
  if (USE_DATABASE) {
    try {
      const result = await searchProfilesInDB(query, page, limit);
      return result.profiles;
    } catch (error) {
      console.error('Database error, falling back to sample data:', error);
    }
  }

  if (!query) {
    return SAMPLE_PROFILES.slice((page - 1) * limit, page * limit);
  }
  
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return  SAMPLE_PROFILES.filter(
    (profile) =>
      `${profile.firstName} ${profile.lastName}`.toLowerCase().includes(query.toLowerCase()) ||
      profile.headline?.toLowerCase().includes(query.toLowerCase()) ||
      profile.summary?.toLowerCase().includes(query.toLowerCase()),
  ).slice((page - 1) * limit, page * limit);
}

export async function getProfile(
  url: string,
  acceptedSchools?: string[],
  onMessage?: (msg: string) => void,
): Promise<unknown> {
  if (USE_DATABASE) {
    try {
      const profile = await getProfileByLinkedInUrl(url);
      if (profile) {
        return profile;
      }
    } catch (error) {
      console.error('Database error, falling back to API:', error);
    }
  }

  // Fallback to API call
  const response = await fetch(endpoints.get_profile, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ linkedinUrl: url, acceptedSchools }),
  });

  if (!response.body) {
    throw new Error("ReadableStream not supported in this browser.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let profileData: Record<string, unknown> | null = null;
  let done = false;

  while (!done) {
    const { value, done: doneReading } = await reader.read();
    done = doneReading;
    const chunk = decoder.decode(value, { stream: !done });

    try {
      const parsed = JSON.parse(chunk);
      if (parsed.success && parsed.profile) {
        profileData = parsed.profile;
        break;
      }
    } catch {
      if (onMessage && chunk.trim().length > 0) {
        onMessage(chunk.trim());
      }
    }
  }
  return profileData;
}
