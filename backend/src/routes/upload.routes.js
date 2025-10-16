import { Router } from "express";

import {
    uploadPermanentPDF,
    uploadTempPDF,
    queryTempUpload
} from "../controllers/upload.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";


const router = Router();


// secured routes
router.route("/permanent").post(verifyJWT, upload.single("pdf"), uploadPermanentPDF)   // POST /api/upload/permanent
router.route("/temporary").post(verifyJWT, upload.single("pdf"), uploadTempPDF)   // POST /api/upload/temporary
router.route("/query").post(verifyJWT, queryTempUpload)   // POST /api/upload/query



export default router;