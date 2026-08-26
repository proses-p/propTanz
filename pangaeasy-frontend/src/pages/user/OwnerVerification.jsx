import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ownerRequestService from "../../services/ownerRequestService";

export default function OwnerVerification() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        full_name: "",
        phone: "",
        reason: ""
    });
    const [submitting, setSubmitting] = useState(false);
    const [requestStatus, setRequestStatus] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    useEffect(() => {
        const loadStatus = async () => {
            try {
                const response = await ownerRequestService.getStatus();
                setRequestStatus(response.data.data?.status);
            } catch (error) {
                console.error(error);
            }
        };
        loadStatus();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // connect to APIs here
        try {
            setSubmitting(true);
            const response = await ownerRequestService.create(formData);
            console.log("OWNER REQUEST RESPONSE:", response.data);
            toast.success("Verification submitted! wait for approval you will be notified");
            navigate("/dashboard");
        } catch (error) {
            console.log("OWNER REQUEST ERROR:", error.response?.data);
            toast.error(error.response?.data?.message || "Something went wrong. PLease try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6 flex items-start justify-between">
            <div className="mx-auto max-w-2xl rounded-xl bg-white p-8 shadow-sm">
                <h1 className="mb-2 text-2xl font-bold">
                    Owner Verification
                </h1>

                <p className="mb-6 text-gray-500">
                    Please provide information to verify that you are authorized to register a hostel
                </p>

                {requestStatus === "pending" && (
                    <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-2 text-sm text-yellow-700">
                        pending
                    </div>
                )}

                {requestStatus === "rejected" && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
                        rejected
                    </div>
                )}

                {!requestStatus && (
                    <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-600">
                        Not verified yet!
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="mb-2 block font-medium">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            className="w-full rounded-lg border p-3"
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-2 block font-medium">
                            Phone Number
                        </label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Enter your Phone  Number"
                            className="w-full rounded-lg border p-3"
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-2 block font-medium">
                            Reason
                        </label>
                        <textarea
                            name="reason"
                            value={formData.reason}
                            onChange={handleChange}
                            placeholder="Why do you want to register/list a hostel?"
                            rows="5"
                            className="w-full rounded-lg border p-3"
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-3">
                        <button 
                            type="button"
                            onClick={() => navigate("/dashboard")}
                            className="rounded-lg border px-5 py-3"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {submitting ? "Submitting..." : "Submit Verification"}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
}