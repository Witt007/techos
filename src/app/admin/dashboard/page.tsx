'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users, Eye, Clock, TrendingUp, Globe, Activity,
    BarChart3, FileText, Package, LogOut, Settings,
    Home, ChevronRight
} from 'lucide-react';
import HoloCard from '@/components/ui/HoloCard';
import GlitchText from '@/components/ui/GlitchText';
import Link from 'next/link';

// Mock analytics data
const mockStats = {
    totalVisitors: 12847,
    activeUsers: 23,
    avgSessionDuration: '4m 32s',
    bounceRate: '32%',
    pageViews: {
        '/': 5420,
        '/portfolio': 3210,
        '/blog': 2845,
        '/codelab': 1520,
        '/products': 1102,
        '/contact': 750,
    },
    trafficSources: [
        { source: 'Direct', percentage: 35 },
        { source: 'Google', percentage: 42 },
        { source: 'GitHub', percentage: 15 },
        { source: 'LinkedIn', percentage: 5 },
        { source: 'Twitter', percentage: 3 },
    ],
    recentVisitors: [
        { country: 'United States', city: 'San Francisco', time: '2 min ago', pages: 4 },
        { country: 'China', city: 'Shanghai', time: '5 min ago', pages: 7 },
        { country: 'Germany', city: 'Berlin', time: '8 min ago', pages: 2 },
        { country: 'Japan', city: 'Tokyo', time: '12 min ago', pages: 5 },
        { country: 'UK', city: 'London', time: '15 min ago', pages: 3 },
    ],
    dailyVisits: [320, 410, 380, 520, 480, 610, 590, 720, 680, 810, 750, 890],
};

const sidebarItems = [
    { icon: Home, label: 'Dashboard', href: '/admin/dashboard', active: true },
    { icon: BarChart3, label: 'Analytics', href: '/admin/analytics' },
    { icon: FileText, label: 'Content', href: '/admin/content' },
    { icon: Package, label: 'Products', href: '/admin/products' },
    { icon: Settings, label: 'Settings', href: '/admin/settings' },
];

