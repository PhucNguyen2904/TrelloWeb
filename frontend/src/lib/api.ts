import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';

// API Configuration
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Auth endpoints that should NOT include Authorization header
const AUTH_ENDPOINTS = ['/api/auth/login', '/api/auth/register'];

console.log(`[API] 📡 API URL: ${API_URL}`);

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Do NOT use withCredentials for Bearer token auth
  // Only needed for cookie-based auth
  // withCredentials: true,
  
  // Timeout config:
  // - Auth endpoints: 15s (allow time for network latency + preflight)
  // - Other endpoints: 10s
  timeout: 15000,
});

// ===== API Endpoint Functions =====

/** Activities feed — 20 most recently updated tasks across all user boards */
export async function getActivities() {
  const { data } = await api.get('/api/dashboard/activities');
  return data;
}

/** All boards of the current user (with task cards grouped into columns) */
export async function getBoards() {
  const { data } = await api.get('/api/dashboard/boards');
  return data;
}

/**
 * Single board by integer ID with tasks grouped into Kanban columns.
 * Pass the numeric board ID (e.g. 1), NOT a string like 'board-1'.
 */
export async function getBoard(boardId: string | number) {
  const { data } = await api.get(`/api/dashboard/boards/${boardId}`);
  return data;
}

/** Tasks formatted as calendar events (date = task updated_at) */
export async function getCalendarEvents() {
  const { data } = await api.get('/api/dashboard/calendar-events');
  return data;
}

/** User's boards grouped as a single workspace object */
export async function getWorkspaces() {
  const { data } = await api.get('/api/dashboard/workspaces');
  return data;
}

/** Members endpoint (not yet implemented on backend — returns empty list) */
export async function getMembers() {
  return [];
}

/**
 * Request interceptor: Attach JWT token to protected endpoints
 * - Skip token for auth endpoints (login, register)
 * - Skip token for public endpoints
 * - Attach token for all other endpoints
 */
api.interceptors.request.use((config) => {
  const url = config.url || '';
  const isAuthEndpoint = AUTH_ENDPOINTS.some(endpoint => url.includes(endpoint));
  
  if (isAuthEndpoint) {
    // ✓ Public endpoint - no token needed
    console.log(`[API] 📤 POST ${url} (public endpoint, no token)`);
    return config;
  }
  
  const token = useAuthStore.getState().token;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log(`[API] 🔐 ${config.method?.toUpperCase()} ${url} (token attached)`);
  } else {
    console.log(`[API] ⚠️ ${config.method?.toUpperCase()} ${url} (no token in store)`);
  }
  
  return config;
});

/**
 * Response interceptor: Handle errors and logging
 */
api.interceptors.response.use(
  (response) => {
    const { status, config } = response;
    console.log(`[API] ✅ ${status} ${config.method?.toUpperCase()} ${config.url}`);
    return response;
  },
  (error) => {
    const { config, response } = error;
    const url = config?.url || 'unknown';
    const method = config?.method?.toUpperCase() || 'UNKNOWN';
    
    // Network/Timeout Errors
    if (error.code === 'ECONNABORTED') {
      console.error(
        `[API] ⏱️ Request timeout (${config?.timeout}ms exceeded)`,
        { url, method }
      );
      return Promise.reject({
        ...error,
        message: 'Request timeout - backend server may be slow or unreachable',
      });
    }
    
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      console.error(
        `[API] 🔌 Connection failed - cannot reach backend`,
        { url, api: API_URL, code: error.code }
      );
      return Promise.reject({
        ...error,
        message: `Cannot reach backend at ${API_URL}`,
      });
    }
    
    // HTTP Error Responses
    if (!response) {
      console.error(`[API] ❌ Unknown error`, { 
        error: error.message, 
        code: error.code 
      });
      return Promise.reject(error);
    }
    
    const { status, data: responseData } = response;
    
    if (status === 401) {
      console.error(`[API] ❌ 401 Unauthorized - Token invalid/expired`, {
        url,
        detail: responseData?.detail,
      });
      // Logout user if token invalid
      useAuthStore.getState().logout();
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    } else if (status === 403) {
      console.error(`[API] ❌ 403 Forbidden - Check CORS & Authorization`, {
        url,
        detail: responseData?.detail,
        headers: config?.headers,
      });
    } else if (status === 404) {
      console.error(`[API] ❌ 404 Not Found`, { url });
    } else if (status >= 500) {
      console.error(`[API] ❌ ${status} Server Error`, {
        url,
        detail: responseData?.detail || 'Internal server error',
      });
    } else {
      console.error(`[API] ❌ ${status} Error`, {
        url,
        detail: responseData?.detail || error.message,
      });
    }
    
    return Promise.reject(error);
  }
);
