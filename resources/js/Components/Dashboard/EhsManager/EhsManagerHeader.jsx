import React from "react";
import { route } from "@/utils/helpers";
import { IoMdShare } from "react-icons/io";

export default function EhsManagerHeader({ 
    user, 
    canViewAllPlants, 
    plants, 
    params, 
    handleFilterChange,
    handleExportCsv,
    handleExportPdf
}) {
    return (
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div className="space-y-1">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    Dashboard EHS - {user.name}
                </h2>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <p className="text-gray-500 dark:text-gray-400">
                        Estadísticas y Métricas de Seguridad
                    </p>
                    {canViewAllPlants && plants && plants.length > 0 && (
                        <div className="flex items-center gap-2 px-2 py-1 bg-blue-50/50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg animate-fade-in">
                            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                                Planta:
                            </span>
                            <select
                                name="plant_id"
                                value={params.plant_id}
                                onChange={handleFilterChange}
                                className="bg-transparent border-none text-sm font-bold text-blue-700 dark:text-blue-400 focus:ring-0 py-0 pl-1 pr-8 cursor-pointer hover:text-blue-800 transition-colors"
                            >
                                <option
                                    value=""
                                    className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                >
                                    Todas las Plantas
                                </option>
                                {plants.map((plant) => (
                                    <option
                                        key={plant.id}
                                        value={plant.id}
                                        className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                    >
                                        {plant.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex flex-wrap w-full gap-3 md:w-auto">
                <div className="flex items-center justify-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700 rounded-full shadow-sm">
                    <span className="relative flex w-2.5 h-2.5">
                        <span className="absolute inline-flex w-full h-full bg-blue-400 rounded-full opacity-75 animate-ping"></span>
                        <span className="relative inline-flex w-2.5 h-2.5 bg-blue-600 rounded-full"></span>
                    </span>
                    <span className="text-xs font-bold tracking-wide text-blue-700 uppercase dark:text-blue-400">
                        Sincronizado
                    </span>
                </div>
                <a
                    href={route("observations.export.csv", params)}
                    target="_blank"
                    className="px-4 py-2 bg-green-700 text-white rounded-lg text-sm font-medium hover:bg-green-800 flex items-center justify-center transition-all active:scale-95 shadow-sm"
                >
                    <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                    </svg>
                    CSV
                </a>
                <a
                    href={route("observations.export.pdf", params)}
                    target="_blank"
                    className="px-4 py-2 bg-[#1e3a8a] text-white rounded-lg text-sm font-medium hover:bg-blue-900 flex items-center justify-center transition-all active:scale-95 shadow-sm"
                >
                    <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                    </svg>
                    PDF
                </a>
                {canViewAllPlants && (
                    <button
                        onClick={() => {
                            const section = document.getElementById('recent-observations-table');
                            section?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 flex items-center justify-center transition-all active:scale-95 shadow-sm"
                    >
                        <IoMdShare className="w-4 h-4 mr-2" />
                        Compartir Reporte
                    </button>
                )}
            </div>
        </div>
    );
}

