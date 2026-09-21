import { Bell, ChevronDown } from "lucide-react";
import useAuth from "../../hooks/useAuth";


const Navbar = () => {
    const { user } = useAuth();
    const initial = (user?.name || "O").charAt(0).toUpperCase();

    return (
        <nav className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-[#eee9d4] bg-[#faf9f3]/90 px-5 backdrop-blur-md sm:px-8 lg:px-10">
            <div className="pl-14 lg:pl-0"><p className="text-xs font-black uppercase tracking-[0.18em] text-[#a87500]">PangaEasy Business</p><p className="mt-1 hidden text-sm text-slate-500 sm:block">Property operations, simplified.</p></div>
            <div className="flex items-center gap-3"><button type="button" className="relative rounded-xl p-2.5 text-slate-500 transition hover:bg-white hover:text-slate-950" aria-label="Notifications"><Bell size={19} /><span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#FDBF2D] ring-2 ring-[#faf9f3]" /></button><div className="hidden h-8 w-px bg-[#e8e1c9] sm:block" /><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 text-sm font-black text-[#FAF92A]">{initial}</div><div className="hidden text-left sm:block"><p className="text-sm font-black text-slate-900">{user?.name || "Property owner"}</p><p className="text-xs text-slate-500">Owner account</p></div><ChevronDown size={16} className="hidden text-slate-400 sm:block" /></div></div>
        </nav>
    );
};

export default Navbar;