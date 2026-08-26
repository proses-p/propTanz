import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function CreateHostel() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        hostel_name: "",
        landlord_name: "",
        location: "",
        price: "",
        hostel_type: "",
        status: "pending",
    });

    const [images, setImages] = useState([]);

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

        try {
            // Backend connection and image upload
            // tutafanya hatua inayofuata

            console.log("HOSTEL DATA:", formData);
            console.log("HOSTEL IMAGES:", images);

            toast.success("Hostel registered successfully!");

            // Kwa sasa tunarudi dashboard
            navigate("/hostel-registration");
        } catch (error) {
            console.error(error);
            toast.error("Failed to register hostel.");
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
                                    Landlord Name
                                </label>

                                <input
                                    type="text"
                                    name="landlord_name"
                                    value={formData.landlord_name}
                                    onChange={handleChange}
                                    placeholder="Enter landlord name"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Location
                                </label>

                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="Enter hostel location"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
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
                            </div>

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

                                    <option value="male">
                                        Male
                                    </option>

                                    <option value="female">
                                        Female
                                    </option>

                                    <option value="mixed">
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
                            You can upload multiple images of your hostel.
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
                            className="rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
                        >
                            Register Hostel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}