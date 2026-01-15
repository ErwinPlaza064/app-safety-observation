import { useForm } from "@inertiajs/react";
import Modal from "@/Components/Modal";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import InputError from "@/Components/InputError";
import { HiDownload, HiUpload } from "react-icons/hi";

export default function ImportUsersModal({ show, onClose }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        file: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("admin.users.import"), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <div className="p-6">
                <header className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                        Importar Usuarios desde Excel/CSV
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </header>

                <div className="space-y-6">
                    <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                        <h3 className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
                            <HiDownload className="w-4 h-4" /> Paso 1: Descarga el formato
                        </h3>
                        <p className="text-sm text-blue-700 dark:text-blue-400 mb-4">
                            Usa nuestro formato predefinido para asegurar que los datos se carguen correctamente.
                        </p>
                        <a
                            href={route("admin.users.template")}
                            className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-blue-300 dark:border-blue-700 rounded-md font-semibold text-xs text-blue-700 dark:text-blue-300 uppercase tracking-widest shadow-sm hover:bg-blue-50 dark:hover:bg-gray-700 transition-all active:scale-95"
                        >
                            <HiDownload className="w-4 h-4 mr-2" />
                            Descargar Formato .CSV
                        </a>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-dotted border-gray-300 dark:border-gray-600">
                            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                                <HiUpload className="w-4 h-4" /> Paso 2: Sube tu archivo
                            </h3>
                            
                            <input
                                type="file"
                                onChange={(e) => setData("file", e.target.files[0])}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-blue-400"
                                accept=".xlsx,.xls,.csv"
                                required
                            />
                            
                            <InputError message={errors.file} className="mt-2" />
                            
                            <ul className="mt-4 text-xs text-gray-500 dark:text-gray-400 space-y-1 list-disc pl-4">
                                <li>Los campos marcados como obligatorios en el formato no pueden estar vacíos.</li>
                                <li>El sistema detectará duplicados por email o número de empleado.</li>
                                <li>Si no incluyes contraseña, se asignará "Wasion2025*" por defecto.</li>
                            </ul>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                            <SecondaryButton onClick={onClose}>Cancelar</SecondaryButton>
                            <PrimaryButton disabled={processing} type="submit">
                                {processing ? "Procesando..." : "Importar Usuarios"}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </Modal>
    );
}
