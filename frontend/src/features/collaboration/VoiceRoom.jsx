// src/features/collaboration/VoiceRoom.jsx
import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Mic, MicOff, Hash, ArrowLeft } from "lucide-react";
import { roomService } from "../../services/roomService";
import useRoom from "../../store/useRoom";
import useSocket from "../../hooks/useSocket";
import useWebRTC from "../../hooks/useWebRTC";
import useAudioLevel from "../../hooks/useAudioLevel";
import { useAuth } from "../../contexts/AuthContext";
import VoiceParticipant from "./components/VoiceParticipant";
import MeetingControls from "./components/MeetingControls";
import ChatPanel from "./components/ChatPanel";
import ParticipantSidebar from "./components/ParticipantSidebar";
import RemoteAudioPlayer from "./components/RemoteAudioPlayer";
import { toast } from "react-toastify";

const VoiceRoom = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { socket, emit, connected } = useSocket();
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [meetingDuration, setMeetingDuration] = useState(0);

    const {
        currentRoom, participants, remoteStreams, isMuted, isHandRaised,
        activeSpeaker, isChatOpen, isParticipantsOpen,
        setRoom, clearRoom, setConnectionStatus,
        updateParticipant, addParticipant, removeParticipant,
        toggleMute, toggleHandRaise, toggleChat, toggleParticipants,
        setChatMessages,
    } = useRoom();

    const {
        localStream,
        getLocalStream, initPeer,
        toggleMic, startVAD,
    } = useWebRTC(socket, roomId, "voice");

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

                // Get mic FIRST so WebRTC has tracks to add
                const stream = await getLocalStream();
                if (stale) return;
                if (!stream) { toast.error("Could not access microphone"); return; }

                await initPeer();
                if (stale) return;

                // Small delay to ensure WebRTC socket listeners are registered
                await new Promise(r => setTimeout(r, 200));
                if (stale) return;

                // NOW emit room:join — WebRTC listeners are ready on all tabs
                emit("room:join", { roomId, peerId: "native-webrtc" });
                startVAD(stream);
                hasJoinedRef.current = true;
                setConnectionStatus("connected");
                console.log("[VoiceRoom] Joined room:", roomId);
            } catch (err) {
                if (stale) return;
                console.error("Failed to init voice room:", err);
                toast.error("Failed to connect to voice room");
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

    // Socket listeners for room-level events
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

    const handleToggleMute = useCallback(() => { toggleMic(); toggleMute(); emit("room:participant-update", { roomId, isMuted: !isMuted }); }, [isMuted, roomId]); // eslint-disable-line
    const handleToggleHand = useCallback(() => { toggleHandRaise(); emit("room:participant-update", { roomId, isHandRaised: !isHandRaised }); }, [isHandRaised, roomId]); // eslint-disable-line
    const handleLeave = useCallback(async () => { emit("room:leave", { roomId }); try { await roomService.leaveRoom(roomId); } catch(_){} clearRoom(); navigate("/community/feed"); }, [roomId]); // eslint-disable-line
    const handleFullscreen = useCallback(() => {
        if (!document.fullscreenElement) { document.documentElement.requestFullscreen(); setIsFullscreen(true); }
        else { document.exitFullscreen(); setIsFullscreen(false); }
    }, []);

    const fmt = (s) => { const h=Math.floor(s/3600),m=Math.floor((s%3600)/60),sec=s%60; return h>0?`${h}:${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`:`${m}:${String(sec).padStart(2,"0")}`; };

    return (
        <div className="h-screen flex flex-col bg-gray-950">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-3 bg-gray-900/80 backdrop-blur-xl border-b border-white/5">
                <div className="flex items-center gap-4">
                    <button onClick={handleLeave} className="text-gray-400 hover:text-white transition-colors"><ArrowLeft size={20} /></button>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center"><Mic size={16} className="text-purple-400" /></div>
                        <div>
                            <h2 className="text-sm font-semibold text-white">{currentRoom?.title || "Voice Channel"}</h2>
                            <div className="flex items-center gap-2 text-[11px] text-gray-400"><Hash size={10} /><span className="font-mono">{currentRoom?.roomCode}</span></div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                    {/* Live mic level indicator in header */}
                    <div className="flex items-center gap-2">
                        {isMuted ? (
                            <MicOff size={14} className="text-red-400" />
                        ) : (
                            <Mic size={14} className={audioLevel > 0.05 ? "text-green-400" : "text-gray-500"} />
                        )}
                        <div className="flex items-end gap-[2px] h-4">
                            {[0.1, 0.2, 0.35, 0.5, 0.7].map((threshold, i) => (
                                <div
                                    key={i}
                                    className="w-[3px] rounded-full transition-all duration-75"
                                    style={{
                                        height: `${6 + i * 3}px`,
                                        backgroundColor: !isMuted && audioLevel > threshold
                                            ? audioLevel > 0.6 ? '#ef4444' : '#22c55e'
                                            : '#374151',
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                    <span className="font-mono tabular-nums">{fmt(meetingDuration)}</span>
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-green-500 rounded-full" />{participants.length} connected</span>
                </div>
            </div>

            {/* Remote Audio Playback — hidden <audio> elements for each remote stream */}
            {Object.entries(remoteStreams).map(([pid, data]) => (
                <RemoteAudioPlayer key={pid} stream={data.stream} peerId={pid} />
            ))}

            {/* Main */}
            <div className="flex-1 flex overflow-hidden">
                <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
                    <div className="flex flex-wrap items-center justify-center gap-6 max-w-4xl">
                        <VoiceParticipant
                            user={user}
                            isMuted={isMuted}
                            isSpeaking={activeSpeaker === "local"}
                            isHandRaised={isHandRaised}
                            isLocal
                            audioLevel={isMuted ? 0 : audioLevel}
                        />
                        {participants.filter(p => { const pId = p.userId?._id || p.userId; return pId?.toString() !== user?._id?.toString(); }).map((p, i) => (
                            <VoiceParticipant key={p.userId?._id || i} user={p.userId} isMuted={p.isMuted} isSpeaking={activeSpeaker === (p.userId?._id || p.userId)?.toString()} isHandRaised={p.isHandRaised} />
                        ))}
                    </div>
                </div>
                {isChatOpen && <div className="w-80 flex-shrink-0"><ChatPanel socket={socket} roomId={roomId} onClose={toggleChat} /></div>}
                {isParticipantsOpen && <div className="w-72 flex-shrink-0"><ParticipantSidebar onClose={toggleParticipants} /></div>}
            </div>

            <MeetingControls roomType="voice" onToggleMic={handleToggleMute} onToggleHandRaise={handleToggleHand} onLeave={handleLeave} onToggleFullscreen={handleFullscreen} isFullscreen={isFullscreen} audioLevel={isMuted ? 0 : audioLevel} />
        </div>
    );
};

export default VoiceRoom;
