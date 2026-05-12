// src/hooks/useSocket.js
import { useEffect, useRef, useCallback, useState } from "react";
import { io } from "socket.io-client";

// Module-level singleton — shared across all components
let globalSocket = null;
let listenerCount = 0;

/**
 * Shared Socket.IO hook.
 * Uses a module-level singleton so all components share ONE connection.
 * Uses state to trigger re-renders when socket connects/disconnects.
 */
const useSocket = () => {
    const [connected, setConnected] = useState(false);
    const socketRef = useRef(null);

    useEffect(() => {
        listenerCount++;

        if (!globalSocket) {
            // Get token from cookies for socket auth
            const token = document.cookie
                .split(";")
                .find((c) => c.trim().startsWith("accessToken="))
                ?.split("=")[1];

            globalSocket = io(window.location.origin, {
                auth: { token },
                withCredentials: true,
                transports: ["websocket", "polling"],
                reconnection: true,
                reconnectionAttempts: 10,
                reconnectionDelay: 1000,
                reconnectionDelayMax: 5000,
            });
        }

        socketRef.current = globalSocket;

        const onConnect = () => {
            console.log("Socket connected:", globalSocket.id);
            setConnected(true);
        };

        const onDisconnect = (reason) => {
            console.log("Socket disconnected:", reason);
            setConnected(false);
        };

        const onError = (err) => {
            console.error("Socket connection error:", err.message);
        };

        globalSocket.on("connect", onConnect);
        globalSocket.on("disconnect", onDisconnect);
        globalSocket.on("connect_error", onError);

        // If already connected, set state immediately
        if (globalSocket.connected) {
            setConnected(true);
        }

        return () => {
            globalSocket.off("connect", onConnect);
            globalSocket.off("disconnect", onDisconnect);
            globalSocket.off("connect_error", onError);

            listenerCount--;

            // Only disconnect if no components are using the socket
            if (listenerCount <= 0) {
                globalSocket.disconnect();
                globalSocket = null;
                listenerCount = 0;
            }
        };
    }, []);

    const emit = useCallback((event, data) => {
        const s = socketRef.current;
        if (!s) return;
        if (s.connected) {
            s.emit(event, data);
        } else {
            // Wait for connection, then emit
            s.once("connect", () => {
                s.emit(event, data);
            });
        }
    }, []);

    const on = useCallback((event, handler) => {
        socketRef.current?.on(event, handler);
        return () => socketRef.current?.off(event, handler);
    }, []);

    const off = useCallback((event, handler) => {
        socketRef.current?.off(event, handler);
    }, []);

    return {
        socket: socketRef.current,
        emit,
        on,
        off,
        connected,
    };
};

export default useSocket;
