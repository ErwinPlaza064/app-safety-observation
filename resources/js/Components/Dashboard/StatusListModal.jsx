import Modal from "@/Components/Modal";
import SecondaryButton from "@/Components/SecondaryButton";
import MyReportsTable from "@/Components/Dashboard/MyReportsTable";

export default function StatusListModal({
    show,
    status,
    reports,
    onClose,
    onRowClick,
    customTitle,
    customSubtitle,
}) {
    const titles = {
        en_progreso: "Reportes En Progreso",
        cerrada: "Reportes Cerrados",
        ready_to_close: "Listas para Cerrar",
    };

    const subtitles = {
        ready_to_close: "Estas observaciones ya fueron revisadas por EHS",
    };

    const headerStyles = {
        ready_to_close:
            "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-b-2 border-green-200 dark:border-green-800",
    };

    const titleStyles = {
        ready_to_close: "text-green-700 dark:text-green-300",
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="4xl">
            <div
                className={`flex items-center justify-between px-6 py-4 border-b dark:border-gray-700 ${
                    headerStyles[status] || "bg-gray-50 dark:bg-gray-800"
                }`}
            >
                <div>
                    <h3
                        className={`text-lg font-semibold ${
                            titleStyles[status] ||
                            "text-gray-800 dark:text-gray-200"
                        }`}
                    >
                        {status === "ready_to_close" && (
                            <span className="mr-2">✓</span>
                        )}
                        {customTitle || titles[status] || "Listado de Reportes"}
                    </h3>
                    {(customSubtitle || subtitles[status]) && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {customSubtitle || subtitles[status]}
                        </p>
                    )}
                </div>
                <button
                    onClick={onClose}
                    className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto">
                {status === "ready_to_close" &&
                    reports &&
                    reports.length > 0 && (
                        <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                            <p className="text-sm text-green-700 dark:text-green-300">
                                <span className="font-semibold">💡 Tip:</span>{" "}
                                Haz click en cualquier reporte para ver los
                                detalles y marcarlo como cerrado.
                            </p>
                        </div>
                    )}

                {reports && reports.length > 0 ? (
                    <MyReportsTable
                        observations={reports}
                        onRowClick={onRowClick}
                    />
                ) : (
                    <div className="p-8 text-center text-gray-500 dark:text-gray-400 border-2 border-dashed dark:border-gray-700 rounded-lg">
                        {status === "ready_to_close"
                            ? "No tienes observaciones pendientes de cerrar. Cuando EHS revise tus reportes, aparecerán aquí."
                            : "No se encontraron reportes en este estado."}
                    </div>
                )}
            </div>

            <div className="flex justify-end px-6 py-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <SecondaryButton onClick={onClose}>Cerrar</SecondaryButton>
            </div>
        </Modal>
    );
}
