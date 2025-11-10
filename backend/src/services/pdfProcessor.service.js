import fs from 'fs';
import pdf from 'pdf-parse';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

import { getCollectionName } from '../constants.js';
import { storeDocumentEmbeddingsInNotesCollection } from './vector.service.js';
import { uploadOnCloudinary } from './cloudinaryUpload.service.js';
import { createUserCollection } from './vector.service.js';

// Extract text from PDF file
export const extractTextFromPDF = async (filePath) => {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
};

// Split text into chunks for better retrieval
// RecursiveCharacterTextSplitter ensures semantic coherence
export const chunkText = async (text) => {
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1500,
        chunkOverlap: 300,
    });

    const chunks = await splitter.splitText(text);
    return chunks;
};

// Process uploaded document for notes: extract text, embed, store in Qdrant, then upload to Cloudinary
export const processNoteDocument = async (file, userName, noteId) => {
    try {
        // Extract text from PDF
        const extractedText = await extractTextFromPDF(file.path);

        // Split text into chunks for embedding
        const textChunks = await chunkText(extractedText);

        //   create the collection
        const collectionName = await createUserCollection(userName);

        // Generate embeddings and store in Qdrant
        const chunkIds = await storeDocumentEmbeddingsInNotesCollection(
            collectionName,
            textChunks,
            noteId
        );

        // Upload to Cloudinary after successful embedding
        const cloudinaryResponse = await uploadOnCloudinary(file.path);
        // console.log('Cloudinary response:', cloudinaryResponse);

        return {
            documentUrl: cloudinaryResponse.secure_url,
            documentPublicId: cloudinaryResponse.public_id,
            collectionName: collectionName,
            chunkIds: chunkIds,
            metadata: {
                fileName: file.originalname,    
                fileSize: file.size,
                mimeType: file.mimetype,
                pageCount: Math.ceil(extractedText.length / 3000), // Approximate
            },
        };
    } catch (error) {
        console.error('Error processing document:', error);
        throw new Error('Failed to process document');
    }
};
