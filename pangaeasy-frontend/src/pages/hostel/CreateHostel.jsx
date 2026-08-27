import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import hostelService from "../../services/hostelService";

export default function CreateHostel() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        hostel_name: "",
        description: "",
        region: "",
        district: "",
        ward: "",
        street: "",
        landmark: "",
        hostel_type: "",
       
    });

    const [images, setImages] = useState([]);
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImagesChange = (e) => {
        const selectedFiles = Array.from(e.target.files);

        setImages((prev) => [
            ...prev,
            ...selectedFiles,
        ]);
    };

    const removeImage = (index) => {
        setImages((prev) =>
            prev.filter((_, i) => i !== index)
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (images.length === 0) {
            toast.error("Please upload at least one hostel image.");
            return;
        }

        try {
            // Backend connection and image upload
            // tutafanya hatua inayofuata
            setSubmitting(true);
            const data = new FormData;
            data.append("hostel_name", formData.hostel_name);
            data.append("description", formData.description);
            data.append("region", formData.region);
            data.append("district", formData.district);
            data.append("ward", formData.ward);
            data.append("street", formData.street);
            data.append("landmark", formData.landmark);
            data.append("hostel_type", formData.hostel_type);
            
            images.forEach((image) => {
                data.append("images[]", image);
            });

            await hostelService.create(data);

            console.log("HOSTEL DATA:", formData);
            console.log("HOSTEL IMAGES:", images);

            toast.success("Hostel registered successfully!");

            // Kwa sasa tunarudi dashboard
            navigate("/hostel-registration");
        } catch (error) {
            console.error(error);

            const response = error.response?.data;
            if (response?.errors) {
                const firstError = Object.values(
                    response.errors
                )[0]?.[0];
                toast.error(firstError || "Please check your information.");
            } else {
                toast.error(response?.message || "Failed to register hostel");
            }
            
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6 md:p-8">
            <div className="mx-auto max-w-5xl">
                
                <button
                    type="button"
                    onClick={() => navigate("/hostel-registration")}
                    className="mb-6 text-sm font-medium text-blue-600 hover:underline"
                >
                    ← Back to My Hostels
                </button>

                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Register New Hostel
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Add your hostel details and upload hostel images.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="rounded-xl bg-white p-6 shadow-sm md:p-8"
                >
                    {/* Basic Information */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Basic Information
                        </h2>

                        <div className="mt-5 grid gap-5 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Hostel Name
                                </label>

                                <input
                                    type="text"
                                    name="hostel_name"
                                    value={formData.hostel_name}
                                    onChange={handleChange}
                                    placeholder="Enter hostel name"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Region
                                </label>

                                <input
                                    type="text"
                                    name="region"
                                    value={formData.region}
                                    onChange={handleChange}
                                    placeholder="Enter region"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    District
                                </label>

                                <input
                                    type="text"
                                    name="district"
                                    value={formData.district}
                                    onChange={handleChange}
                                    placeholder="Enter district"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    ward
                                </label>

                                <input
                                    type="text"
                                    name="ward"
                                    value={formData.ward}
                                    onChange={handleChange}
                                    placeholder="Enter ward"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Street
                                </label>

                                <input
                                    type="text"
                                    name="street"
                                    value={formData.street}
                                    onChange={handleChange}
                                    placeholder="Enter street"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Landmark
                                </label>

                                <input
                                    type="text"
                                    name="landmark"
                                    value={formData.landmark}
                                    onChange={handleChange}
                                    placeholder="Near by school building - (Optional)"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    description
                                </label>

                                <input
                                    type="text"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="describe your hostel..."
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Price
                                </label>

                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="Enter price"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div> */}

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Hostel Type
                                </label>

                                <select
                                    name="hostel_type"
                                    value={formData.hostel_type}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">
                                        Select hostel type
                                    </option>

                                    <option value="Boys">
                                        Male
                                    </option>

                                    <option value="Girls">
                                        Female
                                    </option>

                                    <option value="Mixed">
                                        Mixed
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Hostel Images */}
                    <div className="border-t pt-8">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Hostel Images
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Upload one or more images of your hostel (maximum 10 images).
                        </p>

                        <div className="mt-5">
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImagesChange}
                                className="block w-full rounded-lg border border-gray-300 p-3"
                            />
                        </div>

                        {images.length > 0 && (
                            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                                {images.map((image, index) => (
                                    <div
                                        key={`${image.name}-${index}`}
                                        className="relative overflow-hidden rounded-lg border"
                                    >
                                        <img
                                            src={URL.createObjectURL(image)}
                                            alt={`Hostel ${index + 1}`}
                                            className="h-32 w-full object-cover"
                                        />

                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute right-2 top-2 rounded-full bg-red-600 px-3 py-1 text-xs text-white"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="mt-8 flex justify-end gap-4 border-t pt-6">
                        <button
                            type="button"
                            onClick={() => navigate("/hostel-registration")}
                            disabled={submitting}
                            className="rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
                        >
                            {submitting
                                ? "Registering....."
                                : "Register Hostel"
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}