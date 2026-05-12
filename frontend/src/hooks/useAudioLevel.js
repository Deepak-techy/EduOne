// src/hooks/useAudioLevel.js
import { useState, useEffect, useRef } from "react";

/**
 * Returns a 0–1 audio level value for a given MediaStream.
 * Updates ~30fps for smooth animations.
 */
const useAudioLevel = (stream) => {
    const [audioLevel, setAudioLevel] = useState(0);
    const animFrameRef = useRef(null);
    const analyserRef = useRef(null);
    const contextRef = useRef(null);

    useEffect(() => {
        if (!stream) {
            setAudioLevel(0);
            return;
        }

        const audioTracks = stream.getAudioTracks();
        if (!audioTracks.length) {
            setAudioLevel(0);
            return;
        }

        try {
            const audioContext = new AudioContext();
            const source = audioContext.createMediaStreamSource(stream);
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            analyser.smoothingTimeConstant = 0.5;
            source.connect(analyser);

            contextRef.current = audioContext;
            analyserRef.current = analyser;

            const dataArray = new Uint8Array(analyser.frequencyBinCount);

            const tick = () => {
                analyser.getByteFrequencyData(dataArray);
                // Use RMS for smoother level
                let sum = 0;
                for (let i = 0; i < dataArray.length; i++) {
                    sum += dataArray[i] * dataArray[i];
                }
                const rms = Math.sqrt(sum / dataArray.length);
                // Normalize to 0–1 (max byte value is 255)
                const level = Math.min(rms / 128, 1);
                setAudioLevel(level);

                animFrameRef.current = requestAnimationFrame(tick);
            };

            tick();
        } catch (err) {
            console.error("useAudioLevel error:", err);
        }

        return () => {
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
            if (contextRef.current && contextRef.current.state !== "closed") {
                contextRef.current.close().catch(() => {});
            }
        };
    }, [stream]);

    return audioLevel;
};

export default useAudioLevel;
