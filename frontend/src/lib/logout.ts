import { useAuthStore } from '@/store/useAuthStore';

/**
 * Clean logout: Clear auth state, localStorage, cookies, and redirect to login
 */
export function handleLogoutClean() {
  // 1. Clear Zustand auth store
  useAuthStore.getState().logout();

  // 2. Clear localStorage (including Zustand persist)
  localStorage.removeItem('trello-auth-storage');
  localStorage.clear();

  // 3. Clear sessionStorage
  sessionStorage.clear();

  // 4. Clear all cookies
  clearAllCookies();

  // 5. Redirect to login
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
}

/**
 * Delete all cookies by setting expires to past date
 */
function clearAllCookies() {
  if (typeof document === 'undefined') return;

  document.cookie.split(';').forEach((cookie) => {
    const eqPos = cookie.indexOf('=');
    const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
    
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
  });
}
