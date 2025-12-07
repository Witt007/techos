'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Menu, X, Home, Briefcase, Code2, FileText, Package,
    Mail, User, Moon, Sun, Mic
} from 'lucide-react';
import { useTheme } from '@/components/providers/ThemeProvider';
import { useI18n } from '@/components/providers/I18nProvider';
import GlitchText from '@/components/ui/GlitchText';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import { AudioControlButton } from '@/components/providers/AudioProvider';

const navItems = [
    { href: '/', label: 'Home', labelZh: '首页', icon: Home },
    { href: '/portfolio', label: 'Portfolio', labelZh: '作品集', icon: Briefcase },
    { href: '/codelab', label: 'CodeLab', labelZh: '代码库', icon: Code2 },
    { href: '/blog', label: 'Blog', labelZh: '博客', icon: FileText },
    { href: '/resume', label: 'Resume', labelZh: '简历', icon: FileText },
    { href: '/products', label: 'Products', labelZh: '产品', icon: Package },
    { href: '/contact', label: 'Contact', labelZh: '联系', icon: Mail },
];

export default function Navigation() {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();
    const { theme, toggleTheme } = useTheme();
    const { locale } = useI18n();

  

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

      // Hide navigation on admin pages
      if (pathname?.startsWith('/admin')) {
        return null;
    }
    return (
        <>
            {/* Main Navigation Bar */}
            <motion.nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
                    ? 'py-2 bg-[var(--glass-bg)] backdrop-blur-xl border-b border-[var(--glass-border)]'
                    : 'py-4 bg-transparent'
                    }`}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="relative w-10 h-10">
                                {/* Animated logo ring */}
                                <motion.div
                                    className="absolute inset-0 rounded-lg border-2 border-[var(--neon-cyan)]"
                                    animate={{
                                        rotate: 360,
                                        borderColor: ['var(--neon-cyan)', 'var(--neon-magenta)', 'var(--neon-cyan)']
                                    }}
                                    transition={{
                                        rotate: { duration: 10, repeat: Infinity, ease: 'linear' },
                                        borderColor: { duration: 3, repeat: Infinity }
                                    }}
                                    style={{
                                        clipPath: 'polygon(0 0, 100% 0, 100% 30%, 70% 30%, 70% 70%, 100% 70%, 100% 100%, 0 100%)'
                                    }}
                                />
                                <div className="absolute inset-1 flex items-center justify-center">
                                    <span className="text-lg font-bold font-[family-name:var(--font-display)] text-[var(--neon-cyan)]">
                                        T
                                    </span>
                                </div>
                            </div>
                            <div className="hidden sm:block">
                                <GlitchText
                                    text="Witt"
                                    className="text-lg font-bold font-[family-name:var(--font-display)] tracking-wider text-[var(--text-primary)]"
                                    glitchOnHover
                                />
                                <span className="text-xs text-[var(--text-muted)] tracking-[0.3em]">Blog</span>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-6">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`nav-link px-4 py-2 ${isActive ? 'nav-link--active' : ''}`}
                                    >
                                        {locale === 'zh' ? item.labelZh : item.label}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Right side controls */}
                        <div className="flex items-center gap-3">
                            {/* Audio control with AI avatar */}
                            <AudioControlButton />

                            {/* Voice control indicator 
                            <motion.button
                                className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--neon-cyan)] hover:bg-[var(--surface)] transition-colors hidden sm:block"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                title="Voice commands"
                            >
                                <Mic size={20} />
                            </motion.button>*/}

                            {/* Theme toggle */}
                            <motion.button
                                onClick={toggleTheme}
                                className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--neon-cyan)] hover:bg-[var(--surface)] transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                            >
                                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                            </motion.button>

                            {/* Language switcher */}
                            <div className="hidden sm:block">
                                <LanguageSwitcher variant="compact" />
                            </div>

                            {/* Admin link */}
                            <Link
                                href="/admin"
                                className="hidden sm:flex p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--neon-magenta)] hover:bg-[var(--surface)] transition-colors"
                                title="Admin"
                            >
                                <User size={20} />
                            </Link>

                            {/* Mobile menu button */}
                            <motion.button
                                onClick={() => setIsOpen(!isOpen)}
                                className="lg:hidden p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--neon-cyan)] hover:bg-[var(--surface)] transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {isOpen ? <X size={24} /> : <Menu size={24} />}
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Navigation Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fixed inset-0 z-40 lg:hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {/* Backdrop */}
                        <motion.div
                            className="absolute inset-0 bg-[var(--void-deepest)]/90 backdrop-blur-xl"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Menu content */}
                        <motion.div
                            className="absolute top-20 left-4 right-4 bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] rounded-2xl p-6 overflow-hidden"
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Decorative corner */}
                            <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-[var(--neon-cyan)] opacity-30 rounded-tr-2xl" />
                            <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-[var(--neon-magenta)] opacity-30 rounded-bl-2xl" />

                            <div className="relative space-y-2">
                                {navItems.map((item, index) => {
                                    const Icon = item.icon;
                                    const isActive = pathname === item.href;

                                    return (
                                        <motion.div
                                            key={item.href}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <Link
                                                href={item.href}
                                                className={`flex items-center gap-4 p-4 rounded-xl transition-all ${isActive
                                                    ? 'bg-[var(--hologram)] text-[var(--neon-cyan)] border border-[var(--hologram-border)]'
                                                    : 'text-[var(--text-secondary)] hover:bg-[var(--surface)] hover:text-[var(--text-primary)]'
                                                    }`}
                                            >
                                                <Icon size={20} />
                                                <div>
                                                    <div className="font-[family-name:var(--font-display)] text-sm tracking-wider">
                                                        {item.label}
                                                    </div>
                                                    <div className="text-xs text-[var(--text-muted)]">
                                                        {item.labelZh}
                                                    </div>
                                                </div>
                                                {isActive && (
                                                    <motion.div
                                                        className="ml-auto w-2 h-2 rounded-full bg-[var(--neon-cyan)]"
                                                        animate={{ scale: [1, 1.2, 1] }}
                                                        transition={{ duration: 1, repeat: Infinity }}
                                                    />
                                                )}
                                            </Link>
                                        </motion.div>
                                    );
                                })}

                                {/* Admin link for mobile */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: navItems.length * 0.05 }}
                                >
                                    <Link
                                        href="/admin"
                                        className="flex items-center gap-4 p-4 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--surface)] hover:text-[var(--neon-magenta)] transition-all"
                                    >
                                        <User size={20} />
                                        <div>
                                            <div className="font-[family-name:var(--font-display)] text-sm tracking-wider">
                                                Admin
                                            </div>
                                            <div className="text-xs text-[var(--text-muted)]">
                                                管理后台
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
