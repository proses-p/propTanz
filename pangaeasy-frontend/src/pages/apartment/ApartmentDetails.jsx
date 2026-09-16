import { useEffect, useState } from "react";
import { FiEdit2, FiImage, FiMail, FiPhone, FiTrash2, FiUploadCloud, FiUser } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import apartmentService from "../../services/apartmentService";
import ConfirmModal from "../../components/common/ConfirmModal";
import { BASE_DOMAIN } from "../../services/api";

const mediaUrl = (path) => path?.startsWith("http") ? path : `${BASE_DOMAIN}/storage/${path}`;

export default function ApartmentDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [apartment, setApartment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [imageToDelete, setImageToDelete] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);

    const loadApartment = async () => {
        try {
            const response = await apartmentService.get(id);
            setApartment(response.data.data);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load apartment.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const load = async () => {
            try {
                const response = await apartmentService.get(id);
                setApartment(response.data.data);
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to load apartment.");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    const deleteApartment = async () => {
        try {
            await apartmentService.delete(id);
            toast.success("Apartment deleted successfully.");
            navigate("/apartments");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete apartment.");
        }
    };

    const deleteImage = async () => {
        try {
            await apartmentService.deleteImage(id, imageToDelete.id);
            toast.success("Media deleted successfully.");
            setImageToDelete(null);
            await loadApartment();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete media.");
        }
    };

    const handleMediaUpload = async () => {
        if (!selectedFiles.length) {
            toast.error("Select at least one image or video to upload.");
            return;
        }

        try {
            setUploading(true);
            const formData = new FormData();
            selectedFiles.filter((file) => file.type.startsWith("image/")).slice(0, 5).forEach((file, index) => formData.append(`image_${index + 1}`, file));
            const video = selectedFiles.find((file) => file.type.startsWith("video/"));
            if (video) formData.append("video", video);

            await apartmentService.uploadImages(id, formData);
            setSelectedFiles([]);
            toast.success("Media uploaded successfully.");
            await loadApartment();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to upload media.");
        } finally {
            setUploading(false);
        }
    };

    if (loading) return <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-500">Loading apartment...</div>;
    if (!apartment) return <div className="p-8 text-center">Apartment not found.</div>;

    const images = (apartment.images || []).flatMap((item) => [1, 2, 3, 4, 5].map((number) => ({ id: item.id, path: item[`image_${number}`] })).filter((image) => image.path));
    const poster = apartment.user;
    const posterInitials = poster?.name?.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "U";

    return (
        <div className="min-h-screen bg-slate-50 px-5 py-8 sm:px-8 lg:py-12">
            <div className="mx-auto max-w-5xl">
                <button type="button" onClick={() => navigate("/apartments")} className="mb-6 text-sm font-semibold text-blue-600 hover:underline">Back to apartments</button>
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="flex flex-col gap-5 border-b border-slate-100 pb-6 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-600">Apartment details</p>
                            <h1 className="text-3xl font-bold text-slate-900">{apartment.name}</h1>
                            <p className="mt-2 text-slate-500">{apartment.street}, {apartment.town}</p>
                        </div>
                        <div className="flex gap-2">
                            <button type="button" onClick={() => navigate(`/apartments/${id}/edit`)} className="flex items-center gap-2 rounded-lg border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50"><FiEdit2 /> Edit</button>
                            <button type="button" onClick={deleteApartment} className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"><FiTrash2 /> Delete</button>
                        </div>
                    </div>
                    <dl className="grid gap-5 py-6 sm:grid-cols-2">
                        <div><dt className="text-sm font-semibold text-slate-500">Address</dt><dd className="mt-1 text-slate-900">{apartment.address}</dd></div>
                        <div><dt className="text-sm font-semibold text-slate-500">Created</dt><dd className="mt-1 text-slate-900">{apartment.created_at ? new Date(apartment.created_at).toLocaleDateString() : "-"}</dd></div>
                        <div className="sm:col-span-2"><dt className="text-sm font-semibold text-slate-500">Description</dt><dd className="mt-1 leading-7 text-slate-700">{apartment.description}</dd></div>
                    </dl>
                    <div className="border-t border-slate-100 py-6">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Posted by</p>
                        {poster ? (
                            <div className="mt-4 flex flex-col gap-4 rounded-2xl border border-amber-100 bg-amber-50/60 p-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-3">
                                    {poster.profile_picture_url ? <img src={poster.profile_picture_url} alt={`${poster.name} profile`} className="h-14 w-14 rounded-full object-cover ring-2 ring-white" /> : <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FDBF2D] font-black text-slate-950 ring-2 ring-white">{posterInitials}</div>}
                                    <div>
                                        <h2 className="font-bold text-slate-900">{poster.name}</h2>
                                        <p className="mt-1 text-sm capitalize text-slate-500">{String(poster.role || "Property owner").toLowerCase()}</p>
                                    </div>
                                </div>
                                <div className="space-y-2 text-sm text-slate-600">
                                    {poster.email && <p className="flex items-center gap-2"><FiMail className="text-amber-700" /> {poster.email}</p>}
                                    {poster.phone && <p className="flex items-center gap-2"><FiPhone className="text-amber-700" /> {poster.phone}</p>}
                                </div>
                            </div>
                        ) : (
                            <p className="mt-3 flex items-center gap-2 text-sm text-slate-500"><FiUser /> Poster information is not available for this older listing.</p>
                        )}
                    </div>
                    <div className="border-t border-slate-100 pt-6">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <h2 className="text-xl font-bold">Media</h2>
                            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100">
                                <FiUploadCloud size={16} />
                                Upload media
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*,video/mp4,video/quicktime,video/webm"
                                    className="hidden"
                                    onChange={(event) => setSelectedFiles(Array.from(event.target.files || []))}
                                />
                            </label>
                        </div>

                        {selectedFiles.length > 0 && (
                            <div className="mt-4 flex flex-col gap-3 rounded-xl border border-dashed border-blue-200 bg-blue-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-2 text-sm text-blue-700">
                                    <FiImage />
                                    <span>{selectedFiles.length} file(s) selected</span>
                                </div>
                                <button type="button" onClick={handleMediaUpload} disabled={uploading} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
                                    {uploading ? "Uploading..." : "Save media"}
                                </button>
                            </div>
                        )}

                        {images.length ? <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{images.map((image) => <div key={`${image.id}-${image.path}`} className="group relative overflow-hidden rounded-xl bg-slate-100"><img src={mediaUrl(image.path)} alt={apartment.name} className="h-48 w-full object-cover" /><button type="button" onClick={() => setImageToDelete({ id: image.id })} className="absolute right-3 top-3 rounded-lg bg-white/90 p-2 text-red-600 opacity-0 shadow transition group-hover:opacity-100" title="Delete image"><FiTrash2 /></button></div>)}</div> : <p className="mt-3 text-slate-500">No images uploaded.</p>}
                    </div>
                </div>
            </div>
            <ConfirmModal isOpen={Boolean(imageToDelete)} title="Delete media" message="Are you sure you want to delete this media?" confirmText="Delete" cancelText="Cancel" onCancel={() => setImageToDelete(null)} onConfirm={deleteImage} />
        </div>
    );
}