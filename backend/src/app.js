import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({
    limit: "16kb"
}))
app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}))
app.use(express.static("public"))
app.use("/uploads", express.static("uploads"))
app.use(cookieParser())



// routes import
import userRouter from "./routes/user.routes.js"
import subjectRouter from "./routes/subject.routes.js"
import uploadRouter from "./routes/upload.routes.js"
import noteRouter from "./routes/note.routes.js"
import taskRouter from "./routes/task.routes.js"
import resumeRouter from "./routes/resume.routes.js"
import communityRouter from "./routes/community.routes.js"
import adminRouter from "./routes/admin/index.routes.js"
import notificationRouter from "./routes/notification.routes.js"


// route declarations
app.use("/api/users", userRouter)   // users route
app.use("/api/subjects", subjectRouter)   // subjects route
app.use("/api/uploads", uploadRouter)   // uploads route
app.use("/api/notes", noteRouter)   // notes route
app.use("/api/tasks", taskRouter)   // tasks route
app.use("/api/resumes", resumeRouter)   // resumes route
app.use("/api/community", communityRouter)   // community route
app.use("/api/notifications", notificationRouter)   // notifications route
app.use("/api/admin", adminRouter)   // admin routes

// Global error handler middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Something went wrong";
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        errors: err.errors || [],
    });
});

export { app }