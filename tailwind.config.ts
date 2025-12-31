import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                matrix: {
                    black: "#050505",
                    darker: "#0a0a0a",
                    dark: "#0f0f0f",
                    green: {
                        50: "#e8fff0",
                        100: "#c5ffd9",
                        200: "#8affb3",
                        300: "#4aff87",
                        400: "#00ff41",
                        500: "#00cc33",
                        600: "#00a328",
                        700: "#007a1e",
                        800: "#005214",
                        900: "#00290a",
                    },
                    glow: "rgba(0, 255, 65, 0.4)",
                },
            },
            fontFamily: {
                mono: ["'Fira Code'", "'JetBrains Mono'", "Consolas", "monospace"],
                sans: ["Inter", "system-ui", "sans-serif"],
            },
            animation: {
                "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                "glow-pulse": "glow-pulse 2s ease-in-out infinite alternate",
                scanline: "scanline 8s linear infinite",
            },
            keyframes: {
                "glow-pulse": {
                    "0%": { boxShadow: "0 0 20px rgba(0, 255, 65, 0.3)" },
                    "100%": { boxShadow: "0 0 40px rgba(0, 255, 65, 0.6)" },
                },
                scanline: {
                    "0%": { transform: "translateY(-100%)" },
                    "100%": { transform: "translateY(100%)" },
                },
            },
            backdropBlur: {
                xs: "2px",
            },
            boxShadow: {
                glow: "0 0 20px rgba(0, 255, 65, 0.3)",
                "glow-lg": "0 0 40px rgba(0, 255, 65, 0.4)",
                "glow-xl": "0 0 60px rgba(0, 255, 65, 0.5)",
            },
        },
    },
    plugins: [],
};

export default config;
