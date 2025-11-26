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
}) {
    const [showForm, setShowForm] = useState(!!savedDraft);

    const [selectedObservation, setSelectedObservation] = useState(null);

    const [showStatusModal, setShowStatusModal] = useState(false);

    const [currentStatusFilter, setCurrentStatusFilter] = useState(null);

    useEffect(() => {
        console.log("Borrador recibido:", savedDraft);
        if (savedDraft) setShowForm(true);
    }, [savedDraft]);

    useEffect(() => {
        if (filteredReports && currentStatusFilter) {
            setShowStatusModal(true);
        }
    }, [filteredReports]);

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
        setSelectedObservation(obs);
    };

    if (showForm) {
        return (
            <div className="animate-fade-in-up">
                <SafetyObservationForm
                    user={user}
                    areas={areas || []}
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
                    className="w-full sm:w-auto flex items-center justify-center px-8 py-4 text-lg font-semibold text-white transition-all transform bg-[#1e3a8a] rounded-xl shadow-lg hover:bg-blue-900 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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

            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                <div
                    onClick={() => handleCardClick("en_progreso")}
                    className="p-4 transition bg-white border-l-4 border-blue-500 shadow-sm sm:p-6 rounded-xl hover:cursor-pointer hover:bg-gray-200"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-medium text-gray-600 sm:text-lg">
                            En Progreso
                        </h3>
                        <svg
                            className="w-6 h-6 text-blue-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <div className="flex items-end justify-between">
                        <span className="text-3xl font-bold text-gray-800 sm:text-4xl">
                            {userStats?.in_progress || 0}
                        </span>
                        <span className="text-xs text-gray-500 sm:text-sm">
                            En seguimiento
                        </span>
                    </div>
                </div>

                <div
                    onClick={() => handleCardClick("cerrada")}
                    className="p-4 bg-white border-l-4 border-green-500 shadow-sm hover:cursor-pointer hover:bg-gray-200 sm:p-6 rounded-xl"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-medium text-gray-600 sm:text-lg">
                            Cerradas
                        </h3>
                        <svg
                            className="w-6 h-6 text-green-500"
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
                        <span className="text-3xl font-bold text-gray-800 sm:text-4xl">
                            {userStats?.completed || 0}
                        </span>
                        <span className="text-xs text-gray-500 sm:text-sm">
                            Completadas
                        </span>
                    </div>
                </div>
            </div>

            <div className="p-4 bg-white shadow-sm sm:p-6 sm:rounded-lg rounded-xl">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="flex items-center text-base font-semibold text-gray-800 sm:text-lg">
                        <svg
                            className="w-5 h-5 mr-2 text-blue-600"
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
                    <span className="px-3 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">
                        {(userStats?.total || 0) + " Total"}
                    </span>
                </div>

                <MyReportsTable
                    observations={myObservations}
                    onRowClick={(obs) => setSelectedObservation(obs)}
                />
            </div>

            <StatusListModal
                show={showStatusModal}
                status={currentStatusFilter}
                reports={filteredReports}
                onClose={() => setShowStatusModal(false)}
                onRowClick={handleModalRowClick}
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
