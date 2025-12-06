// Resume data structure with bilingual support
import { profile } from './profile';

export interface BilingualText {
    en: string;
    zh: string;
}

export interface ResumeData {
    basics: {
        name: BilingualText;
        title: BilingualText;
        email: string;
        location: BilingualText;
        website: string;
        summary: BilingualText;
        profiles: {
            network: string;
            url: string;
        }[];
    };
    experience: {
        company: BilingualText;
        position: BilingualText;
        location: BilingualText;
        startDate: string;
        endDate: BilingualText;
        highlights: {
            en: string[];
            zh: string[];
        };
    }[];
    education: {
        institution: BilingualText;
        degree: BilingualText;
        field: BilingualText;
        startDate: string;
        endDate: string;
        location: BilingualText;
    }[];
    skills: {
        category: BilingualText;
        items: string[];
    }[];
    certifications: {
        name: string;
        issuer: string;
        date: string;
    }[];
    languages: {
        language: BilingualText;
        proficiency: BilingualText;
    }[];
    sectionTitles: {
        experience: BilingualText;
        skills: BilingualText;
        education: BilingualText;
        certifications: BilingualText;
        languages: BilingualText;
    };
}

export const resumeData: ResumeData = {
    basics: {
        name: profile.name,
        title: {
            en: 'Creative Engineer & Full-Stack Developer',
            zh: '创意工程师 & 全栈开发者'
        },
        email: profile.contact.email,
        location: profile.contact.location,
        website: 'https://nexusforge.dev',
        summary: profile.bio,
        profiles: [
            { network: 'GitHub', url: profile.contact.github },
            { network: 'LinkedIn', url: profile.contact.linkedin },
            { network: 'Twitter', url: profile.contact.twitter },
        ],
    },
    sectionTitles: {
        experience: { en: 'Professional Experience', zh: '工作经历' },
        skills: { en: 'Technical Skills', zh: '技术技能' },
        education: { en: 'Education', zh: '教育背景' },
        certifications: { en: 'Certifications', zh: '专业认证' },
        languages: { en: 'Languages', zh: '语言能力' },
    },
    experience: [
        {
            company: { en: 'Enterprise Tech Solutions', zh: '企业科技解决方案有限公司' },
            position: { en: 'Technical Lead & Project Director', zh: '技术负责人 & 项目总监' },
            location: { en: 'Shanghai, China', zh: '中国上海' },
            startDate: '2024',
            endDate: { en: 'Present', zh: '至今' },
            highlights: {
                en: [
                    'Led development of Smart City Digital Twin Platform serving 50+ government departments',
                    'Architected real-time visualization system processing 10M+ IoT sensors',
                    'Managed cross-functional team of 10+ engineers and designers',
                    'Reduced urban incident response time by 40% through AI-powered analytics',
                ],
                zh: [
                    '领导智慧城市数字孪生平台开发，服务50+政府部门',
                    '架构实时可视化系统，处理1000万+物联网传感器数据',
                    '管理10+工程师和设计师的跨职能团队',
                    '通过AI驱动分析，将城市事件响应时间缩短40%',
                ],
            },
        },
        {
            company: { en: 'Digital Innovation Lab', zh: '数字创新实验室' },
            position: { en: 'Senior Full-Stack Engineer', zh: '高级全栈工程师' },
            location: { en: 'Shanghai, China', zh: '中国上海' },
            startDate: '2023',
            endDate: { en: '2024', zh: '2024' },
            highlights: {
                en: [
                    'Developed Industrial Metaverse Platform reducing equipment downtime by 35%',
                    'Implemented WebGL/WebGPU visualization engine for massive 3D datasets',
                    'Created VR training modules deployed to 5000+ workers',
                    'Established front-end architecture standards and code review practices',
                ],
                zh: [
                    '开发工业元宇宙平台，设备停机时间减少35%',
                    '实现WebGL/WebGPU可视化引擎，处理大规模3D数据集',
                    '创建VR培训模块，部署至5000+工人',
                    '建立前端架构标准和代码审查流程',
                ],
            },
        },
        {
            company: { en: 'GeoTech Systems', zh: '地理科技系统公司' },
            position: { en: 'Visualization Engineer', zh: '可视化工程师' },
            location: { en: 'Shanghai, China', zh: '中国上海' },
            startDate: '2019',
            endDate: { en: '2023', zh: '2023' },
            highlights: {
                en: [
                    'Built GIS analytics platform processing 50TB+ spatial data daily',
                    'Developed custom WebGL shaders for high-performance map rendering',
                    'Optimized Cesium.js for large-scale 3D terrain visualization',
                    'Collaborated with Fortune 500 clients on enterprise solutions',
                ],
                zh: [
                    '构建GIS分析平台，日处理50TB+空间数据',
                    '开发自定义WebGL着色器，实现高性能地图渲染',
                    '优化Cesium.js用于大规模3D地形可视化',
                    '与世界500强客户合作开发企业解决方案',
                ],
            },
        },
    ],
    education: [
        {
            institution: { en: 'University of Technology', zh: '理工大学' },
            degree: { en: 'Master of Science', zh: '理学硕士' },
            field: { en: 'Computer Science', zh: '计算机科学' },
            startDate: '2021',
            endDate: '2023',
            location: { en: 'International', zh: '海外' },
        },
        {
            institution: { en: 'Zhejiang Wanli University', zh: '浙江万里学院' },
            degree: { en: 'Bachelor of Management', zh: '管理学学士' },
            field: { en: 'Information Management & Information Systems', zh: '信息管理与信息系统' },
            startDate: '2015',
            endDate: '2019',
            location: { en: 'China', zh: '中国' },
        },
    ],
    skills: [
        {
            category: { en: 'Frontend', zh: '前端开发' },
            items: ['React', 'Next.js', 'Vue', 'TypeScript', 'Three.js', 'WebGL/WebGPU', 'GSAP'],
        },
        {
            category: { en: 'Visualization', zh: '可视化' },
            items: ['Digital Twin', 'GIS (Cesium, Mapbox)', 'ECharts', 'D3.js', 'Shader/GLSL'],
        },
        {
            category: { en: 'Backend', zh: '后端开发' },
            items: ['Node.js', 'Python', 'PostgreSQL', 'GraphQL', 'Redis', 'Kafka'],
        },
        {
            category: { en: 'AI/ML', zh: '人工智能' },
            items: ['LLM Integration', 'Computer Vision', 'TensorFlow', 'Prompt Engineering'],
        },
        {
            category: { en: 'DevOps', zh: '运维部署' },
            items: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Monitoring'],
        },
    ],
    certifications: [
        { name: 'AWS Solutions Architect', issuer: 'Amazon Web Services', date: '2023' },
        { name: 'Google Cloud Professional', issuer: 'Google', date: '2022' },
        { name: 'Certified Kubernetes Administrator', issuer: 'CNCF', date: '2022' },
    ],
    languages: [
        { language: { en: 'Chinese', zh: '中文' }, proficiency: { en: 'Native', zh: '母语' } },
        { language: { en: 'English', zh: '英语' }, proficiency: { en: 'Fluent', zh: '熟练' } },
    ],
};
