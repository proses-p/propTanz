import { useNavigate } from "react-router-dom";
import { FiEdit2, FiEye, FiTrash2 } from "react-icons/fi";
import StatusBadge from "./StatusBadge";
import { Eye, Pencil, Trash2 } from "lucide-react";

export default function HostelTable({ 
    hostels, 
    onEdit,
    onDelete,
}) {
    const navigate = useNavigate();
    return (
        <div className="overflow-x-auto rounded-2xl bg-white shadow-[0_10px_28px_rgba(67,53,0,0.07)] ring-1 ring-[#eee6c7]">
            <table className="min-w-full">
                <thead className="bg-[#fff9cf]">
                    <tr>
                        <th className="whitespace-nowrap px-5 py-4 text-left text-xs font-bold uppercase tracking-[0.12em] text-slate-600">Hostel Name</th>
                        <th className="whitespace-nowrap px-5 py-4 text-left text-xs font-bold uppercase tracking-[0.12em] text-slate-600">Region</th>
                        <th className="whitespace-nowrap px-5 py-4 text-left text-xs font-bold uppercase tracking-[0.12em] text-slate-600">District</th>
                        <th className="whitespace-nowrap px-5 py-4 text-left text-xs font-bold uppercase tracking-[0.12em] text-slate-600">Type</th>
                        <th className="whitespace-nowrap px-5 py-4 text-left text-xs font-bold uppercase tracking-[0.12em] text-slate-600">Status</th>
                        <th className="whitespace-nowrap px-5 py-4 text-left text-xs font-bold uppercase tracking-[0.12em] text-slate-600">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {hostels.map((hostel) => (
                        <tr key={hostel.id} className="border-t border-[#f1eddc] transition hover:bg-[#fffdf0]">
                            <td className="whitespace-nowrap px-5 py-5 text-sm font-semibold text-slate-800">{hostel.hostel_name}</td>
                            <td className="whitespace-nowrap px-5 py-5 text-sm text-slate-600">{hostel.region}</td>
                            <td className="whitespace-nowrap px-5 py-5 text-sm text-slate-600">{hostel.district}</td>
                            <td className="whitespace-nowrap px-5 py-5 text-sm text-slate-600">{hostel.hostel_type}</td>
                            <td className="whitespace-nowrap px-5 py-5"><StatusBadge status={hostel.status} /></td>
                            <td className="px-5 py-5">
                                <div className="flex min-w-[140px] gap-2">
                                <button
                                    type="button"
                                    onClick={() => navigate(`/admin/hostels/${hostel.id}`)}
                                    className="rounded-lg bg-[#FDBF2D] p-2.5 text-slate-950 transition hover:bg-[#FAF92A]"
                                    title="View hostel"
                                    aria-label="View hostel"
                                >
                                    <Eye size={17} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onEdit(hostel)}
                                    className="rounded-lg bg-slate-100 p-2.5 text-slate-700 transition hover:bg-slate-200"
                                    title="Edit hostel"
                                    aria-label="Edit hostel"
                                >
                                    <Pencil size={17} />
                                </button>

                                <button
                                    type="button"
                                    onClick={() => onDelete(hostel)}
                                    className="rounded-lg bg-[#fff1c7] p-2.5 text-[#8a5b00] transition hover:bg-[#ffe7a0]"
                                    title="Delete hostel"
                                    aria-label="Delete hostel"
                                >
                                    <Trash2 size={17} />
                                </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}