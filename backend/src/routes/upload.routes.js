import { Router } from "express";

import {
    uploadPermanentPDF,
    uploadTempPDF,
    queryForTempUpload
} from "../controllers/upload.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";


const router = Router();


// secured routes
router.route("/permanent").post(verifyJWT, upload.single("pdf"), uploadPermanentPDF)   // POST /api/uploads/permanent
router.route("/temporary").post(verifyJWT, upload.single("pdf"), uploadTempPDF)   // POST /api/uploads/temporary
router.route("/query").post(verifyJWT, queryForTempUpload)   // POST /api/uploads/query



export default router;