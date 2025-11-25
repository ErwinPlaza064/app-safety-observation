export default function EhsMetricCard({
    title,
    value,
    subtitle,
    color = "blue",
    icon,
}) {
    const colors = {
        blue: "border-blue-600",
        red: "border-red-600",
        green: "border-green-600",
        purple: "border-purple-600",
        orange: "border-orange-500",
    };

    return (
        <div
            className={`bg-white rounded-xl shadow-sm p-6 border-l-4 ${colors[color]} flex flex-col justify-between h-full`}
        >
            <div className="flex items-start justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600">{title}</h3>
                {icon && <div className="text-gray-400">{icon}</div>}
            </div>
            <div>
                <div className="mb-1 text-3xl font-bold text-gray-800">
                    {value}
                </div>
                <div className="text-xs text-gray-500">{subtitle}</div>
            </div>
        </div>
    );
}
