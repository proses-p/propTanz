import { useState } from "react";
import {
    ArrowLeft,
    ArrowRight,
    Building2,
    ImagePlus,
    MapPin,
    Trash2,
} from "lucide-react";
import { toast } from "react-toastify";

export default function Step2BasicInformation({
    data,
    setData,
    images,
    setImages,
    onNext,
    onBack,
}) {
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;

        setData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    const handleImagesChange = (e) => {
        const selectedFiles = Array.from(e.target.files);

        if (!selectedFiles.length) return;

        setImages((prev) => [
            ...prev,
            ...selectedFiles,
        ]);

        e.target.value = "";
    };

    const removeImage = (index) => {
        setImages((prev) =>
            prev.filter((_, i) => i !== index)
        );
    };

    const validate = () => {
        const newErrors = {};

        if (!data.hostel_name.trim()) {
            newErrors.hostel_name = "Hostel name is required.";
        }

        if (!data.region.trim()) {
            newErrors.region = "Region is required.";
        }

        if (!data.district.trim()) {
            newErrors.district = "District is required.";
        }

        if (!data.ward.trim()) {
            newErrors.ward = "Ward is required.";
        }

        if (!data.street.trim()) {
            newErrors.street = "Street is required.";
        }

        if (!data.hostel_type) {
            newErrors.hostel_type = "Please select hostel type.";
        }

        if (!data.description.trim()) {
            newErrors.description = "Description is required.";
        }

        if (images.length === 0) {
            toast.error("Please upload at least one hostel image.");
            return false;
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleContinue = () => {
        if (!validate()) {
            toast.error("Please complete the hostel information.");
            return;
        }

        onNext();
    };

    return (
        <div className="mx-auto max-w-5xl">
            {/* Header */}
            <div className="mb-8">
                <p className="text-sm font-semibold text-[#d89d00]">
                    Step 2 of 5
                </p>

                <h1 className="mt-2 text-3xl font-bold text-slate-900">
                    Basic Information
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                    Provide the basic information and location details
                    of your hostel.
                </p>
            </div>

            {/* Main Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                {/* Section Header */}
                <div className="mb-8 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FAF92A]/30 text-slate-900">
                        <Building2 size={21} />
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">
                            Hostel Details
                        </h2>

                        <p className="text-sm text-slate-500">
                            Tell us about your property.
                        </p>
                    </div>
                </div>

                <div className="space-y-7">
                    {/* Hostel Name */}
                    <div>
                        <label
                            htmlFor="hostel_name"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Hostel Name
                        </label>

                        <input
                            id="hostel_name"
                            name="hostel_name"
                            type="text"
                            value={data.hostel_name}
                            onChange={handleChange}
                            placeholder="Enter hostel name"
                            className={`
                                w-full rounded-xl border bg-white
                                px-4 py-3.5 text-sm text-slate-900
                                outline-none transition
                                placeholder:text-slate-400
                                focus:ring-2
                                ${
                                    errors.hostel_name
                                        ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                                        : "border-slate-200 focus:border-[#FDBF2D] focus:ring-[#FDBF2D]/20"
                                }
                            `}
                        />

                        {errors.hostel_name && (
                            <p className="mt-2 text-xs text-red-500">
                                {errors.hostel_name}
                            </p>
                        )}
                    </div>

                    {/* Hostel Type */}
                    <div>
                        <label
                            htmlFor="hostel_type"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Hostel Type
                        </label>

                        <select
                            id="hostel_type"
                            name="hostel_type"
                            value={data.hostel_type}
                            onChange={handleChange}
                            className={`
                                w-full rounded-xl border bg-white
                                px-4 py-3.5 text-sm text-slate-900
                                outline-none transition
                                focus:ring-2
                                ${
                                    errors.hostel_type
                                        ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                                        : "border-slate-200 focus:border-[#FDBF2D] focus:ring-[#FDBF2D]/20"
                                }
                            `}
                        >
                            <option value="">
                                Select hostel type
                            </option>

                            <option value="Boys">
                                Boys
                            </option>

                            <option value="Girls">
                                Girls
                            </option>

                            <option value="Mixed">
                                Mixed
                            </option>
                        </select>

                        {errors.hostel_type && (
                            <p className="mt-2 text-xs text-red-500">
                                {errors.hostel_type}
                            </p>
                        )}
                    </div>

                    {/* Location */}
                    <div>
                        <div className="mb-4 flex items-center gap-2">
                            <MapPin
                                size={19}
                                className="text-[#d89d00]"
                            />

                            <h3 className="text-base font-semibold text-slate-900">
                                Location
                            </h3>
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">
                            {/* Region */}
                            <div>
                                <label
                                    htmlFor="region"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Region
                                </label>

                                <input
                                    id="region"
                                    name="region"
                                    type="text"
                                    value={data.region}
                                    onChange={handleChange}
                                    placeholder="e.g. Dar es Salaam"
                                    className={`
                                        w-full rounded-xl border bg-white
                                        px-4 py-3.5 text-sm outline-none
                                        focus:ring-2
                                        ${
                                            errors.region
                                                ? "border-red-400 focus:ring-red-100"
                                                : "border-slate-200 focus:border-[#FDBF2D] focus:ring-[#FDBF2D]/20"
                                        }
                                    `}
                                />

                                {errors.region && (
                                    <p className="mt-2 text-xs text-red-500">
                                        {errors.region}
                                    </p>
                                )}
                            </div>

                            {/* District */}
                            <div>
                                <label
                                    htmlFor="district"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    District
                                </label>

                                <input
                                    id="district"
                                    name="district"
                                    type="text"
                                    value={data.district}
                                    onChange={handleChange}
                                    placeholder="Enter district"
                                    className={`
                                        w-full rounded-xl border bg-white
                                        px-4 py-3.5 text-sm outline-none
                                        focus:ring-2
                                        ${
                                            errors.district
                                                ? "border-red-400 focus:ring-red-100"
                                                : "border-slate-200 focus:border-[#FDBF2D] focus:ring-[#FDBF2D]/20"
                                        }
                                    `}
                                />

                                {errors.district && (
                                    <p className="mt-2 text-xs text-red-500">
                                        {errors.district}
                                    </p>
                                )}
                            </div>

                            {/* Ward */}
                            <div>
                                <label
                                    htmlFor="ward"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Ward
                                </label>

                                <input
                                    id="ward"
                                    name="ward"
                                    type="text"
                                    value={data.ward}
                                    onChange={handleChange}
                                    placeholder="Enter ward"
                                    className={`
                                        w-full rounded-xl border bg-white
                                        px-4 py-3.5 text-sm outline-none
                                        focus:ring-2
                                        ${
                                            errors.ward
                                                ? "border-red-400 focus:ring-red-100"
                                                : "border-slate-200 focus:border-[#FDBF2D] focus:ring-[#FDBF2D]/20"
                                        }
                                    `}
                                />

                                {errors.ward && (
                                    <p className="mt-2 text-xs text-red-500">
                                        {errors.ward}
                                    </p>
                                )}
                            </div>

                            {/* Street */}
                            <div>
                                <label
                                    htmlFor="street"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Street
                                </label>

                                <input
                                    id="street"
                                    name="street"
                                    type="text"
                                    value={data.street}
                                    onChange={handleChange}
                                    placeholder="Enter street"
                                    className={`
                                        w-full rounded-xl border bg-white
                                        px-4 py-3.5 text-sm outline-none
                                        focus:ring-2
                                        ${
                                            errors.street
                                                ? "border-red-400 focus:ring-red-100"
                                                : "border-slate-200 focus:border-[#FDBF2D] focus:ring-[#FDBF2D]/20"
                                        }
                                    `}
                                />

                                {errors.street && (
                                    <p className="mt-2 text-xs text-red-500">
                                        {errors.street}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Landmark */}
                        <div className="mt-5">
                            <label
                                htmlFor="landmark"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Landmark
                                <span className="ml-1 text-slate-400">
                                    (Optional)
                                </span>
                            </label>

                            <input
                                id="landmark"
                                name="landmark"
                                type="text"
                                value={data.landmark}
                                onChange={handleChange}
                                placeholder="e.g. Near Mzumbe University"
                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#FDBF2D] focus:ring-2 focus:ring-[#FDBF2D]/20"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label
                            htmlFor="description"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Hostel Description
                        </label>

                        <textarea
                            id="description"
                            name="description"
                            rows={5}
                            value={data.description}
                            onChange={handleChange}
                            placeholder="Describe your hostel, facilities, environment, and anything important tenants should know..."
                            className={`
                                w-full resize-none rounded-xl border bg-white
                                px-4 py-3.5 text-sm text-slate-900
                                outline-none transition
                                placeholder:text-slate-400
                                focus:ring-2
                                ${
                                    errors.description
                                        ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                                        : "border-slate-200 focus:border-[#FDBF2D] focus:ring-[#FDBF2D]/20"
                                }
                            `}
                        />

                        {errors.description && (
                            <p className="mt-2 text-xs text-red-500">
                                {errors.description}
                            </p>
                        )}
                    </div>

                    {/* Images */}
                    <div>
                        <div className="mb-3">
                            <h3 className="text-base font-semibold text-slate-900">
                                Hostel Images
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                                Upload clear images of your hostel.
                            </p>
                        </div>

                        <label
                            htmlFor="hostel_images"
                            className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center transition hover:border-[#FDBF2D] hover:bg-[#FAF92A]/10"
                        >
                            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
                                <ImagePlus
                                    size={22}
                                    className="text-slate-600"
                                />
                            </div>

                            <p className="text-sm font-semibold text-slate-800">
                                Click to upload images
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                                PNG, JPG or JPEG
                            </p>
                        </label>

                        <input
                            id="hostel_images"
                            type="file"
                            accept="image/png,image/jpeg,image/jpg"
                            multiple
                            onChange={handleImagesChange}
                            className="hidden"
                        />

                        {/* Image Preview */}
                        {images.length > 0 && (
                            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                                {images.map((image, index) => (
                                    <div
                                        key={`${image.name}-${index}`}
                                        className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white"
                                    >
                                        <img
                                            src={URL.createObjectURL(image)}
                                            alt={`Hostel ${index + 1}`}
                                            className="h-32 w-full object-cover"
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeImage(index)
                                            }
                                            className="absolute right-2 top-2 rounded-lg bg-white/90 p-2 text-red-500 opacity-0 shadow-sm transition group-hover:opacity-100 hover:bg-white"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Navigation */}
                <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
                    <button
                        type="button"
                        onClick={onBack}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                        <ArrowLeft size={18} />
                        Back
                    </button>

                    <button
                        type="button"
                        onClick={handleContinue}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#FDBF2D] px-6 py-3.5 text-sm font-semibold text-slate-900 transition hover:bg-[#f2b51f] active:scale-[0.98]"
                    >
                        Continue
                        <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}