import { OllamaEmbeddings } from '@langchain/ollama';

// Initialize Ollama embeddings with LangChain
// OllamaEmbeddings handles text to vector conversion locally
export const ollamaEmbeddings = new OllamaEmbeddings({
    model: process.env.OLLAMA_MODEL || 'nomic-embed-text:latest',
    baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
});
