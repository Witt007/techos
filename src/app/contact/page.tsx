'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mail, Github, Linkedin, Twitter, MapPin, Send,
    MessageSquare, Bot, User, Loader2, Sparkles
} from 'lucide-react';
import HoloCard from '@/components/ui/HoloCard';
import CyberButton from '@/components/ui/CyberButton';
import GlitchText from '@/components/ui/GlitchText';
import { profile } from '@/data/profile';
import { useI18n } from '@/components/providers/I18nProvider';

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

const initialMessages: ChatMessage[] = [
    {
        role: 'assistant',
        content: "Hello! I'm the Techos AI assistant. I can help you learn more about Witt's work, answer questions about his projects, or help you get in touch. How can I assist you today?",
        timestamp: new Date(),
    },
];

const quickQuestions = [
    "What's Witt's tech stack?",
    "Tell me about digital twin projects",
    "How to contact Witt?",
    "What services are offered?",
];

export default function ContactPage() {
    const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showChat, setShowChat] = useState(true);
    const [audioEnabled, setAudioEnabled] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { locale } = useI18n();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (content: string) => {
        if (!content.trim() || isLoading) return;

        const userMessage: ChatMessage = {
            role: 'user',
            content: content.trim(),
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // Call the AI API
            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: content.trim(),
                    history: messages.map(m => ({
                        role: m.role,
                        content: m.content,
                    })),
                }),
            });

            const data = await response.json();

            const aiMessage: ChatMessage = {
                role: 'assistant',
                content: data.response || "I apologize, but I couldn't process that request. Please try again.",
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error('AI chat error:', error);
            const errorMessage: ChatMessage = {
                role: 'assistant',
                content: "I'm having trouble connecting right now. Please try again or use the contact form to reach Alex directly.",
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
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
                        <MessageSquare size={14} />
                        <span>{locale === 'zh' ? '联系我' : "Let's Connect"}</span>
                    </motion.div>

                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
                        <GlitchText
                            text={locale === 'zh' ? '联系' : 'Contact'}
                            className="font-[family-name:var(--font-display)]"
                            glitchOnHover
                        />
                    </h1>
                    <p className="text-[var(--text-muted)] max-w-2xl mx-auto text-lg">
                        {locale === 'zh'
                            ? '有项目想法？让我们讨论如何合作将您的愿景变为现实。'
                            : "Have a project in mind? Let's discuss how we can work together to bring your vision to life."}
                    </p>
                </motion.header>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Contact Info & Form */}
                    <motion.div
                        className="space-y-6"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                    >
                        {/* Contact Cards */}
                        <div className="grid sm:grid-cols-2 gap-4">
                            <HoloCard className="p-4">
                                <Mail className="w-6 h-6 text-[var(--neon-cyan)] mb-2" />
                                <div className="text-sm text-[var(--text-muted)]">{locale === 'zh' ? '邮箱' : 'Email'}</div>
                                <a
                                    href={`mailto:${profile.contact.email}`}
                                    className="text-[var(--text-primary)] hover:text-[var(--neon-cyan)] transition-colors"
                                >
                                    {profile.contact.email}
                                </a>
                            </HoloCard>

                            <HoloCard className="p-4" glowColor="var(--neon-magenta)">
                                <MapPin className="w-6 h-6 text-[var(--neon-magenta)] mb-2" />
                                <div className="text-sm text-[var(--text-muted)]">{locale === 'zh' ? '位置' : 'Location'}</div>
                                <div className="text-[var(--text-primary)]">
                                    {locale === 'zh' ? profile.contact.location.zh : profile.contact.location.en}
                                </div>
                            </HoloCard>
                        </div>

                        {/* Social Links */}
                        <HoloCard className="p-6">
                            <h3 className="text-lg font-[family-name:var(--font-display)] mb-4">
                                {locale === 'zh' ? '社交媒体' : 'Connect on Social'}
                            </h3>
                            <div className="flex gap-4">
                                {[
                                    { icon: Github, href: profile.contact.github, label: 'GitHub' },
                                    { icon: Linkedin, href: profile.contact.linkedin, label: 'LinkedIn' },
                                    { icon: Twitter, href: profile.contact.twitter, label: 'Twitter' },
                                ].map(({ icon: Icon, href, label }) => (
                                    <a
                                        key={label}
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--void-light)] text-[var(--text-secondary)] hover:text-[var(--neon-cyan)] hover:bg-[var(--void-lighter)] transition-all"
                                    >
                                        <Icon size={18} />
                                        <span className="text-sm">{label}</span>
                                    </a>
                                ))}
                            </div>
                        </HoloCard>

                        {/* Contact Form */}
                        <HoloCard className="p-6">
                            <h3 className="text-lg font-[family-name:var(--font-display)] mb-4">
                                {locale === 'zh' ? '发送消息' : 'Send a Message'}
                            </h3>
                            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); }}>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder={locale === 'zh' ? '您的姓名' : 'Your Name'}
                                        className="w-full px-4 py-3 rounded-lg bg-[var(--void-light)] border border-[var(--glass-border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--neon-cyan)] focus:outline-none transition-colors"
                                    />
                                    <input
                                        type="email"
                                        placeholder={locale === 'zh' ? '您的邮箱' : 'Your Email'}
                                        className="w-full px-4 py-3 rounded-lg bg-[var(--void-light)] border border-[var(--glass-border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--neon-cyan)] focus:outline-none transition-colors"
                                    />
                                </div>
                                <input
                                    type="text"
                                    placeholder={locale === 'zh' ? '主题' : 'Subject'}
                                    className="w-full px-4 py-3 rounded-lg bg-[var(--void-light)] border border-[var(--glass-border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--neon-cyan)] focus:outline-none transition-colors"
                                />
                                <textarea
                                    placeholder={locale === 'zh' ? '您的消息' : 'Your Message'}
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-lg bg-[var(--void-light)] border border-[var(--glass-border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--neon-cyan)] focus:outline-none transition-colors resize-none"
                                />
                                <CyberButton variant="filled" className="w-full" icon={<Send size={18} />}>
                                    {locale === 'zh' ? '发送消息' : 'Send Message'}
                                </CyberButton>
                            </form>
                        </HoloCard>
                    </motion.div>

                    {/* AI Chat */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                    >
                        <HoloCard className="h-[700px] flex flex-col overflow-hidden" glowColor="var(--neon-purple)">
                            {/* Chat Header */}
                            <div className="p-4 border-b border-[var(--glass-border)] flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--neon-cyan)] to-[var(--neon-magenta)] flex items-center justify-center">
                                        <Bot size={20} className="text-[var(--void-deepest)]" />
                                    </div>
                                    <div>
                                        <div className="font-semibold flex items-center gap-2">
                                            {locale === 'zh' ? 'AI 助手' : 'AI Assistant'}
                                            <Sparkles size={14} className="text-[var(--neon-amber)]" />
                                        </div>
                                        <div className="text-xs text-[var(--neon-green)]">{locale === 'zh' ? '在线' : 'Online'}</div>
                                    </div>
                                </div>
                                <div className="text-xs text-[var(--text-muted)]">
                                    Powered by Gemini
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                <AnimatePresence>
                                    {messages.map((message, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                                        >
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${message.role === 'user'
                                                ? 'bg-[var(--neon-cyan)]'
                                                : 'bg-gradient-to-br from-[var(--neon-purple)] to-[var(--neon-magenta)]'
                                                }`}>
                                                {message.role === 'user'
                                                    ? <User size={16} className="text-[var(--void-deepest)]" />
                                                    : <Bot size={16} className="text-white" />
                                                }
                                            </div>
                                            <div className={`max-w-[80%] p-3 rounded-xl ${message.role === 'user'
                                                ? 'bg-[var(--neon-cyan)] text-[var(--void-deepest)]'
                                                : 'bg-[var(--void-light)] text-[var(--text-primary)]'
                                                }`}>
                                                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                                <div className={`text-xs mt-1 ${message.role === 'user' ? 'text-[var(--void-base)]' : 'text-[var(--text-muted)]'
                                                    }`}>
                                                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>

                                {isLoading && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex gap-3"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--neon-purple)] to-[var(--neon-magenta)] flex items-center justify-center">
                                            <Bot size={16} className="text-white" />
                                        </div>
                                        <div className="bg-[var(--void-light)] p-3 rounded-xl">
                                            <Loader2 className="w-5 h-5 animate-spin text-[var(--neon-cyan)]" />
                                        </div>
                                    </motion.div>
                                )}

                                <div ref={messagesEndRef} />
                            </div>

                            {/* Quick Questions */}
                            {messages.length <= 2 && (
                                <div className="px-4 pb-2">
                                    <div className="text-xs text-[var(--text-muted)] mb-2">Quick questions:</div>
                                    <div className="flex flex-wrap gap-2">
                                        {quickQuestions.map((q) => (
                                            <button
                                                key={q}
                                                onClick={() => handleSendMessage(q)}
                                                className="px-3 py-1 text-xs rounded-full bg-[var(--void-light)] text-[var(--text-secondary)] hover:bg-[var(--void-lighter)] hover:text-[var(--neon-cyan)] transition-colors"
                                            >
                                                {q}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Input */}
                            <div className="p-4 border-t border-[var(--glass-border)]">
                                <form
                                    className="flex gap-2"
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handleSendMessage(input);
                                    }}
                                >
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="Ask me anything..."
                                        disabled={isLoading}
                                        className="flex-1 px-4 py-3 rounded-lg bg-[var(--void-light)] border border-[var(--glass-border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--neon-cyan)] focus:outline-none transition-colors disabled:opacity-50"
                                    />
                                    <CyberButton
                                        type="submit"
                                        variant="filled"
                                        disabled={isLoading || !input.trim()}
                                    >
                                        <Send size={18} />
                                    </CyberButton>
                                </form>
                            </div>
                        </HoloCard>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
