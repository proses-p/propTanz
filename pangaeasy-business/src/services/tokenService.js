const TOKEN_KEY = "auth_token";

const tokenService = {
  getToken() {
    try {
      return sessionStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },

  setToken(token) {
    try {
      sessionStorage.setItem(TOKEN_KEY, token);
    } catch {
      // Storage may be unavailable in restricted browser contexts.
    }
  },

  clearToken() {
    try {
      sessionStorage.removeItem(TOKEN_KEY);
    } catch {
      // Continue clearing other storage even if sessionStorage is unavailable.
    }

    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      // Storage may be unavailable in restricted browser contexts.
    }
  },
};

export default tokenService;
