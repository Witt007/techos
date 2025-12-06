'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    Calendar, Clock, ArrowLeft, ArrowRight,
    ChevronRight, Share2, Bookmark, List
} from 'lucide-react';
import HoloCard from '@/components/ui/HoloCard';
import CyberButton from '@/components/ui/CyberButton';
import GlitchText from '@/components/ui/GlitchText';
import MarkdownRenderer from '@/components/ui/MarkdownRenderer';
import { blogPosts, blogCategories } from '@/data/blog';
import { getFullBlogPost, getAdjacentPosts } from '@/data/blogContent';

interface TOCItem {
    id: string;
    text: string;
    level: number;
}

export default function BlogPostPage() {
    const params = useParams();
    const slug = params.slug as string;
    const [toc, setToc] = useState<TOCItem[]>([]);
    const [activeSection, setActiveSection] = useState('');
    const [showTOC, setShowTOC] = useState(false);

    const post = getFullBlogPost(slug);
    const { prev, next } = getAdjacentPosts(slug);

    // Extract TOC from content
    useEffect(() => {
        if (!post?.content) return;

        const headingRegex = /^(#{2,4})\s+(.+)$/gm;
        const items: TOCItem[] = [];
        let match;

        while ((match = headingRegex.exec(post.content)) !== null) {
            const level = match[1].length;
            const text = match[2];
            const id = text.toLowerCase().replace(/[^\w]+/g, '-');
            items.push({ id, text, level });
        }

        setToc(items);
    }, [post?.content]);

    // Track active section on scroll
    useEffect(() => {
        const handleScroll = () => {
            const headings = document.querySelectorAll('h2, h3, h4');
            let currentSection = '';

            headings.forEach((heading) => {
                const rect = heading.getBoundingClientRect();
                if (rect.top <= 100) {
                    currentSection = heading.id;
                }
            });

            setActiveSection(currentSection);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!post) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <HoloCard className="p-8 text-center">
                    <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
                    <p className="text-[var(--text-muted)] mb-6">
                        The article you're looking for doesn't exist.
                    </p>
                    <Link href="/blog">
                        <CyberButton icon={<ArrowLeft size={18} />}>
                            Back to Blog
                        </CyberButton>
                    </Link>
                </HoloCard>
            </div>
        );
    }

    const category = blogCategories.find(c => c.id === post.category);
    const categoryColor = {
        'tutorial': 'var(--neon-cyan)',
        'insight': 'var(--neon-amber)',
        'case-study': 'var(--neon-magenta)',
        'opinion': 'var(--neon-purple)',
    }[post.category] || 'var(--neon-cyan)';

    return (
        <div className="min-h-screen pt-24 pb-20">
            {/* Hero Section */}
            <motion.header
                className="relative px-4 mb-12"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <div className="max-w-4xl mx-auto">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-6">
                        <Link href="/" className="hover:text-[var(--neon-cyan)]">Home</Link>
                        <ChevronRight size={14} />
                        <Link href="/blog" className="hover:text-[var(--neon-cyan)]">Blog</Link>
                        <ChevronRight size={14} />
                        <span className="text-[var(--text-secondary)]">{post.title.en}</span>
                    </div>

                    {/* Category & Featured */}
                    <div className="flex items-center gap-3 mb-4">
                        <span
                            className="px-3 py-1 rounded-full text-xs font-mono"
                            style={{
                                background: `${categoryColor}20`,
                                color: categoryColor,
                                border: `1px solid ${categoryColor}50`
                            }}
                        >
                            {category?.label.en}
                        </span>
                        {post.featured && (
                            <span className="px-3 py-1 rounded-full text-xs font-mono bg-[var(--neon-amber)]/20 text-[var(--neon-amber)] border border-[var(--neon-amber)]/50">
                                ★ Featured
                            </span>
                        )}
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-[family-name:var(--font-display)] mb-6 leading-tight">
                        <GlitchText text={post.title.en} glitchOnHover />
                    </h1>

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-6 text-sm text-[var(--text-muted)] mb-6">
                        <span className="flex items-center gap-2">
                            <Calendar size={16} />
                            {new Date(post.publishedAt).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                            })}
                        </span>
                        <span className="flex items-center gap-2">
                            <Clock size={16} />
                            {post.readingTime} min read
                        </span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                        {post.tags.map(tag => (
                            <span
                                key={tag}
                                className="px-3 py-1 text-xs rounded-lg bg-[var(--void-light)] text-[var(--text-secondary)] hover:bg-[var(--void-lighter)] transition-colors cursor-pointer"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>
            </motion.header>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex gap-8">
                    {/* Article */}
                    <motion.article
                        className="flex-1 max-w-4xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <HoloCard className="p-6 sm:p-10">
                            <MarkdownRenderer content={post.content} />
                        </HoloCard>

                        {/* Share & Save */}
                        <div className="flex items-center justify-between mt-8 px-4">
                            <div className="flex gap-3">
                                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--text-secondary)] hover:text-[var(--neon-cyan)] hover:border-[var(--neon-cyan)] transition-all">
                                    <Share2 size={16} />
                                    Share
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--text-secondary)] hover:text-[var(--neon-magenta)] hover:border-[var(--neon-magenta)] transition-all">
                                    <Bookmark size={16} />
                                    Save
                                </button>
                            </div>
                        </div>

                        {/* Navigation */}
                        <div className="grid sm:grid-cols-2 gap-4 mt-8">
                            {prev && (
                                <Link href={`/blog/${prev.slug}`}>
                                    <HoloCard className="p-4 group cursor-pointer h-full">
                                        <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-2">
                                            <ArrowLeft size={14} />
                                            Previous Article
                                        </div>
                                        <div className="font-semibold group-hover:text-[var(--neon-cyan)] transition-colors line-clamp-2">
                                            {prev.title.en}
                                        </div>
                                    </HoloCard>
                                </Link>
                            )}
                            {next && (
                                <Link href={`/blog/${next.slug}`} className={prev ? '' : 'sm:col-start-2'}>
                                    <HoloCard className="p-4 group cursor-pointer h-full" glowColor="var(--neon-magenta)">
                                        <div className="flex items-center justify-end gap-2 text-xs text-[var(--text-muted)] mb-2">
                                            Next Article
                                            <ArrowRight size={14} />
                                        </div>
                                        <div className="font-semibold text-right group-hover:text-[var(--neon-magenta)] transition-colors line-clamp-2">
                                            {next.title.en}
                                        </div>
                                    </HoloCard>
                                </Link>
                            )}
                        </div>
                    </motion.article>

                    {/* Sidebar - Table of Contents */}
                    <aside className="hidden lg:block w-64 shrink-0">
                        <div className="sticky top-28">
                            <HoloCard className="p-4">
                                <div className="flex items-center gap-2 text-sm font-semibold mb-4">
                                    <List size={16} className="text-[var(--neon-cyan)]" />
                                    Table of Contents
                                </div>
                                <nav className="space-y-1 max-h-[60vh] overflow-y-auto">
                                    {toc.map((item) => (
                                        <a
                                            key={item.id}
                                            href={`#${item.id}`}
                                            className={`block py-1.5 text-sm transition-all ${item.level === 2 ? 'pl-0' : item.level === 3 ? 'pl-3' : 'pl-6'
                                                } ${activeSection === item.id
                                                    ? 'text-[var(--neon-cyan)] border-l-2 border-[var(--neon-cyan)] pl-2'
                                                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                                                }`}
                                        >
                                            {item.text}
                                        </a>
                                    ))}
                                </nav>
                            </HoloCard>

                            {/* Back to Blog */}
                            <Link href="/blog" className="block mt-4">
                                <CyberButton variant="ghost" className="w-full" icon={<ArrowLeft size={16} />}>
                                    Back to Blog
                                </CyberButton>
                            </Link>
                        </div>
                    </aside>
                </div>
            </div>

            {/* Mobile TOC Toggle */}
            <button
                onClick={() => setShowTOC(!showTOC)}
                className="lg:hidden fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[var(--neon-cyan)] text-[var(--void-deepest)] shadow-lg flex items-center justify-center z-50"
            >
                <List size={24} />
            </button>

            {/* Mobile TOC Drawer */}
            {showTOC && (
                <motion.div
                    className="lg:hidden fixed inset-0 z-40"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <div
                        className="absolute inset-0 bg-[var(--void-deepest)]/80 backdrop-blur-sm"
                        onClick={() => setShowTOC(false)}
                    />
                    <motion.div
                        className="absolute bottom-0 left-0 right-0 bg-[var(--void-deep)] border-t border-[var(--glass-border)] p-6 rounded-t-2xl max-h-[70vh] overflow-y-auto"
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2 font-semibold">
                                <List size={18} className="text-[var(--neon-cyan)]" />
                                Table of Contents
                            </div>
                            <button
                                onClick={() => setShowTOC(false)}
                                className="text-[var(--text-muted)]"
                            >
                                ✕
                            </button>
                        </div>
                        <nav className="space-y-2">
                            {toc.map((item) => (
                                <a
                                    key={item.id}
                                    href={`#${item.id}`}
                                    onClick={() => setShowTOC(false)}
                                    className={`block py-2 text-sm ${item.level === 2 ? 'pl-0' : item.level === 3 ? 'pl-4' : 'pl-8'
                                        } ${activeSection === item.id
                                            ? 'text-[var(--neon-cyan)]'
                                            : 'text-[var(--text-muted)]'
                                        }`}
                                >
                                    {item.text}
                                </a>
                            ))}
                        </nav>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
}
