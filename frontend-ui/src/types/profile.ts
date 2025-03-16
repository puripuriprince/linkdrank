export type Experience = {
  title: string;
  companyName: string;
  employmentType?: string;
  location: string;
  workMode?: string;
  startDate: string;
  endDate: string;
  duration: string;
  logo?: string;
};

export type Education = {
  school: string;
  degree: string;
  companyLogo?: string;
  startYear: string;
  endYear: string;
};

export type Project = {
  title: string;
  startDate: string;
  endDate: string;
  description: string;
  logo?: string;
};

export type Honor = {
  title: string;
  issuer: string;
  date?: string;
  logo?: string;
};

export type Profile = {
  id: number;
  title: string;
  picture: string;
  name: string;
  linkedinUrl?: string;
  location?: string;
  about?: string;
  experiences?: Experience[];
  educations?: Education[];
  projects?: Project[];
  honors?: Honor[];
};
