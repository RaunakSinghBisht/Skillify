import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const API = axios.create({
  baseURL: `${API_URL}/api/auth`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper to handle error responses consistently
const handleError = (error) => {
  const message = error.response?.data?.message || error.message || "API request failed";
  throw new Error(message);
};

export const authApi = {
  register: async (username, email, password) => {
    try {
      const response = await API.post("/register", { username, email, password });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  verifyEmail: async (email, otp) => {
    try {
      const response = await API.post("/verify-email", { email, otp });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  login: async (email, password) => {
    try {
      const response = await API.post("/login", { email, password });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  refreshTokens: async () => {
    try {
      const response = await API.get("/refreshTokens");
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  logout: async (accessToken) => {
    try {
      const config = accessToken
        ? { headers: { Authorization: `Bearer ${accessToken}` } }
        : {};
      const response = await API.get("/logout", config);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  logoutAll: async (accessToken) => {
    try {
      const config = accessToken
        ? { headers: { Authorization: `Bearer ${accessToken}` } }
        : {};
      const response = await API.get("/logoutAll", config);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  getMe: async (accessToken) => {
    try {
      const config = accessToken
        ? { headers: { Authorization: `Bearer ${accessToken}` } }
        : {};
      const response = await API.get("/me", config);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
};

