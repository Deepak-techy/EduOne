// src/features/collaboration/components/RemoteAudioPlayer.jsx
import { useEffect, useRef } from "react";

/**
 * Renders a hidden <audio> element for a remote MediaStream.
 * This is the ONLY way remote audio gets played in voice rooms
 * (since voice rooms don't have <video> elements).
 */
const RemoteAudioPlayer = ({ stream, peerId }) => {
    const audioRef = useRef(null);

    useEffect(() => {
        if (audioRef.current && stream) {
            audioRef.current.srcObject = stream;
            // Attempt autoplay — some browsers need this
            audioRef.current.play().catch((err) => {
                console.warn("Audio autoplay blocked for peer:", peerId, err.message);
            });
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.srcObject = null;
            }
        };
    }, [stream, peerId]);

    return <audio ref={audioRef} autoPlay playsInline />;
};

export default RemoteAudioPlayer;
