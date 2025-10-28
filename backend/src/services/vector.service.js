import { QdrantVectorStore } from '@langchain/community/vectorstores/qdrant';

import { qdrantClient } from '../config/qdrant.config.js';
import { ollamaEmbeddings } from '../config/ollama.config.js';
import { SUBJECT_COLLECTIONS, TEMP_COLLECTION, getCollectionName } from '../constants.js';
import { generateDocumentEmbeddings, generateQueryEmbedding } from './textEmbedding.service.js';

// Create a new Qdrant collection for a specific user for the Notes feature
export const createUserCollection = async (userName) => {
    try {
        const collectionName = getCollectionName(userName);

        // Check if collection already exists
        const collections = await qdrantClient.getCollections();
        const exists = collections.collections.some(
            (col) => col.name === collectionName
        );

        if (!exists) {
            const vectorSize = 768;

            await qdrantClient.createCollection(collectionName, {
                vectors: {
                    size: vectorSize,
                    distance: 'Cosine',
                },
            });
            console.log(`Collection ${collectionName} created successfully`);
        }

        return collectionName;
    } catch (error) {
        console.error('Error creating user collection:', error);
        throw new Error('Failed to create user collection');
    }
};

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


// Store notes-feature document chunks with embeddings in Qdrant
export const storeDocumentEmbeddingsInNotesCollection = async (collectionName, textChunks, noteId) => {
    try {
        const documentEmbeddings = await generateDocumentEmbeddings(textChunks);


        // Generate numeric IDs using timestamp and index
        const baseTimestamp = Date.now();

        const points = textChunks.map((chunk, index) => ({
            id: baseTimestamp + index, 
            vector: documentEmbeddings[index],
            payload: {
                text: chunk,
                noteId: noteId,
                chunkIndex: index,
                timestamp: new Date().toISOString(),
            },
        }));

        await qdrantClient.upsert(collectionName,
            {
                points: points,
            },
            {
                wait: true,
            }
        );

    return points.map((p) => p.id);
} catch (error) {
    console.error('Error storing document embeddings:', error);
    throw new Error('Failed to store document embeddings');
}
};


// Search for similar content in the vector database
export const searchSimilarContentInNotesCollection = async (collectionName, query, limit = 5) => {
    try {
        // 1️ Generate embedding for query
        const queryEmbedding = await generateQueryEmbedding(query);

        // 2️ Search in Qdrant
        const searchResult = await qdrantClient.search(collectionName, {
            vector: queryEmbedding,
            limit: limit,
            with_payload: true,
        });

        // 3️ Convert each point to a LangChain-style Document
        const documents = searchResult.map(point => ({
            pageContent: point.payload.text,   // original text chunk
            metadata: {
                noteId: point.payload.noteId,
                chunkIndex: point.payload.chunkIndex,
                timestamp: point.payload.timestamp,
                pointId: point.id,            // include pointId for reference/deletion
            },
            score: point.score                  // optional similarity score
        }));

        return documents;
    } catch (error) {
        console.error('Error searching similar content:', error);
        throw new Error('Failed to search similar content');
    }
};


// Delete specific document chunks from Qdrant
export const deleteDocumentChunksFromNotesCollection = async (collectionName, chunkIds) => {
    try {
        if (chunkIds && chunkIds.length > 0) {
            await qdrantClient.delete(collectionName, {
                wait: true,
                points: chunkIds,
            });
            console.log(`Deleted ${chunkIds.length} chunks from ${collectionName}`);
        }
    } catch (error) {
        console.error('Error deleting document chunks:', error);
        throw new Error('Failed to delete document chunks');
    }
};