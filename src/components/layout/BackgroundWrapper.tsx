'use client';

import dynamic from 'next/dynamic';
import { useDeviceCapabilities } from '@/lib/CapabilityDetector';

// Dynamically load 3D components to avoid SSR issues
const ParticleUniverse = dynamic(
    () => import('@/components/engine/ParticleUniverse'),
    { ssr: false }
);

const CanvasFallback = dynamic(
    () => import('@/components/engine/CanvasFallback'),
    { ssr: false }
);

export default function BackgroundWrapper() {
    const capabilities = useDeviceCapabilities();

    // Show nothing during SSR
    if (!capabilities.isClient) {
        return (
            <div className="particles-container">
                <div className="absolute inset-0 bg-gradient-to-b from-[var(--void-deepest)] via-[var(--void-base)] to-[var(--void-deepest)]" />
            </div>
        );
    }

    // Use WebGL if available, otherwise fall back to Canvas 2D
    if (capabilities.webgl) {
        return <ParticleUniverse performanceTier={capabilities.performanceTier} />;
    }

    // Canvas 2D fallback for devices without WebGL
    return <CanvasFallback />;
}
