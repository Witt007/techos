'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Supported locales
export type Locale = 'en' | 'zh';

// Translation structure
export interface Translations {
    [key: string]: string | Translations;
}

// Context type
interface I18nContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (key: string, params?: Record<string, string | number>) => string;
    isLoading: boolean;
}

// Default translations
const translations: Record<Locale, Translations> = {
    en: {
        nav: {
            home: 'Home',
            portfolio: 'Portfolio',
            codelab: 'CodeLab',
            blog: 'Blog',
            resume: 'Resume',
            products: 'Products',
            contact: 'Contact',
        },
        common: {
            loading: 'Loading...',
            error: 'Something went wrong',
            retry: 'Try again',
            viewAll: 'View All',
            learnMore: 'Learn More',
            getInTouch: 'Get in Touch',
            download: 'Download',
            share: 'Share',
            save: 'Save',
            send: 'Send',
            cancel: 'Cancel',
            close: 'Close',
            search: 'Search',
            filter: 'Filter',
            sort: 'Sort',
            back: 'Back',
            next: 'Next',
            previous: 'Previous',
        },
        home: {
            greeting: 'Hello, I am',
            tagline: 'Crafting Digital Realities at the Intersection of Art & Technology',
            exploreWork: 'Explore My Work',
            scrollDown: 'Scroll to Explore',
            about: {
                title: 'About Me',
                description: 'Creative engineer specializing in digital twins, data visualization, and immersive web experiences.',
            },
            expertise: {
                title: 'Expertise Domains',
                subtitle: 'Technologies and fields I specialize in',
            },
        },
        portfolio: {
            title: 'Portfolio',
            subtitle: 'A showcase of innovative projects',
            viewProject: 'View Project',
            allProjects: 'All Projects',
            featured: 'Featured',
            techStack: 'Tech Stack',
            highlights: 'Key Achievements',
            relatedProjects: 'Related Projects',
        },
        blog: {
            title: 'Blog',
            subtitle: 'Thoughts, tutorials, and insights',
            readMore: 'Read More',
            minRead: 'min read',
            featured: 'Featured Articles',
            allPosts: 'All Posts',
            tableOfContents: 'Table of Contents',
            prevArticle: 'Previous Article',
            nextArticle: 'Next Article',
        },
        codelab: {
            title: 'CodeLab',
            subtitle: 'Open source contributions',
            stars: 'Stars',
            downloads: 'Downloads',
            viewOnNpm: 'View on NPM',
            viewOnGithub: 'View on GitHub',
        },
        resume: {
            title: 'Resume',
            subtitle: 'Professional background and skills',
            downloadPdf: 'Download PDF',
            print: 'Print',
            experience: 'Professional Experience',
            education: 'Education',
            skills: 'Technical Skills',
            certifications: 'Certifications',
            languages: 'Languages',
        },
        products: {
            title: 'Products',
            subtitle: 'Digital products and tools',
            comingSoon: 'Coming Soon',
            active: 'Active',
            beta: 'Beta',
            features: 'Features',
            pricing: 'Pricing',
            tryNow: 'Try Now',
        },
        contact: {
            title: 'Contact',
            subtitle: 'Let\'s work together',
            email: 'Email',
            location: 'Location',
            social: 'Connect on Social',
            form: {
                name: 'Your Name',
                email: 'Your Email',
                subject: 'Subject',
                message: 'Your Message',
                send: 'Send Message',
            },
            ai: {
                greeting: 'Hello! I\'m the NexusForge AI assistant. How can I help you today?',
                placeholder: 'Ask me anything...',
                quickQuestions: 'Quick questions:',
            },
        },
        theme: {
            light: 'Light Mode',
            dark: 'Dark Mode',
            toggle: 'Toggle Theme',
        },
        shortcuts: {
            title: 'Keyboard Shortcuts',
            hint: 'Press these keys to navigate quickly',
        },
    },
    zh: {
        nav: {
            home: '首页',
            portfolio: '作品集',
            codelab: '代码库',
            blog: '博客',
            resume: '简历',
            products: '产品',
            contact: '联系',
        },
        common: {
            loading: '加载中...',
            error: '出了点问题',
            retry: '重试',
            viewAll: '查看全部',
            learnMore: '了解更多',
            getInTouch: '联系我',
            download: '下载',
            share: '分享',
            save: '保存',
            send: '发送',
            cancel: '取消',
            close: '关闭',
            search: '搜索',
            filter: '筛选',
            sort: '排序',
            back: '返回',
            next: '下一页',
            previous: '上一页',
        },
        home: {
            greeting: '你好，我是',
            tagline: '在艺术与技术的交汇处，创造数字现实',
            exploreWork: '探索我的作品',
            scrollDown: '向下滚动探索',
            about: {
                title: '关于我',
                description: '专注于数字孪生、数据可视化和沉浸式网页体验的创意工程师。',
            },
            expertise: {
                title: '专业领域',
                subtitle: '我专长的技术和领域',
            },
        },
        portfolio: {
            title: '作品集',
            subtitle: '创新项目展示',
            viewProject: '查看项目',
            allProjects: '全部项目',
            featured: '精选',
            techStack: '技术栈',
            highlights: '主要成就',
            relatedProjects: '相关项目',
        },
        blog: {
            title: '博客',
            subtitle: '思考、教程和见解',
            readMore: '阅读更多',
            minRead: '分钟阅读',
            featured: '精选文章',
            allPosts: '全部文章',
            tableOfContents: '目录',
            prevArticle: '上一篇',
            nextArticle: '下一篇',
        },
        codelab: {
            title: '代码库',
            subtitle: '开源贡献',
            stars: '星标',
            downloads: '下载量',
            viewOnNpm: '在NPM查看',
            viewOnGithub: '在GitHub查看',
        },
        resume: {
            title: '简历',
            subtitle: '职业背景与技能',
            downloadPdf: '下载PDF',
            print: '打印',
            experience: '工作经历',
            education: '教育背景',
            skills: '技术技能',
            certifications: '资格证书',
            languages: '语言能力',
        },
        products: {
            title: '产品',
            subtitle: '数字产品与工具',
            comingSoon: '即将推出',
            active: '运营中',
            beta: '测试版',
            features: '功能特点',
            pricing: '定价',
            tryNow: '立即体验',
        },
        contact: {
            title: '联系',
            subtitle: '让我们一起合作',
            email: '邮箱',
            location: '位置',
            social: '社交媒体',
            form: {
                name: '您的姓名',
                email: '您的邮箱',
                subject: '主题',
                message: '您的消息',
                send: '发送消息',
            },
            ai: {
                greeting: '你好！我是NexusForge AI助手。今天我能帮您什么？',
                placeholder: '随便问我...',
                quickQuestions: '快速提问：',
            },
        },
        theme: {
            light: '浅色模式',
            dark: '深色模式',
            toggle: '切换主题',
        },
        shortcuts: {
            title: '键盘快捷键',
            hint: '按下这些键快速导航',
        },
    },
};

