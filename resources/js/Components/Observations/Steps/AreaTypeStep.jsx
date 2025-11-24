export default function AreaTypeStep({ formData, onChange, areas, errors }) {
    return (
        <div className="py-4 pl-4 border-l-4 border-[#1e3a8a] md:pl-6">
            <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                    Área / Planta
                </label>
                <select
                    value={formData.area_id}
                    onChange={(e) =>
                        onChange("area_id", parseInt(e.target.value))
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-[#1e3a8a] outline-none transition-colors"
                >
                    {areas.map((a) => (
                        <option key={a.id} value={a.id}>
                            {a.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-6">
                <label className="block mb-3 text-sm font-medium text-gray-700">
                    Tipo de Observación <span className="text-red-500">*</span>
                </label>
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
                                    ? "border-[#1e3a8a] bg-blue-50"
                                    : "border-gray-300 hover:border-[#1e3a8a]"
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
                                            ? "text-[#1e3a8a]"
                                            : "text-gray-800"
                                    }`}
                                >
                                    {type.label}
                                </div>
                                <div className="text-xs text-gray-600 md:text-sm">
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
