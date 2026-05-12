// src/hooks/useWebRTC.js
import { useEffect, useRef, useCallback, useState } from "react";
import useRoom from "../store/useRoom";

const ICE_SERVERS = [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
];

/**
 * Custom hook: native RTCPeerConnection + Socket.IO signaling.
 * All handler references use refs to avoid effect re-registration.
 */
const useWebRTC = (socket, roomId, roomType = "voice") => {
    const peersRef = useRef({});
    const localStreamRef = useRef(null);
    const [localStream, setLocalStream] = useState(null);
    const socketRef = useRef(socket);
    const roomIdRef = useRef(roomId);
    const roomTypeRef = useRef(roomType);

    const {
        addRemoteStream,
        removeRemoteStream,
        clearRemoteStreams,
        setActiveSpeaker,
    } = useRoom();

    // Keep refs in sync
    useEffect(() => { socketRef.current = socket; }, [socket]);
    useEffect(() => { roomIdRef.current = roomId; }, [roomId]);
    useEffect(() => { roomTypeRef.current = roomType; }, [roomType]);

    // ── Get Local Media Stream ──
    const getLocalStream = useCallback(async () => {
        try {
            const constraints = {
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                },
                video: roomType === "video" ? {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    frameRate: { ideal: 24 },
                } : false,
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            localStreamRef.current = stream;
            setLocalStream(stream);
            console.log("[WebRTC] Got local stream:", stream.getTracks().map(t => `${t.kind}:${t.enabled}:${t.readyState}`).join(", "));
            return stream;
        } catch (err) {
            console.error("[WebRTC] Failed to get local media:", err);
            if (roomType === "video") {
                try {
                    const audioOnly = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
                    localStreamRef.current = audioOnly;
                    setLocalStream(audioOnly);
                    return audioOnly;
                } catch (e) {
                    console.error("[WebRTC] Failed to get audio:", e);
                }
            }
            return null;
        }
    }, [roomType]);

    // ── Create RTCPeerConnection for a remote peer ──
    const createPC = useCallback((remoteSocketId, remoteUserId, remoteUserName, remoteAvatar) => {
        if (peersRef.current[remoteSocketId]?.pc) {
            return peersRef.current[remoteSocketId].pc;
        }

        console.log("[WebRTC] Creating PC for:", remoteUserName, "sid:", remoteSocketId);
        const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });

        // Add ALL local tracks
        const stream = localStreamRef.current;
        if (stream) {
            stream.getTracks().forEach((track) => {
                console.log("[WebRTC] Adding local track:", track.kind, track.enabled, track.readyState);
                pc.addTrack(track, stream);
            });
        } else {
            console.warn("[WebRTC] No local stream when creating PC for:", remoteUserName);
        }

        // Handle incoming remote tracks
        pc.ontrack = (event) => {
            console.log("[WebRTC] ontrack fired from:", remoteUserName, "streams:", event.streams.length);
            const [remoteStream] = event.streams;
            if (remoteStream) {
                console.log("[WebRTC] Remote tracks:", remoteStream.getTracks().map(t => `${t.kind}:${t.enabled}:${t.readyState}`).join(", "));
                addRemoteStream(remoteSocketId, {
                    stream: remoteStream,
                    userId: remoteUserId,
                    userName: remoteUserName,
                    avatar: remoteAvatar,
                });
            }
        };

        // ICE candidates
        pc.onicecandidate = (event) => {
            if (event.candidate && socketRef.current) {
                socketRef.current.emit("webrtc:ice-candidate", {
                    roomId: roomIdRef.current,
                    targetSocketId: remoteSocketId,
                    candidate: event.candidate,
                });
            }
        };

        pc.oniceconnectionstatechange = () => {
            console.log(`[WebRTC] ICE state [${remoteUserName}]:`, pc.iceConnectionState);
            if (pc.iceConnectionState === "failed") {
                console.warn("[WebRTC] ICE failed, restarting...");
                pc.restartIce();
            }
        };

        pc.onconnectionstatechange = () => {
            console.log(`[WebRTC] Connection state [${remoteUserName}]:`, pc.connectionState);
        };

        peersRef.current[remoteSocketId] = {
            pc,
            userId: remoteUserId,
            userName: remoteUserName,
            avatar: remoteAvatar,
        };

        return pc;
    }, [addRemoteStream]);

    // ── Toggle Mic ──
    const toggleMic = useCallback(() => {
        const stream = localStreamRef.current;
        if (!stream) return;
        stream.getAudioTracks().forEach((track) => {
            track.enabled = !track.enabled;
            console.log("[WebRTC] Mic toggled:", track.enabled);
        });
    }, []);

    // ── Toggle Camera ──
    const toggleCam = useCallback(() => {
        const stream = localStreamRef.current;
        if (!stream) return;
        stream.getVideoTracks().forEach((track) => {
            track.enabled = !track.enabled;
        });
    }, []);

    // ── Screen Share ──
    const startScreenShare = useCallback(async () => {
        try {
            const screenStream = await navigator.mediaDevices.getDisplayMedia({
                video: { cursor: "always" },
                audio: false,
            });
            const screenTrack = screenStream.getVideoTracks()[0];
            Object.values(peersRef.current).forEach(({ pc }) => {
                const sender = pc?.getSenders()?.find((s) => s.track?.kind === "video");
                if (sender) sender.replaceTrack(screenTrack);
            });
            screenTrack.onended = () => stopScreenShare();
            return screenStream;
        } catch (err) {
            console.error("[WebRTC] Screen share error:", err);
            return null;
        }
    }, []);

    const stopScreenShare = useCallback(() => {
        const stream = localStreamRef.current;
        if (!stream) return;
        const videoTrack = stream.getVideoTracks()[0];
        if (videoTrack) {
            Object.values(peersRef.current).forEach(({ pc }) => {
                const sender = pc?.getSenders()?.find((s) => s.track?.kind === "video");
                if (sender) sender.replaceTrack(videoTrack);
            });
        }
    }, []);

    // ── Voice Activity Detection ──
    const startVAD = useCallback((stream) => {
        try {
            const audioContext = new AudioContext();
            const source = audioContext.createMediaStreamSource(stream);
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 512;
            analyser.smoothingTimeConstant = 0.4;
            source.connect(analyser);

            const dataArray = new Uint8Array(analyser.frequencyBinCount);
            let wasSpeaking = false;

            const checkVoice = () => {
                if (!localStreamRef.current) return;
                analyser.getByteFrequencyData(dataArray);
                const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
                const isSpeaking = average > 15;

                if (isSpeaking !== wasSpeaking) {
                    wasSpeaking = isSpeaking;
                    setActiveSpeaker(isSpeaking ? "local" : null);
                    socketRef.current?.emit("room:speaking", { roomId: roomIdRef.current, isSpeaking });
                }
                requestAnimationFrame(checkVoice);
            };
            checkVoice();

            return () => audioContext.close();
        } catch (err) {
            console.error("[WebRTC] VAD error:", err);
        }
    }, [setActiveSpeaker]);

    // ── Socket Event Listeners (registered ONCE, use refs for latest state) ──
    useEffect(() => {
        if (!socket || !roomId) return;

        console.log("[WebRTC] Registering socket listeners for room:", roomId);

        const onPeerJoined = async (data) => {
            console.log("[WebRTC] Peer joined event:", data.userName, "socketId:", data.socketId);

            if (!localStreamRef.current) {
                console.warn("[WebRTC] Local stream not ready, waiting...");
                // Wait up to 3 seconds for local stream
                for (let i = 0; i < 30; i++) {
                    await new Promise(r => setTimeout(r, 100));
                    if (localStreamRef.current) break;
                }
                if (!localStreamRef.current) {
                    console.error("[WebRTC] Local stream still not ready, cannot call peer");
                    return;
                }
            }

            // Create PC and send offer
            const pc = createPC(data.socketId, data.userId, data.userName, data.avatar);
            try {
                const offer = await pc.createOffer({
                    offerToReceiveAudio: true,
                    offerToReceiveVideo: roomTypeRef.current === "video",
                });
                await pc.setLocalDescription(offer);
                socketRef.current?.emit("webrtc:offer", {
                    roomId: roomIdRef.current,
                    targetSocketId: data.socketId,
                    offer: pc.localDescription,
                });
                console.log("[WebRTC] Sent offer to:", data.userName);
            } catch (err) {
                console.error("[WebRTC] Failed to create offer:", err);
            }
        };

        const onPeerLeft = (data) => {
            console.log("[WebRTC] Peer left:", data.userName);
            Object.entries(peersRef.current).forEach(([sid, peer]) => {
                if (peer.userId === data.userId) {
                    peer.pc?.close();
                    delete peersRef.current[sid];
                    removeRemoteStream(sid);
                }
            });
        };

        const onOffer = async ({ offer, from, userId, userName }) => {
            console.log("[WebRTC] Received offer from:", userName, "socketId:", from);

            if (!localStreamRef.current) {
                console.warn("[WebRTC] Local stream not ready for answering, waiting...");
                for (let i = 0; i < 30; i++) {
                    await new Promise(r => setTimeout(r, 100));
                    if (localStreamRef.current) break;
                }
            }

            const pc = createPC(from, userId, userName, null);
            try {
                await pc.setRemoteDescription(new RTCSessionDescription(offer));
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                socketRef.current?.emit("webrtc:answer", {
                    roomId: roomIdRef.current,
                    targetSocketId: from,
                    answer: pc.localDescription,
                });
                console.log("[WebRTC] Sent answer to:", userName);
            } catch (err) {
                console.error("[WebRTC] Failed to handle offer:", err);
            }
        };

        const onAnswer = async ({ answer, from }) => {
            const peer = peersRef.current[from];
            if (!peer?.pc) {
                console.warn("[WebRTC] No PC for answer from:", from);
                return;
            }
            try {
                await peer.pc.setRemoteDescription(new RTCSessionDescription(answer));
                console.log("[WebRTC] Set answer from:", peer.userName);
            } catch (err) {
                console.error("[WebRTC] Failed to set answer:", err);
            }
        };

        const onIceCandidate = async ({ candidate, from }) => {
            const peer = peersRef.current[from];
            if (!peer?.pc) return;
            try {
                await peer.pc.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (err) {
                console.error("[WebRTC] Failed to add ICE candidate:", err);
            }
        };

        const onSpeaking = (data) => {
            setActiveSpeaker(data.isSpeaking ? data.userId : null);
        };

        socket.on("webrtc:peer-joined", onPeerJoined);
        socket.on("webrtc:peer-left", onPeerLeft);
        socket.on("webrtc:offer", onOffer);
        socket.on("webrtc:answer", onAnswer);
        socket.on("webrtc:ice-candidate", onIceCandidate);
        socket.on("room:speaking", onSpeaking);

        return () => {
            socket.off("webrtc:peer-joined", onPeerJoined);
            socket.off("webrtc:peer-left", onPeerLeft);
            socket.off("webrtc:offer", onOffer);
            socket.off("webrtc:answer", onAnswer);
            socket.off("webrtc:ice-candidate", onIceCandidate);
            socket.off("room:speaking", onSpeaking);
        };
    }, [socket, roomId]); // eslint-disable-line -- intentionally minimal deps, handlers use refs

    // ── Cleanup on unmount ──
    useEffect(() => {
        return () => {
            localStreamRef.current?.getTracks().forEach((track) => track.stop());
            localStreamRef.current = null;
            setLocalStream(null);

            Object.values(peersRef.current).forEach(({ pc }) => {
                try { pc?.close(); } catch (_) {}
            });
            peersRef.current = {};

            clearRemoteStreams();
        };
    }, [clearRemoteStreams]);

    // Dummy initPeer for backward compat
    const initPeer = useCallback(async () => "native-webrtc", []);

    return {
        localStream,
        peerId: "native-webrtc",
        peerRef: { current: null },
        getLocalStream,
        initPeer,
        callPeer: () => {},
        toggleMic,
        toggleCam,
        startScreenShare,
        stopScreenShare,
        startVAD,
    };
};

export default useWebRTC;
