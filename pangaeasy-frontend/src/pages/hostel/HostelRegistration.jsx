import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import hostelService from "../../services/hostelService";
import HostelTable from "../../components/hostel/HostelTable";
import EmptyState from "../../components/hostel/EmptyState";
import ConfirmModal from "../../components/common/ConfirmModal";
import { toast } from "react-toastify";
import StatisticsCard from "../../components/dashboard/StatisticsCard";
import StatusFilter from "../../components/common/StatusFilter";
import Pagination from "../../components/common/Pagination";
import SortSelect from "../../components/common/SortSelect";

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
    const [sort, setSort] = useState("newest");

    const [statistics, setStatistics] = useState({
        total: 0,
        approved: 0,
        pending: 0,
        rejected: 0,
    });

    const sortOptions = [
        {
            label: "Newest",
            value: "newest",
        },
        {
            label: "Oldest",
            value: "oldest",
        },
        {
            label: "A - Z",
            value: "asc",
        },
        {
            label: "Z - A",
            value: "desc",
        },
    ];

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
            .toLowerCase()
            .includes(search.toLowerCase());

        const matchStatus =
            status === "all" ||
            hostel.status === status;

        return matchSearch && matchStatus;
    });

    const sortedHostels = [...displayHostels].sort((a, b) => {
        switch (sort) {
            case "asc":
                return a.hostel_name.localeCompare(b.hostel_name);

            case "desc":
                return b.hostel_name.localeCompare(a.hostel_name);

            case "oldest":
                return a.id - b.id;

            case "newest":
            default:
                return b.id - a.id;
        }
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
        return <h2 className="p-8">Loading hostels...</h2>;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold">
                        My Hostels
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Register and manage your hostels.
                    </p>
                </div>

                <button
                    onClick={() =>
                        navigate("/hostel-registration/create")
                    }
                    className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
                >
                    + Register New Hostel
                </button>
            </div>

            <div className="mb-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
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
                    title="Pending"
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

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search hostel by name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="mb-6 flex flex-wrap gap-5">
                <StatusFilter
                    value={status}
                    onChange={setStatus}
                />

                <SortSelect
                    value={sort}
                    onChange={setSort}
                    options={sortOptions}
                />
            </div>

            {sortedHostels.length > 0 ? (
                <HostelTable
                    hostels={sortedHostels}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                />
            ) : (
                <EmptyState
                    title="No hostels found"
                    message="There are no hostels matching your search."
                />
            )}

            <Pagination
                currentPage={currentPage}
                lastPage={pagination.lastPage}
                onPageChange={loadHostels}
            />

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