"use client";

import { places, Place } from "@/data/journey";
import { getGlowColor } from "@/lib/colors";

export default function FallbackTimeline() {
    // Sort places by year (most recent first)
    const sortedPlaces = [...places].sort((a, b) => {
        const yearA = a.year || 0;
        const yearB = b.year || 0;
        return yearB - yearA;
    });

    return (
        <div className="webgl-fallback min-h-[500px] p-6">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-matrix-green-400/10 border border-matrix-green-400/30 mb-4">
                    <svg
                        className="w-6 h-6 text-matrix-green-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                </div>
                <h3 className="text-lg font-mono text-matrix-green-400 mb-2">
                    3D Globe Not Available
                </h3>
                <p className="text-sm text-matrix-green-400/60 max-w-md mx-auto">
                    WebGL is not supported in your browser. Here is my journey in timeline
                    format instead.
                </p>
            </div>

            <div className="max-w-2xl mx-auto">
                <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-matrix-green-400/50 via-matrix-green-400/30 to-transparent" />

                    {/* Timeline items */}
                    <div className="space-y-8">
                        {sortedPlaces.map((place, index) => (
                            <TimelineItem key={place.key} place={place} index={index} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

interface TimelineItemProps {
    place: Place;
    index: number;
}

function TimelineItem({ place, index }: TimelineItemProps) {
    const glowColor = getGlowColor(place.key);

    return (
        <div
            className="relative pl-12 animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
        >
            {/* Timeline dot */}
            <div
                className="absolute left-2 top-2 w-4 h-4 rounded-full border-2"
                style={{
                    borderColor: glowColor,
                    backgroundColor: `${glowColor}33`,
                    boxShadow: `0 0 10px ${glowColor}66`,
                }}
            />

            {/* Content card */}
            <div className="terminal-panel p-4 transition-all hover:border-matrix-green-400/40">
                <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-lg" style={{ color: glowColor }}>
                        {place.displayName}
                    </h4>
                    {place.year && (
                        <span className="text-sm font-mono text-matrix-green-400/60">
                            {place.year}
                        </span>
                    )}
                </div>

                {place.tags && place.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                        {place.tags.map((tag) => (
                            <span key={tag} className="tag text-xs">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                <p className="text-sm text-matrix-green-100/80 mb-2">
                    {place.whatIDid}
                </p>

                <div className="flex items-center text-xs font-mono text-matrix-green-400/40">
                    <svg
                        className="w-3.5 h-3.5 mr-1"
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
                    </svg>
                    {place.kind === "us_state" ? "US State" : "Country"}
                </div>
            </div>
        </div>
    );
}
