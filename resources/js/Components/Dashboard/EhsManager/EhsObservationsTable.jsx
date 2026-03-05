import React from "react";
import { IoMdClose, IoMdShare } from "react-icons/io";
import { CgFileDocument } from "react-icons/cg";

export default function EhsObservationsTable({
    searchSectionRef,
    params,
    handleFilterChange,
    setParams,
    selectedPayroll,
    setSelectedPayroll,
    recentObservations,
    filteredRecent,
    handleRowClick,
    handleRowMouseEnter,
    handleRowMouseLeave,
    activeTab,
    setActiveTab,
    canViewAllPlants,
    handleShare,
    copiedId
}) {
    return (
        <div className="space-y-8 animate-fade-in">
            <div
                ref={searchSectionRef}
                className="p-4 bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl"
            >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="relative w-full md:w-1/3">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg
                                className="w-5 h-5 text-gray-400 dark:text-gray-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                ></path>
                            </svg>
                        </div>
                        <input
                            type="text"
                            name="search"
                            value={params.search}
                            onChange={handleFilterChange}
                            placeholder="Buscar folio, persona, descripción..."
                            className="w-full py-2 pl-10 pr-10 text-sm bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:ring-[#1e3a8a] focus:border-[#1e3a8a]"
                        />
                        {params.search && (
                            <button
                                type="button"
                                onClick={() =>
                                    setParams({ ...params, search: "" })
                                }
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <IoMdClose className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {(params.search?.trim() !== "" || selectedPayroll) ? (
                <div className="space-y-4 animate-fade-in">
                    <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-600 rounded-lg shadow-lg">
                                <CgFileDocument className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100">
                                    Historial:{" "}
                                    {selectedPayroll?.observed_person ||
                                        params.search}
                                </h3>
                                <p className="text-sm text-blue-700 dark:text-blue-300">
                                    {selectedPayroll
                                        ? `Nómina: ${selectedPayroll.payroll_number}`
                                        : "Búsqueda personalizada"}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                setSelectedPayroll(null);
                                setParams({ ...params, search: "" });
                            }}
                            className="px-4 py-2 text-sm font-semibold text-blue-700 dark:text-blue-300 bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-all flex items-center gap-2"
                        >
                            <IoMdClose className="w-4 h-4" />
                            Regresar al Dashboard
                        </button>
                    </div>

                    <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase dark:text-gray-300 bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3">Folio</th>
                                        <th className="px-6 py-3">Persona Observada</th>
                                        <th className="px-6 py-3">Observador</th>
                                        <th className="px-6 py-3">Fecha</th>
                                        <th className="px-6 py-3">Descripción</th>
                                        <th className="px-6 py-3">Planta</th>
                                        <th className="px-6 py-3">Área</th>
                                        <th className="px-6 py-3">Estado</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {recentObservations.map((obs) => (
                                        <tr
                                            key={obs.id}
                                            onClick={() => handleRowClick(obs)}
                                            className="transition-colors duration-150 bg-white cursor-pointer dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                        >
                                            <td className="px-6 py-4 font-bold text-blue-600 dark:text-blue-400">#{obs.id}</td>
                                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">{obs.observed_person || "N/A"}</td>
                                            <td className="px-6 py-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">{obs.user?.name || "N/A"}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{new Date(obs.observation_date).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 max-w-xs truncate" title={obs.description}>{obs.description}</td>
                                            <td className="px-6 py-4">{obs.plant?.name || "N/A"}</td>
                                            <td className="px-6 py-4">{obs.area?.name || "N/A"}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${obs.status === "en_progreso" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}`}>
                                                    {obs.status === "en_progreso" ? "Abierta" : "Cerrada"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                <div id="recent-observations-table" className="overflow-hidden bg-white border border-gray-100 shadow-xl dark:bg-gray-800 dark:border-gray-700 rounded-3xl">
                    <div className="flex flex-col gap-4 px-6 py-4 border-b border-gray-100 dark:border-gray-700 sm:flex-row sm:items-center sm:justify-between">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Observaciones Recientes</h3>
                        <div className="flex p-1 bg-gray-100 dark:bg-gray-700 rounded-xl">
                            <button
                                onClick={() => setActiveTab("actos")}
                                className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === "actos" ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"}`}
                            >ACTOS</button>
                            <button
                                onClick={() => setActiveTab("condiciones")}
                                className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === "condiciones" ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"}`}
                            >CONDICIONES</button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase dark:text-gray-300 bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3">{activeTab === "actos" ? "Observada" : "Condición"}</th>
                                    <th className="px-6 py-3">Descripción</th>
                                    <th className="px-6 py-3">Observador</th>
                                    <th className="px-6 py-3">Planta</th>
                                    {activeTab !== "condiciones" && <th className="px-6 py-3">Área</th>}
                                    <th className="px-6 py-3">Estado</th>
                                    <th className="px-6 py-3 text-center">Fecha</th>
                                    {canViewAllPlants && <th className="px-6 py-3 text-center">Acción</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredRecent.length > 0 ? (
                                    filteredRecent.map((obs) => (
                                        <tr
                                            key={obs.id}
                                            onClick={() => handleRowClick(obs)}
                                            onMouseEnter={(e) => handleRowMouseEnter(obs, e)}
                                            onMouseLeave={handleRowMouseLeave}
                                            className="transition-colors duration-150 bg-white cursor-pointer dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                        >
                                            <td className="px-6 py-4 font-medium text-blue-600 dark:text-blue-400 whitespace-nowrap">{obs.observed_person}</td>
                                            <td className="max-w-xs px-6 py-4 text-gray-900 truncate dark:text-gray-200">{obs.description}</td>
                                            <td className="px-6 py-4 text-gray-900 dark:text-gray-200">{obs.user?.name}</td>
                                            <td className="px-6 py-4 text-gray-900 dark:text-gray-200">{obs.plant?.name || "N/A"}</td>
                                            {activeTab !== "condiciones" && <td className="px-6 py-4 text-gray-900 dark:text-gray-200">{obs.area?.name || "N/A"}</td>}
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${obs.status === "en_progreso" ? "bg-blue-100 text-blue-800" : obs.status === "cerrada" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                                                    {obs.status === "en_progreso" ? "Abierta" : obs.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">{new Date(obs.observation_date).toLocaleDateString()}</td>
                                            {canViewAllPlants && (
                                                <td className="px-6 py-4 text-center">
                                                    <button
                                                        onClick={(e) => handleShare(e, obs)}
                                                        className={`p-2 rounded-lg transition-all active:scale-90 ${copiedId === obs.id ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50"}`}
                                                    >
                                                        {copiedId === obs.id ? <span className="text-[10px] font-bold">¡Copiado!</span> : <IoMdShare className="w-4 h-4" />}
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">No se encontraron observaciones con esos filtros.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

