// src/features/collaboration/components/MeetingControls.jsx
import {
    Mic, MicOff, Video, VideoOff, Monitor, MonitorOff,
    Hand, MessageSquare, Users, PhoneOff, Maximize,
    Minimize, Settings
} from "lucide-react";
import useRoom from "../../../store/useRoom";

const ControlButton = ({ onClick, active, danger, children, label, disabled }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        title={label}
        className={`
            relative group flex items-center justify-center
            w-12 h-12 rounded-full transition-all duration-200
            ${danger
                ? "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30"
                : active
                    ? "bg-white/20 dark:bg-white/10 text-white hover:bg-white/30 dark:hover:bg-white/20"
                    : "bg-gray-700/80 text-gray-300 hover:bg-gray-600 hover:text-white"
            }
            ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            backdrop-blur-sm
        `}
    >
        {children}
        <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            {label}
        </span>
    </button>
);

const MeetingControls = ({
    roomType = "video",
    onToggleMic,
    onToggleCamera,
    onToggleScreenShare,
    onToggleHandRaise,
    onLeave,
    onToggleFullscreen,
    isFullscreen = false,
    audioLevel = 0,
}) => {
    const {
        isMuted, isCameraOff, isScreenSharing, isHandRaised,
        isChatOpen, isParticipantsOpen,
        toggleChat, toggleParticipants,
    } = useRoom();

    const micActive = !isMuted && audioLevel > 0.05;

    return (
        <div className="flex items-center justify-center gap-3 py-4 px-6 bg-gray-900/95 dark:bg-gray-950/95 backdrop-blur-xl border-t border-white/5">
            {/* Left section — info */}
            <div className="flex-1 hidden sm:block" />

            {/* Center section — main controls */}
            <div className="flex items-center gap-2.5">
                {/* Mic with audio level indicator */}
                <div className="relative">
                    {micActive && (
                        <div
                            className="absolute inset-0 rounded-full border-2 border-green-400 transition-transform duration-75"
                            style={{
                                transform: `scale(${1 + audioLevel * 0.4})`,
                                opacity: Math.min(audioLevel * 2, 1),
                            }}
                        />
                    )}
                    <ControlButton
                        onClick={onToggleMic}
                        active={!isMuted}
                        label={isMuted ? "Unmute" : "Mute"}
                    >
                        {isMuted ? <MicOff size={20} /> : <Mic size={20} className={micActive ? "text-green-400" : ""} />}
                    </ControlButton>
                </div>

                {/* Camera (video rooms only) */}
                {roomType === "video" && (
                    <ControlButton
                        onClick={onToggleCamera}
                        active={!isCameraOff}
                        label={isCameraOff ? "Turn on camera" : "Turn off camera"}
                    >
                        {isCameraOff ? <VideoOff size={20} /> : <Video size={20} />}
                    </ControlButton>
                )}

                {/* Screen Share */}
                <ControlButton
                    onClick={onToggleScreenShare}
                    active={isScreenSharing}
                    label={isScreenSharing ? "Stop sharing" : "Share screen"}
                >
                    {isScreenSharing ? <MonitorOff size={20} /> : <Monitor size={20} />}
                </ControlButton>

                {/* Raise Hand */}
                <ControlButton
                    onClick={onToggleHandRaise}
                    active={isHandRaised}
                    label={isHandRaised ? "Lower hand" : "Raise hand"}
                >
                    <Hand size={20} className={isHandRaised ? "text-yellow-400" : ""} />
                </ControlButton>

                {/* Leave */}
                <ControlButton
                    onClick={onLeave}
                    danger
                    label="Leave room"
                >
                    <PhoneOff size={20} />
                </ControlButton>
            </div>

            {/* Right section — panels */}
            <div className="flex-1 flex items-center justify-end gap-2">
                <ControlButton
                    onClick={toggleChat}
                    active={isChatOpen}
                    label="Chat"
                >
                    <MessageSquare size={18} />
                </ControlButton>

                <ControlButton
                    onClick={toggleParticipants}
                    active={isParticipantsOpen}
                    label="Participants"
                >
                    <Users size={18} />
                </ControlButton>

                <ControlButton
                    onClick={onToggleFullscreen}
                    label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                >
                    {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
                </ControlButton>
            </div>
        </div>
    );
};

export default MeetingControls;
