'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX, Loader2 } from 'lucide-react';

interface VoiceCommandProps {
    onCommand: (command: string, transcript: string) => void;
    onTranscript?: (transcript: string) => void;
    enabled?: boolean;
    commands?: Record<string, string[]>;
    language?: string;
}

// Default command mappings
const DEFAULT_COMMANDS: Record<string, string[]> = {
    'navigate_home': ['go home', 'home page', 'take me home', '回首页', '去首页'],
    'navigate_portfolio': ['show portfolio', 'portfolio', 'projects', 'my work', '作品集', '项目'],
    'navigate_blog': ['blog', 'articles', 'posts', '博客', '文章'],
    'navigate_contact': ['contact', 'reach out', 'get in touch', '联系', '联系我'],
    'navigate_resume': ['resume', 'cv', 'curriculum', '简历'],
    'toggle_theme': ['dark mode', 'light mode', 'toggle theme', 'switch theme', '切换主题', '深色模式', '浅色模式'],
    'scroll_up': ['scroll up', 'go up', '向上滚动'],
    'scroll_down': ['scroll down', 'go down', '向下滚动'],
    'stop': ['stop', 'cancel', 'nevermind', '停止', '取消'],
};

export default function VoiceCommand({
    onCommand,
    onTranscript,
    enabled = true,
    commands = DEFAULT_COMMANDS,
    language = 'en-US',
}: VoiceCommandProps) {
    const [isListening, setIsListening] = useState(false);
    const [isSupported, setIsSupported] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const recognitionRef = useRef<any>(null);

    // Check for browser support
    useEffect(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        setIsSupported(!!SpeechRecognition);
    }, []);

    // Initialize speech recognition
    useEffect(() => {
        if (!isSupported) return;

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();

        const recognition = recognitionRef.current;
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = language;

        recognition.onresult = (event: any) => {
            const results = Array.from(event.results);
            const transcript = results
                .map((result: any) => result[0].transcript)
                .join(' ')
                .toLowerCase()
                .trim();

            setTranscript(transcript);
            onTranscript?.(transcript);

            // Check for command matches
            const finalResult = event.results[event.results.length - 1];
            if (finalResult.isFinal) {
                processCommand(transcript);
            }
        };

        recognition.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
            if (event.error === 'not-allowed') {
                setIsListening(false);
            }
        };

        recognition.onend = () => {
            if (isListening) {
                // Restart if still meant to be listening
                try {
                    recognition.start();
                } catch (e) {
                    setIsListening(false);
                }
            }
        };

        return () => {
            recognition.stop();
        };
    }, [isSupported, language, isListening]);

    // Process command from transcript
    const processCommand = useCallback((text: string) => {
        setIsProcessing(true);

        // Find matching command
        for (const [command, phrases] of Object.entries(commands)) {
            for (const phrase of phrases) {
                if (text.includes(phrase.toLowerCase())) {
                    onCommand(command, text);
                    setIsProcessing(false);
                    return;
                }
            }
        }

        // No command matched, but we can still pass the transcript
        onCommand('unknown', text);
        setIsProcessing(false);
    }, [commands, onCommand]);

    // Toggle listening
    const toggleListening = useCallback(() => {
        if (!recognitionRef.current) return;

        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
            setTranscript('');
        } else {
            try {
                recognitionRef.current.start();
                setIsListening(true);
            } catch (e) {
                console.error('Failed to start recognition:', e);
            }
        }
    }, [isListening]);

    if (!enabled || !isSupported) {
        return null;
    }

    return (
        <div className="relative">
            {/* Voice Button */}
            <motion.button
                onClick={toggleListening}
                className={`relative p-3 rounded-full transition-all ${isListening
                        ? 'bg-[var(--neon-magenta)] text-white shadow-[0_0_20px_var(--neon-magenta)]'
                        : 'bg-[var(--glass-bg)] text-[var(--text-secondary)] hover:text-[var(--neon-cyan)] border border-[var(--glass-border)]'
                    }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title={isListening ? 'Stop listening' : 'Start voice command'}
            >
                {isListening ? (
                    <>
                        <Mic size={20} />
                        {/* Pulse animation */}
                        <motion.div
                            className="absolute inset-0 rounded-full bg-[var(--neon-magenta)]"
                            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        />
                    </>
                ) : (
                    <MicOff size={20} />
                )}
            </motion.button>

            {/* Transcript Display */}
            <AnimatePresence>
                {isListening && transcript && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.9 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-4 py-2 
              bg-[var(--void-deep)] border border-[var(--neon-magenta)] rounded-lg 
              text-sm text-[var(--text-primary)] whitespace-nowrap max-w-xs truncate
              shadow-[0_0_15px_var(--neon-magenta)]"
                    >
                        {isProcessing && <Loader2 className="inline w-4 h-4 mr-2 animate-spin" />}
                        {transcript}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Text-to-Speech utility
export function speak(text: string, options: SpeechSynthesisUtterance = {} as any) {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
        return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 0.8;

    // Try to get a good voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v =>
        v.lang.startsWith('en') && v.name.includes('Google')
    ) || voices.find(v => v.lang.startsWith('en')) || voices[0];

    if (preferredVoice) {
        utterance.voice = preferredVoice;
    }

    Object.assign(utterance, options);
    window.speechSynthesis.speak(utterance);
}

// Hook for using voice commands
export function useVoiceCommands(enabled: boolean = true) {
    const [isListening, setIsListening] = useState(false);
    const [lastCommand, setLastCommand] = useState<{ command: string; transcript: string } | null>(null);

    const handleCommand = useCallback((command: string, transcript: string) => {
        setLastCommand({ command, transcript });
    }, []);

    return {
        isListening,
        setIsListening,
        lastCommand,
        handleCommand,
        VoiceCommandComponent: enabled ? (
            <VoiceCommand
                enabled={enabled}
                onCommand={handleCommand}
                commands={DEFAULT_COMMANDS}
            />
        ) : null,
    };
}
