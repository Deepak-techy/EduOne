// src/store/useRoom.js
import { create } from "zustand";

const useRoom = create((set, get) => ({
    // ─── Room State ───
    currentRoom: null,
    participants: [],
    chatMessages: [],
    connectionStatus: "disconnected", // disconnected | connecting | connected | error

    // ─── Local Media State ───
    isMuted: false,
    isCameraOff: true,
    isScreenSharing: false,
    isHandRaised: false,

    // ─── Remote Streams ───
    remoteStreams: {}, // { peerId: { stream, userId, userName, avatar } }

    // ─── UI State ───
    isChatOpen: false,
    isParticipantsOpen: false,
    activeSpeaker: null,
    typingUsers: [],

    // ─── Actions ───
    setRoom: (room) =>
        set({
            currentRoom: room,
            participants: room?.participants || [],
        }),

    clearRoom: () =>
        set({
            currentRoom: null,
            participants: [],
            chatMessages: [],
            connectionStatus: "disconnected",
            isMuted: false,
            isCameraOff: true,
            isScreenSharing: false,
            isHandRaised: false,
            remoteStreams: {},
            isChatOpen: false,
            isParticipantsOpen: false,
            activeSpeaker: null,
            typingUsers: [],
        }),

    setConnectionStatus: (status) =>
        set({ connectionStatus: status }),

    setParticipants: (participants) =>
        set({ participants }),

    updateParticipant: (userId, updates) =>
        set((state) => ({
            participants: state.participants.map((p) => {
                const pId = p.userId?._id || p.userId;
                return pId?.toString() === userId
                    ? { ...p, ...updates }
                    : p;
            }),
        })),

    addParticipant: (participant) =>
        set((state) => {
            const exists = state.participants.some((p) => {
                const pId = p.userId?._id || p.userId;
                const newId = participant.userId?._id || participant.userId;
                return pId?.toString() === newId?.toString();
            });
            if (exists) return state;
            return { participants: [...state.participants, participant] };
        }),

    removeParticipant: (userId) =>
        set((state) => ({
            participants: state.participants.filter((p) => {
                const pId = p.userId?._id || p.userId;
                return pId?.toString() !== userId;
            }),
        })),

    // ─── Media Controls ───
    toggleMute: () =>
        set((state) => ({ isMuted: !state.isMuted })),

    toggleCamera: () =>
        set((state) => ({ isCameraOff: !state.isCameraOff })),

    toggleScreenShare: () =>
        set((state) => ({ isScreenSharing: !state.isScreenSharing })),

    toggleHandRaise: () =>
        set((state) => ({ isHandRaised: !state.isHandRaised })),

    setMuted: (val) => set({ isMuted: val }),
    setCameraOff: (val) => set({ isCameraOff: val }),
    setScreenSharing: (val) => set({ isScreenSharing: val }),
    setHandRaised: (val) => set({ isHandRaised: val }),

    // ─── Remote Streams ───
    addRemoteStream: (peerId, streamData) =>
        set((state) => ({
            remoteStreams: { ...state.remoteStreams, [peerId]: streamData },
        })),

    removeRemoteStream: (peerId) =>
        set((state) => {
            const updated = { ...state.remoteStreams };
            delete updated[peerId];
            return { remoteStreams: updated };
        }),

    clearRemoteStreams: () =>
        set({ remoteStreams: {} }),

    // ─── Chat ───
    addChatMessage: (message) =>
        set((state) => ({
            chatMessages: [...state.chatMessages, message],
        })),

    setChatMessages: (messages) =>
        set({ chatMessages: messages }),

    toggleChat: () =>
        set((state) => ({ isChatOpen: !state.isChatOpen })),

    toggleParticipants: () =>
        set((state) => ({ isParticipantsOpen: !state.isParticipantsOpen })),

    // ─── Speaking ───
    setActiveSpeaker: (userId) =>
        set({ activeSpeaker: userId }),

    // ─── Typing ───
    addTypingUser: (user) =>
        set((state) => {
            if (state.typingUsers.some((u) => u.userId === user.userId)) return state;
            return { typingUsers: [...state.typingUsers, user] };
        }),

    removeTypingUser: (userId) =>
        set((state) => ({
            typingUsers: state.typingUsers.filter((u) => u.userId !== userId),
        })),
}));

export default useRoom;
