import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import authService from "../services/authService";
import tokenService from "../services/tokenService";
import { clearUser } from "../services/userService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    let mounted = true;

    async function init() {
      const token = tokenService.getToken();
      if (!token) {
        if (mounted) setLoading(false);
        return;
      }

      try {
        const res = await authService.me(token);
        const payload = res.data?.data ?? res.data ?? null;
        if (mounted && payload) {
          setUser(payload);
        }
      } catch (error) {
        if (error?.response?.status === 401) {
          tokenService.clearToken();
          clearUser();
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    init();

    return () => (mounted = false);
  }, []);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    const data = res.data?.data;
    const token = data?.token;
    const userData = data?.user ?? null;
    if (token) tokenService.setToken(token);
    if (userData) setUser(userData);
    return res;
  };

  const register = async (payload) => {
    const res = await authService.register(payload);
    const data = res.data?.data;
    const token = data?.token;
    const userData = data?.user ?? null;
    if (token) tokenService.setToken(token);
    if (userData) setUser(userData);
    return res;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      // ignore errors but continue clearing
      e.getMessage();
    }
    tokenService.clearToken();
    clearUser();
    setUser(null);
  };

  useEffect(() => {
    const handler = (e) => {
      const status = e?.detail?.status;
      if (status === 401) {
        tokenService.clearToken();
        clearUser();
        setUser(null);
        toast.info("Session expired. Please sign in again.");
        navigate('/login');
      } else if (status === 403) {
        toast.warn("You are not authorized to perform that action.");
      }
    };

    window.addEventListener('app:unauthorized', handler);
    return () => window.removeEventListener('app:unauthorized', handler);
  }, [navigate]);

  const isAuthenticated = !!user;

  const hasRole = (roles) => {
    if (!user || !user.role) return false;
    if (!roles) return true;
    if (typeof roles === "string") return user.role === roles;
    if (Array.isArray(roles)) return roles.includes(user.role);
    return false;
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, isAuthenticated, hasRole }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
