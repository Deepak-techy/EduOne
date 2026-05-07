import { Server } from "socket.io";

let io;

const initSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: process.env.CORS_ORIGIN,
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        console.log(`Socket connected: ${socket.id}`);

        // join a specific post room to receive real-time updates for that post
        socket.on("joinPost", (postId) => {
            socket.join(`post:${postId}`);
        });

        // leave a specific post room
        socket.on("leavePost", (postId) => {
            socket.leave(`post:${postId}`);
        });

        // join admin dashboard room for real-time admin events
        socket.on("joinAdminDashboard", () => {
            socket.join("admin-dashboard");
        });

        socket.on("disconnect", () => {
            console.log(`Socket disconnected: ${socket.id}`);
        });
    });

    console.log("Socket.IO initialized");
    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error("Socket.IO not initialized. Call initSocket first.");
    }
    return io;
};

export { initSocket, getIO };
