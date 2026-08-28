import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import hostelService from "../../services/hostelService";
import EmptyState from "../../components/hostel/EmptyState";
import ConfirmModal from "../../components/common/ConfirmModal";
import { toast } from "react-toastify";
import StatisticsCard from "../../components/dashboard/StatisticsCard";
import StatusFilter from "../../components/common/StatusFilter";
import Pagination from "../../components/common/Pagination";

export default function HostelRegistration() {
const navigate = useNavigate();
const [hostels, setHostels] = useState([]);
const [loading, setLoading] = useState(true);
const [search, setSearch] = useState("");
const [deleteModalOpen, setDeleteModalOpen] = useState(false);
const [hostelToDelete, setHostelToDelete] = useState(null);
const [status, setStatus] = useState("all");
const [currentPage, setCurrentPage] = useState(1);
const [pagination, setPagination] = useState({});

const [statistics, setStatistics] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
});

const loadHostels = async (page = 1) => {
    try {
        setCurrentPage(page);

        const response = await hostelService.getAll(page);

        setHostels(response.data.data.data);

        setPagination({
            currentPage: response.data.data.current_page,
            lastPage: response.data.data.last_page,
            total: response.data.data.total,
        });
    } catch (error) {
        console.error("HOSTELS ERROR:", error);
    } finally {
        setLoading(false);
    }
};

const loadStatistics = async () => {
    try {
        const response = await hostelService.statistics();

        setStatistics(response.data.data);
    } catch (error) {
        console.error(
            "STATISTICS ERROR:",
            error.response?.data || error
        );
    }
};

useEffect(() => {
    loadHostels();
    loadStatistics();
}, []);

const displayHostels = hostels.filter((hostel) => {
    const matchSearch = hostel.hostel_name
        ?.toLowerCase()
        .includes(search.toLowerCase());

    const matchStatus =
        status === "all" ||
        hostel.status === status;

    return matchSearch && matchStatus;
});

const handleEditClick = (hostel) => {
    navigate(`/hostel-registration/${hostel.id}/edit`);
};

const handleDeleteClick = (hostel) => {
    setHostelToDelete(hostel);
    setDeleteModalOpen(true);
};

const handleDeleteHostel = async () => {
    if (!hostelToDelete) return;

    try {
        await hostelService.delete(hostelToDelete.id);

        await loadHostels(currentPage);
        await loadStatistics();

        toast.success("Hostel deleted successfully!");

        setDeleteModalOpen(false);
        setHostelToDelete(null);
    } catch (error) {
        console.error("DELETE ERROR:", error);

        toast.error(
            error.response?.data?.message ||
            "Failed to delete hostel."
        );
    }
};

if (loading) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <p className="text-gray-500">
                Loading your hostels...
            </p>
        </div>
    );
}

return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">

        <div className="mx-auto max-w-7xl">

            {/* Header */}
            <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                <div>
                    <p className="mb-2 text-sm font-medium text-blue-600">
                        HOSTEL MANAGEMENT
                    </p>

                    <h1 className="text-3xl font-bold text-gray-900">
                        My Hostels
                    </h1>

                    <p className="mt-2 max-w-xl text-gray-500">
                        Manage your registered hostels and track their
                        approval status.
                    </p>
                </div>

                <button
                    onClick={() =>
                        navigate("/hostel-registration/create")
                    }
                    className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
                >
                    + Register New Hostel
                </button>

            </div>

            {/* Statistics */}
            <div className="mb-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

                <StatisticsCard
                    title="Total Hostels"
                    value={statistics.total}
                    color="text-blue-600"
                    icon=""
                />

                <StatisticsCard
                    title="Approved"
                    value={statistics.approved}
                    color="text-green-600"
                    icon=""
                />

                <StatisticsCard
                    title="Pending Review"
                    value={statistics.pending}
                    color="text-yellow-500"
                    icon=""
                />

                <StatisticsCard
                    title="Rejected"
                    value={statistics.rejected}
                    color="text-red-600"
                    icon=""
                />

            </div>

            {/* Search and Filter */}
            <div className="mb-8 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

                <div className="flex flex-col gap-5 lg:flex-row lg:items-center">

                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search your hostel..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-5 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                        />
                    </div>

                    <StatusFilter
                        value={status}
                        onChange={setStatus}
                    />

                </div>

            </div>

            {/* Hostel Cards */}
            {displayHostels.length > 0 ? (

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

                    {displayHostels.map((hostel) => {

                        const firstImage =
                            hostel.images?.[0]?.image_url;

                        return (

                            <div
                                key={hostel.id}
                                className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                            >

                                {/* Image */}
                                <div className="relative h-52 overflow-hidden bg-gray-100">

                                    {firstImage ? (
                                        <img
                                            src={firstImage}
                                            alt={hostel.hostel_name}
                                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-gray-400">
                                            No image available
                                        </div>
                                    )}

                                    {/* Status */}
                                    <div className="absolute right-4 top-4">

                                        <span
                                            className={`rounded-full px-4 py-2 text-xs font-semibold capitalize ${
                                                hostel.status === "approved"
                                                    ? "bg-green-100 text-green-700"
                                                    : hostel.status === "pending"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : "bg-red-100 text-red-700"
                                            }`}
                                        >
                                            {hostel.status}
                                        </span>

                                    </div>

                                </div>

                                {/* Content */}
                                <div className="p-5">

                                    <div className="mb-5">

                                        <h2 className="text-xl font-bold text-gray-900">
                                            {hostel.hostel_name}
                                        </h2>

                                        <p className="mt-2 text-sm text-gray-500">
                                            {hostel.street}, {hostel.ward}
                                        </p>

                                        <p className="mt-1 text-sm text-gray-500">
                                            {hostel.district}, {hostel.region}
                                        </p>

                                    </div>

                                    <div className="mb-6 flex items-center justify-between">

                                        <span className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium capitalize text-blue-700">
                                            {hostel.hostel_type}
                                        </span>

                                        {hostel.images?.length > 0 && (
                                            <span className="text-sm text-gray-500">
                                                {hostel.images.length} photos
                                            </span>
                                        )}

                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-3 border-t pt-4">

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleEditClick(hostel)
                                            }
                                            className="flex-1 rounded-xl border border-blue-200 px-4 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDeleteClick(hostel)
                                            }
                                            className="flex-1 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </div>

                            </div>
                        );
                    })}

                </div>

            ) : (

                <EmptyState
                    title="No hostels found"
                    message="You have not registered any hostel yet."
                />

            )}

            {/* Pagination */}
            <div className="mt-8">
                <Pagination
                    currentPage={currentPage}
                    lastPage={pagination.lastPage}
                    onPageChange={loadHostels}
                />
            </div>

        </div>

        {/* Delete Confirmation */}
        <ConfirmModal
            isOpen={deleteModalOpen}
            title="Delete Hostel"
            message={`Are you sure you want to delete "${hostelToDelete?.hostel_name}"?`}
            confirmText="Delete"
            cancelText="Cancel"
            onCancel={() => {
                setDeleteModalOpen(false);
                setHostelToDelete(null);
            }}
            onConfirm={handleDeleteHostel}
        />

    </div>
);


}
