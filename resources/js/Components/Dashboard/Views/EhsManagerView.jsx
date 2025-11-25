import { useState } from "react";
import EhsMetricCard from "@/Components/Dashboard/EhsMetricCard";
import ObservationDetailsModal from "@/Components/Dashboard/ObservationDetailsModal";
import { CgFileDocument, CgDanger } from "react-icons/cg";
import { BiPulse, BiTrendingUp } from "react-icons/bi";

export default function EhsManagerView({ user, stats }) {
    const [selectedObservation, setSelectedObservation] = useState(null);

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

    const handleRowClick = (obs) => {
        setSelectedObservation(obs);
    };

    const handleCloseModal = () => {
        setSelectedObservation(null);
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
                        href={route("observations.export.csv")}
                        target="_blank"
                        className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
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
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            />
                        </svg>
                        Exportar CSV
                    </a>

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
                    title="Total de Observaciones"
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

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="p-6 bg-white shadow-sm rounded-xl">
                    <h3 className="flex items-center mb-6 text-lg font-semibold text-gray-800">
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

                <div className="flex flex-col items-center justify-center p-6 text-center bg-white border-l-4 border-purple-600 shadow-sm rounded-xl">
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
                    </p>
                </div>
            </div>

            <div className="overflow-hidden bg-white shadow-sm rounded-xl">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800">
                        Observaciones Recientes
                    </h3>
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                        Últimos 10
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th className="px-6 py-3">ID</th>
                                <th className="px-6 py-3">Descripción</th>
                                <th className="px-6 py-3">Empleado</th>
                                <th className="px-6 py-3">Ubicación</th>
                                <th className="px-6 py-3">Estado</th>
                                <th className="px-6 py-3">Fecha</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {stats.recent.map((obs) => (
                                <tr
                                    key={obs.id}
                                    onClick={() => handleRowClick(obs)}
                                    className="transition-colors duration-150 bg-white cursor-pointer hover:bg-blue-50"
                                >
                                    <td className="px-6 py-4 font-medium text-blue-600 whitespace-nowrap">
                                        {obs.folio || `ID-${obs.id}`}
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
                                                    : obs.status === "cerrada"
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
                            ))}
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
