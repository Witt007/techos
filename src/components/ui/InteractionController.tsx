'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Hand, Activity, X, Settings, ChevronUp, ChevronDown, Volume2 } from 'lucide-react';
import { useTheme } from '@/components/providers/ThemeProvider';
import { useI18n } from '@/components/providers/I18nProvider';

interface InteractionControllerProps {
    enableVoice?: boolean;
    enableGestures?: boolean;
}

interface SpeechRecognitionErrorEvent extends Event {
    error: string;
    message: string;
}

interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start: () => void;
    stop: () => void;
    abort: () => void;
    onresult: (event: any) => void;
    onerror: (event: SpeechRecognitionErrorEvent) => void;
    onend: () => void;
}

// Voice command mappings
const VOICE_COMMANDS: Record<string, string[]> = {
    'navigate_home': ['go home', 'home page', 'home', '回首页', '去首页', '首页'],
    'navigate_portfolio': ['portfolio', 'projects', '作品集', '项目'],
    'navigate_blog': ['blog', 'articles', '博客', '文章'],
    'navigate_contact': ['contact', 'reach out', '联系', '联系我'],
    'navigate_resume': ['resume', 'cv', '简历'],
    'navigate_codelab': ['codelab', 'code lab', '代码库'],
    'navigate_products': ['products', '产品'],
    'toggle_theme': ['dark mode', 'light mode', 'toggle theme', 'switch theme', '切换主题', '深色模式', '浅色模式'],
    'scroll_up': ['scroll up', 'go up', '向上', '上滚'],
    'scroll_down': ['scroll down', 'go down', '向下', '下滚'],
    'scroll_top': ['scroll top', 'go to top', '回到顶部', '顶部'],
};

