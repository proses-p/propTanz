import api from "./api";

export const getUser = () => {
    const user = sessionStorage.getItem("user");
    return user ? JSON.parse(user) : null;
};

export const clearUser = () => {
    sessionStorage.removeItem("user");
};

export const logout = clearUser;

export function updateProfilePicture(data) {
    return api.put("/user/profile", data);
}