// Portfolio projects data
// 项目作品集数据

export interface Project {
    id: string;
    title: {
        en: string;
        zh: string;
    };
    subtitle: {
        en: string;
        zh: string;
    };
    description: {
        en: string;
        zh: string;
    };
    category: 'digital-twin' | 'gis' | 'data-vis' | 'ai' | 'web' | '3d';
    techStack: string[];
    image: string;
    color: string;
    featured: boolean;
    year: number;
    role: {
        en: string;
        zh: string;
    };
    highlights: {
        en: string[];
        zh: string[];
    };
    links?: {
        demo?: string;
        github?: string;
        case?: string;
    };
}

export const projects: Project[] = [
    {
        id: 'smart-city-twin',
        title: {
            en: 'Smart City Digital Twin Platform',
            zh: '智慧城市数字孪生平台',
        },
        subtitle: {
            en: 'Government-Enterprise Collaboration',
            zh: '政企合作项目',
        },
        description: {
            en: 'A comprehensive digital twin platform for urban management, integrating real-time IoT data, 3D city models, and AI-powered analytics for decision support.',
            zh: '综合性城市管理数字孪生平台，集成实时物联网数据、三维城市模型和AI智能分析，为决策提供支持。',
        },
        category: 'digital-twin',
        techStack: ['Three.js', 'Cesium', 'React', 'Node.js', 'PostgreSQL', 'Redis', 'Kafka'],
        image: '/projects/smart-city.jpg',
        color: '#00fff5',
        featured: true,
        year: 2023,
        role: {
            en: 'Technical Lead & Architect',
            zh: '技术负责人 & 架构师',
        },
        highlights: {
            en: [
                'Real-time visualization of 10M+ IoT sensors',
                'AI-powered traffic prediction with 95% accuracy',
                'Reduced urban incident response time by 40%',
                '100+ government departments integrated',
            ],
            zh: [
                '1000万+物联网传感器实时可视化',
                'AI交通预测准确率达95%',
                '城市事件响应时间缩短40%',
                '100+政府部门数据集成',
            ],
        },
        links: {
            demo: 'https://demo.example.com/smart-city',
        },
    },
    {
        id: 'industrial-metaverse',
        title: {
            en: 'Industrial Metaverse Platform',
            zh: '工业元宇宙平台',
        },
        subtitle: {
            en: 'Enterprise Digital Transformation',
            zh: '企业数字化转型',
        },
        description: {
            en: 'Next-generation industrial visualization platform combining digital twin technology with immersive VR/AR experiences for manufacturing optimization.',
            zh: '新一代工业可视化平台，结合数字孪生技术与沉浸式VR/AR体验，优化制造流程。',
        },
        category: 'digital-twin',
        techStack: ['Unity', 'WebXR', 'Three.js', 'Python', 'TensorFlow', 'InfluxDB'],
        image: '/projects/industrial.jpg',
        color: '#ff00ff',
        featured: true,
        year: 2023,
        role: {
            en: 'Project Director',
            zh: '项目主管',
        },
        highlights: {
            en: [
                'Reduced equipment downtime by 35%',
                'Real-time predictive maintenance alerts',
                'VR training modules for 5000+ workers',
                'Cross-platform deployment (Web, VR, Mobile)',
            ],
            zh: [
                '设备停机时间减少35%',
                '实时预测性维护预警',
                '5000+工人VR培训模块',
                '跨平台部署（Web、VR、移动端）',
            ],
        },
    },
    {
        id: 'geo-analytics',
        title: {
            en: 'GeoSpatial Analytics Engine',
            zh: '地理空间分析引擎',
        },
        subtitle: {
            en: 'Big Data GIS Platform',
            zh: '大数据GIS平台',
        },
        description: {
            en: 'High-performance spatial analytics platform processing petabytes of geospatial data with real-time visualization and machine learning integration.',
            zh: '高性能空间分析平台，处理PB级地理空间数据，支持实时可视化和机器学习集成。',
        },
        category: 'gis',
        techStack: ['Mapbox GL', 'Deck.gl', 'Apache Spark', 'PostGIS', 'Python', 'React'],
        image: '/projects/geo-analytics.jpg',
        color: '#ffd700',
        featured: true,
        year: 2022,
        role: {
            en: 'Full-Stack Lead',
            zh: '全栈技术负责人',
        },
        highlights: {
            en: [
                'Process 50TB+ spatial data daily',
                'Sub-second query response time',
                'Custom WebGL shaders for visualization',
                'Served by Fortune 500 enterprises',
            ],
            zh: [
                '日处理50TB+空间数据',
                '亚秒级查询响应时间',
                '自定义WebGL着色器可视化',
                '服务于世界500强企业',
            ],
        },
    },
    {
        id: 'ai-command-center',
        title: {
            en: 'AI-Powered Command Center',
            zh: 'AI智能指挥中心',
        },
        subtitle: {
            en: 'Big Screen Data Visualization',
            zh: '大屏数据可视化',
        },
        description: {
            en: 'Immersive command center with AI-driven insights, multi-source data fusion, and stunning visual effects for enterprise decision-making.',
            zh: '沉浸式指挥中心，融合AI驱动洞察、多源数据融合及震撼视觉效果，支撑企业决策。',
        },
        category: 'data-vis',
        techStack: ['ECharts', 'Three.js', 'D3.js', 'WebSocket', 'Node.js', 'GraphQL'],
        image: '/projects/command-center.jpg',
        color: '#bf00ff',
        featured: true,
        year: 2023,
        role: {
            en: 'UI Designer & Front-end Lead',
            zh: 'UI设计师 & 前端负责人',
        },
        highlights: {
            en: [
                '8K resolution support',
                'Real-time data streaming from 50+ sources',
                'Custom particle effects and animations',
                'Voice-controlled interface',
            ],
            zh: [
                '支持8K分辨率',
                '50+数据源实时流处理',
                '自定义粒子特效和动画',
                '语音控制界面',
            ],
        },
    },
    {
        id: 'llm-assistant',
        title: {
            en: 'Enterprise LLM Assistant',
            zh: '企业级LLM智能助手',
        },
        subtitle: {
            en: 'AI Integration Project',
            zh: 'AI集成项目',
        },
        description: {
            en: 'Custom enterprise AI assistant with domain-specific knowledge, multi-modal capabilities, and seamless integration with existing workflows.',
            zh: '定制企业AI助手，具备领域专业知识、多模态能力，与现有工作流程无缝集成。',
        },
        category: 'ai',
        techStack: ['LangChain', 'GPT-4', 'Claude', 'Vector DB', 'FastAPI', 'React'],
        image: '/projects/llm-assistant.jpg',
        color: '#00ff80',
        featured: false,
        year: 2024,
        role: {
            en: 'AI Engineer & Product Owner',
            zh: 'AI工程师 & 产品负责人',
        },
        highlights: {
            en: [
                'RAG-powered knowledge retrieval',
                '95% query resolution rate',
                'Multi-language support',
                'Enterprise security compliant',
            ],
            zh: [
                'RAG驱动的知识检索',
                '95%查询解决率',
                '多语言支持',
                '符合企业安全合规',
            ],
        },
    },
    {
        id: 'webgl-engine',
        title: {
            en: 'Custom WebGL Rendering Engine',
            zh: '自研WebGL渲染引擎',
        },
        subtitle: {
            en: 'Open Source Project',
            zh: '开源项目',
        },
        description: {
            en: 'Lightweight, high-performance WebGL rendering engine optimized for data visualization and interactive 3D experiences.',
            zh: '轻量级高性能WebGL渲染引擎，专为数据可视化和交互式三维体验优化。',
        },
        category: '3d',
        techStack: ['WebGL', 'GLSL', 'TypeScript', 'WebGPU', 'Rust/WASM'],
        image: '/projects/webgl-engine.jpg',
        color: '#0080ff',
        featured: false,
        year: 2022,
        role: {
            en: 'Creator & Maintainer',
            zh: '创建者 & 维护者',
        },
        highlights: {
            en: [
                '2x faster than Three.js for certain use cases',
                'GPU instancing for massive datasets',
                'Custom shader pipeline',
                '500+ GitHub stars',
            ],
            zh: [
                '特定场景下比Three.js快2倍',
                '支持大规模数据集的GPU实例化',
                '自定义着色器管线',
                '500+ GitHub星标',
            ],
        },
        links: {
            github: 'https://github.com/alexchen/webgl-engine',
        },
    },
];

export const projectCategories = [
    { id: 'all', label: { en: 'All Projects', zh: '全部项目' }, icon: '🌐' },
    { id: 'digital-twin', label: { en: 'Digital Twin', zh: '数字孪生' }, icon: '🌆' },
    { id: 'gis', label: { en: 'GIS & Mapping', zh: 'GIS地图' }, icon: '🗺️' },
    { id: 'data-vis', label: { en: 'Data Visualization', zh: '数据可视化' }, icon: '📊' },
    { id: 'ai', label: { en: 'AI & ML', zh: '人工智能' }, icon: '🤖' },
    { id: '3d', label: { en: '3D & Graphics', zh: '三维图形' }, icon: '🎮' },
    { id: 'web', label: { en: 'Web Apps', zh: 'Web应用' }, icon: '💻' },
];

export type ProjectCategory = typeof projectCategories[number]['id'];