export default function InteractionController({
    enableVoice = true,
    enableGestures = true,
}: InteractionControllerProps) {
    const router = useRouter();
    const { toggleTheme } = useTheme();
    const { locale } = useI18n();

    const [isVoiceActive, setIsVoiceActive] = useState(false);
    const [isGesturesEnabled, setIsGesturesEnabled] = useState(true);
    const [showPanel, setShowPanel] = useState(false);
    const [lastAction, setLastAction] = useState<string | null>(null);
    const [voiceSupported, setVoiceSupported] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [mounted, setMounted] = useState(false);

    const recognitionRef = useRef<SpeechRecognition | null>(null);

    // Mouse gesture tracking
    const gestureStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

    useEffect(() => {
        setMounted(true);
        // Check for speech recognition support
        // Check for speech recognition support
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        setVoiceSupported(!!SpeechRecognition);

        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = true;
            recognition.lang = locale === 'zh' ? 'zh-CN' : 'en-US';
            recognitionRef.current = recognition;
        }
    }, [locale]);

    // Process voice command
    const processVoiceCommand = useCallback((text: string) => {
        const lowerText = text.toLowerCase();

        for (const [command, phrases] of Object.entries(VOICE_COMMANDS)) {
            for (const phrase of phrases) {
                if (lowerText.includes(phrase.toLowerCase())) {
                    return command;
                }
            }
        }
        return null;
    }, []);

    // Execute command
    const executeCommand = useCallback((command: string) => {
        setLastAction(`🎤 ${command.replace('_', ' ')}`);
        setTimeout(() => setLastAction(null), 2000);

        switch (command) {
            case 'navigate_home':
                router.push('/');
                break;
            case 'navigate_portfolio':
                router.push('/portfolio');
                break;
            case 'navigate_blog':
                router.push('/blog');
                break;
            case 'navigate_contact':
                router.push('/contact');
                break;
            case 'navigate_resume':
                router.push('/resume');
                break;
            case 'navigate_codelab':
                router.push('/codelab');
                break;
            case 'navigate_products':
                router.push('/products');
                break;
            case 'toggle_theme':
                toggleTheme();
                break;
            case 'scroll_up':
                window.scrollBy({ top: -400, behavior: 'smooth' });
                break;
            case 'scroll_down':
                window.scrollBy({ top: 400, behavior: 'smooth' });
                break;
            case 'scroll_top':
                window.scrollTo({ top: 0, behavior: 'smooth' });
                break;
        }
    }, [router, toggleTheme]);

    // Start voice recognition
    const startVoiceRecognition = useCallback(() => {
        if (!recognitionRef.current) return;

        setIsVoiceActive(true);
        setTranscript('');

        recognitionRef.current.onresult = (event: any) => {
            const result = event.results[event.results.length - 1];
            const text = result[0].transcript;
            setTranscript(text);

            if (result.isFinal) {
                const command = processVoiceCommand(text);
                if (command) {
                    executeCommand(command);
                } else {
                    setLastAction(locale === 'zh' ? '未识别命令' : 'Command not recognized');
                    setTimeout(() => setLastAction(null), 2000);
                }
                setIsVoiceActive(false);
            }
        };

        recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
            console.error('Speech recognition error:', event.error);
            setIsVoiceActive(false);
            if (event.error === 'not-allowed') {
                setLastAction(locale === 'zh' ? '请允许麦克风访问' : 'Please allow microphone access');
                setTimeout(() => setLastAction(null), 3000);
            }
        };

        recognitionRef.current.onend = () => {
            setIsVoiceActive(false);
        };

        try {
            recognitionRef.current.start();
        } catch (e) {
            console.error('Failed to start speech recognition:', e);
            setIsVoiceActive(false);
        }
    }, [processVoiceCommand, executeCommand, locale]);

    // Stop voice recognition
    const stopVoiceRecognition = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        setIsVoiceActive(false);
    }, []);

    // Mouse gesture handlers (for desktop)
    useEffect(() => {
        if (!enableGestures || !isGesturesEnabled || !mounted) return;

        const handleMouseDown = (e: MouseEvent) => {
            // Only track if holding right mouse button or middle button
            if (e.button === 2 || e.button === 1) {
                gestureStartRef.current = { x: e.clientX, y: e.clientY, time: Date.now() };
            }
        };

        const handleMouseUp = (e: MouseEvent) => {
            if (!gestureStartRef.current) return;
            if (e.button !== 2 && e.button !== 1) return;

            const dx = e.clientX - gestureStartRef.current.x;
            const dy = e.clientY - gestureStartRef.current.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const duration = Date.now() - gestureStartRef.current.time;

            if (distance > 100 && duration < 1000) {
                let gesture = '';
                if (Math.abs(dx) > Math.abs(dy)) {
                    gesture = dx > 0 ? 'swipe_right' : 'swipe_left';
                } else {
                    gesture = dy > 0 ? 'swipe_down' : 'swipe_up';
                }

                handleGesture(gesture);
            }

            gestureStartRef.current = null;
        };

        // Prevent context menu on right-click drag
        const handleContextMenu = (e: MouseEvent) => {
            if (gestureStartRef.current) {
                e.preventDefault();
            }
        };

        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('contextmenu', handleContextMenu);

        return () => {
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('contextmenu', handleContextMenu);
        };
    }, [enableGestures, isGesturesEnabled, mounted]);

    // Touch gesture handlers (for mobile)
    useEffect(() => {
        if (!enableGestures || !isGesturesEnabled || !mounted) return;

        let touchStart: { x: number; y: number; time: number } | null = null;

        const handleTouchStart = (e: TouchEvent) => {
            const touch = e.touches[0];
            touchStart = { x: touch.clientX, y: touch.clientY, time: Date.now() };
        };

        const handleTouchEnd = (e: TouchEvent) => {
            if (!touchStart) return;

            const touch = e.changedTouches[0];
            const dx = touch.clientX - touchStart.x;
            const dy = touch.clientY - touchStart.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const duration = Date.now() - touchStart.time;

            if (distance > 80 && duration < 500) {
                let gesture = '';
                if (Math.abs(dx) > Math.abs(dy)) {
                    gesture = dx > 0 ? 'swipe_right' : 'swipe_left';
                } else {
                    gesture = dy > 0 ? 'swipe_down' : 'swipe_up';
                }

                handleGesture(gesture);
            }

            touchStart = null;
        };

        document.addEventListener('touchstart', handleTouchStart, { passive: true });
        document.addEventListener('touchend', handleTouchEnd, { passive: true });

        return () => {
            document.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('touchend', handleTouchEnd);
        };
    }, [enableGestures, isGesturesEnabled, mounted]);

    const handleGesture = useCallback((gesture: string) => {
        setLastAction(`👆 ${gesture.replace('_', ' ')}`);
        setTimeout(() => setLastAction(null), 2000);

        switch (gesture) {
            case 'swipe_right':
                window.history.back();
                break;
            case 'swipe_left':
                window.history.forward();
                break;
            case 'swipe_up':
                window.scrollBy({ top: -window.innerHeight / 2, behavior: 'smooth' });
                break;
            case 'swipe_down':
                window.scrollBy({ top: window.innerHeight / 2, behavior: 'smooth' });
                break;
        }
    }, []);

    if (!mounted) return null;

    return (
        <>
            {/* Floating Control Button */}
            <motion.button
                onClick={() => setShowPanel(prev => !prev)}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full 
                    bg-gradient-to-br from-[var(--neon-cyan)] to-[var(--neon-magenta)]
                    text-white shadow-lg shadow-[var(--neon-cyan)]/30
                    flex items-center justify-center print:hidden"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title={locale === 'zh' ? '交互控制' : 'Interaction Controls'}
            >
                {showPanel ? <X size={24} /> : <Settings size={24} />}
            </motion.button>

            {/* Voice Listening Indicator */}
            <AnimatePresence>
                {isVoiceActive && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100]
                            flex flex-col items-center gap-4 p-8 rounded-2xl
                            bg-[var(--void-deep)]/95 border border-[var(--neon-magenta)]
                            shadow-[0_0_40px_var(--neon-magenta)]"
                    >
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="w-20 h-20 rounded-full bg-[var(--neon-magenta)] flex items-center justify-center"
                        >
                            <Mic size={32} className="text-white" />
                        </motion.div>
                        <p className="text-[var(--text-primary)] font-medium">
                            {locale === 'zh' ? '正在聆听...' : 'Listening...'}
                        </p>
                        {transcript && (
                            <p className="text-[var(--neon-cyan)] text-sm max-w-xs text-center">
                                "{transcript}"
                            </p>
                        )}
                        <button
                            onClick={stopVoiceRecognition}
                            className="px-4 py-2 rounded-lg bg-[var(--void-light)] text-[var(--text-secondary)]
                                hover:text-[var(--neon-cyan)] transition-colors text-sm"
                        >
                            {locale === 'zh' ? '取消' : 'Cancel'}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Control Panel */}
            <AnimatePresence>
                {showPanel && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="fixed bottom-24 right-6 z-50 w-80 p-4 
                            bg-[var(--void-deep)] border border-[var(--glass-border)]
                            rounded-xl shadow-2xl print:hidden"
                    >
                        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                            <Activity size={16} className="text-[var(--neon-cyan)]" />
                            {locale === 'zh' ? '交互控制' : 'Interaction Controls'}
                        </h3>

                        {/* Voice Control */}
                        {enableVoice && voiceSupported && (
                            <div className="mb-4 p-3 rounded-lg bg-[var(--void-light)]">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm text-[var(--text-primary)] flex items-center gap-2 font-medium">
                                        <Mic size={16} className="text-[var(--neon-magenta)]" />
                                        {locale === 'zh' ? '语音命令' : 'Voice Commands'}
                                    </span>
                                    <motion.button
                                        onClick={isVoiceActive ? stopVoiceRecognition : startVoiceRecognition}
                                        className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${isVoiceActive
                                            ? 'bg-[var(--neon-magenta)] text-white'
                                            : 'bg-[var(--neon-cyan)] text-[var(--void-deepest)]'
                                            }`}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {isVoiceActive ? <MicOff size={16} /> : <Mic size={16} />}
                                        {isVoiceActive
                                            ? (locale === 'zh' ? '停止' : 'Stop')
                                            : (locale === 'zh' ? '开始听写' : 'Start')}
                                    </motion.button>
                                </div>
                                <div className="text-xs text-[var(--text-muted)] space-y-1">
                                    <p>• {locale === 'zh' ? '"作品集" / "博客" / "联系"' : '"portfolio" / "blog" / "contact"'}</p>
                                    <p>• {locale === 'zh' ? '"切换主题" / "向上" / "向下"' : '"toggle theme" / "scroll up" / "down"'}</p>
                                </div>
                            </div>
                        )}

                        {/* Gesture Control */}
                        {enableGestures && (
                            <div className="mb-4 p-3 rounded-lg bg-[var(--void-light)]">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm text-[var(--text-primary)] flex items-center gap-2 font-medium">
                                        <Hand size={16} className="text-[var(--neon-cyan)]" />
                                        {locale === 'zh' ? '手势控制' : 'Gesture Control'}
                                    </span>
                                    <button
                                        onClick={() => setIsGesturesEnabled(prev => !prev)}
                                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${isGesturesEnabled
                                            ? 'bg-[var(--neon-cyan)] text-[var(--void-deepest)]'
                                            : 'bg-[var(--void-base)] text-[var(--text-muted)]'
                                            }`}
                                    >
                                        {isGesturesEnabled
                                            ? (locale === 'zh' ? '已开启' : 'ON')
                                            : (locale === 'zh' ? '已关闭' : 'OFF')}
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs text-[var(--text-muted)]">
                                    <div className="flex items-center gap-1">
                                        <ChevronUp size={12} /> {locale === 'zh' ? '上滑: 滚动上' : 'Swipe ↑: Scroll up'}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <ChevronDown size={12} /> {locale === 'zh' ? '下滑: 滚动下' : 'Swipe ↓: Scroll down'}
                                    </div>
                                    <div>← {locale === 'zh' ? '左滑: 返回' : 'Swipe: Back'}</div>
                                    <div>→ {locale === 'zh' ? '右滑: 前进' : 'Swipe: Forward'}</div>
                                </div>
                                <p className="text-xs text-[var(--text-muted)] mt-2 opacity-70">
                                    {locale === 'zh'
                                        ? '💡 桌面端: 按住右键拖动'
                                        : '💡 Desktop: Hold right-click and drag'}
                                </p>
                            </div>
                        )}

                        {/* Quick Actions */}
                        <div className="pt-3 border-t border-[var(--glass-border)]">
                            <p className="text-xs text-[var(--text-muted)] mb-2">
                                {locale === 'zh' ? '快捷操作' : 'Quick Actions'}
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                    className="flex-1 py-2 px-3 rounded-lg bg-[var(--void-light)] 
                                        text-xs text-[var(--text-secondary)] hover:text-[var(--neon-cyan)] 
                                        hover:bg-[var(--void-lighter)] transition-colors"
                                >
                                    {locale === 'zh' ? '返回顶部' : 'Scroll Top'}
                                </button>
                                <button
                                    onClick={toggleTheme}
                                    className="flex-1 py-2 px-3 rounded-lg bg-[var(--void-light)] 
                                        text-xs text-[var(--text-secondary)] hover:text-[var(--neon-cyan)] 
                                        hover:bg-[var(--void-lighter)] transition-colors"
                                >
                                    {locale === 'zh' ? '切换主题' : 'Toggle Theme'}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Action Feedback Toast */}
            <AnimatePresence>
                {lastAction && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60]
                            px-6 py-3 rounded-full bg-[var(--void-deep)] 
                            border border-[var(--neon-cyan)] text-[var(--neon-cyan)]
                            text-sm font-mono shadow-[0_0_20px_var(--neon-cyan)]"
                    >
                        {lastAction}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
