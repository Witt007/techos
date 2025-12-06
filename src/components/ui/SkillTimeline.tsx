'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { profile } from '@/data/profile';

interface SkillTimelineProps {
    className?: string;
}

export default function SkillTimeline({ className = '' }: SkillTimelineProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

    const careerStory = profile.story;

    const getColorForIndex = (index: number) => {
        const colors = [
            'var(--neon-cyan)',
            'var(--neon-magenta)',
            'var(--neon-amber)',
            'var(--neon-green)',
            'var(--neon-purple)',
        ];
        return colors[index % colors.length];
    };

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            {/* Animated timeline line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-[var(--glass-border)]">
                <motion.div
                    className="w-full bg-gradient-to-b from-[var(--neon-cyan)] via-[var(--neon-magenta)] to-[var(--neon-amber)]"
                    style={{ height: lineHeight }}
                />
            </div>

            {/* Timeline items */}
            <div className="space-y-12">
                {careerStory.map((item, index) => {
                    const isLeft = index % 2 === 0;
                    const color = getColorForIndex(index);

                    return (
                        <motion.div
                            key={index}
                            className={`relative flex items-center ${isLeft ? 'md:flex-row-reverse' : ''
                                }`}
                            initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            viewport={{ once: true, margin: "-100px" }}
                        >
                            {/* Content */}
                            <div className={`w-full md:w-1/2 ${isLeft ? 'md:pr-16 md:text-right' : 'md:pl-16'} pl-20 md:pl-0`}>
                                <motion.div
                                    className="p-6 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] backdrop-blur-sm hover:border-opacity-50 transition-all group"
                                    style={{
                                        borderColor: color
                                    }}
                                    whileHover={{
                                        scale: 1.02,
                                        boxShadow: `0 0 30px ${color}20`
                                    }}
                                >
                                    {/* Year badge */}
                                    <div
                                        className="inline-block px-3 py-1 rounded-full text-xs font-mono mb-3"
                                        style={{
                                            background: `${color}20`,
                                            color: color
                                        }}
                                    >
                                        {item.year}
                                    </div>

                                    {/* Title */}
                                    <h3
                                        className="text-lg font-bold font-[family-name:var(--font-display)] mb-2"
                                        style={{ color }}
                                    >
                                        {item.title.en}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-sm text-[var(--text-muted)] mb-2">
                                        {item.description.en}
                                    </p>
                                    <p className="text-xs text-[var(--text-muted)]/70 italic">
                                        {item.description.zh}
                                    </p>
                                </motion.div>
                            </div>

                            {/* Timeline node */}
                            <motion.div
                                className="absolute left-5 md:left-1/2 md:-translate-x-1/2 w-7 h-7 rounded-full border-4 bg-[var(--void-deep)] z-10"
                                style={{ borderColor: color }}
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 20,
                                    delay: index * 0.1 + 0.2
                                }}
                                viewport={{ once: true }}
                            >
                                {/* Pulse effect */}
                                <motion.div
                                    className="absolute inset-0 rounded-full"
                                    style={{ background: color }}
                                    animate={{
                                        scale: [1, 1.5, 1],
                                        opacity: [0.5, 0, 0.5],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        delay: index * 0.2,
                                    }}
                                />
                            </motion.div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
