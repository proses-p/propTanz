import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import apartmentService from "../../services/apartmentService";
import ApartmentForm from "../../components/apartment/ApartmentForm";

export default function ApartmentEditor() {
    const navigate = useNavigate();
    const { id } = useParams();
    const editing = Boolean(id);
    const [apartment, setApartment] = useState(null);
    const [loading, setLoading] = useState(editing);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!editing) return;
        apartmentService.get(id)
            .then((response) => setApartment(response.data.data))
            .catch((error) => toast.error(error.response?.data?.message || "Failed to load apartment."))
            .finally(() => setLoading(false));
    }, [editing, id]);

    const uploadFiles = async (files) => {
        if (!files.length) return;
        const formData = new FormData();
        files.filter((file) => file.type.startsWith("image/")).slice(0, 5).forEach((file, index) => formData.append(`image_${index + 1}`, file));
        const video = files.find((file) => file.type.startsWith("video/"));
        if (video) formData.append("video", video);
        await apartmentService.uploadImages(id, formData);
    };

    const handleSubmit = async (data, files) => {
        try {
            setSubmitting(true);
            const response = editing
                ? await apartmentService.update(id, data)
                : await apartmentService.create(data);
            const saved = response.data.data;
            const savedId = saved.id;
            if (files.length) {
                const originalId = id;
                if (!originalId) {
                    const formData = new FormData();
                    files.filter((file) => file.type.startsWith("image/")).slice(0, 5).forEach((file, index) => formData.append(`image_${index + 1}`, file));
                    const video = files.find((file) => file.type.startsWith("video/"));
                    if (video) formData.append("video", video);
                    await apartmentService.uploadImages(savedId, formData);
                } else {
                    await uploadFiles(files);
                }
            }
            toast.success(editing ? "Apartment updated successfully." : "Apartment created successfully.");
            navigate(`/apartments/${savedId}`);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to save apartment.");
            throw error;
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-500">Loading apartment...</div>;

    return (
        <div className="min-h-screen bg-slate-50 px-5 py-8 sm:px-8 lg:py-12">
            <div className="mx-auto max-w-4xl">
                <button type="button" onClick={() => navigate("/apartments")} className="mb-6 text-sm font-semibold text-blue-600 hover:underline">Back to apartments</button>
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-600">{editing ? "Edit listing" : "New listing"}</p>
                    <h1 className="text-3xl font-bold text-slate-900">{editing ? "Edit apartment" : "Add apartment"}</h1>
                    <p className="mb-8 mt-2 text-slate-500">Enter the apartment details and attach its media.</p>
                    <ApartmentForm key={apartment?.id || "new"} initialData={apartment} onSubmit={handleSubmit} submitting={submitting} buttonText={editing ? "Update apartment" : "Save apartment"} />
                </div>
            </div>
        </div>
    );
}