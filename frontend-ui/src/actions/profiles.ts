import {endpoints} from "@/lib/axios";
import type { ProfileWithRelations } from "@/types/profile";
import { ADDITIONAL_PROFILES } from "./additional-profiles";

// Import the new database actions
import { 
  searchProfilesInDB, 
  getProfilesPreviewFromDB,
  getProfileByLinkedInUrl,
  getProfileByLinkedInId
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
  }
];

// Combine all profiles to have 20 total
const ALL_PROFILES = [...SAMPLE_PROFILES, ...ADDITIONAL_PROFILES];

export async function getProfilesPreview(page: number = 1, limit: number = 10) {
  if (USE_DATABASE) {
    try {
      const result = await getProfilesPreviewFromDB(page, limit);
      return result.profiles;
    } catch (error) {
      console.error('Database error, falling back to sample data:', error);
      // Fall back to sample data
    }
  }

  // Fallback to sample data
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const profiles = ALL_PROFILES.slice((page - 1) * limit, page * limit);
  // Return profiles with their original IDs to prevent duplication
  return profiles;
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
      // Fall back to sample data
    }
  }

  // Fallback to sample data
  if (!query) {
    const profiles = ALL_PROFILES.slice((page - 1) * limit, page * limit);
    // Return profiles with their original IDs to prevent duplication
    return profiles;
  }
  
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const filteredProfiles = ALL_PROFILES.filter(
    (profile) =>
      `${profile.firstName} ${profile.lastName}`.toLowerCase().includes(query.toLowerCase()) ||
      profile.headline?.toLowerCase().includes(query.toLowerCase()) ||
      profile.summary?.toLowerCase().includes(query.toLowerCase()),
  ).slice((page - 1) * limit, page * limit);
  
  // Return filtered profiles with their original IDs to prevent duplication
  return filteredProfiles;
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
