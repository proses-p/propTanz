import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import hostelService from "../../services/hostelService";
//import StatusBadge from "../../components/hostel/StatusBadge";
import { toast } from "react-toastify";
export default function AdminHostelDetails() {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [hostel, setHostel] = useState(null);
    const { id } = useParams();

    const loadHostel = useCallback(async () => {
        try {
            const response = await hostelService.get(id);
            setHostel(response.data.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load hostel data");
        } finally {
            setLoading(false);
        }
    }, [id])

    useEffect(() => {
        loadHostel();
    }, [loadHostel]);
    if (loading) {
        return (
            <div className="p-8">
                <h2 className="text-xl font-semibold">
                    Loading Hostel details...
                </h2>
            </div>
        );
    }

    if (!hostel) {
        return (
            <div className="p-8">
                <h2 className="text-xl font-semibold text-red-600">
                    Hostel not found
                </h2>
                <button
                    onClick={() => navigate("/admin/hostels")}
                    className="mt-4 rounded-lg bg-blue-600 px-5 py-3 text-white"
                >
                    Back to hostels
                </button>
            </div>
        );
    }
    console.log("ADMIN HOSTEL DETAILS:", hostel);

    return (
        <div className="min-h-screen bg-gray-100 p-6 md:p-8">
            <div className="mx-auto max-w-6xl">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <button
                            onClick={() => navigate("/admin/hostels")}
                            className="mb-3 text-sm font-medium text-blue-600 hover:underline"
                        >
                            Back to hostels
                        </button>
                        <h1 className="text-3xl font-bold text-gray-900">
                            {hostel.hostel_name}
                        </h1>
                        <p className="mt-2 text-gray-500">
                            Review hostel information before approval
                        </p>
                    </div>

                    <statusBadge status={hostel.status}/>
                </div>

                {/* images*/}
                <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
                    <h2 className="mb-5 text-xl font-semibold">
                        Hostel images
                    </h2>
                    {hostel.images?.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {hostel.images.map((image) => (
                                <div 
                                    key={image.id}
                                    className="overflow-hidden rounded-lg border bg-gray-50"
                                >
                                    <img src={image.image_url}
                                        alt={hostel.hostel_name}
                                        className="h-52 w-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-lg bg-gray-50 p-8 text-center text-gray-500">
                            No images uploaded for this hostel
                        </div>
                    )}
                </div>

                {/* basic information*/}
                <div className="grid gap-6 md:grid-cols-2">
                    <div>
                        <p className="text-sm text-gray-500">
                            Hostel Name
                        </p>
                        <p className="mt-1 font-medium">
                            {hostel.hostel_name}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Hostel Type
                        </p>
                        <p className="mt-1 font-medium">
                            {hostel.hostel_type}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Region
                        </p>
                        <p className="mt-1 font-medium">
                            {hostel.region}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            District
                        </p>
                        <p className="mt-1 font-medium">
                            {hostel.district}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Ward
                        </p>
                        <p className="mt-1 font-medium">
                            {hostel.ward}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Street
                        </p>
                        <p className="mt-1 font-medium">
                            {hostel.street}
                        </p>
                    </div>

                    <div className="md:col-span-2">
                        <p className="text-sm text-gray-500">
                            Landmark
                        </p>
                        <p className="mt-1 font-medium">
                            {hostel.landmark || "Not Provided"}
                        </p>
                    </div>

                    <div className="md:col-span-2">
                        <p className="text-sm text-gray-500">
                            Description
                        </p>
                        <p className="mt-1 leading-7 text-gray-700">
                            {hostel.description}
                        </p>
                    </div>
                </div>
            </div>

            {/* review actions */}
            {hostel.status === "Pending" && (
                <div className="rounded-xl bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-semibold">
                        Review 
                    </h2>
                    <p className="mt-2 text-gray-500">
                        Review all informations and images before approving or rejecting
                    </p>
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            className="rounded-lg bg-red-600 px-6 py-3 font-medium text-white hover:bg-red-700"
                        >
                            Reject
                        </button>

                        <button
                            type="button"
                            className="rounded-lg bg-green-600 px-6 py-3 font-medium text-white hover:bg-green-700"
                        >
                            Approve
                        </button>
                    </div>
                </div>
           )}
        </div>
    );
}