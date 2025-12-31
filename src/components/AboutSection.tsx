"use client";

export default function AboutSection() {
    const skills = [
        { category: "Languages", items: ["TypeScript", "Python", "Rust", "Go"] },
        { category: "Frontend", items: ["React", "Next.js", "Three.js", "Tailwind"] },
        { category: "Backend", items: ["Node.js", "FastAPI", "PostgreSQL", "Redis"] },
        { category: "Tools", items: ["Docker", "AWS", "Cloudflare", "Git"] },
    ];

    return (
        <section id="about" className="py-12 md:py-20 px-6">
            <div className="max-w-5xl mx-auto">
                {/* Section header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold gradient-text inline-block mb-4">
                        About Me
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-transparent via-matrix-green-400 to-transparent mx-auto" />
                </div>

                <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                    {/* Bio */}
                    <div className="terminal-panel p-6">
                        <h3 className="text-lg font-mono text-matrix-green-400 mb-4 flex items-center">
                            <span className="w-2 h-2 bg-matrix-green-400 rounded-full mr-2 animate-pulse" />
                            who_am_i.sh
                        </h3>
                        <div className="space-y-4 text-matrix-green-100/80">
                            <p>
                                I am a software engineer passionate about building beautiful,
                                performant applications that make a difference. With expertise
                                spanning full-stack development, cloud infrastructure, and 3D
                                graphics, I love tackling complex problems and turning ideas
                                into reality.
                            </p>
                            <p>
                                When I am not coding, you will find me exploring new countries,
                                contributing to open source, or experimenting with the latest
                                tech. I believe in continuous learning and sharing knowledge
                                with the community.
                            </p>
                            <p>
                                Currently focused on AI-powered developer tools and immersive
                                web experiences. Always open to interesting collaborations and
                                new adventures.
                            </p>
                        </div>
                    </div>

                    {/* Skills */}
                    <div className="terminal-panel p-6">
                        <h3 className="text-lg font-mono text-matrix-green-400 mb-4 flex items-center">
                            <span className="w-2 h-2 bg-matrix-green-400 rounded-full mr-2 animate-pulse" />
                            skills.json
                        </h3>
                        <div className="space-y-4">
                            {skills.map((skill) => (
                                <div key={skill.category}>
                                    <h4 className="text-sm font-mono text-matrix-green-400/60 uppercase tracking-wider mb-2">
                                        {skill.category}
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {skill.items.map((item) => (
                                            <span key={item} className="tag">
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                    {[
                        { label: "Years Experience", value: "5+" },
                        { label: "Projects Completed", value: "50+" },
                        { label: "Countries Visited", value: "12" },
                        { label: "Open Source Contributions", value: "200+" },
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            className="terminal-panel p-4 text-center glass-card-hover"
                        >
                            <div className="text-2xl md:text-3xl font-bold gradient-text mb-1">
                                {stat.value}
                            </div>
                            <div className="text-xs font-mono text-matrix-green-400/60 uppercase tracking-wider">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
