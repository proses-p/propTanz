import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
    Bell,
    Building2,
    ChevronRight,
    LayoutDashboard,
    LogOut,
    Menu,
    Settings,
    UserRound,
    Users,
    X,
} from "lucide-react";
import { useState } from "react";
import useAuth from "../hooks/useAuth";

const navigation = [
    { label: "Dashboard", to: "/admin", icon: LayoutDashboard, end: true },
    { label: "Hostels", to: "/admin/hostels", icon: Building2 },
    { label: "Users", to: "/admin/users", icon: Users },
    { label: "Requests", to: "/admin/owner-request", icon: UserRound },
];

const secondaryNavigation = [
    { label: "Notifications", to: "/admin/notifications", icon: Bell },
    { label: "Settings", to: "/admin/settings", icon: Settings },
];

export default function AdminLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const navLinkClass = ({ isActive }) => `group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition ${
        isActive
            ? "bg-[#FAF92A] text-slate-950 shadow-[0_8px_18px_rgba(250,249,42,0.2)]"
            : "text-slate-600 hover:bg-[#fff8cf] hover:text-slate-950"
    }`;

    const renderNavigation = (items) => items.map(({ label, to, icon: Icon, end }) => (
        <NavLink key={to} to={to} end={end} className={navLinkClass} onClick={() => setSidebarOpen(false)}>
            <Icon size={18} strokeWidth={2} />
            <span>{label}</span>
            <ChevronRight size={15} className="ml-auto opacity-0 transition group-hover:opacity-60" />
        </NavLink>
    ));

    return (
        <div className="min-h-screen bg-[#fffdf2] text-slate-900 lg:flex">
            <div className={`fixed inset-0 z-40 bg-slate-950/30 transition lg:hidden ${sidebarOpen ? "visible opacity-100" : "invisible opacity-0"}`} onClick={() => setSidebarOpen(false)} />
            <aside className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-[#eee6c7] bg-white px-5 py-6 shadow-xl transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:shadow-none ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="mb-10 flex items-center justify-between px-2">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FDBF2D] text-xl font-black text-slate-950 shadow-[0_8px_18px_rgba(253,191,45,0.24)]">P</div>
                        <div>
                            <p className="text-lg font-black tracking-[-0.04em] text-slate-950">PangaEasy</p>
                            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#b27a00]">Admin Console</p>
                        </div>
                    </div>
                    <button type="button" onClick={() => setSidebarOpen(false)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden" aria-label="Close navigation">
                        <X size={19} />
                    </button>
                </div>

                <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Workspace</p>
                <nav className="space-y-1.5">{renderNavigation(navigation)}</nav>
                <p className="mb-3 mt-9 px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Account</p>
                <nav className="space-y-1.5">{renderNavigation(secondaryNavigation)}</nav>

                <div className="mt-auto border-t border-slate-100 pt-5">
                    <div className="mb-4 flex items-center gap-3 px-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fff1bd] font-bold text-[#936200]">{user?.name?.charAt(0)?.toUpperCase() || "A"}</div>
                        <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-slate-800">{user?.name || "Administrator"}</p>
                            <p className="truncate text-xs text-slate-500">{user?.email || "Admin account"}</p>
                        </div>
                    </div>
                    <button type="button" onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-[#fff8cf] hover:text-slate-950">
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </aside>

            <div className="min-w-0 flex-1">
                <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-[#eee6c7] bg-[#fffdf2]/95 px-4 backdrop-blur sm:px-7 lg:hidden">
                    <button type="button" onClick={() => setSidebarOpen(true)} className="rounded-xl bg-white p-2.5 text-slate-700 shadow-sm ring-1 ring-slate-200" aria-label="Open navigation">
                        <Menu size={20} />
                    </button>
                    <p className="text-base font-black tracking-[-0.03em]">PangaEasy</p>
                    <div className="h-9 w-9 rounded-full bg-[#FDBF2D]" />
                </header>
                <main className="min-h-[calc(100vh-76px)] p-4 sm:p-7 lg:min-h-screen lg:p-10">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
