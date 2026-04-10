import { useState, useMemo } from "react";
import { router } from "@inertiajs/react";
import { IoMdClose } from "react-icons/io";
import Modal from "@/Components/Modal";
import SecondaryButton from "@/Components/SecondaryButton";
import PrimaryButton from "@/Components/PrimaryButton";
import ObservationDetailsModal from "@/Components/Dashboard/ObservationDetailsModal";

export default function ObservationsManagement({ observations = [], plants = [], areas = [] }) {
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [filterPlant, setFilterPlant] = useState("");

    // Modal states
    const [selectedObservation, setSelectedObservation] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteSuccess, setDeleteSuccess] = useState(false);

    // Edit modal states
    const [showEditModal, setShowEditModal] = useState(false);
    const [editData, setEditData] = useState({});
    const [editErrors, setEditErrors] = useState({});
    const [isEditing, setIsEditing] = useState(false);

    const filteredObservations = useMemo(() => {
        if (!observations || !Array.isArray(observations)) return [];

        return observations.filter((obs) => {
            const searchLower = search.toLowerCase();
            const matchesSearch = !search || 
                (obs.folio || "").toLowerCase().includes(searchLower) ||
                (obs.observed_person || "").toLowerCase().includes(searchLower) ||
                (obs.description || "").toLowerCase().includes(searchLower) ||
                (obs.user?.name || "").toLowerCase().includes(searchLower) ||
                (obs.payroll_number || "").toLowerCase().includes(searchLower) ||
                String(obs.id).includes(searchLower);

            const matchesType = !filterType || obs.observation_type === filterType;
            const matchesStatus = !filterStatus || obs.status === filterStatus;
            const matchesPlant = !filterPlant || String(obs.plant_id) === filterPlant;

            return matchesSearch && matchesType && matchesStatus && matchesPlant;
        });
    }, [observations, search, filterType, filterStatus, filterPlant]);

    const getTypeInfo = (obsType) => {
        switch (obsType) {
            case "acto_inseguro":
                return { label: "Acto Inseguro", color: "bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-300", dot: "bg-orange-500" };
            case "condicion_insegura":
                return { label: "Condición Insegura", color: "bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300", dot: "bg-red-500" };
            case "acto_seguro":
                return { label: "Acto Seguro", color: "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300", dot: "bg-green-500" };
            default:
                return { label: "—", color: "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400", dot: "bg-gray-400" };
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            en_progreso: "bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800",
            cerrada: "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800",
            borrador: "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-600",
        };
        const labels = { en_progreso: "Abierta", cerrada: "Cerrada", borrador: "Borrador" };
        return (
            <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-full border ${styles[status] || styles.borrador}`}>
                {labels[status] || status}
            </span>
        );
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("es-MX", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    // === DELETE LOGIC ===
    const handleDeleteClick = (obs) => {
        setSelectedObservation(obs);
        setShowDeleteModal(true);
        setDeleteConfirmText("");
        setDeleteSuccess(false);
    };

    const confirmDelete = () => {
        if (!selectedObservation) return;
        setIsDeleting(true);

        router.delete(route("observations.destroy", selectedObservation.id), {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteSuccess(true);
                setTimeout(() => {
                    setShowDeleteModal(false);
                    setSelectedObservation(null);
                    setDeleteConfirmText("");
                    setDeleteSuccess(false);
                }, 1500);
            },
            onError: () => {
                setIsDeleting(false);
            },
            onFinish: () => {
                setIsDeleting(false);
            },
        });
    };

    const deleteConfirmationWord = "ELIMINAR";
    const isDeleteConfirmed = deleteConfirmText === deleteConfirmationWord;

    // === EDIT LOGIC ===
    const handleEditClick = (obs) => {
        setSelectedObservation(obs);
        setEditData({
            observation_date: obs.observation_date ? obs.observation_date.split("T")[0] : "",
            observed_person: obs.observed_person || "",
            payroll_number: obs.payroll_number || "",
            company: obs.company || "WASION",
            plant_id: obs.plant_id || "",
            area_id: obs.area_id || "",
            observation_type: obs.observation_type || "",
            description: obs.description || "",
            category_ids: obs.categories?.map(c => c.id) || [],
        });
        setEditErrors({});
        setShowEditModal(true);
    };

    const handleEditChange = (field, value) => {
        setEditData(prev => ({ ...prev, [field]: value }));
        if (editErrors[field]) {
            setEditErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    const submitEdit = () => {
        if (!selectedObservation) return;
        setIsEditing(true);
        setEditErrors({});

        router.put(route("observations.update", selectedObservation.id), editData, {
            preserveScroll: true,
            onSuccess: () => {
                setShowEditModal(false);
                setSelectedObservation(null);
                setEditData({});
            },
            onError: (errors) => {
                setEditErrors(errors);
            },
            onFinish: () => {
                setIsEditing(false);
            },
        });
    };

    // === VIEW DETAILS ===
    const handleViewClick = (obs) => {
        setSelectedObservation(obs);
        setShowDetailsModal(true);
    };

    const totalStats = useMemo(() => {
        const total = observations.length;
        const open = observations.filter(o => o.status === "en_progreso").length;
        const closed = observations.filter(o => o.status === "cerrada").length;
        const actosInseguros = observations.filter(o => o.observation_type === "acto_inseguro").length;
        const condiciones = observations.filter(o => o.observation_type === "condicion_insegura").length;
        const actosSeguros = observations.filter(o => o.observation_type === "acto_seguro").length;
        return { total, open, closed, actosInseguros, condiciones, actosSeguros };
    }, [observations]);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                    { label: "Total", value: totalStats.total, color: "text-gray-800 dark:text-gray-200", bg: "bg-gray-50 dark:bg-gray-800" },
                    { label: "Abiertas", value: totalStats.open, color: "text-blue-700 dark:text-blue-300", bg: "bg-blue-50 dark:bg-blue-900/30" },
                    { label: "Cerradas", value: totalStats.closed, color: "text-green-700 dark:text-green-300", bg: "bg-green-50 dark:bg-green-900/30" },
                    { label: "Actos Inseg.", value: totalStats.actosInseguros, color: "text-orange-700 dark:text-orange-300", bg: "bg-orange-50 dark:bg-orange-900/30" },
                    { label: "Condiciones", value: totalStats.condiciones, color: "text-red-700 dark:text-red-300", bg: "bg-red-50 dark:bg-red-900/30" },
                    { label: "Actos Seguros", value: totalStats.actosSeguros, color: "text-emerald-700 dark:text-emerald-300", bg: "bg-emerald-50 dark:bg-emerald-900/30" },
                ].map((stat) => (
                    <div key={stat.label} className={`${stat.bg} rounded-xl p-3 border border-gray-100 dark:border-gray-700 text-center`}>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">{stat.label}</p>
                        <p className={`text-xl font-black ${stat.color}`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="p-4 bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg border border-gray-100 dark:border-gray-700">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="relative w-full md:w-1/3">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar por folio, persona, descripción, ID..."
                            className="w-full py-2 pl-10 pr-10 text-sm text-gray-900 placeholder-gray-400 bg-white border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={() => setSearch("")}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <IoMdClose className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    <div className="flex flex-col w-full gap-2 sm:flex-row md:w-auto">
                        <select
                            value={filterPlant}
                            onChange={(e) => setFilterPlant(e.target.value)}
                            className="text-sm text-gray-900 bg-white border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Todas las Plantas</option>
                            {plants.map((p) => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>

                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="text-sm text-gray-900 bg-white border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Todos los Tipos</option>
                            <option value="acto_inseguro">Acto Inseguro</option>
                            <option value="condicion_insegura">Condición Insegura</option>
                            <option value="acto_seguro">Acto Seguro</option>
                        </select>

                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="text-sm text-gray-900 bg-white border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Todos los Estados</option>
                            <option value="en_progreso">Abierta</option>
                            <option value="cerrada">Cerrada</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Results count */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                    Gestión de Observaciones
                    <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                        ({filteredObservations.length} resultado{filteredObservations.length !== 1 ? "s" : ""})
                    </span>
                </h3>
            </div>

            {/* Table */}
            <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg border border-gray-100 dark:border-gray-700">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                            <tr>
                                <th className="px-4 py-3">ID</th>
                                <th className="px-4 py-3">Folio</th>
                                <th className="px-4 py-3">Tipo</th>
                                <th className="px-4 py-3">Persona / Condición</th>
                                <th className="px-4 py-3">Observador</th>
                                <th className="px-4 py-3">Planta</th>
                                <th className="px-4 py-3">Fecha</th>
                                <th className="px-4 py-3">Estado</th>
                                <th className="px-4 py-3 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {filteredObservations.length > 0 ? (
                                filteredObservations.map((obs) => {
                                    const typeInfo = getTypeInfo(obs.observation_type);
                                    return (
                                        <tr key={obs.id} className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                                            <td className="px-4 py-3 font-mono text-xs text-gray-500 dark:text-gray-400">
                                                #{obs.id}
                                            </td>
                                            <td className="px-4 py-3 font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                                                {obs.folio || `—`}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-full ${typeInfo.color}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${typeInfo.dot}`} />
                                                    {typeInfo.label}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap max-w-[180px] truncate">
                                                {obs.observed_person || "N/A"}
                                            </td>
                                            <td className="px-4 py-3 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                                                {obs.user?.name || "N/A"}
                                            </td>
                                            <td className="px-4 py-3 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                                                {obs.plant?.name || "N/A"}
                                            </td>
                                            <td className="px-4 py-3 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                                                {formatDate(obs.observation_date)}
                                            </td>
                                            <td className="px-4 py-3">
                                                {getStatusBadge(obs.status)}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-center gap-1">
                                                    {/* View */}
                                                    <button
                                                        onClick={() => handleViewClick(obs)}
                                                        className="p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all"
                                                        title="Ver detalles"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                    </button>
                                                    {/* Edit */}
                                                    <button
                                                        onClick={() => handleEditClick(obs)}
                                                        className="p-1.5 text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded-lg transition-all"
                                                        title="Editar observación"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    {/* Delete */}
                                                    <button
                                                        onClick={() => handleDeleteClick(obs)}
                                                        className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all"
                                                        title="Eliminar observación"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="9" className="px-4 py-12 text-center">
                                        <div className="flex flex-col items-center gap-2 text-gray-400 dark:text-gray-500">
                                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <p className="text-sm font-medium">No se encontraron observaciones</p>
                                            <p className="text-xs">Intenta ajustar los filtros de búsqueda</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Details Modal */}
            <ObservationDetailsModal
                show={showDetailsModal}
                observation={selectedObservation}
                onClose={() => {
                    setShowDetailsModal(false);
                    setSelectedObservation(null);
                }}
                canClose={false}
                canShare={true}
            />

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onClose={() => !isDeleting && setShowDeleteModal(false)} maxWidth="md">
                <div className="p-6">
                    {deleteSuccess ? (
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                                <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">¡Eliminada!</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">La observación ha sido eliminada permanentemente.</p>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-red-100 rounded-full dark:bg-red-900/30">
                                    <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                        Eliminar Observación
                                    </h2>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                                        {selectedObservation?.folio || `ID #${selectedObservation?.id}`}
                                    </p>
                                </div>
                            </div>

                            {/* Info card */}
                            {selectedObservation && (
                                <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-700">
                                    <div className="grid grid-cols-2 gap-3 text-xs">
                                        <div>
                                            <span className="text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest text-[9px]">Tipo</span>
                                            <p className="font-bold text-gray-800 dark:text-gray-200 capitalize mt-0.5">
                                                {selectedObservation.observation_type?.replace(/_/g, " ")}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest text-[9px]">Estado</span>
                                            <p className="mt-0.5">{getStatusBadge(selectedObservation.status)}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest text-[9px]">Persona</span>
                                            <p className="font-medium text-gray-800 dark:text-gray-200 mt-0.5">
                                                {selectedObservation.observed_person || "N/A"}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest text-[9px]">Observador</span>
                                            <p className="font-medium text-gray-800 dark:text-gray-200 mt-0.5">
                                                {selectedObservation.user?.name || "N/A"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="p-4 mb-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl">
                                <p className="text-sm text-red-800 dark:text-red-300 font-medium mb-1">
                                    ⚠️ Esta acción es irreversible
                                </p>
                                <p className="text-xs text-red-600 dark:text-red-400">
                                    Se eliminarán permanentemente la observación, todas sus imágenes de evidencia y las relaciones con categorías. Esta acción no se puede deshacer.
                                </p>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                    Escribe <span className="font-black text-red-600 dark:text-red-400 tracking-widest">{deleteConfirmationWord}</span> para confirmar:
                                </label>
                                <input
                                    type="text"
                                    value={deleteConfirmText}
                                    onChange={(e) => setDeleteConfirmText(e.target.value.toUpperCase())}
                                    placeholder={deleteConfirmationWord}
                                    className="w-full text-sm px-4 py-2.5 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-red-500 focus:border-red-500 font-mono tracking-widest text-center"
                                    autoComplete="off"
                                    spellCheck="false"
                                />
                            </div>

                            <div className="flex justify-end gap-3">
                                <SecondaryButton onClick={() => setShowDeleteModal(false)} disabled={isDeleting}>
                                    Cancelar
                                </SecondaryButton>
                                <button
                                    onClick={confirmDelete}
                                    disabled={!isDeleteConfirmed || isDeleting}
                                    className={`inline-flex items-center px-4 py-2 text-xs font-bold tracking-widest text-white uppercase transition-all rounded-lg ${
                                        isDeleteConfirmed && !isDeleting
                                            ? "bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 shadow-lg shadow-red-500/20 active:scale-95"
                                            : "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
                                    }`}
                                >
                                    {isDeleting ? (
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Eliminando...
                                        </div>
                                    ) : (
                                        "Eliminar Permanentemente"
                                    )}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </Modal>

            {/* Edit Modal */}
            <Modal show={showEditModal} onClose={() => !isEditing && setShowEditModal(false)} maxWidth="2xl">
                <div className="flex flex-col max-h-[90vh]">
                    {/* Header */}
                    <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-50 dark:bg-amber-900/30 rounded-lg">
                                <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Editar Observación</h2>
                                <p className="text-[11px] font-mono text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                                    {selectedObservation?.folio || `ID-${selectedObservation?.id}`}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowEditModal(false)}
                            className="p-2 text-gray-400 transition-all rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Body */}
                    <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-gray-800">
                        <div className="space-y-5 max-w-2xl mx-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Tipo */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">
                                        Tipo de Observación
                                    </label>
                                    <select
                                        value={editData.observation_type || ""}
                                        onChange={(e) => handleEditChange("observation_type", e.target.value)}
                                        className="w-full text-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="acto_inseguro">Acto Inseguro</option>
                                        <option value="condicion_insegura">Condición Insegura</option>
                                        <option value="acto_seguro">Acto Seguro</option>
                                    </select>
                                    {editErrors.observation_type && (
                                        <p className="mt-1 text-xs text-red-500">{editErrors.observation_type}</p>
                                    )}
                                </div>

                                {/* Fecha */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">
                                        Fecha de Observación
                                    </label>
                                    <input
                                        type="date"
                                        value={editData.observation_date || ""}
                                        onChange={(e) => handleEditChange("observation_date", e.target.value)}
                                        className="w-full text-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {editErrors.observation_date && (
                                        <p className="mt-1 text-xs text-red-500">{editErrors.observation_date}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Persona observada */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">
                                        {editData.observation_type === "condicion_insegura" ? "Título / Condición" : "Persona Observada"}
                                    </label>
                                    <input
                                        type="text"
                                        value={editData.observed_person || ""}
                                        onChange={(e) => handleEditChange("observed_person", e.target.value)}
                                        className="w-full text-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {editErrors.observed_person && (
                                        <p className="mt-1 text-xs text-red-500">{editErrors.observed_person}</p>
                                    )}
                                </div>

                                {/* Nómina */}
                                {editData.observation_type !== "condicion_insegura" && (
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">
                                            N. Nómina / Identificador
                                        </label>
                                        <input
                                            type="text"
                                            value={editData.payroll_number || ""}
                                            onChange={(e) => handleEditChange("payroll_number", e.target.value)}
                                            className="w-full text-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        {editErrors.payroll_number && (
                                            <p className="mt-1 text-xs text-red-500">{editErrors.payroll_number}</p>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Planta */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">
                                        Planta
                                    </label>
                                    <select
                                        value={editData.plant_id || ""}
                                        onChange={(e) => handleEditChange("plant_id", e.target.value)}
                                        className="w-full text-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Seleccionar...</option>
                                        {plants.map((p) => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                    {editErrors.plant_id && (
                                        <p className="mt-1 text-xs text-red-500">{editErrors.plant_id}</p>
                                    )}
                                </div>

                                {/* Área */}
                                {editData.observation_type !== "condicion_insegura" && (
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">
                                            Área
                                        </label>
                                        <select
                                            value={editData.area_id || ""}
                                            onChange={(e) => handleEditChange("area_id", e.target.value)}
                                            className="w-full text-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">Seleccionar...</option>
                                            {areas.map((a) => (
                                                <option key={a.id} value={a.id}>{a.name}</option>
                                            ))}
                                        </select>
                                        {editErrors.area_id && (
                                            <p className="mt-1 text-xs text-red-500">{editErrors.area_id}</p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Empresa */}
                            {editData.observation_type !== "condicion_insegura" && (
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">
                                        Empresa
                                    </label>
                                    <input
                                        type="text"
                                        value={editData.company || ""}
                                        onChange={(e) => handleEditChange("company", e.target.value)}
                                        className="w-full text-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {editErrors.company && (
                                        <p className="mt-1 text-xs text-red-500">{editErrors.company}</p>
                                    )}
                                </div>
                            )}

                            {/* Descripción */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">
                                    Descripción
                                </label>
                                <textarea
                                    value={editData.description || ""}
                                    onChange={(e) => handleEditChange("description", e.target.value)}
                                    rows={4}
                                    className="w-full text-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                />
                                {editErrors.description && (
                                    <p className="mt-1 text-xs text-red-500">{editErrors.description}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex-shrink-0 px-6 py-4 bg-gray-50 dark:bg-gray-900/60 border-t dark:border-gray-700">
                        <div className="flex items-center justify-end gap-3">
                            <SecondaryButton onClick={() => setShowEditModal(false)} disabled={isEditing}>
                                Cancelar
                            </SecondaryButton>
                            <PrimaryButton
                                onClick={submitEdit}
                                disabled={isEditing}
                                className="!bg-amber-600 hover:!bg-amber-700 dark:!bg-amber-500 dark:hover:!bg-amber-600"
                            >
                                {isEditing ? (
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Guardando...
                                    </div>
                                ) : (
                                    "Guardar Cambios"
                                )}
                            </PrimaryButton>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
