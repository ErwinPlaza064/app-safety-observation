export default function MyReportsTable({ observations, onRowClick }) {
    if (!observations || observations.length === 0) {
        return (
            <div className="flex items-center justify-center h-24 text-gray-400 dark:text-gray-500 border-2 border-dashed dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
                <span className="px-4 text-xs text-center sm:text-sm">
                    No tienes reportes enviados aún.
                </span>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto border border-gray-100 dark:border-gray-700 rounded-lg">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700">
                    <tr>
                        <th className="px-4 py-3">Descripcción</th>
                        <th className="px-4 py-3">Ubicación</th>
                        <th className="px-4 py-3">Fecha</th>
                        <th className="px-4 py-3">Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {observations.map((obs) => (
                        <tr
                            key={obs.id}
                            onClick={() => onRowClick(obs)}
                            className="transition-colors bg-white dark:bg-gray-800 border-b dark:border-gray-700 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        >
                            <td className="px-4 py-3 font-medium text-blue-600 dark:text-blue-400 whitespace-nowrap">
                                {obs.description}
                            </td>
                            <td className="px-4 py-3 dark:text-gray-300">
                                {obs.area?.name || "N/A"}
                            </td>
                            <td className="px-4 py-3 dark:text-gray-300">
                                {new Date(
                                    obs.observation_date
                                ).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3">
                                <span
                                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                        obs.status === "en_progreso"
                                            ? "bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300"
                                            : "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300"
                                    }`}
                                >
                                    {obs.status === "en_progreso"
                                        ? "Abierta"
                                        : "Cerrada"}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
