import { useEffect, useMemo, useState } from "react";
import {
    ArrowUpRight,
    Building2,
    CalendarDays,
    CheckCircle2,
    ChevronRight,
    Clock3,
    Home,
    Hotel,
    Plus,
    TrendingUp,
    Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Sidebar from "../components/common/Sidebar";
import Navbar from "../components/common/Navbar";
import useAuth from "../hooks/useAuth";
import hostelService from "../services/hostelService";
import apartmentService from "../services/apartmentService";

const statusStyles = {
    approved: "bg-emerald-50 text-emerald-700",
    pending: "bg-amber-50 text-amber-700",
    rejected: "bg-rose-50 text-rose-700",
};

const bookingStyles = {
    approved: "bg-emerald-50 text-emerald-700",
    pending: "bg-[#fff8cf] text-[#8a6200]",
    rejected: "bg-rose-50 text-rose-700",
};

function StatCard({ icon: Icon, label, value, detail, tone }) {
    return (
        <article className="relative overflow-hidden rounded-[22px] border border-[#eee9d4] bg-white p-5 shadow-[0_12px_30px_rgba(67,53,0,0.05)] sm:p-6">
            <div className={`mb-6 flex h-11 w-11 items-center justify-center rounded-2xl ${tone}`}><Icon size={20} /></div>
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <div className="mt-1 flex items-end justify-between gap-3"><p className="text-3xl font-black tracking-[-0.05em] text-slate-950">{value}</p>{detail && <span className="mb-1 inline-flex items-center gap-1 text-xs font-bold text-emerald-600"><TrendingUp size={13} /> {detail}</span>}</div>
            <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-[#FAF92A]/20" />
        </article>
    );
}

function EmptyState({ title, message }) {
    return <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-[#e4dcc0] bg-[#fffdf4] px-6 text-center"><Building2 className="text-[#c69a24]" size={25} /><p className="mt-3 text-sm font-bold text-slate-800">{title}</p><p className="mt-1 text-xs text-slate-500">{message}</p></div>;
}

export default function Dashboard() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [hostels, setHostels] = useState([]);
    const [statistics, setStatistics] = useState({ total: 0, approved: 0, pending: 0, rejected: 0 });
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const [hostelResponse, statisticsResponse, bookingResponse] = await Promise.all([
                    hostelService.getAll(1),
                    hostelService.statistics(),
                    apartmentService.getBookings(),
                ]);
                const hostelData = hostelResponse.data?.data;
                setHostels(hostelData?.data || []);
                setStatistics(statisticsResponse.data?.data || { total: 0, approved: 0, pending: 0, rejected: 0 });
                setBookings(bookingResponse.data?.data || []);
            } catch (error) {
                // toast.error(error.response?.data?.message || "Unable to load dashboard data.");
            } finally {
                setLoading(false);
            }
        };
        loadDashboard();
    }, []);

    const latestHostels = useMemo(() => [...hostels].sort((a, b) => Number(b.id) - Number(a.id)).slice(0, 3), [hostels]);
    const bookingSummary = useMemo(() => bookings.reduce((summary, booking) => {
        const status = String(booking.status || "pending").toLowerCase();
        summary[status] = (summary[status] || 0) + 1;
        return summary;
    }, { approved: 0, pending: 0, rejected: 0 }), [bookings]);
    const totalBookings = bookings.length;
    const approvalRate = statistics.total ? Math.round((statistics.approved / statistics.total) * 100) : 0;
    const firstName = user?.name?.split(" ")[0] || "Owner";

    return (
        <div className="min-h-screen bg-[#faf9f3] text-slate-900 lg:flex">
            <Sidebar />
            <div className="min-w-0 flex-1">
                <Navbar />
                <main className="mx-auto max-w-[1580px] px-5 py-7 sm:px-8 lg:px-10 lg:py-9">
                    <section className="mb-9 flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
                        <div>
                            <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-[#a87500]">Owner workspace</p>
                            <h1 className="text-3xl font-black tracking-[-0.06em] text-slate-950 sm:text-4xl">Welcome, {firstName}.</h1>
                            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">Keep your properties moving forward. Here is the latest pulse across your PangaEasy portfolio.</p>
                        </div>
                        <button 
                            type="button" onClick={() => navigate("/hostel-registration/create")} 
                            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#FDBF2D] px-5 text-sm font-black text-slate-950 shadow-[0_10px_22px_rgba(253,191,45,0.25)] transition hover:-translate-y-0.5 hover:bg-[#FAF92A]">
                                <Plus size={18} />
                                 Register property
                        </button>
                    </section>
                    <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Portfolio summary">
                        <StatCard icon={Building2} label="Total properties" value={loading ? "--" : statistics.total} detail="Portfolio" tone="bg-[#fff8cf] text-[#956300]" /><StatCard icon={CheckCircle2} label="Approved listings" value={loading ? "--" : statistics.approved} detail={`${approvalRate}% rate`} tone="bg-emerald-50 text-emerald-600" /><StatCard icon={Clock3} label="Awaiting review" value={loading ? "--" : statistics.pending} detail="Needs attention" tone="bg-[#fff3dc] text-[#b87900]" /><StatCard icon={CalendarDays} label="Booking requests" value={loading ? "--" : totalBookings} detail="All time" tone="bg-slate-100 text-slate-700" /></section>
                    <section className="mb-8 grid gap-6 xl:grid-cols-[1.45fr_0.8fr]">
                        <article className="rounded-[24px] border border-[#eee9d4] bg-white p-6 shadow-[0_12px_30px_rgba(67,53,0,0.05)] sm:p-7">
                            <div className="mb-8 flex items-start justify-between gap-5">
                                <div>
                                    <p className="text-xs font-black uppercase tracking-[0.18em] text-[#a87500]">Portfolio analytics</p>
                                    <h2 className="mt-2 text-xl font-black tracking-[-0.04em] text-slate-950">Listing health</h2>
                                </div>
                                <span className="rounded-xl bg-[#fff8cf] p-3 text-[#956300]"><TrendingUp size={19} /></span>
                            </div>
                            <div className="grid gap-8 md:grid-cols-[1fr_220px] md:items-center">
                                <div>
                                    <div className="mb-4 flex h-5 overflow-hidden rounded-full bg-slate-100">
                                        <div className="bg-[#FDBF2D] transition-all" style={{ width: `${statistics.total ? (statistics.approved / statistics.total) * 100 : 0}%` }} />
                                        <div className="bg-[#FAF92A] transition-all" style={{ width: `${statistics.total ? (statistics.pending / statistics.total) * 100 : 0}%` }} />
                                        <div className="bg-[#d9b84c] transition-all" style={{ width: `${statistics.total ? (statistics.rejected / statistics.total) * 100 : 0}%` }} /></div>
                                        <div className="grid grid-cols-3 gap-3 text-xs">
                                            <span><i className="mr-2 inline-block h-2 w-2 rounded-full bg-[#FDBF2D]" />Approved</span>
                                            <span><i className="mr-2 inline-block h-2 w-2 rounded-full bg-[#FAF92A]" />Pending</span>
                                            <span><i className="mr-2 inline-block h-2 w-2 rounded-full bg-[#d9b84c]" />Rejected</span>
                                        </div>
                                        </div>
                                        <div className="relative mx-auto flex h-44 w-44 items-center justify-center rounded-full" style={{ background: `conic-gradient(#FDBF2D 0 ${approvalRate}%, #FAF92A ${approvalRate}% ${Math.min(approvalRate + (statistics.total ? (statistics.pending / statistics.total) * 100 : 0), 100)}%, #f1e6b3 0)` }}>
                                        <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-white">
                                            <strong className="text-3xl font-black text-slate-950">{approvalRate}%</strong>
                                            <span className="text-xs font-semibold text-slate-500">approved</span>
                                        </div>
                                        </div>
                                        </div>
                        </article>
                        <article className="rounded-[24px] bg-slate-950 p-6 text-white shadow-[0_16px_34px_rgba(15,23,42,0.14)] sm:p-7"><div className="mb-8 flex items-start justify-between">
                            <div>
                                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#FAF92A]">Bookings overview</p>
                                <h2 className="mt-2 text-xl font-black tracking-[-0.04em]">Recent demand</h2>
                            </div>
                            <Users className="text-[#FDBF2D]" size={21} /></div><div className="space-y-5">
                                <div className="flex items-center justify-between border-b border-white/10 pb-5">
                                <span className="text-sm text-slate-300">Approved</span>
                                <strong className="text-2xl text-[#FAF92A]">{bookingSummary.approved}</strong>
                                </div>
                                <div className="flex items-center justify-between border-b border-white/10 pb-5">
                                <span className="text-sm text-slate-300">Pending</span>
                                <strong className="text-2xl text-[#FDBF2D]">{bookingSummary.pending}</strong>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-300">Total requests</span>
                                    <strong className="text-2xl text-white">{totalBookings}</strong>
                                </div>
                                </div>
                            </article>
                            </section>
                    <section className="mb-8 grid gap-6 xl:grid-cols-[1.45fr_0.8fr]"><article className="rounded-[24px] border border-[#eee9d4] bg-white p-6 shadow-[0_12px_30px_rgba(67,53,0,0.05)] sm:p-7"><div className="mb-6 flex items-end justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-[#a87500]">My hostels</p><h2 className="mt-2 text-xl font-black tracking-[-0.04em]">Your property portfolio</h2></div><button type="button" onClick={() => navigate("/hostel-registration")} className="inline-flex items-center gap-1 text-sm font-black text-[#a87500] hover:text-slate-950">View all <ChevronRight size={16} /></button></div>{latestHostels.length ? <div className="space-y-3">{latestHostels.map((hostel) => { const status = String(hostel.status || "pending").toLowerCase(); return <div key={hostel.id} className="flex items-center gap-4 rounded-2xl border border-slate-100 p-3 transition hover:border-[#f0d976] hover:bg-[#fffdf4]"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#fff8cf] text-[#956300]"><Hotel size={21} /></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-black text-slate-900">{hostel.hostel_name}</p><p className="mt-1 truncate text-xs text-slate-500">{[hostel.street, hostel.district, hostel.region].filter(Boolean).join(", ") || "Location not provided"}</p></div><span className={`rounded-full px-3 py-1.5 text-[11px] font-black capitalize ${statusStyles[status] || statusStyles.pending}`}>{status}</span><button type="button" onClick={() => navigate("/hostel-registration")} className="hidden rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-900 sm:block" aria-label={`View ${hostel.hostel_name}`}><ArrowUpRight size={17} /></button></div>; })}</div> : <EmptyState title="No hostels yet" message="Register your first property to build your portfolio." />}</article><article className="rounded-[24px] border border-[#eee9d4] bg-[#fffdf4] p-6 shadow-[0_12px_30px_rgba(67,53,0,0.04)] sm:p-7"><p className="text-xs font-black uppercase tracking-[0.18em] text-[#a87500]">Quick actions</p><h2 className="mt-2 text-xl font-black tracking-[-0.04em] text-slate-950">Move work forward</h2><div className="mt-6 space-y-3"><button type="button" onClick={() => navigate("/hostel-registration/create")} className="flex w-full items-center gap-3 rounded-xl bg-[#FDBF2D] px-4 py-3.5 text-left text-sm font-black text-slate-950 transition hover:bg-[#FAF92A]"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/60"><Plus size={17} /></span>Register hostel<ChevronRight className="ml-auto" size={17} /></button><button type="button" onClick={() => navigate("/apartments/create")} className="flex w-full items-center gap-3 rounded-xl border border-[#eadfae] bg-white px-4 py-3.5 text-left text-sm font-black text-slate-800 transition hover:border-[#FDBF2D]"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#fff8cf] text-[#956300]"><Home size={17} /></span>Register apartment<ChevronRight className="ml-auto" size={17} /></button><button type="button" onClick={() => navigate("/apartments")} className="flex w-full items-center gap-3 rounded-xl border border-[#eadfae] bg-white px-4 py-3.5 text-left text-sm font-black text-slate-800 transition hover:border-[#FDBF2D]"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700"><CalendarDays size={17} /></span>View bookings<ChevronRight className="ml-auto" size={17} /></button></div></article></section>
                    <section className="rounded-[24px] border border-[#eee9d4] bg-white p-6 shadow-[0_12px_30px_rgba(67,53,0,0.05)] sm:p-7"><div className="mb-6 flex items-end justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-[#a87500]">Latest activity</p><h2 className="mt-2 text-xl font-black tracking-[-0.04em]">Recent bookings</h2></div><button type="button" onClick={() => navigate("/apartments")} className="hidden items-center gap-1 text-sm font-black text-[#a87500] hover:text-slate-950 sm:inline-flex">View all <ChevronRight size={16} /></button></div>{bookings.length ? <div className="overflow-x-auto"><table className="min-w-full text-left"><thead><tr className="border-b border-slate-100 text-[11px] font-black uppercase tracking-[0.12em] text-slate-400"><th className="pb-3 pr-4">Guest</th><th className="pb-3 pr-4">Property</th><th className="pb-3 pr-4">Move-in date</th><th className="pb-3">Status</th></tr></thead><tbody>{bookings.slice(0, 5).map((booking) => { const status = String(booking.status || "pending").toLowerCase(); return <tr key={booking.id} className="border-b border-slate-50 last:border-0"><td className="py-4 pr-4"><div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fff8cf] text-xs font-black text-[#956300]">{(booking.user?.name || "G").charAt(0).toUpperCase()}</span><span className="whitespace-nowrap text-sm font-bold text-slate-800">{booking.user?.name || "Guest request"}</span></div></td><td className="whitespace-nowrap py-4 pr-4 text-sm text-slate-600">{booking.apartment?.name || `Apartment #${booking.apartment_id}`}</td><td className="whitespace-nowrap py-4 pr-4 text-sm text-slate-500">{booking.move_in_date || "Not specified"}</td><td className="py-4"><span className={`rounded-full px-3 py-1.5 text-[11px] font-black capitalize ${bookingStyles[status] || bookingStyles.pending}`}>{status}</span></td></tr>; })}</tbody></table></div> : <EmptyState title="No booking requests yet" message="New apartment booking requests will appear here." />}</section>
                </main>
            </div>
        </div>
    );
}
