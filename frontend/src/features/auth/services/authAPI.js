import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

export const register = async (username, email, password) => {
  const response = await api.post("/auth/user/register", {
    username,
    email,
    password,
  });
  return response.data;
};

export const login = async (email, password) => {
  const response = await api.post("/auth/user/login", { email, password });
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await api.post("/auth/user/forgot-password", { email });
  return response.data;
};

export const resetPassword = async (token, newPassword, confirmPassword) => {
  const response = await api.post(`/auth/user/reset-password/${token}`, {
    newPassword,
    confirmPassword,
  });
  return response.data;
};

export const logout = async () => {
  const response = await api.post("/auth/user/logout");
  return response.data;
};

export const logoutAll = async () => {
  const response = await api.post("/auth/user/logout-all");
  return response.data;
};

export const verifyGateCode = async (code) => {
  const response = await api.post("/auth/user/gate/verify", { code });
  return response.data;
};

export const gateStatus = async () => {
  const response = await api.get("/auth/user/gate/status");
  return response;
};

export const forgotGateCode = async () => {
  const response = await api.post("/auth/user/gate/forgot");
  return response.data;
};

export const resetGateCode = async (token, newCode) => {
  const response = await api.post(`/auth/user/gate/reset/${token}`, {
    newCode,
  });
  return response.data;
};

// Private function — only used by interceptor to get a new access token
const refreshToken = async () => {
  const response = await api.post("/auth/user/refresh-token");
  return response.data;
};

// Interceptor — automatically refreshes access token on 401 and retries the original request
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest.url.includes("/auth/user/refresh-token")
    ) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await refreshToken();
        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;