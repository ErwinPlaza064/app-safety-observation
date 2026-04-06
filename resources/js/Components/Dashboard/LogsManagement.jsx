import { useState, useEffect } from "react";
import axios from "axios";
import { HiDownload, HiTrash, HiRefresh, HiExclamationCircle, HiInformationCircle, HiExclamation } from "react-icons/hi";
import SecondaryButton from "@/Components/SecondaryButton";
import PrimaryButton from "@/Components/PrimaryButton";
import Modal from "@/Components/Modal";

export default function LogsManagement() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fileSize, setFileSize] = useState("");
    const [error, setError] = useState(null);
    const [showClearModal, setShowClearModal] = useState(false);
    const [clearing, setClearing] = useState(false);
    const [filterLevel, setFilterLevel] = useState("all");

    const fetchLogs = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(route("admin.logs.get"));
            setLogs(response.data.logs);
            setFileSize(response.data.file_size);
        } catch (err) {
            setError(err.response?.data?.error || "Error al cargar los logs.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const handleDownload = () => {
        window.location.href = route("admin.logs.download");
    };

    const handleClear = async () => {
        setClearing(true);
        try {
            await axios.post(route("admin.logs.clear"));
            fetchLogs();
            setShowClearModal(false);
        } catch (err) {
            alert("No se pudieron limpiar los logs.");
        } finally {
            setClearing(false);
        }
    };

    const getLevelBadge = (level) => {
        const lvl = level.toUpperCase();
        if (lvl.includes("ERROR") || lvl.includes("CRITICAL") || lvl.includes("ALERT") || lvl.includes("EMERGENCY")) {
            return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
        }
        if (lvl.includes("WARNING")) {
            return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
        }
        if (lvl.includes("INFO") || lvl.includes("NOTICE")) {
            return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
        }
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
    };

    const getLevelIcon = (level) => {
        const lvl = level.toUpperCase();
        if (lvl.includes("ERROR") || lvl.includes("CRITICAL") || lvl.includes("ALERT") || lvl.includes("EMERGENCY")) {
            return <HiExclamationCircle className="w-4 h-4" />;
        }
        if (lvl.includes("WARNING")) {
            return <HiExclamation className="w-4 h-4" />;
        }
        return <HiInformationCircle className="w-4 h-4" />;
    };

    const filteredLogs = filterLevel === "all" 
        ? logs 
        : logs.filter(log => log.level.toLowerCase().includes(filterLevel.toLowerCase()));

    return (
        <div className="space-y-4">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div className="flex flex-col">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                        Logs de Salud del Sistema
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Mostrando los últimos 500 eventos. Tamaño: {fileSize}
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <SecondaryButton onClick={fetchLogs} disabled={loading}>
                        <HiRefresh className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
                        Actualizar
                    </SecondaryButton>

                    <SecondaryButton onClick={handleDownload}>
                        <HiDownload className="w-4 h-4 mr-1" />
                        Descargar Log
                    </SecondaryButton>

                    <button
                        onClick={() => setShowClearModal(true)}
                        className="inline-flex items-center justify-center px-4 py-2 bg-white dark:bg-gray-800 border border-red-300 dark:border-red-800 rounded-lg font-semibold text-xs text-red-600 dark:text-red-400 uppercase tracking-widest shadow-sm hover:bg-red-50 dark:hover:bg-red-900/10 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all active:scale-95"
                    >
                        <HiTrash className="w-4 h-4 mr-1" />
                        Limpiar Logs
                    </button>
                </div>
            </div>

            <div className="p-4 bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
                <div className="flex items-center mb-4">
                    <label className="mr-2 text-sm font-medium text-gray-700 dark:text-gray-300">Filtrar por nivel:</label>
                    <select
                        value={filterLevel}
                        onChange={(e) => setFilterLevel(e.target.value)}
                        className="text-sm text-gray-900 bg-white border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="all">Todos los niveles</option>
                        <option value="error">Errores</option>
                        <option value="warning">Advertencias</option>
                        <option value="info">Información</option>
                    </select>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                ) : error ? (
                    <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-center">
                        {error}
                    </div>
                ) : filteredLogs.length === 0 ? (
                    <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-center py-20">
                        No hay logs que mostrar con los filtros actuales.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Nivel</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Fecha</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Mensaje</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                {filteredLogs.map((log, index) => (
                                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${getLevelBadge(log.level)}`}>
                                                {getLevelIcon(log.level)}
                                                {log.level.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {log.date}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200 break-words max-w-2xl">
                                            <div className="font-mono text-xs whitespace-pre-wrap">
                                                {log.message}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <Modal show={showClearModal} onClose={() => !clearing && setShowClearModal(false)} maxWidth="md">
                <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                        <HiTrash className="text-red-500" />
                        Limpiar histórico de logs
                    </h2>
                    <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
                        ¿Estás seguro de que deseas vaciar el archivo de logs? Esta acción no se puede deshacer. Se recomienda descargar una copia antes.
                    </p>
                    <div className="flex justify-end gap-3">
                        <SecondaryButton onClick={() => setShowClearModal(false)} disabled={clearing}>
                            Cancelar
                        </SecondaryButton>
                        <PrimaryButton 
                            onClick={handleClear} 
                            disabled={clearing}
                            className="!bg-red-600 hover:!bg-red-700"
                        >
                            {clearing ? "Vaciando..." : "Sí, vaciar archivo"}
                        </PrimaryButton>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
