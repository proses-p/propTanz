import { useEffect, useState } from "react";
import { FiPlus, FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import apartmentService from "../../services/apartmentService";
import ApartmentTable from "../../components/apartment/ApartmentTable";
import ConfirmModal from "../../components/common/ConfirmModal";

export default function ApartmentManagement() {
    const navigate = useNavigate();
    const [apartments, setApartments] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({});
    const [apartmentToDelete, setApartmentToDelete] = useState(null);

    const loadApartments = async (requestedPage = 1) => {
        try {
            setLoading(true);
            const response = await apartmentService.getAll(requestedPage);
            const paginator = response.data.data;
            setApartments(paginator.data || []);
            setPage(paginator.current_page || requestedPage);
            setPagination(paginator);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load apartments.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const load = async () => {
            await loadApartments();
        };
        load();
    }, []);

    const filteredApartments = apartments.filter((apartment) => {
        const query = search.toLowerCase();
        return [apartment.name, apartment.street, apartment.town, apartment.address]
            .some((value) => value?.toLowerCase().includes(query));
    });

    const deleteApartment = async () => {
        if (!apartmentToDelete) return;
        try {
            await apartmentService.delete(apartmentToDelete.id);
            toast.success("Apartment deleted successfully.");
            setApartmentToDelete(null);
            await loadApartments(page);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete apartment.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 px-5 py-8 text-slate-900 sm:px-8 lg:py-12">
            <div className="mx-auto max-w-7xl">
                <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-600">Apartment management</p>
                        <h1 className="text-3xl font-bold tracking-tight">Apartments</h1>
                        <p className="mt-2 text-slate-500">Add, view, edit and remove your apartment listings.</p>
                    </div>
                    <button type="button" onClick={() => navigate("/apartments/create")} className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm hover:bg-blue-700">
                        <FiPlus /> Add apartment
                    </button>
                </header>

                <div className="mb-6 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <FiSearch className="text-slate-400" />
                    <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by apartment or location" className="w-full outline-none" />
                </div>

                {loading ? (
                    <div className="rounded-2xl bg-white p-10 text-center text-slate-500 shadow-sm">Loading apartments...</div>
                ) : filteredApartments.length ? (
                    <ApartmentTable
                        apartments={filteredApartments}
                        onView={(apartment) => navigate(`/apartments/${apartment.id}`)}
                        onEdit={(apartment) => navigate(`/apartments/${apartment.id}/edit`)}
                        onDelete={setApartmentToDelete}
                    />
                ) : (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
                        <h2 className="text-xl font-bold">No apartments found</h2>
                        <p className="mt-2 text-slate-500">Create your first apartment listing to see it here.</p>
                    </div>
                )}

                {pagination.last_page > 1 && (
                    <div className="mt-6 flex items-center justify-between rounded-xl bg-white p-4 text-sm shadow-sm">
                        <span className="text-slate-500">Page {pagination.current_page} of {pagination.last_page}</span>
                        <div className="flex gap-2">
                            <button disabled={page <= 1} onClick={() => loadApartments(page - 1)} className="rounded-lg border px-3 py-2 disabled:opacity-40">Previous</button>
                            <button disabled={page >= pagination.last_page} onClick={() => loadApartments(page + 1)} className="rounded-lg border px-3 py-2 disabled:opacity-40">Next</button>
                        </div>
                    </div>
                )}
            </div>

            <ConfirmModal
                isOpen={Boolean(apartmentToDelete)}
                title="Delete Apartment"
                message={`Are you sure you want to delete "${apartmentToDelete?.name}"?`}
                confirmText="Delete"
                cancelText="Cancel"
                onCancel={() => setApartmentToDelete(null)}
                onConfirm={deleteApartment}
            />
        </div>
    );
}