import axios from "axios";
import tokenService from "./tokenService";

export const BASE_DOMAIN = "http://127.0.0.1:8000";
export const API_ROOT = `${BASE_DOMAIN}/api`;

const api = axios.create({
    baseURL: `${API_ROOT}/v1`,
    headers: {
        Accept: "application/json",
        //"Content-Type": "application/json",
    },
});

// Attach token if available
api.interceptors.request.use((config) => {
    const token = tokenService.getToken();
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle unauthorized responses globally and emit events so UI can react
api.interceptors.response.use(
    (res) => res,
    (err) => {
        const status = err?.response?.status;
        if (status === 401 || status === 403) {
            try {
                window.dispatchEvent(new CustomEvent('app:unauthorized', { detail: { status } }));
            } catch (e) {
                // ignore
                e.getMessage();
            }
        }
        return Promise.reject(err);
    }
);

export default api;