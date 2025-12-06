// Code repositories / libraries data
export interface CodeRepo {
    id: string;
    name: string;
    description: {
        en: string;
        zh: string;
    };
    type: 'component' | 'utility' | 'framework' | 'tool';
    language: string;
    stars: number;
    downloads: string;
    version: string;
    tags: string[];
    github?: string;
    npm?: string;
    docs?: string;
    featured: boolean;
}

export const codeRepos: CodeRepo[] = [
    {
        id: 'nexus-ui',
        name: '@nexusforge/ui',
        description: {
            en: 'A cyberpunk-themed React component library with ambient effects, glassmorphism, and smooth animations.',
            zh: '赛博朋克风格的React组件库，包含环境特效、毛玻璃效果和流畅动画。',
        },
        type: 'component',
        language: 'TypeScript',
        stars: 1250,
        downloads: '50k/month',
        version: '2.1.0',
        tags: ['React', 'UI', 'Components', 'Animation'],
        github: 'https://github.com/alexchen/nexus-ui',
        npm: 'https://npmjs.com/package/@nexusforge/ui',
        docs: 'https://ui.nexusforge.dev',
        featured: true,
    },
    {
        id: 'geo-viz',
        name: '@nexusforge/geo-viz',
        description: {
            en: 'High-performance geospatial visualization library built on Deck.gl with 2D/3D layer support.',
            zh: '基于Deck.gl构建的高性能地理空间可视化库，支持2D/3D图层。',
        },
        type: 'framework',
        language: 'TypeScript',
        stars: 890,
        downloads: '25k/month',
        version: '1.8.0',
        tags: ['GIS', 'Visualization', 'WebGL', 'Maps'],
        github: 'https://github.com/alexchen/geo-viz',
        npm: 'https://npmjs.com/package/@nexusforge/geo-viz',
        featured: true,
    },
    {
        id: 'shader-utils',
        name: 'shader-utils',
        description: {
            en: 'Collection of GLSL shader utilities for WebGL/WebGPU including noise functions, post-processing effects, and particle systems.',
            zh: 'WebGL/WebGPU的GLSL着色器工具集，包含噪声函数、后处理效果和粒子系统。',
        },
        type: 'utility',
        language: 'GLSL/TypeScript',
        stars: 560,
        downloads: '12k/month',
        version: '0.9.0',
        tags: ['WebGL', 'Shaders', 'GLSL', 'Graphics'],
        github: 'https://github.com/alexchen/shader-utils',
        featured: false,
    },
    {
        id: 'dt-core',
        name: 'dt-core',
        description: {
            en: 'Digital Twin core library for building industrial IoT visualization applications with real-time data streaming.',
            zh: '用于构建工业物联网可视化应用的数字孪生核心库，支持实时数据流。',
        },
        type: 'framework',
        language: 'TypeScript',
        stars: 720,
        downloads: '15k/month',
        version: '1.2.0',
        tags: ['Digital Twin', 'IoT', 'Real-time', 'Industrial'],
        github: 'https://github.com/alexchen/dt-core',
        featured: true,
    },
    {
        id: 'prompt-builder',
        name: 'prompt-builder',
        description: {
            en: 'Type-safe prompt engineering toolkit for building complex LLM prompts with templates and validation.',
            zh: '类型安全的提示工程工具包，用于构建带有模板和验证的复杂LLM提示。',
        },
        type: 'tool',
        language: 'TypeScript',
        stars: 340,
        downloads: '8k/month',
        version: '0.5.0',
        tags: ['AI', 'LLM', 'Prompt Engineering'],
        github: 'https://github.com/alexchen/prompt-builder',
        npm: 'https://npmjs.com/package/prompt-builder',
        featured: false,
    },
    {
        id: 'echarts-cyber',
        name: 'echarts-cyber-theme',
        description: {
            en: 'Cyberpunk-inspired theme and extension for Apache ECharts with neon colors and glow effects.',
            zh: '赛博朋克风格的Apache ECharts主题和扩展，具有霓虹色和发光效果。',
        },
        type: 'utility',
        language: 'TypeScript',
        stars: 280,
        downloads: '6k/month',
        version: '1.0.0',
        tags: ['ECharts', 'Theme', 'Visualization'],
        github: 'https://github.com/alexchen/echarts-cyber-theme',
        npm: 'https://npmjs.com/package/echarts-cyber-theme',
        featured: false,
    },
];

export const repoTypes = [
    { id: 'all', label: { en: 'All', zh: '全部' }, icon: '📦' },
    { id: 'component', label: { en: 'Components', zh: '组件' }, icon: '🧩' },
    { id: 'framework', label: { en: 'Frameworks', zh: '框架' }, icon: '🏗️' },
    { id: 'utility', label: { en: 'Utilities', zh: '工具集' }, icon: '🔧' },
    { id: 'tool', label: { en: 'Tools', zh: '工具' }, icon: '⚙️' },
];
