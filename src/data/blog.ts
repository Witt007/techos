// Blog posts data
export interface BlogPost {
    slug: string;
    title: {
        en: string;
        zh: string;
    };
    excerpt: {
        en: string;
        zh: string;
    };
    content?: string;
    category: 'tutorial' | 'insight' | 'case-study' | 'opinion';
    tags: string[];
    publishedAt: string;
    readingTime: number;
    featured: boolean;
    cover?: string;
}

export const blogPosts: BlogPost[] = [
    {
        slug: 'building-digital-twin-platforms',
        title: {
            en: 'Building Enterprise-Grade Digital Twin Platforms: Lessons from the Field',
            zh: '构建企业级数字孪生平台：实战经验分享',
        },
        excerpt: {
            en: 'Key architectural decisions and performance optimizations learned from building large-scale digital twin solutions for smart cities and industrial applications.',
            zh: '从智慧城市和工业应用的大规模数字孪生解决方案中学到的关键架构决策和性能优化经验。',
        },
        category: 'case-study',
        tags: ['Digital Twin', 'Architecture', 'Performance', 'Three.js'],
        publishedAt: '2024-01-15',
        readingTime: 12,
        featured: true,
    },
    {
        slug: 'webgpu-for-data-visualization',
        title: {
            en: 'WebGPU for Data Visualization: A Practical Guide',
            zh: 'WebGPU在数据可视化中的实践指南',
        },
        excerpt: {
            en: 'Exploring the capabilities of WebGPU for next-generation data visualization, from compute shaders to advanced rendering techniques.',
            zh: '探索WebGPU在下一代数据可视化中的能力，从计算着色器到高级渲染技术。',
        },
        category: 'tutorial',
        tags: ['WebGPU', 'Data Visualization', 'Shaders', 'Performance'],
        publishedAt: '2024-02-20',
        readingTime: 15,
        featured: true,
    },
    {
        slug: 'integrating-llm-into-enterprise-workflows',
        title: {
            en: 'Integrating LLMs into Enterprise Workflows: Best Practices',
            zh: '将LLM集成到企业工作流：最佳实践',
        },
        excerpt: {
            en: 'Practical strategies for deploying large language models in production environments, including RAG architecture, prompt engineering, and security considerations.',
            zh: '在生产环境中部署大型语言模型的实用策略，包括RAG架构、提示工程和安全考虑。',
        },
        category: 'insight',
        tags: ['AI', 'LLM', 'RAG', 'Enterprise'],
        publishedAt: '2024-03-10',
        readingTime: 10,
        featured: true,
    },
    {
        slug: 'cesium-performance-optimization',
        title: {
            en: 'Cesium Performance Optimization for Large-Scale 3D Terrain',
            zh: 'Cesium大规模三维地形性能优化',
        },
        excerpt: {
            en: 'Deep dive into optimizing Cesium.js for rendering massive 3D terrain datasets with millions of tiles and dynamic streaming.',
            zh: '深入探讨如何优化Cesium.js，以渲染拥有百万级瓦片和动态流式加载的大规模三维地形数据集。',
        },
        category: 'tutorial',
        tags: ['Cesium', 'GIS', '3D', 'Performance'],
        publishedAt: '2023-11-05',
        readingTime: 18,
        featured: false,
    },
    {
        slug: 'designing-effective-command-centers',
        title: {
            en: 'Designing Effective Command Center UIs: A UX Perspective',
            zh: '设计高效指挥中心UI：UX视角',
        },
        excerpt: {
            en: 'UX principles and design patterns for creating intuitive, high-density information displays for control rooms and command centers.',
            zh: '为控制室和指挥中心创建直观、高密度信息展示的UX原则和设计模式。',
        },
        category: 'insight',
        tags: ['UI/UX', 'Data Visualization', 'Design'],
        publishedAt: '2023-09-22',
        readingTime: 8,
        featured: false,
    },
    {
        slug: 'future-of-web-graphics',
        title: {
            en: 'The Future of Web Graphics: WebGPU, WASM, and Beyond',
            zh: 'Web图形的未来：WebGPU、WASM及更多',
        },
        excerpt: {
            en: 'An exploration of emerging web graphics technologies and their potential impact on creative engineering and interactive experiences.',
            zh: '探索新兴Web图形技术及其对创意工程和交互体验的潜在影响。',
        },
        category: 'opinion',
        tags: ['WebGPU', 'WASM', 'Future Tech', 'Web'],
        publishedAt: '2024-04-01',
        readingTime: 6,
        featured: false,
    },
];

export const blogCategories = [
    { id: 'all', label: { en: 'All Posts', zh: '全部文章' }, icon: '📚' },
    { id: 'tutorial', label: { en: 'Tutorials', zh: '教程' }, icon: '📖' },
    { id: 'insight', label: { en: 'Insights', zh: '洞察' }, icon: '💡' },
    { id: 'case-study', label: { en: 'Case Studies', zh: '案例研究' }, icon: '🔬' },
    { id: 'opinion', label: { en: 'Opinion', zh: '观点' }, icon: '💭' },
];
