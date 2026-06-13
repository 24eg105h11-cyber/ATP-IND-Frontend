export const BACKEND_URL = String(import.meta.env.VITE_BACKEND_URL || "http://localhost:4000").replace(/\/+$|^\s+|\s+$/g, "");
export const API_BASE_URL = `${BACKEND_URL}/api`;