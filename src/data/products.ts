// Products data
export interface Product {
    id: string;
    name: {
        en: string;
        zh: string;
    };
    tagline: {
        en: string;
        zh: string;
    };
    description: {
        en: string;
        zh: string;
    };
    status: 'live' | 'beta' | 'coming-soon';
    category: 'saas' | 'tool' | 'platform';
    features: {
        en: string[];
        zh: string[];
    };
    pricing?: string;
    url?: string;
    image?: string;
    color: string;
}

export const products: Product[] = [
    {
        id: 'nexus-studio',
        name: {
            en: 'Nexus Studio',
            zh: 'Nexus Studio',
        },
        tagline: {
            en: 'Visual Development Platform',
            zh: '可视化开发平台',
        },
        description: {
            en: 'A no-code/low-code platform for building stunning data visualizations and interactive dashboards with drag-and-drop simplicity.',
            zh: '无代码/低代码平台，通过拖放操作轻松构建惊艳的数据可视化和交互式仪表盘。',
        },
        status: 'live',
        category: 'platform',
        features: {
            en: [
                '50+ pre-built chart templates',
                'Real-time data connectors',
                'Custom theme designer',
                'Team collaboration',
                'Export to various formats',
            ],
            zh: [
                '50+预置图表模板',
                '实时数据连接器',
                '自定义主题设计器',
                '团队协作',
                '多格式导出',
            ],
        },
        pricing: 'Free tier available',
        url: 'https://studio.nexusforge.dev',
        color: 'var(--neon-cyan)',
    },
    {
        id: 'geo-forge',
        name: {
            en: 'GeoForge',
            zh: 'GeoForge',
        },
        tagline: {
            en: 'GIS Visualization Toolkit',
            zh: 'GIS可视化工具包',
        },
        description: {
            en: 'Enterprise-grade geospatial visualization toolkit for building interactive maps, 3D terrain views, and location-based analytics.',
            zh: '企业级地理空间可视化工具包，用于构建交互式地图、3D地形视图和位置分析。',
        },
        status: 'live',
        category: 'tool',
        features: {
            en: [
                'Multi-layer map composition',
                '3D terrain & building rendering',
                'Custom marker & popup system',
                'GeoJSON/TopoJSON support',
                'Offline map capabilities',
            ],
            zh: [
                '多图层地图组合',
                '3D地形与建筑渲染',
                '自定义标记与弹窗系统',
                'GeoJSON/TopoJSON支持',
                '离线地图能力',
            ],
        },
        pricing: 'Starting $49/mo',
        url: 'https://geoforge.nexusforge.dev',
        color: 'var(--neon-green)',
    },
    {
        id: 'prompt-craft',
        name: {
            en: 'PromptCraft',
            zh: 'PromptCraft',
        },
        tagline: {
            en: 'AI Prompt Engineering Tool',
            zh: 'AI提示工程工具',
        },
        description: {
            en: 'A specialized tool for designing, testing, and optimizing LLM prompts with version control and A/B testing capabilities.',
            zh: '专业的LLM提示设计、测试与优化工具，支持版本控制和A/B测试。',
        },
        status: 'beta',
        category: 'saas',
        features: {
            en: [
                'Visual prompt builder',
                'Multi-model testing (GPT, Claude, Gemini)',
                'Response comparison & scoring',
                'Prompt version history',
                'Team prompt library',
            ],
            zh: [
                '可视化提示构建器',
                '多模型测试（GPT、Claude、Gemini）',
                '响应对比与评分',
                '提示版本历史',
                '团队提示库',
            ],
        },
        pricing: 'Beta - Free access',
        url: 'https://promptcraft.nexusforge.dev',
        color: 'var(--neon-amber)',
    },
    {
        id: 'twin-os',
        name: {
            en: 'TwinOS',
            zh: 'TwinOS',
        },
        tagline: {
            en: 'Digital Twin Operating System',
            zh: '数字孪生操作系统',
        },
        description: {
            en: 'A comprehensive platform for building, deploying, and managing digital twin applications for industrial and urban environments.',
            zh: '用于构建、部署和管理工业与城市环境数字孪生应用的综合平台。',
        },
        status: 'coming-soon',
        category: 'platform',
        features: {
            en: [
                'IoT device integration',
                'Real-time 3D visualization',
                'AI-powered analytics',
                'Simulation & scenario planning',
                'Multi-tenant architecture',
            ],
            zh: [
                'IoT设备集成',
                '实时3D可视化',
                'AI驱动分析',
                '仿真与场景规划',
                '多租户架构',
            ],
        },
        color: 'var(--neon-magenta)',
    },
];

export const productCategories = [
    { id: 'all', label: { en: 'All Products', zh: '全部产品' } },
    { id: 'platform', label: { en: 'Platforms', zh: '平台' } },
    { id: 'saas', label: { en: 'SaaS', zh: 'SaaS服务' } },
    { id: 'tool', label: { en: 'Tools', zh: '工具' } },
];
