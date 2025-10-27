import { Note } from "../models/note.model";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { getCollectionName } from "../constants.js";
import { processNoteDocument } from "../services/pdfProcessor.service.js";

const createNote = asyncHandler(async (req, res) => {
    // get subject, tags and content from frontend
    const { subject, tags, content } = req.body;

    // get userId and userName form request
    const { _id: userId, userName } = req.user

    if (!subject) {
        throw new ApiError(400, "Subject is required");
    }

    // Parse tags from JSON string if needed
    const parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;

    // create note
    const note = await Note.create({
        userId,
        subject,
        tags: parsedTags || [],
        content,
        qdrantCollectionName: getCollectionName(userName),
    });

    if (!note) {
        throw new ApiError(500, "Failed to create note");
    }

    // return response
    return res
        .status(201)
        .json(new ApiResponse(
            201,
            {
                noteId: note._id,
                note
            },
            "Note created successfully"
        ));
})

const uploadAndProcessDocument = asyncHandler(async (req, res) => {
    // get noteId, userName and file from frontend
    const { noteId } = req.params;
    const { userName } = req.user;

    if (!req.file) {
        throw new ApiError(400, "No file uploaded");
    }

    // Find note by noteId
    const note = await Note.findById(noteId);

    if (!note) {
        throw new ApiError(404, "Note not found");
    }

    // Process document and generate embeddings
    const processedNote = await processNoteDocument(req.file, userName, noteId);

    // Update note with document details
    note.documentUrl = processedNote.documentUrl;
    note.qdrantCollectionName = processedNote.collectionName;
    note.documentChunkIds = processedNote.chunkIds;
    note.documentMetadata = processedNote.metadata;

    // Save updated note
    await note.save();

    // return response
    return res
        .status(200)
        .json(new ApiResponse(200, note, "Document uploaded and processed successfully"));

})

export {
    createNote,
    uploadAndProcessDocument,
}