import { Router } from "express";

import {
    createNote,
    uploadAndProcessDocument,
    getNotesWithOptionalFilters,
    getLastUpdatedNotes,
    getNoteById,
    updateNote,
} from "../controllers/note.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/create").post(verifyJWT, createNote)    // POST /api/notes/create
router.route("/:noteId/upload").post(verifyJWT, upload.single("pdf"), uploadAndProcessDocument)    // POST /api/notes/:noteId/upload
router.route("/all").get(verifyJWT, getNotesWithOptionalFilters)    // GET /api/notes/all
router.route("/last-updated").get(verifyJWT, getLastUpdatedNotes)    // GET /api/notes/last-updated
router.route("/:noteId").get(verifyJWT, getNoteById)    // GET /api/notes/:noteId
router.route("/:noteId/update").patch(verifyJWT, updateNote)    // PATCH /api/notes/:noteId/update


export default router;