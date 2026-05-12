// src/features/collaboration/components/VideoTile.jsx
import { useEffect, useRef } from "react";
import { MicOff, VideoOff, Hand, Monitor } from "lucide-react";

const VideoTile = ({
    stream,
    user,
    isMuted = false,
    isCameraOff = false,
    isHandRaised = false,
    isScreenSharing = false,
    isSpeaking = false,
    isLocal = false,
    isActive = false,
    audioLevel = 0,
}) => {
    const videoRef = useRef(null);
    const audioRef = useRef(null);
    const name = user?.fullName || user?.userName || "Unknown";
    const avatar = user?.avatar;

    const isVoiceActive = audioLevel > 0.05 && !isMuted;

    // Attach stream to video element
    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    // Attach stream to hidden audio element (for remote peers when camera is off)
    useEffect(() => {
        if (audioRef.current && stream) {
            audioRef.current.srcObject = stream;
        }
    }, [stream]);

    return (
        <div
            className={`
                relative rounded-2xl overflow-hidden bg-gray-800 aspect-video
                transition-all duration-200
                ${isActive || isVoiceActive
                    ? "ring-2 ring-green-400 shadow-lg shadow-green-500/20"
                    : "ring-1 ring-white/5"
                }
            `}
        >
            {/*
              Hidden <audio> element for remote streams.
              This ensures audio ALWAYS plays regardless of camera on/off state.
              Without this, turning camera off also kills audio playback.
            */}
            {stream && !isLocal && (
                <audio ref={audioRef} autoPlay playsInline />
            )}

            {/* Visible video element — only shown when camera is on */}
            {stream && !isCameraOff ? (
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted={isLocal}
                    className="w-full h-full object-cover"
                />
            ) : (
                /* Camera off — show avatar */
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-white bg-gradient-to-br from-indigo-500 to-purple-600 overflow-hidden">
                        {avatar ? (
                            <img src={avatar} alt={name} className="w-full h-full object-cover" />
                        ) : (
                            name[0].toUpperCase()
                        )}
                    </div>
                </div>
            )}

            {/* Screen sharing indicator */}
            {isScreenSharing && (
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 bg-blue-500/80 rounded-lg text-xs text-white font-medium backdrop-blur-sm">
                    <Monitor size={12} />
                    Sharing Screen
                </div>
            )}

            {/* Hand raised overlay */}
            {isHandRaised && (
                <div className="absolute top-3 right-3 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                    <Hand size={16} className="text-white" />
                </div>
            )}

            {/* Audio level bar (local user) */}
            {isLocal && (
                <div className="absolute top-3 left-3 flex items-end gap-[2px] h-4">
                    {[0.1, 0.2, 0.35, 0.5, 0.7].map((threshold, i) => (
                        <div
                            key={i}
                            className="w-[3px] rounded-full transition-all duration-75"
                            style={{
                                height: `${6 + i * 3}px`,
                                backgroundColor: !isMuted && audioLevel > threshold
                                    ? '#22c55e'
                                    : 'rgba(255,255,255,0.2)',
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Bottom overlay — name and status */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white truncate max-w-[150px]">
                            {name}
                            {isLocal && (
                                <span className="text-xs text-gray-300 ml-1">(You)</span>
                            )}
                        </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                        {isMuted && (
                            <div className="w-6 h-6 bg-red-500/80 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <MicOff size={12} className="text-white" />
                            </div>
                        )}
                        {isCameraOff && (
                            <div className="w-6 h-6 bg-gray-600/80 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <VideoOff size={12} className="text-white" />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Speaking indicator border */}
            {isVoiceActive && (
                <div className="absolute inset-0 rounded-2xl ring-2 ring-green-400 pointer-events-none" />
            )}
        </div>
    );
};

export default VideoTile;
