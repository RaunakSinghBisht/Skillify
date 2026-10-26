import { createContext, useState, useEffect, useCallback, useRef } from "react";
import { authApi } from "./services/auth.api";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Guard against concurrent refresh calls (React StrictMode fires effects twice in dev)
  const refreshInFlight = useRef(false);

  // Setup silent refresh
  const handleRefresh = useCallback(async () => {
    // If a refresh is already running, skip this invocation
    if (refreshInFlight.current) return;
    refreshInFlight.current = true;
    try {
      const data = await authApi.refreshTokens();
      setAccessToken(data.accessToken);

      // Fetch fresh user details using the new access token
      const meData = await authApi.getMe(data.accessToken);
      setUser(meData.user);
      localStorage.setItem("user", JSON.stringify(meData.user));

      return data.accessToken;
    } catch (err) {
      // Only clear auth state if this is a genuine auth failure (not a race)
      setAccessToken(null);
      setUser(null);
      localStorage.removeItem("user");
      throw err;
    } finally {
      refreshInFlight.current = false;
    }
  }, []);

  // Run silent refresh on mount
  useEffect(() => {
    let cancelled = false;

    const initAuth = async () => {
      try {
        await handleRefresh();
      } catch {
        // Ignored — user is simply not logged in
      } finally {
        // Don't update state if this effect was cleaned up (StrictMode second run)
        if (!cancelled) setIsLoading(false);
      }
    };

    initAuth();

    // StrictMode cleanup: mark this run as stale so its finally-block is ignored
    return () => { cancelled = true; };
  }, [handleRefresh]);

  // Automatic token refresh timer before expiry (every 14 minutes for a 15 min expiry token)
  useEffect(() => {
    if (!accessToken) return;

    const intervalTime = 14 * 60 * 1000; // 14 minutes
    const timer = setInterval(() => {
      handleRefresh().catch((err) => {
        console.error("Auto refresh failed:", err);
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [accessToken, handleRefresh]);

  const login = async (email, password) => {
    setError(null);
    try {
      const data = await authApi.login(email, password);
      setAccessToken(data.accessToken);
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const register = async (username, email, password) => {
    setError(null);
    try {
      const data = await authApi.register(username, email, password);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const verifyEmail = async (email, otp) => {
    setError(null);
    try {
      const data = await authApi.verifyEmail(email, otp);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    setError(null);
    try {
      await authApi.logout(accessToken);
    } catch (err) {
      console.error("Logout request error:", err);
    } finally {
      // Always clear state locally
      setAccessToken(null);
      setUser(null);
      localStorage.removeItem("user");
    }
  };

  const logoutAll = async () => {
    setError(null);
    try {
      await authApi.logoutAll(accessToken);
    } catch (err) {
      console.error("Logout all request error:", err);
    } finally {
      // Always clear state locally
      setAccessToken(null);
      setUser(null);
      localStorage.removeItem("user");
    }
  };

  const value = {
    user,
    accessToken,
    isLoading,
    error,
    login,
    register,
    verifyEmail,
    logout,
    logoutAll,
    refreshAccessToken: handleRefresh,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
