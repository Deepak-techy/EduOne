// src/features/collaboration/VideoMeetingRoom.jsx
import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Video, Hash, ArrowLeft, Copy, Check } from "lucide-react";
import { roomService } from "../../services/roomService";
import useRoom from "../../store/useRoom";
import useSocket from "../../hooks/useSocket";
import useWebRTC from "../../hooks/useWebRTC";
import useAudioLevel from "../../hooks/useAudioLevel";
import { useAuth } from "../../contexts/AuthContext";
import VideoTile from "./components/VideoTile";
import MeetingControls from "./components/MeetingControls";
import ChatPanel from "./components/ChatPanel";
import ParticipantSidebar from "./components/ParticipantSidebar";
import { toast } from "react-toastify";

const VideoMeetingRoom = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { socket, emit, connected } = useSocket();
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [meetingDuration, setMeetingDuration] = useState(0);
    const [codeCopied, setCodeCopied] = useState(false);

    const {
        currentRoom, participants, remoteStreams,
        isMuted, isCameraOff, isScreenSharing, isHandRaised,
        activeSpeaker, isChatOpen, isParticipantsOpen,
        setRoom, clearRoom, setConnectionStatus,
        updateParticipant, addParticipant, removeParticipant,
        toggleMute, toggleCamera, toggleScreenShare, toggleHandRaise,
        toggleChat, toggleParticipants, setChatMessages,
    } = useRoom();

    const {
        localStream, peerId,
        getLocalStream, initPeer,
        toggleMic, toggleCam, startScreenShare, stopScreenShare, startVAD,
    } = useWebRTC(socket, roomId, "video");

    const audioLevel = useAudioLevel(localStream);

    const hasJoinedRef = useRef(false);

    // Initialize room — waits for socket to be connected
    useEffect(() => {
        if (!connected) return; // Wait for socket
        let stale = false;

        const initRoom = async () => {
            try {
                setConnectionStatus("connecting");
                const res = await roomService.getRoom(roomId);
                if (stale) return;
                const room = res.data?.data;
                if (!room || room.status !== "active") {
                    toast.error("Room is no longer active");
                    navigate("/community/feed");
                    return;
                }
                setRoom(room);

                try {
                    const chatRes = await roomService.getChatHistory(roomId);
                    if (!stale) setChatMessages(chatRes.data?.data?.messages || []);
                } catch (_) {}

                if (stale) return;
                const stream = await getLocalStream();
                if (stale) return;
                if (!stream) { toast.error("Could not access media devices"); return; }

                await initPeer();
                if (stale) return;

                // Small delay to ensure WebRTC socket listeners are registered
                await new Promise(r => setTimeout(r, 200));
                if (stale) return;

                emit("room:join", { roomId, peerId: "native-webrtc" });
                startVAD(stream);
                hasJoinedRef.current = true;
                setConnectionStatus("connected");
                console.log("[VideoRoom] Joined room:", roomId);
            } catch (err) {
                if (stale) return;
                console.error("Failed to init video room:", err);
                toast.error("Failed to connect");
                setConnectionStatus("error");
            }
        };
        initRoom();
        return () => {
            stale = true;
            if (hasJoinedRef.current) {
                emit("room:leave", { roomId });
                roomService.leaveRoom(roomId).catch(() => {});
                hasJoinedRef.current = false;
            }
            clearRoom();
        };
    }, [roomId, connected]); // eslint-disable-line

    // Socket listeners
    useEffect(() => {
        if (!socket) return;
        const onUpdate = ({ userId, ...updates }) => updateParticipant(userId, updates);
        const onEnd = ({ reason }) => { toast.info(reason || "Room ended"); clearRoom(); navigate("/community/feed"); };
        const onJoin = ({ userId, userName, avatar }) => {
            addParticipant({ userId: { _id: userId, fullName: userName, avatar }, role: "participant", isMuted: false, isCameraOff: true, isHandRaised: false });
        };
        const onLeft = ({ userId }) => removeParticipant(userId);

        socket.on("room:participant-updated", onUpdate);
        socket.on("room:ended", onEnd);
        socket.on("webrtc:peer-joined", onJoin);
        socket.on("webrtc:peer-left", onLeft);
        return () => { socket.off("room:participant-updated", onUpdate); socket.off("room:ended", onEnd); socket.off("webrtc:peer-joined", onJoin); socket.off("webrtc:peer-left", onLeft); };
    }, [socket]); // eslint-disable-line

    // Timer
    useEffect(() => {
        if (!currentRoom?.startedAt) return;
        const start = new Date(currentRoom.startedAt).getTime();
        const iv = setInterval(() => setMeetingDuration(Math.floor((Date.now() - start) / 1000)), 1000);
        return () => clearInterval(iv);
    }, [currentRoom?.startedAt]);

    const handleToggleMic = useCallback(() => { toggleMic(); toggleMute(); emit("room:participant-update", { roomId, isMuted: !isMuted }); }, [isMuted, roomId]); // eslint-disable-line
    const handleToggleCamera = useCallback(() => { toggleCam(); toggleCamera(); emit("room:participant-update", { roomId, isCameraOff: !isCameraOff }); }, [isCameraOff, roomId]); // eslint-disable-line
    const handleToggleScreen = useCallback(async () => {
        if (!isScreenSharing) {
            const s = await startScreenShare();
            if (s) { toggleScreenShare(); emit("room:screen-share", { roomId, isSharing: true }); emit("room:participant-update", { roomId, isScreenSharing: true }); }
        } else {
            stopScreenShare(); toggleScreenShare(); emit("room:screen-share", { roomId, isSharing: false }); emit("room:participant-update", { roomId, isScreenSharing: false });
        }
    }, [isScreenSharing, roomId]); // eslint-disable-line
    const handleToggleHand = useCallback(() => { toggleHandRaise(); emit("room:participant-update", { roomId, isHandRaised: !isHandRaised }); }, [isHandRaised, roomId]); // eslint-disable-line
    const handleLeave = useCallback(async () => { emit("room:leave", { roomId }); try { await roomService.leaveRoom(roomId); } catch(_){} clearRoom(); navigate("/community/feed"); }, [roomId]); // eslint-disable-line
    const handleFullscreen = useCallback(() => {
        if (!document.fullscreenElement) { document.documentElement.requestFullscreen(); setIsFullscreen(true); }
        else { document.exitFullscreen(); setIsFullscreen(false); }
    }, []);
    const copyCode = () => { navigator.clipboard.writeText(currentRoom?.roomCode || ""); setCodeCopied(true); setTimeout(() => setCodeCopied(false), 2000); };

    const fmt = (s) => { const h = Math.floor(s/3600), m = Math.floor((s%3600)/60), sec = s%60; return h > 0 ? `${h}:${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}` : `${m}:${String(sec).padStart(2,"0")}`; };

    const remoteEntries = Object.entries(remoteStreams);
    const totalTiles = 1 + remoteEntries.length;
    const gridCols = totalTiles <= 1 ? "grid-cols-1" : totalTiles <= 2 ? "grid-cols-2" : totalTiles <= 4 ? "grid-cols-2" : "grid-cols-3";

    return (
        <div className="h-screen flex flex-col bg-gray-950">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-3 bg-gray-900/80 backdrop-blur-xl border-b border-white/5">
                <div className="flex items-center gap-4">
                    <button onClick={handleLeave} className="text-gray-400 hover:text-white transition-colors"><ArrowLeft size={20} /></button>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center"><Video size={16} className="text-blue-400" /></div>
                        <div>
                            <h2 className="text-sm font-semibold text-white">{currentRoom?.title || "Video Meeting"}</h2>
                            <button onClick={copyCode} className="flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-blue-400 transition-colors">
                                <Hash size={10} /><span className="font-mono">{currentRoom?.roomCode}</span>
                                {codeCopied ? <Check size={10} className="text-green-400" /> : <Copy size={10} />}
                            </button>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="font-mono tabular-nums">{fmt(meetingDuration)}</span>
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-green-500 rounded-full" />{participants.length} connected</span>
                </div>
            </div>

            {/* Main */}
            <div className="flex-1 flex overflow-hidden">
                <div className="flex-1 p-4 overflow-y-auto">
                    <div className={`grid ${gridCols} gap-3 h-full auto-rows-fr`}>
                        {/* Local tile */}
                        <VideoTile stream={localStream} user={user} isMuted={isMuted} isCameraOff={isCameraOff} isHandRaised={isHandRaised} isScreenSharing={isScreenSharing} isSpeaking={activeSpeaker === "local"} isLocal audioLevel={isMuted ? 0 : audioLevel} />
                        {/* Remote tiles */}
                        {remoteEntries.map(([pid, data]) => (
                            <VideoTile key={pid} stream={data.stream} user={{ fullName: data.userName, avatar: data.avatar, _id: data.userId }}
                                isSpeaking={activeSpeaker === data.userId}
                                isMuted={participants.find(p => (p.userId?._id || p.userId)?.toString() === data.userId)?.isMuted}
                                isCameraOff={participants.find(p => (p.userId?._id || p.userId)?.toString() === data.userId)?.isCameraOff}
                                isHandRaised={participants.find(p => (p.userId?._id || p.userId)?.toString() === data.userId)?.isHandRaised}
                                isScreenSharing={participants.find(p => (p.userId?._id || p.userId)?.toString() === data.userId)?.isScreenSharing}
                            />
                        ))}
                    </div>
                </div>

                {isChatOpen && <div className="w-80 flex-shrink-0"><ChatPanel socket={socket} roomId={roomId} onClose={toggleChat} /></div>}
                {isParticipantsOpen && <div className="w-72 flex-shrink-0"><ParticipantSidebar onClose={toggleParticipants} /></div>}
            </div>

            <MeetingControls roomType="video" onToggleMic={handleToggleMic} onToggleCamera={handleToggleCamera} onToggleScreenShare={handleToggleScreen} onToggleHandRaise={handleToggleHand} onLeave={handleLeave} onToggleFullscreen={handleFullscreen} isFullscreen={isFullscreen} audioLevel={isMuted ? 0 : audioLevel} />
        </div>
    );
};

export default VideoMeetingRoom;
