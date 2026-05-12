// src/features/collaboration/components/LiveRoomIndicator.jsx
import { Mic, Video, Users } from "lucide-react";

const LiveRoomIndicator = ({ type = "voice", participantCount = 0, isActive = true }) => {
    if (!isActive) return null;

    return (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-500/10 dark:bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/20 dark:border-green-500/30 animate-pulse">
            <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            {type === "voice" ? <Mic size={12} /> : <Video size={12} />}
            <span>LIVE</span>
            {participantCount > 0 && (
                <span className="flex items-center gap-0.5 ml-0.5">
                    <Users size={11} />
                    {participantCount}
                </span>
            )}
        </div>
    );
};

export default LiveRoomIndicator;
