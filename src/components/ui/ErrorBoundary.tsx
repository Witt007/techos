'use client';

import React, { Component, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import CyberButton from '@/components/ui/CyberButton';
import HoloCard from '@/components/ui/HoloCard';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
    errorInfo?: React.ErrorInfo;
}

export default class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.setState({ error, errorInfo });

        // In production, send to error tracking service
        if (process.env.NODE_ENV === 'production') {
            // Example: Sentry.captureException(error);
        }
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    };

    handleGoHome = () => {
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <HoloCard className="p-8 max-w-md text-center" glowColor="var(--neon-magenta)">
                            {/* Error Icon */}
                            <motion.div
                                className="w-20 h-20 rounded-full bg-[var(--neon-magenta)]/20 flex items-center justify-center mx-auto mb-6"
                                animate={{
                                    boxShadow: [
                                        '0 0 20px var(--neon-magenta)',
                                        '0 0 40px var(--neon-magenta)',
                                        '0 0 20px var(--neon-magenta)'
                                    ]
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <AlertTriangle size={40} className="text-[var(--neon-magenta)]" />
                            </motion.div>

                            {/* Error Message */}
                            <h1 className="text-2xl font-bold font-[family-name:var(--font-display)] mb-2 text-[var(--text-primary)]">
                                System Error Detected
                            </h1>
                            <p className="text-[var(--text-muted)] mb-6">
                                An unexpected error has occurred. Our systems are experiencing a temporal anomaly.
                            </p>

                            {/* Error Details (dev only) */}
                            {process.env.NODE_ENV === 'development' && this.state.error && (
                                <details className="text-left mb-6 p-4 rounded-lg bg-[var(--void-light)] text-xs font-mono">
                                    <summary className="cursor-pointer text-[var(--neon-amber)] mb-2">
                                        Error Details
                                    </summary>
                                    <pre className="overflow-auto text-[var(--text-muted)]">
                                        {this.state.error.toString()}
                                    </pre>
                                    {this.state.errorInfo && (
                                        <pre className="overflow-auto text-[var(--text-muted)] mt-2">
                                            {this.state.errorInfo.componentStack}
                                        </pre>
                                    )}
                                </details>
                            )}

                            {/* Actions */}
                            <div className="flex gap-3 justify-center">
                                <CyberButton
                                    variant="filled"
                                    icon={<RefreshCw size={18} />}
                                    onClick={this.handleRetry}
                                >
                                    Retry
                                </CyberButton>
                                <CyberButton
                                    variant="default"
                                    icon={<Home size={18} />}
                                    onClick={this.handleGoHome}
                                >
                                    Go Home
                                </CyberButton>
                            </div>

                            {/* Glitch effect text */}
                            <p className="text-xs text-[var(--text-muted)] mt-6 font-mono">
                                ERROR_CODE: {Math.random().toString(36).substring(7).toUpperCase()}
                            </p>
                        </HoloCard>
                    </motion.div>
                </div>
            );
        }

        return this.props.children;
    }
}

// Hook version for functional components
export function useErrorHandler() {
    const [error, setError] = React.useState<Error | null>(null);

    React.useEffect(() => {
        if (error) {
            throw error;
        }
    }, [error]);

    return React.useCallback((error: Error) => {
        setError(error);
    }, []);
}
