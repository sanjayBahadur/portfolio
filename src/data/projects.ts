export interface Project {
    id: string;
    title: string;
    description: string;
    tags: string[];
    link?: string;
    github?: string;
    featured?: boolean;
}

export const projects: Project[] = [
    {
        id: "globe-portfolio",
        title: "Interactive Globe Portfolio",
        description:
            "A stunning 3D globe visualization showcasing my journey around the world. Built with Three.js and React, featuring WebGL rendering, particle effects, and smooth interactions.",
        tags: ["React", "Three.js", "TypeScript", "WebGL"],
        github: "https://github.com/username/portfolio",
        featured: true,
    },
    {
        id: "ai-assistant",
        title: "AI Code Assistant",
        description:
            "An intelligent coding assistant powered by large language models. Features context-aware completions, code explanations, and automated refactoring suggestions.",
        tags: ["Python", "LLM", "FastAPI", "React"],
        link: "https://example.com/ai-assistant",
        github: "https://github.com/username/ai-assistant",
        featured: true,
    },
    {
        id: "realtime-collab",
        title: "Real-time Collaboration Platform",
        description:
            "A multiplayer document editing platform with real-time sync, presence indicators, and conflict resolution. Supporting markdown, code, and rich text.",
        tags: ["Next.js", "WebSocket", "CRDT", "PostgreSQL"],
        link: "https://example.com/collab",
        featured: true,
    },
    {
        id: "design-system",
        title: "Matrix Design System",
        description:
            "A comprehensive design system inspired by cyberpunk aesthetics. Includes 50+ components, dark mode support, and accessibility features.",
        tags: ["React", "Storybook", "CSS", "Figma"],
        github: "https://github.com/username/matrix-ds",
    },
    {
        id: "cli-toolkit",
        title: "Developer CLI Toolkit",
        description:
            "A collection of command-line tools to supercharge developer productivity. Includes project scaffolding, git utilities, and deployment automation.",
        tags: ["Rust", "CLI", "DevOps"],
        github: "https://github.com/username/cli-toolkit",
    },
];

export function getFeaturedProjects(): Project[] {
    return projects.filter((p) => p.featured);
}
