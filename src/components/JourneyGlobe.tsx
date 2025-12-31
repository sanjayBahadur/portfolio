"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import type { GlobeMethods } from "react-globe.gl";
import {
    getAllPolygons,
    generateParticlePoints,
    generateRingForPlace,
    getOrderedPlaces,
    findNearestPlace,
    type GlobePolygon,
    type ParticlePoint,
    type RingData,
} from "@/lib/geo";
import { places, type Place } from "@/data/journey";
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
    const [isGlobeReady, setIsGlobeReady] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const autoFocusTriggered = useRef(false);
    const [hasInitialSelected, setHasInitialSelected] = useState(false);

    // Polling refs
    const pendingMoveRef = useRef<{ lat: number; lng: number; altitude: number } | null>(null);

    // Carousel state
    const orderedPlaces = useMemo(() => getOrderedPlaces(), []);
    const currentIndex = useMemo(() => {
        if (!selectedKey) return -1;
        return orderedPlaces.findIndex((p) => p.key === selectedKey);
    }, [selectedKey, orderedPlaces]);

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
                const { offsetWidth, offsetHeight } = containerRef.current;
                console.log(`[JourneyGlobe] Resize: ${offsetWidth}x${offsetHeight}`);
                setDimensions({
                    width: offsetWidth,
                    height: offsetHeight,
                });
            } else {
                console.warn("[JourneyGlobe] Container ref is null during resize");
            }
        };

        updateDimensions();
        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize", updateDimensions);
    }, []);

    // --- CAMERA CONTROL ---
    // Move globe camera to selected place
    const moveToPlace = useCallback((place: Place) => {
        const targetAlt = place.kind === "us_state" ? 0.7 : 1.5;
        const target = { lat: place.lat, lng: place.lng, altitude: targetAlt };

        if (globeRef.current && isGlobeReady) {
            console.log(`[JourneyGlobe] Moving to ${place.displayName}`);
            try {
                // Disable auto-rotate during move
                const controls = globeRef.current.controls();
                if (controls) {
                    controls.autoRotate = false;
                }

                // Move camera
                globeRef.current.pointOfView(target, 1500);

                // Re-enable auto-rotate after move
                setTimeout(() => {
                    if (globeRef.current) {
                        const c = globeRef.current.controls();
                        if (c) c.autoRotate = true;
                    }
                }, 1600);
            } catch (e) {
                console.error("[JourneyGlobe] Move error:", e);
            }
        } else {
            // Store for later when globe is ready
            console.log(`[JourneyGlobe] Globe not ready, queuing move to ${place.displayName}`);
            pendingMoveRef.current = target;
        }
    }, [isGlobeReady]);

    // Handle selectedKey changes
    useEffect(() => {
        if (!selectedKey) return;
        const place = places.find(p => p.key === selectedKey);
        if (place) {
            moveToPlace(place);
        }
    }, [selectedKey, moveToPlace]);

    // Execute pending move when globe becomes ready
    useEffect(() => {
        if (isGlobeReady && globeRef.current && pendingMoveRef.current) {
            console.log("[JourneyGlobe] Globe now ready, executing pending move");
            try {
                // Pending move execution
                if (globeRef.current) {
                    const controls = globeRef.current.controls();
                    if (controls) controls.autoRotate = false;

                    globeRef.current.pointOfView(pendingMoveRef.current, 1500);

                    setTimeout(() => {
                        if (globeRef.current) {
                            const c = globeRef.current.controls();
                            if (c) c.autoRotate = true;
                        }
                    }, 1600);
                }
                pendingMoveRef.current = null;
            } catch (e) {
                console.error("[JourneyGlobe] Pending move error:", e);
            }
        }
    }, [isGlobeReady]);

    // Animation loop to ensure controls are updated (required for damping and autoRotate)
    useEffect(() => {
        let frameId: number;
        const animate = () => {
            if (globeRef.current) {
                const controls = globeRef.current.controls();
                if (controls) {
                    controls.update();
                }
            }
            frameId = requestAnimationFrame(animate);
        };
        animate();
        return () => cancelAnimationFrame(frameId);
    }, []);

    // Handler for when globe is ready
    // Handler for when globe is ready
    const handleGlobeReady = useCallback(() => {
        console.log("[JourneyGlobe] Globe is ready! Initializing view...");
        if (globeRef.current) {
            // Setup controls
            const controls = globeRef.current.controls();
            if (controls) {
                controls.enableDamping = true;
                controls.dampingFactor = 0.1;
                controls.rotateSpeed = 0.5;
                // Start with auto-rotate disabled to ensure position lock
                controls.autoRotate = false;
                controls.autoRotateSpeed = 0.5;
            }

            // Immediately set view to first place (Nepal)
            // We use setTimeout 0 to ensure this runs after any internal initialization
            setTimeout(() => {
                if (!globeRef.current) return;

                if (places.length > 0) {
                    const firstPlace = places[0];
                    console.log(`[JourneyGlobe] Forcing initial view to ${firstPlace.displayName} (${firstPlace.lat}, ${firstPlace.lng})`);

                    const targetAlt = firstPlace.kind === "us_state" ? 0.7 : 1.5;

                    // Force the point of view immediately
                    globeRef.current.pointOfView({
                        lat: firstPlace.lat,
                        lng: firstPlace.lng,
                        altitude: targetAlt
                    }, 0);

                    // Clear any pending move that matches this initial state
                    // This prevents the useEffect from animating "from" Africa "to" Nepal
                    if (pendingMoveRef.current) {
                        const p = pendingMoveRef.current;
                        // Loose equality check for lat/lng to see if it's the same target
                        if (Math.abs(p.lat - firstPlace.lat) < 0.1 && Math.abs(p.lng - firstPlace.lng) < 0.1) {
                            console.log("[JourneyGlobe] Clearing redundant pending move for initial place");
                            pendingMoveRef.current = null;
                        }
                    }

                    // Enable auto-rotate after a delay
                    if (controls) {
                        setTimeout(() => {
                            controls.autoRotate = true;
                        }, 500);
                    }
                }
            }, 10);
        }
        setIsGlobeReady(true);
    }, []);

    // Initial Selection logic moved to parent (app/page.tsx) to prevent delay
    // useEffect(() => {
    //     if (!hasInitialSelected && places.length > 0) {
    //         const firstPlace = places[0];
    //         onSelect(firstPlace.key);
    //         setHasInitialSelected(true);
    //     }
    // }, [hasInitialSelected, onSelect]);

    // Handle GPS locate
    const handleLocateMe = useCallback(() => {
        const performLocate = () => {
            // Optimization: Skip browser geolocation and default to Florida
            const fallbackPlace = places.find(p => p.key === "Florida") || places[0];
            if (fallbackPlace) {
                onSelect(fallbackPlace.key);
                setToastMessage(`Current Location - ${fallbackPlace.displayName}`);
            }
        };

        performLocate();
    }, [onSelect]);

    // Auto-focus logic removed to prefer initial view of Nepal

    // Toast auto-hide
    useEffect(() => {
        if (toastMessage) {
            const timer = setTimeout(() => setToastMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toastMessage]);

    // Carousel navigation
    const handlePrevious = useCallback(() => {
        if (orderedPlaces.length === 0) return;

        let newIndex: number;
        if (currentIndex <= 0) {
            newIndex = orderedPlaces.length - 1;
        } else {
            newIndex = currentIndex - 1;
        }

        const place = orderedPlaces[newIndex];
        onSelect(place.key);
    }, [currentIndex, orderedPlaces, onSelect]);

    const handleNext = useCallback(() => {
        if (orderedPlaces.length === 0) return;

        let newIndex: number;
        if (currentIndex < 0 || currentIndex >= orderedPlaces.length - 1) {
            newIndex = 0;
        } else {
            newIndex = currentIndex + 1;
        }

        const place = orderedPlaces[newIndex];
        onSelect(place.key);
    }, [currentIndex, orderedPlaces, onSelect]);

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
            }
        },
        [onSelect]
    );

    // Memoized polygon styling functions with alternating patterns for adjacent regions
    const polygonCapColor = useCallback(
        (d: object) => {
            const polygon = d as GlobePolygon;
            const key = polygon.properties.__key;
            const isActive = key === selectedKey || key === hoveredKey;
            const parity = polygon.properties.__hashParity;

            if (polygon.properties.__visited) {
                // Use different alpha based on parity for adjacent region differentiation
                const baseAlpha = parity ? 0.55 : 0.45;
                const activeAlpha = parity ? 0.85 : 0.75;

                return isActive
                    ? getGlowColorWithAlpha(key, activeAlpha)
                    : getGlowColorWithAlpha(key, baseAlpha);
            }
            return "rgba(15, 25, 15, 0.3)";
        },
        [selectedKey, hoveredKey]
    );

    const polygonSideColor = useCallback((d: object) => {
        const polygon = d as GlobePolygon;
        if (polygon.properties.__visited) {
            return "rgba(0, 255, 65, 0.2)";
        }
        return "rgba(0, 255, 65, 0.05)";
    }, []);

    const polygonStrokeColor = useCallback(
        (d: object) => {
            const polygon = d as GlobePolygon;
            const key = polygon.properties.__key;
            const isActive = key === selectedKey || key === hoveredKey;
            const parity = polygon.properties.__hashParity;

            if (polygon.properties.__visited) {
                // Brighter strokes for visited regions, even brighter for active
                if (isActive) {
                    return "rgba(0, 255, 65, 1)";
                }
                // Alternate stroke brightness based on parity
                return parity
                    ? "rgba(0, 255, 65, 0.7)"
                    : "rgba(100, 255, 150, 0.6)";
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
            const parity = polygon.properties.__hashParity;

            if (polygon.properties.__visited) {
                if (isActive) {
                    return 0.04;
                }
                // Slight altitude variation based on parity
                return parity ? 0.018 : 0.012;
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
        <div ref={containerRef} className="globe-container w-full h-full relative">
            {dimensions.width > 0 && dimensions.height > 0 ? (
                <Globe
                    ref={globeRef}
                    width={dimensions.width}
                    height={dimensions.height}
                    backgroundColor="rgba(0,0,0,0)"
                    globeImageUrl=""
                    showAtmosphere={true}
                    atmosphereColor="rgba(0, 255, 65, 0.3)"
                    atmosphereAltitude={0.15}
                    onGlobeReady={handleGlobeReady}
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
            ) : (
                <div className="flex items-center justify-center h-full text-matrix-green-400">
                    Waiting for dimensions... ({dimensions.width}x{dimensions.height})
                </div>
            )}

            {/* GPS Locate Button - Top Right */}
            <button
                onClick={handleLocateMe}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-matrix-darker/80 backdrop-blur-sm border border-matrix-green-400/40 flex items-center justify-center text-matrix-green-400 hover:bg-matrix-green-400/20 hover:border-matrix-green-400/60 transition-all shadow-glow z-20"
                title="Find nearest location"
                aria-label="Find nearest location"
            >
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <circle cx="12" cy="12" r="3" strokeWidth={2} />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 2v4m0 12v4m10-10h-4M6 12H2"
                    />
                </svg>
            </button>

            {/* Carousel Navigation */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
                {/* Previous Button */}
                <button
                    onClick={handlePrevious}
                    className="w-10 h-10 rounded-full bg-matrix-darker/80 backdrop-blur-sm border border-matrix-green-400/40 flex items-center justify-center text-matrix-green-400 hover:bg-matrix-green-400/20 hover:border-matrix-green-400/60 transition-all"
                    title="Previous place"
                    aria-label="Previous place"
                >
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                </button>

                {/* Place indicator */}
                <div className="px-3 py-1.5 rounded-full bg-matrix-darker/80 backdrop-blur-sm border border-matrix-green-400/30 text-matrix-green-400 font-mono text-xs">
                    {currentIndex >= 0 ? (
                        <span>{currentIndex + 1} / {orderedPlaces.length}</span>
                    ) : (
                        <span>- / {orderedPlaces.length}</span>
                    )}
                </div>

                {/* Next Button */}
                <button
                    onClick={handleNext}
                    className="w-10 h-10 rounded-full bg-matrix-darker/80 backdrop-blur-sm border border-matrix-green-400/40 flex items-center justify-center text-matrix-green-400 hover:bg-matrix-green-400/20 hover:border-matrix-green-400/60 transition-all"
                    title="Next place"
                    aria-label="Next place"
                >
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </button>
            </div>

            {/* Toast notification */}
            {toastMessage && (
                <div className="absolute top-16 right-4 px-4 py-2 rounded-lg bg-matrix-darker/90 backdrop-blur-sm border border-matrix-green-400/30 text-matrix-green-400 font-mono text-xs animate-fade-in-up z-30">
                    {toastMessage}
                </div>
            )}

            {/* Gradient overlay for atmosphere effect */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-matrix-black/50" />
            </div>
        </div>
    );
}
