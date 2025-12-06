'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, User, Eye, EyeOff, ArrowRight, Shield } from 'lucide-react';
import HoloCard from '@/components/ui/HoloCard';
import CyberButton from '@/components/ui/CyberButton';
import GlitchText from '@/components/ui/GlitchText';
import Link from 'next/link';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Simulate login (in production, this would call your auth API)
        setTimeout(() => {
            if (email === 'witt.actionnow@gmail.com' && password === 'admin123') {
                window.location.href = '/admin/dashboard';
            } else {
                setError('Invalid credentials. Try witt.actionnow@gmail.com / admin123');
            }
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 pt-20">
            <motion.div
                className="w-full max-w-md"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <HoloCard className="p-8" glowColor="var(--neon-magenta)">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <motion.div
                            className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[var(--neon-magenta)] to-[var(--neon-purple)] flex items-center justify-center"
                            animate={{
                                boxShadow: [
                                    '0 0 20px rgba(255, 0, 255, 0.3)',
                                    '0 0 40px rgba(255, 0, 255, 0.5)',
                                    '0 0 20px rgba(255, 0, 255, 0.3)',
                                ]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <Shield size={32} className="text-white" />
                        </motion.div>
                        <h1 className="text-2xl font-bold font-[family-name:var(--font-display)] mb-2">
                            <GlitchText text="Admin Access" glitchOnHover />
                        </h1>
                        <p className="text-sm text-[var(--text-muted)]">
                            Enter your credentials to access the dashboard
                        </p>
                    </div>

                    {/* Error */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
                        >
                            {error}
                        </motion.div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm text-[var(--text-secondary)] mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="witt.actionnow@gmail.com"
                                    required
                                    className="w-full pl-11 pr-4 py-3 rounded-lg bg-[var(--void-light)] border border-[var(--glass-border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--neon-magenta)] focus:outline-none transition-colors"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-[var(--text-secondary)] mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full pl-11 pr-11 py-3 rounded-lg bg-[var(--void-light)] border border-[var(--glass-border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--neon-magenta)] focus:outline-none transition-colors"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <CyberButton
                            type="submit"
                            variant="magenta"
                            className="w-full"
                            disabled={isLoading}
                            icon={isLoading ? undefined : <ArrowRight size={18} />}
                            iconPosition="right"
                        >
                            {isLoading ? 'Authenticating...' : 'Sign In'}
                        </CyberButton>
                    </form>

                    {/* Demo hint */}
                    <div className="mt-6 p-3 rounded-lg bg-[var(--void-light)] text-xs text-[var(--text-muted)]">
                        <strong className="text-[var(--neon-amber)]">Demo credentials:</strong>
                        <br />
                        Email: witt.actionnow@gmail.com
                        <br />
                        Password: admin123
                    </div>

                    {/* Back link */}
                    <div className="mt-6 text-center">
                        <Link
                            href="/"
                            className="text-sm text-[var(--text-muted)] hover:text-[var(--neon-cyan)] transition-colors"
                        >
                            ← Back to Home
                        </Link>
                    </div>
                </HoloCard>
            </motion.div>
        </div>
    );
}
