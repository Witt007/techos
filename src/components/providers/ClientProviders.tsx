'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { I18nProvider } from '@/components/providers/I18nProvider';
import { BehaviorProvider } from '@/components/providers/BehaviorProvider';
import { AudioProvider } from '@/components/providers/AudioProvider';

export default function ClientProviders({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider>
            <I18nProvider>
                <AudioProvider>
                    <BehaviorProvider>
                        {children}
                    </BehaviorProvider>
                </AudioProvider>
            </I18nProvider>
        </ThemeProvider>
    );
}
