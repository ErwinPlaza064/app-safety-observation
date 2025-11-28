import { useState, useEffect, useRef } from "react";
import { router } from "@inertiajs/react";
import EhsMetricCard from "@/Components/Dashboard/EhsMetricCard";
import ObservationDetailsModal from "@/Components/Dashboard/ObservationDetailsModal";
import { CgFileDocument, CgDanger } from "react-icons/cg";
import { BiPulse, BiTrendingUp } from "react-icons/bi";
import DrillDownModal from "@/Components/Dashboard/DrillDownModal";

export default function EhsManagerView({ user, stats, areas, filters }) {
    const [selectedObservation, setSelectedObservation] = useState(null);

    const [activeMetric, setActiveMetric] = useState(null);

    const [params, setParams] = useState({
        search: filters?.search || "",
        area_id: filters?.area_id || "",
        status: filters?.status || "",
    });

    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timer = setTimeout(() => {
            router.get(route("dashboard"), params, {
                preserveState: true,
                preserveScroll: true,
                only: ["ehsStats", "filters"],
                replace: true,
            });
        }, 300);

        return () => clearTimeout(timer);
    }, [params]);

    const handleFilterChange = (e) => {
        setParams({ ...params, [e.target.name]: e.target.value });
    };

    const handleRowClick = (obs) => setSelectedObservation(obs);
    const handleCloseModal = () => setSelectedObservation(null);

    const getCategoryColor = (index) => {
        const colors = [
            "bg-red-100 text-red-800",
            "bg-orange-100 text-orange-800",
            "bg-yellow-100 text-yellow-800",
            "bg-blue-100 text-blue-800",
            "bg-purple-100 text-purple-800",
        ];
        return colors[index % colors.length];
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col items-center justify-between md:flex-row">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                        Dashboard EHS - {user.name}
                    </h2>
                    <p className="text-gray-500">
                        Estadísticas y Métricas de Seguridad
                    </p>
                </div>
                <div className="flex gap-3 mt-4 md:mt-0">
                    <a
                        href={route("observations.export.pdf")}
                        target="_blank"
                        className="px-4 py-2 bg-[#1e3a8a] text-white rounded-lg text-sm font-medium hover:bg-blue-900 flex items-center"
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
                        Exportar PDF
                    </a>
                </div>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <EhsMetricCard
                    title="Total"
                    value={stats.total_month}
                    subtitle="Este mes"
                    color="blue"
                    icon={<CgFileDocument className="w-6 h-6 text-blue-600" />}
                />
                <EhsMetricCard
                    title="Abiertas"
                    value={stats.open}
                    subtitle="Requieren atención"
                    color="orange"
                    icon={<BiPulse className="w-6 h-6 text-orange-500" />}
                />
                <div
                    onClick={() => setActiveMetric("high_risk")}
                    className="cursor-pointer transition-transform hover:scale-[1.02]"
                >
                    <EhsMetricCard
                        title="Riesgo Alto"
                        value={stats.high_risk}
                        subtitle="Acción inmediata"
                        color="red"
                        icon={<CgDanger className="w-6 h-6 text-red-600" />}
                    />
                </div>
                <EhsMetricCard
                    title="Cerradas"
                    value={`${stats.closed_rate}%`}
                    subtitle="Tasa de resolución"
                    color="green"
                    icon={<BiTrendingUp className="w-6 h-6 text-green-600" />}
                />
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="p-6 bg-white shadow-sm rounded-xl">
                    <h3 className="flex items-center mb-6 text-lg font-semibold text-gray-800">
                        <svg
                            className="w-5 h-5 mr-2 text-[#1e3a8a]"
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
                        {stats.by_plant.map((plant, index) => (
                            <div key={index}>
                                <div className="flex justify-between mb-1 text-sm">
                                    <span className="text-gray-600">
                                        {plant.name}
                                    </span>
                                    <span className="font-semibold text-gray-800">
                                        {plant.count}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2.5">
                                    <div
                                        className="bg-[#1e3a8a] h-2.5 rounded-full"
                                        style={{
                                            width: `${
                                                (plant.count /
                                                    Math.max(
                                                        ...stats.by_plant.map(
                                                            (p) => p.count
                                                        ),
                                                        1
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

                <div className="p-6 bg-white shadow-sm rounded-xl">
                    <h3 className="flex items-center mb-6 text-lg font-semibold text-gray-800">
                        <CgDanger className="w-5 h-5 mr-2 text-[#1e3a8a]" /> Top
                        Categorías
                    </h3>
                    <div className="space-y-3">
                        {stats.top_categories.map((cat, index) => (
                            <div
                                key={cat.id}
                                className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                            >
                                <div className="flex items-center">
                                    <span
                                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3 ${getCategoryColor(
                                            index
                                        )}`}
                                    >
                                        {index + 1}
                                    </span>
                                    <span className="text-sm font-medium text-gray-700">
                                        {cat.name}
                                    </span>
                                </div>
                                <span className="px-2 py-1 text-sm font-bold text-gray-900 bg-white border rounded shadow-sm">
                                    {cat.observations_count}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div
                    onClick={() => setActiveMetric("recidivism")}
                    className="flex flex-col items-center justify-center p-6 text-center transition-all bg-white border-l-4 border-purple-600 shadow-sm cursor-pointer rounded-xl hover:shadow-md hover:bg-purple-50/30"
                >
                    <div className="p-4 mb-4 rounded-full bg-purple-50">
                        <svg
                            className="w-10 h-10 text-purple-600"
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
                    <h3 className="mb-2 font-medium text-gray-500">
                        Personas Reincidentes
                    </h3>
                    <span className="mb-2 text-5xl font-bold text-gray-800">
                        {stats.recidivism}
                    </span>
                    <p className="text-sm text-gray-400">
                        Empleados con &gt;1 reporte
                        <br />
                        <span className="text-xs font-semibold text-purple-600">
                            (Ver detalles)
                        </span>
                    </p>
                </div>
            </div>
            <div className="p-4 bg-white border border-gray-100 shadow-sm rounded-xl">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="relative w-full md:w-1/3">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg
                                className="w-5 h-5 text-gray-400"
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
                            className="w-full py-2 pl-10 pr-4 text-sm border-gray-300 rounded-lg focus:ring-[#1e3a8a] focus:border-[#1e3a8a]"
                        />
                    </div>

                    <div className="flex flex-col w-full gap-2 sm:flex-row md:w-auto">
                        <select
                            name="area_id"
                            value={params.area_id}
                            onChange={handleFilterChange}
                            className="text-sm border-gray-300 rounded-lg focus:ring-[#1e3a8a] focus:border-[#1e3a8a]"
                        >
                            <option value="">Todas las Plantas</option>
                            {areas &&
                                areas.map((area) => (
                                    <option key={area.id} value={area.id}>
                                        {area.name}
                                    </option>
                                ))}
                        </select>

                        <select
                            name="status"
                            value={params.status}
                            onChange={handleFilterChange}
                            className="text-sm border-gray-300 rounded-lg focus:ring-[#1e3a8a] focus:border-[#1e3a8a]"
                        >
                            <option value="">Todos los Estados</option>
                            <option value="en_progreso">Abiertas</option>
                            <option value="cerrada">Cerradas</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="overflow-hidden bg-white shadow-sm rounded-xl">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800">
                        Observaciones Recientes
                    </h3>
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                        {stats.recent.length} mostrados
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th className="px-6 py-3">Observada</th>
                                <th className="px-6 py-3">Descripción</th>
                                <th className="px-6 py-3">Observador</th>
                                <th className="px-6 py-3">Ubicación</th>
                                <th className="px-6 py-3">Estado</th>
                                <th className="px-6 py-3">Fecha</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {stats.recent.length > 0 ? (
                                stats.recent.map((obs) => (
                                    <tr
                                        key={obs.id}
                                        onClick={() => handleRowClick(obs)}
                                        className="transition-colors duration-150 bg-white cursor-pointer hover:bg-blue-50"
                                    >
                                        <td className="px-6 py-4 font-medium text-blue-600 whitespace-nowrap">
                                            {obs.observed_person}
                                        </td>
                                        <td className="max-w-xs px-6 py-4 truncate">
                                            {obs.description}
                                        </td>
                                        <td className="px-6 py-4">
                                            {obs.user?.name}
                                        </td>
                                        <td className="px-6 py-4">
                                            {obs.area?.name}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                    obs.status === "en_progreso"
                                                        ? "bg-blue-100 text-blue-800"
                                                        : obs.status ===
                                                          "cerrada"
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-gray-100 text-gray-800"
                                                }`}
                                            >
                                                {obs.status === "en_progreso"
                                                    ? "Abierta"
                                                    : obs.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {new Date(
                                                obs.observation_date
                                            ).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="px-6 py-10 text-center text-gray-500"
                                    >
                                        No se encontraron observaciones con esos
                                        filtros.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <DrillDownModal
                show={!!activeMetric}
                onClose={() => setActiveMetric(null)}
                title={
                    activeMetric === "recidivism"
                        ? "Detalle: Personas Reincidentes"
                        : activeMetric === "high_risk"
                        ? "Atención Inmediata: Riesgo Alto"
                        : ""
                }
                data={
                    activeMetric === "recidivism"
                        ? stats.recidivism_list
                        : activeMetric === "high_risk"
                        ? stats.high_risk_list
                        : []
                }
                type={activeMetric}
                onItemClick={(item) => {
                    setActiveMetric(null);

                    if (activeMetric === "high_risk") {
                        setTimeout(() => setSelectedObservation(item), 100);
                    } else if (activeMetric === "recidivism") {
                        setParams({
                            ...params,
                            search: item.observed_person,
                        });
                    }
                }}
            />
            <ObservationDetailsModal
                show={!!selectedObservation}
                observation={selectedObservation}
                onClose={handleCloseModal}
            />
        </div>
    );
}
