import { useState, useEffect, useRef } from "react";
import { router, usePage } from "@inertiajs/react";
import { route } from "@/Utils/helpers";
import ObservationDetailsModal from "@/Components/Dashboard/ObservationDetailsModal";
import DrillDownModal from "@/Components/Dashboard/DrillDownModal";
import ObservationHoverCard from "@/Components/Dashboard/ObservationHoverCard";

// Sub-componentes
import EhsManagerHeader from "../EhsManager/EhsManagerHeader";
import EhsStatsGrid from "../EhsManager/EhsStatsGrid";
import EhsDistributionsGrid from "../EhsManager/EhsDistributionsGrid";
import EhsObservationsTable from "../EhsManager/EhsObservationsTable";

export default function EhsManagerView({
    user,
    stats,
    areas,
    plants,
    filters,
    canViewAllPlants,
}) {
    // Estados principales
    const [selectedObservation, setSelectedObservation] = useState(null);
    const [params, setParams] = useState({
        search: filters?.search || "",
        plant_id: filters?.plant_id || "",
    });
    const [activeMetric, setActiveMetric] = useState(null);
    const [customDrillDown, setCustomDrillDown] = useState({
        title: "",
        data: [],
    });
    const [selectedPayroll, setSelectedPayroll] = useState(null);
    const [activeTab, setActiveTab] = useState("actos");

    // Estados para UI/UX
    const [hoveredObservation, setHoveredObservation] = useState(null);
    const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
    const [copiedId, setCopiedId] = useState(null);
    const [isMobile, setIsMobile] = useState(false);

    const [isSyncing, setIsSyncing] = useState(false);

    const searchSectionRef = useRef(null);
    const isFirstRender = useRef(true);

    // 1. Efecto para recarga automática - Optimizado para evitar conflictos con filtros
    useEffect(() => {
        // No recargar automáticamente si el usuario está escribiendo o si el filtro local 
        // no coincide con el filtro del servidor (estamos esperando respuesta)
        const isStale = params.search !== (filters?.search || "") || 
                        params.plant_id !== (filters?.plant_id || "");
        
        if (isStale) return;

        const intervalId = setInterval(() => {
            setIsSyncing(true);
            router.reload({
                only: ["ehsStats"],
                preserveScroll: true,
                preserveState: true,
                replace: true,
                onFinish: () => setIsSyncing(false),
            });
        }, 8000); // 8 segundos para evitar saturar el servidor en dashboards pesados

        return () => clearInterval(intervalId);
    }, [params, filters]);

    // 2. Efecto para abrir modal desde URL (notificaciones)
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const observationId = urlParams.get("id");

        if (observationId && stats.recent) {
            const obs = stats.recent.find(
                (o) => o.id === parseInt(observationId),
            );
            if (obs) {
                setSelectedObservation(obs);
                const newUrl = window.location.pathname + window.location.hash;
                window.history.replaceState({ path: newUrl }, "", newUrl);
            }
        }
    }, [stats.recent]);

    // 3. Detectar móvil
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768 || "ontouchstart" in window);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // 4. Efecto de búsqueda con debounce
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const searchTerm = params.search?.trim() || "";

        const timer = setTimeout(() => {
            const options = {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                onStart: () => setIsSyncing(true),
                onFinish: () => setIsSyncing(false),
            };

            // Si el buscador está vacío, NO usamos 'only' para forzar una recarga completa 
            // de las estadísticas y limpiar cualquier estado "bugeado"
            if (searchTerm === "") {
                router.get(route("dashboard"), { ...params, search: "" }, options);
            } else {
                router.get(route("dashboard"), params, {
                    ...options,
                    only: ["ehsStats", "filters"],
                });
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [params.search, params.plant_id]);

    // Handlers
    const handleFilterChange = (e) => {
        setParams({ ...params, [e.target.name]: e.target.value });
    };

    const handleGenericClick = (title, list) => {
        setCustomDrillDown({ title, data: list });
        setActiveMetric("custom");
    };

    const handleRowClick = (obs) => {
        if (!isMobile) {
            setSelectedObservation(obs);
        }
    };

    const handleRowMouseEnter = (obs, e) => {
        if (isMobile) return;
        const rect = e.currentTarget.getBoundingClientRect();
        setHoveredObservation(obs);
        setHoverPosition({
            x: rect.left + window.scrollX + 20,
            y: rect.top + window.scrollY - 100,
        });
    };

    const handleRowMouseLeave = () => {
        setHoveredObservation(null);
    };

    const handleRecidivismClick = (item) => {
        setActiveMetric(null);
        setSelectedPayroll(item);

        const searchTerm =
            item.company === "WASION"
                ? item.payroll_number
                : item.observed_person;

        setParams({ ...params, search: searchTerm });

        setTimeout(() => {
            searchSectionRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }, 400);
    };

    const handleShare = (e, obs) => {
        e.stopPropagation();
        const url = `${window.location.origin}/observations/${obs.uuid}`;
        navigator.clipboard.writeText(url).then(() => {
            setCopiedId(obs.id);
            setTimeout(() => setCopiedId(null), 2000);
        });
    };

    const filteredRecent =
        stats.recent?.filter((obs) => {
            if (activeTab === "actos") {
                return (
                    obs.observation_type === "acto_seguro" ||
                    obs.observation_type === "acto_inseguro"
                );
            }
            return obs.observation_type === "condicion_insegura";
        }) || [];

    return (
        <div className="space-y-8 animate-fade-in">
            {/* 1. Header & Filtros Globales */}
            <EhsManagerHeader
                user={user}
                canViewAllPlants={canViewAllPlants}
                plants={plants}
                params={params}
                handleFilterChange={handleFilterChange}
                isSyncing={isSyncing}
            />

            {/* 2. Grid de Métricas (Tarjetas) */}
            <EhsStatsGrid stats={stats} setActiveMetric={setActiveMetric} />

            {/* 3. Grid de Distribuciones (Gráficos/Barras) */}
            <EhsDistributionsGrid
                canViewAllPlants={canViewAllPlants}
                stats={stats}
                handleGenericClick={handleGenericClick}
                setActiveMetric={setActiveMetric}
            />

            {/* 4. Tabla de búsqueda y resultados */}
            <EhsObservationsTable
                searchSectionRef={searchSectionRef}
                params={params}
                handleFilterChange={handleFilterChange}
                setParams={setParams}
                selectedPayroll={selectedPayroll}
                setSelectedPayroll={setSelectedPayroll}
                recentObservations={stats.recent}
                filteredRecent={filteredRecent}
                handleRowClick={handleRowClick}
                handleRowMouseEnter={handleRowMouseEnter}
                handleRowMouseLeave={handleRowMouseLeave}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                canViewAllPlants={canViewAllPlants}
                handleShare={handleShare}
                copiedId={copiedId}
            />

            {/* Modales Compartidas */}
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
                                        : activeMetric ===
                                            "participation_monthly"
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
                                        : activeMetric ===
                                            "participation_monthly"
                                          ? stats.participation_monthly.list
                                          : []
                }
                type={activeMetric === "custom" ? "open" : activeMetric}
                onItemClick={(item) => {
                    if (activeMetric === "participation_summary") {
                        setActiveMetric(item);
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
                onClose={() => setSelectedObservation(null)}
                canShare={canViewAllPlants}
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
