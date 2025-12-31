"use client";

import { useState, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { findPlaceByKey, places } from "@/data/journey";
import PlaceCard from "@/components/PlaceCard";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import Footer from "@/components/Footer";

// Dynamic import for the globe component to prevent SSR issues
const JourneyGlobe = dynamic(() => import("@/components/JourneyGlobe"), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center h-full bg-matrix-black">
            <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 border-2 border-matrix-green-400/30 border-t-matrix-green-400 rounded-full animate-spin" />
                <p className="text-matrix-green-400 font-mono animate-pulse">
                    Initializing globe...
                </p>
            </div>
        </div>
    ),
});

export default function Home() {
    const [hoveredKey, setHoveredKey] = useState<string | null>(null);
    const [selectedKey, setSelectedKey] = useState<string | null>(null);

    // Handle hover on globe regions
    const handleHover = useCallback((key: string | null) => {
        setHoveredKey(key);
    }, []);

    // Handle click/selection on globe regions
    const handleSelect = useCallback((key: string) => {
        setSelectedKey(key);
    }, []);

    // Clear selection
    const handleClear = useCallback(() => {
        setSelectedKey(null);
    }, []);

    // Determine which place to display (selected takes priority)
    const displayedKey = selectedKey || hoveredKey;
    const displayedPlace = useMemo(
        () => (displayedKey ? findPlaceByKey(displayedKey) : null),
        [displayedKey]
    );

    return (
        <>
            {/* Hero Section with Globe */}
            <section className="relative min-h-screen">
                {/* Background gradient */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    aria-hidden="true"
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-matrix-black/50 to-matrix-black" />
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-matrix-green-400/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-matrix-green-400/3 rounded-full blur-3xl" />
                </div>

                {/* Header */}
                <header className="relative z-20 px-6 py-6">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-matrix-green-400 rounded-full animate-pulse shadow-glow" />
                            <span className="font-mono text-matrix-green-400 text-sm tracking-wider">
                                PORTFOLIO
                            </span>
                        </div>
                        <nav className="hidden md:flex items-center gap-6">
                            <a
                                href="#about"
                                className="text-sm font-mono text-matrix-green-100/60 hover:text-matrix-green-400 transition-colors"
                            >
                                About
                            </a>
                            <a
                                href="#projects"
                                className="text-sm font-mono text-matrix-green-100/60 hover:text-matrix-green-400 transition-colors"
                            >
                                Projects
                            </a>
                            <a
                                href="/resume.pdf"
                                className="btn-matrix text-sm py-2 px-4"
                                download
                            >
                                Resume
                            </a>
                        </nav>
                    </div>
                </header>

                {/* Globe + Card Layout */}
                <div className="relative z-10 flex-1 px-6 pb-12">
                    <div className="max-w-7xl mx-auto">
                        {/* Title */}
                        <div className="text-center mb-8 pt-4">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 gradient-text glow-text">
                                My Journey
                            </h1>
                            <p className="text-matrix-green-100/60 text-lg max-w-xl mx-auto">
                                Explore the places I have visited and the experiences that have
                                shaped my perspective.
                            </p>
                        </div>

                        {/* Globe and Card Grid */}
                        <div className="grid lg:grid-cols-5 gap-6 h-[calc(100vh-280px)] min-h-[500px]">
                            {/* Globe - takes up more space on larger screens */}
                            <div className="lg:col-span-3 relative rounded-2xl overflow-hidden border border-matrix-green-400/20 bg-matrix-black">
                                <JourneyGlobe
                                    onHover={handleHover}
                                    onSelect={handleSelect}
                                    selectedKey={selectedKey}
                                    hoveredKey={hoveredKey}
                                />
                            </div>

                            {/* Card - sidebar on desktop, below on mobile */}
                            <div className="lg:col-span-2 min-h-[300px] lg:min-h-0">
                                <PlaceCard
                                    place={displayedPlace || null}
                                    isLocked={!!selectedKey}
                                    onClear={handleClear}
                                    onNext={() => {
                                        const currentIndex = places.findIndex(p => p.key === (selectedKey || places[0].key));
                                        const nextIndex = (currentIndex + 1) % places.length;
                                        handleSelect(places[nextIndex].key);
                                    }}
                                    onPrev={() => {
                                        const currentIndex = places.findIndex(p => p.key === (selectedKey || places[0].key));
                                        const prevIndex = (currentIndex - 1 + places.length) % places.length;
                                        handleSelect(places[prevIndex].key);
                                    }}
                                />
                            </div>
                        </div>

                        {/* Mobile sticky header when place is selected */}
                        {selectedKey && displayedPlace && (
                            <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-matrix-black/95 backdrop-blur-lg border-b border-matrix-green-400/20 px-4 py-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-matrix-green-400 rounded-full animate-pulse" />
                                        <span className="font-semibold text-matrix-green-400">
                                            {displayedPlace.displayName}
                                        </span>
                                    </div>
                                    <button
                                        onClick={handleClear}
                                        className="text-xs font-mono text-matrix-green-400/60 hover:text-matrix-green-400 transition-colors flex items-center gap-1"
                                    >
                                        <svg
                                            className="w-3.5 h-3.5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                        Clear
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Scroll indicator */}
                        <div className="flex justify-center mt-8">
                            <a
                                href="#about"
                                className="flex flex-col items-center text-matrix-green-400/40 hover:text-matrix-green-400 transition-colors group"
                            >
                                <span className="text-xs font-mono mb-2">Scroll to explore</span>
                                <svg
                                    className="w-5 h-5 animate-bounce"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                                    />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section divider */}
            <div className="section-divider" />

            {/* About Section */}
            <AboutSection />

            {/* Section divider */}
            <div className="section-divider" />

            {/* Projects Section */}
            <ProjectsSection />

            {/* Footer */}
            <Footer />
        </>
    );
}
