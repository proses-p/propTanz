import api, { API_ROOT } from "./api";
import axios from "axios";

const authService = {
  register(payload) {
    return api.post("/register", payload);
  },

  login(payload) {
    return api.post("/login", payload);
  },

  logout() {
    return api.post("/logout");
  },

  // The current user endpoint lives at /api/user (outside the v1 prefix)
  me(token) {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    return axios.get(`${API_ROOT}/user`, { headers });
  },
};

export default authService;
