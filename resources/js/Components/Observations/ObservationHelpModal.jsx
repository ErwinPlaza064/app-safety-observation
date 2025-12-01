import Modal from "@/Components/Modal";
import {
    FaExclamationTriangle,
    FaIndustry,
    FaCheckCircle,
    FaTimes,
    FaInfoCircle,
} from "react-icons/fa";

export default function ObservationHelpModal({ show, onClose }) {
    return (
        <Modal show={show} onClose={onClose} maxWidth="lg">
            <div className="flex flex-col max-h-[85vh]">
                <div className="flex items-center justify-between px-6 py-4 border-b dark:border-gray-700">
                    <h2 className="flex items-center gap-2 text-xl font-bold text-gray-800 dark:text-gray-200">
                        <FaInfoCircle className="text-blue-600 dark:text-blue-400" />
                        Guía de Observación
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 transition-colors rounded-full dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        <FaTimes />
                    </button>
                </div>

                <div className="p-6 space-y-4 overflow-y-auto bg-gray-50/50 dark:bg-gray-900/50">
                    <div className="flex gap-4 p-4 transition-shadow bg-white border border-orange-200 shadow-sm dark:bg-gray-800 dark:border-orange-800 rounded-xl hover:shadow-md">
                        <div className="pt-1 shrink-0">
                            <FaExclamationTriangle className="text-2xl text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                Acto Inseguro
                            </h3>
                            <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                                Comportamiento de una <strong>persona</strong>.
                                Alguien hace algo incorrecto o deja de seguir un
                                procedimiento.
                            </p>
                            <div className="inline-block px-2 py-1 mt-2 text-xs font-semibold text-orange-800 bg-orange-100 rounded dark:text-orange-300 dark:bg-orange-900/40">
                                Ej: No usar lentes, correr, distraerse.
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 p-4 transition-shadow bg-white border border-yellow-200 shadow-sm dark:bg-gray-800 dark:border-yellow-800 rounded-xl hover:shadow-md">
                        <div className="pt-1 shrink-0">
                            <FaIndustry className="text-2xl text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                Condición Insegura
                            </h3>
                            <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                                Situación en el{" "}
                                <strong>entorno o equipo</strong> que puede
                                causar un accidente (independiente de la
                                persona).
                            </p>
                            <div className="inline-block px-2 py-1 mt-2 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded dark:text-yellow-300 dark:bg-yellow-900/40">
                                Ej: Piso mojado, cable pelado, barandal roto.
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 p-4 transition-shadow bg-white border border-green-200 shadow-sm dark:bg-gray-800 dark:border-green-800 rounded-xl hover:shadow-md">
                        <div className="pt-1 shrink-0">
                            <FaCheckCircle className="text-2xl text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                Acto Seguro
                            </h3>
                            <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                                Comportamiento positivo que cumple o excede las
                                normas. ¡Reconócelo!
                            </p>
                            <div className="inline-block px-2 py-1 mt-2 text-xs font-semibold text-green-800 bg-green-100 rounded dark:text-green-300 dark:bg-green-900/40">
                                Ej: Usar EPP completo, reportar riesgos.
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end px-6 py-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800 shrink-0">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 text-sm font-medium text-white transition bg-[#1e3a8a] dark:bg-blue-700 rounded-lg shadow-md hover:bg-blue-900 dark:hover:bg-blue-600"
                    >
                        Entendido, volver
                    </button>
                </div>
            </div>
        </Modal>
    );
}
