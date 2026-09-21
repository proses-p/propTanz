import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { LogOut } from "lucide-react";

import {
	Building2,
	LayoutDashboard,
	Menu,
	Search,
	UserRound,
	X,
} from "lucide-react";
import authService from "../../services/authService";
import { toast } from "react-toastify";

const navigation = [
	{ label: "Dashboard", to: "/dashboard", icon: LayoutDashboard, end: true },
	{ label: "find apartments", to: "/apartments/browse", icon: Search },
	{ label: "Find hostels", to: "/hostels/tenant", icon: Building2 },
	// { label: "ost", to: "/owner-verification", icon: ClipboardCheck },
];

export default function Sidebar() {
	const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true);
        try {
            await authService.logout();
            toast.success("you have successfully logged out!");
        } catch(error) {
            toast.error("There is a problem please try again!");
        } finally {
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('user');

            setLoading(false);

            navigate('/login');
        }
    }

	const navLinkClass = ({ isActive }) => `group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition ${
		isActive
			? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
			: "text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
	}`;

	return (
		<>
			<button
				type="button"
				onClick={() => setSidebarOpen(true)}
				className="fixed left-4 top-4 z-40 rounded-xl bg-white p-3 text-slate-700 shadow-lg ring-1 ring-slate-200 transition hover:text-emerald-700 lg:hidden"
				aria-label="Open navigation"
			>
				<Menu size={20} aria-hidden="true" />
			</button>

			<div
				className={`fixed inset-0 z-40 bg-slate-950/35 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden ${sidebarOpen ? "visible opacity-100" : "invisible opacity-0"}`}
				onClick={() => setSidebarOpen(false)}
				aria-hidden="true"
			/>

			<aside className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-slate-200 bg-white px-5 py-7 shadow-2xl transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:shadow-none ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
				<div className="mb-12 flex items-center justify-between px-2">
					<div className="flex items-center gap-3">
						<div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-xl font-black text-white shadow-lg shadow-emerald-600/20">P</div>
						<div>
							<p className="text-lg font-black tracking-[-0.04em] text-slate-950">PangaEasy</p>
							<p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-600">Member space</p>
						</div>
					</div>
					<button type="button" onClick={() => setSidebarOpen(false)} className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 lg:hidden" aria-label="Close navigation">
						<X size={19} aria-hidden="true" />
					</button>
				</div>

				<p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Explore</p>
				<nav className="space-y-1.5">
					{navigation.map(({ label, to, icon: Icon, end }) => (
						<NavLink key={to} to={to} end={end} className={navLinkClass} onClick={() => setSidebarOpen(false)}>
							<Icon size={18} strokeWidth={2} />
							<span>{label}</span>
						</NavLink>
					))}
				</nav>

				<div className="mt-auto rounded-2xl bg-slate-50 p-4">
					<div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
						<UserRound size={19} aria-hidden="true" />
					</div>
                    
					<p className="text-sm font-bold text-slate-800">Welcome back</p>
					<p className="mt-1 text-xs leading-5 text-slate-500">Manage your stays and property plans in one place.</p>
                    

                    <button
                        onClick={handleLogout}
                        disabled={loading}
                        className="group inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <LogOut size={17} strokeWidth={2} aria-hidden="true" />
                        <span>{loading ? "signing out..." : "Logout"}</span>
                    </button>
				</div>
			</aside>
		</>
	);
}
