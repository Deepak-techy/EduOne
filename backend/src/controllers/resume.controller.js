import fs from "fs"

import { Resume } from "../models/resume.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { extractTextFromPDF } from "../services/pdfProcessor.service.js";
import { uploadOnCloudinary } from "../services/cloudinaryUpload.service.js";
import { deleteFromCloudinary } from "../services/cloudinaryDelete.service.js";
import { analyzeResume } from "../services/aiAnalyzer.service.js";

const uploadAndAnalyzeResume = asyncHandler(async (req, res) => {
    // get user details from frontend
    const { fullName, jobRole, experienceLevel, jobDescription } = req.body
    const { _id: userId } = req.user

    // check if file exists
    if (!req.file) {
        throw new ApiError(400, "No file uploaded")
    }

    if (!fullName || !jobRole || !experienceLevel || !jobDescription) {
        fs.unlinkSync(req.file.path)
        throw new ApiError(400, "All fields are required")
    }

    const resumeText = await extractTextFromPDF(req.file.path)

    if (!resumeText || resumeText.trim().length === 0) {
        fs.unlinkSync(req.file.path)
        throw new ApiError(400, "PDF contains no readable text")
    }

    const cloudinaryResponse = await uploadOnCloudinary(req.file.path)

    // analyze resume using AI
    const aiAnalysisResponse = await analyzeResume(
        resumeText,
        fullName,
        jobRole,
        experienceLevel,
        jobDescription
    )

    if (!aiAnalysisResponse) {
        await deleteFromCloudinary(cloudinaryResponse.public_id)
        throw new ApiError(500, "Failed to analyze resume")
    }

    // save to database
    const resume = await Resume.create({
        userId,
        fullName,
        jobRole,
        experienceLevel,
        jobDescription,
        resumeUrl: cloudinaryResponse.secure_url,
        resumePublicId: cloudinaryResponse.public_id,
        analysisResult: aiAnalysisResponse
    })

    if (!resume) {
        throw new ApiError(500, "Failed to save resume to database")
    }

    // return response
    return res
        .status(200)
        .json(new ApiResponse(200, resume, "Resume uploaded and analyzed successfully"))
})




export {
    uploadAndAnalyzeResume,
}