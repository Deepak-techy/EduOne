// src/features/collaboration/components/VoiceParticipant.jsx
import { MicOff, Hand } from "lucide-react";

const VoiceParticipant = ({ user, isMuted, isSpeaking, isHandRaised, isLocal = false, audioLevel = 0 }) => {
    const name = user?.fullName || user?.userName || "Unknown";
    const avatar = user?.avatar;

    // Scale ring based on audio level (0-1)
    const ringScale = 1 + audioLevel * 0.3;
    const ringOpacity = Math.min(audioLevel * 2, 1);
    const isActive = audioLevel > 0.05 && !isMuted;

    return (
        <div className="flex flex-col items-center gap-2 p-4 group">
            {/* Avatar with speaking ring */}
            <div className="relative w-24 h-24 flex items-center justify-center">
                {/* Animated audio level rings */}
                {isActive && (
                    <>
                        <div
                            className="absolute inset-0 rounded-full bg-green-400/20 transition-transform duration-75"
                            style={{
                                transform: `scale(${ringScale + 0.15})`,
                                opacity: ringOpacity * 0.3,
                            }}
                        />
                        <div
                            className="absolute inset-0 rounded-full bg-green-400/30 transition-transform duration-75"
                            style={{
                                transform: `scale(${ringScale + 0.05})`,
                                opacity: ringOpacity * 0.5,
                            }}
                        />
                        <div
                            className="absolute inset-0 rounded-full border-2 border-green-400 transition-transform duration-75"
                            style={{
                                transform: `scale(${ringScale})`,
                                opacity: ringOpacity,
                            }}
                        />
                    </>
                )}

                {/* Avatar */}
                <div
                    className={`
                        relative w-20 h-20 rounded-full transition-all duration-200
                        ${isActive
                            ? "ring-[3px] ring-green-400 shadow-lg shadow-green-500/40"
                            : "ring-2 ring-gray-700/50"
                        }
                    `}
                >
                    <div className="w-full h-full rounded-full flex items-center justify-center text-2xl font-bold text-white bg-gradient-to-br from-indigo-500 to-purple-600 overflow-hidden">
                        {avatar ? (
                            <img src={avatar} alt={name} className="w-full h-full object-cover" />
                        ) : (
                            name[0].toUpperCase()
                        )}
                    </div>

                    {/* Muted indicator */}
                    {isMuted && (
                        <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center border-2 border-gray-900 shadow-lg">
                            <MicOff size={14} className="text-white" />
                        </div>
                    )}

                    {/* Hand raised */}
                    {isHandRaised && (
                        <div className="absolute -top-1 -right-1 w-7 h-7 bg-yellow-500 rounded-full flex items-center justify-center border-2 border-gray-900 shadow-lg animate-bounce">
                            <Hand size={14} className="text-white" />
                        </div>
                    )}
                </div>
            </div>

            {/* Audio level bar */}
            {isLocal && (
                <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <div
                        className="h-full rounded-full transition-all duration-75"
                        style={{
                            width: `${Math.min(audioLevel * 100, 100)}%`,
                            backgroundColor: audioLevel > 0.6 ? '#ef4444' : audioLevel > 0.3 ? '#eab308' : '#22c55e',
                        }}
                    />
                </div>
            )}

            {/* Name */}
            <div className="text-center">
                <p className="text-sm font-medium text-white truncate max-w-[100px]">
                    {name}
                    {isLocal && (
                        <span className="text-xs text-gray-400 ml-1">(You)</span>
                    )}
                </p>
            </div>
        </div>
    );
};

export default VoiceParticipant;
