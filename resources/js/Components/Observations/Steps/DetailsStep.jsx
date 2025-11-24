export default function DetailsStep({
    formData,
    onChange,
    onToggleCategory,
    categories,
    errors,
}) {
    return (
        <div className="py-4 pl-4 border-l-4 border-[#1e3a8a] md:pl-6">
            <div className="mb-6">
                <label className="block mb-3 text-sm font-medium text-gray-700">
                    Categorías Aplicables
                </label>
                {errors.category_ids && (
                    <p className="mb-2 text-sm text-red-600">
                        {errors.category_ids}
                    </p>
                )}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {categories.map((category) => (
                        <label
                            key={category.id}
                            className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition ${
                                formData.category_ids.includes(category.id)
                                    ? "border-[#1e3a8a] bg-blue-50"
                                    : "border-gray-300 hover:border-[#1e3a8a]"
                            }`}
                        >
                            <input
                                type="checkbox"
                                checked={formData.category_ids.includes(
                                    category.id
                                )}
                                onChange={() => onToggleCategory(category.id)}
                                className="mr-3 accent-[#1e3a8a]"
                            />
                            <span
                                className={`text-sm ${
                                    formData.category_ids.includes(category.id)
                                        ? "text-[#1e3a8a] font-medium"
                                        : "text-gray-700"
                                }`}
                            >
                                {category.name}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                    Descripción Detallada{" "}
                    <span className="text-red-500">*</span>
                </label>
                {errors.description && (
                    <p className="mb-2 text-sm text-red-600">
                        {errors.description}
                    </p>
                )}
                <textarea
                    value={formData.description}
                    onChange={(e) => onChange("description", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-[#1e3a8a] focus:border-[#1e3a8a] outline-none"
                    rows={6}
                    placeholder="Describa la observación en detalle..."
                ></textarea>
                <p className="mt-1 text-xs text-gray-500">
                    Mínimo 20 caracteres. Actual: {formData.description.length}
                </p>
            </div>
        </div>
    );
}
