import { mongoose, Schema } from "mongoose";

const categoryScoresSchema = new Schema(
    {
        grammarAndLanguage: {
            type: Number,
            required: true,
            min: 0,
            max: 100
        },
        toneAndStyle: {
            type: Number,
            required: true,
            min: 0,
            max: 100
        },
        structure: {
            type: Number,
            required: true,
            min: 0,
            max: 100
        },
        skillsMatch: {
            type: Number,
            required: true,
            min: 0,
            max: 100
        },
        contentQuality: {
            type: Number,
            required: true,
            min: 0,
            max: 100
        }
    },
    {
        _id: false
    }
)

const analysisResultSchema = new Schema(
    {
        overallScore: {
            type: Number,
            required: true,
            min: 0,
            max: 100
        },
        categoryScores: {
            type: categoryScoresSchema,
            required: true
        },
        suggestions: [
            {
                type: String
            }
        ],
        missingKeywords: [
            {
                type: String
            }
        ]
    },
    {
        _id: false
    }
)


const resumeSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
        },
        jobRole: {
            type: String,
            required: true,
            trim: true,
        },
        experienceLevel: {
            type: String,
            required: true,
            enum: ['Fresher (0-1 years)', 'Intermediate (1-5 years)', 'Experienced (5+ years)'],
        },
        jobDescription: {
            type: String,
            default: "",
        },
        resumeUrl: {
            type: String,
            default: "",
        },
        resumePublicId: {
            type: String,
            default: null,
        },
        analysisResult: {
            type: analysisResultSchema,
            required: true
        },
    },
    {
        timestamps: true
    }
);


export const Resume = mongoose.model("Resume", resumeSchema)