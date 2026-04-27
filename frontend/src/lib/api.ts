import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,  // Cho phép cookie (future-proof)
  timeout: 10000,         // 10 second timeout
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log(`[API] 🔐 Attached token to ${config.method?.toUpperCase()} ${config.url}`);
  } else {
    console.log(`[API] ⚠️ No token in store for ${config.method?.toUpperCase()} ${config.url}`);
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log(`[API] ✅ ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.error('[API] ❌ 401 Unauthorized - Token invalid/expired', {
        detail: error.response?.data?.detail,
        url: error.config?.url,
      });
      useAuthStore.getState().logout();
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    if (error.response?.status === 403) {
      console.error('[API] ❌ 403 Forbidden - Check CORS & Authorization header', {
        detail: error.response?.data?.detail,
        url: error.config?.url,
        headers: error.config?.headers,
      });
    }
    if (error.code === 'ECONNABORTED') {
      console.error('[API] ❌ Request timeout (10s exceeded)', error.config?.url);
    }
    return Promise.reject(error);
  }
);
