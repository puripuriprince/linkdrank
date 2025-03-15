const SAMPLE_PROFILES = [
  {
    name: "Salma Elmahallawy",
    picture:
      "https://media.licdn.com/dms/image/v2/D4E03AQEq3TJlYCH6_Q/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1689957251626?e=1746662400&v=beta&t=fIHnu_tG8q7c7r578-QWrVDm5t2q-9lQieBj3qbfSvw",
    location: "Montreal, QC",
    title: "Software Developer at Google",
    company: null,
    job_title: null,
    linkedin_url: "https://www.linkedin.com/in/salma-elmahallawy-a008b9154",
    experiences: [],
    educations: [],
  },
  {
    name: "Adam Arcaro",
    picture:
      "https://media.licdn.com/dms/image/v2/D4E03AQERXoTJJQtUGQ/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1693064964377?e=1746662400&v=beta&t=kgzd-Ljdii1bRNetkvcr7Z4pCnRQC2I-X7EUQreAQvQ",
    location: "Canada",
    title: "Senior Software Engineer at Google",
    company: null,
    job_title: null,
    linkedin_url: "https://www.linkedin.com/in/adamtrudeauarcaro",
    experiences: [],
    educations: [],
  },
  {
    name: "Sourav Uttam Sinha",
    picture:
      "https://media.licdn.com/dms/image/v2/D4E03AQEjOsoWp08vGA/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1730486117665?e=1746662400&v=beta&t=RvhCaV8NgHjTlLiH3o9gNTH_g82xRstum591oPwM9FU",
    location: "Montreal, QC",
    title: "Software Developer at Google | Content Creator at YouTube",
    company: null,
    job_title: null,
    linkedin_url: "https://www.linkedin.com/in/sauravus",
    experiences: [],
    educations: [],
  },
  {
    name: "Yongxuan Zhang",
    picture:
      "https://media.licdn.com/dms/image/v2/D5603AQFSGGQtdYTBHA/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1674594487361?e=1746662400&v=beta&t=s8jBPeNyLDHwsy6ibuaS7iPUVHP8ycupACARyUhNKxU",
    location: "Canada",
    title: "Software Engineer at Google",
    company: null,
    job_title: null,
    linkedin_url: "https://www.linkedin.com/in/yongxuan-zhang-b219b5135",
    experiences: [],
    educations: [],
  },
  {
    name: "Nicolas MacBeth",
    picture:
      "https://media.licdn.com/dms/image/v2/C5603AQHDSWHnwUbGCg/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1593458158426?e=1746662400&v=beta&t=bdxY1xYourhQRh6v8vNJkB67CqWpVR9eWtnOLJzyPlQ",
    location: "Montreal, QC",
    title: "Software Engineer at Google (Chrome AI)",
    company: null,
    job_title: null,
    linkedin_url: "https://www.linkedin.com/in/nicolasmacbeth",
    experiences: [],
    educations: [],
  },
  {
    name: "Iman Saboori, Ph.D.",
    picture:
      "https://media.licdn.com/dms/image/v2/C4E03AQHEmbL_5zFcGQ/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1648662094709?e=1746662400&v=beta&t=bgd9Smot3Hsr5CNBqG8CUlkj6L8qm-_coLkdcS42p40",
    location: "Maple, ON",
    title: "Senior Software Engineer at Google",
    company: null,
    job_title: null,
    linkedin_url: "https://www.linkedin.com/in/iman-saboori",
    experiences: [],
    educations: [],
  },
  {
    name: "Parsa Pourali",
    picture:
      "https://media.licdn.com/dms/image/v2/C5603AQEZSRFkWBYQMg/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1567778194826?e=1746662400&v=beta&t=ptIMDPRLL7BbFA6Nd-ux2GQC6zkcAID_GMfQph7EB6U",
    location: "Toronto, ON",
    title: "Google, PhD",
    company: null,
    job_title: null,
    linkedin_url: "https://www.linkedin.com/in/parsapourali",
    experiences: [],
    educations: [],
  },
  {
    name: "Matthew Yu",
    picture:
      "https://media.licdn.com/dms/image/v2/D5603AQG1OKYXYDTtHw/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1721864293996?e=1746662400&v=beta&t=obV3DwlWseD9JS7dtVlEPvBvxXG2mNOOIniMgBnOySc",
    location: "Seattle, WA",
    title: "Software Engineer at Google",
    company: null,
    job_title: null,
    linkedin_url: "https://www.linkedin.com/in/matthew-ming-yu",
    experiences: [],
    educations: [],
  },
  {
    name: "Alexandre Debargis",
    picture:
      "https://media.licdn.com/dms/image/v2/D4E03AQFM7pTU69t1Sw/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1699023894873?e=1746662400&v=beta&t=lwCseD7-C9h5fBg0tugIfjWvNUrbRns8tpRi--Rehho",
    location: "Montreal, QC",
    title: "Senior Solutions Architect, Data Analytics at Google | ex-MSFT",
    company: null,
    job_title: null,
    linkedin_url: "https://www.linkedin.com/in/alexandredebargis",
    experiences: [],
    educations: [],
  },
  {
    name: "Hakan K.",
    picture:
      "https://media.licdn.com/dms/image/v2/C4D03AQE_2lh-q5m2iA/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1595034513857?e=1746662400&v=beta&t=uKMpRZeROnHYeouE04aXPCtaLnWwxlMoJBvcZaX_LEc",
    location: "Montreal, QC",
    title: "Product @ Google | All things Chrome Enterprise",
    company: null,
    job_title: null,
    linkedin_url: "https://www.linkedin.com/in/hkilic",
    experiences: [],
    educations: [],
  },
  {
    name: "Mehrnaz Keshmirpour",
    picture:
      "https://media.licdn.com/dms/image/v2/C5603AQGr6_lY2sxkZw/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1587945649009?e=1746662400&v=beta&t=gD0i5IuNHHuuHrGy57Om4sKEia-HSmgO4Iuc4CIH-BI",
    location: "Waterloo, ON",
    title: "Software Engineer at Google",
    company: null,
    job_title: null,
    linkedin_url: "https://www.linkedin.com/in/mehrnaz-keshmirpour",
    experiences: [],
    educations: [],
  },
  {
    name: "Divya Ankam",
    picture:
      "https://media.licdn.com/dms/image/v2/C4E03AQFCxkl36zEvkw/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1651004979128?e=1746662400&v=beta&t=51mpOTMr49cwe4itTHyM-_h7Qr58nGneojVydL0o3c8",
    location: "Greater Montreal Metropolitan Area",
    title: "AI/ML TSE @ Google | Designing AI Solutions",
    company: null,
    job_title: null,
    linkedin_url: "https://www.linkedin.com/in/divya-ankam-b2783956",
    experiences: [],
    educations: [],
  },
  {
    name: "Ross Goroshin",
    picture:
      "https://media.licdn.com/dms/image/v2/D4E03AQGl9IAMaIQFbg/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1732289281297?e=1746662400&v=beta&t=2FuW7KcHlLa6NvUDd4OcN2yFmxRMdfJvAryARqpUJIY",
    location: "Canada",
    title: "Researcher in ML/Computer Vision",
    company: null,
    job_title: null,
    linkedin_url: "https://www.linkedin.com/in/ross-goroshin-43277732",
    experiences: [],
    educations: [],
  },
  {
    name: "Alexandra Zana",
    picture:
      "https://media.licdn.com/dms/image/v2/D4E03AQF_a5eU_kEbpQ/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1712855680270?e=1746662400&v=beta&t=dU-_LJ1Zm9Jf-EZXv6L5OVRE-VHYPWF9AOhO_7i8z04",
    location: "Atlanta, GA",
    title: "Software Engineer | Cloud @ Google",
    company: null,
    job_title: null,
    linkedin_url: "https://www.linkedin.com/in/alexandrazana",
    experiences: [],
    educations: [],
  },
  {
    name: "Nikoo Karahroodi",
    picture:
      "https://media.licdn.com/dms/image/v2/D5603AQHPKIgDpwq0zg/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1669693324233?e=1746662400&v=beta&t=ETJY5FoyVviMs_wYL2bt3c8rSQrmYHFjRXEs_VSESXw",
    location: "Montreal, QC",
    title: "Senior ML Linguist at Google",
    company: null,
    job_title: null,
    linkedin_url: "https://www.linkedin.com/in/nikoo-karahroodi-4ba96758",
    experiences: [],
    educations: [],
  },
  {
    name: "Alexandre Attar",
    picture:
      "https://media.licdn.com/dms/image/v2/C5103AQFtRhy4HaQeUg/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1517234877760?e=1746662400&v=beta&t=teN2NNn58DueAFndossUjOukBahwbGmRfmW4jJWQi1o",
    location: "Montreal, QC",
    title: "Software Developer @ Google",
    company: null,
    job_title: null,
    linkedin_url: "https://www.linkedin.com/in/alexandre-attar",
    experiences: [],
    educations: [],
  },
  {
    name: "Jaymin Suhagiya",
    picture:
      "https://media.licdn.com/dms/image/v2/D4E03AQGYWHK9PDIm5A/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1715715796481?e=1746662400&v=beta&t=Y_55yXhCfviP40ViWfapAJ1wp0ot7vKzufCQ8rOpM44",
    location: "Kitchener, ON",
    title:
      "Software Engineer at Google | Ex Autodesk | CS at Concordia University",
    company: null,
    job_title: null,
    linkedin_url: "https://www.linkedin.com/in/jaymin-suhagiya",
    experiences: [],
    educations: [],
  },
  {
    name: "Akash Patel",
    picture:
      "https://media.licdn.com/dms/image/v2/C5603AQGWmtKjN0ET4Q/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1658934113562?e=1746662400&v=beta&t=psnehyrrVQzXJWtIHZfcYkAWi001wqp_QiJtTjo092A",
    location: "Canada",
    title: "Software Developer at Google",
    company: null,
    job_title: null,
    linkedin_url: "https://www.linkedin.com/in/mtlakashpatel",
    experiences: [],
    educations: [],
  },
  {
    name: "Dakshesh Garambha",
    picture:
      "https://media.licdn.com/dms/image/v2/C4D03AQHvyjA0gvK7bQ/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1635732184015?e=1746662400&v=beta&t=cCQJ4CtYEDmqgDlSMkrOQFL2c-KdO6jtAw7eGSc8Rhk",
    location: "Etobicoke, ON",
    title: "Software Developer at Google",
    company: null,
    job_title: null,
    linkedin_url: "https://www.linkedin.com/in/dakshesh-garambha-4969a6131",
    experiences: [],
    educations: [],
  },
  {
    name: "Kamran Koupayi",
    picture: null,
    location: "Mountain View, CA",
    title: "Software Developer @ Google",
    company: null,
    job_title: null,
    linkedin_url: "https://www.linkedin.com/in/kamran-koupayi-7639139a",
    experiences: [],
    educations: [],
  },
  {
    name: "Elias Homsi",
    picture:
      "https://media.licdn.com/dms/image/v2/C5603AQEl7oQq70T4Gg/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1563219764649?e=1746662400&v=beta&t=U6nkMZF7e6zkR9OpqS8Ngd2pXoOm6MEouhd6OLnyl-E",
    location: "Greater Montreal Metropolitan Area",
    title: "Software Engineer at Google",
    company: null,
    job_title: null,
    linkedin_url: "https://www.linkedin.com/in/ealhomsi",
    experiences: [],
    educations: [],
  },
  {
    name: "Ran Wang",
    picture:
      "https://media.licdn.com/dms/image/v2/C4D03AQF8V7mbjXDxmg/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1610682889696?e=1746662400&v=beta&t=nhAWY3uSpW3LEl3YfJRxElRbf5z-2r8PstCiGeazkT8",
    location: "Montreal, QC",
    title: "Senior Software Engineer at Google",
    company: null,
    job_title: null,
    linkedin_url: "https://www.linkedin.com/in/ran-wang-7660007",
    experiences: [],
    educations: [],
  },
  {
    name: "Abdoulaye Diack",
    picture:
      "https://media.licdn.com/dms/image/v2/D4E03AQF6XWRr2kvFhw/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1732494938227?e=1746662400&v=beta&t=WxijEoZsfQ7vNNk9Ano6DdmVr6typLHeNT3x4MDKc64",
    location: "Ghana",
    title: "Research Program Manager, AI and Machine Learning",
    company: null,
    job_title: null,
    linkedin_url: "https://www.linkedin.com/in/adiack",
    experiences: [],
    educations: [],
  },
  {
    name: "Luiza Staniec, MBA",
    picture:
      "https://media.licdn.com/dms/image/v2/C4D03AQHxpI2-2SiKtA/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1541616582142?e=1746662400&v=beta&t=UW0nDIQusXby-Amny3Z5vMjcnkVN5rU0H-ZuVKksj6A",
    location: "Montreal, QC",
    title: "Technology & Society communications, Google",
    company: null,
    job_title: null,
    linkedin_url: "https://www.linkedin.com/in/lstaniec",
    experiences: [],
    educations: [],
  },
  {
    name: "Jonathan C.",
    picture: null,
    location: "Greater Montreal Metropolitan Area",
    title: "Senior Software Engineer",
    company: null,
    job_title: null,
    linkedin_url: "https://www.linkedin.com/in/jonathanchin",
    experiences: [],
    educations: [],
  },
  {
    name: "Nicolas Feller",
    picture:
      "https://media.licdn.com/dms/image/v2/D5603AQFvRMsJe5KSXw/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1725306019430?e=1746662400&v=beta&t=wUi_tuZfbUYIwLrn0ftmft1Sm8LgRlaz655YnybKz20",
    location: "Austin, TX",
    title: "Solutions Manager AI at Google",
    company: null,
    job_title: null,
    linkedin_url: "https://www.linkedin.com/in/nicolasfeller",
    experiences: [],
    educations: [],
  },
  {
    name: "Parisa Nikzad",
    picture:
      "https://media.licdn.com/dms/image/v2/D5603AQFcK8YB_woVvw/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1701052014373?e=1746662400&v=beta&t=c83Lh-xFV_GQ6GsmduY4jjzR2xEwFkq3SnvCK9VzcuU",
    location: "San Francisco Bay Area",
    title: "Software Engineer at Google",
    company: null,
    job_title: null,
    linkedin_url: "https://www.linkedin.com/in/parisa-nikzad",
    experiences: [],
    educations: [],
  },
  {
    name: "Yashar Dabiran",
    picture:
      "https://media.licdn.com/dms/image/v2/C4E03AQFGa4LWZRjHqg/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1517466794560?e=1746662400&v=beta&t=fGDuDo08ANQM1PSlwCc5NYo5J34E3OqpeoCvJr-cfmI",
    location: "Toronto, ON",
    title: "Software Engineer at Google",
    company: null,
    job_title: null,
    linkedin_url: "https://www.linkedin.com/in/yashardabiran",
    experiences: [],
    educations: [],
  },
  {
    name: "Ghaith Kazma",
    picture:
      "https://media.licdn.com/dms/image/v2/C5603AQEJj9IorjQq5w/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1556693153189?e=1746662400&v=beta&t=k3EkhNa2RDegxcXB4AUpz8sC3bw061LDnDv0RqqDZ0I",
    location: "Greater Montreal Metropolitan Area",
    title: "Machine Learning Engineer at Google",
    company: null,
    job_title: null,
    linkedin_url: "https://www.linkedin.com/in/ghaith-kazma",
    experiences: [],
    educations: [],
  },
  {
    name: "Jerred Costanzo",
    picture:
      "https://media.licdn.com/dms/image/v2/C5603AQESEh6sSzKtJA/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1600879957041?e=1746662400&v=beta&t=BFw9RxK1B3vIZ_6dFX6WgeSB_BVIpbysGCtqbzdHamw",
    location: "Toronto, ON",
    title: "Software Engineer at Google",
    company: null,
    job_title: null,
    linkedin_url: "https://www.linkedin.com/in/jerred-costanzo-4b68504",
    experiences: [],
    educations: [],
  },
];

export async function getProfilesPreview(page: number = 1, limit: number = 10) {
  // some latency
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return SAMPLE_PROFILES.slice((page - 1) * limit, page * limit);
}

export async function searchProfiles(
  query: string,
  page: number = 1,
  limit: number = 10,
) {
  if (!query) return SAMPLE_PROFILES.slice((page - 1) * limit, page * limit);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return SAMPLE_PROFILES.filter(
    (profile) =>
      profile.name.toLowerCase().includes(query.toLowerCase()) ||
      profile.title.toLowerCase().includes(query.toLowerCase()),
  ).slice((page - 1) * limit, page * limit);
}
