
import axios from "axios";

const BASE_URL = "http://localhost:8080/api"; // ✅ backend port

// Get Home Content (from your Spring Boot backend)
export const getHomeContent = () => {
  return axios.get(`${BASE_URL}/home`);
};