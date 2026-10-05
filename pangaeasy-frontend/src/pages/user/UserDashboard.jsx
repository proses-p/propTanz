import { useEffect, useMemo, useState } from "react";
import { FiArrowRight, FiCalendar, FiCheckCircle, FiHome, FiLogOut, FiMapPin, FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import apartmentService from "../../services/apartmentService";
import Navbar from "../../components/common/Navbar";
import Sidebar from "../../components/common/Sidebar";
import useAuth from "../../hooks/useAuth";

const bookingStatusStyles = {
    pending: "bg-amber-100 text-amber-700",
    approved: "bg-emerald-100 text-emerald-700",
    confirmed: "bg-emerald-100 text-emerald-700",
    rejected: "bg-rose-100 text-rose-700",
};

const bookingStatusLabel = {
    pending: "Pending",
    approved: "Approved",
    confirmed: "Confirmed",
    rejected: "Rejected",
};

export default function UserDashboard() {
    const [bookings, setBookings] = useState([]);
    const navigate = useNavigate();
    const { loading: authLoading, isAuthenticated, logout } = useAuth();

    const approvedApartmentBooking = useMemo(() => (
        [...bookings]
            .filter((booking) => ["approved", "confirmed"].includes(String(booking.status || "").toLowerCase()))
            .sort((a, b) => new Date(b.updated_at || b.created_at || 0) - new Date(a.updated_at || a.created_at || 0))[0]
    ), [bookings]);

    useEffect(() => {
        if (authLoading || !isAuthenticated) return;

        const loadBookings = async () => {
            try {
                const response = await apartmentService.getBookings();
                setBookings(response.data.data || []);
            } catch {
                setBookings([]);
            }
        };
        loadBookings();
    }, [authLoading, isAuthenticated]);

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 lg:flex">
            <Sidebar />
            <div className="min-w-0 flex-1">
                <Navbar />
                <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:py-12">
                <div className="mb-6 flex items-center justify-end">
                    <div className="flex items-center gap-2">
                        <button type="button" onClick={() => navigate("/profile")} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50">
                            <FiUser /> Profile
                        </button>
                        <button type="button" onClick={handleLogout} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50">
                            <FiLogOut /> Logout
                        </button>
                    </div>
                </div>
                <header className="mb-10 max-w-2xl">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-600">
                        User dashboard
                    </p>
                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        What would you like to do today?
                    </h1>
                    <p className="mt-3 text-base leading-7 text-slate-500">
                        Choose a property option to get started with your next step.
                    </p>
                </header>

                <div className="grid gap-5 md:grid-cols-2">
                    <button
                        type="button"
                        onClick={() => navigate("/hostels/tenant")}
                        className="group flex w-full flex-col rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-100 sm:p-7"
                    >
                        <span className="mb-8 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <FiHome size={28} aria-hidden="true" />
                        </span>
                        <span className="flex items-center justify-between gap-4">
                            <span>
                                <span className="block text-xl font-bold">Hostels</span>
                                <span className="mt-2 block text-sm leading-6 text-slate-500">Browse hostel listings and find your next place to stay.</span>
                            </span>
                            <FiArrowRight className="shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600" size={22} aria-hidden="true" />
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/apartments/browse")}
                        className="group flex w-full flex-col rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-emerald-100 sm:p-7"
                    >
                        <span className="mb-8 flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                            <FiHome size={28} aria-hidden="true" />
                        </span>
                        <span className="flex items-center justify-between gap-4">
                            <span>
                                <span className="block text-xl font-bold">Apartments</span>
                                <span className="mt-2 block text-sm leading-6 text-slate-500">
                                    Explore apartment listings, view photos and send a quest.
                                </span>
                            </span>
                            <FiArrowRight className="shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-emerald-600" size={22} aria-hidden="true" />
                        </span>
                    </button>
                </div>

                {approvedApartmentBooking && (
                    <section className="mt-8 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-sm sm:p-7">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Apartment approval notice</p>
                                <h2 className="mt-2 text-2xl font-bold text-slate-900">Your apartment booking has been approved</h2>
                            </div>
                            <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">Confirmed</span>
                        </div>

                        <div className="mt-6 grid gap-5 lg:grid-cols-[1.4fr_0.8fr]">
                            <div className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Apartment profile</p>
                                        <h3 className="mt-2 text-xl font-bold text-slate-900">{approvedApartmentBooking.apartment?.name || `Apartment #${approvedApartmentBooking.apartment_id}`}</h3>
                                    </div>
                                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Approved</span>
                                </div>

                                <div className="mt-4 space-y-3 text-sm text-slate-600">
                                    <p className="flex items-center gap-2"><FiMapPin className="text-emerald-600" /> {approvedApartmentBooking.apartment?.address || approvedApartmentBooking.apartment?.street + ", " + approvedApartmentBooking.apartment?.town || "Location available in listing"}</p>
                                    <p className="flex items-center gap-2"><FiCalendar className="text-emerald-600" /> Move-in date: <strong className="text-slate-800">{approvedApartmentBooking.move_in_date || "Not specified"}</strong></p>
                                </div>

                                <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Access card</p>
                                    <div className="mt-3 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3">
                                        <div>
                                            <p className="text-xs text-slate-500">Unit key / access code</p>
                                            <p className="mt-1 text-lg font-black tracking-[0.22em] text-slate-900">APT-{String(approvedApartmentBooking.apartment_id || approvedApartmentBooking.id).padStart(4, "0")}</p>
                                        </div>
                                        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">Ready</span>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-emerald-200 bg-emerald-600 p-5 text-white shadow-sm">
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100">Status update</p>
                                <h3 className="mt-3 text-2xl font-black">Booking accepted</h3>
                                <p className="mt-3 text-sm leading-6 text-emerald-50">Your apartment request was approved. You can now proceed with the move-in plan and use the access code shown on your apartment card.</p>
                                <div className="mt-5 rounded-xl bg-white/10 p-3 text-sm">
                                    <p className="font-semibold">Apartment details</p>
                                    <p className="mt-2 text-emerald-50">{approvedApartmentBooking.apartment?.street || "Apartment street"}, {approvedApartmentBooking.apartment?.town || "Town"}</p>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7" aria-labelledby="booking-summary-title">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-emerald-600"><FiCalendar /> My bookings</p>
                            <h2 id="booking-summary-title" className="mt-2 text-2xl font-bold">Your apartment requests</h2>
                        </div>
                        {bookings.length > 0 && <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">{bookings.length} request{bookings.length > 1 ? "s" : ""}</span>}
                    </div>

                    {bookings.length ? <div className="mt-6 grid gap-3 sm:grid-cols-2">{bookings.map((booking) => {
                        const status = String(booking.status || "pending").toLowerCase();
                        const statusText = bookingStatusLabel[status] || "Pending";
                        const isApproved = status === "approved" || status === "confirmed";

                        return <div key={booking.id} className="rounded-xl border border-slate-200 p-4">
                            <div className="flex items-start justify-between gap-3"><div><h3 className="font-bold text-slate-900">{booking.apartment?.name || `Apartment #${booking.apartment_id}`}</h3><p className="mt-1 text-sm text-slate-500">{booking.apartment?.address || "Address available in listing"}</p></div><span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${bookingStatusStyles[status] || "bg-slate-100 text-slate-600"}`}>{statusText}</span></div>
                            <p className="mt-4 flex items-center gap-2 text-sm text-slate-600"><FiCalendar className="text-emerald-600" /> Move-in: <strong>{booking.move_in_date || "Not specified"}</strong></p>
                            {isApproved ? (
                                <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
                                    Your booking has been approved and confirmed. Please prepare for your move-in date.
                                </p>
                            ) : status === "pending" ? (
                                <p className="mt-3 text-sm text-amber-700">Waiting for approval from the property owner.</p>
                            ) : null}
                            {booking.message && <p className="mt-2 text-sm italic text-slate-500">“{booking.message}”</p>}
                        </div>;
                    })}</div> : <div className="mt-6 rounded-xl bg-slate-50 p-6 text-center"><FiCheckCircle className="mx-auto text-slate-300" size={30} /><p className="mt-3 font-semibold text-slate-700">No apartment bookings yet</p><p className="mt-1 text-sm text-slate-500">Browse apartments and send your first request.</p><button type="button" onClick={() => navigate("/apartments/browse")} className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">Browse apartments</button></div>}
                </section>
            </div>
            </div>
        </div>
    );
}
