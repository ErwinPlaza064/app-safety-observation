import { useState } from "react";
import Modal from "@/Components/Modal";
import SecondaryButton from "@/Components/SecondaryButton";
import { router } from "@inertiajs/react";

export default function ObservationDetailsModal({
    show,
    observation,
    onClose,
    canClose,
}) {
    const [processing, setProcessing] = useState(false);

    if (!observation) return null;

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("es-MX", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getInitials = (name) => {
        if (!name) return "";
        const parts = name.trim().split(" ");
        if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
        return (
            parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
        ).toUpperCase();
    };

    const getStatusBadge = (status) => {
        const styles = {
            en_progreso:
                "bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800",
            cerrada:
                "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800",
            borrador:
                "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-600",
        };
        const label = status === "en_progreso" ? "Abierta" : status;
        return (
            <span
                className={`px-3 py-1 text-xs font-bold uppercase tracking-wide rounded-full border ${
                    styles[status] || styles.borrador
                }`}
            >
                {label}
            </span>
        );
    };

    const handleCloseReport = () => {
        setProcessing(true);
        router.put(
            route("observations.close", observation.id),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    onClose();
                },
                onError: () => {
                    alert("No se pudo cerrar el reporte. Inténtalo de nuevo.");
                },
                onFinish: () => setProcessing(false),
            }
        );
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="4xl">
            <div className="flex items-start justify-between px-6 py-5 bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <div>
                    <h2 className="mt-10 text-xl font-bold text-gray-800 dark:text-gray-200 lg:mt-7">
                        Detalles del Reporte
                    </h2>
                    <p className="mt-1 font-mono text-sm text-gray-500 dark:text-gray-400">
                        {observation.folio || `ID-${observation.id}`}
                    </p>
                </div>
                <button
                    onClick={onClose}
                    className="p-1 mt-10 text-gray-400 transition-colors rounded-full dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
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

            <div className="p-6 max-h-[75vh] overflow-y-auto bg-gray-50/50 dark:bg-gray-900/50">
                {/* Banner de observación revisada por EHS */}
                {observation.reviewed_at &&
                    observation.status === "en_progreso" &&
                    canClose && (
                        <div className="flex items-center gap-3 p-4 mb-6 border border-green-200 dark:border-green-800 rounded-xl bg-green-50 dark:bg-green-900/30">
                            <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full dark:bg-green-800">
                                <svg
                                    className="w-6 h-6 text-green-600 dark:text-green-400"
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
                            <div className="flex-1">
                                <p className="font-semibold text-green-800 dark:text-green-300">
                                    ✓ Revisada por EHS
                                </p>
                                <p className="text-sm text-green-600 dark:text-green-400">
                                    {observation.reviewed_by_user?.name &&
                                        `${observation.reviewed_by_user.name} - `}
                                    {formatDate(observation.reviewed_at)}
                                </p>
                                <p className="mt-1 text-xs text-green-700 dark:text-green-400">
                                    Ya puedes marcar esta observación como
                                    cerrada
                                </p>
                            </div>
                        </div>
                    )}

                <div className="flex flex-col justify-between gap-4 p-4 mb-6 bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700 sm:flex-row sm:items-center rounded-xl">
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-bold tracking-wider text-gray-400 uppercase dark:text-gray-500">
                            Estado:
                        </span>
                        {getStatusBadge(observation.status)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <svg
                            className="w-4 h-4 text-gray-400 dark:text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                        <span className="capitalize">
                            {formatDate(observation.created_at)}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        <div className="p-5 bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl">
                            <h3 className="mb-4 text-xs font-bold tracking-wider text-gray-400 uppercase dark:text-gray-500">
                                Reportado Por
                            </h3>
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-[#1e3a8a] flex items-center justify-center text-white font-bold text-lg shadow-md">
                                    {getInitials(observation.user?.name)}
                                </div>
                                <div>
                                    <p className="text-base font-bold text-gray-900 dark:text-gray-100">
                                        {observation.user?.name ||
                                            "Usuario Desconocido"}
                                    </p>
                                    <p className="text-sm text-gray-500 break-all dark:text-gray-400">
                                        {observation.user?.email}
                                    </p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                                        {observation.user?.employee_number}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-5 bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl">
                            <h3 className="mb-3 text-xs font-bold tracking-wider text-gray-400 uppercase dark:text-gray-500">
                                Descripción del Evento
                            </h3>
                            <div className="p-4 leading-relaxed text-gray-700 whitespace-pre-wrap border border-gray-100 rounded-lg dark:text-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                                {observation.description}
                            </div>
                        </div>

                        {observation.observed_person && (
                            <div className="p-5 bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl">
                                <h3 className="mb-3 text-xs font-bold tracking-wider text-gray-400 uppercase dark:text-gray-500">
                                    Persona Observada
                                </h3>
                                <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
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
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                    </svg>
                                    <span className="font-medium">
                                        {observation.observed_person}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        <div className="p-5 space-y-4 bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl">
                            <div>
                                <h3 className="mb-1 text-xs font-bold tracking-wider text-gray-400 uppercase dark:text-gray-500">
                                    Ubicación
                                </h3>
                                <p className="flex items-center gap-1 font-semibold text-gray-900 dark:text-gray-100">
                                    <svg
                                        className="w-4 h-4 text-red-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                    </svg>
                                    {observation.area?.name || "Sin Área"}
                                </p>
                            </div>
                            <hr className="border-gray-100 dark:border-gray-700" />
                            <div>
                                <h3 className="mb-1 text-xs font-bold tracking-wider text-gray-400 uppercase dark:text-gray-500">
                                    Tipo de Reporte
                                </h3>
                                <p className="font-medium text-gray-800 capitalize dark:text-gray-200">
                                    {observation.observation_type?.replace(
                                        /_/g,
                                        " "
                                    )}
                                </p>
                            </div>
                        </div>

                        {observation.categories &&
                            observation.categories.length > 0 && (
                                <div className="p-5 bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl">
                                    <h3 className="mb-3 text-xs font-bold tracking-wider text-gray-400 uppercase dark:text-gray-500">
                                        Categorías
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {observation.categories.map((cat) => (
                                            <span
                                                key={cat.id}
                                                className="px-2.5 py-1 text-xs font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 rounded-md"
                                            >
                                                {cat.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                        {observation.images && observation.images.length > 0 ? (
                            <div className="p-5 bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl">
                                <h3 className="mb-3 text-xs font-bold tracking-wider text-gray-400 uppercase dark:text-gray-500">
                                    Evidencia ({observation.images.length})
                                </h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {observation.images.map((img) => (
                                        <a
                                            href={`/storage/${img.path}`}
                                            target="_blank"
                                            key={img.id}
                                            className="relative block overflow-hidden bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-700 group aspect-square"
                                        >
                                            <img
                                                src={`/storage/${img.path}`}
                                                alt="Evidencia"
                                                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                                            />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="p-5 text-center bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl">
                                <p className="text-xs italic text-gray-400 dark:text-gray-500">
                                    Sin evidencia fotográfica
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center gap-4 px-6 py-6 bg-white border-t dark:bg-gray-800 dark:border-gray-700">
                {/* Mensaje cuando la observación aún no ha sido revisada por EHS */}
                {canClose &&
                    observation.status === "en_progreso" &&
                    !observation.reviewed_at && (
                        <div className="flex items-center gap-2 px-4 py-2 text-sm text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                            <svg
                                className="w-5 h-5 flex-shrink-0"
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
                            <span>
                                Esperando revisión de EHS para poder cerrar
                            </span>
                        </div>
                    )}

                <div className="flex justify-center gap-4">
                    <SecondaryButton
                        onClick={onClose}
                        className="justify-center w-full sm:w-auto"
                    >
                        Cerrar
                    </SecondaryButton>

                    {/* Solo mostrar botón de cerrar si EHS ya revisó la observación */}
                    {canClose &&
                        observation.status === "en_progreso" &&
                        observation.reviewed_at && (
                            <button
                                onClick={handleCloseReport}
                                disabled={processing}
                                className={`px-4 py-2 text-xs font-bold tracking-widest text-white uppercase transition-colors rounded-md ${
                                    processing
                                        ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                                        : "bg-green-600 dark:bg-green-700 hover:bg-green-500 dark:hover:bg-green-600 ring-2 ring-green-300 dark:ring-green-500 ring-offset-2 dark:ring-offset-gray-800 animate-pulse"
                                }`}
                            >
                                {processing
                                    ? "Cerrando..."
                                    : "✓ Marcar como Cerrado"}
                            </button>
                        )}
                </div>
            </div>
        </Modal>
    );
}
