import { router } from "@inertiajs/react";
import { useState, useEffect } from "react";

export default function SafetyObservationForm({
    user,
    areas,
    categories,
    onClose,
}) {
    const [currentStep, setCurrentStep] = useState(1);
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);

    const [toast, setToast] = useState({
        show: false,
        message: "",
        type: "success",
    });

    const [formData, setFormData] = useState({
        observer_name: user?.name || "",
        employee_id: user?.employee_number || "",
        department: user?.area || "",
        observation_date: new Date().toISOString().split("T")[0],
        observed_person: "",
        area_id: Array.isArray(areas) && areas.length > 0 ? areas[0].id : "",
        observation_type: "",
        category_ids: [],
        description: "",
        photos: [],
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (toast.show) {
            const timer = setTimeout(() => {
                setToast((prev) => ({ ...prev, show: false }));
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [toast.show]);

    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
    };

    useEffect(() => {
        const timer = setInterval(() => {
            if (
                formData.description.length > 0 ||
                formData.category_ids.length > 0
            ) {
                handleAutoSave();
            }
        }, 30000);
        return () => clearInterval(timer);
    }, [formData]);

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: null }));
        }
    };

    const handleCategoryToggle = (categoryId) => {
        setFormData((prev) => ({
            ...prev,
            category_ids: prev.category_ids.includes(categoryId)
                ? prev.category_ids.filter((id) => id !== categoryId)
                : [...prev.category_ids, categoryId],
        }));
    };

    const handlePhotoChange = (e) => {
        const files = Array.from(e.target.files);
        if (formData.photos.length + files.length > 5) {
            showToast("Máximo 5 imágenes permitidas", "error");
            return;
        }
        setFormData((prev) => ({
            ...prev,
            photos: [...prev.photos, ...files],
        }));
    };

    const removePhoto = (index) => {
        setFormData((prev) => ({
            ...prev,
            photos: prev.photos.filter((_, i) => i !== index),
        }));
    };

    const validateStep = (step) => {
        const newErrors = {};

        if (step === 2) {
            if (!formData.observation_type) {
                newErrors.observation_type =
                    "Debe seleccionar un tipo de observación";
            }
        }

        if (step === 3) {
            if (formData.category_ids.length === 0) {
                newErrors.category_ids =
                    "Debe seleccionar al menos una categoría";
            }
            if (formData.description.length < 20) {
                newErrors.description =
                    "La descripción debe tener al menos 20 caracteres";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        } else {
            if (onClose) onClose();
        }
    };

    const handleAutoSave = () => {
        setIsSaving(true);
        router.post(
            route("observations.draft"),
            { ...formData, is_draft: true },
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    setLastSaved(new Date());
                    setIsSaving(false);
                },
                onError: () => setIsSaving(false),
            }
        );
    };

    const handleSaveDraft = () => {
        router.post(
            route("observations.draft"),
            { ...formData, is_draft: true },
            {
                onSuccess: () => {
                    showToast("Borrador guardado exitosamente", "success");
                },
                onError: (errors) => {
                    console.error("Errores:", errors);
                    showToast("Error al guardar el borrador", "error");
                },
            }
        );
    };

    const handleSubmit = () => {
        if (!validateStep(3)) {
            setCurrentStep(3);
            return;
        }

        const submitData = new FormData();

        Object.keys(formData).forEach((key) => {
            if (key === "category_ids") {
                formData[key].forEach((id) =>
                    submitData.append("category_ids[]", id)
                );
            } else if (key === "photos") {
                formData[key].forEach((file) =>
                    submitData.append("photos[]", file)
                );
            } else {
                submitData.append(key, formData[key]);
            }
        });

        router.post(route("observations.store"), submitData, {
            onSuccess: () => {
                showToast("Observación enviada exitosamente", "success");
                setCurrentStep(1);
                setTimeout(() => {
                    if (onClose) onClose();
                }, 1500);
            },
            onError: (errors) => {
                setErrors(errors);
                console.error("Errores:", errors);
                showToast("Error al enviar. Verifica los datos.", "error");
            },
        });
    };

    return (
        <div className="relative overflow-hidden bg-white shadow-sm sm:rounded-lg">
            {toast.show && (
                <div className="fixed z-50 flex items-center justify-center bottom-4 left-4 right-4 md:left-auto md:right-4 md:bottom-4 md:justify-end">
                    <div
                        className={`flex items-center px-4 py-3 rounded-lg shadow-lg text-white transition-all transform duration-300 ${
                            toast.type === "error"
                                ? "bg-red-500"
                                : "bg-green-500"
                        }`}
                    >
                        {toast.type === "error" ? (
                            <svg
                                className="w-6 h-6 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        ) : (
                            <svg
                                className="w-6 h-6 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        )}
                        <span className="font-medium">{toast.message}</span>
                        <button
                            onClick={() =>
                                setToast((prev) => ({ ...prev, show: false }))
                            }
                            className="ml-4 text-white hover:text-gray-200 focus:outline-none"
                        >
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
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            <div className="p-4 text-gray-900 md:p-6">
                <div className="flex items-start justify-between mb-6 md:mb-8">
                    <div>
                        <h2 className="mb-2 text-2xl font-semibold text-gray-800 md:text-3xl">
                            Nueva Observación
                        </h2>
                        <p className="text-sm text-gray-600 md:text-base">
                            Complete el formulario con los detalles.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            ></path>
                        </svg>
                    </button>
                </div>

                {currentStep === 1 && (
                    <div className="py-4 pl-4 border-l-4 border-blue-500 md:pl-6">
                        <div className="flex items-center mb-6">
                            <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 mr-3 bg-blue-500 rounded-full">
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
                            <h3 className="text-lg font-semibold text-gray-800 md:text-xl">
                                Información del Observador
                            </h3>
                        </div>
                        <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2 md:gap-6 md:mb-6">
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-700">
                                    Nombre
                                </label>
                                <input
                                    type="text"
                                    value={formData.observer_name}
                                    readOnly
                                    className="w-full px-4 py-2 text-gray-500 border border-gray-300 rounded-lg bg-gray-50"
                                />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-700">
                                    ID
                                </label>
                                <input
                                    type="text"
                                    value={formData.employee_id}
                                    readOnly
                                    className="w-full px-4 py-2 text-gray-500 border border-gray-300 rounded-lg bg-gray-50"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2 md:gap-6 md:mb-6">
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-700">
                                    Depto
                                </label>
                                <input
                                    value={formData.department}
                                    readOnly
                                    className="w-full px-4 py-2 border rounded-lg bg-gray-50"
                                />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-700">
                                    Fecha
                                </label>
                                <input
                                    type="date"
                                    value={formData.observation_date}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "observation_date",
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                            </div>
                        </div>
                        <div className="mb-6">
                            <input
                                type="text"
                                placeholder="Persona observada"
                                value={formData.observed_person}
                                onChange={(e) =>
                                    handleInputChange(
                                        "observed_person",
                                        e.target.value
                                    )
                                }
                                className="w-full px-4 py-2 border rounded-lg"
                            />
                        </div>
                    </div>
                )}

                {currentStep === 2 && (
                    <div className="py-4 pl-4 border-l-4 border-blue-500 md:pl-6">
                        <div className="mb-6">
                            <label className="block mb-2 text-sm font-medium text-gray-700">
                                Área / Planta
                            </label>
                            <select
                                value={formData.area_id}
                                onChange={(e) =>
                                    handleInputChange(
                                        "area_id",
                                        parseInt(e.target.value)
                                    )
                                }
                                className="w-full p-2 border rounded-lg"
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
                                Tipo de Observación{" "}
                                <span className="text-red-500">*</span>
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
                                            formData.observation_type ===
                                            type.value
                                                ? "border-blue-500 bg-blue-50"
                                                : "border-gray-300 hover:border-blue-300"
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="observationType"
                                            value={type.value}
                                            checked={
                                                formData.observation_type ===
                                                type.value
                                            }
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "observation_type",
                                                    e.target.value
                                                )
                                            }
                                            className="mt-1 mr-3"
                                        />
                                        <div>
                                            <div className="text-sm font-semibold text-gray-800 md:text-base">
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
                )}

                {currentStep === 3 && (
                    <div className="py-4 pl-4 border-l-4 border-blue-500 md:pl-6">
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
                                            formData.category_ids.includes(
                                                category.id
                                            )
                                                ? "border-blue-500 bg-blue-50"
                                                : "border-gray-300 hover:border-blue-300"
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={formData.category_ids.includes(
                                                category.id
                                            )}
                                            onChange={() =>
                                                handleCategoryToggle(
                                                    category.id
                                                )
                                            }
                                            className="mr-3"
                                        />
                                        <span className="text-sm text-gray-700">
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
                                onChange={(e) =>
                                    handleInputChange(
                                        "description",
                                        e.target.value
                                    )
                                }
                                className="w-full p-2 border rounded-lg"
                                rows={6}
                                placeholder="Describa la observación en detalle..."
                            ></textarea>
                            <p className="mt-1 text-xs text-gray-500">
                                Mínimo 20 caracteres. Actual:{" "}
                                {formData.description.length}
                            </p>
                        </div>
                    </div>
                )}

                {currentStep === 4 && (
                    <div className="py-4 pl-4 border-l-4 border-blue-500 md:pl-6">
                        <div className="mb-6">
                            <label className="block mb-2 text-sm font-medium text-gray-700">
                                Fotografías (Opcional)
                            </label>
                            <input
                                type="file"
                                multiple
                                onChange={handlePhotoChange}
                                className="hidden"
                                id="p-upload"
                            />
                            <label
                                htmlFor="p-upload"
                                className="block p-8 text-center transition border-2 border-gray-300 border-dashed rounded-lg cursor-pointer md:p-12 hover:border-blue-400"
                            >
                                <svg
                                    className="w-12 h-12 mx-auto mb-4 text-blue-500 md:w-16 md:h-16"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                                    />
                                </svg>
                                <div className="mb-2 text-base font-medium text-gray-700 md:text-lg">
                                    Subir Fotografías
                                </div>
                                <div className="text-xs text-gray-500 md:text-sm">
                                    Haga clic para seleccionar archivos
                                </div>
                            </label>

                            {formData.photos.length > 0 && (
                                <div className="grid grid-cols-2 gap-4 mt-4 md:grid-cols-5">
                                    {formData.photos.map((photo, index) => (
                                        <div
                                            key={index}
                                            className="relative group"
                                        >
                                            <img
                                                src={URL.createObjectURL(photo)}
                                                alt={`Preview ${index + 1}`}
                                                className="object-cover w-full h-24 rounded-lg md:h-24"
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removePhoto(index)
                                                }
                                                className="absolute p-1 text-white bg-red-500 rounded-full shadow-md -top-2 -right-2 md:top-1 md:right-1 hover:bg-red-600"
                                            >
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
                                                        d="M6 18L18 6M6 6l12 12"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="flex flex-col-reverse justify-between gap-4 pt-6 mt-6 border-t md:flex-row md:items-center md:gap-0">
                    <button
                        onClick={handlePrevious}
                        className={`w-full md:w-auto px-6 py-3 md:py-2 rounded-lg transition flex items-center justify-center ${
                            currentStep === 1
                                ? "bg-white text-gray-500 border border-gray-300 hover:bg-gray-50"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                    >
                        {currentStep === 1 ? (
                            "Cancelar"
                        ) : (
                            <>
                                <svg
                                    className="w-5 h-5 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 19l-7-7 7-7"
                                    />
                                </svg>
                                Anterior
                            </>
                        )}
                    </button>

                    <div className="text-sm text-center text-gray-500 md:text-left">
                        Paso {currentStep} de 4
                    </div>

                    {currentStep < 4 ? (
                        <button
                            onClick={handleNext}
                            className="flex items-center justify-center w-full px-6 py-3 text-white transition-all transform bg-[#1e3a8a] rounded-lg shadow-md md:w-auto md:py-2 hover:bg-blue-900 hover:scale-105 active:scale-95"
                        >
                            Siguiente
                            <svg
                                className="w-5 h-5 ml-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </button>
                    ) : (
                        <div className="flex flex-col w-full gap-3 md:flex-row md:w-auto">
                            <button
                                onClick={handleSaveDraft}
                                className="w-full px-6 py-3 border rounded-lg md:w-auto md:py-2 hover:bg-gray-50"
                            >
                                Guardar Borrador
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="w-full px-6 py-3 text-white transition-all transform bg-[#1e3a8a] rounded-lg shadow-md md:w-auto md:py-2 hover:bg-blue-900 hover:scale-105 active:scale-95"
                            >
                                Enviar Observación
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-center pt-4 text-xs text-gray-400">
                    {isSaving ? "Guardando..." : "Autoguardado activado"}
                </div>
            </div>
        </div>
    );
}
