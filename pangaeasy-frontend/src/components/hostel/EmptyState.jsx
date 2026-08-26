import { FaHotel } from "react-icons/fa";

export default function EmptyState({ title, message }) {
    return (
        <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white py-16 text-center">
            <FaHotel className="mx-auto mb-4 text-5xl text-gray-400" />
            <h2 className="text-xl font-semibold text-gray-700">{title}</h2>
            <p className="mt-2 text-gray-500">{message}</p>
        </div>
    );
}