import { useEffect, useState } from "react";
import hostelService from "../../services/hostelService";
import HostelTable from "../../components/hostel/HostelTable";
import HostelModal from "../../components/hostel/HostelModal";
import HostelForm from "../../components/hostel/HostelForm";
import EmptyState from "../../components/hostel/EmptyState";
import ConfirmModal from "../../components/common/ConfirmModal";
import { toast } from "react-toastify";
import StatisticsCard from "../../components/dashboard/StatisticsCard";
import StatusFilter from "../../components/common/StatusFilter";
import Pagination from "../../components/common/Pagination";
import SortSelect from "../../components/common/SortSelect";
import OwnerRequests from "./OwnerRequests";
import { useNavigate } from "react-router-dom";

export default function HostelManagement() {
    const [hostels, setHostels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [search, setSearch] = useState("");
    const [selectedHostel, setSelectedHostel] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
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
    const [activeTab, setActiveTab] = useState("hostels");
    const navigate = useNavigate();

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
            label: "A - z",
            value: "asc",
        },
        {
            label: "Z - A",
            value: "desc",
        },
    ]

    const handleCreateHostel = async (data) => {
        try {
            await hostelService.create(data); // this calls a POST /api/v1/hostels and sends data of form
            await loadHostels(); // refreshes the browser
            await loadStatistics();
            toast.success("Hostel created successfully!.");
            setOpenModal(false); // closes the modal after success

        } catch (error) {
            
            if(error.response?.status !== 422) {
                toast.error("Something went wrong.");
            }
            throw error;
        }
    }


    const loadHostels = async (page = 1) => {
        try{
            setCurrentPage(page);
            const response = await hostelService.getAll(page);
            setHostels(response.data.data.data);
            setPagination({
                currentPage: response.data.data.currentPage,
                lastPage: response.data.data.last_page,
                total: response.data.data.total,
            });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
        
    };

    const displayHostels = hostels.filter((hostel) => {
        const matchSearch = 
            hostel.hostel_name
            .toLowerCase()
            .includes(search.toLowerCase());

        const matchStatus = 
            status === "all" ||
            hostel.status === status;

        return matchSearch && matchStatus;
    });

    {/**
        sorting functionality or logic */}
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
        setSelectedHostel(hostel);
        setIsEditing(true);
        setOpenModal(true);
    };

    const handleUpdateHostel = async (data) => {
        try {
            await hostelService.update(selectedHostel.id, data);
            await loadHostels();
            await loadStatistics();
            toast.success("Hostel updated successfully!.");
            setOpenModal(false);
            setIsEditing(false);
            setSelectedHostel(null);
        } catch (error) {
            if(error.response?.status !== 422) {
                toast.error("Something went wrong.");
            }
            throw error;
        }
    };

    const handleDeleteHostel = async () => {
        try {
            await hostelService.delete(hostelToDelete.id);
            await loadHostels();
            await loadStatistics();
            toast.success("Hostel deleted successfully!.");
            setDeleteModalOpen(false);
            setHostelToDelete(null);
        } catch (error) {
            console.error(error);
        }
    }

    {/**
        the loading statistics function */}

    const loadStatistics = async () => {
        try {
            const response = await hostelService.statistics();
            console.log("Statistics Response:", response);
            setStatistics(response.data.data);
        } catch (error) {
            console.log("STATISTICS ERROR:", error.response);
            //console.error(error);
        }
    }

    {/* useEffect */}

    useEffect(() => {
        loadHostels();
        loadStatistics();

    }, []);

    const handleDeleteClick = (hostel) => {
        setHostelToDelete(hostel);
        setDeleteModalOpen(true);
    };


    if (loading) {
        return <h2>Loading hostels....</h2>;
    }

    console.log(statistics);

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="mb-6 text-3xl font-bold">Hostel Management</h1>
                    <p className="text-gray-500">Manage all registered hostels</p>
                    
                </div>

                 
                <button onClick={() => setOpenModal(true)}
                    className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700">
                        + Add Hostel
                    </button>
                
            </div>

            {activeTab === "hostels" ? (
                <>
                    <div className="mb-6 flex gap-3">
                <button 
                    onClick={() => setActiveTab("hostels")}
                    className={`rounded-lg px-5 py-3 font-medium ${activeTab === "hostels" ? "bg-blue-600 text-white" : "bg-white text-gray-700"}`}
                >
                    Hostels
                </button>

                <button 
                    onClick={() => navigate("/admin/owner-request")}
                    className={`rounded-lg px-5 py-3 font-medium ${activeTab === "requests" ? "bg-blue-600 text-white" : "bg-white text-gray-700"}`}
                >
                    Requests
                </button>

                <button
                    onClick={() => navigate("/admin/apartments")}
                    className="rounded-lg bg-white px-5 py-3 font-medium text-gray-700 hover:bg-gray-50"
                >
                    Apartments
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
                    placeholder="Search hostel by name.."
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

            

            {   
                sortedHostels.length > 0 ? (
                    <HostelTable hostels={sortedHostels} onEdit={handleEditClick} onDelete={handleDeleteClick}></HostelTable>
                ) : (
                    <EmptyState
                        title="No hostels found"
                        message="There are no hostels matching your search."
                    />
                )
            }  

            <Pagination
                currentPage={currentPage}
                lastPage={pagination.lastPage}
                onPageChange={loadHostels}
            />         
            <HostelModal isOpen={openModal}
                        onClose={() => {

                            setOpenModal(false);
                            setIsEditing(false);
                            setSelectedHostel(null);
                            }}
                            title="Create Hostel">
                            <HostelForm 
                                initialData={selectedHostel}
                                buttonText={isEditing ? "Update Hostel" : "Save Hostel"}
                            onSubmit={
                                isEditing
                                    ? handleUpdateHostel
                                    : handleCreateHostel
                            } />
            </HostelModal>

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
                </>
            ) : (
                <OwnerRequests />
            )}
        </div>
    );
}