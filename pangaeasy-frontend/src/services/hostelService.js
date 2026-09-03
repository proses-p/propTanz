import api from "./api";

const hostelService = {
    getAll(page = 1) {
        return api.get(`/hostels?page=${page}`);
    },

    get(id) {
        return api.get(`/hostels/${id}`);
    },

    create(data) {
        return api.post("/hostels", data);
    },

    update(id, data) {
        return api.put(`/hostels/${id}`, data);
    },

    delete(id) {
        return api.delete(`/hostels/${id}`);
    },

    statistics() {
        return api.get("/hostels/statistics");
    },

    browse(page = 1) {
        return api.get(`/browse/hostels?page=${page}`);
    },
    approving(id) {
        return api.patch(`/hostels/${id}/approving`);
    },

    rejecting(id, data) {
        return api.patch(`/hostels/${id}/rejecting`, data);
    }
};

export default hostelService;