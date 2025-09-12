
import api from "./GlobalApi";

// Get Home Content (from your Spring Boot backend)
export const getHomeApi = () => {
  return api.get(`/home`);
};