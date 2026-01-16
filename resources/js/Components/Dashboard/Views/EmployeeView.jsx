import { useState, useEffect } from "react";
import SafetyObservationForm from "@/Components/Observations/SafetyObservationForm";
import MyReportsTable from "@/Components/Dashboard/MyReportsTable";
import ObservationDetailsModal from "@/Components/Dashboard/ObservationDetailsModal";
import StatusListModal from "@/Components/Dashboard/StatusListModal";
import { router } from "@inertiajs/react";

export default function EmployeeView({
    user,
    userStats,
    areas,
    categories,
    savedDraft,
    myObservations,
    filteredReports,
    employeeNotifications = [],
    plants = [],
}) {
    const [showForm, setShowForm] = useState(!!savedDraft);

    const [selectedObservation, setSelectedObservation] = useState(null);

    const [showStatusModal, setShowStatusModal] = useState(false);

    const [currentStatusFilter, setCurrentStatusFilter] = useState(null);

    const [showReadyToCloseModal, setShowReadyToCloseModal] = useState(false);

    const [activeTab, setActiveTab] = useState("actos");

    const filteredObservations = myObservations?.filter((obs) => {
        if (activeTab === "actos") {
            return obs.observation_type === "acto_seguro" || obs.observation_type === "acto_inseguro";
        }
        return obs.observation_type === "condicion_insegura";
    }) || [];

    useEffect(() => {
        if (savedDraft) setShowForm(true);
    }, [savedDraft]);

    // Abrir modal automáticamente si hay un ID en la URL
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const observationId = urlParams.get("id");
        
        if (observationId && myObservations) {
            const obs = myObservations.find(o => o.id === parseInt(observationId));
            if (obs) {
                setSelectedObservation(obs);
                // Limpiar el parámetro de la URL
                const newUrl = window.location.pathname + window.location.hash;
                window.history.replaceState({ path: newUrl }, "", newUrl);
            }
        }
    }, [myObservations]);

    useEffect(() => {
        if (filteredReports && currentStatusFilter) {
            setShowStatusModal(true);
        }
    }, [filteredReports]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            router.reload({
                only: [
                    "employeeNotifications",
                    "employeeNotificationCount",
                    "myObservations",
                    "userStats",
                ],
                preserveScroll: true,
                preserveState: true,
                replace: true,
            });
        }, 5000);

        return () => clearInterval(intervalId);
    }, []);

    const handleCardClick = (status) => {
        setCurrentStatusFilter(status);

        router.get(
            route("dashboard"),
            { filter_status: status },
            {
                preserveState: true,
                preserveScroll: true,
                only: ["filteredReports"],
                onSuccess: () => {},
            }
        );
    };

    const handleModalRowClick = (obs) => {
        setShowStatusModal(false);
        setShowReadyToCloseModal(false);
        setSelectedObservation(obs);
    };

    if (showForm) {
        return (
            <div className="animate-fade-in-up">
                <SafetyObservationForm
                    user={user}
                    areas={areas || []}
                    plants={plants || []}
                    categories={categories || []}
                    savedDraft={savedDraft}
                    onClose={() => setShowForm(false)}
                />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <button
                    onClick={() => setShowForm(true)}
                    className="w-full sm:w-auto flex items-center justify-center px-8 py-4 text-lg font-semibold text-white transition-all transform bg-[#1e3a8a] dark:bg-blue-700 rounded-xl shadow-lg hover:bg-blue-900 dark:hover:bg-blue-600 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                >
                    <svg
                        className="w-6 h-6 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                        />
                    </svg>
                    Nueva Observación
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
                <div className="p-4 transition bg-white border-l-4 border-blue-500 shadow-sm dark:bg-gray-800 dark:border-blue-400 sm:p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-medium text-gray-600 dark:text-gray-300 sm:text-lg">
                            Total de Reportes
                        </h3>
                        <svg
                            className="w-6 h-6 text-blue-500 dark:text-blue-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                    </div>
                    <div className="flex items-end justify-between">
                        <span className="text-3xl font-bold text-gray-800 dark:text-gray-100 sm:text-4xl">
                            {userStats?.total || 0}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                            Registros totales
                        </span>
                    </div>
                </div>

                <div
                    onClick={() => setShowReadyToCloseModal(true)}
                    className={`p-4 transition shadow-sm sm:p-6 rounded-xl hover:cursor-pointer ${
                        employeeNotifications.length > 0
                            ? "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-l-4 border-green-500 dark:border-green-400 hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-900/50 dark:hover:to-emerald-900/50 ring-2 ring-green-200 dark:ring-green-800"
                            : "bg-white dark:bg-gray-800 border-l-4 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3
                            className={`text-base font-medium sm:text-lg ${
                                employeeNotifications.length > 0
                                    ? "text-green-700 dark:text-green-300"
                                    : "text-gray-600 dark:text-gray-300"
                            }`}
                        >
                            Abiertas
                        </h3>
                        <div
                            className={`p-1 rounded-full ${
                                employeeNotifications.length > 0
                                    ? "bg-green-100 dark:bg-green-800"
                                    : ""
                            }`}
                        >
                            <svg
                                className={`w-6 h-6 ${
                                    employeeNotifications.length > 0
                                        ? "text-green-600 dark:text-green-400"
                                        : "text-gray-400 dark:text-gray-500"
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                    </div>
                    <div className="flex items-end justify-between">
                        <span
                            className={`text-3xl font-bold sm:text-4xl ${
                                employeeNotifications.length > 0
                                    ? "text-green-700 dark:text-green-300"
                                    : "text-gray-800 dark:text-gray-100"
                            }`}
                        >
                            {employeeNotifications.length}
                        </span>
                        <span
                            className={`text-xs sm:text-sm ${
                                employeeNotifications.length > 0
                                    ? "text-green-600 dark:text-green-400 font-medium"
                                    : "text-gray-500 dark:text-gray-400"
                            }`}
                        >
                            {employeeNotifications.length > 0
                                ? "¡Puedes cerrar!"
                                : "En progreso"}
                        </span>
                    </div>
                    {employeeNotifications.length > 0 && (
                        <div className="pt-3 mt-3 border-t border-green-200 dark:border-green-700">
                            <span className="text-xs font-medium text-green-600 dark:text-green-400 animate-pulse">
                                Click para ver y cerrar
                            </span>
                        </div>
                    )}
                </div>

                <div
                    onClick={() => handleCardClick("cerrada")}
                    className="p-4 bg-white border-l-4 border-green-500 shadow-sm dark:bg-gray-800 dark:border-green-400 hover:cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 sm:p-6 rounded-xl"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-medium text-gray-600 dark:text-gray-300 sm:text-lg">
                            Cerradas
                        </h3>
                        <svg
                            className="w-6 h-6 text-green-500 dark:text-green-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <div className="flex items-end justify-between">
                        <span className="text-3xl font-bold text-gray-800 dark:text-gray-100 sm:text-4xl">
                            {userStats?.completed || 0}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                            Completadas
                        </span>
                    </div>
                </div>
            </div>

            <div className="p-4 bg-white shadow-sm dark:bg-gray-800 sm:p-6 sm:rounded-lg rounded-xl">
                <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h3 className="flex items-center text-base font-semibold text-gray-800 dark:text-gray-200 sm:text-lg">
                            <svg
                                className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                                />
                            </svg>
                            Mis Reportes Recientes
                        </h3>
                    </div>

                    <div className="flex p-1 bg-gray-100 dark:bg-gray-700 rounded-xl">
                        <button
                            onClick={() => setActiveTab("actos")}
                            className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                                activeTab === "actos"
                                    ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm"
                                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                            }`}
                        >
                            ACTOS
                        </button>
                        <button
                            onClick={() => setActiveTab("condiciones")}
                            className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                                activeTab === "condiciones"
                                    ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm"
                                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                            }`}
                        >
                            CONDICIONES
                        </button>
                    </div>
                </div>

                <MyReportsTable
                    observations={filteredObservations}
                    onRowClick={(obs) => setSelectedObservation(obs)}
                    observedPersonLabel={activeTab === "actos" ? "Observada" : "Condición"}
                />
            </div>

            <StatusListModal
                show={showStatusModal}
                status={currentStatusFilter}
                reports={filteredReports}
                onClose={() => setShowStatusModal(false)}
                onRowClick={handleModalRowClick}
            />

            <StatusListModal
                show={showReadyToCloseModal}
                status="ready_to_close"
                reports={employeeNotifications}
                onClose={() => setShowReadyToCloseModal(false)}
                onRowClick={handleModalRowClick}
                customTitle="Observaciones Abiertas"
                customSubtitle="Estas observaciones están en progreso y puedes marcarlas como cerradas"
            />

            <ObservationDetailsModal
                show={!!selectedObservation}
                observation={selectedObservation}
                onClose={() => setSelectedObservation(null)}
                canClose={true}
            />
        </div>
    );
}
