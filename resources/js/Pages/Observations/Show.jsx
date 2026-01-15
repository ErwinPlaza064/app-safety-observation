import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";

export default function Show({ auth, observation }) {
    const [processing, setProcessing] = useState(false);
    const user = auth.user;

    const canClose = user.is_ehs_manager || user.id === observation.user_id;

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
                "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700",
            cerrada:
                "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700",
            borrador:
                "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-600",
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
                onSuccess: () => {},
                onError: () => alert("No se pudo cerrar el reporte."),
                onFinish: () => setProcessing(false),
            }
        );
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <Head title={`Reporte #${observation.id}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
                        <div className="flex items-start justify-between px-6 py-6 border-b border-gray-100 dark:border-gray-700">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                                    {observation.folio ||
                                        `Reporte #${observation.id}`}
                                </h1>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    Creado el {" "}
                                    {formatDate(observation.created_at)}
                                </p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                {getStatusBadge(observation.status)}
                            </div>
                        </div>

                        <div className="p-6 bg-gray-50/50 dark:bg-gray-900/50">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                <div className="space-y-6 md:col-span-2">
                                    <div className="p-5 bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl">
                                        <h3 className="mb-4 text-xs font-bold tracking-wider text-gray-400 uppercase dark:text-gray-500">
                                            Observador / Reportante
                                        </h3>
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-full bg-[#1e3a8a] dark:bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                                                {getInitials(
                                                    observation.user?.name
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-base font-bold text-gray-900 dark:text-gray-100">
                                                    {observation.user?.name ||
                                                        "Usuario Desconocido"}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {observation.user?.email}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-5 bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl">
                                        <h3 className="mb-3 text-xs font-bold tracking-wider text-gray-400 uppercase dark:text-gray-500">
                                            Descripción
                                        </h3>
                                        <div className="p-4 leading-relaxed text-gray-700 whitespace-pre-wrap border border-gray-100 rounded-lg dark:text-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                                            {observation.description}
                                        </div>
                                    </div>

                                    {(observation.payroll_number ||
                                        observation.observed_person) && (
                                        <div className="p-5 bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl">
                                            <h3 className="mb-3 text-xs font-bold tracking-wider text-gray-400 uppercase dark:text-gray-500">
                                                Persona Observada
                                            </h3>
                                            <div className="space-y-3">
                                                {observation.payroll_number && (
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
                                                                d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                                                            />
                                                        </svg>
                                                        <div>
                                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                                N. Nómina:
                                                            </span>
                                                            <span className="ml-2 font-medium">
                                                                {
                                                                    observation.payroll_number
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                                {observation.observed_person && (
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
                                                        <div>
                                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                                Nombre/Título:
                                                            </span>
                                                            <span className="ml-2 font-medium">
                                                                {
                                                                    observation.observed_person
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {observation.status === 'cerrada' && observation.closure_notes && (
                                        <div className="p-6 border-2 border-green-50 dark:border-green-900/20 bg-green-50/20 dark:bg-green-900/10 rounded-2xl shadow-sm">
                                            <h3 className="flex items-center gap-2 mb-4 text-xs font-black tracking-widest text-green-600 dark:text-green-400 uppercase">
                                                Acciones de Resolución
                                            </h3>
                                            <p className="text-sm leading-relaxed text-green-900 dark:text-green-100 whitespace-pre-wrap">
                                                {observation.closure_notes}
                                            </p>
                                            {observation.closedByUser && (
                                                <div className="flex items-center justify-end gap-2 mt-6 pt-4 border-t border-green-100 dark:border-green-800/30">
                                                    <span className="text-[10px] font-bold text-green-600/70 uppercase tracking-tight">Resolución por:</span>
                                                    <span className="text-[11px] font-black text-green-700 dark:text-green-300 uppercase tabular-nums">{observation.closedByUser.name}</span>
                                                </div>
                                            )}
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
                                                    className="w-4 h-4 text-red-500 dark:text-red-400"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
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
                                                {observation.area?.name ||
                                                    "Sin Área"}
                                            </p>
                                        </div>
                                        <hr className="border-gray-100 dark:border-gray-700" />
                                        <div>
                                            <h3 className="mb-1 text-xs font-bold tracking-wider text-gray-400 uppercase dark:text-gray-500">
                                                Tipo
                                            </h3>
                                            <p className="font-medium text-gray-800 capitalize dark:text-gray-200">
                                                {observation.observation_type?.replace(
                                                    /_/g,
                                                    " "
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    {observation.categories?.length > 0 && (
                                        <div className="p-5 bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl">
                                            <h3 className="mb-3 text-xs font-bold tracking-wider text-gray-400 uppercase dark:text-gray-500">
                                                Categorías
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {observation.categories.map(
                                                    (cat) => (
                                                        <span
                                                            key={cat.id}
                                                            className="px-2.5 py-1 text-xs font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-700 rounded-md"
                                                        >
                                                            {cat.name}
                                                        </span>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {observation.images?.length > 0 && (
                                        <div className="p-5 bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl">
                                            <h3 className="mb-3 text-xs font-bold tracking-wider text-gray-400 uppercase dark:text-gray-500">
                                                Evidencia
                                            </h3>
                                            <div className="grid grid-cols-2 gap-2">
                                                {observation.images.map(
                                                    (img) => (
                                                        <a
                                                            href={`/storage/${img.path}`}
                                                            target="_blank"
                                                            key={img.id}
                                                            className="relative block overflow-hidden bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 aspect-square group"
                                                        >
                                                            <img
                                                                src={`/storage/${img.path}`}
                                                                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                                                                alt="Evidencia"
                                                            />
                                                        </a>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-4 px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                            <div className="flex justify-center gap-3 w-full">
                                <Link
                                    href={route("dashboard")}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                                >
                                    Volver al Dashboard
                                </Link>

                                {/* Permitir cerrar la observación al usuario dueño */}
                                {user.id === observation.user_id &&
                                    !user.is_ehs_manager &&
                                    observation.status === "en_progreso" && (
                                        <button
                                            onClick={handleCloseReport}
                                            disabled={processing}
                                            className={`px-4 py-2 text-sm font-bold text-white rounded-lg shadow-sm transition-all ${
                                                processing
                                                    ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                                                    : "bg-green-600 dark:bg-green-700 hover:bg-green-500 dark:hover:bg-green-600 ring-2 ring-green-300 dark:ring-green-500 ring-offset-2 dark:ring-offset-gray-800 animate-pulse"
                                            }`}
                                        >
                                            {processing ? (
                                                <div className="flex items-center">
                                                    <svg
                                                        className="w-4 h-4 mr-2 text-white animate-spin"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <circle
                                                            className="opacity-25"
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                        ></circle>
                                                        <path
                                                            className="opacity-75"
                                                            fill="currentColor"
                                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                        ></path>
                                                    </svg>
                                                    Cerrando...
                                                </div>
                                            ) : (
                                                "✓ Marcar como Cerrado"
                                            )}
                                        </button>
                                    )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
