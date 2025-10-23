import { QdrantVectorStore } from '@langchain/community/vectorstores/qdrant';

import { qdrantClient } from '../config/qdrant.config.js';
import { ollamaEmbeddings } from '../config/ollama.config.js';
import { SUBJECT_COLLECTIONS, TEMP_COLLECTION } from '../constants.js';


// Store documents in a subject-specific collection
// QdrantVectorStore handles embedding storage automatically
export const storeDocumentsInSubjectCollection = async (subject, documents, metadata) => {
    const collectionName = SUBJECT_COLLECTIONS[subject];

    const vectorStore = await QdrantVectorStore.fromDocuments(
        documents.map(doc => ({ pageContent: doc, metadata })),
        ollamaEmbeddings,
        {
            client: qdrantClient,  // Use client instead of url
            collectionName,
        }
    );

    return vectorStore;
};


// Store temporary upload documents with session ID
// These will be auto-deleted after session timeout
export const storeTempDocumentInTempCollection = async (chunks, sessionId) => {
    const documents = chunks.map(chunk => ({
        pageContent: chunk,
        metadata: { sessionId, timestamp: Date.now() }
    }));

    const vectorStore = await QdrantVectorStore.fromDocuments(
        documents,
        ollamaEmbeddings,
        {
            client: qdrantClient,  // Use client instead of url
            collectionName: TEMP_COLLECTION,
        }
    );

    return { vectorStore, sessionId };
};


// Semantic search in subject collection
// Returns most relevant document chunks based on query
export const searchInSubjectCollection = async (subject, query, limit = 5) => {
    const collectionName = SUBJECT_COLLECTIONS[subject];

    // console.log(collectionName, query);

    const vectorStore = await QdrantVectorStore.fromExistingCollection(
        ollamaEmbeddings,
        {
            client: qdrantClient,  // Use client instead of url
            collectionName,
        }
    );

    const results = await vectorStore.similaritySearch(query, limit);

    // console.log("Results: ", results);
    return results;
};


// Search in temporary upload collection filtered by session
export const searchInTempUploadCollection = async (query, sessionId, limit = 5) => {
    const vectorStore = await QdrantVectorStore.fromExistingCollection(
        ollamaEmbeddings,
        {
            client: qdrantClient,
            collectionName: TEMP_COLLECTION,
        }
    );

    const filter = {
        must: [{
            key: 'metadata.sessionId',
            match: {
                value: sessionId
            }
        }]
    };

    const results = await vectorStore.similaritySearch(query, limit, filter);
    return results;
};


// Delete temporary documents by session ID
export const deleteTempSession = async (sessionId) => {
    const points = await qdrantClient.scroll(TEMP_COLLECTION, {
        filter: {
            must: [{
                key: 'metadata.sessionId',
                match: {
                    value: sessionId
                }
            }]
        }
    });

    const pointIds = points.points.map(p => p.id);
    if (pointIds.length > 0) {
        await qdrantClient.delete(TEMP_COLLECTION, {
            points: pointIds
        });
    }
};
