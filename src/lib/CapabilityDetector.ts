'use client';

import { useState, useEffect } from 'react';

export interface DeviceCapabilities {
    webgpu: boolean;
    webgl2: boolean;
    webgl: boolean;
    performanceTier: 'ultra' | 'high' | 'medium' | 'low';
    touchSupport: boolean;
    audioContext: boolean;
    speechRecognition: boolean;
    speechSynthesis: boolean;
    deviceMemory: number | null;
    hardwareConcurrency: number;
    connectionType: string | null;
    prefersReducedMotion: boolean;
    isClient: boolean;
}

const defaultCapabilities: DeviceCapabilities = {
    webgpu: false,
    webgl2: false,
    webgl: false,
    performanceTier: 'medium',
    touchSupport: false,
    audioContext: false,
    speechRecognition: false,
    speechSynthesis: false,
    deviceMemory: null,
    hardwareConcurrency: 4,
    connectionType: null,
    prefersReducedMotion: false,
    isClient: false,
};

async function detectCapabilities(): Promise<DeviceCapabilities> {
    if (typeof window === 'undefined') {
        return defaultCapabilities;
    }

    // WebGPU detection
    let webgpu = false;
    try {
        if ('gpu' in navigator) {
            const adapter = await (navigator as Navigator & { gpu?: { requestAdapter: () => Promise<unknown> } }).gpu?.requestAdapter();
            webgpu = !!adapter;
        }
    } catch {
        webgpu = false;
    }

    // WebGL detection
    let webgl2 = false;
    let webgl = false;
    try {
        const canvas = document.createElement('canvas');
        webgl2 = !!canvas.getContext('webgl2');
        webgl = webgl2 || !!canvas.getContext('webgl') || !!canvas.getContext('experimental-webgl');
    } catch {
        webgl = false;
        webgl2 = false;
    }

    // Device memory (Chrome only)
    const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory || null;

    // Hardware concurrency
    const hardwareConcurrency = navigator.hardwareConcurrency || 4;

    // Connection type
    const connection = (navigator as Navigator & { connection?: { effectiveType?: string } }).connection;
    const connectionType = connection?.effectiveType || null;

    // Reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Calculate performance tier
    let performanceTier: DeviceCapabilities['performanceTier'] = 'medium';

    if (prefersReducedMotion) {
        performanceTier = 'low';
    } else if (webgpu && hardwareConcurrency >= 8 && (deviceMemory === null || deviceMemory >= 8)) {
        performanceTier = 'ultra';
    } else if (webgl2 && hardwareConcurrency >= 4 && (deviceMemory === null || deviceMemory >= 4)) {
        performanceTier = 'high';
    } else if (webgl && hardwareConcurrency >= 2) {
        performanceTier = 'medium';
    } else {
        performanceTier = 'low';
    }

    // Adjust for slow connections
    if (connectionType === 'slow-2g' || connectionType === '2g') {
        performanceTier = 'low';
    }

    return {
        webgpu,
        webgl2,
        webgl,
        performanceTier,
        touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
        audioContext: 'AudioContext' in window || 'webkitAudioContext' in window,
        speechRecognition: 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window,
        speechSynthesis: 'speechSynthesis' in window,
        deviceMemory,
        hardwareConcurrency,
        connectionType,
        prefersReducedMotion,
        isClient: true,
    };
}

export function useDeviceCapabilities(): DeviceCapabilities {
    const [capabilities, setCapabilities] = useState<DeviceCapabilities>(defaultCapabilities);

    useEffect(() => {
        detectCapabilities().then(setCapabilities);
    }, []);

    return capabilities;
}

// Export the detection function for non-hook usage
export { detectCapabilities };
