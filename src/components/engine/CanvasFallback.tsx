'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    alpha: number;
    life: number;
    maxLife: number;
}

interface CanvasFallbackProps {
    className?: string;
    particleCount?: number;
}

export default function CanvasFallback({
    className = '',
    particleCount = 100
}: CanvasFallbackProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>(0);
    const particlesRef = useRef<Particle[]>([]);
    const mouseRef = useRef({ x: 0, y: 0 });
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    // Color palette
    const colors = ['#00fff5', '#ff00ff', '#bf00ff', '#0080ff'];

    const createParticle = useCallback((x?: number, y?: number): Particle => {
        const width = dimensions.width || window.innerWidth;
        const height = dimensions.height || window.innerHeight;

        return {
            x: x ?? Math.random() * width,
            y: y ?? Math.random() * height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 3 + 1,
            color: colors[Math.floor(Math.random() * colors.length)],
            alpha: Math.random() * 0.5 + 0.3,
            life: 0,
            maxLife: Math.random() * 500 + 200,
        };
    }, [dimensions]);

    const initParticles = useCallback(() => {
        particlesRef.current = Array.from({ length: particleCount }, () => createParticle());
    }, [particleCount, createParticle]);

    useEffect(() => {
        const handleResize = () => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };

        handleResize();
        initParticles();

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [initParticles]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = dimensions.width;
        canvas.height = dimensions.height;

        const animate = () => {
            ctx.fillStyle = 'rgba(3, 3, 8, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            particlesRef.current.forEach((particle, index) => {
                // Update position
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.life++;

                // Mouse interaction - gentle attraction
                const dx = mouseRef.current.x - particle.x;
                const dy = mouseRef.current.y - particle.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 200 && dist > 0) {
                    const force = (200 - dist) / 200 * 0.02;
                    particle.vx += (dx / dist) * force;
                    particle.vy += (dy / dist) * force;
                }

                // Damping
                particle.vx *= 0.99;
                particle.vy *= 0.99;

                // Boundary wrap
                if (particle.x < 0) particle.x = canvas.width;
                if (particle.x > canvas.width) particle.x = 0;
                if (particle.y < 0) particle.y = canvas.height;
                if (particle.y > canvas.height) particle.y = 0;

                // Respawn if life exceeded
                if (particle.life > particle.maxLife) {
                    particlesRef.current[index] = createParticle();
                    return;
                }

                // Calculate alpha based on life
                const lifeRatio = particle.life / particle.maxLife;
                const alpha = particle.alpha * (lifeRatio < 0.1 ? lifeRatio * 10 : lifeRatio > 0.9 ? (1 - lifeRatio) * 10 : 1);

                // Draw particle with glow
                ctx.save();
                ctx.globalAlpha = alpha;

                // Glow effect
                ctx.shadowBlur = 15;
                ctx.shadowColor = particle.color;

                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = particle.color;
                ctx.fill();

                ctx.restore();
            });

            // Draw connections between nearby particles
            ctx.strokeStyle = 'rgba(0, 255, 245, 0.05)';
            ctx.lineWidth = 0.5;

            for (let i = 0; i < particlesRef.current.length; i++) {
                for (let j = i + 1; j < particlesRef.current.length; j++) {
                    const p1 = particlesRef.current[i];
                    const p2 = particlesRef.current[j];
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 100) {
                        ctx.globalAlpha = (1 - dist / 100) * 0.3;
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            }

            animationRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            cancelAnimationFrame(animationRef.current);
        };
    }, [dimensions, createParticle]);

    return (
        <div className={`particles-container ${className}`}>
            {/* Gradient background */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'radial-gradient(ellipse at 50% 50%, #0f0f1a 0%, #030308 100%)'
                }}
            />

            {/* Canvas */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0"
                style={{ opacity: 0.8 }}
            />

            {/* Grid overlay */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: `
            linear-gradient(rgba(0, 255, 245, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 245, 0.03) 1px, transparent 1px)
          `,
                    backgroundSize: '50px 50px',
                    maskImage: 'linear-gradient(to bottom, transparent, black 30%, black 70%, transparent)'
                }}
            />
        </div>
    );
}
