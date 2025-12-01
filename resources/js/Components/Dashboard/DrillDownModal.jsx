import React from "react";
import Modal from "@/Components/Modal";

export default function DrillDownModal({
    show,
    title,
    data,
    onClose,
    type,
    onItemClick,
}) {
    return (
        <Modal show={show} onClose={onClose} maxWidth="2xl">
            <div className="p-6">
                <div className="flex items-center justify-between pb-4 mb-5 border-b border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 dark:text-gray-500 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                    {data && data.length > 0 ? (
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            {type === "recidivism" && (
                                <>
                                    <thead className="sticky top-0 text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th className="px-4 py-2 bg-gray-50 dark:bg-gray-700">
                                                Empleado
                                            </th>
                                            <th className="px-4 py-2 text-right bg-gray-50 dark:bg-gray-700">
                                                Reportes
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                        {data.map((item, index) => (
                                            <tr
                                                key={index}
                                                onClick={() =>
                                                    onItemClick &&
                                                    onItemClick(item)
                                                }
                                                className="transition-colors border-l-4 border-transparent cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-500 dark:hover:border-purple-400"
                                            >
                                                <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                                                    {item.observed_person ||
                                                        item.name}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300">
                                                        {item.total}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </>
                            )}

                            {["high_risk", "open", "closed", "total"].includes(
                                type
                            ) && (
                                <>
                                    <thead className="sticky top-0 text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th className="px-4 py-2 bg-gray-50 dark:bg-gray-700">
                                                Fecha
                                            </th>
                                            <th className="px-4 py-2 bg-gray-50 dark:bg-gray-700">
                                                Ubicación
                                            </th>
                                            <th className="px-4 py-2 bg-gray-50 dark:bg-gray-700">
                                                Descripción
                                            </th>
                                            <th className="px-4 py-2 bg-gray-50 dark:bg-gray-700">
                                                Estado
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                        {data.map((obs) => (
                                            <tr
                                                key={obs.id}
                                                onClick={() =>
                                                    onItemClick &&
                                                    onItemClick(obs)
                                                }
                                                className={`cursor-pointer transition-colors border-l-4 border-transparent
                        ${
                            type === "high_risk"
                                ? "hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-500 dark:hover:border-red-400"
                                : type === "closed"
                                ? "hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-500 dark:hover:border-green-400"
                                : "hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-500 dark:hover:border-blue-400"
                        }`}
                                            >
                                                <td className="px-4 py-3 whitespace-nowrap dark:text-gray-300">
                                                    {new Date(
                                                        obs.observation_date
                                                    ).toLocaleDateString()}
                                                </td>
                                                <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                                                    {obs.area?.name || "N/A"}
                                                </td>
                                                <td className="px-4 py-3 dark:text-gray-300">
                                                    <p
                                                        className="truncate max-w-[200px]"
                                                        title={obs.description}
                                                    >
                                                        {obs.description}
                                                    </p>
                                                </td>
                                                <td className="px-4 py-3">
                                                    {type === "high_risk" ? (
                                                        <span className="inline-flex px-2 text-xs font-semibold leading-5 text-red-800 bg-red-100 rounded-full">
                                                            Crítico
                                                        </span>
                                                    ) : obs.status ===
                                                      "cerrada" ? (
                                                        <span className="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">
                                                            Cerrada
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex px-2 text-xs font-semibold leading-5 text-blue-800 bg-blue-100 rounded-full">
                                                            Abierta
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </>
                            )}
                        </table>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-gray-400 dark:text-gray-500">
                            <p>No hay datos detallados disponibles.</p>
                        </div>
                    )}
                </div>

                <div className="flex justify-end pt-4 mt-6 border-t border-gray-100 dark:border-gray-700">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </Modal>
    );
}
