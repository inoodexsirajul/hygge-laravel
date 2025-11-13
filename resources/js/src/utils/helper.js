const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
};

export { debounce };

// utils/auth.js
export const isTokenValid = () => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const exp = payload.exp * 1000; // ms
        return Date.now() < exp;
    } catch {
        return false;
    }
};

// utils/session.js
export const getSessionId = () => {
    const KEY = "session_id";
    let sessionId = localStorage.getItem(KEY);

    if (!sessionId) {
        // প্রথমবার → তৈরি করো
        sessionId =
            "guest_" +
            Date.now() +
            "_" +
            Math.random().toString(36).substr(2, 9);
        localStorage.setItem(KEY, sessionId);
    }

    return sessionId;
};

export const clearSessionId = () => {
    localStorage.removeItem("session_id");
};
