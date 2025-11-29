import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
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
            en_progreso: "bg-blue-100 text-blue-800 border-blue-200",
            cerrada: "bg-green-100 text-green-800 border-green-200",
            borrador: "bg-gray-100 text-gray-800 border-gray-200",
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
        <AuthenticatedLayout
            user={user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Detalle de Observación
                </h2>
            }
        >
            <Head title={`Reporte #${observation.id}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="flex items-start justify-between px-6 py-6 border-b border-gray-100">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">
                                    {observation.folio ||
                                        `Reporte #${observation.id}`}
                                </h1>
                                <p className="mt-1 text-sm text-gray-500">
                                    Creado el
                                    {formatDate(observation.created_at)}
                                </p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                {getStatusBadge(observation.status)}
                            </div>
                        </div>

                        <div className="p-6 bg-gray-50/50">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                <div className="space-y-6 md:col-span-2">
                                    <div className="p-5 bg-white border border-gray-100 shadow-sm rounded-xl">
                                        <h3 className="mb-4 text-xs font-bold tracking-wider text-gray-400 uppercase">
                                            Reportado Por
                                        </h3>
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-full bg-[#1e3a8a] flex items-center justify-center text-white font-bold text-lg shadow-md">
                                                {getInitials(
                                                    observation.user?.name
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-base font-bold text-gray-900">
                                                    {observation.user?.name ||
                                                        "Usuario Desconocido"}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {observation.user?.email}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-5 bg-white border border-gray-100 shadow-sm rounded-xl">
                                        <h3 className="mb-3 text-xs font-bold tracking-wider text-gray-400 uppercase">
                                            Descripción
                                        </h3>
                                        <div className="p-4 leading-relaxed text-gray-700 whitespace-pre-wrap border border-gray-100 rounded-lg bg-gray-50">
                                            {observation.description}
                                        </div>
                                    </div>

                                    {observation.observed_person && (
                                        <div className="p-5 bg-white border border-gray-100 shadow-sm rounded-xl">
                                            <h3 className="mb-3 text-xs font-bold tracking-wider text-gray-400 uppercase">
                                                Persona Observada
                                            </h3>
                                            <div className="flex items-center gap-2 font-medium text-gray-800">
                                                <svg
                                                    className="w-5 h-5 text-gray-400"
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
                                                {observation.observed_person}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-6">
                                    <div className="p-5 space-y-4 bg-white border border-gray-100 shadow-sm rounded-xl">
                                        <div>
                                            <h3 className="mb-1 text-xs font-bold tracking-wider text-gray-400 uppercase">
                                                Ubicación
                                            </h3>
                                            <p className="flex items-center gap-1 font-semibold text-gray-900">
                                                <svg
                                                    className="w-4 h-4 text-red-500"
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
                                        <hr className="border-gray-100" />
                                        <div>
                                            <h3 className="mb-1 text-xs font-bold tracking-wider text-gray-400 uppercase">
                                                Tipo
                                            </h3>
                                            <p className="font-medium text-gray-800 capitalize">
                                                {observation.observation_type?.replace(
                                                    /_/g,
                                                    " "
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    {observation.categories?.length > 0 && (
                                        <div className="p-5 bg-white border border-gray-100 shadow-sm rounded-xl">
                                            <h3 className="mb-3 text-xs font-bold tracking-wider text-gray-400 uppercase">
                                                Categorías
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {observation.categories.map(
                                                    (cat) => (
                                                        <span
                                                            key={cat.id}
                                                            className="px-2.5 py-1 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-100 rounded-md"
                                                        >
                                                            {cat.name}
                                                        </span>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {observation.images?.length > 0 && (
                                        <div className="p-5 bg-white border border-gray-100 shadow-sm rounded-xl">
                                            <h3 className="mb-3 text-xs font-bold tracking-wider text-gray-400 uppercase">
                                                Evidencia
                                            </h3>
                                            <div className="grid grid-cols-2 gap-2">
                                                {observation.images.map(
                                                    (img) => (
                                                        <a
                                                            href={`/storage/${img.path}`}
                                                            target="_blank"
                                                            key={img.id}
                                                            className="relative block overflow-hidden bg-gray-100 border border-gray-200 rounded-lg aspect-square group"
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

                        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
                            <Link
                                href={route("dashboard")}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
                            >
                                Volver al Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
