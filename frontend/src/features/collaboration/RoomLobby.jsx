// src/features/collaboration/RoomLobby.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Mic, MicOff, Video, VideoOff, ArrowLeft, Users, Clock, Hash } from "lucide-react";
import { roomService } from "../../services/roomService";
import useRoom from "../../store/useRoom";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";

const RoomLobby = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [joining, setJoining] = useState(false);
    const [localMuted, setLocalMuted] = useState(false);
    const [localCameraOff, setLocalCameraOff] = useState(false);
    const [previewStream, setPreviewStream] = useState(null);
    const videoRef = useRef(null);

    const { setRoom: setStoreRoom, setMuted, setCameraOff } = useRoom();

    // Load room info
    useEffect(() => {
        const loadRoom = async () => {
            try {
                const res = await roomService.getRoom(roomId);
                setRoom(res.data?.data);
            } catch (err) {
                toast.error("Room not found or has ended");
                navigate("/community/feed");
            } finally {
                setLoading(false);
            }
        };
        loadRoom();
    }, [roomId, navigate]);

    // Camera preview
    const startPreview = useCallback(async () => {
        if (room?.type !== "video") return;
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: 640, height: 480 },
                audio: true,
            });
            setPreviewStream(stream);
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.log("Camera preview unavailable:", err.message);
        }
    }, [room?.type]);

    useEffect(() => {
        startPreview();
        return () => {
            previewStream?.getTracks().forEach((t) => t.stop());
        };
    }, [room?.type]); // eslint-disable-line

    const handleJoin = async () => {
        setJoining(true);
        try {
            const res = await roomService.joinRoom(roomId);
            setStoreRoom(res.data?.data);
            setMuted(localMuted);
            setCameraOff(localCameraOff);

            // Stop preview stream
            previewStream?.getTracks().forEach((t) => t.stop());

            // Navigate to the actual room
            if (room.type === "voice") {
                navigate(`/community/room/${roomId}/voice`);
            } else {
                navigate(`/community/room/${roomId}/video`);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to join room");
        } finally {
            setJoining(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500" />
            </div>
        );
    }

    if (!room || room.status !== "active") {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-2">Room Not Available</h2>
                    <p className="text-gray-400 mb-6">This room has ended or doesn't exist.</p>
                    <button
                        onClick={() => navigate("/community/feed")}
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors font-medium"
                    >
                        Back to Community
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
            <div className="w-full max-w-3xl">
                {/* Back button */}
                <button
                    onClick={() => navigate("/community/feed")}
                    className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft size={18} />
                    <span className="text-sm">Back to Community</span>
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    {/* Preview */}
                    <div className="aspect-video bg-gray-800 rounded-2xl overflow-hidden relative">
                        {room.type === "video" && !localCameraOff ? (
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                                <div className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold text-white bg-gradient-to-br from-indigo-500 to-purple-600">
                                    {user?.fullName?.[0]?.toUpperCase() || "U"}
                                </div>
                            </div>
                        )}

                        {/* Preview controls */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3">
                            <button
                                onClick={() => {
                                    setLocalMuted(!localMuted);
                                    previewStream?.getAudioTracks().forEach((t) => (t.enabled = localMuted));
                                }}
                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                                    localMuted ? "bg-red-500 text-white" : "bg-gray-700/80 text-white hover:bg-gray-600"
                                }`}
                            >
                                {localMuted ? <MicOff size={18} /> : <Mic size={18} />}
                            </button>

                            {room.type === "video" && (
                                <button
                                    onClick={() => {
                                        setLocalCameraOff(!localCameraOff);
                                        previewStream?.getVideoTracks().forEach((t) => (t.enabled = localCameraOff));
                                    }}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                                        localCameraOff ? "bg-red-500 text-white" : "bg-gray-700/80 text-white hover:bg-gray-600"
                                    }`}
                                >
                                    {localCameraOff ? <VideoOff size={18} /> : <Video size={18} />}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Room Info */}
                    <div className="space-y-6">
                        <div>
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3 ${
                                room.type === "voice"
                                    ? "bg-purple-500/20 text-purple-400"
                                    : "bg-blue-500/20 text-blue-400"
                            }`}>
                                {room.type === "voice" ? <Mic size={12} /> : <Video size={12} />}
                                {room.type === "voice" ? "Voice Channel" : "Video Meeting"}
                            </span>
                            <h1 className="text-2xl font-bold text-white mt-2">{room.title}</h1>
                        </div>

                        <div className="space-y-3 text-sm">
                            <div className="flex items-center gap-3 text-gray-400">
                                <Users size={16} />
                                <span>{room.participants?.length || 0} / {room.maxParticipants} participants</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-400">
                                <Hash size={16} />
                                <span className="font-mono text-blue-400">{room.roomCode}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-400">
                                <Clock size={16} />
                                <span>Started {new Date(room.startedAt).toLocaleTimeString()}</span>
                            </div>
                        </div>

                        {/* Participant avatars */}
                        {room.participants?.length > 0 && (
                            <div className="flex items-center gap-2">
                                <div className="flex -space-x-2">
                                    {room.participants.slice(0, 5).map((p, i) => (
                                        <div
                                            key={i}
                                            className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white border-2 border-gray-950"
                                            title={p.userId?.fullName}
                                        >
                                            {p.userId?.avatar ? (
                                                <img src={p.userId.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                                            ) : (
                                                (p.userId?.fullName || "U")[0].toUpperCase()
                                            )}
                                        </div>
                                    ))}
                                </div>
                                {room.participants.length > 5 && (
                                    <span className="text-xs text-gray-400">
                                        +{room.participants.length - 5} more
                                    </span>
                                )}
                            </div>
                        )}

                        {/* Join Button */}
                        <button
                            onClick={handleJoin}
                            disabled={joining}
                            className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl font-semibold text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40"
                        >
                            {joining ? "Joining..." : "Join Now"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoomLobby;
