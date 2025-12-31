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
        lng: 84.1240,
        tags: ["birthplace", "home", "roots", "family"],
        whatIDid:
            "Born and raised here. This is where my story started—family, school, curiosity, and the early grind that shaped how I think and work.",
        experience:
            "Nepal is the origin point of everything I am: resilience, ambition, and a deep appreciation for community. It taught me to stay grounded while aiming high.",
    },
    {
        kind: "country",
        key: "IND",
        displayName: "India",
        lat: 20.5937,
        lng: 78.9629,
        tags: ["school trips", "pilgrimage", "culture", "family"],
        whatIDid:
            "Visited numerous times for school trips and family events—everything from spiritual journeys to city exploration.",
        experience:
            "India felt like multiple worlds stitched together: sacred rivers, crowded streets, and endless energy. From rituals with my parents to the cityscapes of New Delhi, every trip left a different imprint.",
    },
    {
        kind: "country",
        key: "THA",
        displayName: "Thailand",
        lat: 15.8700,
        lng: 100.9925,
        year: 2024,
        tags: ["milestone", "solo travel", "independence", "embassy"],
        whatIDid:
            "Traveled for my U.S. embassy interview and explored as a solo traveler—my first real independent trip into the world.",
        experience:
            "This was a turning point. I learned how to navigate uncertainty alone, plan on the fly, and trust my decisions. It felt like adulthood clicked into place.",
    },
    {
        kind: "country",
        key: "DEU",
        displayName: "Germany",
        lat: 51.1657,
        lng: 10.4515,
        year: 2024,
        tags: ["transit", "connection", "serendipity"],
        whatIDid:
            "Brief airport transit—ended up making a friend. We grabbed coffee: two strangers, a language barrier, and English as the bridge.",
        experience:
            "A small moment that stuck with me. It reminded me the world is surprisingly warm when you show up with curiosity and zero ego.",
    },
    {
        kind: "us_state",
        key: "Florida",
        displayName: "Florida",
        lat: 27.6648,
        lng: -81.5158,
        year: 2024,
        tags: ["USF", "hackathons", "builders", "momentum"],
        whatIDid:
            "Currently attending the University of South Florida as a CS grad student—building projects, meeting builders, and chasing hackathon wins.",
        experience:
            "Florida is my current arena. Fast growth, constant iteration, and a community that rewards shipping. The hunger is real, and I’m here for it.",
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
