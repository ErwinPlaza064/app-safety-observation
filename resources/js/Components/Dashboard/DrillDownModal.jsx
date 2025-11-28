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
                <div className="flex items-center justify-between pb-4 mb-5 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 transition-colors hover:text-gray-600"
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
                        <table className="w-full text-sm text-left text-gray-500">
                            {type === "recidivism" && (
                                <>
                                    <thead className="sticky top-0 text-xs text-gray-700 uppercase bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2 bg-gray-50">
                                                Empleado
                                            </th>
                                            <th className="px-4 py-2 text-right bg-gray-50">
                                                Reportes
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {data.map((item, index) => (
                                            <tr
                                                key={index}
                                                onClick={() =>
                                                    onItemClick &&
                                                    onItemClick(item)
                                                }
                                                className="transition-colors border-l-4 border-transparent cursor-pointer hover:bg-purple-50 hover:border-purple-500"
                                            >
                                                <td className="px-4 py-3 font-medium text-gray-900">
                                                    {item.observed_person ||
                                                        item.name}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                        {item.total}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </>
                            )}

                            {type === "high_risk" && (
                                <>
                                    <thead className="sticky top-0 text-xs text-gray-700 uppercase bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2 bg-gray-50">
                                                Fecha
                                            </th>
                                            <th className="px-4 py-2 bg-gray-50">
                                                Ubicación
                                            </th>
                                            <th className="px-4 py-2 bg-gray-50">
                                                Descripción
                                            </th>
                                            <th className="px-4 py-2 bg-gray-50">
                                                Estado
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {data.map((obs) => (
                                            <tr
                                                key={obs.id}
                                                onClick={() =>
                                                    onItemClick &&
                                                    onItemClick(obs)
                                                }
                                                className="transition-colors border-l-4 border-transparent cursor-pointer hover:bg-blue-50 hover:border-blue-500"
                                            >
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    {new Date(
                                                        obs.observation_date
                                                    ).toLocaleDateString()}
                                                </td>
                                                <td className="px-4 py-3 font-medium text-gray-900">
                                                    {obs.area?.name || "N/A"}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <p
                                                        className="truncate max-w-[200px]"
                                                        title={obs.description}
                                                    >
                                                        {obs.description}
                                                    </p>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="inline-flex px-2 text-xs font-semibold leading-5 text-red-800 bg-red-100 rounded-full">
                                                        Crítico
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </>
                            )}
                        </table>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                            <p>No hay datos detallados disponibles.</p>
                        </div>
                    )}
                </div>

                <div className="flex justify-end pt-4 mt-6 border-t border-gray-100">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </Modal>
    );
}
