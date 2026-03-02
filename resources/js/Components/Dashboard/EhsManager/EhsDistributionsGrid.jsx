import React from "react";
import { CgDanger } from "react-icons/cg";

export default function EhsDistributionsGrid({ 
    canViewAllPlants, 
    stats, 
    handleGenericClick, 
    setActiveMetric 
}) {
    const getCategoryColor = (index) => {
        const colors = [
            "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400",
            "bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400",
            "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/40 dark:text-yellow-400",
            "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400",
            "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400",
        ];
        return colors[index % colors.length];
    };

    return (
        <div
            className={`grid grid-cols-1 gap-6 ${
                canViewAllPlants
                    ? "lg:grid-cols-2 xl:grid-cols-4"
                    : "lg:grid-cols-2"
            }`}
        >
            {canViewAllPlants && stats.by_real_plant && (
                <div className="p-6 bg-white shadow-sm dark:bg-gray-800 rounded-xl">
                    <h3 className="flex items-center mb-6 text-lg font-semibold text-gray-800 dark:text-gray-100">
                        <svg
                            className="w-5 h-5 mr-2 text-[#1e3a8a] dark:text-blue-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                        </svg>
                        Distribución por Planta
                    </h3>
                    <div className="space-y-4">
                        {stats.by_real_plant.map((plant, index) => (
                            <div
                                key={plant.name}
                                onClick={() =>
                                    handleGenericClick(
                                        `Reportes: ${plant.name}`,
                                        plant.list,
                                    )
                                }
                                onKeyDown={(e) => { 
                                    if (e.key === 'Enter' || e.key === ' ') { 
                                        e.preventDefault(); 
                                        handleGenericClick(`Reportes: ${plant.name}`, plant.list); 
                                    } 
                                }}
                                role="button"
                                tabIndex={0}
                                className="cursor-pointer group"
                            >
                                <div className="flex justify-between mb-1 text-sm">
                                    <span className="font-medium text-gray-600 transition-colors dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                        {plant.name}
                                    </span>
                                    <span className="font-semibold text-gray-800 dark:text-gray-100">
                                        {plant.count}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5">
                                    <div
                                        className="bg-[#1e3a8a] dark:bg-blue-500 h-2.5 rounded-full transition-all group-hover:bg-blue-500 dark:group-hover:bg-blue-400"
                                        style={{
                                            width: `${(plant.count / Math.max(...stats.by_real_plant.map((p) => p.count), 1)) * 100}%`,
                                        }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {canViewAllPlants && (
                <div className="p-6 bg-white shadow-sm dark:bg-gray-800 rounded-xl">
                    <h3 className="flex items-center mb-6 text-lg font-semibold text-gray-800 dark:text-gray-100">
                        <svg
                            className="w-5 h-5 mr-2 text-[#1e3a8a] dark:text-blue-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                        </svg>
                        Distribución por Área
                    </h3>
                    <div className="space-y-4">
                        {stats.by_plant.map((plant, index) => (
                            <div
                                key={plant.name}
                                onClick={() =>
                                    handleGenericClick(
                                        `Reportes: ${plant.name}`,
                                        plant.list,
                                    )
                                }
                                onKeyDown={(e) => { 
                                    if (e.key === 'Enter' || e.key === ' ') { 
                                        e.preventDefault(); 
                                        handleGenericClick(`Reportes: ${plant.name}`, plant.list); 
                                    } 
                                }}
                                role="button"
                                tabIndex={0}
                                className="cursor-pointer group"
                            >
                                <div className="flex justify-between mb-1 text-sm">
                                    <span className="font-medium text-gray-600 transition-colors dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                        {plant.name}
                                    </span>
                                    <span className="font-semibold text-gray-800 dark:text-gray-100">
                                        {plant.count}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5">
                                    <div
                                        className="bg-[#1e3a8a] dark:bg-blue-500 h-2.5 rounded-full transition-all group-hover:bg-blue-500 dark:group-hover:bg-blue-400"
                                        style={{
                                            width: `${
                                                (plant.count /
                                                    Math.max(
                                                        ...stats.by_plant.map(
                                                            (p) => p.count,
                                                        ),
                                                        1,
                                                    )) *
                                                100
                                            }%`,
                                        }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="p-6 bg-white shadow-sm dark:bg-gray-800 rounded-xl">
                <h3 className="flex items-center mb-6 text-lg font-semibold text-gray-800 dark:text-gray-100">
                    <CgDanger className="w-5 h-5 mr-2 text-[#1e3a8a] dark:text-blue-400" />{" "}
                    Top Categorías
                </h3>
                <div className="space-y-3">
                    {stats.top_categories.map((cat, index) => (
                        <div
                            key={cat.id}
                            onClick={() =>
                                handleGenericClick(
                                    `Categoría: ${cat.name}`,
                                    cat.list,
                                )
                            }
                            onKeyDown={(e) => { 
                                if (e.key === 'Enter' || e.key === ' ') { 
                                    e.preventDefault(); 
                                    handleGenericClick(`Categoría: ${cat.name}`, cat.list); 
                                } 
                            }}
                            role="button"
                            tabIndex={0}
                            className="flex items-center justify-between p-3 transition-colors border border-transparent rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:border-purple-200 dark:hover:border-purple-700"
                        >
                            <div className="flex items-center">
                                <span
                                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3 ${getCategoryColor(
                                        index,
                                    )}`}
                                >
                                    {index + 1}
                                </span>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                    {cat.name}
                                </span>
                            </div>
                            <span className="px-2 py-1 text-sm font-bold text-gray-900 bg-white border rounded shadow-sm dark:text-gray-100 dark:bg-gray-600 dark:border-gray-500">
                                {cat.count}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div
                onClick={() => setActiveMetric("recidivism")}
                onKeyDown={(e) => { 
                    if (e.key === 'Enter' || e.key === ' ') { 
                        e.preventDefault(); 
                        setActiveMetric("recidivism"); 
                    } 
                }}
                role="button"
                tabIndex={0}
                className="flex flex-col items-center justify-center p-6 text-center transition-all bg-white border-l-4 border-purple-600 shadow-sm cursor-pointer dark:bg-gray-800 rounded-xl hover:shadow-md hover:bg-purple-50/30 dark:hover:bg-purple-900/20"
            >
                <div className="p-4 mb-4 rounded-full bg-purple-50 dark:bg-purple-900/30">
                    <svg
                        className="w-8 h-8 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                    </svg>
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-800 dark:text-gray-100">
                    Reincidencia
                </h3>
                <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                    Empleados con múltiples reportes abiertos
                </p>
                <div className="flex items-center gap-2">
                    <span className="text-3xl font-black text-purple-600">
                        {stats.recidivism.count}
                    </span>
                    <span className="text-xs font-bold text-purple-500 uppercase tracking-widest bg-purple-50 dark:bg-purple-900/30 px-2 py-0.5 rounded">
                        Casos
                    </span>
                </div>
                <button className="mt-4 text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline">
                    Ver listado completo →
                </button>
            </div>
        </div>
    );
}

