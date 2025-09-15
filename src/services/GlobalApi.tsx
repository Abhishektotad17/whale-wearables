import axios from "axios";

// Create axios instance with base config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api", // fallback for development
  withCredentials: true, // for secure cookies
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Request Interceptor (attach token)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add request logging for development
    if (import.meta.env.DEV) {
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// ✅ Response Interceptor (global error handling)
api.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (import.meta.env.DEV) {

    }
    return response;
  },
  (error) => {
    // Enhanced error handling
    if (error.response?.status === 401) {
      const token = localStorage.getItem("token");
    
      if (token) {
        console.warn("🔒 Unauthorized access - Token might be expired");
        localStorage.removeItem("token");
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      } else {
        console.warn("👤 Guest user - ignoring 401");
      }
    }    
    // Log error details in development
    if (import.meta.env.DEV) {
      console.error('❌ API Error Details:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        data: error.response?.data,
      });
    }

    return Promise.reject(error);
  }
);

// ✅ Helper functions for common API operations
export const apiHelpers = {
  // GET request with error handling
  get: async <T extends unknown>(url: string, config = {}) => {
    try {
      const response = await api.get<T>(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // POST request with error handling
  post: async <T extends unknown>(url: string, data = {}, config = {}) => {
    try {
      const response = await api.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // PUT request with error handling
  put: async <T extends unknown>(url: string, data = {}, config = {}) => {
    try {
      const response = await api.put<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // DELETE request with error handling
  delete: async <T extends unknown>(url: string, config = {}) => {
    try {
      const response = await api.delete<T>(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default api;