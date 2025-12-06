'use client';

import { useEffect, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Keyboard, Command } from 'lucide-react';
import { useTheme } from '@/components/providers/ThemeProvider';

interface KeyBinding {
    key: string;
    ctrl?: boolean;
    alt?: boolean;
    shift?: boolean;
    description: string;
    action: () => void;
}

interface KeyboardShortcutsProps {
    enabled?: boolean;
    additionalBindings?: KeyBinding[];
}

export default function KeyboardShortcuts({
    enabled = true,
    additionalBindings = [],
}: KeyboardShortcutsProps) {
    const router = useRouter();
    const { toggleTheme } = useTheme();
    const [showHelp, setShowHelp] = useState(false);

    // Default key bindings
    const defaultBindings: KeyBinding[] = [
        { key: 'h', alt: true, description: 'Go to Home', action: () => router.push('/') },
        { key: 'p', alt: true, description: 'Go to Portfolio', action: () => router.push('/portfolio') },
        { key: 'b', alt: true, description: 'Go to Blog', action: () => router.push('/blog') },
        { key: 'c', alt: true, description: 'Go to Contact', action: () => router.push('/contact') },
        { key: 'r', alt: true, description: 'Go to Resume', action: () => router.push('/resume') },
        { key: 't', alt: true, description: 'Toggle Theme', action: toggleTheme },
        { key: '/', ctrl: true, description: 'Show/Hide Shortcuts', action: () => setShowHelp(s => !s) },
        { key: 'Escape', description: 'Close Modal', action: () => setShowHelp(false) },
    ];

    const allBindings = [...defaultBindings, ...additionalBindings];

    // Handle keydown
    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (!enabled) return;

        // Don't trigger if typing in input
        if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
            return;
        }

        for (const binding of allBindings) {
            const ctrlMatch = binding.ctrl ? (event.ctrlKey || event.metaKey) : !event.ctrlKey && !event.metaKey;
            const altMatch = binding.alt ? event.altKey : !event.altKey;
            const shiftMatch = binding.shift ? event.shiftKey : !event.shiftKey;
            const keyMatch = event.key.toLowerCase() === binding.key.toLowerCase();

            if (ctrlMatch && altMatch && shiftMatch && keyMatch) {
                event.preventDefault();
                binding.action();
                break;
            }
        }
    }, [enabled, allBindings]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    return (
        <>
            {/* Keyboard Shortcuts Help Modal */}
            <AnimatePresence>
                {showHelp && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                    >
                        <div
                            className="absolute inset-0 bg-[var(--void-deepest)]/80 backdrop-blur-sm"
                            onClick={() => setShowHelp(false)}
                        />

                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="relative bg-[var(--void-deep)] border border-[var(--glass-border)] 
                rounded-2xl p-6 max-w-md w-full shadow-2xl"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 rounded-lg bg-[var(--neon-cyan)]/20">
                                    <Keyboard size={24} className="text-[var(--neon-cyan)]" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold font-[family-name:var(--font-display)]">
                                        Keyboard Shortcuts
                                    </h2>
                                    <p className="text-sm text-[var(--text-muted)]">
                                        Press these keys to navigate quickly
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                {allBindings.map((binding, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 rounded-lg 
                      bg-[var(--void-light)] hover:bg-[var(--void-lighter)] transition-colors"
                                    >
                                        <span className="text-[var(--text-secondary)]">
                                            {binding.description}
                                        </span>
                                        <div className="flex gap-1">
                                            {binding.ctrl && (
                                                <kbd className="px-2 py-1 rounded bg-[var(--void-base)] text-xs font-mono text-[var(--neon-cyan)]">
                                                    Ctrl
                                                </kbd>
                                            )}
                                            {binding.alt && (
                                                <kbd className="px-2 py-1 rounded bg-[var(--void-base)] text-xs font-mono text-[var(--neon-cyan)]">
                                                    Alt
                                                </kbd>
                                            )}
                                            {binding.shift && (
                                                <kbd className="px-2 py-1 rounded bg-[var(--void-base)] text-xs font-mono text-[var(--neon-cyan)]">
                                                    Shift
                                                </kbd>
                                            )}
                                            <kbd className="px-2 py-1 rounded bg-[var(--void-base)] text-xs font-mono text-[var(--neon-magenta)]">
                                                {binding.key}
                                            </kbd>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 text-center">
                                <button
                                    onClick={() => setShowHelp(false)}
                                    className="text-sm text-[var(--text-muted)] hover:text-[var(--neon-cyan)] transition-colors"
                                >
                                    Press <kbd className="px-1 py-0.5 mx-1 rounded bg-[var(--void-light)] text-xs">Esc</kbd> to close
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Shortcut hint (bottom right) */}
            <motion.div
                className="fixed bottom-2 right-4 z-50 hidden sm:block"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2 }}
            >
                <button
                    onClick={() => setShowHelp(true)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg 
            bg-[var(--glass-bg)] border border-[var(--glass-border)]
            text-xs text-[var(--text-muted)] hover:text-[var(--neon-cyan)] 
            hover:border-[var(--neon-cyan)] transition-all"
                >
                    <Command size={14} />
                    <span>Ctrl + /</span>
                </button>
            </motion.div>
        </>
    );
}

// Hook for keyboard shortcuts
export function useKeyboardShortcut(key: string, callback: () => void, options?: {
    ctrl?: boolean;
    alt?: boolean;
    shift?: boolean;
    enabled?: boolean;
}) {
    useEffect(() => {
        if (options?.enabled === false) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
                return;
            }

            const ctrlMatch = options?.ctrl ? (event.ctrlKey || event.metaKey) : true;
            const altMatch = options?.alt ? event.altKey : true;
            const shiftMatch = options?.shift ? event.shiftKey : true;
            const keyMatch = event.key.toLowerCase() === key.toLowerCase();

            if (ctrlMatch && altMatch && shiftMatch && keyMatch) {
                event.preventDefault();
                callback();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [key, callback, options?.ctrl, options?.alt, options?.shift, options?.enabled]);
}
