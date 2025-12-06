'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Download, Mail, MapPin, Globe, Linkedin, Github,
    Briefcase, GraduationCap, Award, Languages, Code2, Printer
} from 'lucide-react';
import HoloCard from '@/components/ui/HoloCard';
import CyberButton from '@/components/ui/CyberButton';
import GlitchText from '@/components/ui/GlitchText';
import { resumeData } from '@/data/resume';
import { useI18n } from '@/components/providers/I18nProvider';

export default function ResumePage() {
    const resumeRef = useRef<HTMLDivElement>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const { locale } = useI18n();

    // Helper function to get text based on locale
    const t = (text: { en: string; zh: string }) => locale === 'zh' ? text.zh : text.en;

    const handleDownloadPDF = async () => {
        setIsGenerating(true);

        try {
            // Dynamic import to avoid SSR issues
            const html2pdf = (await import('html2pdf.js')).default;

            const element = resumeRef.current;
            if (!element) return;

            const opt = {
                margin: 10,
                filename: `${t(resumeData.basics.name).replace(' ', '_')}_Resume.pdf`,
                image: { type: 'jpeg' as const, quality: 0.98 },
                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    backgroundColor: '#0a0a0f',
                },
                jsPDF: {
                    unit: 'mm',
                    format: 'a4',
                    orientation: 'portrait' as const
                },
            };

            await html2pdf().set(opt).from(element).save();
        } catch (error) {
            console.error('PDF generation failed:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen pt-24 pb-20 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header with actions */}
                <motion.header
                    className="text-center mb-8 print:hidden"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-4xl font-bold font-[family-name:var(--font-display)] mb-4">
                        <GlitchText text={locale === 'zh' ? '简历' : 'Resume'} glitchOnHover />
                    </h1>
                    <p className="text-[var(--text-muted)] mb-6">
                        {locale === 'zh' ? '下载或打印专业简历' : 'Download or print the professional resume'}
                    </p>
                    <div className="flex justify-center gap-4">
                        <CyberButton
                            variant="filled"
                            icon={<Download size={18} />}
                            onClick={handleDownloadPDF}
                            disabled={isGenerating}
                        >
                            {isGenerating
                                ? (locale === 'zh' ? '生成中...' : 'Generating...')
                                : (locale === 'zh' ? '下载 PDF' : 'Download PDF')}
                        </CyberButton>
                        <CyberButton
                            variant="default"
                            icon={<Printer size={18} />}
                            onClick={handlePrint}
                        >
                            {locale === 'zh' ? '打印' : 'Print'}
                        </CyberButton>
                    </div>
                </motion.header>

                {/* Resume Content */}
                <motion.div
                    ref={resumeRef}
                    className="resume-content bg-[var(--void-deep)] rounded-2xl overflow-hidden print:bg-white print:text-black"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <HoloCard className="p-8 sm:p-12 print:shadow-none print:border-none">
                        {/* Header */}
                        <header className="mb-8 pb-8 border-b border-[var(--glass-border)] print:border-gray-300">
                            <h1 className="text-3xl font-bold font-[family-name:var(--font-display)] text-[var(--neon-cyan)] print:text-blue-600 mb-2">
                                {t(resumeData.basics.name)}
                            </h1>
                            <h2 className="text-xl text-[var(--text-secondary)] print:text-gray-700 mb-4">
                                {t(resumeData.basics.title)}
                            </h2>

                            <div className="flex flex-wrap gap-4 text-sm text-[var(--text-muted)] print:text-gray-600">
                                <a href={`mailto:${resumeData.basics.email}`} className="flex items-center gap-2 hover:text-[var(--neon-cyan)] print:text-gray-600">
                                    <Mail size={14} />
                                    {resumeData.basics.email}
                                </a>
                                <span className="flex items-center gap-2">
                                    <MapPin size={14} />
                                    {t(resumeData.basics.location)}
                                </span>
                                <a href={resumeData.basics.website} className="flex items-center gap-2 hover:text-[var(--neon-cyan)] print:text-gray-600">
                                    <Globe size={14} />
                                    {resumeData.basics.website.replace('https://', '')}
                                </a>
                            </div>

                            <div className="flex gap-4 mt-4 print:hidden">
                                {resumeData.basics.profiles.map(profile => (
                                    <a
                                        key={profile.network}
                                        href={profile.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[var(--text-muted)] hover:text-[var(--neon-cyan)] transition-colors"
                                    >
                                        {profile.network === 'GitHub' && <Github size={18} />}
                                        {profile.network === 'LinkedIn' && <Linkedin size={18} />}
                                    </a>
                                ))}
                            </div>
                        </header>

                        {/* Summary */}
                        <section className="mb-8">
                            <p className="text-[var(--text-secondary)] print:text-gray-700 leading-relaxed">
                                {t(resumeData.basics.summary)}
                            </p>
                        </section>

                        {/* Experience */}
                        <section className="mb-8">
                            <h3 className="text-lg font-bold font-[family-name:var(--font-display)] mb-4 flex items-center gap-2 text-[var(--text-primary)] print:text-black">
                                <Briefcase size={18} className="text-[var(--neon-cyan)] print:text-blue-600" />
                                {t(resumeData.sectionTitles.experience)}
                            </h3>
                            <div className="space-y-6">
                                {resumeData.experience.map((exp, index) => (
                                    <div key={index} className="relative pl-4 border-l-2 border-[var(--glass-border)] print:border-gray-300">
                                        <div className="flex flex-wrap justify-between items-start mb-2">
                                            <div>
                                                <h4 className="font-semibold text-[var(--text-primary)] print:text-black">
                                                    {t(exp.position)}
                                                </h4>
                                                <div className="text-sm text-[var(--neon-cyan)] print:text-blue-600">
                                                    {t(exp.company)} • {t(exp.location)}
                                                </div>
                                            </div>
                                            <div className="text-sm text-[var(--text-muted)] print:text-gray-500">
                                                {exp.startDate} - {t(exp.endDate)}
                                            </div>
                                        </div>
                                        <ul className="space-y-1">
                                            {(locale === 'zh' ? exp.highlights.zh : exp.highlights.en).map((highlight, i) => (
                                                <li key={i} className="text-sm text-[var(--text-secondary)] print:text-gray-700 flex items-start gap-2">
                                                    <span className="text-[var(--neon-cyan)] print:text-blue-600 mt-1">•</span>
                                                    {highlight}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Skills */}
                        <section className="mb-8">
                            <h3 className="text-lg font-bold font-[family-name:var(--font-display)] mb-4 flex items-center gap-2 text-[var(--text-primary)] print:text-black">
                                <Code2 size={18} className="text-[var(--neon-magenta)] print:text-purple-600" />
                                {t(resumeData.sectionTitles.skills)}
                            </h3>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {resumeData.skills.map((skill, index) => (
                                    <div key={index}>
                                        <div className="text-sm font-semibold text-[var(--neon-cyan)] print:text-blue-600 mb-1">
                                            {t(skill.category)}
                                        </div>
                                        <div className="text-sm text-[var(--text-secondary)] print:text-gray-700">
                                            {skill.items.join(' • ')}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Education */}
                        <section className="mb-8">
                            <h3 className="text-lg font-bold font-[family-name:var(--font-display)] mb-4 flex items-center gap-2 text-[var(--text-primary)] print:text-black">
                                <GraduationCap size={18} className="text-[var(--neon-amber)] print:text-amber-600" />
                                {t(resumeData.sectionTitles.education)}
                            </h3>
                            <div className="space-y-4">
                                {resumeData.education.map((edu, index) => (
                                    <div key={index} className="flex flex-wrap justify-between">
                                        <div>
                                            <div className="font-semibold text-[var(--text-primary)] print:text-black">
                                                {t(edu.degree)} {locale === 'zh' ? '' : 'in '}{t(edu.field)}
                                            </div>
                                            <div className="text-sm text-[var(--text-secondary)] print:text-gray-700">
                                                {t(edu.institution)} • {t(edu.location)}
                                            </div>
                                        </div>
                                        <div className="text-sm text-[var(--text-muted)] print:text-gray-500">
                                            {edu.startDate} - {edu.endDate}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Certifications */}
                        <section className="mb-8">
                            <h3 className="text-lg font-bold font-[family-name:var(--font-display)] mb-4 flex items-center gap-2 text-[var(--text-primary)] print:text-black">
                                <Award size={18} className="text-[var(--neon-green)] print:text-green-600" />
                                {t(resumeData.sectionTitles.certifications)}
                            </h3>
                            <div className="grid sm:grid-cols-3 gap-4">
                                {resumeData.certifications.map((cert, index) => (
                                    <div key={index} className="text-sm">
                                        <div className="font-semibold text-[var(--text-primary)] print:text-black">
                                            {cert.name}
                                        </div>
                                        <div className="text-[var(--text-muted)] print:text-gray-500">
                                            {cert.issuer} • {cert.date}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Languages */}
                        <section>
                            <h3 className="text-lg font-bold font-[family-name:var(--font-display)] mb-4 flex items-center gap-2 text-[var(--text-primary)] print:text-black">
                                <Languages size={18} className="text-[var(--neon-purple)] print:text-purple-600" />
                                {t(resumeData.sectionTitles.languages)}
                            </h3>
                            <div className="flex gap-6">
                                {resumeData.languages.map((lang, index) => (
                                    <div key={index} className="text-sm">
                                        <span className="font-semibold text-[var(--text-primary)] print:text-black">{t(lang.language)}</span>
                                        <span className="text-[var(--text-muted)] print:text-gray-500"> - {t(lang.proficiency)}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </HoloCard>
                </motion.div>

                {/* Print Styles Info */}
                <p className="text-center text-sm text-[var(--text-muted)] mt-6 print:hidden">
                    {locale === 'zh'
                        ? '简历已针对屏幕浏览和打印进行优化'
                        : 'The resume is optimized for both screen viewing and printing'}
                </p>
            </div>

            {/* Print-specific styles */}
            <style jsx global>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          .resume-content {
            box-shadow: none !important;
            border: none !important;
          }
          nav, footer, .particles-container {
            display: none !important;
          }
          main {
            padding: 0 !important;
          }
        }
      `}</style>
        </div>
    );
}
