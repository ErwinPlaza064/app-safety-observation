import React, { useState, useMemo } from "react";
import { Link } from "@inertiajs/react";
import Modal from "@/Components/Modal";

export default function DrillDownModal({
    show,
    title,
    data,
    onClose,
    type,
    onItemClick,
}) {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredData = useMemo(() => {
        if (!data || !Array.isArray(data) || !searchTerm) return data;

        const term = searchTerm.toLowerCase();
        return data.filter((item) => {
            const name = (item.name || item.observed_person || "").toLowerCase();
            const payroll = (item.payroll_number || item.email || "").toLowerCase();
            return name.includes(term) || payroll.includes(term);
        });
    }, [data, searchTerm]);

    const displayData = type === "participation_summary" ? data : filteredData;
    return (
        <Modal show={show} onClose={onClose} maxWidth="4xl">
            <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 mb-5 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                            {title}
                        </h3>
                        {type === "participation_summary" && (
                            <Link
                                href={route('participation.history')}
                                className="inline-flex items-center px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 transition-colors"
                            >
                                <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Ver Historial Completo
                            </Link>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        {type !== "participation_summary" && (
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-10 pr-3 py-2 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-200 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-all group-hover:border-gray-300 dark:group-hover:border-gray-500"
                                    placeholder="Buscar por nombre o nómina..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        )}
                        <button
                            onClick={onClose}
                            className="p-1 text-gray-400 dark:text-gray-500 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
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
                </div>

                <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                    {displayData && (type === "participation_summary" || displayData.length > 0) ? (
                        <>
                            {type === "participation_summary" && (
                                <div className="space-y-4">
                                    <div className="overflow-hidden border border-gray-100 rounded-xl dark:border-gray-700">
                                        <table className="w-full text-sm text-left">
                                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                                                <tr>
                                                    <th className="px-6 py-4">Periodo</th>
                                                    <th className="px-6 py-4 text-center">Tasa</th>
                                                    <th className="px-6 py-4 text-center">Participantes</th>
                                                    <th className="px-6 py-4 text-right">Acción</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                                {[
                                                    {
                                                        key: "participation_daily",
                                                        label: "Hoy",
                                                        data: data?.participation_daily,
                                                    },
                                                    {
                                                        key: "participation_weekly",
                                                        label: "Esta Semana",
                                                        data: data?.participation_weekly,
                                                    },
                                                    {
                                                        key: "participation_monthly",
                                                        label: "Este Mes",
                                                        data: data?.participation_monthly,
                                                    },
                                                ].map((row) => (
                                                    <tr
                                                        key={row.key}
                                                        className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                                    >
                                                        <td className="px-6 py-4 font-bold text-gray-900 dark:text-gray-100">
                                                            {row.label}
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">
                                                                {row.data?.rate}%
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-center font-medium text-gray-600 dark:text-gray-400">
                                                            {row.data?.count} empleados
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <button
                                                                onClick={() =>
                                                                    onItemClick &&
                                                                    onItemClick(
                                                                        row.key
                                                                    )
                                                                }
                                                                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1 justify-end ml-auto"
                                                            >
                                                                Ver lista
                                                                <svg
                                                                    className="w-3 h-3"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth="3"
                                                                        d="M9 5l7 7-7 7"
                                                                    />
                                                                </svg>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <p className="text-[11px] text-gray-500 dark:text-gray-400 italic text-center">
                                        * La tasa se calcula sobre el total de
                                        empleados registrados en el sistema.
                                    </p>
                                </div>
                            )}

                            {type !== "participation_summary" && (
                                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                    {type.startsWith("participation_") && (
                                        <>
                                            <thead className="sticky top-0 text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700">
                                                <tr>
                                                    <th className="px-4 py-2 bg-gray-50 dark:bg-gray-700">
                                                        Empleado
                                                    </th>
                                                    <th className="px-4 py-2 bg-gray-50 dark:bg-gray-700">
                                                        Área
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
                                                            <div>
                                                                {item.name}
                                                                <div className="text-xs font-normal text-gray-500 dark:text-gray-400">
                                                                    {item.email}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                                                            {item.area}
                                                        </td>
                                                        <td className="px-4 py-3 text-right">
                                                            <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300">
                                                                {item.count}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </>
                                    )}

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
                                                            <div className="flex flex-col">
                                                                <span>
                                                                    {
                                                                        item.observed_person
                                                                    }
                                                                </span>
                                                                <span className="text-xs font-normal text-gray-500">
                                                                    Nómina:{" "}
                                                                    {
                                                                        item.payroll_number
                                                                    }
                                                                </span>
                                                            </div>
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

                                    {[
                                        "high_risk",
                                        "open",
                                        "closed",
                                        "total",
                                    ].includes(type) && (
                                        <>
                                            <thead className="sticky top-0 text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700">
                                                <tr>
                                                    <th className="px-4 py-2 bg-gray-50 dark:bg-gray-700">
                                                        Folio
                                                    </th>
                                                    <th className="px-4 py-2 bg-gray-50 dark:bg-gray-700">
                                                        Persona Observada
                                                    </th>
                                                    <th className="px-4 py-2 bg-gray-50 dark:bg-gray-700">
                                                        Observador
                                                    </th>
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
                                                                : type ===
                                                                  "closed"
                                                                ? "hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-500 dark:hover:border-green-400"
                                                                : "hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-500 dark:hover:border-blue-400"
                                                        }`}
                                                    >
                                                        <td className="px-4 py-3 font-bold text-blue-600 dark:text-blue-400">
                                                            #{obs.id}
                                                        </td>
                                                        <td className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-100 whitespace-nowrap">
                                                            {obs.observed_person ||
                                                                "N/A"}
                                                        </td>
                                                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                                                            {obs.user?.name ||
                                                                "N/A"}
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap dark:text-gray-300">
                                                            {new Date(
                                                                obs.observation_date
                                                            ).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                                                            {obs.area?.name ||
                                                                "N/A"}
                                                        </td>
                                                        <td className="px-4 py-3 dark:text-gray-300">
                                                            <p
                                                                className="truncate max-w-[150px]"
                                                                title={
                                                                    obs.description
                                                                }
                                                            >
                                                                {
                                                                    obs.description
                                                                }
                                                            </p>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            {type ===
                                                            "high_risk" ? (
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
                            )}
                        </>
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
