// AI API Route for Gemini
// Handles chat requests with streaming support

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const SYSTEM_PROMPT = `You are NexusForge AI, a friendly and knowledgeable assistant for Witt's personal portfolio website. 

Your personality:
- Professional yet approachable
- Enthusiastic about technology, especially visualization, 3D graphics, and AI
- Helpful and concise in responses
- Occasionally uses tech/sci-fi themed language

Your knowledge includes:
- Witt's expertise: Full-stack development, Digital Twin, GIS, Data Visualization, AI/ML, 3D Graphics
- Witt's tech stack: React/Next.js, Three.js, WebGL/WebGPU, Node.js, Python, etc.
- Projects: Smart City Digital Twin, Industrial Metaverse, GeoSpatial Analytics

Guidelines:
- Keep responses concise (2-3 paragraphs max)
- Use markdown formatting when helpful
- If asked about hiring/collaboration, encourage contacting Witt directly`;

interface Message {
    role: string;
    content: string;
}

export async function POST(request: NextRequest) {
    try {
        const { message, history = [] } = await request.json();

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            // Return fallback response if no API key
            return NextResponse.json({
                response: getFallbackResponse(message),
                isFallback: true,
            });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1024,
            },
        });

        // Build conversation history
        const geminiHistory = history
            .filter((msg: Message) => msg.role !== 'system')
            .map((msg: Message) => ({
                role: msg.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: msg.content }],
            }));

        const chat = model.startChat({
            history: geminiHistory,
        });

        // Add system context to the message
        const contextMessage = history.length === 0
            ? `${SYSTEM_PROMPT}\n\nUser: ${message}\n\nAssistant:`
            : message;

        const result = await chat.sendMessage(contextMessage);
        const response = result.response.text();

        return NextResponse.json({ response, isFallback: false });
    } catch (error) {
        console.error('AI API error:', error);
        return NextResponse.json({
            response: "I apologize, but I'm having trouble processing your request right now. Please try again or use the contact form to reach Alex directly.",
            isFallback: true,
            error: true,
        });
    }
}

// Streaming endpoint
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const message = searchParams.get('message');

    if (!message) {
        return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        // Return fallback for streaming
        const fallback = getFallbackResponse(message);
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            start(controller) {
                controller.enqueue(encoder.encode(fallback));
                controller.close();
            }
        });
        return new Response(stream, {
            headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        });
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `${SYSTEM_PROMPT}\n\nUser: ${message}\n\nAssistant:`;
        const result = await model.generateContentStream(prompt);

        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of result.stream) {
                        const text = chunk.text();
                        controller.enqueue(encoder.encode(text));
                    }
                    controller.close();
                } catch (error) {
                    controller.error(error);
                }
            }
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Transfer-Encoding': 'chunked',
            },
        });
    } catch (error) {
        console.error('Stream error:', error);
        return NextResponse.json({ error: 'Streaming failed' }, { status: 500 });
    }
}

function getFallbackResponse(message: string): string {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('tech') || lowerMessage.includes('stack')) {
        return "Alex specializes in: **Frontend** (React, Next.js, Three.js, WebGL), **Visualization** (Digital Twin, GIS, D3.js), **Backend** (Node.js, Python, PostgreSQL), and **AI** (LLM integration, Computer Vision).";
    }
    if (lowerMessage.includes('project')) {
        return "Alex has led major projects including Smart City Digital Twin Platform, Industrial Metaverse, and GeoSpatial Analytics Engine. Each showcases expertise in 3D visualization and data-driven applications.";
    }
    if (lowerMessage.includes('contact') || lowerMessage.includes('reach')) {
        return "You can reach Alex at witt.actionnow@gmail.com or through the contact form on this page. For quick responses, LinkedIn and GitHub are also good options!";
    }
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
        return "Hello! 👋 I'm the NexusForge AI assistant. I can help you learn about Alex's work and expertise. What would you like to know?";
    }

    return "I'd be happy to help! Feel free to ask about Alex's projects, tech stack, or how to get in touch.";
}
