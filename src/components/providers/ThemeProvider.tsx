'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
    mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>('dark');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Check localStorage first
        const savedTheme = localStorage.getItem('nexusforge-theme') as Theme | null;
        if (savedTheme) {
            setTheme(savedTheme);
        } /*else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
            setTheme('light');
        }*/
    }, []);

    useEffect(() => {
        if (!mounted) return;

        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('nexusforge-theme', theme);
    }, [theme, mounted]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, mounted }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    // Return default values if context is not available (SSR or outside provider)
    if (context === undefined) {
        return {
            theme: 'dark' as Theme,
            setTheme: () => { },
            toggleTheme: () => { },
            mounted: false,
        };
    }
    return context;
}
