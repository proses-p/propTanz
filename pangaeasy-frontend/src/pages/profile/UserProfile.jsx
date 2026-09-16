import { Mail, Phone, ShieldCheck, UserRound, ArrowLeft, UploadCloud } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { updateProfilePicture } from "../../services/userService";
import { toast } from "react-toastify";

export default function UserProfile() {
    const navigate = useNavigate();
    const { user, updateUser } = useAuth();
    const account = user || {};
    const initials = account.name?.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "U";
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(account.profile_picture || null);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        setSelectedFile(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleUpload = async () => {
        if (!selectedFile) return;
        try {
            setUploading(true);
            const formData = new FormData();
            formData.append("profile_picture", selectedFile);
            const response = await updateProfilePicture(formData);
            updateUser(response.data.data);
            setSelectedFile(null);
            toast.success("Profile picture updated successfully.");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to upload profile picture.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f7f8f6] px-5 py-8 text-slate-900 sm:px-8 lg:py-12">
            <div className="mx-auto max-w-4xl">
                <button type="button" onClick={() => navigate(-1)} className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950">
                    <ArrowLeft size={17} /> Back
                </button>

                <div className="overflow-hidden rounded-3xl border border-[#eee6c7] bg-white shadow-[0_18px_46px_rgba(67,53,0,0.08)]">
                    <div className="bg-[#fff8cf] px-6 py-8 sm:px-10">
                        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#b27a00]">Account profile</p>
                        <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center">
                            <div className="relative h-20 w-20 shrink-0">
                                {preview ? <img src={preview} alt={`${account.name || "User"} profile`} className="h-20 w-20 rounded-full object-cover shadow-[0_10px_24px_rgba(253,191,45,0.25)]" /> : <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#FDBF2D] text-2xl font-black text-slate-950 shadow-[0_10px_24px_rgba(253,191,45,0.25)]">{initials}</div>}
                            </div>
                            <div>
                                <h1 className="text-3xl font-black tracking-[-0.05em] sm:text-4xl">{account.name || "User profile"}</h1>
                                <p className="mt-2 text-slate-600">Manage and review your account information.</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-10">
                        <div>
                            <p className="font-semibold text-slate-900">Profile picture</p>
                            <p className="mt-1 text-sm text-slate-500">JPG, PNG, or WebP up to 5MB.</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                                <UploadCloud size={16} /> Choose picture
                                <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} className="hidden" />
                            </label>
                            {selectedFile && <button type="button" onClick={handleUpload} disabled={uploading} className="rounded-lg bg-[#FDBF2D] px-4 py-2 text-sm font-bold text-slate-950 hover:bg-[#FAF92A] disabled:cursor-not-allowed disabled:opacity-60">{uploading ? "Uploading..." : "Save picture"}</button>}
                        </div>
                    </div>

                    <div className="grid gap-4 p-6 sm:grid-cols-2 sm:p-10">
                        <div className="rounded-2xl border border-slate-200 p-5">
                            <Mail className="text-[#b27a00]" size={20} />
                            <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Email address</p>
                            <p className="mt-2 break-words font-semibold text-slate-900">{account.email || "Not provided"}</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 p-5">
                            <Phone className="text-[#b27a00]" size={20} />
                            <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Phone number</p>
                            <p className="mt-2 font-semibold text-slate-900">{account.phone || "Not provided"}</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 p-5">
                            <ShieldCheck className="text-[#b27a00]" size={20} />
                            <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Account role</p>
                            <p className="mt-2 font-semibold uppercase text-slate-900">{account.role || "User"}</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 p-5">
                            <UserRound className="text-[#b27a00]" size={20} />
                            <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Account status</p>
                            <p className="mt-2 font-semibold capitalize text-slate-900">{account.status || "Active"}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
