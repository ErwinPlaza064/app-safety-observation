import { FaQuestionCircle } from "react-icons/fa";

export default function AreaTypeStep({
    formData,
    onChange,
    areas,
    plants,
    errors,
    onOpenHelp,
}) {
    const isUnsafeCondition = formData.observation_type === "condicion_insegura";

    return (
        <div className="py-4 pl-4 border-l-4 border-[#1e3a8a] md:pl-6">
            <div className="mb-8">
                <div className="flex items-end justify-between mb-4">
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

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {[
                        {
                            value: "acto_inseguro",
                            label: "Acto Inseguro",
                            desc: "Comportamiento",
                        },
                        {
                            value: "condicion_insegura",
                            label: "Condición Insegura",
                            desc: "Situación física",
                        },
                        {
                            value: "acto_seguro",
                            label: "Acto Seguro",
                            desc: "Positivo",
                        },
                    ].map((type) => (
                        <label
                            key={type.value}
                            className={`flex flex-col p-3 border-2 rounded-lg cursor-pointer transition ${
                                formData.observation_type === type.value
                                    ? "border-[#1e3a8a] dark:border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                                    : "border-gray-300 dark:border-gray-600 hover:border-[#1e3a8a] dark:hover:border-blue-500"
                            }`}
                        >
                            <div className="flex items-center mb-1">
                                <input
                                    type="radio"
                                    name="observationType"
                                    value={type.value}
                                    checked={
                                        formData.observation_type === type.value
                                    }
                                    onChange={(e) => {
                                        onChange("observation_type", e.target.value);
                                        if (e.target.value === "condicion_insegura") {
                                            onChange("area_id", "");
                                        }
                                    }}
                                    className="mr-2 accent-[#1e3a8a]"
                                />
                                <span className={`text-sm font-semibold ${
                                    formData.observation_type === type.value
                                        ? "text-[#1e3a8a] dark:text-blue-400"
                                        : "text-gray-800 dark:text-gray-200"
                                }`}>
                                    {type.label}
                                </span>
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                {type.desc}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                        Planta
                        <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={formData.plant_id}
                        onChange={(e) => {
                            onChange("plant_id", parseInt(e.target.value));
                        }}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-[#1e3a8a] outline-none transition-colors dark:bg-gray-700 dark:text-gray-200"
                    >
                        <option value="">Selecciona una planta</option>
                        {plants.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.name}
                            </option>
                        ))}
                    </select>
                    {errors.plant_id && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.plant_id}
                        </p>
                    )}
                </div>

                {!isUnsafeCondition && (
                    <div className="animate-fade-in">
                        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                            Área de la persona observada
                            <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.area_id}
                            onChange={(e) =>
                                onChange("area_id", e.target.value === "" ? "" : parseInt(e.target.value))
                            }
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-[#1e3a8a] outline-none transition-colors dark:bg-gray-700 dark:text-gray-200"
                        >
                            <option value="">Selecciona un área</option>
                            {areas.map((a) => (
                                <option key={a.id} value={a.id}>
                                    {a.name}
                                </option>
                            ))}
                        </select>
                        {errors.area_id && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.area_id}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
