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

const getNotesWithOptionalFilters = asyncHandler(async (req, res) => {
    // get userId form request
    const { _id: userId } = req.user
    const { subject, tags, search, sortBy = 'createdAt', order = "desc" } = req.query
    
    // Build query for database search
    const query = { userId };

    if (subject) {
        query.subject = subject.trim();
    }   

    if (tags) {
        const tagArray = Array.isArray(tags) ? tags : [tags];
        query.tags = { $in: tagArray };
    }

    if (search) {
        query.$text = { $search: search.trim() };
    }

    // Execute query with sorting
    const notes = await Note.find(query)
        .sort({ [sortBy]: order === 'asc' ? 1 : -1 })
        .lean();
    
    // return response
    return res
        .status(200)
        .json(new ApiResponse(200,
            {
                count: notes.length,
                notes,
            },
            "Notes fetched successfully"
        ));

})

const getLastUpdatedNotes = asyncHandler(async (req, res) => {
    // get userId from request
    const { _id: userId } = req.user;

    // Fetch last 5 updated notes (sorted by updatedAt descending)
    const notes = await Note.find({ userId })
        .sort({ updatedAt: -1 })  // Descending order (latest first)
        .limit(5)                 // Only 5 results
        .lean();

    // return response
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    count: notes.length,
                    notes
                },
                "Last 5 updated notes fetched successfully"
            ));
});

const getNoteById = asyncHandler(async (req, res) => {
    // get noteId from params
    const { noteId } = req.params;
    const { _id: userId } = req.user;

    if (!noteId) {
        throw new ApiError(400, "Note ID is required");
    }

    // Find note that matches both ID and user
    const note = await Note.findOne({ _id: noteId, userId });

    if (!note) {
        throw new ApiError(404, "Note not found");
    }

    // return response
    return res
        .status(200)
        .json(new ApiResponse(200, note, "Note fetched successfully"));
});

const updateNote = asyncHandler(async (req, res) => {
    // get noteId from params
    const { noteId } = req.params;
    const { _id: userId } = req.user;

    // get updated note details from frontend
    const { subject, tags, content } = req.body;

    if (!noteId) {
        throw new ApiError(400, "Note ID is required");
    }

    // find and update the note
    const note = await Note.findOneAndUpdate(
        {
            _id: noteId,
            userId,
        },
        {
            $set: {
                subject,
                tags,
                content,
            }
        },
        {
            new: true,
        }
    )

    if (!note) {
        throw new ApiError(404, "Note not found");
    }

    // return response
    return res
        .status(200)
        .json(new ApiResponse(200, note, "Note updated successfully"));
});


export {
    createNote,
    uploadAndProcessDocument,
    getNotesWithOptionalFilters,
    getLastUpdatedNotes,
    getNoteById,
    updateNote,
}