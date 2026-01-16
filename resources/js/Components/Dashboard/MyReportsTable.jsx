export default function MyReportsTable({ observations, onRowClick, showObservedPerson = true }) {
    if (!observations || observations.length === 0) {
        return (
            <div className="flex items-center justify-center h-24 text-gray-400 dark:text-gray-500 border-2 border-dashed dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
                <span className="px-4 text-xs text-center sm:text-sm">
                    No hay reportes para mostrar en esta categoría.
                </span>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto border border-gray-100 dark:border-gray-700 rounded-lg">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700">
                    <tr>
                        {showObservedPerson && <th className="px-4 py-3">Observada</th>}
                        <th className="px-4 py-3">Observador</th>
                        <th className="px-4 py-3">Descripcción</th>
                        <th className="px-4 py-3">Ubicación</th>
                        <th className="px-4 py-3">Fecha</th>
                        <th className="px-4 py-3">Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {observations.map((obs) => {
                        const isReadyToClose = obs.status === "en_progreso";
                        return (
                            <tr
                                key={obs.id}
                                onClick={() => onRowClick(obs)}
                                className={`transition-colors bg-white dark:bg-gray-800 border-b dark:border-gray-700 cursor-pointer ${
                                    isReadyToClose
                                        ? "hover:bg-green-50 dark:hover:bg-green-900/20 border-l-4 border-l-green-500"
                                        : "hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                }`}
                            >
                                {showObservedPerson && (
                                    <td className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-100">
                                        {obs.observed_person || "N/A"}
                                    </td>
                                )}
                                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                                    {obs.user?.name || "N/A"}
                                </td>
                                <td className="px-4 py-3 font-medium text-blue-600 dark:text-blue-400">
                                    <div className="flex items-center gap-2">
                                        {isReadyToClose && (
                                            <span
                                                className="flex items-center justify-center w-5 h-5 bg-green-100 dark:bg-green-900/50 rounded-full"
                                                title="Lista para cerrar"
                                            >
                                                <svg
                                                    className="w-3 h-3 text-green-600 dark:text-green-400"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M5 13l4 4L19 7"
                                                    />
                                                </svg>
                                            </span>
                                        )}
                                        <span className="truncate max-w-[150px]">
                                            {obs.description}
                                        </span>
                                    </div>
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
                                    {isReadyToClose ? (
                                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 animate-pulse">
                                            ✓ Lista para cerrar
                                        </span>
                                    ) : (
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                obs.status === "en_progreso"
                                                    ? "bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300"
                                                    : "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300"
                                            }`}
                                        >
                                            {obs.status === "en_progreso"
                                                ? "En revisión"
                                                : "Cerrada"}
                                        </span>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
