// Gemini AI Service
// Provides AI chat functionality with streaming support

import { GoogleGenerativeAI, GenerativeModel, ChatSession } from '@google/generative-ai';

// System prompt for the AI assistant
const SYSTEM_PROMPT = `You are NexusForge AI, a friendly and knowledgeable assistant for Alex Chen's personal portfolio website. 

Your personality:
- Professional yet approachable
- Enthusiastic about technology, especially visualization, 3D graphics, and AI
- Helpful and concise in responses
- Occasionally uses tech/sci-fi themed language to match the website's cyberpunk aesthetic

Your knowledge includes:
- Alex's expertise: Full-stack development, Digital Twin, GIS, Data Visualization, AI/ML, 3D Graphics
- Alex's tech stack: React/Next.js, Three.js, WebGL/WebGPU, Node.js, Python, etc.
- Projects: Smart City Digital Twin, Industrial Metaverse, GeoSpatial Analytics, etc.
- Contact: witt.actionnow@gmail.com

Guidelines:
- Keep responses concise (2-3 paragraphs max)
- Use markdown formatting when helpful
- If asked about hiring/collaboration, encourage contacting Alex directly
- Be helpful but don't make up specific details about projects not mentioned
- For technical questions, provide accurate information about web technologies`;

// Types
export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
}

export interface StreamCallbacks {
    onToken: (token: string) => void;
    onComplete: (fullText: string) => void;
    onError: (error: Error) => void;
}

// Gemini service class
class GeminiService {
    private genAI: GoogleGenerativeAI | null = null;
    private model: GenerativeModel | null = null;
    private chatSession: ChatSession | null = null;
    private apiKey: string | null = null;

    constructor() {
        // Initialize with API key from environment
        if (typeof window === 'undefined') {
            // Server-side
            this.apiKey = process.env.GEMINI_API_KEY || null;
        }
    }

    // Initialize the service (call this with API key)
    initialize(apiKey?: string) {
        const key = apiKey || this.apiKey || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

        if (!key) {
            console.warn('Gemini API key not found. AI features will use fallback responses.');
            return false;
        }

        try {
            this.genAI = new GoogleGenerativeAI(key);
            this.model = this.genAI.getGenerativeModel({
                model: 'gemini-1.5-flash',
                generationConfig: {
                    temperature: 0.7,
                    topP: 0.9,
                    topK: 40,
                    maxOutputTokens: 1024,
                },
            });
            return true;
        } catch (error) {
            console.error('Failed to initialize Gemini:', error);
            return false;
        }
    }

    // Check if service is ready
    isReady(): boolean {
        return this.model !== null;
    }

    // Start a new chat session
    startChat(history: ChatMessage[] = []) {
        if (!this.model) {
            throw new Error('Gemini service not initialized');
        }

        // Convert history to Gemini format
        const geminiHistory = history
            .filter(msg => msg.role !== 'system')
            .map(msg => ({
                role: msg.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: msg.content }],
            }));

        this.chatSession = this.model.startChat({
            history: geminiHistory as any,
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1024,
            },
        });

        return this.chatSession;
    }

    // Send a message and get streaming response
    async sendMessageStream(
        message: string,
        callbacks: StreamCallbacks,
        history: ChatMessage[] = []
    ): Promise<void> {
        if (!this.model) {
            // Use fallback responses if not initialized
            this.sendFallbackResponse(message, callbacks);
            return;
        }

        try {
            // Create chat session if needed
            if (!this.chatSession) {
                this.startChat(history);
            }

            // Prepend system prompt to first message
            const contextMessage = history.length === 0
                ? `${SYSTEM_PROMPT}\n\nUser: ${message}`
                : message;

            const result = await this.chatSession!.sendMessageStream(contextMessage);

            let fullText = '';

            for await (const chunk of result.stream) {
                const chunkText = chunk.text();
                fullText += chunkText;
                callbacks.onToken(chunkText);
            }

            callbacks.onComplete(fullText);
        } catch (error) {
            console.error('Gemini API error:', error);
            callbacks.onError(error as Error);

            // Try fallback on error
            this.sendFallbackResponse(message, callbacks);
        }
    }

    // Send a non-streaming message
    async sendMessage(message: string, history: ChatMessage[] = []): Promise<string> {
        if (!this.model) {
            return this.getFallbackResponse(message);
        }

        try {
            if (!this.chatSession) {
                this.startChat(history);
            }

            const contextMessage = history.length === 0
                ? `${SYSTEM_PROMPT}\n\nUser: ${message}`
                : message;

            const result = await this.chatSession!.sendMessage(contextMessage);
            return result.response.text();
        } catch (error) {
            console.error('Gemini API error:', error);
            return this.getFallbackResponse(message);
        }
    }

    // Fallback responses when API is unavailable
    private getFallbackResponse(message: string): string {
        const lowerMessage = message.toLowerCase();

        const responses: Record<string, string> = {
            'tech': "Alex specializes in a powerful tech stack including:\n\n• **Frontend:** React/Next.js, Vue/Nuxt, TypeScript, Three.js, WebGL/WebGPU\n• **Visualization:** Digital Twin, GIS (Cesium, Mapbox), ECharts, D3.js\n• **Backend:** Node.js, Python, PostgreSQL, GraphQL\n• **AI:** LLM integration, Computer Vision, ML Pipelines",
            'project': "Alex has led several major projects:\n\n🌆 **Smart City Platform** - Digital twin for urban management\n🏭 **Industrial Metaverse** - VR/AR manufacturing optimization\n📊 **GeoSpatial Analytics** - Big data GIS platform",
            'contact': "You can reach Alex through:\n\n📧 **Email:** witt.actionnow@gmail.com\n🐙 **GitHub:** @alexchen\n💼 **LinkedIn:** /in/alexchen\n\nOr use the contact form on this page!",
            'hello': "Hello! 👋 I'm the NexusForge AI assistant. I can help you learn about Alex's work, projects, and expertise. What would you like to know?",
            'help': "I can help you with:\n\n• Learning about Alex's tech stack and expertise\n• Exploring project portfolio and case studies\n• Getting contact information\n• Understanding services offered\n\nJust ask anything!",
        };

        for (const [keyword, response] of Object.entries(responses)) {
            if (lowerMessage.includes(keyword)) {
                return response;
            }
        }

        return "I'd be happy to help! Feel free to ask about Alex's projects, tech stack, or how to get in touch. For specific inquiries, I recommend using the contact form.";
    }

    private sendFallbackResponse(message: string, callbacks: StreamCallbacks) {
        const response = this.getFallbackResponse(message);

        // Simulate streaming with word-by-word output
        const words = response.split(' ');
        let index = 0;
        let fullText = '';

        const interval = setInterval(() => {
            if (index < words.length) {
                const token = (index === 0 ? '' : ' ') + words[index];
                fullText += token;
                callbacks.onToken(token);
                index++;
            } else {
                clearInterval(interval);
                callbacks.onComplete(fullText);
            }
        }, 30);
    }

    // Reset chat session
    resetChat() {
        this.chatSession = null;
    }
}

// Export singleton instance
export const geminiService = new GeminiService();

// Export for direct API calls
export default geminiService;
