import { Note } from "../models/note.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { getCollectionName } from "../constants.js";
import { processNoteDocument } from "../services/pdfProcessor.service.js";
import { deleteDocumentChunksFromNotesCollection } from "../services/vector.service.js";
import { deleteFromCloudinary } from "../services/cloudinaryDelete.service.js";
import { answerQuestionFromNotesDocument, generateAITags } from "../services/generateAnswer.service.js";
import { extractUniqueTags, generateTagSuggestions } from "../utils/tagGenerator.js";

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

    if (note.documentUrl) {
        throw new ApiError(400, "A document is already uploaded for this note. You cannot upload another.");
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
        // Normalize tags: ensure array + lowercase
        const tagArray = Array.isArray(tags) ? tags : [tags];
        const lowerCaseTags = tagArray.map(tag => tag.toLowerCase().trim());
        query.tags = { $in: lowerCaseTags };
    }

    if (search) {
        query.$text = { $search: search.trim() };
    }

    // Execute query with sorting
    const notes = await Note.find(query)
        .sort({ [sortBy]: order === 'asc' ? 1 : -1 })
        .select("-documentChunkIds -qdrantCollectionName")
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

const deleteNote = asyncHandler(async (req, res) => {
    // get noteId from params
    const { noteId } = req.params;
    const { _id: userId } = req.user;

    if (!noteId) {
        throw new ApiError(400, "Note ID is required");
    }

    // find the note
    const note = await Note.findOne({ _id: noteId, userId });

    if (!note) {
        throw new ApiError(404, "Note not found");
    }

    // delete from cloudinary if documentUrl exists
    if (note.documentUrl) {
        await deleteFromCloudinary(note.documentUrl);
    }

    // Delete from qdrant if embeddings exist
    if (note.documentChunkIds && note.documentChunkIds.length > 0) {
        await deleteDocumentChunksFromNotesCollection(
            note.qdrantCollectionName,
            note.documentChunkIds
        );
    }

    // Delete note from database
    await Note.deleteOne({ _id: noteId });

    //return response
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Note deleted successfully"));
});

const askAi = asyncHandler(async (req, res) => {
    // get noteID and question from frontend
    const { noteId } = req.params;
    const { question } = req.body;
    const { _id: userId } = req.user;

    if (!noteId) {
        throw new ApiError(400, "Note ID is required");
    }

    if (!question) {
        throw new ApiError(400, "Question is required");
    }

    // find note that matches both ID and user
    const note = await Note.findOne({ _id: noteId, userId });

    if (!note) {
        throw new ApiError(404, "Note not found");
    }

    if (!note.documentUrl) {
        throw new ApiError(400, "No document associated with this note");
    }

    // get answer from ai based on uploaded document
    const answer = await answerQuestionFromNotesDocument(
        question,
        note.qdrantCollectionName,
        noteId
    );

    if (!answer) {
        throw new ApiError(500, "The document does not contain any relevant information");
    }

    // return response
    return res
        .status(200)
        .json(new ApiResponse(
            200,
            {
                question,
                answer
            },
            "AI answer generated successfully"
        ));
});

const generateNoteTags = asyncHandler(async (req, res) => {
    // get subject and content from frontend
    const { subject, content } = req.body;

    if (!subject || !content) {
        throw new ApiError(400, "Subject and content are required");
    }

    // Generate AI-powered tags based on note content
    const tags = await generateAITags(content, subject);

    if (!tags || tags.length === 0) {
        throw new ApiError(500, "Failed to generate tags");
    }

    // return response
    return res
        .status(200)
        .json(new ApiResponse(200, tags, "AI tags generated successfully"));
});

const getTagSuggestions = asyncHandler(async (req, res) => {
    // get query from frontend
    const { query } = req.query;
    const { _id: userId } = req.user;

    if (!query) {
        throw new ApiError(400, "Search query is required");
    }

    // fetch user's notes and extract tags
    const notes = await Note.find({ userId }).select("tags").lean();

    if (!notes || notes.length === 0) {
        throw new ApiError(404, "No notes found for this user");
    }

    // Extract unique tags
    const allTags = extractUniqueTags(notes);

    // Generate tag suggestions based on query
    const suggestions = generateTagSuggestions(allTags, query);

    if (suggestions.length === 0) {
        throw new ApiError(404, "No suggestions found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, suggestions, "Tag suggestions fetched successfully"));
});

const getSubjects = asyncHandler(async (req, res) => {
    // get userId from request
    const { _id: userId } = req.user;

    // fetch unique subjects for the user
    const subjects = await Note.distinct("subject", { userId });

    if (!subjects || subjects.length === 0) {
        throw new ApiError(404, "No subjects found for this user");
    }

    // return response
    return res
        .status(200)
        .json(new ApiResponse(200, subjects, "Subjects fetched successfully"));
});

const searchNotes = asyncHandler(async (req, res) => {
    // get  query from frontend
    const { _id: userId, userName } = req.user;
    const { query, limit = 5 } = req.query;

    // Validate query
    if (!query) {
        throw new ApiError(400, "Search query is required");
    }

    const collectionName = getCollectionName(userName);

    // Perform semantic search in Qdrant
    const searchResults = await searchSimilarContentInNotesCollection(
        collectionName,
        query,
        parseInt(limit)
    );

    if (!searchResults || searchResults.length === 0) {
        throw new ApiError(404, "No relevant results found");
    }

    // Extract unique note IDs
    const noteIds = [...new Set(searchResults.map(r => r.payload.noteId))];

    // Fetch notes from MongoDB
    const notes = await Note.find({
        _id: { $in: noteIds },
        userId: userId,
    }).lean();

    if (!notes || notes.length === 0) {
        throw new ApiError(404, "No matching notes found in database");
    }

    // Combine search results with note data
    const results = notes.map(note => {
        const relevantChunks = searchResults
            .filter(r => r.payload.noteId === note._id.toString())
            .map(r => ({
                text: r.payload.text,
                score: r.score,
            }));

        return {
            note,
            relevantChunks,
            maxScore: Math.max(...relevantChunks.map(c => c.score)),
        };
    });

    // Sort by highest relevance score
    results.sort((a, b) => b.maxScore - a.maxScore);

    // Send response
    return res.status(200).json(
        new ApiResponse(
            200,
            {
                query,
                count: results.length,
                results,
            },
            "Semantic search completed successfully"
        )
    );
});


export {
    createNote,
    uploadAndProcessDocument,
    getNotesWithOptionalFilters,
    getLastUpdatedNotes,
    getNoteById,
    updateNote,
    deleteNote,
    askAi,
    generateNoteTags,
    getTagSuggestions,
    getSubjects,
}