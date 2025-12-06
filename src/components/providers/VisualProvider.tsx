'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

type VisualEffect = 'particles' | 'portrait';

interface VisualContextType {
    activeEffect: VisualEffect;
    toggleEffect: () => void;
    setEffect: (effect: VisualEffect) => void;
}

const VisualContext = createContext<VisualContextType | undefined>(undefined);

export function VisualProvider({ children }: { children: React.ReactNode }) {
    const [activeEffect, setActiveEffect] = useState<VisualEffect>('particles');

    const toggleEffect = useCallback(() => {
        setActiveEffect(prev => prev === 'particles' ? 'portrait' : 'particles');
    }, []);

    const setEffect = useCallback((effect: VisualEffect) => {
        setActiveEffect(effect);
    }, []);

    return (
        <VisualContext.Provider value={{ activeEffect, toggleEffect, setEffect }}>
            {children}
        </VisualContext.Provider>
    );
}

export function useVisual() {
    const context = useContext(VisualContext);
    if (context === undefined) {
        throw new Error('useVisual must be used within a VisualProvider');
    }
    return context;
}
