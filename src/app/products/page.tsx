'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ExternalLink, Rocket, Beaker, Clock, Check, ArrowRight, Zap
} from 'lucide-react';
import HoloCard from '@/components/ui/HoloCard';
import CyberButton from '@/components/ui/CyberButton';
import GlitchText from '@/components/ui/GlitchText';
import { products, productCategories } from '@/data/products';
import { useI18n } from '@/components/providers/I18nProvider';

export default function ProductsPage() {
    const [activeCategory, setActiveCategory] = useState('all');
    const { locale } = useI18n();

    const filteredProducts = activeCategory === 'all'
        ? products
        : products.filter(p => p.category === activeCategory);

    const getStatusBadge = (status: string) => {
        const badges = {
            'live': { icon: Rocket, label: locale === 'zh' ? '已上线' : 'Live', color: 'var(--neon-green)' },
            'beta': { icon: Beaker, label: 'Beta', color: 'var(--neon-amber)' },
            'coming-soon': { icon: Clock, label: locale === 'zh' ? '即将推出' : 'Coming Soon', color: 'var(--neon-purple)' },
        };
        return badges[status as keyof typeof badges] || badges['coming-soon'];
    };

    return (
        <div className="min-h-screen pt-24 pb-20 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.header
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <motion.div
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
              bg-[var(--glass-bg)] border border-[var(--glass-border)] 
              text-xs font-mono text-[var(--neon-cyan)] mb-6"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Zap size={14} />
                        <span>{locale === 'zh' ? '产品与服务' : 'Products & Services'}</span>
                    </motion.div>

                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
                        <GlitchText
                            text={locale === 'zh' ? '产品' : 'Products'}
                            className="font-[family-name:var(--font-display)]"
                            glitchOnHover
                        />
                    </h1>
                    <p className="text-[var(--text-muted)] max-w-2xl mx-auto text-lg">
                        {locale === 'zh'
                            ? '一套为开发者和企业创建下一代数字体验而打造的工具和平台。'
                            : 'A suite of tools and platforms built to empower developers and enterprises in creating next-generation digital experiences.'}
                    </p>
                </motion.header>

                {/* Category Filter */}
                <motion.div
                    className="flex flex-wrap justify-center gap-3 mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    {productCategories.map((category) => (
                        <motion.button
                            key={category.id}
                            onClick={() => setActiveCategory(category.id)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeCategory === category.id
                                ? 'bg-[var(--neon-cyan)] text-[var(--void-deepest)]'
                                : 'bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--text-secondary)] hover:border-[var(--neon-cyan)] hover:text-[var(--neon-cyan)]'
                                }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {locale === 'zh' ? category.label.zh : category.label.en}
                        </motion.button>
                    ))}
                </motion.div>

                {/* Products Grid */}
                <motion.div className="space-y-8" layout>
                    <AnimatePresence mode="popLayout">
                        {filteredProducts.map((product, index) => {
                            const status = getStatusBadge(product.status);
                            const StatusIcon = status.icon;

                            return (
                                <motion.div
                                    key={product.id}
                                    layout
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -30 }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                >
                                    <HoloCard
                                        className="group overflow-hidden"
                                        glowColor={product.color}
                                    >
                                        <div className="flex flex-col lg:flex-row gap-6">
                                            {/* Left: Product Image/Preview */}
                                            <div
                                                className="lg:w-80 h-48 lg:h-auto rounded-lg shrink-0 flex items-center justify-center relative overflow-hidden"
                                                style={{
                                                    background: `linear-gradient(135deg, ${product.color}20 0%, var(--void-deep) 100%)`
                                                }}
                                            >
                                                <div className="text-6xl font-bold font-[family-name:var(--font-display)] opacity-20" style={{ color: product.color }}>
                                                    {product.name.en.charAt(0)}
                                                </div>

                                                {/* Status badge */}
                                                <div
                                                    className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-mono flex items-center gap-1"
                                                    style={{
                                                        background: `${status.color}20`,
                                                        color: status.color,
                                                        border: `1px solid ${status.color}50`
                                                    }}
                                                >
                                                    <StatusIcon size={12} />
                                                    {status.label}
                                                </div>
                                            </div>

                                            {/* Right: Content */}
                                            <div className="flex-1 py-2">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div>
                                                        <h2
                                                            className="text-2xl font-bold font-[family-name:var(--font-display)] mb-1"
                                                            style={{ color: product.color }}
                                                        >
                                                            {locale === 'zh' ? product.name.zh : product.name.en}
                                                        </h2>
                                                        <p className="text-[var(--text-secondary)]">
                                                            {locale === 'zh' ? product.tagline.zh : product.tagline.en}
                                                        </p>
                                                    </div>
                                                    {product.pricing && (
                                                        <div className="text-right">
                                                            <div className="text-xs text-[var(--text-muted)]">{locale === 'zh' ? '起价' : 'Starting from'}</div>
                                                            <div className="text-lg font-semibold text-[var(--text-primary)]">
                                                                {product.pricing}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                <p className="text-[var(--text-muted)] mb-6">
                                                    {locale === 'zh' ? product.description.zh : product.description.en}
                                                </p>

                                                {/* Features */}
                                                <div className="grid sm:grid-cols-2 gap-2 mb-6">
                                                    {(locale === 'zh' ? product.features.zh : product.features.en).slice(0, 4).map((feature, i) => (
                                                        <div
                                                            key={i}
                                                            className="flex items-center gap-2 text-sm text-[var(--text-secondary)]"
                                                        >
                                                            <Check size={14} style={{ color: product.color }} />
                                                            {feature}
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Actions */}
                                                <div className="flex gap-3">
                                                    {product.url && product.status !== 'coming-soon' ? (
                                                        <a href={product.url} target="_blank" rel="noopener noreferrer">
                                                            <CyberButton
                                                                variant="filled"
                                                                icon={<ExternalLink size={16} />}
                                                            >
                                                                {locale === 'zh' ? '立即体验' : 'Try Now'}
                                                            </CyberButton>
                                                        </a>
                                                    ) : (
                                                        <CyberButton
                                                            variant="default"
                                                            disabled={product.status === 'coming-soon'}
                                                            icon={<Clock size={16} />}
                                                        >
                                                            {product.status === 'coming-soon'
                                                                ? (locale === 'zh' ? '即将推出' : 'Coming Soon')
                                                                : (locale === 'zh' ? '加入等待名单' : 'Join Waitlist')}
                                                        </CyberButton>
                                                    )}
                                                    <CyberButton variant="ghost" icon={<ArrowRight size={16} />} iconPosition="right">
                                                        {locale === 'zh' ? '了解更多' : 'Learn More'}
                                                    </CyberButton>
                                                </div>
                                            </div>
                                        </div>
                                    </HoloCard>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </motion.div>

                {/* CTA */}
                <motion.div
                    className="text-center mt-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <HoloCard className="inline-block p-8">
                        <h3 className="text-xl font-[family-name:var(--font-display)] mb-3">
                            {locale === 'zh' ? '需要定制解决方案？' : 'Need a Custom Solution?'}
                        </h3>
                        <p className="text-[var(--text-muted)] mb-6 max-w-md">
                            {locale === 'zh'
                                ? '寻找针对您特定需求的解决方案？让我们讨论如何一起构建。'
                                : "Looking for something tailored to your specific needs? Let's discuss how we can build it together."}
                        </p>
                        <CyberButton
                            variant="filled"
                            icon={<Zap size={18} />}
                            onClick={() => window.location.href = '/contact'}
                        >
                            {locale === 'zh' ? '联系我' : 'Get in Touch'}
                        </CyberButton>
                    </HoloCard>
                </motion.div>
            </div>
        </div>
    );
}
