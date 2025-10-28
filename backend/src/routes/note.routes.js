import { Router } from "express";

import {
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
} from "../controllers/note.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// secured routes
router.route("/create").post(verifyJWT, createNote)    // POST /api/notes/create
router.route("/:noteId/upload").post(verifyJWT, upload.single("pdf"), uploadAndProcessDocument)    // POST /api/notes/:noteId/upload
router.route("/all").get(verifyJWT, getNotesWithOptionalFilters)    // GET /api/notes/all
router.route("/last-updated").get(verifyJWT, getLastUpdatedNotes)    // GET /api/notes/last-updated
router.route("/:noteId").get(verifyJWT, getNoteById)    // GET /api/notes/:noteId
router.route("/:noteId/update").patch(verifyJWT, updateNote)    // PATCH /api/notes/:noteId/update
router.route("/:noteId/delete").delete(verifyJWT, deleteNote)    // DELETE /api/notes/:noteId/delete
router.route("/:noteId/ask-ai").post(verifyJWT, askAi)    // POST /api/notes/:noteId/ask-ai
router.route("/:noteId/generate-tags").post(verifyJWT, generateNoteTags)    // POST /api/notes/:noteId/generate-tags
router.route("/tag-suggestions").get(verifyJWT, getTagSuggestions)    // GET /api/notes/tag-suggestions
router.route("/subjects").get(verifyJWT, getSubjects)    // GET /api/notes/subjects


export default router;