// Storage key
const LOCALE_STORAGE_KEY = 'nexusforge-locale';

// Create context
const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Provider component
export function I18nProvider({ children }: { children: React.ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>('en');
    const [isLoading, setIsLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    // Load locale from storage on mount
    useEffect(() => {
        setMounted(true);
        try {
            const stored = localStorage.getItem(LOCALE_STORAGE_KEY) as Locale | null;
            if (stored && (stored === 'en' || stored === 'zh')) {
                setLocaleState(stored);
            } else {
                // Try to detect from browser
                const browserLang = navigator.language.toLowerCase();
                if (browserLang.startsWith('zh')) {
                    setLocaleState('zh');
                }
            }
        } catch (e) {
            // localStorage might not be available
            console.warn('Could not access localStorage for i18n');
        }
        setIsLoading(false);
    }, []);

    // Save locale to storage
    const setLocale = useCallback((newLocale: Locale) => {
        console.log('Switching locale to:', newLocale);
        setLocaleState(newLocale);
        try {
            localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
            document.documentElement.lang = newLocale;
        } catch (e) {
            console.warn('Could not save locale to localStorage');
        }
    }, []);

    // Translation function
    const t = useCallback((key: string, params?: Record<string, string | number>): string => {
        const keys = key.split('.');
        let value: any = translations[locale];

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                // Fallback to English
                value = translations.en;
                for (const k2 of keys) {
                    if (value && typeof value === 'object' && k2 in value) {
                        value = value[k2];
                    } else {
                        return key; // Return key if not found
                    }
                }
                break;
            }
        }

        if (typeof value !== 'string') {
            return key;
        }

        // Replace parameters
        if (params) {
            return value.replace(/\{(\w+)\}/g, (_, param) =>
                String(params[param] ?? `{${param}}`)
            );
        }

        return value;
    }, [locale]);

    // Avoid hydration mismatch
    if (!mounted) {
        return (
            <I18nContext.Provider value={{ locale: 'en', setLocale, t, isLoading: true }}>
                {children}
            </I18nContext.Provider>
        );
    }

    return (
        <I18nContext.Provider value={{ locale, setLocale, t, isLoading }}>
            {children}
        </I18nContext.Provider>
    );
}

// Hook to use i18n
export function useI18n() {
    const context = useContext(I18nContext);
    if (!context) {
        throw new Error('useI18n must be used within an I18nProvider');
    }
    return context;
}

// Hook for just translations
export function useTranslation() {
    const { t, locale } = useI18n();
    return { t, locale };
}

// Export translations for SSR
export { translations };
