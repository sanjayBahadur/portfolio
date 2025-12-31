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
    __hashParity: boolean; // For alternating styles on adjacent regions
}

export type GlobePolygon = Feature<Geometry, PolygonProperties>;

// Import TopoJSON data from atlas packages
import countriesData from "world-atlas/countries-110m.json";
import statesData from "us-atlas/states-10m.json";

import { places, type Place } from "@/data/journey";
import { getGlowColorWithAlpha } from "./colors";

// Get visited keys from journey data
function getVisitedKeys(): Set<string> {
    return new Set(places.map((p) => p.key));
}

/**
 * Simple hash function for parity calculation
 */
function hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
    }
    return Math.abs(hash);
}

/**
 * Get hash parity for alternating styles
 */
export function getHashParity(key: string): boolean {
    return hashString(key) % 2 === 0;
}

/**
 * Extract ISO3 code from a country feature robustly
 * Handles various TopoJSON property formats
 */
export function extractCountryIso3(f: Feature<Geometry, Record<string, unknown>>): string {
    const props = f.properties || {};

    // Try various property names for ISO3
    const iso3Candidates = [
        props.ISO_A3,
        props.iso_a3,
        props.ADM0_A3,
        props.adm0_a3,
        props.ISO3,
        props.iso3,
    ];

    for (const candidate of iso3Candidates) {
        if (typeof candidate === "string" && candidate.length === 3 && candidate !== "-99") {
            return candidate.toUpperCase();
        }
    }

    // Try feature id if it looks like an ALPHA-3 code (not numeric)
    if (typeof f.id === "string" && f.id.length === 3 && isNaN(Number(f.id))) {
        return f.id.toUpperCase();
    }

    // Fall back to name-based mapping
    const name = (props.name as string) || "";
    return nameToIso3Map[name] || name.substring(0, 3).toUpperCase();
}

// Comprehensive name to ISO3 mapping
const nameToIso3Map: Record<string, string> = {
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
    // Add Nepal explicitly
    Nepal: "NPL",
    // Add more common ones
    Bangladesh: "BGD",
    Pakistan: "PAK",
    "Sri Lanka": "LKA",
    Myanmar: "MMR",
    Cambodia: "KHM",
    Laos: "LAO",
    Mongolia: "MNG",
    "North Korea": "PRK",
    Afghanistan: "AFG",
    Iran: "IRN",
    Iraq: "IRQ",
    Syria: "SYR",
    Jordan: "JOR",
    Lebanon: "LBN",
    Kuwait: "KWT",
    Qatar: "QAT",
    Bahrain: "BHR",
    Oman: "OMN",
    Yemen: "YEM",
    "Saudi Arabia": "SAU",
};


let cachedCountryFeatures: GlobePolygon[] | null = null;
let cachedStateFeatures: GlobePolygon[] | null = null;

/**
 * Load and convert countries TopoJSON to GeoJSON features
 */
export function getCountryFeatures(): GlobePolygon[] {
    if (cachedCountryFeatures) return cachedCountryFeatures;

    const visitedKeys = getVisitedKeys();
    const topology = countriesData as unknown as Topology<{
        countries: GeometryCollection<{ name: string }>;
    }>;

    const countriesGeoJson = feature(
        topology,
        topology.objects.countries
    ) as FeatureCollection<Geometry, { name: string }>;

    // Debug: track which visited keys were found (dev only)
    const foundVisitedKeys = new Set<string>();

    const features = countriesGeoJson.features.map((f) => {
        const name = f.properties?.name || "";
        const iso3 = extractCountryIso3(f as Feature<Geometry, Record<string, unknown>>);
        const visited = visitedKeys.has(iso3);

        if (visited) {
            foundVisitedKeys.add(iso3);
        }

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
                __hashParity: getHashParity(iso3),
            },
        };
    });

    // Dev-only debug logging for missing visited keys
    if (process.env.NODE_ENV !== "production") {
        const visitedCountryKeys = Array.from(visitedKeys).filter(key => {
            const place = places.find(p => p.key === key);
            return place?.kind === "country";
        });

        const missingKeys = visitedCountryKeys.filter(key => !foundVisitedKeys.has(key));
        if (missingKeys.length > 0) {
            console.warn("[geo.ts] Visited country keys NOT found in TopoJSON:", missingKeys);
        }
    }

    cachedCountryFeatures = features;
    return features;
}

/**
 * Load and convert US states TopoJSON to GeoJSON features
 */
export function getStateFeatures(): GlobePolygon[] {
    if (cachedStateFeatures) return cachedStateFeatures;

    const visitedKeys = getVisitedKeys();
    const topology = statesData as unknown as Topology<{
        states: GeometryCollection<{ name: string }>;
    }>;

    const statesGeoJson = feature(
        topology,
        topology.objects.states
    ) as FeatureCollection<Geometry, { name: string }>;

    const features = statesGeoJson.features.map((f) => {
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
                __hashParity: getHashParity(name),
            },
        };
    });

    cachedStateFeatures = features;
    return features;
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

/**
 * Calculate great-circle distance between two lat/lng points (in km)
 * Uses Haversine formula
 */
export function greatCircleDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
): number {
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

/**
 * Find the nearest place to a given lat/lng coordinate
 */
export function findNearestPlace(lat: number, lng: number): Place | null {
    if (places.length === 0) return null;

    let nearestPlace: Place = places[0];
    let minDistance = greatCircleDistance(lat, lng, nearestPlace.lat, nearestPlace.lng);

    for (let i = 1; i < places.length; i++) {
        const place = places[i];
        const distance = greatCircleDistance(lat, lng, place.lat, place.lng);
        if (distance < minDistance) {
            minDistance = distance;
            nearestPlace = place;
        }
    }

    return nearestPlace;
}

/**
 * Get the ordered list of visited places for carousel navigation
 * Countries first, then states, in array order
 */
export function getOrderedPlaces(): Place[] {
    return [...places];
}
