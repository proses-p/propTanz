import api from "./api";

const apartmentService = {
    getAll(page = 1) {
        return api.get(`/apartments?page=${page}`);
    },

    get(id) {
        return api.get(`/apartments/${id}`);
    },

    create(data) {
        return api.post("/apartments", data);
    },

    update(id, data) {
        return api.put(`/apartments/${id}`, data);
    },

    delete(id) {
        return api.delete(`/apartments/${id}`);
    },

    getImages(id) {
        return api.get(`/apartments/${id}/images`);
    },

    uploadImages(id, data) {
        return api.post(`/apartments/${id}/images`, data);
    },

    deleteImage(apartmentId, imageId) {
        return api.delete(`/apartments/${apartmentId}/images/${imageId}`);
    },
};

export default apartmentService;