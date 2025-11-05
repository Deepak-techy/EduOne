import { mongoose, Schema } from "mongoose";

const taskSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        subject: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },
        task: {
            type: String,
            required: true,
            trim: true,
            maxlength: 500,
        },
        dueDate: {
            type: Date,
            required: true,
            index: true,
        },
        priority: {
            type: String,
            enum: ["High", "Medium", "Low"],
            default: "Low",
            required: true,
        },
        isCompleted: {
            type: Boolean,
            default: false,
            index: true,
        },
        colorCode: {
            type: String,
            default: "#4CAF50",
        },
        completedAt: {
            type: Date,
            default: null,
            index: true,
        }
    },
    {
        timestamps: true
    }
)

// Index for efficient querying by date range
taskSchema.index({ userId: 1, dueDate: 1 });
taskSchema.index({ userId: 1, isCompleted: 1 });
taskSchema.index({ userId: 1, completedAt: 1 });

export const Task = mongoose.model("Task", taskSchema);