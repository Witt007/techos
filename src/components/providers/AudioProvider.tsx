'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Play, Pause, SkipForward, User, Mic } from 'lucide-react';
import { useI18n } from './I18nProvider';
import { profile } from '@/data/profile';

interface AudioContextType {
    isEnabled: boolean;
    isMuted: boolean;
    isPlaying: boolean;
    isIntroPlaying: boolean;
    toggleEnabled: () => void;
    toggleMute: () => void;
    playIntroduction: () => void;
    stopIntroduction: () => void;
    playSound: (type: 'click' | 'hover' | 'success' | 'error') => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function useAudio() {
    const context = useContext(AudioContext);
    if (!context) {
        throw new Error('useAudio must be used within AudioProvider');
    }
    return context;
}

// AI Avatar introduction text
const introductions = {
    en: `Welcome to NexusForge. I'm ${profile.name.en}, a Creative Engineer and Full-Stack Developer based in ${profile.contact.location.en}. 
    I specialize in Digital Twin technology, GIS visualization, and AI-powered applications. 
    My passion lies at the intersection of art and technology, where I craft immersive digital experiences.
    Feel free to explore my portfolio, check out my open-source projects, or get in touch if you'd like to collaborate.
    Thank you for visiting!`,
    zh: `欢迎来到 NexusForge。我是${profile.name.zh}，一名来自${profile.contact.location.zh}的创意工程师和全栈开发者。
    我专注于数字孪生技术、GIS可视化和人工智能应用开发。
    我的热情在于艺术与科技的交汇点，在这里我创造沉浸式的数字体验。
    欢迎浏览我的作品集、查看我的开源项目，如果您想合作，请随时联系我。
    感谢您的访问！`
};

export function AudioProvider({ children }: { children: ReactNode }) {
    const [isEnabled, setIsEnabled] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isIntroPlaying, setIsIntroPlaying] = useState(false);
    const [showAvatar, setShowAvatar] = useState(false);
    const [currentText, setCurrentText] = useState('');
    const [mounted, setMounted] = useState(false);

    const { locale } = useI18n();
    const audioContextRef = useRef<AudioContext | null>(null);
    const synthRef = useRef<SpeechSynthesis | null>(null);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
    const bgMusicRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        setMounted(true);

        // Initialize Web Audio API
        if (typeof window !== 'undefined') {
            synthRef.current = window.speechSynthesis;
        }

        return () => {
            if (synthRef.current) {
                synthRef.current.cancel();
            }
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, []);

    // Generate and play ambient background sound
    const startBackgroundAudio = useCallback(() => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }

        const ctx = audioContextRef.current;
        if (ctx.state === 'suspended') {
            ctx.resume();
        }

        // Create ambient drone sound
        const createDrone = (freq: number, gainVal: number) => {
            const osc = ctx.createOscillator();
            const gainNode = ctx.createGain();
            const filter = ctx.createBiquadFilter();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(800, ctx.currentTime);

            gainNode.gain.setValueAtTime(0, ctx.currentTime);
            gainNode.gain.linearRampToValueAtTime(gainVal * 0.05, ctx.currentTime + 2);

            osc.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(ctx.destination);

            osc.start();

            return { osc, gainNode };
        };

        // Create layered ambient sound
        const drones = [
            createDrone(55, 0.3),   // Low bass
            createDrone(110, 0.2),  // Bass
            createDrone(165, 0.1),  // Low mid
        ];

        setIsPlaying(true);

