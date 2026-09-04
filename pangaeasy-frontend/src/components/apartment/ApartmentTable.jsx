import { FiEdit2, FiEye, FiTrash2 } from "react-icons/fi";

export default function ApartmentTable({ apartments, onView, onEdit, onDelete }) {
    return (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full">
                <thead className="bg-slate-50">
                    <tr>
                        {['Name', 'Location', 'Description', 'Actions'].map((heading) => (
                            <th key={heading} className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                                {heading}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {apartments.map((apartment) => (
                        <tr key={apartment.id} className="border-t border-slate-100 hover:bg-slate-50">
                            <td className="px-5 py-4 font-semibold text-slate-900">{apartment.name}</td>
                            <td className="px-5 py-4 text-sm text-slate-600">{apartment.street}, {apartment.town}</td>
                            <td className="max-w-sm px-5 py-4 text-sm text-slate-600">{apartment.description}</td>
                            <td className="px-5 py-4">
                                <div className="flex gap-2">
                                    <button type="button" onClick={() => onView(apartment)} title="View apartment" className="rounded-lg p-2 text-slate-600 hover:bg-slate-200"><FiEye /></button>
                                    <button type="button" onClick={() => onEdit(apartment)} title="Edit apartment" className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"><FiEdit2 /></button>
                                    <button type="button" onClick={() => onDelete(apartment)} title="Delete apartment" className="rounded-lg p-2 text-red-600 hover:bg-red-50"><FiTrash2 /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}