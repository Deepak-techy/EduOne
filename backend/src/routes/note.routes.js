import { Router } from "express";

import {
    createNote,
    uploadAndProcessDocument,
} from "../controllers/note.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/create").post(verifyJWT, createNote)    // POST /api/notes/create
router.route("/:noteId/upload").post(verifyJWT, upload.single("pdf"), uploadAndProcessDocument)    // POST /api/notes/:noteId/upload


export default router;