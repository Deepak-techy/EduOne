import { OllamaEmbeddings } from '@langchain/ollama';

// Initialize Ollama embeddings with LangChain
// OllamaEmbeddings handles text to vector conversion locally
export const ollamaEmbeddings = new OllamaEmbeddings({
    model: process.env.OLLAMA_MODEL || 'nomic-embed-text:latest',
    baseUrl: process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434',
});

export const connectOllama = async () => {
    try {
        const response = await fetch('http://localhost:11434');
        if (response.ok) {
            console.log('✅ OLLAMA Connected !! Host: localhost:11434');
        }
    } catch (error) {
        console.log('❌ OLLAMA Connection Failed !!');
        console.log('⚠️  Please start Ollama by running: ollama serve');
    }
};