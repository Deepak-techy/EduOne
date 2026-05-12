// src/features/collaboration/components/ChatPanel.jsx
import { useState, useEffect, useRef } from "react";
import { X, Send } from "lucide-react";
import useRoom from "../../../store/useRoom";

const ChatPanel = ({ socket, roomId, onClose }) => {
    const [message, setMessage] = useState("");
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const { chatMessages, addChatMessage, typingUsers, addTypingUser, removeTypingUser } = useRoom();
    const typingTimeoutRef = useRef(null);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages]);

    // Listen for chat messages & typing
    useEffect(() => {
        if (!socket) return;

        const handleChat = (msg) => {
            addChatMessage(msg);
        };

        const handleTyping = ({ userId, userName, isTyping }) => {
            if (isTyping) {
                addTypingUser({ userId, userName });
            } else {
                removeTypingUser(userId);
            }
        };

        socket.on("room:chat-message", handleChat);
        socket.on("room:typing", handleTyping);

        return () => {
            socket.off("room:chat-message", handleChat);
            socket.off("room:typing", handleTyping);
        };
    }, [socket, addChatMessage, addTypingUser, removeTypingUser]);

    const handleSend = () => {
        if (!message.trim() || !socket) return;

        socket.emit("room:chat-message", { roomId, message: message.trim() });
        socket.emit("room:typing", { roomId, isTyping: false });
        setMessage("");
        inputRef.current?.focus();
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleInput = (e) => {
        setMessage(e.target.value);

        // Typing indicator
        if (socket) {
            socket.emit("room:typing", { roomId, isTyping: true });
            clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => {
                socket.emit("room:typing", { roomId, isTyping: false });
            }, 2000);
        }
    };

    const formatTime = (dateStr) => {
        return new Date(dateStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    return (
        <div className="flex flex-col h-full bg-gray-900/95 dark:bg-gray-950/95 backdrop-blur-xl border-l border-white/5">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                <h3 className="text-sm font-semibold text-white">In-room Chat</h3>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                >
                    <X size={18} />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin scrollbar-thumb-gray-700">
                {chatMessages.length === 0 && (
                    <div className="text-center text-gray-500 text-sm py-8">
                        No messages yet. Say hello! 👋
                    </div>
                )}

                {chatMessages.map((msg, i) => (
                    <div key={msg._id || i}>
                        {msg.type === "system" ? (
                            <div className="text-center text-xs text-gray-500 py-1">
                                {msg.message}
                            </div>
                        ) : (
                            <div className="flex gap-2.5 group">
                                <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white bg-gradient-to-br from-blue-500 to-purple-600 mt-0.5">
                                    {msg.userId?.avatar ? (
                                        <img src={msg.userId.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                        (msg.userId?.fullName || "U")[0].toUpperCase()
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-xs font-semibold text-blue-400 truncate">
                                            {msg.userId?.fullName || "Unknown"}
                                        </span>
                                        <span className="text-[10px] text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {formatTime(msg.createdAt)}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-300 leading-relaxed break-words">
                                        {msg.message}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                <div ref={messagesEndRef} />
            </div>

            {/* Typing indicator */}
            {typingUsers.length > 0 && (
                <div className="px-4 py-1 text-xs text-gray-400 animate-pulse">
                    {typingUsers.map((u) => u.userName).join(", ")}{" "}
                    {typingUsers.length === 1 ? "is" : "are"} typing...
                </div>
            )}

            {/* Input */}
            <div className="px-3 py-3 border-t border-white/5">
                <div className="flex items-center gap-2 bg-gray-800/80 rounded-xl px-3 py-2 border border-white/5 focus-within:border-blue-500/40 transition-colors">
                    <input
                        ref={inputRef}
                        type="text"
                        value={message}
                        onChange={handleInput}
                        onKeyDown={handleKeyDown}
                        placeholder="Send a message..."
                        className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 outline-none"
                        maxLength={1000}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!message.trim()}
                        className="text-blue-400 hover:text-blue-300 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors p-1"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatPanel;
