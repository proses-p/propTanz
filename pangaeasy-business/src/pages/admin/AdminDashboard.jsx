import { useEffect, useState } from "react";
import { Activity, ArrowUpRight, Building2, CheckCircle2, Clock3, Users, XCircle } from "lucide-react";
import hostelService from "../../services/hostelService";
import StatisticsCard from "../../components/dashboard/StatisticsCard";

const initialStatistics = { total: 0, approved: 0, pending: 0, rejected: 0 };

export default function AdminDashboard() {
    const [statistics, setStatistics] = useState(initialStatistics);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStatistics = async () => {
            try {
                const response = await hostelService.statistics();
                setStatistics(response.data.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        loadStatistics();
    }, []);

    const total = Math.max(statistics.total, 1);
    const distribution = [
        { label: "Approved", value: statistics.approved, color: "bg-[#FDBF2D]", icon: CheckCircle2 },
        { label: "Pending", value: statistics.pending, color: "bg-[#FAF92A]", icon: Clock3 },
        { label: "Rejected", value: statistics.rejected, color: "bg-[#d9b84c]", icon: XCircle },
    ];

    return (
        <div className="mx-auto max-w-[1500px]">
            <div className="mb-9 flex flex-col gap-5 border-b border-[#eee6c7] pb-8 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[#b27a00]">Good morning, administrator</p>
                    <h1 className="text-3xl font-black tracking-[-0.05em] text-slate-950 sm:text-4xl">Dashboard overview</h1>
                    <p className="mt-3 max-w-xl text-base leading-7 text-slate-600">A calm, current view of your property operations and the work that needs attention.</p>
                </div>
                <div className="flex items-center gap-2 self-start rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm ring-1 ring-[#eee6c7] sm:self-auto">
                    <Activity size={16} className="text-[#b27a00]" /> Live portfolio data
                </div>
            </div>

            <section className="mb-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-5" aria-label="Portfolio summary">
                <StatisticsCard title="Total Hostels" value={loading ? "--" : statistics.total} color="text-slate-950" icon={<Building2 size={21} />} />
                <StatisticsCard title="Approved Hostels" value={loading ? "--" : statistics.approved} color="text-[#956300]" icon={<CheckCircle2 size={21} />} />
                <StatisticsCard title="Pending Hostels" value={loading ? "--" : statistics.pending} color="text-[#a86e00]" icon={<Clock3 size={21} />} />
                <StatisticsCard title="Rejected Hostels" value={loading ? "--" : statistics.rejected} color="text-[#7b5a00]" icon={<XCircle size={21} />} />
                <StatisticsCard title="Total Users" value="--" color="text-slate-950" icon={<Users size={21} />} />
            </section>

            <section className="mb-10 grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
                <div className="rounded-2xl bg-white p-6 shadow-[0_10px_28px_rgba(67,53,0,0.06)] ring-1 ring-[#eee6c7] sm:p-7">
                    <div className="mb-8 flex items-start justify-between gap-4">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#b27a00]">Portfolio health</p>
                            <h2 className="mt-2 text-xl font-black tracking-[-0.03em] text-slate-950">Hostel status distribution</h2>
                        </div>
                        <div className="rounded-xl bg-[#fff8cf] p-2.5 text-[#956300]"><Building2 size={20} /></div>
                    </div>
                    <div className="mb-8 flex h-5 overflow-hidden rounded-full bg-[#f6f1d9]">
                        <div className="bg-[#FDBF2D] transition-all" style={{ width: `${(statistics.approved / total) * 100}%` }} />
                        <div className="bg-[#FAF92A] transition-all" style={{ width: `${(statistics.pending / total) * 100}%` }} />
                        <div className="bg-[#d9b84c] transition-all" style={{ width: `${(statistics.rejected / total) * 100}%` }} />
                    </div>
                    <div className="grid gap-5 sm:grid-cols-3">
                        {distribution.map(({ label, value, color, icon: Icon }) => (
                            <div key={label} className="flex items-center gap-3">
                                <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${color} text-slate-900`}><Icon size={18} /></span>
                                <div><p className="text-sm text-slate-500">{label}</p><p className="mt-1 text-lg font-black text-slate-900">{value}</p></div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-2xl bg-slate-950 p-6 text-white shadow-[0_12px_30px_rgba(15,23,42,0.12)] sm:p-7">
                    <div className="mb-7 flex items-start justify-between gap-4">
                        <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#FAF92A]">At a glance</p><h2 className="mt-2 text-xl font-black tracking-[-0.03em]">Portfolio activity</h2></div>
                        <Users size={21} className="text-[#FDBF2D]" />
                    </div>
                    <div className="space-y-5">
                        <div className="flex items-center justify-between border-b border-white/10 pb-5"><span className="text-sm text-slate-300">Properties under review</span><strong className="text-2xl text-[#FAF92A]">{statistics.pending}</strong></div>
                        <div className="flex items-center justify-between border-b border-white/10 pb-5"><span className="text-sm text-slate-300">Approval rate</span><strong className="text-2xl text-[#FDBF2D]">{Math.round((statistics.approved / total) * 100)}%</strong></div>
                        <div className="flex items-center justify-between"><span className="text-sm text-slate-300">Portfolio size</span><strong className="text-2xl text-white">{statistics.total}</strong></div>
                    </div>
                </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-2xl bg-white p-6 shadow-[0_10px_28px_rgba(67,53,0,0.06)] ring-1 ring-[#eee6c7] sm:p-7">
                    <div className="mb-7 flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#b27a00]">Activity trend</p><h2 className="mt-2 text-xl font-black tracking-[-0.03em]">Registration momentum</h2></div><ArrowUpRight size={20} className="text-[#b27a00]" /></div>
                    <div className="flex h-36 items-end gap-3 border-b border-slate-100 px-2">
                        {[42, 58, 48, 76, 62, 84, 72].map((height, index) => <div key={index} className="flex flex-1 flex-col items-center gap-2"><div className="w-full rounded-t-lg bg-[#FDBF2D] transition hover:bg-[#FAF92A]" style={{ height: `${height}%` }} /><span className="text-[11px] font-semibold text-slate-400">{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}</span></div>)}
                    </div>
                </div>
                <div className="rounded-2xl bg-[#fff8cf] p-6 ring-1 ring-[#f0df91] sm:p-7"><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#a66a00]">Pending actions</p><h2 className="mt-2 text-xl font-black tracking-[-0.03em] text-slate-950">Keep the review queue moving</h2><p className="mt-3 max-w-md text-sm leading-6 text-slate-600">There are {statistics.pending} hostel records currently awaiting review. Visit Requests to continue your approval workflow.</p><div className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#FDBF2D] px-4 py-3 text-sm font-bold text-slate-950"><Clock3 size={17} /> {statistics.pending} pending review{statistics.pending === 1 ? "" : "s"}</div></div>
            </section>
        </div>
    );
}
