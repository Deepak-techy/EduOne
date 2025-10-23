import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

// Initialize Gemini chat model with LangChain
// ChatGoogleGenerativeAI handles conversational AI responses
export const geminiModel = new ChatGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY,
    model: 'gemini-2.5-flash',
    temperature: 0.3,
});
