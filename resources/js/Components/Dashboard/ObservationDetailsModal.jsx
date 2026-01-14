import { useState } from "react";
import { compressImage } from "@/Utils/imageHelper";
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

    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files);
        
        // Comprimir cada archivo antes de agregarlo
        const compressedFiles = await Promise.all(
            files.map(file => compressImage(file))
        );

        setData('photos', [...data.photos, ...compressedFiles]);
    };

    const removePhoto = (index) => {
        const updatedPhotos = data.photos.filter((_, i) => i !== index);
        setData('photos', updatedPhotos);
    };

    const handleCloseModal = () => {
        setShowClosureForm(false);
        reset();
        onClose();
    };

    return (
        <Modal show={show} onClose={handleCloseModal} maxWidth="2xl">
            <div className="flex flex-col max-h-[90vh]">
                {/* Header Modernizado - Fijo en la parte superior */}
                <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-gray-900 dark:text-white leading-tight">
                                {showClosureForm ? "Finalizar Reporte" : "Detalles del Reporte"}
                            </h2>
                            <p className="text-[10px] font-mono text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                                {observation.folio || `ID-${observation.id}`}
                            </p>
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

                {/* Cuerpo del Modal - Scrollable */}
                <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-800 custom-scrollbar">
                    {!showClosureForm ? (
                        <div className="p-6">
                            {/* Status bar */}
                            <div className="flex flex-wrap items-center justify-between gap-4 p-4 mb-8 border shadow-sm bg-gray-50 dark:bg-gray-900/40 border-gray-100 dark:border-gray-700 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Estado</span>
                                    {getStatusBadge(observation.status)}
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-600 dark:text-gray-400 shadow-sm">
                                    <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="capitalize">{formatDate(observation.created_at)}</span>
                                </div>
                            </div>

                            {/* Grid Principal */}
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                {/* Columna Izquierda */}
                                <div className="space-y-8">
                                    {/* Reportado por */}
                                    <section>
                                        <h3 className="flex items-center gap-2 mb-3 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                                            Info de Reportante
                                        </h3>
                                        <div className="flex items-center gap-3 p-3 border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
                                            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-black text-lg shadow-md transform -rotate-1">
                                                {getInitials(observation.user?.name)}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-bold text-gray-900 truncate dark:text-white">
                                                    {observation.user?.name || "Usuario"}
                                                </p>
                                                <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">{observation.user?.email}</p>
                                            </div>
                                        </div>
                                    </section>

                                    {/* Descripción */}
                                    <section>
                                        <h3 className="flex items-center gap-2 mb-3 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                                            Descripción
                                        </h3>
                                        <div className="p-4 text-sm leading-relaxed text-gray-800 dark:text-gray-200 bg-gray-50/50 dark:bg-gray-900/10 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-inner">
                                            {observation.description}
                                        </div>
                                    </section>
                                </div>

                                {/* Columna Derecha */}
                                <div className="space-y-6">
                                    {/* Detalles Rápidos */}
                                    <div className="grid grid-cols-1 gap-3">
                                        <div className="p-3 bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-700 rounded-xl flex items-center gap-3">
                                            <div className="p-1.5 bg-red-100 dark:bg-red-900/30 rounded-lg">
                                                <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Ubicación</p>
                                                <p className="text-xs font-bold text-gray-900 dark:text-white uppercase">{observation.area?.name || "N/A"}</p>
                                            </div>
                                        </div>

                                        <div className="p-3 bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-700 rounded-xl flex items-center gap-3">
                                            <div className="p-1.5 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                                                <svg className="w-4 h-4 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Tipo</p>
                                                <p className="text-xs font-bold text-gray-900 dark:text-white capitalize">
                                                    {observation.observation_type?.replace(/_/g, " ")}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Categorías */}
                                    {observation.categories && observation.categories.length > 0 && (
                                        <div className="p-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm">
                                            <h3 className="mb-3 text-[10px] font-black tracking-widest text-gray-400 uppercase">Categorías</h3>
                                            <div className="flex flex-wrap gap-1.5">
                                                {observation.categories.map((cat) => (
                                                    <span key={cat.id} className="px-2 py-1 text-[9px] font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 rounded-lg">
                                                        {cat.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Resolución (Ancho completo) */}
                            {observation.status === 'cerrada' && observation.closure_notes && (
                                <section className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-700">
                                    <h3 className="flex items-center gap-2 mb-4 text-[10px] font-black tracking-widest text-green-600 dark:text-green-400 uppercase">
                                        Acciones de Resolución
                                    </h3>
                                    <div className="p-5 border-2 border-green-50 dark:border-green-900/20 bg-green-50/20 dark:bg-green-900/10 rounded-2xl">
                                        <p className="text-sm text-green-900 dark:text-green-200 leading-relaxed whitespace-pre-wrap">
                                            {observation.closure_notes}
                                        </p>
                                        {observation.closedByUser && (
                                            <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-green-100 dark:border-green-800/30">
                                                <span className="text-[9px] font-bold text-green-600/70">Cerrada por:</span>
                                                <span className="text-[10px] font-black text-green-700 dark:text-green-300 uppercase">{observation.closedByUser.name}</span>
                                            </div>
                                        )}
                                    </div>
                                </section>
                            )}

                            {/* Evidencia (Ancho completo) */}
                            <section className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-700">
                                <h3 className="mb-4 text-[10px] font-black tracking-widest text-gray-400 uppercase">Evidencia Documentada</h3>
                                {observation.images && observation.images.length > 0 ? (
                                    <div className="grid grid-cols-3 gap-3">
                                        {observation.images.map((img) => (
                                            <a
                                                href={`/storage/${img.path}`}
                                                target="_blank"
                                                key={img.id}
                                                className="group aspect-square overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 shadow-sm"
                                            >
                                                <img src={`/storage/${img.path}`} alt="Evidencia" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                                            </a>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-6 text-center border-2 border-dashed border-gray-100 dark:border-gray-700 rounded-2xl">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Sin archivos adjuntos</p>
                                    </div>
                                )}
                            </section>
                        </div>
                    ) : (
                        <form onSubmit={handleCloseReport} className="p-8 space-y-6 max-w-xl mx-auto">
                            <div className="bg-white dark:bg-gray-800 p-6 border border-gray-100 dark:border-gray-700 rounded-3xl shadow-lg space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl">
                                        <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-black text-gray-900 dark:text-white">Formulario de Cierre</h3>
                                </div>
                                
                                <textarea
                                    className="w-full min-h-[150px] p-4 text-sm bg-gray-50/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                    placeholder="Explica detalladamente la solución..."
                                    value={data.closure_notes}
                                    onChange={(e) => setData('closure_notes', e.target.value)}
                                    required
                                />
                                <InputError message={errors.closure_notes} />

                                <div className="space-y-3">
                                    <p className="text-[10px] font-black text-gray-400 uppercase">Subir Fotos de Resolución</p>
                                    <input
                                        type="file" multiple accept="image/*"
                                        onChange={handleFileChange}
                                        className="block w-full text-[10px] text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                                    />
                                    {data.photos.length > 0 && (
                                        <div className="flex gap-2 flex-wrap pt-2">
                                            {data.photos.map((file, i) => (
                                                <div key={i} className="flex items-center gap-2 pl-3 pr-2 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[9px] font-bold rounded-xl border border-blue-100 dark:border-blue-800 group shadow-sm">
                                                    <span className="truncate max-w-[120px]">{file.name}</span>
                                                    <button 
                                                        type="button" 
                                                        onClick={() => removePhoto(i)} 
                                                        className="p-1 hover:bg-blue-200 dark:hover:bg-blue-700 rounded-full transition-colors text-blue-400 hover:text-blue-600"
                                                    >
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </form>
                    )}
                </div>

                {/* Footer Moderno - Fijo en la parte inferior */}
                <div className="flex-shrink-0 px-6 py-4 bg-gray-50 dark:bg-gray-900/60 border-t dark:border-gray-700">
                    <div className="flex items-center justify-between gap-4">
                        <div className="hidden sm:block">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                Documento de seguridad oficial
                            </p>
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            {!showClosureForm ? (
                                <>
                                    <button
                                        onClick={handleCloseModal}
                                        className="px-5 py-2 text-xs font-black tracking-widest text-gray-500 uppercase transition-all bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm flex-1 sm:flex-none"
                                    >
                                        Cerrar
                                    </button>

                                    {canClose && observation.status === "en_progreso" && (
                                        <button
                                            onClick={() => setShowClosureForm(true)}
                                            className="px-6 py-2 text-xs font-black tracking-widest text-white uppercase transition-all bg-blue-600 dark:bg-blue-500 rounded-xl hover:bg-blue-500 dark:hover:bg-blue-400 shadow-lg shadow-blue-500/20 active:scale-95 flex-1 sm:flex-none"
                                        >
                                            ✓ Resolver
                                        </button>
                                    )}
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => setShowClosureForm(false)}
                                        disabled={processing}
                                        className="px-5 py-2 text-xs font-black tracking-widest text-gray-500 uppercase transition-all bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-xl flex-1 sm:flex-none"
                                    >
                                        Regresar
                                    </button>

                                    <button
                                        onClick={handleCloseReport}
                                        disabled={processing || !data.closure_notes}
                                        className={`px-6 py-2 text-xs font-black tracking-widest text-white uppercase transition-all rounded-xl flex-1 sm:flex-none ${
                                            processing || !data.closure_notes
                                                ? "bg-gray-300 dark:bg-gray-700"
                                                : "bg-green-600 hover:bg-green-500 shadow-lg shadow-green-500/20"
                                        }`}
                                    >
                                        {processing ? "..." : "Confirmar"}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
