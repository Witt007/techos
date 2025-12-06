'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone } from 'lucide-react';
import CyberButton from '@/components/ui/CyberButton';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true);
            return;
        }

        // Listen for install prompt
        const handleBeforeInstall = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);

            // Show prompt after delay
            setTimeout(() => {
                setShowPrompt(true);
            }, 3000);
        };

        // Listen for successful install
        const handleAppInstalled = () => {
            setIsInstalled(true);
            setShowPrompt(false);
            setDeferredPrompt(null);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstall);
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            setIsInstalled(true);
        }

        setShowPrompt(false);
        setDeferredPrompt(null);
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        // Don't show again for this session
        sessionStorage.setItem('pwa-prompt-dismissed', 'true');
    };

    // Check if dismissed this session
    useEffect(() => {
        if (sessionStorage.getItem('pwa-prompt-dismissed')) {
            setShowPrompt(false);
        }
    }, []);

    if (isInstalled || !showPrompt) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-50"
            >
                <div className="bg-[var(--void-deep)] border border-[var(--glass-border)] rounded-2xl p-4 shadow-2xl">
                    {/* Close button */}
                    <button
                        onClick={handleDismiss}
                        className="absolute top-2 right-2 p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                    >
                        <X size={18} />
                    </button>

                    <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--neon-cyan)] to-[var(--neon-magenta)] flex items-center justify-center shrink-0">
                            <Smartphone size={24} className="text-[var(--void-deepest)]" />
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                            <h3 className="font-bold text-[var(--text-primary)] mb-1">
                                Install NexusForge
                            </h3>
                            <p className="text-sm text-[var(--text-muted)] mb-3">
                                Add to your home screen for quick access and offline viewing.
                            </p>

                            <div className="flex gap-2">
                                <CyberButton
                                    variant="filled"
                                    size="sm"
                                    icon={<Download size={16} />}
                                    onClick={handleInstall}
                                >
                                    Install
                                </CyberButton>
                                <button
                                    onClick={handleDismiss}
                                    className="px-3 py-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                                >
                                    Not now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}

// Service Worker registration component
export function ServiceWorkerRegistration() {
    useEffect(() => {
        if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
            navigator.serviceWorker
                .register('/sw.js')
                .then((registration) => {
                    console.log('SW registered:', registration.scope);
                })
                .catch((error) => {
                    console.log('SW registration failed:', error);
                });
        }
    }, []);

    return null;
}
