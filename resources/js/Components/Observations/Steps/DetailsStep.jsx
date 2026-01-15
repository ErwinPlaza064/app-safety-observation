import { useState, useEffect } from "react";

export default function DetailsStep({
    formData,
    onChange,
    onToggleCategory,
    categories,
    errors,
    isUnsafeAct = false, // Nueva prop
}) {
    const [inconsistencyWarning, setInconsistencyWarning] = useState(null);

    // Configuración según tipo de observación
    const typeConfig = {
        acto_seguro: {
            placeholder:
                "Describe el comportamiento positivo observado. Ejemplo: 'El trabajador utilizó correctamente su equipo de protección personal y siguió los procedimientos de seguridad al operar la maquinaria...'",
            label: "Describe el Acto Seguro",
            negativeWords: [
                "peligro",
                "peligroso",
                "riesgo",
                "riesgoso",
                "inseguro",
                "insegura",
                "mal",
                "malo",
                "mala",
                "incorrecto",
                "incorrecta",
                "violación",
                "incumplimiento",
                "falta",
                "negligencia",
                "descuido",
                "accidente",
                "lesión",
                "daño",
                "herida",
                "sin casco",
                "sin guantes",
                "sin protección",
                "no usó",
                "no utilizó",
                "omitió",
                "ignoró",
            ],
            warningMessage:
                "⚠️ Seleccionaste 'Acto Seguro' pero la descripción parece contener términos negativos. ¿Estás seguro que es un acto seguro?",
        },
        acto_inseguro: {
            placeholder:
                "Describe el comportamiento inseguro observado. Ejemplo: 'Se observó a un trabajador operando maquinaria sin el equipo de protección adecuado, poniendo en riesgo su integridad...'",
            label: "Describe el Acto Inseguro",
            positiveWords: [
                "correcto",
                "correcta",
                "correctamente",
                "adecuado",
                "adecuada",
                "seguro",
                "segura",
                "bien",
                "excelente",
                "bueno",
                "buena",
                "cumplió",
                "respetó",
                "utilizó correctamente",
                "usó correctamente",
                "felicitar",
                "reconocer",
                "destacar",
                "positivo",
                "positiva",
            ],
            warningMessage:
                "⚠️ Seleccionaste 'Acto Inseguro' pero la descripción parece describir algo positivo. ¿Estás seguro que es un acto inseguro?",
        },
        condicion_insegura: {
            placeholder:
                "Describe la condición física insegura observada. Ejemplo: 'Se detectó un cable eléctrico expuesto en el área de producción que representa un riesgo de electrocución...'",
            label: "Describe la Condición Insegura",
            positiveWords: [
                "correcto",
                "correcta",
                "adecuado",
                "adecuada",
                "seguro",
                "segura",
                "bien",
                "excelente",
                "bueno",
                "buena",
                "óptimo",
                "óptima",
                "perfecto",
                "perfecta",
            ],
            warningMessage:
                "⚠️ Seleccionaste 'Condición Insegura' pero la descripción parece describir algo positivo. ¿Estás seguro que es una condición insegura?",
        },
    };

    const currentConfig = typeConfig[formData.observation_type] || {
        placeholder: "Describa la observación en detalle...",
        label: "Descripción Detallada",
    };

    // Validar inconsistencias en la descripción
    useEffect(() => {
        if (!formData.description || formData.description.length < 15) {
            setInconsistencyWarning(null);
            return;
        }

        const description = formData.description.toLowerCase();
        const config = typeConfig[formData.observation_type];

        if (!config) {
            setInconsistencyWarning(null);
            return;
        }

        let hasInconsistency = false;

        if (
            formData.observation_type === "acto_seguro" &&
            config.negativeWords
        ) {
            hasInconsistency = config.negativeWords.some((word) =>
                description.includes(word.toLowerCase())
            );
        } else if (config.positiveWords) {
            // Para actos/condiciones inseguras, verificar si solo hay palabras positivas
            const hasOnlyPositive = config.positiveWords.some((word) =>
                description.includes(word.toLowerCase())
            );
            const hasNegativeIndicators = [
                "riesgo",
                "peligro",
                "insegur",
                "mal",
                "sin ",
                "no ",
                "falta",
                "ausencia",
                "incorrecto",
                "problema",
            ].some((word) => description.includes(word));

            hasInconsistency = hasOnlyPositive && !hasNegativeIndicators;
        }

        setInconsistencyWarning(
            hasInconsistency ? config.warningMessage : null
        );
    }, [formData.description, formData.observation_type]);

    return (
        <div className="py-4 pl-4 border-l-4 border-[#1e3a8a] md:pl-6">
            {/* Solo mostrar categorías si NO es condición insegura */}
            {!isUnsafeAct && (
                <div className="mb-6">
                    <label className="block mb-3 text-sm font-medium text-gray-700 dark:text-gray-200">
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
                                        ? "border-[#1e3a8a] dark:border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                                        : "border-gray-300 dark:border-gray-600 hover:border-[#1e3a8a] dark:hover:border-blue-500"
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
                                            ? "text-[#1e3a8a] dark:text-blue-400 font-medium"
                                            : "text-gray-700 dark:text-gray-200"
                                    }`}
                                >
                                    {category.name}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {/* Mensaje informativo cuando es condición insegura */}
            {isUnsafeAct && (
                <div className="p-4 mb-6 border-l-4 border-blue-500 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <div className="flex items-start gap-3">
                        <svg
                            className="w-5 h-5 mt-0.5 text-blue-600 dark:text-blue-400 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <div>
                            <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                                Las categorías no están disponibles para Condiciones Inseguras
                            </p>
                            <p className="mt-1 text-xs text-blue-700 dark:text-blue-400">
                                Solo necesitas proporcionar una descripción detallada de la condición observada.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                    {currentConfig.label}{" "}
                    <span className="text-red-500">*</span>
                </label>

                {/* Indicador del tipo seleccionado */}
                {formData.observation_type && (
                    <div
                        className={`mb-3 px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${
                            formData.observation_type === "acto_seguro"
                                ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800"
                                : "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
                        }`}
                    >
                        {formData.observation_type === "acto_seguro" ? (
                            <>
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <span>
                                    Estás reportando un{" "}
                                    <strong>comportamiento positivo</strong>
                                </span>
                            </>
                        ) : formData.observation_type === "acto_inseguro" ? (
                            <>
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                    />
                                </svg>
                                <span>
                                    Estás reportando un{" "}
                                    <strong>comportamiento inseguro</strong>
                                </span>
                            </>
                        ) : (
                            <>
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                    />
                                </svg>
                                <span>
                                    Estás reportando una{" "}
                                    <strong>condición física insegura</strong>
                                </span>
                            </>
                        )}
                    </div>
                )}

                {errors.description && (
                    <p className="mb-2 text-sm text-red-600">
                        {errors.description}
                    </p>
                )}

                {/* Advertencia de inconsistencia */}
                {inconsistencyWarning && (
                    <div className="p-3 mb-3 text-sm border rounded-lg bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-400">
                        <div className="flex items-start gap-2">
                            <svg
                                className="w-5 h-5 mt-0.5 flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                            <div>
                                <p className="font-medium">
                                    {inconsistencyWarning}
                                </p>
                                <p className="mt-1 text-xs opacity-80">
                                    Si crees que es correcto, puedes continuar.
                                    Esta es solo una sugerencia.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <textarea
                    value={formData.description}
                    onChange={(e) => onChange("description", e.target.value)}
                    className={`w-full p-3 border rounded-lg focus:ring-[#1e3a8a] focus:border-[#1e3a8a] outline-none dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 transition-colors ${
                        inconsistencyWarning
                            ? "border-orange-300 dark:border-orange-700"
                            : "border-gray-300 dark:border-gray-600"
                    }`}
                    rows={6}
                    placeholder={currentConfig.placeholder}
                ></textarea>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Mínimo 20 caracteres. Actual: {formData.description.length}
                </p>
            </div>
        </div>
    );
}