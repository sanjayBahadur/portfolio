"use client";

import { projects, Project } from "@/data/projects";

export default function ProjectsSection() {
    return (
        <section id="projects" className="py-20 px-6 bg-matrix-darker/30">
            <div className="max-w-6xl mx-auto">
                {/* Section header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold gradient-text inline-block mb-4">
                        Featured Projects
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-transparent via-matrix-green-400 to-transparent mx-auto" />
                    <p className="text-matrix-green-100/60 mt-4 max-w-xl mx-auto">
                        A selection of projects I have built, from developer tools to
                        immersive web experiences.
                    </p>
                </div>

                {/* Projects grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project, index) => (
                        <ProjectCard key={project.id} project={project} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}

interface ProjectCardProps {
    project: Project;
    index: number;
}

function ProjectCard({ project, index }: ProjectCardProps) {
    return (
        <div
            className="terminal-panel p-6 flex flex-col glass-card-hover animate-fade-in-up group"
            style={{ animationDelay: `${index * 100}ms` }}
        >
            {/* Featured badge */}
            {project.featured && (
                <div className="mb-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono bg-matrix-green-400/20 text-matrix-green-400 border border-matrix-green-400/30">
                        <svg
                            className="w-3 h-3 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        Featured
                    </span>
                </div>
            )}

            {/* Title */}
            <h3 className="text-xl font-semibold text-matrix-green-100 mb-3 group-hover:text-matrix-green-400 transition-colors">
                {project.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-matrix-green-100/70 flex-1 mb-4">
                {project.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag) => (
                    <span key={tag} className="tag text-xs">
                        {tag}
                    </span>
                ))}
            </div>

            {/* Links */}
            <div className="flex gap-3 pt-4 border-t border-matrix-green-400/10">
                {project.link && (
                    <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-sm font-mono text-matrix-green-400 hover:text-matrix-green-300 transition-colors"
                    >
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
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                        </svg>
                        Live Demo
                    </a>
                )}
                {project.github && (
                    <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-sm font-mono text-matrix-green-400 hover:text-matrix-green-300 transition-colors"
                    >
                        <svg
                            className="w-4 h-4 mr-1.5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                            />
                        </svg>
                        Source
                    </a>
                )}
            </div>
        </div>
    );
}
