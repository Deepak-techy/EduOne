import { deleteTempSession } from '../services/vector.service.js';
import { SESSION_TIMEOUT } from '../constants.js';

const activeSessions = new Map();

// Create new session with auto-cleanup
export const createSession = (sessionId) => {
    const timeoutId = setTimeout(async () => {
        await deleteTempSession(sessionId);
        activeSessions.delete(sessionId);
        console.log(`Session ${sessionId} cleaned up`);
    }, SESSION_TIMEOUT);

    activeSessions.set(sessionId, timeoutId);
    return sessionId;
};

// Extend session timeout on activity
export const extendSession = (sessionId) => {
    if (activeSessions.has(sessionId)) {
        clearTimeout(activeSessions.get(sessionId));
        createSession(sessionId);
    }
};

// Manual session cleanup
export const endSession = async (sessionId) => {
    if (activeSessions.has(sessionId)) {
        clearTimeout(activeSessions.get(sessionId));
        await deleteTempSession(sessionId);
        activeSessions.delete(sessionId);
    }
};
