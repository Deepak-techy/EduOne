// src/features/communityPost/components/RoomActions.jsx
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Mic, Video, Users, Plus } from "lucide-react";
import { roomService } from "../../../services/roomService";
import LiveRoomIndicator from "../../collaboration/components/LiveRoomIndicator";
import useSocket from "../../../hooks/useSocket";
import { toast } from "react-toastify";

const RoomActions = ({ postId }) => {
    const navigate = useNavigate();
    const { socket } = useSocket();
    const [activeRooms, setActiveRooms] = useState([]);
    const [creating, setCreating] = useState(null);

    const voiceRoom = activeRooms.find((r) => r.type === "voice");
    const videoRoom = activeRooms.find((r) => r.type === "video");

    // Load active rooms for this post
    const loadRooms = useCallback(async () => {
        try {
            const res = await roomService.getActiveRoomsForPost(postId);
            setActiveRooms(res.data?.data?.rooms || []);
        } catch (_) {}
    }, [postId]);

    useEffect(() => { loadRooms(); }, [loadRooms]);

    // Listen for real-time room updates
    useEffect(() => {
        if (!socket) return;
        const handler = (data) => {
            if (data.postId === postId) loadRooms();
        };
        socket.on("room:participant-count-updated", handler);
        return () => socket.off("room:participant-count-updated", handler);
    }, [socket, postId, loadRooms]);

    const createAndJoin = async (type) => {
        setCreating(type);
        try {
            const res = await roomService.createRoom(postId, type);
            const room = res.data?.data;
            if (room) {
                navigate(`/community/room/${room._id}`);
            }
        } catch (err) {
            const msg = err.response?.data?.message || `Failed to create ${type} room`;
            if (msg.includes("already exists")) {
                loadRooms();
                toast.info(`A ${type} room already exists — join it!`);
            } else {
                toast.error(msg);
            }
        } finally {
            setCreating(null);
        }
    };

    const joinRoom = (room) => {
        navigate(`/community/room/${room._id}`);
    };

    return (
        <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-gray-100/50 dark:border-gray-700/30">
            {/* Voice Room */}
            {voiceRoom ? (
                <button
                    onClick={() => joinRoom(voiceRoom)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/20 dark:border-purple-500/30 hover:bg-purple-500/20 dark:hover:bg-purple-500/30 transition-all"
                >
                    <Mic size={13} />
                    Join Voice
                    <span className="flex items-center gap-1 ml-0.5 text-[10px] opacity-75">
                        <Users size={10} />{voiceRoom.participants?.length || 0}
                    </span>
                    <LiveRoomIndicator type="voice" isActive />
                </button>
            ) : (
                <button
                    onClick={() => createAndJoin("voice")}
                    disabled={creating === "voice"}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700/50 hover:bg-purple-50 dark:hover:bg-purple-500/10 hover:text-purple-600 dark:hover:text-purple-400 hover:border-purple-200 dark:hover:border-purple-500/30 transition-all disabled:opacity-50"
                >
                    {creating === "voice" ? (
                        <div className="w-3 h-3 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <Plus size={13} />
                    )}
                    <Mic size={13} />
                    Voice Room
                </button>
            )}

            {/* Video Room */}
            {videoRoom ? (
                <button
                    onClick={() => joinRoom(videoRoom)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/20 dark:border-blue-500/30 hover:bg-blue-500/20 dark:hover:bg-blue-500/30 transition-all"
                >
                    <Video size={13} />
                    Join Meeting
                    <span className="flex items-center gap-1 ml-0.5 text-[10px] opacity-75">
                        <Users size={10} />{videoRoom.participants?.length || 0}
                    </span>
                    <LiveRoomIndicator type="video" isActive />
                </button>
            ) : (
                <button
                    onClick={() => createAndJoin("video")}
                    disabled={creating === "video"}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700/50 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-500/30 transition-all disabled:opacity-50"
                >
                    {creating === "video" ? (
                        <div className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <Plus size={13} />
                    )}
                    <Video size={13} />
                    Meeting
                </button>
            )}
        </div>
    );
};

export default RoomActions;
