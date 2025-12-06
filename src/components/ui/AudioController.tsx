'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Play, Pause, SkipForward, Music } from 'lucide-react';

interface AudioControllerProps {
    className?: string;
}

// Cyberpunk ambient tracks (would be actual URLs in production)
const AMBIENT_TRACKS = [
    { name: 'Neon Dreams', src: '/audio/ambient-1.mp3' },
    { name: 'Digital Rain', src: '/audio/ambient-2.mp3' },
    { name: 'Cyber City', src: '/audio/ambient-3.mp3' },
];

// UI Sound effects
const UI_SOUNDS = {
    click: '/audio/click.mp3',
    hover: '/audio/hover.mp3',
    success: '/audio/success.mp3',
    error: '/audio/error.mp3',
    notification: '/audio/notification.mp3',
};

export default function AudioController({ className = '' }: AudioControllerProps) {
    const [isEnabled, setIsEnabled] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState(0);
    const [volume, setVolume] = useState(0.3);
    const [showControls, setShowControls] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Initialize audio element
    useEffect(() => {
        if (typeof window === 'undefined') return;

        audioRef.current = new Audio();
        audioRef.current.loop = true;
        audioRef.current.volume = volume;

        return () => {
            audioRef.current?.pause();
            audioRef.current = null;
        };
    }, []);

    // Update volume
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    // Toggle playback
    const togglePlay = useCallback(() => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            // In production, load actual audio file
            // For demo, we'll just toggle the state
            setIsPlaying(true);
            setIsEnabled(true);
        }
    }, [isPlaying]);

    // Next track
    const nextTrack = useCallback(() => {
        setCurrentTrack((prev) => (prev + 1) % AMBIENT_TRACKS.length);
        if (isPlaying && audioRef.current) {
            audioRef.current.src = AMBIENT_TRACKS[(currentTrack + 1) % AMBIENT_TRACKS.length].src;
            audioRef.current.play().catch(() => { });
        }
    }, [currentTrack, isPlaying]);

    // Toggle mute
    const toggleMute = useCallback(() => {
        setIsEnabled(!isEnabled);
        if (audioRef.current) {
            audioRef.current.muted = isEnabled;
        }
    }, [isEnabled]);

    return (
        <div className={`relative ${className}`}>
            {/* Main Toggle Button */}
            <motion.button
                onClick={() => setShowControls(!showControls)}
                className={`p-3 rounded-full transition-all ${isEnabled
                        ? 'bg-[var(--neon-cyan)]/20 text-[var(--neon-cyan)] border border-[var(--neon-cyan)]/50'
                        : 'bg-[var(--glass-bg)] text-[var(--text-muted)] border border-[var(--glass-border)]'
                    }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Audio controls"
            >
                {isEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}

                {/* Active indicator */}
                {isPlaying && (
                    <motion.div
                        className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[var(--neon-green)]"
                        animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                    />
                )}
            </motion.button>

            {/* Expanded Controls */}
            <AnimatePresence>
                {showControls && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        className="absolute right-0 top-full mt-2 p-4 rounded-xl 
              bg-[var(--void-deep)] border border-[var(--glass-border)]
              shadow-xl min-w-[200px] z-50"
                    >
                        {/* Track info */}
                        <div className="flex items-center gap-2 mb-4">
                            <Music size={16} className="text-[var(--neon-cyan)]" />
                            <span className="text-sm text-[var(--text-primary)]">
                                {AMBIENT_TRACKS[currentTrack].name}
                            </span>
                        </div>

                        {/* Playback controls */}
                        <div className="flex items-center justify-center gap-4 mb-4">
                            <button
                                onClick={toggleMute}
                                className="p-2 rounded-lg bg-[var(--void-light)] text-[var(--text-secondary)] 
                  hover:text-[var(--neon-cyan)] transition-colors"
                            >
                                {isEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                            </button>

                            <motion.button
                                onClick={togglePlay}
                                className="p-3 rounded-full bg-[var(--neon-cyan)] text-[var(--void-deepest)]"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                            </motion.button>

                            <button
                                onClick={nextTrack}
                                className="p-2 rounded-lg bg-[var(--void-light)] text-[var(--text-secondary)] 
                  hover:text-[var(--neon-cyan)] transition-colors"
                            >
                                <SkipForward size={18} />
                            </button>
                        </div>

                        {/* Volume slider */}
                        <div className="flex items-center gap-2">
                            <VolumeX size={14} className="text-[var(--text-muted)]" />
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={volume}
                                onChange={(e) => setVolume(parseFloat(e.target.value))}
                                className="flex-1 h-1 bg-[var(--void-light)] rounded-full appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 
                  [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full 
                  [&::-webkit-slider-thumb]:bg-[var(--neon-cyan)]"
                            />
                            <Volume2 size={14} className="text-[var(--text-muted)]" />
                        </div>

                        {/* Info text */}
                        <p className="text-xs text-[var(--text-muted)] text-center mt-4">
                            Background ambience (demo mode)
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// UI Sound Effect Player
class UISoundPlayer {
    private sounds: Map<string, HTMLAudioElement> = new Map();
    private enabled: boolean = false;
    private volume: number = 0.3;

    constructor() {
        if (typeof window === 'undefined') return;

        // Preload sounds
        Object.entries(UI_SOUNDS).forEach(([name, src]) => {
            const audio = new Audio();
            audio.preload = 'auto';
            // In production, set audio.src = src
            this.sounds.set(name, audio);
        });
    }

    enable() {
        this.enabled = true;
    }

    disable() {
        this.enabled = false;
    }

    setVolume(vol: number) {
        this.volume = Math.max(0, Math.min(1, vol));
        this.sounds.forEach(audio => {
            audio.volume = this.volume;
        });
    }

    play(soundName: keyof typeof UI_SOUNDS) {
        if (!this.enabled) return;

        const audio = this.sounds.get(soundName);
        if (audio) {
            audio.currentTime = 0;
            audio.volume = this.volume;
            audio.play().catch(() => { });
        }
    }
}

// Export singleton
export const uiSounds = new UISoundPlayer();

// Hook for UI sounds
export function useUISounds() {
    const [enabled, setEnabled] = useState(false);

    useEffect(() => {
        if (enabled) {
            uiSounds.enable();
        } else {
            uiSounds.disable();
        }
    }, [enabled]);

    return {
        enabled,
        setEnabled,
        playSound: (name: keyof typeof UI_SOUNDS) => uiSounds.play(name),
    };
}
