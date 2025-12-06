'use client';

import { useRef, useState, ReactNode } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface HoloCardProps {
    children: ReactNode;
    className?: string;
    glowColor?: string;
    interactive?: boolean;
    onClick?: () => void;
}

export default function HoloCard({
    children,
    className = '',
    glowColor = 'var(--neon-cyan)',
    interactive = true,
    onClick,
}: HoloCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    // Mouse position for 3D tilt
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth spring animations
    const springConfig = { damping: 25, stiffness: 150 };
    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), springConfig);
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), springConfig);

    // Shine position
    const shineX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-100, 100]), springConfig);
    const shineY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-100, 100]), springConfig);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current || !interactive) return;

        const rect = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        mouseX.set(x);
        mouseY.set(y);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        mouseX.set(0);
        mouseY.set(0);
    };

    return (
        <motion.div
            ref={cardRef}
            className={`holo-card relative overflow-hidden ${className}`}
            style={{
                rotateX: interactive ? rotateX : 0,
                rotateY: interactive ? rotateY : 0,
                transformStyle: 'preserve-3d',
                perspective: '1000px',
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            whileHover={{
                borderColor: 'var(--hologram-border)',
                boxShadow: `0 0 30px ${glowColor}33, 0 20px 40px rgba(0, 0, 0, 0.3)`,
            }}
        >
            {/* Holographic gradient overlay */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: `linear-gradient(
            135deg,
            ${glowColor}15 0%,
            transparent 50%,
            var(--neon-magenta)10 100%
          )`,
                }}
            />

            {/* Animated shine effect */}
            <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: `radial-gradient(
            circle at 50% 50%,
            rgba(255, 255, 255, 0.2) 0%,
            transparent 40%
          )`,
                    x: shineX,
                    y: shineY,
                    opacity: isHovered ? 0.6 : 0,
                }}
            />

            {/* Scanline effect */}
            <div
                className="absolute inset-0 pointer-events-none opacity-30"
                style={{
                    background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 245, 0.03) 2px, rgba(0, 255, 245, 0.03) 4px)',
                    animation: isHovered ? 'scanline 8s linear infinite' : 'none',
                }}
            />

            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-6 h-6">
                <div
                    className="absolute top-0 left-0 w-full h-[2px]"
                    style={{ background: `linear-gradient(90deg, ${glowColor}, transparent)` }}
                />
                <div
                    className="absolute top-0 left-0 h-full w-[2px]"
                    style={{ background: `linear-gradient(180deg, ${glowColor}, transparent)` }}
                />
            </div>
            <div className="absolute top-0 right-0 w-6 h-6">
                <div
                    className="absolute top-0 right-0 w-full h-[2px]"
                    style={{ background: `linear-gradient(-90deg, ${glowColor}, transparent)` }}
                />
                <div
                    className="absolute top-0 right-0 h-full w-[2px]"
                    style={{ background: `linear-gradient(180deg, ${glowColor}, transparent)` }}
                />
            </div>
            <div className="absolute bottom-0 left-0 w-6 h-6">
                <div
                    className="absolute bottom-0 left-0 w-full h-[2px]"
                    style={{ background: `linear-gradient(90deg, ${glowColor}, transparent)` }}
                />
                <div
                    className="absolute bottom-0 left-0 h-full w-[2px]"
                    style={{ background: `linear-gradient(0deg, ${glowColor}, transparent)` }}
                />
            </div>
            <div className="absolute bottom-0 right-0 w-6 h-6">
                <div
                    className="absolute bottom-0 right-0 w-full h-[2px]"
                    style={{ background: `linear-gradient(-90deg, ${glowColor}, transparent)` }}
                />
                <div
                    className="absolute bottom-0 right-0 h-full w-[2px]"
                    style={{ background: `linear-gradient(0deg, ${glowColor}, transparent)` }}
                />
            </div>

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    );
}
