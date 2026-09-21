export const getUser = () => {
    const user = sessionStorage.getItem("user");
    return user ? JSON.parse(user) : null;
};

export const clearUser = () => {
    sessionStorage.removeItem("user");
};

export const logout = clearUser;