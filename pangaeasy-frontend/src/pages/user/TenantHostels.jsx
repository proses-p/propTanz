import { useEffect, useState } from "react";
import { FiArrowLeft, FiChevronLeft, FiChevronRight, FiHome, FiMapPin, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import hostelService from "../../services/hostelService";

const statusStyles = {
    approved: "bg-emerald-100 text-emerald-700",
    pending: "bg-amber-100 text-amber-700",
    rejected: "bg-rose-100 text-rose-700",
};

function getLocation(hostel) {
    return [hostel.region, hostel.district, hostel.ward, hostel.street]
        .filter(Boolean)
        .join(", ");
}

function getPageNumbers(currentPage, lastPage) {
    if (lastPage <= 7) {
        return Array.from({ length: lastPage }, (_, index) => index + 1);
    }

    const pages = new Set([1, lastPage, currentPage, currentPage - 1, currentPage + 1]);
    return Array.from(pages)
        .filter((page) => page > 0 && page <= lastPage)
        .sort((first, second) => first - second)
        .reduce((result, page, index, allPages) => {
            if (index > 0 && page - allPages[index - 1] > 1) result.push("...");
            result.push(page);
            return result;
        }, []);
}

export default function TenantHostels() {
    const navigate = useNavigate();
    const [hostels, setHostels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedHostel, setSelectedHostel] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [detailsError, setDetailsError] = useState("");
    const [pagination, setPagination] = useState({
        currentPage: 1,
        lastPage: 1,
        total: 0,
    });

    useEffect(() => {
        let mounted = true;

        async function loadHostels() {
            setLoading(true);
            setError("");

            try {
                const response = await hostelService.getAll(pagination.currentPage);
                const page = response.data?.data;
                const items = Array.isArray(page) ? page : page?.data;

                if (mounted) {
                    setHostels(Array.isArray(items) ? items : []);
                    setPagination((currentPagination) => ({
                        ...currentPagination,
                        currentPage: page?.current_page || currentPagination.currentPage,
                        lastPage: page?.last_page || 1,
                        total: page?.total || 0,
                    }));
                }
            } catch (requestError) {
                if (mounted) {
                    setError(requestError.response?.data?.message || "Unable to load hostels.");
                }
            } finally {
                if (mounted) setLoading(false);
            }
        }

        loadHostels();
        return () => {
            mounted = false;
        };
    }, [pagination.currentPage]);

    const pageNumbers = getPageNumbers(pagination.currentPage, pagination.lastPage);

    async function handleViewDetails(hostelId) {
        setSelectedHostel(null);
        setDetailsError("");
        setDetailsLoading(true);

        try {
            const response = await hostelService.get(hostelId);
            const hostel = response.data?.data?.data || response.data?.data;
            setSelectedHostel(hostel);
        } catch (requestError) {
            setDetailsError(requestError.response?.data?.message || "Unable to load hostel details.");
        } finally {
            setDetailsLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-12">
                <button
                    type="button"
                    onClick={() => navigate("/dashboard")}
                    className="mb-8 flex w-fit items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100"
                >
                    <FiArrowLeft size={18} aria-hidden="true" />
                    Back to dashboard
                </button>

                <header className="mb-10">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-emerald-600">
                        Tenant search
                    </p>
                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Find your next hostel
                    </h1>
                    <p className="mt-3 max-w-2xl text-base leading-7 text-slate-500">
                        Browse hostels currently available on PangaEasy.
                    </p>
                </header>

                {loading && (
                    <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                        <p className="text-slate-500">Loading hostels...</p>
                    </div>
                )}

                {!loading && error && (
                    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-10 text-center">
                        <h2 className="text-xl font-semibold text-rose-900">Unable to load hostels</h2>
                        <p className="mt-2 text-rose-700">{error}</p>
                    </div>
                )}

                {!loading && !error && hostels.length === 0 && (
                    <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                        <FiHome className="mx-auto text-emerald-600" size={34} aria-hidden="true" />
                        <h2 className="mt-4 text-xl font-semibold">No hostels available yet</h2>
                        <p className="mt-2 text-slate-500">Please check back later for new listings.</p>
                    </div>
                )}

                {!loading && !error && hostels.length > 0 && (
                    <>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {hostels.map((hostel) => {
                            const status = String(hostel.status || "unknown").toLowerCase();
                            const location = getLocation(hostel);

                            return (
                                <article
                                    key={hostel.id}
                                    className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                                >
                                    <div className="flex h-32 items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-blue-50 text-emerald-600">
                                        <FiHome size={42} aria-hidden="true" />
                                    </div>
                                    <div className="flex flex-1 flex-col p-6">
                                        <div className="flex items-start justify-between gap-3">
                                            <h2 className="text-xl font-bold text-slate-900">{hostel.hostel_name}</h2>
                                            <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles[status] || "bg-slate-100 text-slate-600"}`}>
                                                {status}
                                            </span>
                                        </div>
                                        <p className="mt-3 flex items-start gap-2 text-sm text-slate-500">
                                            <FiMapPin className="mt-0.5 shrink-0 text-emerald-600" aria-hidden="true" />
                                            <span>{location || "Location not provided"}</span>
                                        </p>
                                        <p className="mt-5 line-clamp-3 text-sm leading-6 text-slate-600">
                                            {hostel.description || "No description provided."}
                                        </p>
                                        <p className="mt-auto pt-6 text-sm font-medium text-slate-500">
                                            Type: <span className="capitalize text-slate-800">{hostel.hostel_type || "Not specified"}</span>
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => handleViewDetails(hostel.id)}
                                            className="mt-5 w-full rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-100"
                                        >
                                            View details
                                        </button>
                                    </div>
                                </article>
                            );
                            })}
                        </div>

                        {pagination.lastPage > 1 && (
                            <nav className="mt-10 flex flex-wrap items-center justify-center gap-2" aria-label="Hostel pages">
                                <button
                                    type="button"
                                    disabled={pagination.currentPage === 1}
                                    onClick={() => setPagination((currentPagination) => ({ ...currentPagination, currentPage: currentPagination.currentPage - 1 }))}
                                    className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-emerald-300 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <FiChevronLeft size={17} aria-hidden="true" />
                                    Previous
                                </button>

                                {pageNumbers.map((page, index) => page === "..." ? (
                                    <span key={`ellipsis-${index}`} className="px-1 text-slate-400" aria-hidden="true">...</span>
                                ) : (
                                    <button
                                        type="button"
                                        key={page}
                                        onClick={() => setPagination((currentPagination) => ({ ...currentPagination, currentPage: page }))}
                                        aria-current={pagination.currentPage === page ? "page" : undefined}
                                        className={`h-10 min-w-10 rounded-lg border px-3 text-sm font-semibold transition focus:outline-none focus:ring-4 focus:ring-emerald-100 ${pagination.currentPage === page ? "border-emerald-600 bg-emerald-600 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:text-emerald-700"}`}
                                    >
                                        {page}
                                    </button>
                                ))}

                                <button
                                    type="button"
                                    disabled={pagination.currentPage === pagination.lastPage}
                                    onClick={() => setPagination((currentPagination) => ({ ...currentPagination, currentPage: currentPagination.currentPage + 1 }))}
                                    className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-emerald-300 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Next
                                    <FiChevronRight size={17} aria-hidden="true" />
                                </button>
                            </nav>
                        )}
                    </>
                )}
            </div>

            {(detailsLoading || detailsError || selectedHostel) && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-5 backdrop-blur-sm"
                    role="presentation"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            setSelectedHostel(null);
                            setDetailsError("");
                        }
                    }}
                >
                    <div
                        className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="hostel-details-title"
                    >
                        <div className="mb-7 flex items-start justify-between gap-4">
                            <div>
                                <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-emerald-600">Hostel details</p>
                                <h2 id="hostel-details-title" className="text-2xl font-bold tracking-tight">
                                    {selectedHostel?.hostel_name || "Hostel details"}
                                </h2>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedHostel(null);
                                    setDetailsError("");
                                }}
                                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                aria-label="Close hostel details"
                            >
                                <FiX size={21} aria-hidden="true" />
                            </button>
                        </div>

                        {detailsLoading && <p className="py-8 text-center text-slate-500">Loading hostel details...</p>}

                        {!detailsLoading && detailsError && (
                            <div className="rounded-xl bg-rose-50 p-5 text-center text-rose-700">
                                {detailsError}
                            </div>
                        )}

                        {!detailsLoading && !detailsError && selectedHostel && (
                            <div className="space-y-5">
                                <div className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 p-4">
                                    <span className="text-sm font-medium text-slate-500">Status</span>
                                    <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles[String(selectedHostel.status || "unknown").toLowerCase()] || "bg-slate-100 text-slate-600"}`}>
                                        {selectedHostel.status || "Unknown"}
                                    </span>
                                </div>
                                <dl className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Type</dt>
                                        <dd className="mt-1 capitalize text-slate-800">{selectedHostel.hostel_type || "Not specified"}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Location</dt>
                                        <dd className="mt-1 text-slate-800">{getLocation(selectedHostel) || "Not provided"}</dd>
                                    </div>
                                    {selectedHostel.landmark && (
                                        <div>
                                            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Landmark</dt>
                                            <dd className="mt-1 text-slate-800">{selectedHostel.landmark}</dd>
                                        </div>
                                    )}
                                </dl>
                                <div>
                                    <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Description</h3>
                                    <p className="mt-2 leading-7 text-slate-600">{selectedHostel.description || "No description provided."}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
