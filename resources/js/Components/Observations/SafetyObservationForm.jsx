import { router } from "@inertiajs/react";
import { compressImage } from "@/Utils/imageHelper";
import { useState, useEffect, useRef } from "react";
import AutoSaveIndicator from "@/Components/Observations/AutoSaveIndicator";
import ObserverInfoStep from "./Steps/ObserverInfoStep";
import AreaTypeStep from "./Steps/AreaTypeStep";
import DetailsStep from "./Steps/DetailsStep";
import ObservationHelpModal from "./ObservationHelpModal";
import PhotosStep from "./Steps/PhotosStep";

export default function SafetyObservationForm({
    user,
    areas,
    plants = [],
    categories,
    onClose,
    savedDraft,
}) {
    const [currentStep, setCurrentStep] = useState(1);
    const [isSaving, setIsSaving] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [showHelpModal, setShowHelpModal] = useState(false);

    const [lastSaved, setLastSaved] = useState(
        savedDraft ? new Date(savedDraft.updated_at) : null
    );

    const [toast, setToast] = useState({
        show: false,
        message: "",
        type: "success",
    });

    const [formData, setFormData] = useState({
        id: savedDraft?.id || null,
        observer_name: user?.name || "",
        employee_id: user?.employee_number || "",
        department: user?.area || "",
        observation_date: savedDraft?.observation_date
            ? savedDraft.observation_date.split("T")[0]
            : new Date().toISOString().split("T")[0],
        payroll_number: savedDraft?.payroll_number || "",
        observed_person: savedDraft?.observed_person || "",
        plant_id: savedDraft?.plant_id || user?.plant_id || "",
        area_id: savedDraft?.area_id || user?.area_id || "",
        observation_type: savedDraft?.observation_type || "",
        category_ids: savedDraft?.categories
            ? savedDraft.categories.map((c) => c.id)
            : [],
        description: savedDraft?.description || "",
        photos: [],
    });

    const [errors, setErrors] = useState({});

    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const isValidDraft =
            formData.description.length > 5 &&
            (formData.observation_type === "condicion_insegura" || formData.category_ids.length > 0) &&
            formData.observation_type !== "";

        if (!isValidDraft) return;

        const timeoutId = setTimeout(() => {
            handleAutoSave();
        }, 2000);

        return () => clearTimeout(timeoutId);
    }, [
        formData.description,
        formData.category_ids,
        formData.observation_type,
        formData.payroll_number,
        formData.observed_person,
        formData.area_id,
        formData.observation_date,
        formData.observer_name,
        formData.employee_id,
        formData.department,
    ]);

    useEffect(() => {
        if (toast.show) {
            const timer = setTimeout(
                () => setToast((prev) => ({ ...prev, show: false })),
                3000
            );
            return () => clearTimeout(timer);
        }
    }, [toast.show]);

    // Limpiar categorías cuando se selecciona "condicion_insegura"
    useEffect(() => {
        if (formData.observation_type === "condicion_insegura") {
            setFormData((prev) => ({ ...prev, category_ids: [] }));
        }
    }, [formData.observation_type]);

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            if (e.target.tagName === "TEXTAREA") return;

            e.preventDefault();
            if (currentStep < 4) {
                handleNext();
            }
        }
    };

    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
    };

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
    };

    const handleCategoryToggle = (categoryId) => {
        setFormData((prev) => ({
            ...prev,
            category_ids: prev.category_ids.includes(categoryId)
                ? prev.category_ids.filter((id) => id !== categoryId)
                : [...prev.category_ids, categoryId],
        }));
    };

    const handlePhotoChange = async (e) => {
        const files = Array.from(e.target.files);
        if (formData.photos.length + files.length > 5) {
            showToast("Máximo 5 imágenes permitidas", "error");
            return;
        }

        try {
            const compressedFiles = await Promise.all(
                files.map(file => compressImage(file))
            );

            setFormData((prev) => ({
                ...prev,
                photos: [...prev.photos, ...compressedFiles],
            }));
        } catch (error) {
            console.error("Error al comprimir imágenes:", error);
            showToast("Error al procesar las imágenes", "error");
        }
    };

    const removePhoto = (index) => {
        setFormData((prev) => ({
            ...prev,
            photos: prev.photos.filter((_, i) => i !== index),
        }));
    };

    const validateStep = (step) => {
        const newErrors = {};

        // PASO 1: Tipo de observación + Planta
        if (step === 1) {
            if (!formData.observation_type)
                newErrors.observation_type = "Debe seleccionar un tipo de observación";
            if (!formData.plant_id)
                newErrors.plant_id = "Debe seleccionar una planta";
            if (!formData.area_id)
                newErrors.area_id = "Debe seleccionar un área";
        }

        // PASO 2: Información del observador
        if (step === 2) {
            if (
                formData.observation_type !== "condicion_insegura" &&
                (!formData.payroll_number || formData.payroll_number.length !== 5)
            ) {
                newErrors.payroll_number =
                    "El número de nómina debe tener exactamente 5 dígitos";
            }
            if (
                !formData.observed_person ||
                formData.observed_person.trim() === ""
            ) {
                newErrors.observed_person =
                    "La persona observada o título es obligatorio";
            }
        }

        // PASO 3: Categorías + Descripción
        if (step === 3) {
            // Solo validar categorías si NO es condición insegura
            if (formData.observation_type !== "condicion_insegura") {
                if (formData.category_ids.length === 0)
                    newErrors.category_ids =
                        "Debe seleccionar al menos una categoría";
            }
            
            if (!formData.description || formData.description.trim().length < 20)
                newErrors.description =
                    "La descripción debe tener al menos 20 caracteres";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) setCurrentStep(currentStep + 1);
    };

    const handlePrevious = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
        else if (onClose) onClose();
    };

    const handleAutoSave = () => {
        setIsSaving(true);

        // Preparar datos para autoguardar
        const dataToSave = { ...formData, is_draft: true };
        
        // Si es condición insegura, asegurar que category_ids esté vacío
        if (dataToSave.observation_type === "condicion_insegura") {
            dataToSave.category_ids = [];
        }

        if (formData.id) {
            router.put(
                route("observations.update", formData.id),
                dataToSave,
                {
                    preserveState: true,
                    preserveScroll: true,
                    onSuccess: () => {
                        setLastSaved(new Date());
                        setIsSaving(false);
                    },
                    onError: (errors) => {
                        console.error("Error autoguardado:", errors);
                        setIsSaving(false);
                    },
                }
            );
        } else {
            router.post(
                route("observations.store"),
                dataToSave,
                {
                    preserveState: true,
                    preserveScroll: true,
                    onSuccess: (page) => {
                        setLastSaved(new Date());
                        setIsSaving(false);

                        if (!formData.id && page.props.savedDraft) {
                            setFormData((prev) => ({
                                ...prev,
                                id: page.props.savedDraft.id,
                            }));
                        }
                    },
                    onError: (errors) => {
                        console.error("Error autoguardado", errors);
                        setIsSaving(false);
                    },
                }
            );
        }
    };

    const handleSaveDraft = () => {
        handleAutoSave();
        showToast("Borrador guardado manualmente", "success");
    };

    const handleSubmit = () => {
        if (!validateStep(3)) {
            setCurrentStep(3);
            return;
        }

        if (isSubmitting) return;

        setIsSubmitting(true);

        const submitData = new FormData();
        
        // Preparar datos para enviar
        const dataToSubmit = { ...formData };
        
        // Si es condición insegura, limpiar las categorías
        if (dataToSubmit.observation_type === "condicion_insegura") {
            dataToSubmit.category_ids = [];
        }
        
        // Agregar todos los campos al FormData
        Object.keys(dataToSubmit).forEach((key) => {
            if (key === "category_ids") {
                dataToSubmit[key].forEach((id) =>
                    submitData.append("category_ids[]", id)
                );
            } else if (key === "photos") {
                dataToSubmit[key].forEach((file) =>
                    submitData.append("photos[]", file)
                );
            } else if (key !== "id") {
                submitData.append(key, dataToSubmit[key]);
            }
        });

        // Marcar como NO borrador (usar 1/0 para compatibilidad con validador boolean de Laravel en FormData)
        submitData.append("is_draft", "0");

        // Determinar la ruta y método
        const routeToUse = formData.id 
            ? route("observations.update", formData.id)
            : route("observations.store");

        // Si es una actualización, usar método PUT
        if (formData.id) {
            submitData.append("_method", "PUT");
        }

        router.post(routeToUse, submitData, {
            forceFormData: true,
            onSuccess: () => {
                showToast("Observación enviada exitosamente", "success");
                setCurrentStep(1);
                setTimeout(() => {
                    setIsSubmitting(false);
                    if (onClose) onClose();
                }, 1500);
            },
            onError: (err) => {
                console.error("Error al enviar:", err);
                setErrors(err);
                showToast("Error al enviar. Verifica los datos.", "error");
                setIsSubmitting(false);
            },
        });
    };

    return (
        <div
            className="relative overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg"
            onKeyDown={handleKeyDown}
        >
            {toast.show && (
                <div className="fixed z-50 flex items-center justify-center bottom-4 left-4 right-4 md:left-auto md:right-4 md:bottom-4 md:justify-end">
                    <div
                        className={`flex items-center px-4 py-3 rounded-lg shadow-lg text-white transition-all transform duration-300 ${
                            toast.type === "error"
                                ? "bg-red-500"
                                : "bg-green-500"
                        }`}
                    >
                        <span className="font-medium">{toast.message}</span>
                        <button
                            onClick={() =>
                                setToast((prev) => ({ ...prev, show: false }))
                            }
                            className="ml-4 focus:outline-none"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

            <div className="p-4 text-gray-900 dark:text-gray-100 md:p-6">
                <div className="flex items-start justify-between mb-6 md:mb-8">
                    <div>
                        <h2 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-gray-200 md:text-3xl">
                            Nueva Observación
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 md:text-base">
                            Complete el formulario con los detalles.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
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
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            ></path>
                        </svg>
                    </button>
                </div>

                {/* PASO 1: Tipo de Observación + Planta */}
                {currentStep === 1 && (
                    <AreaTypeStep
                        formData={formData}
                        onChange={handleInputChange}
                        areas={areas}
                        plants={plants}
                        errors={errors}
                        onOpenHelp={() => setShowHelpModal(true)}
                    />
                )}

                {/* PASO 2: Información del Observador */}
                {currentStep === 2 && (
                    <ObserverInfoStep
                        formData={formData}
                        onChange={handleInputChange}
                        errors={errors}
                    />
                )}

                {/* PASO 3: Categorías + Descripción */}
                {currentStep === 3 && (
                    <DetailsStep
                        formData={formData}
                        onChange={handleInputChange}
                        onToggleCategory={handleCategoryToggle}
                        categories={categories}
                        errors={errors}
                        isUnsafeAct={formData.observation_type === "condicion_insegura"}
                    />
                )}

                {/* PASO 4: Fotos */}
                {currentStep === 4 && (
                    <PhotosStep
                        formData={formData}
                        onPhotoChange={handlePhotoChange}
                        onRemovePhoto={removePhoto}
                    />
                )}

                <div className="flex flex-col-reverse justify-between gap-4 pt-6 mt-6 border-t dark:border-gray-700 md:flex-row md:items-center md:gap-0">
                    <button
                        onClick={handlePrevious}
                        className={`w-full md:w-auto px-6 py-3 md:py-2 rounded-lg transition flex items-center justify-center ${
                            currentStep === 1
                                ? "bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                        }`}
                    >
                        {currentStep === 1 ? "Cancelar" : "Anterior"}
                    </button>

                    <div className="text-sm text-center text-gray-500 dark:text-gray-400 md:text-left">
                        Paso {currentStep} de 4
                    </div>

                    {currentStep < 4 ? (
                        <button
                            onClick={handleNext}
                            className="flex items-center justify-center w-full px-6 py-3 text-white transition-all transform bg-[#1e3a8a] dark:bg-blue-700 rounded-lg shadow-md md:w-auto md:py-2 hover:bg-blue-900 dark:hover:bg-blue-600 hover:scale-105 active:scale-95"
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
                        <div className="flex flex-col w-full gap-2 md:w-auto">
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className={`w-full px-8 py-3 text-white rounded-lg shadow-md transition-all ${
                                    isSubmitting
                                        ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                                        : "bg-[#1e3a8a] dark:bg-blue-700 hover:bg-blue-900 dark:hover:bg-blue-600 transform hover:scale-105 active:scale-95"
                                }`}
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center justify-center">
                                        <svg
                                            className="w-5 h-5 mr-2 text-white animate-spin"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        <span>Enviando...</span>
                                    </div>
                                ) : (
                                    "Enviar Observación"
                                )}
                            </button>
                            <button
                                onClick={handleSaveDraft}
                                disabled={isSubmitting}
                                className={`w-full px-8 py-2.5 text-sm border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-lg transition-all ${
                                    isSubmitting
                                        ? "opacity-50 cursor-not-allowed"
                                        : "hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400"
                                }`}
                            >
                                Guardar Borrador
                            </button>
                        </div>
                    )}
                </div>

                {(isSaving || lastSaved) && (
                    <div className="mt-4">
                        <AutoSaveIndicator isSaving={isSaving} />
                    </div>
                )}
                {!isSaving && lastSaved && (
                    <div className="text-xs text-center text-gray-400 dark:text-gray-500">
                        Guardado a las {lastSaved.toLocaleTimeString()}
                    </div>
                )}
            </div>

            <ObservationHelpModal
                show={showHelpModal}
                onClose={() => setShowHelpModal(false)}
            />
        </div>
    );
}
