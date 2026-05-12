// src/features/collaboration/components/ParticipantSidebar.jsx
import { X, Mic, MicOff, Video, VideoOff, Hand, Crown, Shield } from "lucide-react";
import useRoom from "../../../store/useRoom";

const ParticipantSidebar = ({ onClose }) => {
    const { participants } = useRoom();

    const hosts = participants.filter((p) => p.role === "host");
    const moderators = participants.filter((p) => p.role === "moderator");
    const members = participants.filter((p) => p.role === "participant");

    const ParticipantItem = ({ participant }) => {
        const user = participant.userId || {};
        const name = user.fullName || user.userName || "Unknown";
        const avatar = user.avatar;

        return (
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors group">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white bg-gradient-to-br from-blue-500 to-purple-600">
                        {avatar ? (
                            <img src={avatar} alt="" className="w-full h-full rounded-full object-cover" />
                        ) : (
                            name[0].toUpperCase()
                        )}
                    </div>
                    {/* Online dot */}
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900" />
                </div>

                {/* Name & role badge */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                        <span className="text-sm text-white font-medium truncate">{name}</span>
                        {participant.role === "host" && (
                            <Crown size={12} className="text-yellow-400 flex-shrink-0" />
                        )}
                        {participant.role === "moderator" && (
                            <Shield size={12} className="text-blue-400 flex-shrink-0" />
                        )}
                    </div>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                        {user.role || "User"}
                    </span>
                </div>

                {/* Status icons */}
                <div className="flex items-center gap-1.5">
                    {participant.isHandRaised && (
                        <Hand size={14} className="text-yellow-400" />
                    )}
                    {participant.isMuted ? (
                        <MicOff size={14} className="text-red-400" />
                    ) : (
                        <Mic size={14} className="text-gray-500" />
                    )}
                    {participant.isCameraOff ? (
                        <VideoOff size={14} className="text-gray-600" />
                    ) : (
                        <Video size={14} className="text-gray-500" />
                    )}
                </div>
            </div>
        );
    };

    const Section = ({ title, icon, items }) => {
        if (items.length === 0) return null;
        return (
            <div className="mb-4">
                <div className="flex items-center gap-2 px-3 mb-1">
                    {icon}
                    <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
                        {title} — {items.length}
                    </span>
                </div>
                {items.map((p, i) => (
                    <ParticipantItem key={p.userId?._id || i} participant={p} />
                ))}
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full bg-gray-900/95 dark:bg-gray-950/95 backdrop-blur-xl border-l border-white/5">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                <h3 className="text-sm font-semibold text-white">
                    Participants ({participants.length})
                </h3>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                >
                    <X size={18} />
                </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto py-3 scrollbar-thin scrollbar-thumb-gray-700">
                <Section title="Host" icon={<Crown size={12} className="text-yellow-400" />} items={hosts} />
                <Section title="Moderators" icon={<Shield size={12} className="text-blue-400" />} items={moderators} />
                <Section title="Participants" icon={null} items={members} />
            </div>
        </div>
    );
};

export default ParticipantSidebar;
