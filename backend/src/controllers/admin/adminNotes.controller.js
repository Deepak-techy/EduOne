import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { Note } from "../../models/note.model.js";
import { deleteFromCloudinary } from "../../services/cloudinaryDelete.service.js";
import { deleteDocumentChunksFromNotesCollection } from "../../services/vector.service.js";
import { PAGINATION_DEFAULTS } from "../../admin.constants.js";


const getAllNotes = asyncHandler(async (req, res) => {
    const {
        page = PAGINATION_DEFAULTS.PAGE,
        limit = PAGINATION_DEFAULTS.LIMIT,
        subject, search,
        sortBy = "createdAt", order = "desc",
    } = req.query;

    const query = {};
    if (subject) query.subject = subject.trim();
    if (search) {
        query.$or = [
            { subject: { $regex: search, $options: "i" } },
            { content: { $regex: search, $options: "i" } },
        ];
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const totalNotes = await Note.countDocuments(query);
    const totalPages = Math.ceil(totalNotes / limitNum);

    const notes = await Note.find(query)
        .sort({ [sortBy]: order === "asc" ? 1 : -1 })
        .skip(skip).limit(limitNum)
        .select("-documentChunkIds -qdrantCollectionName")
        .populate("userId", "fullName userName email")
        .lean();

    return res.status(200).json(new ApiResponse(200,
        { count: notes.length, page: pageNum, totalPages, totalNotes, notes },
        "Notes fetched successfully"
    ));
})

const getNoteById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) throw new ApiError(400, "Note ID is required");

    const note = await Note.findById(id)
        .populate("userId", "fullName userName email").lean();
    if (!note) throw new ApiError(404, "Note not found");

    return res.status(200).json(new ApiResponse(200, note, "Note fetched successfully"));
})

const deleteNote = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) throw new ApiError(400, "Note ID is required");

    const note = await Note.findById(id);
    if (!note) throw new ApiError(404, "Note not found");

    // delete from cloudinary if document exists
    if (note.documentUrl) {
        await deleteFromCloudinary(note.documentPublicId);
    }

    // delete from qdrant if embeddings exist
    if (note.documentChunkIds && note.documentChunkIds.length > 0) {
        await deleteDocumentChunksFromNotesCollection(
            id, note.qdrantCollectionName, note.documentChunkIds
        );
    }

    await Note.deleteOne({ _id: id });

    return res.status(200).json(new ApiResponse(200, {}, "Note deleted successfully"));
})

const getNotesUsageStats = asyncHandler(async (req, res) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [totalNotes, notesWithDocuments, recentNotes] = await Promise.all([
        Note.countDocuments(),
        Note.countDocuments({ documentUrl: { $ne: null } }),
        Note.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
    ]);

    // notes per subject distribution
    const notesPerSubject = await Note.aggregate([
        { $group: { _id: "$subject", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
    ]);

    // notes creation trend (last 30 days)
    const notesPerDay = await Note.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
    ]);

    // top users by notes count
    const topUsers = await Note.aggregate([
        { $group: { _id: "$userId", notesCount: { $sum: 1 } } },
        { $sort: { notesCount: -1 } },
        { $limit: 10 },
        { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "user" } },
        { $unwind: "$user" },
        { $project: { _id: 0, userId: "$_id", fullName: "$user.fullName", userName: "$user.userName", notesCount: 1 } },
    ]);

    return res.status(200).json(new ApiResponse(200,
        {
            overview: { totalNotes, notesWithDocuments, recentNotes, documentUploadRate: totalNotes > 0 ? Math.round((notesWithDocuments / totalNotes) * 100) : 0 },
            distribution: { notesPerSubject },
            trends: { notesPerDay },
            topUsers,
        },
        "Notes usage stats fetched successfully"
    ));
})


export { getAllNotes, getNoteById, deleteNote, getNotesUsageStats }
