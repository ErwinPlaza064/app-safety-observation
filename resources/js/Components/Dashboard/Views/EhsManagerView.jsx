import { useState, useEffect, useRef } from "react";
import { router } from "@inertiajs/react";
import axios from "axios";
import EhsMetricCard from "@/Components/Dashboard/EhsMetricCard";
import ObservationDetailsModal from "@/Components/Dashboard/ObservationDetailsModal";
import { CgFileDocument, CgDanger } from "react-icons/cg";
import { BiPulse, BiTrendingUp } from "react-icons/bi";
import { IoMdClose } from "react-icons/io";
import DrillDownModal from "@/Components/Dashboard/DrillDownModal";
import ObservationHoverCard from "@/Components/Dashboard/ObservationHoverCard";

export default function EhsManagerView({
    user,
    stats,
    areas,
    filters,
    canViewAllPlants,
}) {
    const [customDrillDown, setCustomDrillDown] = useState({
        title: "",
        data: [],
    });

    const [selectedPayroll, setSelectedPayroll] = useState(null);
    const [historyData, setHistoryData] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    useEffect(() => {
        const intervalId = setInterval(() => {
            router.reload({
                only: ["ehsStats"],
                preserveScroll: true,
                preserveState: true,
                replace: true,
            });
        }, 5000);

        return () => clearInterval(intervalId);
    }, []);

    // Abrir modal automáticamente si hay un ID en la URL (desde notificaciones)
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const observationId = urlParams.get("id");

        if (observationId && stats.recent) {
            const obs = stats.recent.find(
                (o) => o.id === parseInt(observationId)
            );
            if (obs) {
                setSelectedObservation(obs);
                // Limpiar el parámetro de la URL después de abrir para no re-abrir en refresh
                const newUrl = window.location.pathname + window.location.hash;
                window.history.replaceState({ path: newUrl }, "", newUrl);
            }
        }
    }, [stats.recent]);

    const handleGenericClick = (title, list) => {
        setCustomDrillDown({ title, data: list });
        setActiveMetric("custom");
    };

    const [selectedObservation, setSelectedObservation] = useState(null);
    const [hoveredObservation, setHoveredObservation] = useState(null);
    const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
    const hoverTimeoutRef = useRef(null);
    const [isMobile, setIsMobile] = useState(false);

    // Detectar si es dispositivo móvil/táctil
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768 || "ontouchstart" in window);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const [activeMetric, setActiveMetric] = useState(null);

    const [params, setParams] = useState({
        search: filters?.search || "",
        area_id: filters?.area_id || "",
    });

    const isFirstRender = useRef(true);
    const searchSectionRef = useRef(null);

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

    const fetchHistory = async (payrollNumber) => {
        setLoadingHistory(true);
        try {
            const response = await axios.get(route("dashboard"), {
                params: { search: payrollNumber },
            });
            // La respuesta de Inertia viene en props si usamos axios directamente a veces es complicado,
            // pero podemos usar router.get con "only" para traer solo lo necesario sin recargar todo.
            router.get(
                route("dashboard"),
                { search: payrollNumber },
                {
                    preserveState: true,
                    only: ["ehsStats"],
                    onSuccess: (page) => {
                        setHistoryData(page.props.ehsStats.recent);
                        setLoadingHistory(false);
                    },
                }
            );
        } catch (error) {
            console.error(error);
            setLoadingHistory(false);
        }
    };

    const handleRecidivismClick = (item) => {
        setActiveMetric(null);
        setSelectedPayroll(item);
        setParams({ ...params, search: item.payroll_number });

        // Hacer scroll automático a la tabla de resultados
        setTimeout(() => {
            searchSectionRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }, 400);
    };

    const handleRowClick = (obs) => {
        setSelectedObservation(obs);
    };

    const handleCloseModal = () => setSelectedObservation(null);

    const handleRowMouseEnter = (obs, event) => {
        if (isMobile) return; // No mostrar hover en móvil
        const rect = event.currentTarget.getBoundingClientRect();
        hoverTimeoutRef.current = setTimeout(() => {
            setHoverPosition({
                x: rect.left + rect.width / 2,
                y: rect.top,
            });
            setHoveredObservation(obs);
        }, 400);
    };

    const handleRowMouseLeave = () => {
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
        }
        setHoveredObservation(null);
    };

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
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                        Dashboard EHS - {user.name}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">
                        Estadísticas y Métricas de Seguridad
                    </p>
                </div>
                <div className="flex flex-col w-full gap-3 mt-4 md:flex-row md:w-auto md:mt-0">
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
                        href={route("observations.export.csv")}
                        target="_blank"
                        className="px-4 py-2 bg-green-700 text-white rounded-lg text-sm font-medium hover:bg-green-800 flex items-center justify-center"
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
                        Exportar CSV
                    </a>
                    <a
                        href={route("observations.export.pdf")}
                        target="_blank"
                        className="px-4 py-2 bg-[#1e3a8a] text-white rounded-lg text-sm font-medium hover:bg-blue-900 flex items-center justify-center"
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
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
                <div
                    onClick={() => setActiveMetric("total")}
                    className="cursor-pointer transition-transform hover:scale-[1.02]"
                >
                    <EhsMetricCard
                        title="Total"
                        value={stats.total_month}
                        subtitle="Total de registros"
                        color="blue"
                        icon={
                            <CgFileDocument className="w-6 h-6 text-blue-600" />
                        }
                    />
                </div>
                <div
                    onClick={() => setActiveMetric("open")}
                    className="cursor-pointer transition-transform hover:scale-[1.02]"
                >
                    <EhsMetricCard
                        title="Abiertas"
                        value={stats.open}
                        subtitle="Requieren atención"
                        color="orange"
                        icon={<BiPulse className="w-6 h-6 text-orange-500" />}
                    />
                </div>
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
                <div
                    onClick={() => setActiveMetric("closed")}
                    className="cursor-pointer transition-transform hover:scale-[1.02]"
                >
                    <EhsMetricCard
                        title="Cerradas"
                        value={`${stats.closed_rate}%`}
                        subtitle="Tasa de resolución"
                        color="green"
                        icon={
                            <BiTrendingUp className="w-6 h-6 text-green-600" />
                        }
                    />
                </div>
                <div
                    onClick={() => setActiveMetric("participation_summary")}
                    className="cursor-pointer transition-transform hover:scale-[1.02]"
                >
                    <EhsMetricCard
                        title="Participación"
                        value={`${stats.participation_monthly.rate}%`}
                        subtitle={
                            <div className="flex items-center justify-between text-[11px] font-bold mt-1 border-t border-purple-100 dark:border-purple-800/30 pt-1">
                                <span className="text-gray-400 uppercase">
                                    Este Mes:
                                </span>
                                <span className="text-purple-500">
                                    {stats.participation_monthly.count}{" "}
                                    empleados
                                </span>
                            </div>
                        }
                        color="purple"
                        icon={
                            <svg
                                className="w-6 h-6 text-purple-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                            </svg>
                        }
                    />
                </div>
            </div>
            <div
                className={`grid grid-cols-1 gap-6 ${
                    canViewAllPlants ? "lg:grid-cols-3" : "lg:grid-cols-2"
                }`}
            >
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
                            Distribución por Planta
                        </h3>
                        <div className="space-y-4">
                            {stats.by_plant.map((plant, index) => (
                                <div
                                    key={index}
                                    onClick={() =>
                                        handleGenericClick(
                                            `Reportes: ${plant.name}`,
                                            plant.list
                                        )
                                    }
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
                                        cat.list
                                    )
                                }
                                className="flex items-center justify-between p-3 transition-colors border border-transparent rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:border-purple-200 dark:hover:border-purple-700"
                            >
                                <div className="flex items-center">
                                    <span
                                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3 ${getCategoryColor(
                                            index
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
                    className="flex flex-col items-center justify-center p-6 text-center transition-all bg-white border-l-4 border-purple-600 shadow-sm cursor-pointer dark:bg-gray-800 rounded-xl hover:shadow-md hover:bg-purple-50/30 dark:hover:bg-purple-900/20"
                >
                    <div className="p-4 mb-4 rounded-full bg-purple-50 dark:bg-purple-900/30">
                        <svg
                            className="w-10 h-10 text-purple-600 dark:text-purple-400"
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
                    <h3 className="mb-2 font-medium text-gray-500 dark:text-gray-400">
                        Personas Reincidentes
                    </h3>
                    <span className="mb-2 text-5xl font-bold text-gray-800 dark:text-gray-100">
                        {stats.recidivism}
                    </span>
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                        Empleados con &gt;1 reporte
                        <br />
                        <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                            (Ver detalles)
                        </span>
                    </p>
                </div>
            </div>
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

                    <div className="flex flex-col w-full gap-2 sm:flex-row md:w-auto">
                        {areas && areas.length > 1 && (
                            <select
                                name="area_id"
                                value={params.area_id}
                                onChange={handleFilterChange}
                                className="text-sm bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-[#1e3a8a] focus:border-[#1e3a8a]"
                            >
                                <option value="">Filtrar por Planta</option>
                                {areas.map((area) => (
                                    <option key={area.id} value={area.id}>
                                        {area.name}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                </div>
            </div>
            {params.search && (selectedPayroll || params.search.length > 0) ? (
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
                                        <th className="px-6 py-3">Fecha</th>
                                        <th className="px-6 py-3">
                                            Descripción
                                        </th>
                                        <th className="px-6 py-3">Ubicación</th>
                                        <th className="px-6 py-3">Estado</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {stats.recent.map((obs) => (
                                        <tr
                                            key={obs.id}
                                            onClick={() => handleRowClick(obs)}
                                            className="transition-colors duration-150 bg-white cursor-pointer dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                        >
                                            <td className="px-6 py-4 font-bold text-blue-600 dark:text-blue-400">
                                                #{obs.id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {new Date(
                                                    obs.observation_date
                                                ).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 max-w-md">
                                                <p
                                                    className="truncate"
                                                    title={obs.description}
                                                >
                                                    {obs.description}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                {obs.area?.name}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                        obs.status ===
                                                        "en_progreso"
                                                            ? "bg-blue-100 text-blue-800"
                                                            : "bg-green-100 text-green-800"
                                                    }`}
                                                >
                                                    {obs.status ===
                                                    "en_progreso"
                                                        ? "Abierta"
                                                        : "Cerrada"}
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
                <>
                    <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 rounded-xl">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                                Observaciones Recientes
                            </h3>
                            <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-semibold px-2.5 py-0.5 rounded">
                                {stats.recent.length} mostrados
                            </span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase dark:text-gray-300 bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3">Observada</th>
                                        <th className="px-6 py-3">
                                            Descripción
                                        </th>
                                        <th className="px-6 py-3">
                                            Observador
                                        </th>
                                        <th className="px-6 py-3">Ubicación</th>
                                        <th className="px-6 py-3">Estado</th>
                                        <th className="px-6 py-3">Fecha</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {stats.recent.length > 0 ? (
                                        stats.recent.map((obs) => (
                                            <tr
                                                key={obs.id}
                                                onClick={() =>
                                                    handleRowClick(obs)
                                                }
                                                onMouseEnter={(e) =>
                                                    handleRowMouseEnter(obs, e)
                                                }
                                                onMouseLeave={
                                                    handleRowMouseLeave
                                                }
                                                className="transition-colors duration-150 bg-white cursor-pointer dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                            >
                                                <td className="px-6 py-4 font-medium text-blue-600 dark:text-blue-400 whitespace-nowrap">
                                                    {obs.observed_person}
                                                </td>
                                                <td className="max-w-xs px-6 py-4 text-gray-900 truncate dark:text-gray-200">
                                                    {obs.description}
                                                </td>
                                                <td className="px-6 py-4 text-gray-900 dark:text-gray-200">
                                                    {obs.user?.name}
                                                </td>
                                                <td className="px-6 py-4 text-gray-900 dark:text-gray-200">
                                                    {obs.area?.name}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                            obs.status ===
                                                            "en_progreso"
                                                                ? "bg-blue-100 text-blue-800"
                                                                : obs.status ===
                                                                  "cerrada"
                                                                ? "bg-green-100 text-green-800"
                                                                : "bg-gray-100 text-gray-800"
                                                        }`}
                                                    >
                                                        {obs.status ===
                                                        "en_progreso"
                                                            ? "Abierta"
                                                            : obs.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-gray-900 dark:text-gray-200">
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
                                                className="px-6 py-10 text-center text-gray-500 dark:text-gray-400"
                                            >
                                                No se encontraron observaciones
                                                con esos filtros.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            <DrillDownModal
                show={!!activeMetric}
                onClose={() => setActiveMetric(null)}
                title={
                    activeMetric === "custom"
                        ? customDrillDown.title
                        : activeMetric === "recidivism"
                        ? "Detalle: Personas Reincidentes"
                        : activeMetric === "high_risk"
                        ? "Atención Inmediata: Riesgo Alto"
                        : activeMetric === "open"
                        ? "Reportes en Progreso"
                        : activeMetric === "closed"
                        ? "Reportes Cerrados"
                        : activeMetric === "total"
                        ? "Total del Mes"
                        : activeMetric === "participation_summary"
                        ? "Resumen de Participación"
                        : activeMetric === "participation_daily"
                        ? "Participación de Hoy"
                        : activeMetric === "participation_weekly"
                        ? "Participación de la Semana"
                        : activeMetric === "participation_monthly"
                        ? "Participación del Mes"
                        : ""
                }
                data={
                    activeMetric === "custom"
                        ? customDrillDown.data
                        : activeMetric === "recidivism"
                        ? stats.recidivism_list
                        : activeMetric === "high_risk"
                        ? stats.high_risk_list
                        : activeMetric === "open"
                        ? stats.open_list
                        : activeMetric === "closed"
                        ? stats.closed_list
                        : activeMetric === "total"
                        ? stats.total_month_list
                        : activeMetric === "participation_summary"
                        ? stats
                        : activeMetric === "participation_daily"
                        ? stats.participation_daily.list
                        : activeMetric === "participation_weekly"
                        ? stats.participation_weekly.list
                        : activeMetric === "participation_monthly"
                        ? stats.participation_monthly.list
                        : []
                }
                type={activeMetric === "custom" ? "open" : activeMetric}
                onItemClick={(item) => {
                    if (activeMetric === "participation_summary") {
                        setActiveMetric(item); // item will be 'participation_daily', etc.
                    } else if (activeMetric === "recidivism") {
                        handleRecidivismClick(item);
                    } else if (activeMetric.startsWith("participation")) {
                        setActiveMetric(null);
                        setParams({ ...params, search: item.name });
                        setTimeout(() => {
                            searchSectionRef.current?.scrollIntoView({
                                behavior: "smooth",
                                block: "center",
                            });
                        }, 400);
                    } else {
                        setActiveMetric(null);
                        setTimeout(() => setSelectedObservation(item), 100);
                    }
                }}
            />
            <ObservationDetailsModal
                show={!!selectedObservation}
                observation={selectedObservation}
                onClose={handleCloseModal}
            />
            {!isMobile && (
                <ObservationHoverCard
                    observation={hoveredObservation}
                    position={hoverPosition}
                />
            )}
        </div>
    );
}
