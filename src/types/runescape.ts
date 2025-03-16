export interface GroupIronmanHiscores {
    totalElements: number;
    totalPages: number;
    size: number;
    content: GroupIronmanEntry[];
    first: boolean;
    last: boolean;
    numberOfElements: number;
    pageNumber: number;
    empty: boolean;
}

export interface GroupIronmanEntry {
    id: number;
    name: string;
    groupTotalXp: number;
    groupTotalLevel: number;
    size: number;
    toHighlight: boolean;
    isCompetitive: boolean;
    isCustom: boolean;
    founder: boolean;
}

export interface Skill {
    id: number;
    name: string;
    rank: number;
    level: number;
    xp: number;
}

export interface Activity {
    id: number;
    name: string;
    rank: number;
    score: number;
}

export interface PlayerHiscores {
    skills: Skill[];
    activities: Activity[];
}

export interface RuneMetricsActivity {
    date: string;
    details: string;
    text: string;
}

export interface RuneMetricsProfile {
    name: string;
    combatlevel: number;
    totalskill: number;
    totalxp: number;
    loggedIn: string;
    questscomplete: number;
    questsnotstarted:number;
    questsstarted: number;
    activities: RuneMetricsActivity[];
    error?: string; // If there's an error response
}