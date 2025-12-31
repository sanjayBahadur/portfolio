import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Portfolio | Journey Globe",
    description:
        "A personal portfolio showcasing my journey around the world with an interactive 3D globe experience.",
    keywords: [
        "portfolio",
        "developer",
        "software engineer",
        "3D globe",
        "travel",
        "projects",
    ],
    authors: [{ name: "Developer" }],
    openGraph: {
        title: "Portfolio | Journey Globe",
        description:
            "Explore my journey around the world through an interactive 3D globe experience.",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="scroll-smooth">
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="theme-color" content="#050505" />
            </head>
            <body className="bg-matrix-black min-h-screen antialiased">
                {/* Scanline effect overlay */}
                <div className="scanline-overlay" aria-hidden="true" />

                {/* Noise texture overlay */}
                <div className="noise-overlay" aria-hidden="true" />

                {/* Main content */}
                <main className="relative z-10">{children}</main>
            </body>
        </html>
    );
}
