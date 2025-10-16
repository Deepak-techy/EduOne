import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { extractTextFromPDF, chunkText } from "../services/pdf.service.js";
import { storeTempDocument, searchInTempUpload, storeDocumentsInSubject } from '../services/vector.service.js';
import { generateAnswer } from '../services/qa.service.js';
import { createSession, extendSession } from '../utils/sessionManager.js';
import { SUBJECT_LIST } from "../constants.js";

import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';

const uploadPermanentPDF = asyncHandler(async (req, res) => {
    // Check if file is uploaded
    if (!req.file) {
        throw new ApiError(400, "No file uploaded");
    }

    // Get subject from request body
    const { subject } = req.body;

    // Validate subject
    if (!subject || !SUBJECT_LIST.find(s => s.name === subject)) {
        await fs.unlink(req.file.path);
        throw new ApiError(400, 'Invalid subject');
    }

    // Extract text from PDF file
    const text = await extractTextFromPDF(req.file.path);

    if (!text || text.trim().length === 0) {
        await fs.unlink(req.file.path);
        throw new ApiError(400, "PDF contains no readable text");
    }

    // Split text into chunks for better retrieval
    const chunks = await chunkText(text);

    // Generate unique document ID
    const documentId = uuidv4();

    // Prepare metadata for each chunk
    const metadata = {
        documentId,
        subject,
        fileName: req.file.originalname,
        uploadDate: new Date().toISOString(),
        totalChunks: chunks.length
    };

    // Store in subject-specific Qdrant collection
    const { vectorStore, pointIds } = await storeDocumentsInSubject(
        subject,
        chunks,
        metadata
    );

    if (!vectorStore) {
        throw new ApiError(500, "Failed to store document in Qdrant");
    }

    // Delete uploaded file from disk
    await fs.unlink(req.file.path);

    // Return response
    return res
        .status(201)
        .json(new ApiResponse(201, {
            documentId,
            subject,
            chunkCount: chunks.length,
            pointIds: pointIds.length,
            uploadDate: metadata.uploadDate
        }, "Document uploaded and stored permanently"));
});

const uploadTempPDF = asyncHandler(async (req, res) => {
    // check if file is uploaded
    if (!req.file) {
        throw new ApiError(400, "No file uploaded")
    }

    // extract text from PDF file
    const text = await extractTextFromPDF(req.file.path)

    // split text into chunks for better retrieval
    const chunks = await chunkText(text)

    // gebenere Session ID
    const sessionId = uuidv4();

    // store in Qdrant with session metadata
    const { vectorStore } = await storeTempDocument(chunks, sessionId);

    if (!vectorStore) {
        throw new ApiError(500, "Failed to store in Qdrant");
    }

    // start session timeout
    createSession(sessionId);

    // delete uploaded file
    await fs.unlink(req.file.path);

    // return response
    return res
        .status(200)
        .json(new ApiResponse(200, {
            sessionId,
            chunkCount: chunks.length
        }, "File uploaded and stored successfully"));
})

const queryTempUpload = asyncHandler(async (req, res) => {
    // get session ID and query from frontend
    const { sessionId, query } = req.body;

    if (!sessionId) {
        throw new ApiError(400, "Session ID is required");
    }

    if (!query) {
        throw new ApiError(400, "Query is required");
    }

    // extend session timeout on activity
    extendSession(sessionId);

    // search in temporary collection filtered by session
    const context = await searchInTempUpload(query, sessionId);

    if (!context) {
        throw new ApiError(400, "No context found");
    }

    // generate contextual answer from retrieved documents
    const answer = await generateAnswer(query, context);

    if (!answer) {
        throw new ApiError(500, "Failed to generate answer");
    }

    // return response
    return res
        .status(200)
        .json(new ApiResponse(200, answer, "Answer generated successfully"));
})


export {
    uploadTempPDF,
    queryTempUpload,
    uploadPermanentPDF
}