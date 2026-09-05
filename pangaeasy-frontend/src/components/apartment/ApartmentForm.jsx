import { useState } from "react";

const emptyForm = {
    name: "",
    description: "",
    street: "",
    town: "",
    address: "",
};

export default function ApartmentForm({
    initialData = null,
    onSubmit,
    buttonText = "Save Apartment",
    submitting = false,
}) {
    const [formData, setFormData] = useState({
        name: initialData?.name || emptyForm.name,
        description: initialData?.description || emptyForm.description,
        street: initialData?.street || emptyForm.street,
        town: initialData?.town || emptyForm.town,
        address: initialData?.address || emptyForm.address,
    });
    const [files, setFiles] = useState([]);
    const [errors, setErrors] = useState({});

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((current) => ({ ...current, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrors({});

        const imageFiles = files.filter((file) => file.type.startsWith("image/"));
        if ((!initialData || imageFiles.length > 0) && imageFiles.length < 2) {
            setErrors({ images: ["At least 2 images are required."] });
            return;
        }
        if (imageFiles.length > 5) {
            setErrors({ images: ["You can upload a maximum of 5 images."] });
            return;
        }
        if (files.some((file) => file.size > 100 * 1024 * 1024)) {
            setErrors({ images: ["Each image or video must be 100MB or smaller."] });
            return;
        }

        try {
            await onSubmit(formData, files);
            setFiles([]);
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors || {});
            }
            throw error;
        }
    };

    const fieldError = (field) => errors[field]?.[0];

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
                {[
                    ["name", "Apartment name", "Enter apartment name"],
                    ["town", "Town", "Enter town"],
                    ["street", "Street", "Enter street"],
                    ["address", "Address", "Enter full address"],
                ].map(([name, label, placeholder]) => (
                    <div key={name}>
                        <label htmlFor={name} className="mb-2 block text-sm font-semibold text-slate-700">
                            {label}
                        </label>
                        <input
                            id={name}
                            name={name}
                            value={formData[name]}
                            onChange={handleChange}
                            placeholder={placeholder}
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                        />
                        {fieldError(name) && <p className="mt-1 text-sm text-red-600">{fieldError(name)}</p>}
                    </div>
                ))}
            </div>

            <div>
                <label htmlFor="description" className="mb-2 block text-sm font-semibold text-slate-700">
                    Description
                </label>
                <textarea
                    id="description"
                    name="description"
                    rows="5"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the apartment"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
                {fieldError("description") && <p className="mt-1 text-sm text-red-600">{fieldError("description")}</p>}
            </div>

            <div>
                <label htmlFor="images" className="mb-2 block text-sm font-semibold text-slate-700">
                    Apartment images and video
                </label>
                <input
                    id="images"
                    type="file"
                    multiple
                    accept="image/*,video/mp4,video/quicktime,video/webm"
                    onChange={(event) => setFiles(Array.from(event.target.files || []))}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3"
                />
                <p className="mt-2 text-xs text-slate-500">Upload 2 required images. Up to 3 additional images are optional. Maximum 100MB per file.</p>
                {files.length > 0 && <p className="mt-1 text-sm text-blue-600">{files.length} file(s) selected</p>}
                {fieldError("images") && <p className="mt-1 text-sm text-red-600">{fieldError("images")}</p>}
            </div>

            <button
                type="submit"
                disabled={submitting}
                className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {submitting ? "Saving..." : buttonText}
            </button>
        </form>
    );
}