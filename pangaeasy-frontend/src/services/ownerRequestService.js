import api from "./api";

const ownerRequestService = {
    getAll() {
        return api.get("/owner-request");
    },

    approve(id) {
        return api.patch(`/owner-request/${id}/approve`);
    },

    reject(id) {
        return api.patch(`/owner-request/${id}/reject`);
    },

    getStatus() {
        return api.get("/owner-request/status");
    },
};

export default ownerRequestService