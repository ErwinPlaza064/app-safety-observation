import React from "react";
import Modal from "@/Components/Modal";

export default function DrillDownModal({ show, title, data, onClose }) {
    return (
        <Modal show={show} onClose={onClose} maxWidth="lg">
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

                {/* Contenido (Tabla con Scroll) */}
                <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                    {data && data.length > 0 ? (
                        <table className="w-full text-sm text-left text-gray-500">
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
                                        className="transition-colors hover:bg-purple-50/50"
                                    >
                                        <td className="px-4 py-3 font-medium text-gray-900">
                                            {item.observed_person || item.name}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                {item.total}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                            <svg
                                className="w-12 h-12 mb-2 text-gray-300"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                />
                            </svg>
                            <p>No hay datos detallados disponibles.</p>
                        </div>
                    )}
                </div>

                <div className="flex justify-end pt-4 mt-6 border-t border-gray-100">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </Modal>
    );
}
