export interface Place {
    kind: "country" | "us_state";
    key: string; // ISO3 for country, state name for us_state
    displayName: string;
    lat: number;
    lng: number;
    year?: number;
    tags?: string[];
    whatIDid: string;
    experience: string;
}

export const places: Place[] = [
    {
        kind: "country",
        key: "NPL",
        displayName: "Nepal",
        lat: 28.3949,
        lng: 84.124,
        year: 2002,
        tags: [".NET", "full-stack", "early builder"],
        whatIDid:
            "I started coding at 14 and built my first website for a local startup (PL Multimedia). Later, I worked as a .NET developer at CrossOver Nepal for a year.",
        experience:
            "This is where I learned consistency and ownership—building things people actually use, and improving them over time.",
    },
    {
        kind: "country",
        key: "IND",
        displayName: "India",
        lat: 20.5937,
        lng: 78.9629,
        year: 2014,
        tags: ["adaptability", "communication", "perspective"],
        whatIDid:
            "I visited multiple times through school trips and exchange-style programs, experiencing different regions, traditions, and daily life.",
        experience:
            "It taught me how to stay respectful and flexible in unfamiliar environments—skills that translate directly to teamwork and collaboration.",
    },
    {
        kind: "country",
        key: "THA",
        displayName: "Thailand",
        lat: 15.87,
        lng: 100.9925,
        year: 2024,
        tags: ["independence", "planning", "resilience"],
        whatIDid:
            "I traveled for my U.S. embassy interview and took my first solo trip, handling planning and logistics end-to-end.",
        experience:
            "That trip built confidence in calm execution—making good decisions when the situation is new and time matters.",
    },
    {
        kind: "country",
        key: "DEU",
        displayName: "Germany",
        lat: 51.1657,
        lng: 10.4515,
        year: 2024,
        tags: ["initiative", "communication", "networking"],
        whatIDid:
            "During an airport transit, I met someone new and we shared coffee—an unexpected conversation across cultures.",
        experience:
            "It’s a small reminder I value in engineering too: strong work happens faster when you can connect with people and communicate clearly.",
    },
    {
        kind: "us_state",
        key: "Florida",
        displayName: "Florida",
        lat: 27.6648,
        lng: -81.5158,
        year: 2025,
        tags: ["USF", "full-stack", "hackathons"],
        whatIDid:
            "I’m a CS grad student at USF. I build projects like AlfredML (local RAG assistant) and an algorithm visualizer. I also won a neurotech hackathon where our team prototyped an EEG-controlled prosthetic (Arduino + WebSockets + 3D print).",
        experience:
            "This is my current base—where I’m learning fast, shipping consistently, and getting comfortable building under real deadlines with a team.",
    },
];

// Helper to find a place by key
export function findPlaceByKey(key: string): Place | undefined {
    return places.find((p) => p.key === key);
}

// Get all place keys
export function getAllPlaceKeys(): string[] {
    return places.map((p) => p.key);
}
