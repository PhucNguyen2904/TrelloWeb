/**
 * Backend Keep-Alive Service
 * 
 * Prevents Render free tier from going to sleep
 * Runs periodic health checks to keep the backend warm
 * 
 * Usage: Call keepBackendAlive() on app load
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const KEEP_ALIVE_INTERVAL = 10 * 60 * 1000; // 10 minutes

let keepAliveTimerId: NodeJS.Timeout | null = null;

/**
 * Send health check to backend
 * Failures are silently logged - don't interrupt user flow
 */
export async function sendHealthCheck(): Promise<boolean> {
  try {
    // Use short timeout for health check (don't wait too long)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`${API_URL}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      console.log('[KeepAlive] ✅ Backend health check passed');
      return true;
    } else {
      console.log(`[KeepAlive] ⚠️ Backend returned ${response.status}`);
      return false;
    }
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.log('[KeepAlive] ⏱️ Health check timeout (backend may be slow)');
    } else {
      console.log('[KeepAlive] Backend not reachable:', error instanceof Error ? error.message : 'Unknown error');
    }
    return false;
  }
}

/**
 * Start periodic health checks
 * Safe to call multiple times - only one interval will run
 */
export function startKeepAlive(): void {
  if (keepAliveTimerId !== null) {
    console.log('[KeepAlive] Already running');
    return;
  }
  
  // Initial health check immediately
  sendHealthCheck();
  
  // Then periodic checks
  keepAliveTimerId = setInterval(() => {
    sendHealthCheck();
  }, KEEP_ALIVE_INTERVAL);
  
  console.log(`[KeepAlive] 🔄 Enabled - Backend will be checked every ${KEEP_ALIVE_INTERVAL / 1000 / 60} minutes`);
}

/**
 * Stop periodic health checks
 */
export function stopKeepAlive(): void {
  if (keepAliveTimerId !== null) {
    clearInterval(keepAliveTimerId);
    keepAliveTimerId = null;
    console.log('[KeepAlive] Disabled');
  }
}

/**
 * Check if keep-alive is currently running
 */
export function isKeepAliveActive(): boolean {
  return keepAliveTimerId !== null;
}
