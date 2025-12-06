// SEO utilities and structured data
import { Metadata } from 'next';
import { profile } from '@/data/profile';

// Base URL for the site
export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://nexusforge.dev';

// Default metadata
export const defaultMetadata: Metadata = {
    metadataBase: new URL(BASE_URL),
    title: {
        default: 'NexusForge | Creative Engineer Portfolio',
        template: '%s | NexusForge',
    },
    description: 'Full-stack developer portfolio showcasing work in AI, Digital Twin, GIS, Data Visualization, and 3D Technology.',
    keywords: ['Full-Stack Developer', 'Creative Engineer', 'Digital Twin', 'GIS', 'Data Visualization', 'Three.js', 'WebGL', 'AI', 'Portfolio'],
    authors: [{ name: profile.name.en, url: BASE_URL }],
    creator: profile.name.en,
    publisher: profile.name.en,
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    openGraph: {
        type: 'website',
        locale: 'en_US',
        alternateLocale: 'zh_CN',
        url: BASE_URL,
        siteName: 'NexusForge',
        title: 'NexusForge | Creative Engineer Portfolio',
        description: 'Crafting Digital Realities at the Intersection of Art & Technology',
        images: [
            {
                url: `${BASE_URL}/og-image.png`,
                width: 1200,
                height: 630,
                alt: 'NexusForge Portfolio',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'NexusForge | Creative Engineer Portfolio',
        description: 'Crafting Digital Realities at the Intersection of Art & Technology',
        creator: '@alexchen',
        images: [`${BASE_URL}/twitter-image.png`],
    },
    alternates: {
        canonical: BASE_URL,
        languages: {
            'en-US': `${BASE_URL}/en`,
            'zh-CN': `${BASE_URL}/zh`,
        },
    },
    manifest: '/manifest.json',
    icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon-16x16.png',
        apple: '/apple-touch-icon.png',
    },
};

// Person structured data
export function getPersonJsonLd() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: profile.name.en,
        url: BASE_URL,
        image: `${BASE_URL}/profile.jpg`,
        sameAs: [
            profile.contact.github,
            profile.contact.linkedin,
            profile.contact.twitter,
        ],
        jobTitle: 'Creative Engineer & Full-Stack Developer',
        worksFor: {
            '@type': 'Organization',
            name: 'NexusForge',
        },
        knowsAbout: [
            'Web Development',
            'Digital Twin',
            'Data Visualization',
            'Three.js',
            'WebGL',
            'Artificial Intelligence',
            'GIS',
        ],
    };
}

// Website structured data
export function getWebsiteJsonLd() {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'NexusForge',
        url: BASE_URL,
        description: 'Creative Engineer Portfolio - AI, Digital Twin, 3D Visualization',
        author: getPersonJsonLd(),
        potentialAction: {
            '@type': 'SearchAction',
            target: `${BASE_URL}/search?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
        },
    };
}

// Blog post structured data
export function getBlogPostJsonLd(post: {
    title: string;
    description: string;
    slug: string;
    publishedAt: string;
    author?: string;
    image?: string;
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.description,
        url: `${BASE_URL}/blog/${post.slug}`,
        datePublished: post.publishedAt,
        dateModified: post.publishedAt,
        author: {
            '@type': 'Person',
            name: post.author || profile.name.en,
            url: BASE_URL,
        },
        publisher: {
            '@type': 'Organization',
            name: 'NexusForge',
            logo: {
                '@type': 'ImageObject',
                url: `${BASE_URL}/logo.png`,
            },
        },
        image: post.image || `${BASE_URL}/og-image.png`,
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${BASE_URL}/blog/${post.slug}`,
        },
    };
}

// Project structured data
export function getProjectJsonLd(project: {
    title: string;
    description: string;
    id: string;
    techStack: string[];
    url?: string;
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: project.title,
        description: project.description,
        url: `${BASE_URL}/portfolio/${project.id}`,
        author: getPersonJsonLd(),
        keywords: project.techStack.join(', '),
        ...(project.url && { mainEntityOfPage: project.url }),
    };
}

// Breadcrumb structured data
export function getBreadcrumbJsonLd(items: { name: string; url: string }[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url}`,
        })),
    };
}

// FAQ structured data
export function getFAQJsonLd(faqs: { question: string; answer: string }[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
            },
        })),
    };
}
