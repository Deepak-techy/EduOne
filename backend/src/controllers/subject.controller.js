import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { SUBJECT_COLLECTIONS, SUBJECT_LIST } from "../constants.js";
import { searchInSubject } from "../services/vector.service.js";
import { generateAnswer } from "../services/qa.service.js";

const getSubjectDocuments = asyncHandler(async (req, res) => {
    // get subject and query from frontend
    const { subject, query } = req.body;

    if (!subject) {
        throw new ApiError(400, "Subject is required");
    }

    if (!query) {
        throw new ApiError(400, "Query is required");
    }

    if (!SUBJECT_COLLECTIONS[subject]) {
        throw new ApiError(400, "Subject not found");
    }

    // semantic search in subject collection
    const context = await searchInSubject(subject, query)

    if (!context) {
        throw new ApiError(400, "No context found");
    }

    // generate answer from context
    const answer = await generateAnswer(query, context)

    if (!answer) {
        throw new ApiError(400, "Answer not found");
    }

    // return response
    return res
        .status(200)
        .json(new ApiResponse(200, {
            answer,
            sources: context.map(doc => doc.metadata)
        }, "Answer generated successfully"))
})

const getAvailableSubjects = asyncHandler(async (req, res) => {
    // return response
    return res
        .status(200)
        .json(new ApiResponse(200, SUBJECT_LIST, "Subjects fetched successfully"))
})


export {
    getSubjectDocuments,
    getAvailableSubjects
}