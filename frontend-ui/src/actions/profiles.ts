import {endpoints} from "@/lib/axios";

export const SAMPLE_PROFILES = [
  {
    name: "Nikita Kozak",
    title:
      "Stanford MechE PhD Candidate | Knight-Hennessey Scholar | DOE Computational Science Graduate Fellow",
    picture:
      "https://media.licdn.com/dms/image/v2/C4E03AQGq-RuxjV691w/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1588362709407?e=1747872000&v=beta&t=JXcDyKuYwXZRYi5nzreiELO6aAqj0NQ6HmS7IR2e9V4",
    about: "",
    linkedinUrl: "https://www.linkedin.com/in/nikita-kozak/",
    linkedin_url: "https://www.linkedin.com/in/nikita-kozak/",
    followers: 100,
    connections: 100,
    location: {
      city: "Stanford",
      state: "California",
      country: "United States",
    },
    skills: [
      "Machine Learning",
      "Computational Fluid Dynamics",
      "Finite Element Analysis",
      "Python",
      "MATLAB",
    ],
    experiences: [
      {
        title: "Graduate Student Researcher",
        companyName:
          "Flow Physics and Computational Engineering Group, Stanford University",
        employmentType: "Full-time",
        location: "Stanford, California, United States",
        workMode: "",
        startDate: "Aug 2020",
        endDate: "Present",
        duration: "4 yrs 8 mos",
        logo: "",
      },
      {
        title: "Undergraduate Researcher",
        companyName:
          "Iowa State University - Computational Fluid–Structure Interaction Laboratory",
        employmentType: "Part-time",
        location: "Ames, IA",
        workMode: "",
        startDate: "Sep 2017",
        endDate: "May 2020",
        duration: "2 yrs 9 mos",
        logo: "https://media.licdn.com/dms/image/v2/C560BAQGaz7lrBl-b6Q/company-logo_100_100/company-logo_100_100/0/1673026883907?e=1750291200&v=beta&t=LRfgcE94VTxveMQ-NV0KCpnJR57ZX19rZUs0WO2cZvk",
      },
      {
        title: "Mechanical Engineering Intern",
        companyName:
          "U.S. Army CCDC Army Research Laboratory: Computational and Information Sciences Directorate",
        employmentType: "Internship",
        location: "Baltimore, Maryland Area",
        workMode: "",
        startDate: "May 2019",
        endDate: "Aug 2019",
        duration: "4 mos",
        logo: "https://media.licdn.com/dms/image/v2/C4E0BAQFOPJaj77KHSA/company-logo_100_100/company-logo_100_100/0/1678970868091/armyresearchlab_logo?e=1750291200&v=beta&t=tB4yWrfz7UCHPAhT8Fnh-zJVqGLk3ik2YcVkSaXeXXE",
      },
      {
        title: "Mechanical Engineering Intern",
        companyName:
          "U.S. Army CCDC Army Research Laboratory - Vehicle Technology Directorate",
        employmentType: "Internship",
        location: "Baltimore, Maryland Area",
        workMode: "",
        startDate: "May 2018",
        endDate: "Aug 2018",
        duration: "4 mos",
        logo: "https://media.licdn.com/dms/image/v2/C4E0BAQFOPJaj77KHSA/company-logo_100_100/company-logo_100_100/0/1678970868091/armyresearchlab_logo?e=1750291200&v=beta&t=tB4yWrfz7UCHPAhT8Fnh-zJVqGLk3ik2YcVkSaXeXXE",
      },
      {
        title: "Research Associate",
        companyName: "KG Marketsense",
        employmentType: "",
        location: "Des Moines, Iowa Area",
        workMode: "",
        startDate: "Jun 2017",
        endDate: "Aug 2017",
        duration: "3 mos",
        logo: "",
      },
      {
        title: "Mechanical Engineering Intern",
        companyName: "CCC (Compressor Controls Corporation)",
        employmentType: "",
        location: "Des Moines, Iowa Area",
        workMode: "",
        startDate: "Dec 2016",
        endDate: "Jan 2017",
        duration: "2 mos",
        logo: "https://media.licdn.com/dms/image/v2/D4D0BAQFhgIvgHjTDBw/company-logo_100_100/company-logo_100_100/0/1728653736155/honeywell_ccc_logo?e=1750291200&v=beta&t=6wnSldkIOjBqCOa73xeAc7r0M6hXUohsxZAGMNNdzS0",
      },
      {
        title: "Engineering and Architecture Intern",
        companyName: "DLR Group",
        employmentType: "",
        location: "Des Moines, Iowa",
        workMode: "",
        startDate: "Oct 2015",
        endDate: "May 2016",
        duration: "8 mos",
        logo: "https://media.licdn.com/dms/image/v2/C4E0BAQGIrSHUPMuAng/company-logo_100_100/company-logo_100_100/0/1634654651159/dlrgroup_logo?e=1750291200&v=beta&t=-gQxR0k41zmWxDFyQTkR0ql6EHHJ115yp7giAO8ev1g",
      },
    ],
    educations: [
      {
        school: "Stanford University",
        degree: "Doctor of Philosophy - PhD, Mechanical Engineering",
        companyLogo:
          "https://media.licdn.com/dms/image/v2/C560BAQHr9suxyJBXMw/company-logo_100_100/company-logo_100_100/0/1635534378870/stanford_university_logo?e=1750291200&v=beta&t=G5ci_qXqyO9GhF_Z9UuhajAye2Qi57g4bOLLwIQslXo",
        startYear: "Aug 2020",
        endYear: "May 2025",
      },
      {
        school: "Stanford University",
        degree: "Master of Science - MS, Mechanical Engineering",
        companyLogo:
          "https://media.licdn.com/dms/image/v2/C560BAQHr9suxyJBXMw/company-logo_100_100/company-logo_100_100/0/1635534378870/stanford_university_logo?e=1750291200&v=beta&t=G5ci_qXqyO9GhF_Z9UuhajAye2Qi57g4bOLLwIQslXo",
        startYear: "Aug 2020",
        endYear: "May 2022",
      },
      {
        school: "Iowa State University",
        degree: "Bachelor of Engineering (BEng), Mechanical Engineering",
        companyLogo:
          "https://media.licdn.com/dms/image/v2/C560BAQFlTCixZ8qIYQ/company-logo_100_100/company-logo_100_100/0/1675978834843/iowastateu_logo?e=1750291200&v=beta&t=8A_4l8-6hm-ToYUegRAKhMnvpOukgWbtCJ-03qaI6l0",
        startYear: "2016",
        endYear: "2020",
      },
      {
        school: "Hochschule Mannheim",
        degree: "Study Aboard: Summer Semester , Mechanical Engineering",
        companyLogo:
          "https://media.licdn.com/dms/image/v2/D4D0BAQFg_4KtQOljLw/company-logo_100_100/B4DZVRsS1BHkAQ-/0/1740832321172/hochschule_mannheim_logo?e=1750291200&v=beta&t=UqR5QPNmlCfXmjCiYC2GoBcWYl_7ymTiyYyrTi_elD4",
        startYear: "2016",
        endYear: "2016",
      },
    ],
    projects: [
      {
        title:
          "Application of Supervised Machine Learning (ML) to a Gas Turbine Stage and Combustor Performance Data and Flow Fields Application of Supervised Machine Learning (ML) to a Gas Turbine Stage and Combustor Performance Data and Flow Fields",
        startDate: "Jun 2019",
        endDate: "Present",
        description:
          "- Developing ML kernel functions to accurately predict the complex flow fields and performance metrics of gas turbine stages and combustors.- Validating predictions with computational fluid dynamics (CFD) simulations.- Comparing my reduced order models with published models for CFD.- Developing ML kernel functions to accurately predict the complex flow fields and performance metrics of gas turbine stages and combustors.\n" +
          "- Validating predictions with computational fluid dynamics (CFD) simulations.\n" +
          "- Comparing my reduced order models with published models for CFD.",
        logo: "",
      },
      {
        title:
          "Implementation of Sand Ingestion Effects on Turbomachinery Blades in Finite Element (FE) Fluid Structure Interaction (FSI) Code",
        startDate: "Jun 2019",
        endDate: "Present",
        description:
          "- Creating a script to build a gas turbine stage geometry and to impose 3D scanned textures on the blade geometries.- Examining the effects of sand attachment and deterioration of blade geometries on flow fields and performance metrics. - Investigating the ability of novel FE numerical methods (weakly-enforced boundary conditions) to accurately capture small-scale surface changes. - Creating a script to build a gas turbine stage geometry and to impose 3D scanned textures on the blade geometries.\n" +
          "- Examining the effects of sand attachment and deterioration of blade geometries on flow fields and performance metrics. \n" +
          "- Investigating the ability of novel FE numerical methods (weakly-enforced boundary conditions) to accurately capture small-scale surface changes.",
        logo: "",
      },
      {
        title:
          "Development and Application of a Surrogate Management Framework (SMF) Optimizer for Army Gas Turbine Engines. Development and Application of a Surrogate Management Framework (SMF) Optimizer for Army Gas Turbine Engines.",
        startDate: "Sep 2018",
        endDate: "May 2020",
        description:
          "- Modifying the computation techniques of an existing SMF optimizer for an Army specific application. - Developing and validating a mathematical model to ensure optimization achieves peak gas turbine engine performance. - Optimizing gas turbine blade position for engines operating at off-design conditions.- Modifying the computation techniques of an existing SMF optimizer for an Army specific application. \n" +
          "- Developing and validating a mathematical model to ensure optimization achieves peak gas turbine engine performance. \n" +
          "- Optimizing gas turbine blade position for engines operating at off-design conditions.",
        logo: "",
      },
      {
        title:
          "Computational Study of Gas Turbine Adaptive Stator/Rotor Interactions Computational Study of Gas Turbine Adaptive Stator/Rotor Interactions",
        startDate: "May 2018",
        endDate: "May 2019",
        description:
          "Associated with U.S. Army CCDC Army Research Laboratory - Vehicle Technology Directorate",
        logo: "https://media.licdn.com/dms/image/v2/C4E0BAQFOPJaj77KHSA/company-logo_100_100/company-logo_100_100/0/1678970868091/armyresearchlab_logo?e=1750291200&v=beta&t=tB4yWrfz7UCHPAhT8Fnh-zJVqGLk3ik2YcVkSaXeXXE",
      },
      {
        title:
          "Implementation of the Actuator Line Method in a Finite Element simulation modeling Wind Turbine Aerodynamics Implementation of the Actuator Line Method in a Finite Element simulation modeling Wind Turbine Aerodynamics",
        startDate: "Sep 2017",
        endDate: "May 2018",
        description: "Associated with Iowa State University",
        logo: "https://media.licdn.com/dms/image/v2/C560BAQFlTCixZ8qIYQ/company-logo_100_100/company-logo_100_100/0/1675978834843/iowastateu_logo?e=1750291200&v=beta&t=8A_4l8-6hm-ToYUegRAKhMnvpOukgWbtCJ-03qaI6l0",
      },
      {
        title: "Independent Study on Electromagnetic Solenoid Engines",
        startDate: "",
        endDate: "",
        description:
          "- Studied the functionality and operation of electromagnetics- Innovated an electromagnetic solenoid engine- 3D Printed a functioning model and presented the new design- Studied the functionality and operation of electromagnetics\n" +
          "- Innovated an electromagnetic solenoid engine\n" +
          "- 3D Printed a functioning model and presented the new design",
        logo: "",
      },
      {
        title:
          "Manufacturing Optimization Study at Hochschule Mannheim Manufacturing Optimization Study at Hochschule Mannheim",
        startDate: "",
        endDate: "",
        description:
          "- Researched, designed and optimized an assembly line with real-life constraints.- Overcame language barriers to collaborate with a multicultural team- Presented design in a project competition (awarded first place)- Researched, designed and optimized an assembly line with real-life constraints.\n" +
          "- Overcame language barriers to collaborate with a multicultural team\n" +
          "- Presented design in a project competition (awarded first place)",
        logo: "",
      },
    ],
    honors: [
      {
        title:
          "2018 US Army Research Laboratory Campus Wide Summer Research Competition - First Place",
        issuer: "Issued by US Army Research Laboratory",
        date: "",
        logo: "",
      },
      {
        title:
          "2018 US Army Research Laboratory Computational and Information Science Directorate Summer Research Competition - First Place",
        issuer:
          "Issued by US Army Research Laboratory -  Computational and Information Science Directorate",
        date: "",
        logo: "",
      },
      {
        title:
          "2018 US Army Research Laboratory Vehicle Technology Directorate Summer Research Competition - First Place",
        issuer:
          "Issued by Vehicle Technology Directorate - US Army Research Laboratory",
        date: "",
        logo: "",
      },
      {
        title:
          "2019 US Army Research Laboratory Campus Wide Summer Research Competition - First Place",
        issuer: "Issued by US Army Research Laboratory",
        date: "",
        logo: "",
      },
      {
        title: "Academic Recognition Scholar",
        issuer: "Issued by ISU",
        date: "",
        logo: "",
      },
      {
        title: "Barry Goldwater Scholar",
        issuer: "Issued by Goldwater Scholarship",
        date: "",
        logo: "",
      },
      {
        title: "Cardinal Leadership Scholar",
        issuer: "Issued by ISU",
        date: "",
        logo: "",
      },
      {
        title:
          "Department of Energy Computational Science Graduate Fellow Department of Energy Computational Science Graduate Fellow",
        issuer:
          "Issued by Krell Institute - Department of Energy Issued by Krell Institute - Department of Energy",
        date: "",
        logo: "",
      },
      {
        title:
          "IINSPIRE LSAMP Research Conference - First Place Oral Presentation",
        issuer: "Issued by IINSPIRE LSAMP",
        date: "",
        logo: "",
      },
      {
        title: "Knight-Hennessy Scholar Knight-Hennessy Scholar",
        issuer:
          "Issued by Knight-Hennessy Scholarship Program Issued by Knight-Hennessy Scholarship Program",
        date: "",
        logo: "",
      },
      {
        title:
          "National Science Foundation Graduate Research Fellowship Recipient National Science Foundation Graduate Research Fellowship Recipient",
        issuer: "",
        date: "",
        logo: "",
      },
      {
        title: "Posters on the Hill Honorable Mention",
        issuer: "Issued by NCUR",
        date: "",
        logo: "",
      },
      {
        title: "Research in the Capital Participant",
        issuer: "Issued by Iowa State University",
        date: "",
        logo: "",
      },
      {
        title:
          "Student Marshall - College of Engineering Student Marshall - College of Engineering",
        issuer:
          "Issued by Iowa State University Issued by Iowa State University",
        date: "",
        logo: "",
      },
      {
        title: "Wallace E. Barron All-University Senior Award",
        issuer:
          "Issued by Iowa State University Issued by Iowa State University",
        date: "",
        logo: "",
      },
    ],
  },
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
  const profiles = SAMPLE_PROFILES.slice((page - 1) * limit, page * limit);
  // Add IDs based on original array index
  return profiles.map((profile, index) => ({
    ...profile,
    id: (page - 1) * limit + index + 1
  }));
}

