'use client';

import { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useDeviceCapabilities } from '@/lib/CapabilityDetector';
import { useVisual } from '@/components/providers/VisualProvider';
import { useAudio } from '@/components/providers/AudioProvider';

import { ParticleUniverseScene } from '@/components/engine/ParticleUniverse';
import PortraitScene from '@/components/engine/Portrait3D';
import CanvasFallback from '@/components/engine/CanvasFallback';

export default function BackgroundWrapper() {
    const capabilities = useDeviceCapabilities();
    const { activeEffect } = useVisual();
    const { analyser } = useAudio();
    const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = {
                x: (e.clientX / window.innerWidth) * 2 - 1,
                y: -(e.clientY / window.innerHeight) * 2 + 1,
            };
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Show nothing during SSR
    if (!isClient || !capabilities.isClient) {
        return (
            <div className="particles-container">
                <div className="absolute inset-0 bg-gradient-to-b from-[var(--void-deepest)] via-[var(--void-base)] to-[var(--void-deepest)]" />
            </div>
        );
    }

    // Use WebGL if available, otherwise fall back to Canvas 2D
    if (capabilities.webgl) {
        return (
            <div className="fixed inset-0 z-0 flex items-center justify-center pointer-events-none">
                <div className="w-full h-full pointer-events-auto">
                    <Canvas
                        camera={{ position: [0, 0, 8], fov: 60 }}
                        dpr={[1, capabilities.performanceTier === 'ultra' ? 2 : 1.5]}
                        gl={{
                            antialias: capabilities.performanceTier !== 'low',
                            alpha: true,
                            powerPreference: 'high-performance'
                        }}
                        style={{ background: 'transparent' }}
                    >
                        <ambientLight intensity={0.5} />
                        <Suspense fallback={null}>
                            {activeEffect === 'portrait' ? (
                                <PortraitScene analyser={analyser} />
                            ) : (
                                <ParticleUniverseScene
                                    performanceTier={capabilities.performanceTier}
                                    mouseRef={mouseRef}
                                />
                            )}
                        </Suspense>
                    </Canvas>
                </div>
                {/* Keep a subtle background behind the portrait */}
                <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[var(--void-deepest)] via-[var(--void-base)] to-[var(--void-deepest)]" />
            </div>
        );
    }

    // Canvas 2D fallback for devices without WebGL
    return <CanvasFallback />;
}
