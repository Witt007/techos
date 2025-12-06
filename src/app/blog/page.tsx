'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Calendar, ArrowRight, BookOpen } from 'lucide-react';
import HoloCard from '@/components/ui/HoloCard';
import CyberButton from '@/components/ui/CyberButton';
import GlitchText from '@/components/ui/GlitchText';
import { blogPosts, blogCategories } from '@/data/blog';
import { useI18n } from '@/components/providers/I18nProvider';

export default function BlogPage() {
    const [activeCategory, setActiveCategory] = useState('all');
    const { locale } = useI18n();

    const filteredPosts = activeCategory === 'all'
        ? blogPosts
        : blogPosts.filter(post => post.category === activeCategory);

    const featuredPosts = blogPosts.filter(post => post.featured);

    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            'tutorial': 'var(--neon-cyan)',
            'insight': 'var(--neon-amber)',
            'case-study': 'var(--neon-magenta)',
            'opinion': 'var(--neon-purple)',
        };
        return colors[category] || 'var(--neon-cyan)';
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
                        <BookOpen size={14} />
                        <span>{locale === 'zh' ? '技术洞察与教程' : 'Technical Insights & Tutorials'}</span>
                    </motion.div>

                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
                        <GlitchText
                            text={locale === 'zh' ? '博客' : 'Blog'}
                            className="font-[family-name:var(--font-display)]"
                            glitchOnHover
                        />
                    </h1>
                    <p className="text-[var(--text-muted)] max-w-2xl mx-auto text-lg">
                        {locale === 'zh'
                            ? '分享创意工程、可视化技术和全栈开发方面的知识和经验。'
                            : 'Sharing knowledge and experiences in creative engineering, visualization technology, and full-stack development.'}
                    </p>
                </motion.header>

                {/* Featured Posts */}
                {activeCategory === 'all' && featuredPosts.length > 0 && (
                    <motion.section
                        className="mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <h2 className="text-xl font-[family-name:var(--font-display)] mb-6 flex items-center gap-3">
                            <span className="text-[var(--neon-amber)]">★</span>
                            {locale === 'zh' ? '精选文章' : 'Featured Articles'}
                        </h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {featuredPosts.map((post, index) => (
                                <motion.div
                                    key={post.slug}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 * index }}
                                >
                                    <Link href={`/blog/${post.slug}`}>
                                        <HoloCard
                                            className="h-full group cursor-pointer"
                                            glowColor={getCategoryColor(post.category)}
                                        >
                                            {/* Category badge */}
                                            <div
                                                className="inline-block px-3 py-1 rounded-full text-xs font-mono mb-3"
                                                style={{
                                                    background: `${getCategoryColor(post.category)}20`,
                                                    color: getCategoryColor(post.category),
                                                    border: `1px solid ${getCategoryColor(post.category)}50`
                                                }}
                                            >
                                                {blogCategories.find(c => c.id === post.category)?.label.en}
                                            </div>

                                            <h3 className="text-lg font-semibold mb-2 group-hover:text-[var(--neon-cyan)] transition-colors line-clamp-2">
                                                {locale === 'zh' ? post.title.zh : post.title.en}
                                            </h3>
                                            <p className="text-sm text-[var(--text-muted)] mb-4 line-clamp-2">
                                                {locale === 'zh' ? post.excerpt.zh : post.excerpt.en}
                                            </p>

                                            {/* Meta */}
                                            <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={12} />
                                                    {new Date(post.publishedAt).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock size={12} />
                                                    {post.readingTime} {locale === 'zh' ? '分钟阅读' : 'min read'}
                                                </span>
                                            </div>
                                        </HoloCard>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>
                )}

                {/* Category Filter */}
                <motion.div
                    className="flex flex-wrap gap-3 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    {blogCategories.map((category) => (
                        <motion.button
                            key={category.id}
                            onClick={() => setActiveCategory(category.id)}
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

                {/* Posts List */}
                <motion.div className="space-y-6" layout>
                    <AnimatePresence mode="popLayout">
                        {filteredPosts.map((post, index) => (
                            <motion.div
                                key={post.slug}
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                                <Link href={`/blog/${post.slug}`}>
                                    <HoloCard className="group cursor-pointer">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                            {/* Left: Category icon */}
                                            <div
                                                className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl shrink-0"
                                                style={{
                                                    background: `${getCategoryColor(post.category)}15`,
                                                    border: `1px solid ${getCategoryColor(post.category)}30`
                                                }}
                                            >
                                                {blogCategories.find(c => c.id === post.category)?.icon}
                                            </div>

                                            {/* Center: Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span
                                                        className="text-xs font-mono"
                                                        style={{ color: getCategoryColor(post.category) }}
                                                    >
                                                        {post.category.toUpperCase()}
                                                    </span>
                                                    {post.featured && (
                                                        <span className="text-xs text-[var(--neon-amber)]">★ Featured</span>
                                                    )}
                                                </div>
                                                <h3 className="text-lg font-semibold mb-1 group-hover:text-[var(--neon-cyan)] transition-colors truncate">
                                                    {locale === 'zh' ? post.title.zh : post.title.en}
                                                </h3>
                                                <p className="text-sm text-[var(--text-muted)] line-clamp-1 hidden sm:block">
                                                    {locale === 'zh' ? post.excerpt.zh : post.excerpt.en}
                                                </p>
                                            </div>

                                            {/* Right: Meta & Arrow */}
                                            <div className="flex items-center gap-6 shrink-0">
                                                <div className="hidden md:flex flex-col items-end text-xs text-[var(--text-muted)]">
                                                    <span>{new Date(post.publishedAt).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}</span>
                                                    <span>{post.readingTime} min</span>
                                                </div>
                                                <motion.div
                                                    className="text-[var(--text-muted)] group-hover:text-[var(--neon-cyan)] transition-colors"
                                                    whileHover={{ x: 5 }}
                                                >
                                                    <ArrowRight size={20} />
                                                </motion.div>
                                            </div>
                                        </div>

                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-2 mt-4">
                                            {post.tags.map(tag => (
                                                <span
                                                    key={tag}
                                                    className="px-2 py-1 text-xs rounded bg-[var(--void-light)] text-[var(--text-secondary)]"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </HoloCard>
                                </Link>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* Empty state */}
                {filteredPosts.length === 0 && (
                    <motion.div
                        className="text-center py-20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <BookOpen className="w-12 h-12 mx-auto mb-4 text-[var(--text-muted)]" />
                        <p className="text-[var(--text-muted)]">
                            No posts found in this category.
                        </p>
                    </motion.div>
                )}

                {/* Newsletter CTA */}
                <motion.div
                    className="mt-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <HoloCard className="text-center p-8">
                        <h3 className="text-xl font-[family-name:var(--font-display)] mb-3">
                            {locale === 'zh' ? '保持更新' : 'Stay Updated'}
                        </h3>
                        <p className="text-[var(--text-muted)] mb-6 max-w-md mx-auto">
                            {locale === 'zh'
                                ? '当新文章发布时收到通知。无垃圾邮件，只有优质内容。'
                                : 'Get notified when new articles are published. No spam, just quality content.'}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder={locale === 'zh' ? '你的邮箱' : 'your@email.com'}
                                className="flex-1 px-4 py-3 rounded-lg bg-[var(--void-light)] border border-[var(--glass-border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--neon-cyan)] focus:outline-none transition-colors"
                            />
                            <CyberButton variant="filled">
                                {locale === 'zh' ? '订阅' : 'Subscribe'}
                            </CyberButton>
                        </div>
                    </HoloCard>
                </motion.div>
            </div>
        </div>
    );
}