export default function AdminDashboardPage() {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const statCards = [
        {
            label: 'Total Visitors',
            value: mockStats.totalVisitors.toLocaleString(),
            icon: Users,
            color: 'var(--neon-cyan)',
            change: '+12%'
        },
        {
            label: 'Active Now',
            value: mockStats.activeUsers,
            icon: Activity,
            color: 'var(--neon-green)',
            change: ''
        },
        {
            label: 'Avg. Session',
            value: mockStats.avgSessionDuration,
            icon: Clock,
            color: 'var(--neon-amber)',
            change: '+8%'
        },
        {
            label: 'Bounce Rate',
            value: mockStats.bounceRate,
            icon: TrendingUp,
            color: 'var(--neon-magenta)',
            change: '-5%'
        },
    ];

    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <aside className="w-64 bg-[var(--void-deep)] border-r border-[var(--glass-border)] p-4 flex flex-col">
                <Link href="/" className="flex items-center gap-3 p-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--neon-cyan)] to-[var(--neon-magenta)] flex items-center justify-center">
                        <span className="font-bold text-lg text-white">N</span>
                    </div>
                    <div>
                        <div className="font-bold font-[family-name:var(--font-display)]">NexusForge</div>
                        <div className="text-xs text-[var(--text-muted)]">Admin Panel</div>
                    </div>
                </Link>

                <nav className="flex-1">
                    {sidebarItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`flex items-center gap-3 p-3 rounded-lg mb-1 transition-colors ${item.active
                                    ? 'bg-[var(--neon-cyan)]/10 text-[var(--neon-cyan)] border border-[var(--neon-cyan)]/30'
                                    : 'text-[var(--text-secondary)] hover:bg-[var(--void-light)] hover:text-[var(--text-primary)]'
                                }`}
                        >
                            <item.icon size={18} />
                            <span className="text-sm">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <button
                    onClick={() => window.location.href = '/admin'}
                    className="flex items-center gap-3 p-3 rounded-lg text-[var(--text-muted)] hover:bg-[var(--void-light)] hover:text-red-400 transition-colors"
                >
                    <LogOut size={18} />
                    <span className="text-sm">Sign Out</span>
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-auto">
                {/* Header */}
                <motion.header
                    className="flex items-center justify-between mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div>
                        <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-1">
                            <Link href="/admin" className="hover:text-[var(--neon-cyan)]">Admin</Link>
                            <ChevronRight size={14} />
                            <span>Dashboard</span>
                        </div>
                        <h1 className="text-2xl font-bold font-[family-name:var(--font-display)]">
                            <GlitchText text="Dashboard" glitchOnHover />
                        </h1>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-[var(--text-muted)]">Current Time</div>
                        <div className="font-mono text-lg text-[var(--neon-cyan)]">
                            {currentTime.toLocaleTimeString()}
                        </div>
                    </div>
                </motion.header>

                {/* Stats Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {statCards.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <HoloCard className="p-4" glowColor={stat.color}>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="text-xs text-[var(--text-muted)] mb-1">{stat.label}</div>
                                        <div className="text-2xl font-bold" style={{ color: stat.color }}>
                                            {stat.value}
                                        </div>
                                        {stat.change && (
                                            <div className={`text-xs mt-1 ${stat.change.startsWith('+') ? 'text-[var(--neon-green)]' : 'text-red-400'}`}>
                                                {stat.change} vs last week
                                            </div>
                                        )}
                                    </div>
                                    <stat.icon className="w-8 h-8" style={{ color: stat.color, opacity: 0.5 }} />
                                </div>
                            </HoloCard>
                        </motion.div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Page Views */}
                    <motion.div
                        className="lg:col-span-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <HoloCard className="p-6 h-full">
                            <h3 className="text-lg font-[family-name:var(--font-display)] mb-4 flex items-center gap-2">
                                <Eye size={18} className="text-[var(--neon-cyan)]" />
                                Page Views
                            </h3>
                            <div className="space-y-3">
                                {Object.entries(mockStats.pageViews).map(([page, views]) => {
                                    const maxViews = Math.max(...Object.values(mockStats.pageViews));
                                    const percentage = (views / maxViews) * 100;
                                    return (
                                        <div key={page}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-[var(--text-secondary)]">{page}</span>
                                                <span className="text-[var(--text-primary)]">{views.toLocaleString()}</span>
                                            </div>
                                            <div className="h-2 bg-[var(--void-light)] rounded-full overflow-hidden">
                                                <motion.div
                                                    className="h-full bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-magenta)]"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${percentage}%` }}
                                                    transition={{ duration: 0.8, delay: 0.5 }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </HoloCard>
                    </motion.div>

                    {/* Traffic Sources */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <HoloCard className="p-6 h-full" glowColor="var(--neon-magenta)">
                            <h3 className="text-lg font-[family-name:var(--font-display)] mb-4 flex items-center gap-2">
                                <Globe size={18} className="text-[var(--neon-magenta)]" />
                                Traffic Sources
                            </h3>
                            <div className="space-y-4">
                                {mockStats.trafficSources.map((source, index) => (
                                    <div key={source.source} className="flex items-center gap-3">
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{
                                                background: index === 0 ? 'var(--neon-cyan)' :
                                                    index === 1 ? 'var(--neon-magenta)' :
                                                        index === 2 ? 'var(--neon-amber)' :
                                                            'var(--text-muted)'
                                            }}
                                        />
                                        <div className="flex-1">
                                            <div className="text-sm text-[var(--text-primary)]">{source.source}</div>
                                        </div>
                                        <div className="text-sm font-mono text-[var(--text-secondary)]">
                                            {source.percentage}%
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </HoloCard>
                    </motion.div>
                </div>

                {/* Recent Visitors */}
                <motion.div
                    className="mt-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <HoloCard className="p-6">
                        <h3 className="text-lg font-[family-name:var(--font-display)] mb-4 flex items-center gap-2">
                            <Users size={18} className="text-[var(--neon-green)]" />
                            Recent Visitors
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-[var(--text-muted)] border-b border-[var(--glass-border)]">
                                        <th className="pb-3">Location</th>
                                        <th className="pb-3">City</th>
                                        <th className="pb-3">Time</th>
                                        <th className="pb-3">Pages Viewed</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mockStats.recentVisitors.map((visitor, index) => (
                                        <tr key={index} className="border-b border-[var(--glass-border)]/50">
                                            <td className="py-3 text-[var(--text-primary)]">{visitor.country}</td>
                                            <td className="py-3 text-[var(--text-secondary)]">{visitor.city}</td>
                                            <td className="py-3 text-[var(--neon-cyan)]">{visitor.time}</td>
                                            <td className="py-3 text-[var(--text-secondary)]">{visitor.pages}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </HoloCard>
                </motion.div>
            </main>
        </div>
    );
}
