"use client";

import { Place } from "@/data/journey";
import { getGlowColor } from "@/lib/colors";

interface PlaceCardProps {
    place: Place | null;
    isLocked: boolean;
    onClear: () => void;
    onNext?: () => void;
    onPrev?: () => void;
}

export default function PlaceCard({ place, isLocked, onClear, onNext, onPrev }: PlaceCardProps) {
    if (!place) {
        return (
            <div className="terminal-panel p-6 h-full flex flex-col justify-center items-center text-center">
                <div className="w-16 h-16 mb-4 rounded-full border-2 border-dashed border-matrix-green-400/30 flex items-center justify-center">
                    <svg
                        className="w-8 h-8 text-matrix-green-400/50"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                </div>
                <h3 className="text-lg font-mono text-matrix-green-400/70 mb-2">
                    Explore My Journey
                </h3>
                <p className="text-sm text-matrix-green-400/50 max-w-xs">
                    Hover over a highlighted region on the globe to see where I have been
                    and what I experienced there.
                </p>
            </div>
        );
    }

    const glowColor = getGlowColor(place.key);

    return (
        <div className="terminal-panel p-6 h-full flex flex-col animate-fade-in-up">
            {/* Header with lock indicator */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        {/* Navigation Arrows */}
                        <div className="flex items-center gap-1 mr-2">
                            <button
                                onClick={(e) => { e.stopPropagation(); onPrev?.(); }}
                                className="p-1 hover:bg-matrix-green-400/20 rounded-full transition-colors text-matrix-green-400/60 hover:text-matrix-green-400"
                                aria-label="Previous place"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); onNext?.(); }}
                                className="p-1 hover:bg-matrix-green-400/20 rounded-full transition-colors text-matrix-green-400/60 hover:text-matrix-green-400"
                                aria-label="Next place"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>

                        {isLocked && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono bg-matrix-green-400/20 text-matrix-green-400 border border-matrix-green-400/30">
                                <svg
                                    className="w-3 h-3 mr-1"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />
                                </svg>
                                Unlocked
                            </span>
                        )}
                        {place.year && (
                            <span className="text-xs font-mono text-matrix-green-400/60">
                                {place.year}
                            </span>
                        )}
                    </div>
                    <h2
                        className="text-2xl font-bold glow-text"
                        style={{ color: glowColor }}
                    >
                        {place.displayName}
                    </h2>
                </div>

                {isLocked && (
                    <button
                        onClick={onClear}
                        className="btn-matrix text-xs px-3 py-1.5 flex items-center gap-1"
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
                )}
            </div>

            {/* Tags */}
            {place.tags && place.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {place.tags.map((tag) => (
                        <span key={tag} className="tag">
                            {tag}
                        </span>
                    ))}
                </div>
            )}

            {/* What I did */}
            <div className="mb-4">
                <h3 className="text-sm font-mono text-matrix-green-400/60 uppercase tracking-wider mb-2">
                    What I Did
                </h3>
                <p className="text-matrix-green-100/90 leading-relaxed">
                    {place.whatIDid}
                </p>
            </div>

            {/* Experience */}
            <div className="flex-1">
                <h3 className="text-sm font-mono text-matrix-green-400/60 uppercase tracking-wider mb-2">
                    My Experience
                </h3>
                <p className="text-matrix-green-100/80 leading-relaxed text-sm">
                    {place.experience}
                </p>
            </div>

            {/* Kind indicator */}
            <div className="mt-4 pt-4 border-t border-matrix-green-400/10">
                <div className="flex items-center text-xs font-mono text-matrix-green-400/40">
                    <svg
                        className="w-4 h-4 mr-1.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                    </svg>
                    {place.kind === "us_state" ? "US State" : "Country"}
                </div>
            </div>
        </div>
    );
}
