import { useState } from "react";

const initialForm = {
    hostel_name: "",
    description: "",
    region: "",
    district: "",
    ward: "",
    street: "",
    landmark: "",
    hostel_type: "",
};

export default function HostelForm({ 
    onSubmit,
    initialData = null,
    buttonText = "Save Hostel",
}) {
    const [formData, setFormData] = useState(initialData || initialForm);
    const [errors, setErrors] = useState({});
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrors({});

        try {
            await onSubmit(formData);
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors);
            }
            throw error;
        }

    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input 
                type="text"
                name="hostel_name"
                placeholder="Hostel Name"
                value={formData.hostel_name}
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
            />

            {
                errors.hostel_name && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.hostel_name[0]}
                    </p>
                )
            }

            <textarea 
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
            />

            {
                errors.description && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.description[0]}
                    </p>
                )

            }

            <input
                type="text"
                name="region"
                placeholder="Region"
                value={formData.region}
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
            />

            {
                errors.region && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.region[0]}
                    </p>
                )
            }

            <input
                type="text"
                name="district"
                placeholder="District"
                value={formData.district}
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
            />

            {
                errors.district && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.district[0]}
                    </p>
                )
            }

            <input
                type="text"
                name="ward"
                placeholder="Ward"
                value={formData.ward}
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
            />

            {
                errors.ward && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.ward[0]}
                    </p>
                )
            }

            <input
                type="text"
                name="street"
                placeholder="Street"
                value={formData.street}
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
            />

            {
                errors.street && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.street[0]}
                    </p>
                )
            }

            <input
                type="text"
                name="landmark"
                placeholder="Landmark"
                value={formData.landmark}
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
            />

            <select
                name="hostel_type"
                value={formData.hostel_type}
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
            >
                <option value="Boys">Boys</option>
                <option value="Girls">Girls</option>
                <option value="Mixed">Mixed</option>
            </select>

            {
                errors.hostel_type && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.hostel_type[0]}
                    </p>
                )
            }

            <div className="flexvjustify-end gap-3">
                <button
                    type="submit"
                    className="rounded-lg bg-blue-600 px-5 py-3 text-white"
                >
                    {buttonText}
                </button>
            </div>
        </form>
    )
}