'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';

interface UserBehavior {
    visitCount: number;
    totalTimeSpent: number; // in seconds
    pageVisits: Record<string, number>;
    preferredTheme: 'light' | 'dark' | null;
    interactionLevel: 'low' | 'medium' | 'high';
    lastVisit: number;
    scrollDepthMax: number;
    clickCount: number;
    language: 'en' | 'zh' | null;
}

interface BehaviorContextType {
    behavior: UserBehavior;
    isReturningUser: boolean;
    isEngagedUser: boolean;
    trackPageVisit: (page: string) => void;
    trackClick: () => void;
    trackScroll: (depth: number) => void;
    getPersonalizedContent: () => PersonalizedContent;
}

interface PersonalizedContent {
    showWelcomeBack: boolean;
    suggestedPages: string[];
    animationIntensity: 'full' | 'reduced' | 'minimal';
    skipIntro: boolean;
}

const STORAGE_KEY = 'nexusforge_user_behavior';

const defaultBehavior: UserBehavior = {
    visitCount: 0,
    totalTimeSpent: 0,
    pageVisits: {},
    preferredTheme: null,
    interactionLevel: 'low',
    lastVisit: 0,
    scrollDepthMax: 0,
    clickCount: 0,
    language: null,
};

const calculateInteractionLevel = (b: UserBehavior): 'low' | 'medium' | 'high' => {
    const score =
        (b.visitCount * 10) +
        (b.clickCount * 2) +
        (b.scrollDepthMax / 10) +
        (Object.keys(b.pageVisits).length * 5);

    if (score > 100) return 'high';
    if (score > 30) return 'medium';
    return 'low';
};

const BehaviorContext = createContext<BehaviorContextType | undefined>(undefined);

export function useBehaviorAnalytics() {
    const context = useContext(BehaviorContext);
    if (!context) {
        throw new Error('useBehaviorAnalytics must be used within a BehaviorProvider');
    }
    return context;
}

