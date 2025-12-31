import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { Feature, FeatureCollection, Geometry } from "geojson";

// Types for our polygon metadata
export interface PolygonProperties {
    __kind: "country" | "us_state";
    __key: string;
    __name: string;
    __visited: boolean;
    __color: string;
}

export type GlobePolygon = Feature<Geometry, PolygonProperties>;

// Import TopoJSON data from atlas packages
import countriesData from "world-atlas/countries-110m.json";
import statesData from "us-atlas/states-10m.json";

import { places } from "@/data/journey";
import { getGlowColorWithAlpha, getDimGlowColor } from "./colors";

// Get visited keys from journey data
function getVisitedKeys(): Set<string> {
    return new Set(places.map((p) => p.key));
}

/**
 * Load and convert countries TopoJSON to GeoJSON features
 */
export function getCountryFeatures(): GlobePolygon[] {
    const visitedKeys = getVisitedKeys();
    const topology = countriesData as unknown as Topology<{
        countries: GeometryCollection<{ name: string }>;
    }>;

    const countriesGeoJson = feature(
        topology,
        topology.objects.countries
    ) as FeatureCollection<Geometry, { name: string }>;

    // Map of country names to ISO3 codes (common ones)
    const nameToIso3: Record<string, string> = {
        "United States of America": "USA",
        "United States": "USA",
        Canada: "CAN",
        Japan: "JPN",
        Germany: "DEU",
        "United Kingdom": "GBR",
        France: "FRA",
        Italy: "ITA",
        Spain: "ESP",
        Australia: "AUS",
        Brazil: "BRA",
        Mexico: "MEX",
        China: "CHN",
        India: "IND",
        "South Korea": "KOR",
        Netherlands: "NLD",
        Sweden: "SWE",
        Norway: "NOR",
        Denmark: "DNK",
        Finland: "FIN",
        Switzerland: "CHE",
        Austria: "AUT",
        Belgium: "BEL",
        Ireland: "IRL",
        Portugal: "PRT",
        Poland: "POL",
        "Czech Republic": "CZE",
        Czechia: "CZE",
        Greece: "GRC",
        Turkey: "TUR",
        "New Zealand": "NZL",
        Singapore: "SGP",
        Thailand: "THA",
        Vietnam: "VNM",
        Indonesia: "IDN",
        Malaysia: "MYS",
        Philippines: "PHL",
        Argentina: "ARG",
        Chile: "CHL",
        Colombia: "COL",
        Peru: "PER",
        "South Africa": "ZAF",
        Egypt: "EGY",
        Morocco: "MAR",
        Israel: "ISR",
        "United Arab Emirates": "ARE",
        Russia: "RUS",
        Ukraine: "UKR",
        Iceland: "ISL",
        Taiwan: "TWN",
        "Hong Kong": "HKG",
    };

    return countriesGeoJson.features.map((f) => {
        const name = f.properties?.name || "";
        const iso3 = nameToIso3[name] || name.substring(0, 3).toUpperCase();
        const visited = visitedKeys.has(iso3);

        const color = visited
            ? getGlowColorWithAlpha(iso3, 0.6)
            : "rgba(20, 40, 20, 0.3)";

        return {
            ...f,
            properties: {
                __kind: "country" as const,
                __key: iso3,
                __name: name,
                __visited: visited,
                __color: color,
            },
        };
    });
}

/**
 * Load and convert US states TopoJSON to GeoJSON features
 */
export function getStateFeatures(): GlobePolygon[] {
    const visitedKeys = getVisitedKeys();
    const topology = statesData as unknown as Topology<{
        states: GeometryCollection<{ name: string }>;
    }>;

    const statesGeoJson = feature(
        topology,
        topology.objects.states
    ) as FeatureCollection<Geometry, { name: string }>;

    return statesGeoJson.features.map((f) => {
        const name = f.properties?.name || "";
        const visited = visitedKeys.has(name);

        const color = visited
            ? getGlowColorWithAlpha(name, 0.7)
            : "rgba(20, 40, 20, 0.2)";

        return {
            ...f,
            properties: {
                __kind: "us_state" as const,
                __key: name,
                __name: name,
                __visited: visited,
                __color: color,
            },
        };
    });
}

/**
 * Get all polygon features for the globe
 * States are rendered on top of USA
 */
export function getAllPolygons(): GlobePolygon[] {
    const countries = getCountryFeatures();
    const states = getStateFeatures();

    // Filter out USA from countries since we're showing states
    const filteredCountries = countries.filter(
        (c) => c.properties.__key !== "USA"
    );

    return [...filteredCountries, ...states];
}

/**
 * Generate particle points around visited regions
 */
export interface ParticlePoint {
    lat: number;
    lng: number;
    size: number;
    color: string;
    key: string;
}

export function generateParticlePoints(): ParticlePoint[] {
    const particles: ParticlePoint[] = [];

    places.forEach((place) => {
        // Generate 3-5 particles per place
        const numParticles = 3 + Math.floor(Math.random() * 3);

        for (let i = 0; i < numParticles; i++) {
            // Add jitter to position (within ~2 degrees)
            const jitterLat = (Math.random() - 0.5) * 4;
            const jitterLng = (Math.random() - 0.5) * 4;

            particles.push({
                lat: place.lat + jitterLat,
                lng: place.lng + jitterLng,
                size: 0.3 + Math.random() * 0.4,
                color: getGlowColorWithAlpha(place.key, 0.8),
                key: place.key,
            });
        }
    });

    return particles;
}

/**
 * Generate ring data for hover/selection effects
 */
export interface RingData {
    lat: number;
    lng: number;
    maxR: number;
    propagationSpeed: number;
    repeatPeriod: number;
    color: string;
}

export function generateRingForPlace(key: string): RingData | null {
    const place = places.find((p) => p.key === key);
    if (!place) return null;

    return {
        lat: place.lat,
        lng: place.lng,
        maxR: 3,
        propagationSpeed: 2,
        repeatPeriod: 1500,
        color: getGlowColorWithAlpha(place.key, 0.6),
    };
}
