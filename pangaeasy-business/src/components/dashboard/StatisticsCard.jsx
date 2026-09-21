export default function statisticsCard({
    title,
    value,
    color,
    icon,
}) {
    return (
        <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-[0_10px_26px_rgba(67,53,0,0.07)] ring-1 ring-[#eee6c7] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(67,53,0,0.11)]">
            <div className="absolute inset-x-0 top-0 h-1 bg-[#FAF92A]" />
            <div className="flex min-h-[104px] items-center justify-between gap-5">
                <div>
                    <p className="text-sm font-semibold text-slate-500">{title}</p>
                    <h2 className={`mt-3 text-3xl font-black tracking-[-0.04em] ${color}`}>{value}</h2>
                </div>

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FAF92A]/45 text-xl font-black text-[#9b6900]">{icon}</div>
            </div>
        </div>
    );
}