export function BehaviorProvider({ children }: { children: ReactNode }) {
    const [behavior, setBehavior] = useState<UserBehavior>(defaultBehavior);
    const [mounted, setMounted] = useState(false);
    const [sessionStartTime] = useState(() => Date.now());

    // Load behavior from localStorage
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setBehavior(prev => ({
                    ...prev,
                    ...parsed,
                    visitCount: parsed.visitCount + 1,
                }));
            } catch (e) {
                console.error('Failed to parse behavior data:', e);
            }
        } else {
            setBehavior(prev => ({ ...prev, visitCount: 1 }));
        }
        setMounted(true);
    }, []);

    // Save behavior to localStorage periodically
    useEffect(() => {
        if (!mounted) return;

        const saveInterval = setInterval(() => {
            const timeSpent = Math.floor((Date.now() - sessionStartTime) / 1000);
            const updatedBehavior = {
                ...behavior,
                totalTimeSpent: behavior.totalTimeSpent + timeSpent,
                lastVisit: Date.now(),
                interactionLevel: calculateInteractionLevel(behavior),
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBehavior));
        }, 30000); // Save every 30 seconds

        // Save on page unload
        const handleUnload = () => {
            const timeSpent = Math.floor((Date.now() - sessionStartTime) / 1000);
            const updatedBehavior = {
                ...behavior,
                totalTimeSpent: behavior.totalTimeSpent + timeSpent,
                lastVisit: Date.now(),
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBehavior));
        };

        window.addEventListener('beforeunload', handleUnload);

        return () => {
            clearInterval(saveInterval);
            window.removeEventListener('beforeunload', handleUnload);
        };
    }, [behavior, mounted, sessionStartTime]);

    // Track page visits
    const trackPageVisit = useCallback((page: string) => {
        setBehavior(prev => ({
            ...prev,
            pageVisits: {
                ...prev.pageVisits,
                [page]: (prev.pageVisits[page] || 0) + 1,
            },
        }));
    }, []);

    // Track clicks
    const trackClick = useCallback(() => {
        setBehavior(prev => ({
            ...prev,
            clickCount: prev.clickCount + 1,
        }));
    }, []);

    // Track scroll depth
    const trackScroll = useCallback((depth: number) => {
        setBehavior(prev => ({
            ...prev,
            scrollDepthMax: Math.max(prev.scrollDepthMax, depth),
        }));
    }, []);



    // Get personalized content based on behavior
    const getPersonalizedContent = useCallback((): PersonalizedContent => {
        const isReturning = behavior.visitCount > 1;
        const isEngaged = behavior.interactionLevel === 'high';

        // Get most visited pages for suggestions
        const pageEntries = Object.entries(behavior.pageVisits);
        const sortedPages = pageEntries
            .sort((a, b) => b[1] - a[1])
            .map(([page]) => page)
            .slice(0, 3);

        // Suggest unvisited pages
        const allPages = ['/', '/portfolio', '/blog', '/codelab', '/products', '/contact', '/resume'];
        const unvisitedPages = allPages.filter(p => !behavior.pageVisits[p]);
        const suggestedPages = [...sortedPages, ...unvisitedPages].slice(0, 3);

        return {
            showWelcomeBack: isReturning && (Date.now() - behavior.lastVisit) > 86400000, // > 1 day
            suggestedPages,
            animationIntensity: isEngaged ? 'full' : behavior.visitCount > 5 ? 'reduced' : 'full',
            skipIntro: behavior.visitCount > 3,
        };
    }, [behavior]);

    const isReturningUser = behavior.visitCount > 1;
    const isEngagedUser = behavior.interactionLevel === 'high';

    if (!mounted) {
        return <>{children}</>;
    }

    return (
        <BehaviorContext.Provider
            value={{
                behavior,
                isReturningUser,
                isEngagedUser,
                trackPageVisit,
                trackClick,
                trackScroll,
                getPersonalizedContent,
            }}
        >
            {children}
        </BehaviorContext.Provider>
    );
}

// Hook for page-level tracking
export function usePageTracking(pagePath: string) {
    const { trackPageVisit, trackScroll, trackClick } = useBehaviorAnalytics();

    useEffect(() => {
        trackPageVisit(pagePath);
    }, [pagePath, trackPageVisit]);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            );
            trackScroll(scrollPercent);
        };

        const handleClick = () => {
            trackClick();
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        document.addEventListener('click', handleClick);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('click', handleClick);
        };
    }, [trackScroll, trackClick]);
}

// Welcome back component
export function WelcomeBackBanner() {
    const { getPersonalizedContent, behavior } = useBehaviorAnalytics();
    const [show, setShow] = useState(false);
    const [now] = useState(() => Date.now());
    const content = getPersonalizedContent();

    useEffect(() => {
        if (content.showWelcomeBack) {
            const timer = setTimeout(() => setShow(true), 1000);
            return () => clearTimeout(timer);
        }
    }, [content.showWelcomeBack]);

    if (!show) return null;


    const daysSinceVisit = Math.floor((now - behavior.lastVisit) / 86400000);

    return (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 
            bg-[var(--glass-bg)] border border-[var(--neon-cyan)] rounded-xl
            shadow-[0_0_20px_var(--neon-cyan)] animate-fade-in-down">
            <button
                onClick={() => setShow(false)}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[var(--void-deep)] 
                    border border-[var(--glass-border)] text-[var(--text-muted)] text-xs
                    hover:text-[var(--neon-cyan)] transition-colors"
            >
                ×
            </button>
            <p className="text-sm text-[var(--text-primary)]">
                👋 Welcome back! It's been {daysSinceVisit} days since your last visit.
            </p>
            {content.suggestedPages.length > 0 && (
                <p className="text-xs text-[var(--text-muted)] mt-1">
                    Pick up where you left off or explore something new.
                </p>
            )}
        </div>
    );
}
