import { useEffect, useState } from "react";
import { FiCheck, FiPlus, FiSearch, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import apartmentService from "../../services/apartmentService";

const statusClasses = {
    Pending: "bg-amber-100 text-amber-800",
    Approved: "bg-emerald-100 text-emerald-800",
    Rejected: "bg-red-100 text-red-800",
};

export default function AdminApartmentManagement() {
    const navigate = useNavigate();
    const [apartments, setApartments] = useState([]);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");
    const [loading, setLoading] = useState(true);
    const [busyId, setBusyId] = useState(null);

    const loadApartments = async () => {
        try {
            setLoading(true);
            const response = await apartmentService.getAll();
            setApartments(response.data.data.data || []);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load apartments.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadApartments();
    }, []);

    const updateStatus = async (apartment, action) => {
        try {
            setBusyId(apartment.id);
            if (action === "approve") {
                await apartmentService.approve(apartment.id);
                toast.success("Apartment approved successfully.");
            } else {
                const reason = window.prompt("Reason for rejection (optional):", "");
                if (reason === null) return;
                await apartmentService.reject(apartment.id, { rejected_reason: reason });
                toast.success("Apartment rejected successfully.");
            }
            await loadApartments();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update apartment request.");
        } finally {
            setBusyId(null);
        }
    };

    const visibleApartments = apartments.filter((apartment) => {
        const query = search.toLowerCase();
        const matchesSearch = [apartment.name, apartment.street, apartment.town, apartment.address]
            .some((value) => value?.toLowerCase().includes(query));
        return matchesSearch && (status === "all" || (apartment.status || "Pending") === status);
    });

    return (
        <div className="min-h-screen bg-slate-50 px-5 py-8 text-slate-900 sm:px-8 lg:py-12">
            <div className="mx-auto max-w-7xl">
                <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-600">Admin management</p>
                        <h1 className="text-3xl font-bold tracking-tight">Apartment requests</h1>
                        <p className="mt-2 text-slate-500">Review, confirm, reject and add apartment listings.</p>
                    </div>
                    <button type="button" onClick={() => navigate("/apartments/create")} className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm hover:bg-blue-700">
                        <FiPlus /> Add apartment
                    </button>
                </header>

                <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row">
                    <div className="flex flex-1 items-center gap-3">
                        <FiSearch className="text-slate-400" />
                        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search apartments" className="w-full outline-none" />
                    </div>
                    <select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
                        <option value="all">All statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>

                {loading ? (
                    <div className="rounded-2xl bg-white p-10 text-center text-slate-500 shadow-sm">Loading apartment requests...</div>
                ) : visibleApartments.length ? (
                    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <table className="min-w-full">
                            <thead className="bg-slate-50">
                                <tr>{["Apartment", "Location", "Status", "Actions"].map((heading) => <th key={heading} className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">{heading}</th>)}</tr>
                            </thead>
                            <tbody>
                                {visibleApartments.map((apartment) => {
                                    const apartmentStatus = apartment.status || "Pending";
                                    const isBusy = busyId === apartment.id;
                                    return (
                                        <tr key={apartment.id} className="border-t border-slate-100 hover:bg-slate-50">
                                            <td className="px-5 py-4"><p className="font-semibold">{apartment.name}</p><p className="mt-1 max-w-md text-sm text-slate-500">{apartment.description}</p></td>
                                            <td className="px-5 py-4 text-sm text-slate-600">{apartment.street}, {apartment.town}</td>
                                            <td className="px-5 py-4"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[apartmentStatus] || statusClasses.Pending}`}>{apartmentStatus}</span>{apartment.rejected_reason && <p className="mt-2 max-w-xs text-xs text-red-600">{apartment.rejected_reason}</p>}</td>
                                            <td className="px-5 py-4"><div className="flex items-center gap-2"><button type="button" onClick={() => updateStatus(apartment, "approve")} disabled={isBusy || apartmentStatus === "Approved"} className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40" title="Approve apartment"><FiCheck /> Confirm</button><button type="button" onClick={() => updateStatus(apartment, "reject")} disabled={isBusy || apartmentStatus === "Rejected"} className="flex items-center gap-1 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40" title="Reject apartment"><FiX /> Reject</button></div></td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm"><h2 className="text-xl font-bold">No apartment requests found</h2><p className="mt-2 text-slate-500">New apartment listings will appear here.</p></div>}
            </div>
        </div>
    );
}