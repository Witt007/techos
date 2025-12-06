'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GlitchTextProps {
    text: string;
    className?: string;
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
    glitchOnHover?: boolean;
    alwaysGlitch?: boolean;
    typewriter?: boolean;
    typewriterSpeed?: number;
}

export default function GlitchText({
    text,
    className = '',
    as: Component = 'span',
    glitchOnHover = false,
    alwaysGlitch = false,
    typewriter = false,
    typewriterSpeed = 50,
}: GlitchTextProps) {
    const [displayText, setDisplayText] = useState(typewriter ? '' : text);
    const [isHovered, setIsHovered] = useState(false);
    const [glitchActive, setGlitchActive] = useState(alwaysGlitch);
    const typewriterIndex = useRef(0);

    // Typewriter effect
    useEffect(() => {
        if (!typewriter) {
            setDisplayText(text);
            return;
        }

        typewriterIndex.current = 0;
        setDisplayText('');

        const interval = setInterval(() => {
            if (typewriterIndex.current < text.length) {
                setDisplayText(text.slice(0, typewriterIndex.current + 1));
                typewriterIndex.current++;
            } else {
                clearInterval(interval);
            }
        }, typewriterSpeed);

        return () => clearInterval(interval);
    }, [text, typewriter, typewriterSpeed]);

    // Random glitch effect
    useEffect(() => {
        if (!alwaysGlitch) return;

        const glitchInterval = setInterval(() => {
            setGlitchActive(true);
            setTimeout(() => setGlitchActive(false), 200);
        }, 3000 + Math.random() * 2000);

        return () => clearInterval(glitchInterval);
    }, [alwaysGlitch]);

    const shouldGlitch = glitchActive || (glitchOnHover && isHovered);

    return (
        <Component
            className={`relative inline-block ${className}`}
            onMouseEnter={() => glitchOnHover && setIsHovered(true)}
            onMouseLeave={() => glitchOnHover && setIsHovered(false)}
            data-text={displayText}
        >
            {/* Main text */}
            <span className="relative z-10">{displayText}</span>

            {/* Glitch layers */}
            <AnimatePresence>
                {shouldGlitch && (
                    <>
                        <motion.span
                            className="absolute inset-0 z-0"
                            initial={{ opacity: 0 }}
                            animate={{
                                opacity: 0.8,
                                x: [-2, 2, -1, 1, 0],
                            }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2, repeat: Infinity, repeatType: 'reverse' }}
                            style={{
                                color: 'var(--neon-cyan)',
                                clipPath: 'inset(20% 0 30% 0)',
                            }}
                            aria-hidden
                        >
                            {displayText}
                        </motion.span>
                        <motion.span
                            className="absolute inset-0 z-0"
                            initial={{ opacity: 0 }}
                            animate={{
                                opacity: 0.8,
                                x: [2, -2, 1, -1, 0],
                            }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15, repeat: Infinity, repeatType: 'reverse' }}
                            style={{
                                color: 'var(--neon-magenta)',
                                clipPath: 'inset(60% 0 10% 0)',
                            }}
                            aria-hidden
                        >
                            {displayText}
                        </motion.span>
                    </>
                )}
            </AnimatePresence>

            {/* Cursor for typewriter */}
            {typewriter && displayText.length < text.length && (
                <motion.span
                    className="inline-block w-[2px] h-[1em] ml-1 bg-[var(--neon-cyan)]"
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
                />
            )}
        </Component>
    );
}
