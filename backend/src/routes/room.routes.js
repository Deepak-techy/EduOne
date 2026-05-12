import { Router } from "express";
import {
    createRoomHandler,
    getRoomById,
    getActiveRoomsForPost,
    joinRoomHandler,
    leaveRoomHandler,
    endRoomHandler,
    joinByCode,
    getActiveRoomsList,
    getRoomChat,
} from "../controllers/room.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// All routes require authentication
router.use(verifyJWT);

// Static routes first
router.route("/create").post(createRoomHandler);                         // POST /api/rooms/create
router.route("/active").get(getActiveRoomsList);                         // GET  /api/rooms/active
router.route("/join-by-code/:code").get(joinByCode);                     // GET  /api/rooms/join-by-code/:code
router.route("/post/:postId/active").get(getActiveRoomsForPost);         // GET  /api/rooms/post/:postId/active

// Dynamic routes
router.route("/:roomId").get(getRoomById);                               // GET  /api/rooms/:roomId
router.route("/:roomId/join").post(joinRoomHandler);                     // POST /api/rooms/:roomId/join
router.route("/:roomId/leave").post(leaveRoomHandler);                   // POST /api/rooms/:roomId/leave
router.route("/:roomId/end").post(endRoomHandler);                       // POST /api/rooms/:roomId/end
router.route("/:roomId/chat").get(getRoomChat);                          // GET  /api/rooms/:roomId/chat

export default router;
