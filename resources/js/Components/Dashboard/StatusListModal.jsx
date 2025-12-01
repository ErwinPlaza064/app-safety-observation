import Modal from "@/Components/Modal";
import SecondaryButton from "@/Components/SecondaryButton";
import MyReportsTable from "@/Components/Dashboard/MyReportsTable";

export default function StatusListModal({
    show,
    status,
    reports,
    onClose,
    onRowClick,
}) {
    const titles = {
        en_progreso: "Reportes En Progreso",
        cerrada: "Reportes Cerrados",
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="4xl">
            <div className="flex items-center justify-between px-6 py-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    {titles[status] || "Listado de Reportes"}
                </h3>
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
                {reports && reports.length > 0 ? (
                    <MyReportsTable
                        observations={reports}
                        onRowClick={onRowClick}
                    />
                ) : (
                    <div className="p-8 text-center text-gray-500 dark:text-gray-400 border-2 border-dashed dark:border-gray-700 rounded-lg">
                        No se encontraron reportes en este estado.
                    </div>
                )}
            </div>

            <div className="flex justify-end px-6 py-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <SecondaryButton onClick={onClose}>Cerrar</SecondaryButton>
            </div>
        </Modal>
    );
}
