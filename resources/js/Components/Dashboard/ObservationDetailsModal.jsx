import { useState } from "react";
import Modal from "@/Components/Modal";
import SecondaryButton from "@/Components/SecondaryButton";
import PrimaryButton from "@/Components/PrimaryButton";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import { router, useForm } from "@inertiajs/react";

export default function ObservationDetailsModal({
    show,
    observation,
    onClose,
    canClose,
}) {
    const [showClosureForm, setShowClosureForm] = useState(false);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        closure_notes: "",
        photos: [],
        _method: 'PUT' // Para que Laravel reconozca el PUT con FormData
    });

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

    const handleCloseReport = (e) => {
        e.preventDefault();
        post(route("observations.close", observation.id), {
            preserveScroll: true,
            onSuccess: () => {
                setShowClosureForm(false);
                reset();
                onClose();
            },
        });
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setData('photos', files);
    };

    const handleCloseModal = () => {
        setShowClosureForm(false);
        reset();
        onClose();
    };

    return (
        <Modal show={show} onClose={handleCloseModal} maxWidth="3xl">
            {/* Header Modernizado */}
            <div className="flex items-center justify-between px-6 py-4 bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                        <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-lg font-extrabold text-gray-900 dark:text-white">
                            {showClosureForm ? "Finalizar Reporte" : "Detalles del Reporte"}
                        </h2>
                        <span className="text-[11px] font-mono text-gray-400 dark:text-gray-500 uppercase tracking-tighter">
                            {observation.folio || `ID-${observation.id}`}
                        </span>
                    </div>
                </div>
                <button
                    onClick={handleCloseModal}
                    className="p-2 text-gray-400 transition-all rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white active:scale-90"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Cuerpo del Modal */}
            <div className="overflow-y-auto max-h-[85vh] bg-white dark:bg-gray-800">
                {!showClosureForm ? (
                    <div className="p-6">
                        {/* Status bar */}
                        <div className="flex flex-wrap items-center justify-between gap-4 p-4 mb-8 border shadow-sm bg-gray-50 dark:bg-gray-900/40 border-gray-100 dark:border-gray-700 rounded-2xl">
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Estado actual</span>
                                {getStatusBadge(observation.status)}
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-600 dark:text-gray-400 shadow-sm">
                                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="capitalize">{formatDate(observation.created_at)}</span>
                            </div>
                        </div>

                        {/* Grid Principal */}
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                            {/* Columna Izquierda (Principal) */}
                            <div className="lg:col-span-7 space-y-8">
                                {/* Reportado por */}
                                <section>
                                    <h3 className="flex items-center gap-2 mb-4 text-xs font-black tracking-widest text-gray-400 uppercase">
                                        <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                                        Información del Reportante
                                    </h3>
                                    <div className="flex items-center gap-4 p-4 border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
                                        <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-black text-xl shadow-lg transform -rotate-2">
                                            {getInitials(observation.user?.name)}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-lg font-bold text-gray-900 truncate dark:text-white">
                                                {observation.user?.name || "Usuario Desconocido"}
                                            </p>
                                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                                <p className="text-sm text-gray-500 dark:text-gray-400 italic">{observation.user?.email}</p>
                                                <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-[10px] font-bold text-gray-500 dark:text-gray-400 rounded-md">
                                                    ID: {observation.user?.employee_number}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Descripción */}
                                <section>
                                    <h3 className="flex items-center gap-2 mb-4 text-xs font-black tracking-widest text-gray-400 uppercase">
                                        <div className="w-1 h-4 bg-orange-500 rounded-full"></div>
                                        Descripción del Evento
                                    </h3>
                                    <div className="relative group">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-gray-200 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                                        <div className="relative p-5 leading-relaxed text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm">
                                            {observation.description}
                                        </div>
                                    </div>
                                </section>

                                {/* Resolución (Si aplica) */}
                                {observation.status === 'cerrada' && observation.closure_notes && (
                                    <section className="animate-fade-in-up">
                                        <h3 className="flex items-center gap-2 mb-4 text-xs font-black tracking-widest text-green-600 dark:text-green-400 uppercase">
                                            <div className="w-1 h-4 bg-green-500 rounded-full"></div>
                                            Acciones de Resolución
                                        </h3>
                                        <div className="p-6 border-2 border-green-50 dark:border-green-900/30 bg-green-50/30 dark:bg-green-900/10 rounded-2xl ring-1 ring-green-100 dark:ring-green-900/20">
                                            <div className="prose dark:prose-invert max-w-none text-green-900 dark:text-green-200">
                                                {observation.closure_notes}
                                            </div>
                                            {observation.closedByUser && (
                                                <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-green-100 dark:border-green-800/50">
                                                    <span className="text-[10px] uppercase font-bold text-green-600/60 dark:text-green-400/60 tracking-wider">Cerrada por:</span>
                                                    <span className="text-xs font-bold text-green-700 dark:text-green-300 bg-white dark:bg-green-900 px-2 py-1 rounded-lg">
                                                        {observation.closedByUser.name}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </section>
                                )}
                            </div>

                            {/* Columna Derecha (Sidebar) */}
                            <div className="lg:col-span-5 space-y-6">
                                {/* Detalles Rápidos */}
                                <div className="p-5 bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-700 rounded-2xl space-y-5 shadow-inner">
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-xl">
                                            <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Ubicación</p>
                                            <p className="font-bold text-gray-900 dark:text-white uppercase tracking-tight">{observation.area?.name || "Sin Área"}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
                                            <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Tipo de Reporte</p>
                                            <p className="font-bold text-gray-900 dark:text-white capitalize tracking-tight">
                                                {observation.observation_type?.replace(/_/g, " ")}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Categorías */}
                                {observation.categories && observation.categories.length > 0 && (
                                    <div className="p-5 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm">
                                        <h3 className="mb-4 text-xs font-black tracking-widest text-gray-400 uppercase">Categorías Vinculadas</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {observation.categories.map((cat) => (
                                                <span
                                                    key={cat.id}
                                                    className="px-3 py-1.5 text-[10px] font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 rounded-xl"
                                                >
                                                    {cat.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Evidencia */}
                                <div className="p-5 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm">
                                    <h3 className="mb-4 text-xs font-black tracking-widest text-gray-400 uppercase">
                                        Evidencia Fotográfica
                                        {observation.images?.length > 0 && <span className="ml-2 text-blue-500">[{observation.images.length}]</span>}
                                    </h3>
                                    {observation.images && observation.images.length > 0 ? (
                                        <div className="grid grid-cols-2 gap-3">
                                            {observation.images.map((img) => (
                                                <a
                                                    href={`/storage/${img.path}`}
                                                    target="_blank"
                                                    key={img.id}
                                                    className="group relative aspect-square overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-900 border-2 border-transparent hover:border-blue-500 transition-all shadow-sm active:scale-95"
                                                >
                                                    <img
                                                        src={`/storage/${img.path}`}
                                                        alt="Evidencia"
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-125"
                                                    />
                                                    <div className="absolute inset-0 bg-blue-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <svg className="w-8 h-8 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                    </div>
                                                </a>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center py-8 text-gray-300 dark:text-gray-600 border-2 border-dashed border-gray-100 dark:border-gray-700 rounded-2xl">
                                            <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <p className="text-xs font-bold uppercase tracking-widest italic opacity-50">Sin archivos</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleCloseReport} className="p-8 space-y-8 max-w-2xl mx-auto">
                        {/* Formulario de cierre... (Mantener lógica pero mejorar estilos) */}
                        <div className="bg-white dark:bg-gray-800 p-8 border border-gray-100 dark:border-gray-700 rounded-3xl shadow-xl space-y-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-2xl">
                                    <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Acciones Correctivas</h3>
                            </div>

                            <div className="space-y-4">
                                <InputLabel htmlFor="closure_notes" className="text-[10px] font-black uppercase tracking-widest text-gray-400" value="Detalla la solución aplicada" />
                                <div className="focus-within:ring-2 focus-within:ring-blue-500 rounded-2xl transition-all">
                                    <textarea
                                        id="closure_notes"
                                        className="w-full min-h-[200px] p-5 text-gray-800 dark:text-gray-200 bg-gray-50/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 rounded-2xl focus:border-blue-500 focus:bg-white dark:focus:bg-gray-800 placeholder-gray-400 transition-all text-sm leading-relaxed"
                                        placeholder="Ej: Se reparó la fuga de aceite y se colocó material absorbente..."
                                        value={data.closure_notes}
                                        onChange={(e) => setData('closure_notes', e.target.value)}
                                        required
                                    />
                                </div>
                                <InputError message={errors.closure_notes} className="mt-2" />
                            </div>

                            <div className="pt-6 border-t border-gray-100 dark:border-gray-700 space-y-4">
                                <InputLabel className="text-[10px] font-black uppercase tracking-widest text-gray-400" value="Evidencia de Cierre (Fotos)" />
                                <div className="flex flex-col items-center justify-center w-full min-h-[120px] border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors cursor-pointer relative group">
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <svg className="w-10 h-10 text-gray-300 group-hover:text-blue-500 transition-colors mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                    </svg>
                                    <p className="text-xs font-bold text-gray-400 group-hover:text-blue-600 transition-colors">Añadir Fotos de Resolución</p>
                                </div>
                                
                                {data.photos.length > 0 && (
                                    <div className="flex gap-2 flex-wrap">
                                        {data.photos.map((file, i) => (
                                            <div key={i} className="flex items-center gap-2 pl-3 pr-2 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[10px] font-bold rounded-xl border border-blue-200 dark:border-blue-800 group">
                                                <span className="truncate max-w-[150px]">{file.name}</span>
                                                <button type="button" onClick={() => setData('photos', data.photos.filter((_, idx) => idx !== i))} className="p-0.5 hover:bg-blue-200 dark:hover:bg-blue-700 rounded-full transition-colors">
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-2xl flex gap-3">
                                <svg className="w-6 h-6 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed font-medium">
                                    Esta acción es permanente. Una vez confirmes el cierre, el reporte pasará al historial de observaciones completadas.
                                </div>
                            </div>
                        </div>
                    </form>
                )}
            </div>

            {/* Footer Moderno */}
            <div className="px-8 py-6 bg-gray-50 dark:bg-gray-900/60 border-t dark:border-gray-700">
                <div className="flex flex-col-reverse items-center justify-between gap-4 sm:flex-row">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center sm:text-left">
                        {showClosureForm ? "Paso final de auditoría" : "Documento de seguridad oficial"}
                    </p>
                    <div className="flex items-center justify-center gap-4 w-full sm:w-auto">
                        {!showClosureForm ? (
                            <>
                                <button
                                    onClick={handleCloseModal}
                                    className="px-6 py-2.5 text-xs font-black tracking-widest text-gray-500 uppercase transition-all bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white shadow-sm active:scale-95 flex-1 sm:flex-none"
                                >
                                    Cerrar Ventana
                                </button>

                                {canClose && observation.status === "en_progreso" && (
                                    <button
                                        onClick={() => setShowClosureForm(true)}
                                        className="px-8 py-2.5 text-xs font-black tracking-widest text-white uppercase transition-all bg-blue-600 dark:bg-blue-500 rounded-xl hover:bg-blue-500 dark:hover:bg-blue-400 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 flex-1 sm:flex-none"
                                    >
                                        ✓ Resolver Reporte
                                    </button>
                                )}
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => setShowClosureForm(false)}
                                    disabled={processing}
                                    className="px-6 py-2.5 text-xs font-black tracking-widest text-gray-500 uppercase transition-all bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm active:scale-95 flex-1 sm:flex-none"
                                >
                                    Regresar
                                </button>

                                <button
                                    onClick={handleCloseReport}
                                    disabled={processing || !data.closure_notes}
                                    className={`px-8 py-2.5 text-xs font-black tracking-widest text-white uppercase transition-all rounded-xl flex-1 sm:flex-none shadow-lg ${
                                        processing || !data.closure_notes
                                            ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed opacity-50"
                                            : "bg-green-600 dark:bg-green-500 hover:bg-green-500 dark:hover:bg-green-400 shadow-green-500/25 hover:shadow-green-500/40 hover:-translate-y-0.5 active:scale-95"
                                    }`}
                                >
                                    {processing ? "Cerrando..." : "Confirmar Cierre"}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
}
