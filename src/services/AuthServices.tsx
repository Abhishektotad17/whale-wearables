import api from "./GlobalApi";

interface LoginPayload {
  identifier: string;
  password: string;
}

interface SignupPayload {
  name: string;
  email: string;
  password: string;
}

export const authService = {
  register: (data: SignupPayload) => api.post("/auth/register", data),
  login: (data: LoginPayload) => api.post("/auth/login", data),
  googleLogin: (code: string) => api.post("/auth/google", { code }),
  getCurrentUser: () => api.get("/auth/me"),
  logout: () => api.post("/auth/logout"),
};
