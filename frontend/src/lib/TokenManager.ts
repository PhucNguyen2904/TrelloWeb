import axios from 'axios';

interface TokenPair {
  access_token: string;
  refresh_token: string;
}

class TokenManager {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private refreshPromise: Promise<string | null> | null = null;
  private API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  setTokens(access: string, refresh: string) {
    this.accessToken = access;
    this.refreshToken = refresh;
    // We don't store refresh token in localStorage for security (Layer 2)
    // Access token can be in localStorage if needed for session persistence,
    // but the user asked for Refresh Token in-memory.
    if (typeof window !== 'undefined') {
      localStorage.setItem('trello_access_token', access);
    }
  }

  getAccessToken() {
    if (!this.accessToken && typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('trello_access_token');
    }
    return this.accessToken;
  }

  getRefreshToken() {
    return this.refreshToken;
  }

  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('trello_access_token');
    }
  }

  async getValidToken(): Promise<string | null> {
    const token = this.getAccessToken();
    if (!token) return null;

    if (this.isTokenExpired(token)) {
      return this.refreshTokens();
    }

    // Auto-refresh if expiring in < 60 seconds
    if (this.isTokenExpiringSoon(token)) {
      this.refreshTokens(); // Fire and forget or await? Better await to be safe
    }

    return token;
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }

  private isTokenExpiringSoon(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      // Check if expires in less than 60 seconds
      return payload.exp * 1000 - Date.now() < 60000;
    } catch {
      return true;
    }
  }

  async refreshTokens(): Promise<string | null> {
    // Prevent race condition (Layer 2)
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = (async () => {
      try {
        const refresh = this.getRefreshToken();
        if (!refresh) throw new Error('No refresh token');

        const response = await axios.post<TokenPair>(
          `${this.API_URL}/api/auth/refresh`,
          null,
          { params: { refresh_token: refresh } }
        );

        const { access_token, refresh_token } = response.data;
        this.setTokens(access_token, refresh_token);
        return access_token;
      } catch (error) {
        this.clearTokens();
        return null;
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }
}

export const tokenManager = new TokenManager();