        return () => {
            drones.forEach(({ osc, gainNode }) => {
                try {
                    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
                    setTimeout(() => osc.stop(), 1000);
                } catch (e) {
                    // Ignore errors on cleanup
                }
            });
        };
    }, []);

    // Toggle audio enabled
    const toggleEnabled = useCallback(() => {
        setIsEnabled(prev => {
            const newState = !prev;
            if (newState) {
                startBackgroundAudio();
            } else {
                setIsPlaying(false);
                if (audioContextRef.current) {
                    audioContextRef.current.suspend();
                }
            }
            return newState;
        });
    }, [startBackgroundAudio]);

    // Toggle mute
    const toggleMute = useCallback(() => {
        setIsMuted(prev => {
            const newMuted = !prev;
            if (audioContextRef.current) {
                if (newMuted) {
                    audioContextRef.current.suspend();
                } else {
                    audioContextRef.current.resume();
                }
            }
            return newMuted;
        });
    }, []);

    // Play AI introduction
    const playIntroduction = useCallback(() => {
        if (!synthRef.current || isIntroPlaying) return;

        const text = locale === 'zh' ? introductions.zh : introductions.en;
        const utterance = new SpeechSynthesisUtterance(text);

        // Get voices and select appropriate one
        const voices = synthRef.current.getVoices();
        let selectedVoice = null;

        if (locale === 'zh') {
            selectedVoice = voices.find(v => v.lang.includes('zh')) ||
                voices.find(v => v.lang.includes('cmn'));
        } else {
            selectedVoice = voices.find(v => v.lang.includes('en') && v.name.includes('Google')) ||
                voices.find(v => v.lang.includes('en-US')) ||
                voices.find(v => v.lang.includes('en'));
        }

        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }

        utterance.rate = 0.95;
        utterance.pitch = 1.0;
        utterance.volume = isMuted ? 0 : 0.9;

        utterance.onstart = () => {
            setIsIntroPlaying(true);
            setShowAvatar(true);
        };

        utterance.onboundary = (event) => {
            // Update current text being spoken for visual feedback
            const words = text.split(/\s+/);
            // Simple approximation for demo purposes
            const charIndex = event.charIndex;
            const approximateWordIndex = Math.floor(charIndex / 5);
            const snippet = words.slice(Math.max(0, approximateWordIndex - 2), approximateWordIndex + 8).join(' ');
            setCurrentText(snippet || '...');
        };

        utterance.onend = () => {
            setIsIntroPlaying(false);
            setTimeout(() => setShowAvatar(false), 1000);
        };

        utterance.onerror = () => {
            setIsIntroPlaying(false);
            setShowAvatar(false);
        };

        utteranceRef.current = utterance;
        synthRef.current.speak(utterance);
    }, [locale, isMuted, isIntroPlaying]);

    // Stop introduction
    const stopIntroduction = useCallback(() => {
        if (synthRef.current) {
            synthRef.current.cancel();
        }
        setIsIntroPlaying(false);
        setShowAvatar(false);
    }, []);

    // Play UI sounds
    const playSound = useCallback((type: 'click' | 'hover' | 'success' | 'error') => {
        if (!isEnabled || isMuted) return;

        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }

        const ctx = audioContextRef.current;
        if (ctx.state === 'suspended') {
            ctx.resume();
        }

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        switch (type) {
            case 'click':
                osc.frequency.setValueAtTime(880, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.1);
                gain.gain.setValueAtTime(0.1, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
                osc.start();
                osc.stop(ctx.currentTime + 0.1);
                break;
            case 'hover':
                osc.frequency.setValueAtTime(660, ctx.currentTime);
                gain.gain.setValueAtTime(0.03, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
                osc.start();
                osc.stop(ctx.currentTime + 0.05);
                break;
            case 'success':
                osc.frequency.setValueAtTime(523, ctx.currentTime);
                osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1);
                osc.frequency.setValueAtTime(784, ctx.currentTime + 0.2);
                gain.gain.setValueAtTime(0.1, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
                osc.start();
                osc.stop(ctx.currentTime + 0.3);
                break;
            case 'error':
                osc.frequency.setValueAtTime(200, ctx.currentTime);
                osc.frequency.setValueAtTime(150, ctx.currentTime + 0.1);
                gain.gain.setValueAtTime(0.1, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
                osc.start();
                osc.stop(ctx.currentTime + 0.2);
                break;
        }
    }, [isEnabled, isMuted]);

    return (
        <AudioContext.Provider
            value={{
                isEnabled,
                isMuted,
                isPlaying,
                isIntroPlaying,
                toggleEnabled,
                toggleMute,
                playIntroduction,
                stopIntroduction,
                playSound,
            }}
        >
            {children}

            {/* AI Avatar Overlay */}
            <AnimatePresence>
                {mounted && showAvatar && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center bg-[var(--void-deepest)]/80 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.8, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.8, y: 50 }}
                            className="relative max-w-2xl w-full mx-4 p-8 rounded-2xl 
                                bg-gradient-to-br from-[var(--void-deep)] to-[var(--void-base)]
                                border border-[var(--glass-border)]"
                        >
                            {/* Close button */}
                            <button
                                onClick={stopIntroduction}
                                className="absolute top-4 right-4 p-2 rounded-lg text-[var(--text-muted)] 
                                    hover:text-[var(--neon-cyan)] hover:bg-[var(--void-light)] transition-colors"
                            >
                                <SkipForward size={20} />
                            </button>

                            {/* Avatar */}
                            <div className="flex flex-col items-center gap-6">
                                {/* Animated Avatar Circle */}
                                <div className="relative">
                                    <motion.div
                                        className="w-32 h-32 rounded-full bg-gradient-to-br from-[var(--neon-cyan)] to-[var(--neon-magenta)] p-1"
                                        animate={{
                                            boxShadow: isIntroPlaying
                                                ? ['0 0 20px var(--neon-cyan)', '0 0 40px var(--neon-magenta)', '0 0 20px var(--neon-cyan)']
                                                : '0 0 20px var(--neon-cyan)'
                                        }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                    >
                                        <div className="w-full h-full rounded-full bg-[var(--void-deep)] flex items-center justify-center">
                                            <User size={48} className="text-[var(--neon-cyan)]" />
                                        </div>
                                    </motion.div>

                                    {/* Speaking indicator */}
                                    {isIntroPlaying && (
                                        <motion.div
                                            className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-1"
                                        >
                                            {[0, 1, 2, 3, 4].map((i) => (
                                                <motion.div
                                                    key={i}
                                                    className="w-1 bg-[var(--neon-cyan)] rounded-full"
                                                    animate={{
                                                        height: [4, 16, 4],
                                                    }}
                                                    transition={{
                                                        duration: 0.5,
                                                        repeat: Infinity,
                                                        delay: i * 0.1,
                                                    }}
                                                />
                                            ))}
                                        </motion.div>
                                    )}
                                </div>

                                {/* Name */}
                                <div className="text-center">
                                    <h3 className="text-xl font-bold font-[family-name:var(--font-display)] text-[var(--text-primary)]">
                                        {locale === 'zh' ? profile.name.zh : profile.name.en}
                                    </h3>
                                    <p className="text-sm text-[var(--text-muted)]">
                                        {locale === 'zh' ? 'AI 虚拟助手' : 'AI Virtual Assistant'}
                                    </p>
                                </div>

                                {/* Current text being spoken */}
                                <motion.div
                                    key={currentText}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="min-h-[60px] text-center px-4"
                                >
                                    <p className="text-[var(--text-secondary)] leading-relaxed">
                                        {currentText || (locale === 'zh' ? '正在准备...' : 'Preparing...')}
                                    </p>
                                </motion.div>

                                {/* Progress indicator */}
                                <div className="w-full max-w-xs h-1 bg-[var(--void-light)] rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-magenta)]"
                                        initial={{ width: '0%' }}
                                        animate={{ width: isIntroPlaying ? '100%' : '0%' }}
                                        transition={{ duration: 30, ease: 'linear' }}
                                    />
                                </div>

                                {/* Controls */}
                                <div className="flex gap-4">
                                    <button
                                        onClick={stopIntroduction}
                                        className="px-6 py-2 rounded-lg bg-[var(--void-light)] text-[var(--text-secondary)]
                                            hover:text-[var(--neon-cyan)] transition-colors text-sm"
                                    >
                                        {locale === 'zh' ? '跳过介绍' : 'Skip Introduction'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </AudioContext.Provider>
    );
}

// Audio Control Button Component
export function AudioControlButton() {
    const { isEnabled, isMuted, isIntroPlaying, toggleEnabled, toggleMute, playIntroduction, stopIntroduction } = useAudio();
    const { locale } = useI18n();
    const [showMenu, setShowMenu] = useState(false);

    return (
        <div className="relative">
            <motion.button
                onClick={() => setShowMenu(prev => !prev)}
                className={`p-2 rounded-lg transition-colors ${isEnabled
                    ? 'text-[var(--neon-cyan)] bg-[var(--neon-cyan)]/10'
                    : 'text-[var(--text-secondary)] hover:text-[var(--neon-cyan)] hover:bg-[var(--surface)]'
                    }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                title={locale === 'zh' ? '音频控制' : 'Audio Controls'}
            >
                {isEnabled ? (isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />) : <VolumeX size={20} />}
            </motion.button>

            <AnimatePresence>
                {showMenu && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full right-0 mt-2 w-56 p-3 rounded-xl
                            bg-[var(--void-deep)] border border-[var(--glass-border)]
                            shadow-xl z-50"
                    >
                        {/* Enable/Disable Audio */}
                        <button
                            onClick={() => { toggleEnabled(); }}
                            className="w-full flex items-center gap-3 p-2 rounded-lg
                                text-[var(--text-secondary)] hover:text-[var(--text-primary)]
                                hover:bg-[var(--void-light)] transition-colors text-left"
                        >
                            {isEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                            <span className="text-sm">
                                {isEnabled
                                    ? (locale === 'zh' ? '关闭音效' : 'Disable Audio')
                                    : (locale === 'zh' ? '开启音效' : 'Enable Audio')}
                            </span>
                        </button>

                        {/* Mute/Unmute */}
                        {isEnabled && (
                            <button
                                onClick={toggleMute}
                                className="w-full flex items-center gap-3 p-2 rounded-lg
                                    text-[var(--text-secondary)] hover:text-[var(--text-primary)]
                                    hover:bg-[var(--void-light)] transition-colors text-left"
                            >
                                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                                <span className="text-sm">
                                    {isMuted
                                        ? (locale === 'zh' ? '取消静音' : 'Unmute')
                                        : (locale === 'zh' ? '静音' : 'Mute')}
                                </span>
                            </button>
                        )}

                        <div className="my-2 border-t border-[var(--glass-border)]" />

                        {/* AI Introduction */}
                        <button
                            onClick={() => {
                                if (isIntroPlaying) {
                                    stopIntroduction();
                                } else {
                                    playIntroduction();
                                }
                                setShowMenu(false);
                            }}
                            className="w-full flex items-center gap-3 p-2 rounded-lg
                                text-[var(--text-secondary)] hover:text-[var(--neon-magenta)]
                                hover:bg-[var(--void-light)] transition-colors text-left"
                        >
                            {isIntroPlaying ? <Pause size={18} /> : <Play size={18} />}
                            <div>
                                <span className="text-sm block">
                                    {isIntroPlaying
                                        ? (locale === 'zh' ? '停止介绍' : 'Stop Introduction')
                                        : (locale === 'zh' ? 'AI 自我介绍' : 'AI Introduction')}
                                </span>
                                <span className="text-xs text-[var(--text-muted)]">
                                    {locale === 'zh' ? '数字人语音播报' : 'Digital Avatar Speech'}
                                </span>
                            </div>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Click outside to close */}
            {showMenu && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowMenu(false)}
                />
            )}
        </div>
    );
}
