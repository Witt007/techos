'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    ArrowLeft, ExternalLink, Github, Calendar, User,
    ChevronRight, Check, Layers, Code2
} from 'lucide-react';
import HoloCard from '@/components/ui/HoloCard';
import CyberButton from '@/components/ui/CyberButton';
import GlitchText from '@/components/ui/GlitchText';
import { projects, projectCategories } from '@/data/projects';

export default function ProjectDetailPage() {
    const params = useParams();
    const id = params.id as string;

    const project = projects.find(p => p.id === id);
    const relatedProjects = projects
        .filter(p => p.id !== id && p.category === project?.category)
        .slice(0, 2);

    if (!project) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <HoloCard className="p-8 text-center">
                    <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
                    <p className="text-[var(--text-muted)] mb-6">
                        The project you're looking for doesn't exist.
                    </p>
                    <Link href="/portfolio">
                        <CyberButton icon={<ArrowLeft size={18} />}>
                            Back to Portfolio
                        </CyberButton>
                    </Link>
                </HoloCard>
            </div>
        );
    }

    const category = projectCategories.find(c => c.id === project.category);

    return (
        <div className="min-h-screen pt-24 pb-20 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Breadcrumb */}
                <motion.div
                    className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-6"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Link href="/" className="hover:text-[var(--neon-cyan)]">Home</Link>
                    <ChevronRight size={14} />
                    <Link href="/portfolio" className="hover:text-[var(--neon-cyan)]">Portfolio</Link>
                    <ChevronRight size={14} />
                    <span className="text-[var(--text-secondary)]">{project.title.en}</span>
                </motion.div>

                {/* Hero */}
                <motion.header
                    className="mb-12"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="grid lg:grid-cols-2 gap-8 items-center">
                        {/* Project Visual */}
                        <div
                            className="aspect-video rounded-2xl overflow-hidden relative"
                            style={{
                                background: `linear-gradient(135deg, ${project.color}30 0%, var(--void-deep) 100%)`
                            }}
                        >
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div
                                    className="text-9xl font-bold font-[family-name:var(--font-display)] opacity-10"
                                    style={{ color: project.color }}
                                >
                                    {project.title.en.charAt(0)}
                                </div>
                            </div>

                            {/* Decorative elements */}
                            <div className="absolute top-4 left-4 flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            </div>

                            {/* Category badge */}
                            <div
                                className="absolute top-4 right-4 px-4 py-2 rounded-lg text-sm font-mono flex items-center gap-2"
                                style={{
                                    background: `${project.color}20`,
                                    color: project.color,
                                    border: `1px solid ${project.color}50`
                                }}
                            >
                                <span>{category?.icon}</span>
                                <span>{category?.label.en}</span>
                            </div>

                            {/* Year */}
                            <div className="absolute bottom-4 right-4 text-6xl font-bold font-[family-name:var(--font-display)] opacity-20" style={{ color: project.color }}>
                                {project.year}
                            </div>
                        </div>

                        {/* Project Info */}
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                {project.featured && (
                                    <span className="px-3 py-1 rounded-full text-xs font-mono bg-[var(--neon-amber)]/20 text-[var(--neon-amber)] border border-[var(--neon-amber)]/50">
                                        ★ Featured Project
                                    </span>
                                )}
                            </div>

                            <h1 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-display)] mb-2" style={{ color: project.color }}>
                                <GlitchText text={project.title.en} glitchOnHover />
                            </h1>
                            <p className="text-lg text-[var(--text-muted)] mb-6">
                                {project.subtitle.en}
                            </p>

                            <p className="text-[var(--text-secondary)] leading-relaxed mb-6">
                                {project.description.en}
                            </p>

                            {/* Meta info */}
                            <div className="flex flex-wrap gap-6 text-sm text-[var(--text-muted)] mb-6">
                                <span className="flex items-center gap-2">
                                    <User size={16} style={{ color: project.color }} />
                                    {project.role.en}
                                </span>
                                <span className="flex items-center gap-2">
                                    <Calendar size={16} style={{ color: project.color }} />
                                    {project.year}
                                </span>
                            </div>

                            {/* Action buttons */}
                            <div className="flex gap-3">
                                {project.links?.demo && (
                                    <a href={project.links.demo} target="_blank" rel="noopener noreferrer">
                                        <CyberButton variant="filled" icon={<ExternalLink size={18} />}>
                                            View Demo
                                        </CyberButton>
                                    </a>
                                )}
                                {project.links?.github && (
                                    <a href={project.links.github} target="_blank" rel="noopener noreferrer">
                                        <CyberButton variant="default" icon={<Github size={18} />}>
                                            Source Code
                                        </CyberButton>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.header>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Key Highlights */}
                        <motion.section
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <HoloCard className="p-6 sm:p-8" glowColor={project.color}>
                                <h2 className="text-xl font-[family-name:var(--font-display)] mb-6 flex items-center gap-2">
                                    <Check size={20} style={{ color: project.color }} />
                                    Key Achievements
                                </h2>

                                <div className="space-y-4">
                                    {project.highlights.en.map((highlight, index) => (
                                        <motion.div
                                            key={index}
                                            className="flex items-start gap-4 p-4 rounded-lg bg-[var(--void-light)] border border-[var(--glass-border)]"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3 + index * 0.1 }}
                                        >
                                            <div
                                                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold"
                                                style={{
                                                    background: `${project.color}20`,
                                                    color: project.color
                                                }}
                                            >
                                                {index + 1}
                                            </div>
                                            <div>
                                                <div className="text-[var(--text-primary)] font-medium">
                                                    {highlight}
                                                </div>
                                                <div className="text-sm text-[var(--text-muted)] mt-1">
                                                    {project.highlights.zh[index]}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </HoloCard>
                        </motion.section>

                        {/* Project Timeline */}
                        <motion.section
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <HoloCard className="p-6 sm:p-8">
                                <h2 className="text-xl font-[family-name:var(--font-display)] mb-6 flex items-center gap-2">
                                    <Layers size={20} className="text-[var(--neon-magenta)]" />
                                    Project Phases
                                </h2>

                                <div className="relative">
                                    {/* Timeline line */}
                                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[var(--neon-cyan)] via-[var(--neon-magenta)] to-[var(--neon-amber)]" />

                                    {/* Timeline items */}
                                    <div className="space-y-6">
                                        {[
                                            { phase: 'Discovery', desc: 'Requirements gathering and technical assessment' },
                                            { phase: 'Architecture', desc: 'System design and technology selection' },
                                            { phase: 'Development', desc: 'Iterative implementation with agile methodology' },
                                            { phase: 'Testing', desc: 'Comprehensive QA and performance optimization' },
                                            { phase: 'Deployment', desc: 'Production release and monitoring setup' },
                                        ].map((item, index) => (
                                            <motion.div
                                                key={item.phase}
                                                className="relative pl-12"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.5 + index * 0.1 }}
                                            >
                                                <div
                                                    className="absolute left-2 top-1 w-5 h-5 rounded-full border-2 bg-[var(--void-deep)]"
                                                    style={{ borderColor: project.color }}
                                                />
                                                <div className="font-semibold text-[var(--text-primary)]">{item.phase}</div>
                                                <div className="text-sm text-[var(--text-muted)]">{item.desc}</div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </HoloCard>
                        </motion.section>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Tech Stack */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <HoloCard className="p-6">
                                <h3 className="text-lg font-[family-name:var(--font-display)] mb-4 flex items-center gap-2">
                                    <Code2 size={18} className="text-[var(--neon-cyan)]" />
                                    Tech Stack
                                </h3>
                                <div className="space-y-3">
                                    {project.techStack.map((tech, index) => (
                                        <motion.div
                                            key={tech}
                                            className="flex items-center gap-3"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.4 + index * 0.05 }}
                                        >
                                            <div
                                                className="w-2 h-2 rounded-full"
                                                style={{ background: project.color }}
                                            />
                                            <span className="text-[var(--text-secondary)]">{tech}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </HoloCard>
                        </motion.div>

                        {/* Related Projects */}
                        {relatedProjects.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <HoloCard className="p-6" glowColor="var(--neon-magenta)">
                                    <h3 className="text-lg font-[family-name:var(--font-display)] mb-4">
                                        Related Projects
                                    </h3>
                                    <div className="space-y-4">
                                        {relatedProjects.map(related => (
                                            <Link key={related.id} href={`/portfolio/${related.id}`}>
                                                <div className="p-3 rounded-lg bg-[var(--void-light)] hover:bg-[var(--void-lighter)] transition-colors cursor-pointer">
                                                    <div className="font-medium text-[var(--text-primary)] text-sm">
                                                        {related.title.en}
                                                    </div>
                                                    <div className="text-xs text-[var(--text-muted)]">
                                                        {related.subtitle.en}
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </HoloCard>
                            </motion.div>
                        )}

                        {/* Back Button */}
                        <Link href="/portfolio">
                            <CyberButton variant="ghost" className="w-full" icon={<ArrowLeft size={16} />}>
                                Back to Portfolio
                            </CyberButton>
                        </Link>
                    </div>
                </div>

                {/* CTA */}
                <motion.div
                    className="mt-16 text-center"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <HoloCard className="inline-block p-8">
                        <h3 className="text-xl font-[family-name:var(--font-display)] mb-3">
                            Interested in a Similar Project?
                        </h3>
                        <p className="text-[var(--text-muted)] mb-6 max-w-md">
                            Let's discuss how I can help bring your vision to life with similar technology and expertise.
                        </p>
                        <Link href="/contact">
                            <CyberButton variant="filled" icon={<ExternalLink size={18} />}>
                                Get in Touch
                            </CyberButton>
                        </Link>
                    </HoloCard>
                </motion.div>
            </div>
        </div>
    );
}
