import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://hivemind-api-v2.onrender.com';

export const axiosClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosClient.interceptors.request.use((config) => {
    let token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    // Fallback to cookie if localStorage is empty
    if (!token && typeof document !== 'undefined') {
        const match = document.cookie.match(/(?:^|; )token=([^;]*)/);
        token = match ? decodeURIComponent(match[1]) : null;
    }

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("[Axios Request] token found");
    }
    return config;
});

axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized access (e.g., redirect to login)
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                // Optional: window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);
