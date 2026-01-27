// Types pour les données du CV

export interface PersonalInfo {
  name: string;
  title: string;
  location: string;
  email: string;
  phone: string;
  github: string;
  github_url: string;
}

export interface Education {
  school: string;
  degree: string;
  dates: string;
  subtitle: string;
  description: string;
}

export interface Experience {
  title: string;
  company: string;
  dates: string;
  highlights: string[];
}

export interface Project {
  name: string;
  year: string;
  highlights: string[];
}

export interface Skills {
  languages: string;
  tools: string;
}

export interface Leadership {
  role: string;
  place: string;
  dates: string;
  highlights: string[];
}

export interface SectionFlags {
  show_education: boolean;
  show_experiences: boolean;
  show_projects: boolean;
  show_skills: boolean;
  show_leadership: boolean;
  show_languages: boolean;
}

export interface ResumeData {
  personal: PersonalInfo;
  education: Education[];
  experiences: Experience[];
  projects: Project[];
  skills: Skills;
  leadership: Leadership[];
  languages_spoken: string;
  flags: SectionFlags;
}

// Données par défaut vides
export const emptyResumeData: ResumeData = {
  personal: {
    name: "",
    title: "",
    location: "",
    email: "",
    phone: "",
    github: "",
    github_url: "",
  },
  education: [],
  experiences: [],
  projects: [],
  skills: {
    languages: "",
    tools: "",
  },
  leadership: [],
  languages_spoken: "",
  flags: {
    show_education: true,
    show_experiences: true,
    show_projects: true,
    show_skills: true,
    show_leadership: true,
    show_languages: true,
  },
};
