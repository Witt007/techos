'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Download, Github, ExternalLink, Package, Code2 } from 'lucide-react';
import HoloCard from '@/components/ui/HoloCard';
import CyberButton from '@/components/ui/CyberButton';
import GlitchText from '@/components/ui/GlitchText';
import { codeRepos, repoTypes } from '@/data/repos';
import { useI18n } from '@/components/providers/I18nProvider';

export default function CodeLabPage() {
    const [activeType, setActiveType] = useState('all');
    const { locale } = useI18n();

    const filteredRepos = activeType === 'all'
        ? codeRepos
        : codeRepos.filter(repo => repo.type === activeType);

    const featuredRepos = codeRepos.filter(repo => repo.featured);

    const getTypeColor = (type: string) => {
        const colors: Record<string, string> = {
            'component': 'var(--neon-cyan)',
            'framework': 'var(--neon-magenta)',
            'utility': 'var(--neon-amber)',
            'tool': 'var(--neon-green)',
        };
        return colors[type] || 'var(--neon-cyan)';
    };

    return (
        <div className="min-h-screen pt-24 pb-20 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.header
                    className="text-center mb-16"
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
                        <Code2 size={14} />
                        <span>{locale === 'zh' ? '开源库与工具' : 'Open Source Libraries & Tools'}</span>
                    </motion.div>

                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
                        <GlitchText
                            text={locale === 'zh' ? '代码库' : 'CodeLab'}
                            className="font-[family-name:var(--font-display)]"
                            glitchOnHover
                        />
                    </h1>
                    <p className="text-[var(--text-muted)] max-w-2xl mx-auto text-lg">
                        {locale === 'zh'
                            ? '为创意工程社区开发的开源库、组件和工具精选集。'
                            : 'A curated collection of open-source libraries, components, and tools developed for the creative engineering community.'}
                    </p>
                </motion.header>

                {/* Stats */}
                <motion.div
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    {[
                        { label: locale === 'zh' ? '仓库' : 'Repositories', value: codeRepos.length, icon: Package },
                        { label: locale === 'zh' ? '总星标' : 'Total Stars', value: `${(codeRepos.reduce((sum, r) => sum + r.stars, 0) / 1000).toFixed(1)}k+`, icon: Star },
                        { label: locale === 'zh' ? '月下载' : 'Monthly Downloads', value: '100k+', icon: Download },
                        { label: locale === 'zh' ? '贡献者' : 'Contributors', value: '50+', icon: Github },
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 * index }}
                        >
                            <HoloCard className="text-center p-4">
                                <stat.icon className="w-6 h-6 mx-auto mb-2 text-[var(--neon-cyan)]" />
                                <div className="text-2xl font-bold font-[family-name:var(--font-display)]">
                                    {stat.value}
                                </div>
                                <div className="text-xs text-[var(--text-muted)]">{stat.label}</div>
                            </HoloCard>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Type Filter */}
                <motion.div
                    className="flex flex-wrap gap-3 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    {repoTypes.map((type) => (
                        <motion.button
                            key={type.id}
                            onClick={() => setActiveType(type.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeType === type.id
                                ? 'bg-[var(--neon-cyan)] text-[var(--void-deepest)]'
                                : 'bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--text-secondary)] hover:border-[var(--neon-cyan)] hover:text-[var(--neon-cyan)]'
                                }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span>{type.icon}</span>
                            <span>{locale === 'zh' ? type.label.zh : type.label.en}</span>
                        </motion.button>
                    ))}
                </motion.div>

                {/* Repos Grid */}
                <motion.div className="grid md:grid-cols-2 gap-6" layout>
                    <AnimatePresence mode="popLayout">
                        {filteredRepos.map((repo, index) => (
                            <motion.div
                                key={repo.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                                <HoloCard
                                    className="h-full group"
                                    glowColor={getTypeColor(repo.type)}
                                >
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span
                                                    className="text-xs font-mono px-2 py-0.5 rounded"
                                                    style={{
                                                        background: `${getTypeColor(repo.type)}20`,
                                                        color: getTypeColor(repo.type)
                                                    }}
                                                >
                                                    {repo.type}
                                                </span>
                                                <span className="text-xs text-[var(--text-muted)]">
                                                    v{repo.version}
                                                </span>
                                                {repo.featured && (
                                                    <span className="text-xs text-[var(--neon-amber)]">★ Featured</span>
                                                )}
                                            </div>
                                            <h3 className="text-lg font-mono font-bold group-hover:text-[var(--neon-cyan)] transition-colors">
                                                {repo.name}
                                            </h3>
                                        </div>
                                        <div className="text-xs text-[var(--text-muted)] bg-[var(--void-light)] px-2 py-1 rounded">
                                            {repo.language}
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <p className="text-sm text-[var(--text-secondary)] mb-4">
                                        {locale === 'zh' ? repo.description.zh : repo.description.en}
                                    </p>

                                    {/* Stats */}
                                    <div className="flex items-center gap-4 text-sm text-[var(--text-muted)] mb-4">
                                        <span className="flex items-center gap-1">
                                            <Star size={14} className="text-[var(--neon-amber)]" />
                                            {repo.stars.toLocaleString()}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Download size={14} />
                                            {repo.downloads}
                                        </span>
                                    </div>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {repo.tags.map(tag => (
                                            <span
                                                key={tag}
                                                className="px-2 py-1 text-xs rounded bg-[var(--void-light)] text-[var(--text-secondary)]"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-3">
                                        {repo.github && (
                                            <a
                                                href={repo.github}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-[var(--neon-cyan)] transition-colors"
                                            >
                                                <Github size={16} />
                                                GitHub
                                            </a>
                                        )}
                                        {repo.npm && (
                                            <a
                                                href={repo.npm}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-[var(--neon-cyan)] transition-colors"
                                            >
                                                <Package size={16} />
                                                NPM
                                            </a>
                                        )}
                                        {repo.docs && (
                                            <a
                                                href={repo.docs}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-[var(--neon-cyan)] transition-colors"
                                            >
                                                <ExternalLink size={16} />
                                                Docs
                                            </a>
                                        )}
                                    </div>
                                </HoloCard>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* CTA */}
                <motion.div
                    className="text-center mt-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <HoloCard className="inline-block p-8">
                        <Github className="w-10 h-10 mx-auto mb-4 text-[var(--neon-cyan)]" />
                        <h3 className="text-xl font-[family-name:var(--font-display)] mb-3">
                            {locale === 'zh' ? '想要贡献？' : 'Want to Contribute?'}
                        </h3>
                        <p className="text-[var(--text-muted)] mb-6 max-w-md">
                            {locale === 'zh'
                                ? '所有项目都是开源的。欢迎 PR 和 Issue！'
                                : 'All projects are open source. PRs and issues are welcome!'}
                        </p>
                        <CyberButton
                            variant="default"
                            icon={<Github size={18} />}
                            onClick={() => window.open('https://github.com/alexchen', '_blank')}
                        >
                            {locale === 'zh' ? '查看 GitHub 主页' : 'View GitHub Profile'}
                        </CyberButton>
                    </HoloCard>
                </motion.div>
            </div>
        </div>
    );
}
