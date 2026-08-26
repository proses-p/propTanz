export default function StatusFilter({ value, onChange }) {
    const statuses = [
        {
            label: "all",
            value: "all",

        },

        {
            label: "Approved",
            value: "Approved",
        },

        {
            label: "Pending",
            value: "Pending",
        },

        {
            label: "Rejected",
            value: "Rejected",
        },
    ];

    return (
        <div className="flex flex-wrap gap-3">
            {statuses.map((status) => (
                <button 
                    key={status.value}
                    onClick={() => onChange(status.value)}
                    className={`rounded-lg px-5 py-2 font-medium transition ${
                        value === status.value
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                    {status.label}
                </button>
            ))}
        </div>
    );
}