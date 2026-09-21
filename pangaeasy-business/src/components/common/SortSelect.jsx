export default function SortSelect({
    value,
    onChange,
    options,
}) {
    return (
        <div className="flex flex-wrap gap-3">
        <select 
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 focus:border-blue-500 focus:outline-none
            "
        >
            {options.map((option) => (
                <option
                    key={option.value}
                    value={option.value}
                >
                    {option.label}
                </option>
            ))}
        </select>
        </div>
        
    );
}