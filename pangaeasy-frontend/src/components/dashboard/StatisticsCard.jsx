export default function statisticsCard({
    title,
    value,
    color,
    icon,
}) {
    return (
        <div className="rounded-2xl bg-white p-6 shadow-md transition hover:shadow-lg">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500">{title}</p>
                    <h2 className={`mt-2 text-3xl font-bold ${color}`}>{value}</h2>
                </div>

                <div className="text-4xl">{icon}</div>
            </div>
        </div>
    );
}