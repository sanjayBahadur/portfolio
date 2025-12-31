"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import type { GlobeMethods } from "react-globe.gl";
import {
    getAllPolygons,
    generateParticlePoints,
    generateRingForPlace,
    type GlobePolygon,
    type ParticlePoint,
    type RingData,
} from "@/lib/geo";
import { getGlowColorWithAlpha } from "@/lib/colors";
import FallbackTimeline from "./FallbackTimeline";

// Dynamic import with SSR disabled to prevent WebGL issues
const Globe = dynamic(() => import("react-globe.gl"), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center h-full">
            <div className="text-matrix-green-400 font-mono animate-pulse">
                Loading globe...
            </div>
        </div>
    ),
});

interface JourneyGlobeProps {
    onHover: (key: string | null) => void;
    onSelect: (key: string) => void;
    selectedKey: string | null;
    hoveredKey: string | null;
}

export default function JourneyGlobe({
    onHover,
    onSelect,
    selectedKey,
    hoveredKey,
}: JourneyGlobeProps) {
    const globeRef = useRef<GlobeMethods | undefined>(undefined);
    const [isWebGLSupported, setIsWebGLSupported] = useState(true);
    const [polygons, setPolygons] = useState<GlobePolygon[]>([]);
    const [particles, setParticles] = useState<ParticlePoint[]>([]);
    const [rings, setRings] = useState<RingData[]>([]);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    // Check WebGL support on mount
    useEffect(() => {
        try {
            const canvas = document.createElement("canvas");
            const gl =
                canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
            if (!gl) {
                setIsWebGLSupported(false);
            }
        } catch {
            setIsWebGLSupported(false);
        }
    }, []);

    // Load geo data
    useEffect(() => {
        if (!isWebGLSupported) return;

        const loadedPolygons = getAllPolygons();
        setPolygons(loadedPolygons);

        const loadedParticles = generateParticlePoints();
        setParticles(loadedParticles);
    }, [isWebGLSupported]);

    // Update rings based on hover/selection
    useEffect(() => {
        const activeKey = selectedKey || hoveredKey;
        if (activeKey) {
            const ring = generateRingForPlace(activeKey);
            if (ring) {
                setRings([ring]);
            } else {
                setRings([]);
            }
        } else {
            setRings([]);
        }
    }, [selectedKey, hoveredKey]);

    // Handle resize
    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.offsetWidth,
                    height: containerRef.current.offsetHeight,
                });
            }
        };

        updateDimensions();
        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize", updateDimensions);
    }, []);

    // Configure globe on mount
    useEffect(() => {
        if (globeRef.current) {
            // Set initial view
            globeRef.current.pointOfView({ lat: 30, lng: -40, altitude: 2.2 }, 0);

            // Auto-rotate slowly
            const controls = globeRef.current.controls();
            if (controls) {
                controls.autoRotate = true;
                controls.autoRotateSpeed = 0.3;
                controls.enableZoom = true;
                controls.minDistance = 150;
                controls.maxDistance = 500;
            }
        }
    }, [dimensions]);

    // Polygon hover handler
    const handlePolygonHover = useCallback(
        (obj: object | null) => {
            const polygon = obj as GlobePolygon | null;
            if (polygon && polygon.properties.__visited) {
                onHover(polygon.properties.__key);
            } else {
                onHover(null);
            }
        },
        [onHover]
    );

    // Polygon click handler
    const handlePolygonClick = useCallback(
        (obj: object | null) => {
            const polygon = obj as GlobePolygon | null;
            if (polygon && polygon.properties.__visited) {
                onSelect(polygon.properties.__key);

                // Fly to the selected region
                if (globeRef.current) {
                    const place = polygon.properties;
                    // Find the place from journey data to get coordinates
                    import("@/data/journey").then(({ places }) => {
                        const p = places.find((pl) => pl.key === place.__key);
                        if (p) {
                            globeRef.current?.pointOfView(
                                { lat: p.lat, lng: p.lng, altitude: 1.8 },
                                1000
                            );
                        }
                    });
                }
            }
        },
        [onSelect]
    );

    // Memoized polygon styling functions
    const polygonCapColor = useCallback(
        (d: object) => {
            const polygon = d as GlobePolygon;
            const key = polygon.properties.__key;
            const isActive = key === selectedKey || key === hoveredKey;

            if (polygon.properties.__visited) {
                return isActive
                    ? getGlowColorWithAlpha(key, 0.8)
                    : getGlowColorWithAlpha(key, 0.5);
            }
            return "rgba(15, 25, 15, 0.3)";
        },
        [selectedKey, hoveredKey]
    );

    const polygonSideColor = useCallback(() => {
        return "rgba(0, 255, 65, 0.1)";
    }, []);

    const polygonStrokeColor = useCallback(
        (d: object) => {
            const polygon = d as GlobePolygon;
            const key = polygon.properties.__key;
            const isActive = key === selectedKey || key === hoveredKey;

            if (polygon.properties.__visited) {
                return isActive
                    ? "rgba(0, 255, 65, 0.8)"
                    : "rgba(0, 255, 65, 0.4)";
            }
            return "rgba(0, 255, 65, 0.1)";
        },
        [selectedKey, hoveredKey]
    );

    const polygonAltitude = useCallback(
        (d: object) => {
            const polygon = d as GlobePolygon;
            const key = polygon.properties.__key;
            const isActive = key === selectedKey || key === hoveredKey;

            if (polygon.properties.__visited) {
                return isActive ? 0.03 : 0.015;
            }
            return 0.002;
        },
        [selectedKey, hoveredKey]
    );

    // Filter particles based on hover/selection
    const visibleParticles = useMemo(() => {
        const activeKey = selectedKey || hoveredKey;
        if (activeKey) {
            // Show more particles for active region
            return particles.filter((p) => p.key === activeKey);
        }
        // Show all particles but fewer when nothing selected
        return particles.slice(0, Math.floor(particles.length / 2));
    }, [particles, selectedKey, hoveredKey]);

    // Fallback for WebGL not supported
    if (!isWebGLSupported) {
        return <FallbackTimeline />;
    }

    return (
        <div ref={containerRef} className="globe-container w-full h-full">
            {dimensions.width > 0 && dimensions.height > 0 && (
                <Globe
                    ref={globeRef}
                    width={dimensions.width}
                    height={dimensions.height}
                    backgroundColor="rgba(0,0,0,0)"
                    globeImageUrl=""
                    showAtmosphere={true}
                    atmosphereColor="rgba(0, 255, 65, 0.3)"
                    atmosphereAltitude={0.15}
                    // Polygons (countries and states)
                    polygonsData={polygons}
                    polygonCapColor={polygonCapColor}
                    polygonSideColor={polygonSideColor}
                    polygonStrokeColor={polygonStrokeColor}
                    polygonAltitude={polygonAltitude}
                    polygonLabel={(d: object) => {
                        const polygon = d as GlobePolygon;
                        if (polygon.properties.__visited) {
                            return `<div class="bg-matrix-darker px-2 py-1 rounded border border-matrix-green-400/30 font-mono text-sm text-matrix-green-400">${polygon.properties.__name}</div>`;
                        }
                        return "";
                    }}
                    onPolygonHover={handlePolygonHover}
                    onPolygonClick={handlePolygonClick}
                    // Particle points
                    pointsData={visibleParticles}
                    pointLat={(d: object) => (d as ParticlePoint).lat}
                    pointLng={(d: object) => (d as ParticlePoint).lng}
                    pointRadius={(d: object) => (d as ParticlePoint).size}
                    pointColor={(d: object) => (d as ParticlePoint).color}
                    pointAltitude={0.01}
                    // Ring effects
                    ringsData={rings}
                    ringLat={(d: object) => (d as RingData).lat}
                    ringLng={(d: object) => (d as RingData).lng}
                    ringMaxRadius={(d: object) => (d as RingData).maxR}
                    ringPropagationSpeed={(d: object) => (d as RingData).propagationSpeed}
                    ringRepeatPeriod={(d: object) => (d as RingData).repeatPeriod}
                    ringColor={(d: object) => () => (d as RingData).color}
                />
            )}

            {/* Gradient overlay for atmosphere effect */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-matrix-black/50" />
            </div>
        </div>
    );
}