export async function searchProfiles(
  query: string,
  page: number = 1,
  limit: number = 10,
) {
  if (!query) {
    const profiles = SAMPLE_PROFILES.slice((page - 1) * limit, page * limit);
    return profiles.map((profile, index) => ({
      ...profile,
      id: (page - 1) * limit + index + 1
    }));
  }
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const filteredProfiles = SAMPLE_PROFILES.filter(
    (profile) =>
      profile.name.toLowerCase().includes(query.toLowerCase()) ||
      profile.title.toLowerCase().includes(query.toLowerCase()),
  ).slice((page - 1) * limit, page * limit);
  // Add IDs based on original array index
  return filteredProfiles.map((profile, index) => ({
    ...profile,
    id: (page - 1) * limit + index + 1
  }));
}

export async function getProfile(
  url: string,
  acceptedSchools?: string[],
  onMessage?: (msg: string) => void,
): Promise<any> {
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
  let profileData: any = null;
  let done = false;

  while (!done) {
    const { value, done: doneReading } = await reader.read();
    done = doneReading;
    const chunk = decoder.decode(value, { stream: !done });

    // Try to parse final JSON data (if present)
    try {
      const parsed = JSON.parse(chunk);
      if (parsed.success && parsed.profile) {
        profileData = parsed.profile;
        break;
      }
    } catch (e) {
      // If parsing fails, treat the chunk as a status message.
      if (onMessage && chunk.trim().length > 0) {
        onMessage(chunk.trim());
      }
    }
  }
  return profileData;
}
