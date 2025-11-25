import { useState, useEffect, useRef } from "react";
import { router } from "@inertiajs/react"; // Importar router
import EhsMetricCard from "@/Components/Dashboard/EhsMetricCard";
import ObservationDetailsModal from "@/Components/Dashboard/ObservationDetailsModal";
import { CgFileDocument, CgDanger } from "react-icons/cg";
import { BiPulse, BiTrendingUp } from "react-icons/bi";

export default function EhsManagerView({ user, stats, areas, filters }) {
    const [selectedObservation, setSelectedObservation] = useState(null);

    // 1. ESTADO PARA LOS FILTROS
    const [params, setParams] = useState({
        search: filters?.search || "",
        area_id: filters?.area_id || "",
        status: filters?.status || "",
    });

    const isFirstRender = useRef(true);

    // 2. EFECTO DE RECARGA AUTOMÁTICA (DEBOUNCE)
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timer = setTimeout(() => {
            router.get(route("dashboard"), params, {
                preserveState: true,
                preserveScroll: true,
                only: ["ehsStats", "filters"], // Recarga parcial para optimizar
                replace: true,
            });
        }, 300); // Espera 300ms al escribir

        return () => clearTimeout(timer);
    }, [params]);

    // 3. MANEJADOR DE CAMBIOS EN INPUTS
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
            {/* Header */}
            <div className="flex flex-col items-center justify-between md:flex-row">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                        Dashboard EHS - {user.name}
                    </h2>
                    <p className="text-gray-500">
                        Estadísticas y Métricas de Seguridad
                    </p>
                </div>
                {/* Botones de exportación */}
                <div className="flex gap-3 mt-4 md:mt-0">
                    <a
                        href={route("observations.export.csv")}
                        target="_blank"
                        className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        Exportar CSV
                    </a>
                    <a
                        href={route("observations.export.pdf")}
                        target="_blank"
                        className="px-4 py-2 bg-[#1e3a8a] text-white rounded-lg text-sm font-medium hover:bg-blue-900 flex items-center"
                    >
                        Exportar PDF
                    </a>
                </div>
            </div>

            {/* Tarjetas de Métricas */}
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
                <EhsMetricCard
                    title="Riesgo Alto"
                    value={stats.high_risk}
                    subtitle="Acción inmediata"
                    color="red"
                    icon={<CgDanger className="w-6 h-6 text-red-600" />}
                />
                <EhsMetricCard
                    title="Cerradas"
                    value={`${stats.closed_rate}%`}
                    subtitle="Tasa de resolución"
                    color="green"
                    icon={<BiTrendingUp className="w-6 h-6 text-green-600" />}
                />
            </div>

            {/* Gráficas (Omitidas por brevedad, mantenlas igual que antes) */}
            {/* ... código de grid de gráficas ... */}

            {/* --- BARRA DE HERRAMIENTAS FUNCIONAL --- */}
            <div className="p-4 bg-white border border-gray-100 shadow-sm rounded-xl">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    {/* Buscador */}
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

                    {/* Filtros */}
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

            {/* Tabla de Resultados Filtrados */}
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
                                                        : "bg-green-100 text-green-800"
                                                }`}
                                            >
                                                {obs.status === "en_progreso"
                                                    ? "Abierta"
                                                    : "Cerrada"}
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

            <ObservationDetailsModal
                show={!!selectedObservation}
                observation={selectedObservation}
                onClose={handleCloseModal}
            />
        </div>
    );
}
