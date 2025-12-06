'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ExternalLink, Github, ArrowRight, Filter, Eye } from 'lucide-react';
import HoloCard from '@/components/ui/HoloCard';
import CyberButton from '@/components/ui/CyberButton';
import GlitchText from '@/components/ui/GlitchText';
import { projects, projectCategories, ProjectCategory } from '@/data/projects';
import { useI18n } from '@/components/providers/I18nProvider';

export default function PortfolioPage() {
    const [activeCategory, setActiveCategory] = useState<ProjectCategory>('all');
    const [hoveredProject, setHoveredProject] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const { locale } = useI18n();

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.3]);

    const filteredProjects = activeCategory === 'all'
        ? projects
        : projects.filter(p => p.category === activeCategory);

    return (
        <div ref={containerRef} className="min-h-screen pt-24 pb-20 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.header
                    className="text-center mb-16"
                    style={{ opacity: headerOpacity }}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <motion.div
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
              bg-[var(--glass-bg)] border border-[var(--glass-border)] 
              text-xs font-mono text-[var(--neon-cyan)] mb-6"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Eye size={14} />
                        <span>{locale === 'zh' ? '50+ 企业级项目交付' : '50+ Enterprise Projects Delivered'}</span>
                    </motion.div>

                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
                        <GlitchText
                            text={locale === 'zh' ? '作品集' : 'Portfolio'}
                            className="font-[family-name:var(--font-display)]"
                            glitchOnHover
                        />
                    </h1>
                    <p className="text-[var(--text-muted)] max-w-2xl mx-auto text-lg">
                        {locale === 'zh'
                            ? '精选数字孪生、GIS、数据可视化、AI 和 3D 技术项目集合。'
                            : 'A curated collection of projects spanning Digital Twin, GIS, Data Visualization, AI, and 3D Technology.'}
                    </p>
                </motion.header>

                {/* Category Filter */}
                <motion.div
                    className="flex flex-wrap justify-center gap-3 mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                >
                    {projectCategories.map((category) => (
                        <motion.button
                            key={category.id}
                            onClick={() => setActiveCategory(category.id as ProjectCategory)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeCategory === category.id
                                ? 'bg-[var(--neon-cyan)] text-[var(--void-deepest)]'
                                : 'bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--text-secondary)] hover:border-[var(--neon-cyan)] hover:text-[var(--neon-cyan)]'
                                }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span>{category.icon}</span>
                            <span>{locale === 'zh' ? category.label.zh : category.label.en}</span>
                        </motion.button>
                    ))}
                </motion.div>

                {/* Projects Grid */}
                <motion.div
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                    layout
                >
                    <AnimatePresence mode="popLayout">
                        {filteredProjects.map((project, index) => (
                            <motion.div
                                key={project.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.4, delay: index * 0.05 }}
                            >
                                <HoloCard
                                    className="h-full group cursor-pointer overflow-hidden"
                                    glowColor={project.color}
                                    onClick={() => setHoveredProject(hoveredProject === project.id ? null : project.id)}
                                >
                                    {/* Project Header */}
                                    <div className="relative h-48 -mx-6 -mt-6 mb-4 overflow-hidden">
                                        {/* Placeholder gradient */}
                                        <div
                                            className="absolute inset-0"
                                            style={{
                                                background: `linear-gradient(135deg, ${project.color}30 0%, var(--void-deep) 100%)`
                                            }}
                                        />

                                        {/* Category badge */}
                                        <div
                                            className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-mono"
                                            style={{
                                                background: `${project.color}20`,
                                                color: project.color,
                                                border: `1px solid ${project.color}50`
                                            }}
                                        >
                                            {project.year}
                                        </div>

                                        {/* Featured badge */}
                                        {project.featured && (
                                            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[var(--neon-amber)]/20 text-[var(--neon-amber)] text-xs font-mono border border-[var(--neon-amber)]/50">
                                                Featured
                                            </div>
                                        )}

                                        {/* Hover overlay */}
                                        <motion.div
                                            className="absolute inset-0 flex items-center justify-center bg-[var(--void-deepest)]/80 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <div className="text-center">
                                                <div className="text-4xl mb-2">
                                                    {projectCategories.find(c => c.id === project.category)?.icon}
                                                </div>
                                                <div className="text-sm text-[var(--text-muted)]">
                                                    Click to expand
                                                </div>
                                            </div>
                                        </motion.div>
                                    </div>

                                    {/* Project Info */}
                                    <div className="space-y-3">
                                        <div>
                                            <h3
                                                className="text-lg font-[family-name:var(--font-display)] font-bold mb-1"
                                                style={{ color: project.color }}
                                            >
                                                {locale === 'zh' ? project.title.zh : project.title.en}
                                            </h3>
                                            <p className="text-sm text-[var(--text-muted)]">
                                                {locale === 'zh' ? project.subtitle.zh : project.subtitle.en}
                                            </p>
                                        </div>

                                        <p className="text-sm text-[var(--text-secondary)] line-clamp-2">
                                            {locale === 'zh' ? project.description.zh : project.description.en}
                                        </p>

                                        {/* Role */}
                                        <div className="text-xs text-[var(--text-muted)]">
                                            <span className="text-[var(--neon-cyan)]">{locale === 'zh' ? '角色:' : 'Role:'}</span> {locale === 'zh' ? project.role.zh : project.role.en}
                                        </div>

                                        {/* Tech Stack */}
                                        <div className="flex flex-wrap gap-2">
                                            {project.techStack.slice(0, 4).map((tech) => (
                                                <span
                                                    key={tech}
                                                    className="px-2 py-1 text-xs rounded bg-[var(--void-light)] text-[var(--text-secondary)]"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                            {project.techStack.length > 4 && (
                                                <span className="px-2 py-1 text-xs rounded bg-[var(--void-light)] text-[var(--text-muted)]">
                                                    +{project.techStack.length - 4}
                                                </span>
                                            )}
                                        </div>

                                        {/* Expanded content */}
                                        <AnimatePresence>
                                            {hoveredProject === project.id && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="pt-4 border-t border-[var(--glass-border)] space-y-3">
                                                        <h4 className="text-sm font-semibold text-[var(--text-primary)]">
                                                            {locale === 'zh' ? '主要亮点' : 'Key Highlights'}
                                                        </h4>
                                                        <ul className="space-y-2">
                                                            {(locale === 'zh' ? project.highlights.zh : project.highlights.en).map((highlight, i) => (
                                                                <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                                                                    <span style={{ color: project.color }}>▸</span>
                                                                    {highlight}
                                                                </li>
                                                            ))}
                                                        </ul>

                                                        {/* Links */}
                                                        <div className="flex gap-3 pt-2">
                                                            {project.links?.demo && (
                                                                <a
                                                                    href={project.links.demo}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="flex items-center gap-1 text-xs text-[var(--neon-cyan)] hover:underline"
                                                                >
                                                                    <ExternalLink size={14} />
                                                                    Demo
                                                                </a>
                                                            )}
                                                            {project.links?.github && (
                                                                <a
                                                                    href={project.links.github}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="flex items-center gap-1 text-xs text-[var(--text-secondary)] hover:text-[var(--neon-cyan)]"
                                                                >
                                                                    <Github size={14} />
                                                                    GitHub
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </HoloCard>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* Empty state */}
                {filteredProjects.length === 0 && (
                    <motion.div
                        className="text-center py-20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <Filter className="w-12 h-12 mx-auto mb-4 text-[var(--text-muted)]" />
                        <p className="text-[var(--text-muted)]">
                            No projects found in this category.
                        </p>
                    </motion.div>
                )}

                {/* CTA */}
                <motion.div
                    className="text-center mt-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <HoloCard className="inline-block p-8">
                        <h3 className="text-xl font-[family-name:var(--font-display)] mb-4">
                            {locale === 'zh' ? '有兴趣合作吗？' : 'Interested in Collaboration?'}
                        </h3>
                        <p className="text-[var(--text-muted)] mb-6 max-w-md">
                            {locale === 'zh'
                                ? '我随时愿意讨论新项目和创意机会。'
                                : "I'm always open to discussing new projects and creative opportunities."}
                        </p>
                        <CyberButton
                            variant="filled"
                            icon={<ArrowRight size={18} />}
                            iconPosition="right"
                            onClick={() => window.location.href = '/contact'}
                        >
                            {locale === 'zh' ? '联系我' : "Let's Talk"}
                        </CyberButton>
                    </HoloCard>
                </motion.div>
            </div>
        </div>
    );
}
