'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, ArrowRight, Sparkles, Zap, Globe, Code2 } from 'lucide-react';
import GlitchText from '@/components/ui/GlitchText';
import CyberButton from '@/components/ui/CyberButton';
import HoloCard from '@/components/ui/HoloCard';
import { profile } from '@/data/profile';
import { useI18n } from '@/components/providers/I18nProvider';
import Link from 'next/link';

export default function HomePage() {
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [introComplete, setIntroComplete] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { locale, t } = useI18n();

  // Get titles based on locale
  const typingTitles = profile.titles.map(title => locale === 'zh' ? title.zh : title.en);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.9]);
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -50]);

  // Rotate through titles
  useEffect(() => {
    if (!introComplete) return;

    const interval = setInterval(() => {
      setCurrentTitleIndex((prev) => (prev + 1) % typingTitles.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [introComplete, typingTitles.length]);

  // Intro sequence timing
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
      setTimeout(() => setIntroComplete(true), 500);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  // Boot sequence text based on locale
  const bootSequence = locale === 'zh' ? [
    '> 正在初始化 NexusForge v2.0...',
    '> 加载神经接口...',
    '> 建立量子链接...',
    '> 系统就绪。欢迎，访客。'
  ] : [
    '> Initializing NexusForge v2.0...',
    '> Loading neural interface...',
    '> Establishing quantum link...',
    '> System ready. Welcome, visitor.'
  ];

  return (
    <div ref={containerRef} className="relative">
      {/* Intro Sequence Overlay */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--void-deepest)]"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="text-center">
              {/* Boot sequence text */}
              <motion.div
                className="font-mono text-sm text-[var(--neon-cyan)] mb-8 space-y-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {bootSequence.map((text, index) => (
                  <motion.p
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.5 }}
                    className={index === 3 ? 'text-[var(--neon-green)]' : ''}
                  >
                    {text}
                  </motion.p>
                ))}
              </motion.div>

              {/* Loading bar */}
              <motion.div
                className="w-64 h-1 bg-[var(--void-light)] rounded-full overflow-hidden mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <motion.div
                  className="h-full bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-magenta)]"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2.5, delay: 0.5, ease: 'easeInOut' }}
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <motion.section
        className="relative min-h-screen flex items-center justify-center px-4 pt-20"
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
      >
        <div className="max-w-6xl mx-auto text-center">
          {/* Floating badges */}
          <motion.div
            className="flex flex-wrap justify-center gap-3 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: introComplete ? 1 : 0, y: introComplete ? 0 : 20 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {profile.domains.slice(0, 4).map((domain, index) => (
              <motion.span
                key={domain.name.en}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
                  bg-[var(--glass-bg)] border border-[var(--glass-border)] 
                  text-xs font-mono text-[var(--text-secondary)]
                  backdrop-blur-sm"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <span>{domain.icon}</span>
                <span>{locale === 'zh' ? domain.name.zh : domain.name.en}</span>
              </motion.span>
            ))}
          </motion.div>

          {/* Main title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: introComplete ? 1 : 0, y: introComplete ? 0 : 30 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6">
              <GlitchText
                text={locale === 'zh' ? profile.name.zh : profile.name.en}
                className="text-neon-cyan font-[family-name:var(--font-display)]"
                glitchOnHover
                as="span"
              />
            </h1>
          </motion.div>

          {/* Rotating titles */}
          <motion.div
            className="h-12 mb-8 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: introComplete ? 1 : 0 }}
            transition={{ delay: 0.6 }}
          >
            <AnimatePresence mode="wait">
              <motion.p
                key={`${currentTitleIndex}-${locale}`}
                className="text-xl sm:text-2xl md:text-3xl font-[family-name:var(--font-display)] text-[var(--text-secondary)]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                {typingTitles[currentTitleIndex]}
              </motion.p>
            </AnimatePresence>
          </motion.div>

          {/* Tagline */}
          <motion.p
            className="text-lg sm:text-xl text-[var(--text-muted)] max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: introComplete ? 1 : 0, y: introComplete ? 0 : 20 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            {locale === 'zh' ? profile.tagline.zh : profile.tagline.en}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: introComplete ? 1 : 0, y: introComplete ? 0 : 20 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <Link href="/portfolio">
              <CyberButton
                variant="filled"
                size="lg"
                glitch
                icon={<Sparkles size={18} />}
              >
                {locale === 'zh' ? '查看作品集' : 'View Portfolio'}
              </CyberButton>
            </Link>
            <Link href="/contact">
              <CyberButton
                variant="default"
                size="lg"
                icon={<ArrowRight size={18} />}
                iconPosition="right"
              >
                {locale === 'zh' ? '联系我' : 'Get in Touch'}
              </CyberButton>
            </Link>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: introComplete ? 1 : 0 }}
            transition={{ delay: 1.5 }}
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex flex-col items-center gap-2 text-[var(--text-muted)]"
            >
              <span className="text-xs font-mono tracking-widest">
                {locale === 'zh' ? '向下滚动' : 'SCROLL'}
              </span>
              <ChevronDown size={20} />
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* About Section */}
      <section className="relative py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="flex items-center gap-4 mb-12">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[var(--neon-cyan)]" />
              <h2 className="text-3xl sm:text-4xl font-[family-name:var(--font-display)] text-center">
                <span className="text-[var(--neon-cyan)]">{'< '}</span>
                {locale === 'zh' ? '关于我' : 'About Me'}
                <span className="text-[var(--neon-cyan)]">{' />'}</span>
              </h2>
              <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[var(--neon-cyan)]" />
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {/* Bio card */}
              <HoloCard className="p-8">
                <p className="text-[var(--text-secondary)] leading-relaxed text-lg">
                  {locale === 'zh' ? profile.bio.zh : profile.bio.en}
                </p>
              </HoloCard>

              {/* Stats card */}
              <HoloCard className="p-8" glowColor="var(--neon-magenta)">
                <h3 className="text-xl font-[family-name:var(--font-display)] text-[var(--neon-magenta)] mb-6">
                  {locale === 'zh' ? '快速统计' : 'Quick Stats'}
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  {profile.achievements.slice(0, 4).map((achievement, index) => (
                    <motion.div
                      key={achievement.title.en}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="text-center"
                    >
                      <div className="text-3xl mb-2">{achievement.icon}</div>
                      <div className="text-sm font-semibold text-[var(--text-primary)]">
                        {locale === 'zh' ? achievement.title.zh : achievement.title.en}
                      </div>
                      <div className="text-xs text-[var(--text-muted)]">
                        {locale === 'zh' ? achievement.description.zh : achievement.description.en}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </HoloCard>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Domains Section */}
      <section className="relative py-32 px-4 bg-gradient-to-b from-transparent via-[var(--void-light)]/20 to-transparent">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-3xl sm:text-4xl font-[family-name:var(--font-display)] text-center mb-4">
              {locale === 'zh' ? '专业领域' : 'Expertise Domains'}
            </h2>
            <p className="text-center text-[var(--text-muted)] mb-12 max-w-xl mx-auto">
              {locale === 'zh'
                ? '跨越前沿技术垂直领域的专业知识'
                : 'Specialized knowledge across cutting-edge technology verticals'}
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {profile.domains.map((domain, index) => (
                <motion.div
                  key={domain.name.en}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <HoloCard className="p-6 h-full group cursor-pointer">
                    <div className="text-4xl mb-4 transform transition-transform group-hover:scale-110">
                      {domain.icon}
                    </div>
                    <h3 className="text-lg font-[family-name:var(--font-display)] text-[var(--text-primary)] mb-2">
                      {locale === 'zh' ? domain.name.zh : domain.name.en}
                    </h3>
                    <p className="text-sm text-[var(--text-muted)]">
                      {locale === 'zh' ? domain.description.zh : domain.description.en}
                    </p>
                  </HoloCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <HoloCard className="p-12">
              <Zap className="w-12 h-12 mx-auto mb-6 text-[var(--neon-amber)]" />
              <h2 className="text-3xl sm:text-4xl font-[family-name:var(--font-display)] mb-4">
                {locale === 'zh' ? '准备好创造' : 'Ready to Build Something'}
                <span className="text-neon-cyan">
                  {locale === 'zh' ? '精彩' : ' Amazing'}
                </span>
                {locale === 'zh' ? '的作品了吗？' : '?'}
              </h2>
              <p className="text-[var(--text-muted)] mb-8 max-w-lg mx-auto">
                {locale === 'zh'
                  ? '无论您有项目想法还是只想聊聊技术，我总是很高兴与其他创作者建立联系。'
                  : "Whether you have a project in mind or just want to chat about technology, I'm always excited to connect with fellow creators."}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/portfolio">
                  <CyberButton variant="default" icon={<Globe size={18} />}>
                    {locale === 'zh' ? '探索项目' : 'Explore Projects'}
                  </CyberButton>
                </Link>
                <Link href="/codelab">
                  <CyberButton variant="magenta" icon={<Code2 size={18} />}>
                    {locale === 'zh' ? '查看代码库' : 'View Code Library'}
                  </CyberButton>
                </Link>
              </div>
            </HoloCard>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-4 border-t border-[var(--glass-border)]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[var(--text-muted)]">
            <div>
              © {new Date().getFullYear()} Witt. {locale === 'zh' ? '版权所有' : 'All rights reserved'}.
            </div>
            <div className="flex items-center gap-6">
              <a
                href={profile.contact.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--neon-cyan)] transition-colors"
              >
                GitHub
              </a>
              <a
                href={profile.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--neon-cyan)] transition-colors"
              >
                LinkedIn
              </a>
              <a
                href={profile.contact.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--neon-cyan)] transition-colors"
              >
                Twitter
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}


