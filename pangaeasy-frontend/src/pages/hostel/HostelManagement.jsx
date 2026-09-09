import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import hostelService from "../../services/hostelService";
import HostelTable from "../../components/hostel/HostelTable";
import HostelModal from "../../components/hostel/HostelModal";
import HostelForm from "../../components/hostel/HostelForm";
import EmptyState from "../../components/hostel/EmptyState";
import ConfirmModal from "../../components/common/ConfirmModal";
import StatusFilter from "../../components/common/StatusFilter";
import Pagination from "../../components/common/Pagination";
import SortSelect from "../../components/common/SortSelect";

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

    const sortOptions = [
        { label: "Newest", value: "newest" },
        { label: "Oldest", value: "oldest" },
        { label: "A - z", value: "asc" },
        { label: "Z - A", value: "desc" },
    ];

    const loadHostels = async (page = 1) => {
        try {
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

    useEffect(() => {
        loadHostels();
    }, []);

    const displayHostels = hostels.filter((hostel) => {
        const matchSearch = hostel.hostel_name.toLowerCase().includes(search.toLowerCase());
        const matchStatus = status === "all" || hostel.status === status;
        return matchSearch && matchStatus;
    });

    const sortedHostels = [...displayHostels].sort((a, b) => {
        switch (sort) {
            case "asc": return a.hostel_name.localeCompare(b.hostel_name);
            case "desc": return b.hostel_name.localeCompare(a.hostel_name);
            case "oldest": return a.id - b.id;
            default: return b.id - a.id;
        }
    });

    const handleCreateHostel = async (data) => {
        try {
            await hostelService.create(data);
            await loadHostels();
            toast.success("Hostel created successfully!.");
            setOpenModal(false);
        } catch (error) {
            if (error.response?.status !== 422) toast.error("Something went wrong.");
            throw error;
        }
    };

    const handleEditClick = (hostel) => {
        setSelectedHostel(hostel);
        setIsEditing(true);
        setOpenModal(true);
    };

    const handleUpdateHostel = async (data) => {
        try {
            await hostelService.update(selectedHostel.id, data);
            await loadHostels();
            toast.success("Hostel updated successfully!.");
            setOpenModal(false);
            setIsEditing(false);
            setSelectedHostel(null);
        } catch (error) {
            if (error.response?.status !== 422) toast.error("Something went wrong.");
            throw error;
        }
    };

    const handleDeleteHostel = async () => {
        try {
            await hostelService.delete(hostelToDelete.id);
            await loadHostels();
            toast.success("Hostel deleted successfully!.");
            setDeleteModalOpen(false);
            setHostelToDelete(null);
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div className="rounded-2xl bg-white p-10 text-center text-slate-500 shadow-sm ring-1 ring-[#eee6c7]">Loading hostels...</div>;

    return (
        <div className="mx-auto max-w-[1500px]">
            <div className="mb-9 flex flex-col gap-5 border-b border-[#eee6c7] pb-8 sm:flex-row sm:items-end sm:justify-between">
                <div className="max-w-2xl">
                    <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[#b27a00]">Property directory</p>
                    <h1 className="text-3xl font-black tracking-[-0.05em] text-slate-950 sm:text-4xl">Hostels</h1>
                    <p className="mt-3 text-base leading-7 text-slate-600">Manage registered properties, review details, and keep your portfolio organized.</p>
                </div>
                <button onClick={() => setOpenModal(true)} className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#FDBF2D] px-5 py-3 font-bold text-slate-950 shadow-[0_10px_22px_rgba(253,191,45,0.24)] transition hover:bg-[#FAF92A]">
                    <span className="mr-2 text-lg leading-none">+</span> Add Hostel
                </button>
            </div>

            <div className="mb-5 rounded-2xl bg-white p-4 shadow-[0_8px_24px_rgba(67,53,0,0.06)] ring-1 ring-[#eee6c7] sm:p-5">
                <input type="text" placeholder="Search hostel by name..." value={search} onChange={(event) => setSearch(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#FDBF2D] focus:bg-white focus:ring-4 focus:ring-[#FAF92A]/30" />
            </div>
            <div className="mb-8 flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-[0_8px_24px_rgba(67,53,0,0.06)] ring-1 ring-[#eee6c7] sm:flex-row sm:flex-wrap sm:items-center sm:p-5">
                <StatusFilter value={status} onChange={setStatus} />
                <SortSelect value={sort} onChange={setSort} options={sortOptions} />
            </div>

            {sortedHostels.length > 0 ? <HostelTable hostels={sortedHostels} onEdit={handleEditClick} onDelete={(hostel) => { setHostelToDelete(hostel); setDeleteModalOpen(true); }} /> : <EmptyState title="No hostels found" message="There are no hostels matching your search." />}
            <Pagination currentPage={currentPage} lastPage={pagination.lastPage} onPageChange={loadHostels} />
            <HostelModal isOpen={openModal} onClose={() => { setOpenModal(false); setIsEditing(false); setSelectedHostel(null); }} title={isEditing ? "Edit Hostel" : "Create Hostel"}>
                <HostelForm initialData={selectedHostel} buttonText={isEditing ? "Update Hostel" : "Save Hostel"} onSubmit={isEditing ? handleUpdateHostel : handleCreateHostel} />
            </HostelModal>
            <ConfirmModal isOpen={deleteModalOpen} title="Delete Hostel" message={`Are you sure you want to delete "${hostelToDelete?.hostel_name}"?`} confirmText="Delete" cancelText="Cancel" onCancel={() => { setDeleteModalOpen(false); setHostelToDelete(null); }} onConfirm={handleDeleteHostel} />
        </div>
    );
}
