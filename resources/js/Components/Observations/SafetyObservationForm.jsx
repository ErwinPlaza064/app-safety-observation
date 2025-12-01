import { router } from "@inertiajs/react";
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
    categories,
    onClose,
    savedDraft,
}) {
    const [currentStep, setCurrentStep] = useState(1);
    const [isSaving, setIsSaving] = useState(false);

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
        observed_person: savedDraft?.observed_person || "",
        area_id:
            savedDraft?.area_id ||
            (Array.isArray(areas) && areas.length > 0 ? areas[0].id : ""),
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
            formData.category_ids.length > 0 &&
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
        if (step === 2 && !formData.observation_type)
            newErrors.observation_type =
                "Debe seleccionar un tipo de observación";
        if (step === 3) {
            if (formData.category_ids.length === 0)
                newErrors.category_ids =
                    "Debe seleccionar al menos una categoría";
            if (formData.description.length < 20)
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

        if (formData.id) {
            router.put(
                route("observations.update", formData.id),
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
        } else {
            router.post(
                route("observations.store"),
                { ...formData, is_draft: true },
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
        const submitData = new FormData();
        Object.keys(formData).forEach((key) => {
            if (key === "category_ids")
                formData[key].forEach((id) =>
                    submitData.append("category_ids[]", id)
                );
            else if (key === "photos")
                formData[key].forEach((file) =>
                    submitData.append("photos[]", file)
                );
            else submitData.append(key, formData[key]);
        });

        router.post(route("observations.store"), submitData, {
            onSuccess: () => {
                showToast("Observación enviada exitosamente", "success");
                setCurrentStep(1);
                setTimeout(() => {
                    if (onClose) onClose();
                }, 1500);
            },
            onError: (err) => {
                setErrors(err);
                showToast("Error al enviar. Verifica los datos.", "error");
            },
        });
    };

    return (
        <div
            className="relative overflow-hidden bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg"
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
                            x
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

                {currentStep === 1 && (
                    <ObserverInfoStep
                        formData={formData}
                        onChange={handleInputChange}
                    />
                )}

                {currentStep === 2 && (
                    <AreaTypeStep
                        formData={formData}
                        onChange={handleInputChange}
                        areas={areas}
                        errors={errors}
                        onOpenHelp={() => setShowHelpModal(true)}
                    />
                )}

                {currentStep === 3 && (
                    <DetailsStep
                        formData={formData}
                        onChange={handleInputChange}
                        onToggleCategory={handleCategoryToggle}
                        categories={categories}
                        errors={errors}
                    />
                )}

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
                        <div className="flex flex-col w-full gap-3 md:flex-row md:w-auto">
                            <button
                                onClick={handleSaveDraft}
                                className="w-full px-6 py-3 border dark:border-gray-600 dark:text-gray-300 rounded-lg md:w-auto md:py-2 hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                                Guardar Borrador
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="w-full px-6 py-3 text-white transition-all transform bg-[#1e3a8a] dark:bg-blue-700 rounded-lg shadow-md md:w-auto md:py-2 hover:bg-blue-900 dark:hover:bg-blue-600 hover:scale-105 active:scale-95"
                            >
                                Enviar Observación
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
