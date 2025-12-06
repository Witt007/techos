'use client';

import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import { motion } from 'framer-motion';
import { Copy, Check, ExternalLink } from 'lucide-react';

interface MarkdownRendererProps {
    content: string;
    className?: string;
}

// Copy button for code blocks
function CopyButton({ code }: { code: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopy}
            className="absolute top-2 right-2 p-2 rounded-lg bg-[var(--void-light)] 
        hover:bg-[var(--void-lighter)] text-[var(--text-muted)] 
        hover:text-[var(--neon-cyan)] transition-all opacity-0 group-hover:opacity-100"
            title="Copy code"
        >
            {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
    );
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
    return (
        <div className={`markdown-content ${className}`}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight, rehypeSlug]}
                components={{
                    // Headings
                    h1: ({ children, id }) => (
                        <h1 id={id} className="text-3xl font-bold font-[family-name:var(--font-display)] mt-10 mb-4 text-[var(--text-primary)] scroll-mt-24">
                            {children}
                        </h1>
                    ),
                    h2: ({ children, id }) => (
                        <h2 id={id} className="text-2xl font-bold font-[family-name:var(--font-display)] mt-8 mb-4 text-[var(--text-primary)] scroll-mt-24 flex items-center gap-2">
                            <span className="text-[var(--neon-cyan)]">#</span>
                            {children}
                        </h2>
                    ),
                    h3: ({ children, id }) => (
                        <h3 id={id} className="text-xl font-semibold font-[family-name:var(--font-display)] mt-6 mb-3 text-[var(--text-primary)] scroll-mt-24">
                            {children}
                        </h3>
                    ),
                    h4: ({ children, id }) => (
                        <h4 id={id} className="text-lg font-semibold mt-4 mb-2 text-[var(--text-primary)] scroll-mt-24">
                            {children}
                        </h4>
                    ),

                    // Paragraph
                    p: ({ children }) => (
                        <p className="mb-4 text-[var(--text-secondary)] leading-relaxed">
                            {children}
                        </p>
                    ),

                    // Links
                    a: ({ href, children }) => (
                        <a
                            href={href}
                            target={href?.startsWith('http') ? '_blank' : undefined}
                            rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                            className="text-[var(--neon-cyan)] hover:underline inline-flex items-center gap-1"
                        >
                            {children}
                            {href?.startsWith('http') && <ExternalLink size={12} />}
                        </a>
                    ),

                    // Lists
                    ul: ({ children }) => (
                        <ul className="mb-4 pl-6 space-y-2">
                            {children}
                        </ul>
                    ),
                    ol: ({ children }) => (
                        <ol className="mb-4 pl-6 space-y-2 list-decimal">
                            {children}
                        </ol>
                    ),
                    li: ({ children }) => (
                        <li className="text-[var(--text-secondary)] relative before:content-['▹'] before:absolute before:-left-5 before:text-[var(--neon-cyan)]">
                            {children}
                        </li>
                    ),

                    // Blockquote
                    blockquote: ({ children }) => (
                        <blockquote className="my-6 pl-4 border-l-4 border-[var(--neon-cyan)] bg-[var(--glass-bg)] py-4 pr-4 rounded-r-lg italic text-[var(--text-muted)]">
                            {children}
                        </blockquote>
                    ),

                    // Code blocks
                    code: ({ className, children, ...props }) => {
                        const match = /language-(\w+)/.exec(className || '');
                        const isInline = !match;

                        if (isInline) {
                            return (
                                <code
                                    className="px-1.5 py-0.5 rounded bg-[var(--void-light)] text-[var(--neon-magenta)] text-sm font-mono"
                                    {...props}
                                >
                                    {children}
                                </code>
                            );
                        }

                        const codeString = String(children).replace(/\n$/, '');

                        return (
                            <div className="relative group my-6">
                                {/* Language badge */}
                                {match && (
                                    <div className="absolute top-0 left-0 px-3 py-1 text-xs font-mono text-[var(--text-muted)] bg-[var(--void-lighter)] rounded-tl-lg rounded-br-lg border-b border-r border-[var(--glass-border)]">
                                        {match[1]}
                                    </div>
                                )}
                                <CopyButton code={codeString} />
                                <pre className="overflow-x-auto p-4 pt-10 rounded-lg bg-[var(--void-deep)] border border-[var(--glass-border)] text-sm">
                                    <code className={className} {...props}>
                                        {children}
                                    </code>
                                </pre>
                            </div>
                        );
                    },

                    // Tables
                    table: ({ children }) => (
                        <div className="overflow-x-auto my-6">
                            <table className="w-full border-collapse">
                                {children}
                            </table>
                        </div>
                    ),
                    thead: ({ children }) => (
                        <thead className="bg-[var(--void-light)]">
                            {children}
                        </thead>
                    ),
                    th: ({ children }) => (
                        <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--text-primary)] border-b border-[var(--glass-border)]">
                            {children}
                        </th>
                    ),
                    td: ({ children }) => (
                        <td className="px-4 py-3 text-sm text-[var(--text-secondary)] border-b border-[var(--glass-border)]/50">
                            {children}
                        </td>
                    ),

                    // Horizontal rule
                    hr: () => (
                        <hr className="my-8 border-t border-[var(--glass-border)]" />
                    ),

                    // Images
                    img: ({ src, alt }) => (
                        <figure className="my-6">
                            <img
                                src={src}
                                alt={alt}
                                className="rounded-lg border border-[var(--glass-border)] max-w-full"
                            />
                            {alt && (
                                <figcaption className="mt-2 text-sm text-center text-[var(--text-muted)]">
                                    {alt}
                                </figcaption>
                            )}
                        </figure>
                    ),

                    // Strong / Bold
                    strong: ({ children }) => (
                        <strong className="font-bold text-[var(--text-primary)]">
                            {children}
                        </strong>
                    ),

                    // Emphasis / Italic
                    em: ({ children }) => (
                        <em className="italic text-[var(--neon-amber)]">
                            {children}
                        </em>
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
