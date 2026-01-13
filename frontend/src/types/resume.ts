export interface Location {
    address?: string;
    postalCode?: string;
    city?: string;
    countryCode?: string;
    region?: string;
}

export interface Profile {
    network?: string;
    username?: string;
    url?: string;
}

export interface Basics {
    name: string;
    label?: string;
    email: string;
    phone?: string;
    url?: string;
    summary?: string;
    location?: Location;
    profiles?: Profile[];
}

export interface Work {
    company?: string;
    position?: string;
    website?: string;
    startDate?: string;
    endDate?: string;
    summary?: string;
    highlights?: string[];
}

export interface Education {
    institution?: string;
    area?: string;
    studyType?: string;
    startDate?: string;
    endDate?: string;
    score?: string;
    courses?: string[];
}

export interface Skill {
    name?: string;
    level?: string;
    keywords?: string[];
}

export interface Project {
    name?: string;
    description?: string;
    highlights?: string[];
    keywords?: string[];
    startDate?: string;
    endDate?: string;
    url?: string;
    roles?: string[];
}

export interface Metadata {
    template?: string;
    layout?: string[][];
    css?: { value: string; visible: boolean };
    theme?: { text: string; background: string; primary: string };
}

export interface Resume {
    id?: string;
    title: string;
    slug?: string;
    basics: Basics;
    work?: Work[];
    education?: Education[];
    skills?: Skill[];
    projects?: Project[];
    resume_metadata?: Metadata;
    created_at?: string;
    updated_at?: string;
}
