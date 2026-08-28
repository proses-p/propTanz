import { useNavigate } from "react-router-dom";
import StatusBadge from "./StatusBadge";

export default function HostelTable({ 
    hostels, 
    onEdit,
    onDelete,
}) {
    const navigate = useNavigate();
    return (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-3 text-left">Hostel Name</th>
                        <th className="px-4 py-3 text-left">Region</th>
                        <th className="px-4 py-3 text-left">District</th>
                        <th className="px-4 py-3 text-left">Type</th>
                        <th className="px-4 py-3 text-left">Status</th>
                        <th className="px-4 py-3 text-left">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {hostels.map((hostel) => (
                        <tr key={hostel.id} className="border-t hover:bg-gray-50">
                            <td className="px-4 py-3">{hostel.hostel_name}</td>
                            <td className="px-4 py-3">{hostel.region}</td>
                            <td className="px-4 py-3">{hostel.district}</td>
                            <td className="px-4 py-3">{hostel.hostel_type}</td>
                            <td className="px-4 py-3"><StatusBadge status={hostel.status} /></td>
                            <td className="px-4 py-3 text-center">
                                <button
                                    onClick={() => navigate(`/admin/hostels/${hostel.id}`)}
                                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                                >
                                    View
                                </button>
                                <button
                                    onClick={() => onEdit(hostel)}
                                    className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
                                >
                                    Edit
                                </button>

                                <button
                                    type="button"
                                    onClick={() => onDelete(hostel)}
                                    className="ml-2 rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}