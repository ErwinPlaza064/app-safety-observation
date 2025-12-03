import { FaQuestionCircle } from "react-icons/fa";

export default function AreaTypeStep({
    formData,
    onChange,
    areas,
    errors,
    onOpenHelp,
}) {
    return (
        <div className="py-4 pl-4 border-l-4 border-[#1e3a8a] md:pl-6">
            <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                    Área / Planta
                </label>
                <select
                    value={formData.area_id}
                    onChange={(e) =>
                        onChange("area_id", parseInt(e.target.value))
                    }
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-[#1e3a8a] outline-none transition-colors dark:bg-gray-700 dark:text-gray-200"
                >
                    {areas.map((a) => (
                        <option key={a.id} value={a.id}>
                            {a.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-6">
                <div className="flex items-end justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                        Tipo de Observación
                        <span className="text-red-500">*</span>
                    </label>
                    <button
                        type="button"
                        onClick={onOpenHelp}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1.5 transition-colors font-medium"
                    >
                        <FaQuestionCircle />
                        ¿No sabes cuál elegir?
                    </button>
                </div>

                {errors.observation_type && (
                    <p className="mb-2 text-sm text-red-600">
                        {errors.observation_type}
                    </p>
                )}

                <div className="space-y-3">
                    {[
                        {
                            value: "acto_inseguro",
                            label: "Acto Inseguro",
                            desc: "Comportamiento que puede causar un incidente",
                        },
                        {
                            value: "condicion_insegura",
                            label: "Condición Insegura",
                            desc: "Situación física que puede causar un incidente",
                        },
                        {
                            value: "acto_seguro",
                            label: "Acto Seguro",
                            desc: "Comportamiento positivo para reconocer",
                        },
                    ].map((type) => (
                        <label
                            key={type.value}
                            className={`flex items-start p-3 md:p-4 border-2 rounded-lg cursor-pointer transition ${
                                formData.observation_type === type.value
                                    ? "border-[#1e3a8a] dark:border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                                    : "border-gray-300 dark:border-gray-600 hover:border-[#1e3a8a] dark:hover:border-blue-500"
                            }`}
                        >
                            <input
                                type="radio"
                                name="observationType"
                                value={type.value}
                                checked={
                                    formData.observation_type === type.value
                                }
                                onChange={(e) =>
                                    onChange("observation_type", e.target.value)
                                }
                                className="mt-1 mr-3 accent-[#1e3a8a]"
                            />
                            <div>
                                <div
                                    className={`text-sm font-semibold md:text-base ${
                                        formData.observation_type === type.value
                                            ? "text-[#1e3a8a] dark:text-blue-400"
                                            : "text-gray-800 dark:text-gray-200"
                                    }`}
                                >
                                    {type.label}
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-400 md:text-sm">
                                    {type.desc}
                                </div>
                            </div>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
}
