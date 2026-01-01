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
        id: "alfredml",
        title: "AlfredML — Local RAG Assistant",
        description:
            "A privacy-first, local AI assistant that answers questions from your own documents using retrieval-augmented generation. Built to be fast, modular, and easy to extend with new data sources.",
        tags: ["Python", "RAG", "FastAPI", "Vector DB"],
        github: "https://github.com/sanjayBahadur/<REPO_NAME>",
        featured: true,
    },
    {
        id: "pq-crypto",
        title: "Post-Quantum Crypto Implementations",
        description:
            "Implemented lattice-based cryptography prototypes (Ring/Module-LWE) to explore practical post-quantum security tradeoffs, focusing on correctness, efficiency, and failure modes.",
        tags: ["Python", "Cryptography", "Lattices", "Research"],
        github: "https://github.com/sanjayBahadur/pqpake-artifact.git",
        featured: true,
    },
    {
        id: "wifi-csi-sensing",
        title: "WiFi CSI Sensing Experiments",
        description:
            "A WiFi CSI sensing pipeline exploring gesture/activity signals using commodity hardware. Includes preprocessing, clutter removal, feature extraction, and early classifier experiments.",
        tags: ["Python", "Signal Processing", "ML", "CSI"],
        link: "https://drive.google.com/drive/folders/130I1bUWCDOGgsvJGBkN-g8391mHReyyh?usp=drive_link",
        featured: true,
    },
    {
        id: "eeg-prosthetic-hackathon",
        title: "EEG Prosthetic Prototype (Hackathon Winner)",
        description:
            "Hackathon project: a 3D-printed prosthetic concept controlled via EEG input, using Arduino Uno + WebSockets for real-time control loops and a fast demo-ready prototype.",
        tags: ["Arduino", "WebSockets", "EMOTIV", "3D Printing"],
        github: "https://github.com/joshtrinh1102/MindGrip.git",
        featured: true,
    },
    {
        id: "algorithm-simulator",
        title: "Algorithm Simulator (Visual Learning Tool)",
        description:
            "An interactive algorithm visualizer that simulates core data structures and algorithms step-by-step, designed to make complex ideas feel intuitive and testable.",
        tags: ["TypeScript", "Next.js", "Visualization", "DSA"],
        github: "https://github.com/sanjayBahadur/<REPO_NAME>",
    },
    {
        id: "plmultimedia-client",
        title: "PL Multimedia — Client Website",
        description:
            "A production website built for a startup client. Focused on clear messaging, responsive UI, and a clean deployment workflow.",
        tags: ["Client Work", "React", "UI", "Deployment"],
        link: "https://www.plmultimediaservice.com",
    },
];

export function getFeaturedProjects(): Project[] {
    return projects.filter((p) => p.featured);
}
