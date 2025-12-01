export default function ObserverInfoStep({ formData, onChange }) {
    return (
        <div className="py-4 pl-4 border-l-4 border-[#1e3a8a] md:pl-6">
            <div className="flex items-center mb-6">
                <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 mr-3 bg-[#1e3a8a] rounded-full">
                    <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 md:text-xl">
                    Información del Observador
                </h3>
            </div>

            <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2 md:gap-6 md:mb-6">
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                        Nombre
                    </label>
                    <input
                        type="text"
                        value={formData.observer_name}
                        readOnly
                        className="w-full px-4 py-2 text-gray-500 border border-gray-300 rounded-lg dark:text-gray-400 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
                    />
                </div>
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                        Numero De Nomina
                    </label>
                    <input
                        type="text"
                        value={formData.employee_id}
                        readOnly
                        className="w-full px-4 py-2 text-gray-500 border border-gray-300 rounded-lg dark:text-gray-400 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2 md:gap-6 md:mb-6">
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                        Depto
                    </label>
                    <input
                        value={formData.department}
                        readOnly
                        className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400"
                    />
                </div>
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                        Fecha
                    </label>
                    <input
                        type="date"
                        value={formData.observation_date}
                        onChange={(e) =>
                            onChange("observation_date", e.target.value)
                        }
                        className="w-full px-4 py-2 border rounded-lg focus:ring-[#1e3a8a] focus:border-[#1e3a8a] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    />
                </div>
            </div>

            <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                    Persona Observada/Numero Nomina o Título de la Situación
                </label>
                <input
                    type="text"
                    placeholder="Nombre de la persona observada o Titulo de la situación"
                    value={formData.observed_person}
                    onChange={(e) =>
                        onChange("observed_person", e.target.value)
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-[#1e3a8a] focus:border-[#1e3a8a] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                />
            </div>
        </div>
    );
}
