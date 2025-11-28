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
                <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
                    <h2 className="flex items-center gap-2 text-xl font-bold text-gray-800">
                        <FaInfoCircle className="text-blue-600" />
                        Guía de Observación
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 transition-colors rounded-full hover:bg-gray-100 hover:text-gray-600"
                    >
                        <FaTimes />
                    </button>
                </div>

                <div className="p-6 space-y-4 overflow-y-auto bg-gray-50/50">
                    <div className="flex gap-4 p-4 transition-shadow bg-white border border-orange-200 shadow-sm rounded-xl hover:shadow-md">
                        <div className="pt-1 shrink-0">
                            <FaExclamationTriangle className="text-2xl text-orange-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">
                                Acto Inseguro
                            </h3>
                            <p className="text-sm leading-relaxed text-gray-700">
                                Comportamiento de una <strong>persona</strong>.
                                Alguien hace algo incorrecto o deja de seguir un
                                procedimiento.
                            </p>
                            <div className="inline-block px-2 py-1 mt-2 text-xs font-semibold text-orange-800 bg-orange-100 rounded">
                                Ej: No usar lentes, correr, distraerse.
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 p-4 transition-shadow bg-white border border-yellow-200 shadow-sm rounded-xl hover:shadow-md">
                        <div className="pt-1 shrink-0">
                            <FaIndustry className="text-2xl text-yellow-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">
                                Condición Insegura
                            </h3>
                            <p className="text-sm leading-relaxed text-gray-700">
                                Situación en el{" "}
                                <strong>entorno o equipo</strong> que puede
                                causar un accidente (independiente de la
                                persona).
                            </p>
                            <div className="inline-block px-2 py-1 mt-2 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded">
                                Ej: Piso mojado, cable pelado, barandal roto.
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 p-4 transition-shadow bg-white border border-green-200 shadow-sm rounded-xl hover:shadow-md">
                        <div className="pt-1 shrink-0">
                            <FaCheckCircle className="text-2xl text-green-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">
                                Acto Seguro
                            </h3>
                            <p className="text-sm leading-relaxed text-gray-700">
                                Comportamiento positivo que cumple o excede las
                                normas. ¡Reconócelo!
                            </p>
                            <div className="inline-block px-2 py-1 mt-2 text-xs font-semibold text-green-800 bg-green-100 rounded">
                                Ej: Usar EPP completo, reportar riesgos.
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end px-6 py-4 border-t bg-gray-50 shrink-0">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 text-sm font-medium text-white transition bg-[#1e3a8a] rounded-lg shadow-md hover:bg-blue-900"
                    >
                        Entendido, volver
                    </button>
                </div>
            </div>
        </Modal>
    );
}
