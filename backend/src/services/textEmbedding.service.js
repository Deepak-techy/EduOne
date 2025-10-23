import { ollamaEmbeddings } from '../config/ollama.config.js';

// Generate embeddings for a query string
// Uses Ollama's local embedding model via LangChain
export const generateQueryEmbedding = async (query) => {
    return await ollamaEmbeddings.embedQuery(query);
};

// Generate embeddings for multiple documents
// Used when indexing PDF chunks into Qdrant
export const generateDocumentEmbeddings = async (texts) => {
    return await ollamaEmbeddings.embedDocuments(texts);
};
