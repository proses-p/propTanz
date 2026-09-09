import { Mail, Phone, ShieldCheck, UserRound } from "lucide-react";
import useAuth from "../../hooks/useAuth";

export default function AdminUsers() {
    const { user } = useAuth();
    const account = user || {};

    return (
        <div className="mx-auto max-w-[1500px]">
            <div className="mb-9 border-b border-[#eee6c7] pb-8"><p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[#b27a00]">Access directory</p><h1 className="text-3xl font-black tracking-[-0.05em] text-slate-950 sm:text-4xl">Users</h1><p className="mt-3 text-base leading-7 text-slate-600">Review account access and property-management ownership information.</p></div>
            <div className="overflow-hidden rounded-2xl bg-white shadow-[0_10px_28px_rgba(67,53,0,0.06)] ring-1 ring-[#eee6c7]">
                <div className="overflow-x-auto"><table className="min-w-full text-left"><thead className="bg-[#fff8cf]"><tr><th className="whitespace-nowrap px-6 py-4 text-xs font-bold uppercase tracking-[0.12em] text-slate-600">User</th><th className="whitespace-nowrap px-6 py-4 text-xs font-bold uppercase tracking-[0.12em] text-slate-600">Contact</th><th className="whitespace-nowrap px-6 py-4 text-xs font-bold uppercase tracking-[0.12em] text-slate-600">Role</th><th className="whitespace-nowrap px-6 py-4 text-xs font-bold uppercase tracking-[0.12em] text-slate-600">Hostel ownership</th></tr></thead><tbody><tr className="border-t border-[#f1eddc]"><td className="px-6 py-6"><div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FAF92A] font-black text-slate-950">{account.name?.charAt(0)?.toUpperCase() || "A"}</div><div><p className="font-bold text-slate-900">{account.name || "Administrator"}</p><p className="mt-1 text-sm text-slate-500">Active account</p></div></div></td><td className="px-6 py-6"><div className="space-y-2 text-sm text-slate-600"><p className="flex items-center gap-2"><Mail size={15} className="text-[#b27a00]" />{account.email || "Not provided"}</p><p className="flex items-center gap-2"><Phone size={15} className="text-[#b27a00]" />{account.phone || "Not provided"}</p></div></td><td className="px-6 py-6"><span className="inline-flex items-center gap-2 rounded-full bg-[#fff1bd] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-[#8b5c00]"><ShieldCheck size={14} />{account.role || "Admin"}</span></td><td className="px-6 py-6"><span className="flex items-center gap-2 text-sm text-slate-600"><UserRound size={17} className="text-[#b27a00]" />Managed properties appear here when available</span></td></tr></tbody></table></div>
            </div>
            <p className="mt-4 text-sm text-slate-500">The current API exposes the signed-in administrator’s account only; no additional user-list endpoint is available.</p>
        </div>
    );
}
