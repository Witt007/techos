'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Globe } from 'lucide-react';
import { useI18n, Locale } from '@/components/providers/I18nProvider';

interface LanguageSwitcherProps {
    className?: string;
    variant?: 'default' | 'compact';
}

const languages: { code: Locale; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'zh', label: '中文', flag: '🇨🇳' },
];

export default function LanguageSwitcher({
    className = '',
    variant = 'default'
}: LanguageSwitcherProps) {
    const { locale, setLocale } = useI18n();

    const toggleLocale = () => {
        setLocale(locale === 'en' ? 'zh' : 'en');
    };

    const currentLang = languages.find(l => l.code === locale) || languages[0];
    const otherLang = languages.find(l => l.code !== locale) || languages[1];

    if (variant === 'compact') {
        return (
            <motion.button
                onClick={toggleLocale}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg 
          bg-[var(--glass-bg)] border border-[var(--glass-border)]
          text-[var(--text-secondary)] hover:text-[var(--neon-cyan)]
          hover:border-[var(--neon-cyan)] transition-all ${className}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title={`Switch to ${otherLang.label}`}
            >
                <Globe size={16} />
                <span className="text-sm font-mono">{currentLang.code.toUpperCase()}</span>
            </motion.button>
        );
    }

    return (
        <motion.button
            onClick={toggleLocale}
            className={`relative flex items-center gap-2 px-4 py-2 rounded-full
        bg-[var(--glass-bg)] border border-[var(--glass-border)]
        text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]
        transition-all overflow-hidden group ${className}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            {/* Background animation */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[var(--neon-cyan)]/10 to-[var(--neon-magenta)]/10"
                initial={{ x: '-100%' }}
                whileHover={{ x: '0%' }}
                transition={{ duration: 0.3 }}
            />

            {/* Content */}
            <div className="relative flex items-center gap-2">
                <AnimatePresence mode="wait">
                    <motion.span
                        key={currentLang.code}
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 10, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-lg"
                    >
                        {currentLang.flag}
                    </motion.span>
                </AnimatePresence>

                <div className="flex flex-col items-start leading-tight">
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={currentLang.code}
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 10, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="text-sm font-medium text-[var(--text-primary)]"
                        >
                            {currentLang.label}
                        </motion.span>
                    </AnimatePresence>
                    <span className="text-xs text-[var(--text-muted)] group-hover:text-[var(--neon-cyan)] transition-colors">
                        Click to switch
                    </span>
                </div>

                {/* Switch indicator */}
                <div className="ml-2 flex items-center gap-1 text-xs text-[var(--text-muted)]">
                    <span>{otherLang.flag}</span>
                </div>
            </div>
        </motion.button>
    );
}
