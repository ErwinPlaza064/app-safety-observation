import { createPortal } from "react-dom";
import { CgDanger } from "react-icons/cg";
import { BiTime, BiUser, BiMap } from "react-icons/bi";
import { MdCategory } from "react-icons/md";

export default function ObservationHoverCard({ observation, position }) {
    if (!observation) return null;

    const getRiskBadge = (risk) => {
        const styles = {
            alto: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
            medio: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300",
            bajo: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
        };
        return styles[risk] || styles.bajo;
    };

    const getStatusBadge = (status) => {
        if (status === "en_progreso") {
            return "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300";
        }
        return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300";
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("es-ES", {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    const cardContent = (
        <div
            className="fixed z-[9999] pointer-events-none animate-fade-in"
            style={{
                left: `${Math.min(position.x, window.innerWidth - 340)}px`,
                top: `${position.y - 10}px`,
                transform: "translate(-50%, -100%)",
            }}
        >
            <div className="overflow-hidden bg-white border border-gray-200 shadow-2xl w-80 dark:bg-gray-800 rounded-xl dark:border-gray-700">
                {/* Header con estado y riesgo */}
                <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-700 dark:border-gray-600">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
                            Folio #{observation.id}
                        </span>
                        <div className="flex gap-2">
                            <span
                                className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusBadge(
                                    observation.status
                                )}`}
                            >
                                {observation.status === "en_progreso"
                                    ? "Abierta"
                                    : "Cerrada"}
                            </span>
                            {observation.risk_level && (
                                <span
                                    className={`px-2 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1 ${getRiskBadge(
                                        observation.risk_level
                                    )}`}
                                >
                                    <CgDanger className="w-3 h-3" />
                                    {observation.risk_level
                                        .charAt(0)
                                        .toUpperCase() +
                                        observation.risk_level.slice(1)}
                                </span>
                            )}
                        </div>
                    </div>
                    <h4 className="font-semibold text-gray-800 truncate dark:text-gray-100">
                        {observation.observed_person}
                    </h4>
                </div>

                {/* Contenido */}
                <div className="p-4 space-y-3">
                    {/* Descripción */}
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                        {observation.description}
                    </p>

                    {/* Info grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                            <BiUser className="w-4 h-4 text-blue-500" />
                            <span className="truncate">
                                {observation.user?.name || "Sin asignar"}
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                            <BiMap className="w-4 h-4 text-green-500" />
                            <span className="truncate">
                                {observation.area?.name || "Sin ubicación"}
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                            <MdCategory className="w-4 h-4 text-purple-500" />
                            <span className="truncate" title={observation.categories?.map(c => c.name).join(', ')}>
                                {observation.categories?.length > 0 
                                    ? observation.categories.map(c => c.name).join(', ')
                                    : "Sin categoría"}
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                            <BiTime className="w-4 h-4 text-orange-500" />
                            <span className="truncate">
                                {formatDate(observation.observation_date)}
                            </span>
                        </div>
                    </div>

                    {/* Acción correctiva si existe */}
                    {observation.corrective_action && (
                        <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                            <p className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                                Acción Correctiva:
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
                                {observation.corrective_action}
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-4 py-2 border-t border-gray-100 bg-gray-50 dark:bg-gray-700/50 dark:border-gray-600">
                    <p className="text-xs text-center text-gray-400 dark:text-gray-500">
                        Click para ver detalles completos
                    </p>
                </div>
            </div>

            {/* Flecha indicadora */}
            <div
                className="absolute w-3 h-3 transform rotate-45 -translate-x-1/2 bg-white border-b border-r border-gray-200 left-1/2 dark:bg-gray-800 dark:border-gray-700"
                style={{ bottom: "-6px" }}
            ></div>
        </div>
    );

    return createPortal(cardContent, document.body);
}
