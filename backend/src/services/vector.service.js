import { QdrantVectorStore } from '@langchain/qdrant';
import { v4 as uuidv4 } from 'uuid';

import { qdrantClient } from '../config/qdrant.config.js';
import { ollamaEmbeddings } from '../config/ollama.config.js';
import { SUBJECT_COLLECTIONS, TEMP_COLLECTION } from '../constants.js';

// Store documents in a subject-specific collection
// QdrantVectorStore handles embedding storage automatically
export const storeDocumentsInSubject = async (subject, documents, metadata) => {
    const collectionName = SUBJECT_COLLECTIONS[subject];

    const vectorStore = await QdrantVectorStore.fromDocuments(
        documents.map(doc => ({ pageContent: doc, metadata })),
        ollamaEmbeddings,
        {
            url: process.env.QDRANT_URL || 'http://localhost:6333',
            collectionName,
        }
    );

    return vectorStore;
};

// Store temporary upload documents with session ID
// These will be auto-deleted after session timeout
export const storeTempDocument = async (chunks, sessionId) => {
    const documents = chunks.map(chunk => ({
        pageContent: chunk,
        metadata: { sessionId, timestamp: Date.now() }
    }));

    const vectorStore = await QdrantVectorStore.fromDocuments(
        documents,
        ollamaEmbeddings,
        {
            url: process.env.QDRANT_URL || 'http://localhost:6333',
            collectionName: TEMP_COLLECTION,
        }
    );

    return { vectorStore, sessionId };
};

// Semantic search in subject collection
// Returns most relevant document chunks based on query
export const searchInSubject = async (subject, query, limit = 5) => {
    const collectionName = SUBJECT_COLLECTIONS[subject];

    const vectorStore = await QdrantVectorStore.fromExistingCollection(
        ollamaEmbeddings,
        {
            url: process.env.QDRANT_URL || 'http://localhost:6333',
            collectionName,
        }
    );

    const results = await vectorStore.similaritySearch(query, limit);
    return results;
};

// Search in temporary upload collection filtered by session
export const searchInTempUpload = async (query, sessionId, limit = 5) => {
    const vectorStore = await QdrantVectorStore.fromExistingCollection(
        ollamaEmbeddings,
        {
            url: process.env.QDRANT_URL || 'http://localhost:6333',
            collectionName: TEMP_COLLECTION,
        }
    );

    const filter = {
        must: [{ key: 'metadata.sessionId', match: { value: sessionId } }]
    };

    const results = await vectorStore.similaritySearch(query, limit, filter);
    return results;
};

// Delete temporary documents by session ID
export const deleteTempSession = async (sessionId) => {
    const points = await qdrantClient.scroll(TEMP_COLLECTION, {
        filter: {
            must: [{ key: 'metadata.sessionId', match: { value: sessionId } }]
        }
    });

    const pointIds = points.points.map(p => p.id);
    if (pointIds.length > 0) {
        await qdrantClient.delete(TEMP_COLLECTION, {
            points: pointIds
        });
    }
};
