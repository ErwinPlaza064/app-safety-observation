import { router } from "@inertiajs/react";
import { useState, useEffect, useRef } from "react";
import AutoSaveIndicator from "@/Components/Observations/AutoSaveIndicator";
import ObserverInfoStep from "./Steps/ObserverInfoStep";
import AreaTypeStep from "./Steps/AreaTypeStep";
import DetailsStep from "./Steps/DetailsStep";

// PhotosStep con funcionalidad de cámara integrada
function PhotosStep({ formData, onPhotoChange, onRemovePhoto }) {
    const [showWebcam, setShowWebcam] = useState(false);
    const [stream, setStream] = useState(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const startWebcam = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment" }
            });
            setStream(mediaStream);
            setShowWebcam(true);
            
            setTimeout(() => {
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
            }, 100);
        } catch (error) {
            console.error("Error accessing webcam:", error);
            alert("No se pudo acceder a la cámara. Verifica los permisos.");
        }
    };

    const stopWebcam = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setShowWebcam(false);
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            const context = canvas.getContext('2d');
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            canvas.toBlob((blob) => {
                const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
                const event = {
                    target: {
                        files: [file]
                    }
                };
                onPhotoChange(event);
                stopWebcam();
            }, 'image/jpeg', 0.9);
        }
    };

    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [stream]);

    return (
        <div className="space-y-6">
            <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-800">
                    Evidencia Fotográfica (Opcional)
                </h3>
                <p className="mb-4 text-sm text-gray-600">
                    Puede adjuntar hasta 5 fotografías que documenten la observación.
                </p>
            </div>

            {/* Modal de Webcam */}
            {showWebcam && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
                    <div className="relative w-full max-w-2xl p-4 bg-white rounded-lg">
                        <button
                            onClick={stopWebcam}
                            className="absolute top-2 right-2 p-2 text-white bg-red-500 rounded-full hover:bg-red-600"
                        >
                            ✕
                        </button>
                        
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className="w-full rounded-lg"
                        />
                        
                        <canvas ref={canvasRef} className="hidden" />
                        
                        <button
                            onClick={capturePhoto}
                            className="w-full px-6 py-3 mt-4 text-white transition-all transform bg-blue-600 rounded-lg hover:bg-blue-700 hover:scale-105"
                        >
                            📸 Capturar Foto
                        </button>
                    </div>
                </div>
            )}

            {/* Botones para tomar foto o subir */}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                {/* Botón Webcam (Desktop) */}
                <button
                    type="button"
                    onClick={startWebcam}
                    disabled={formData.photos.length >= 5}
                    className="flex items-center justify-center gap-2 px-6 py-4 transition-all border-2 border-purple-300 border-dashed rounded-lg bg-purple-50 hover:bg-purple-100 hover:border-purple-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span className="font-medium text-purple-700">Usar Webcam</span>
                </button>

                {/* Botón Tomar Foto (Móvil) */}
                <label className="flex items-center justify-center gap-2 px-6 py-4 transition-all border-2 border-blue-300 border-dashed rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 hover:border-blue-400">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="font-medium text-blue-700">Tomar Foto</span>
                    <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={onPhotoChange}
                        className="hidden"
                        disabled={formData.photos.length >= 5}
                    />
                </label>

                {/* Botón Subir desde Galería */}
                <label className="flex items-center justify-center gap-2 px-6 py-4 transition-all border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-gray-400">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="font-medium text-gray-700">Subir Galería</span>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={onPhotoChange}
                        className="hidden"
                        disabled={formData.photos.length >= 5}
                    />
                </label>
            </div>

            <div className="text-sm text-center text-gray-500">
                {formData.photos.length} de 5 fotos agregadas
            </div>

            {formData.photos.length > 0 && (
                <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="mb-3 text-sm font-semibold text-gray-700">
                        Fotos Adjuntas:
                    </h4>
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                        {formData.photos.map((photo, index) => (
                            <div key={index} className="relative group">
                                <img
                                    src={URL.createObjectURL(photo)}
                                    alt={`Foto ${index + 1}`}
                                    className="object-cover w-full h-32 rounded-lg"
                                />
                                <button
                                    type="button"
                                    onClick={() => onRemovePhoto(index)}
                                    className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                                >
                                    ✕
                                </button>
                                <div className="absolute bottom-0 left-0 right-0 px-2 py-1 text-xs text-center text-white bg-black bg-opacity-50 rounded-b-lg">
                                    Foto {index + 1}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {formData.photos.length >= 5 && (
                <div className="p-3 text-sm text-center text-orange-700 bg-orange-100 rounded-lg">
                    Has alcanzado el límite de 5 fotos. Elimina una para agregar otra.
                </div>
            )}

            <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                    <span className="font-semibold">💡 Consejo:</span> Las fotos ayudan a documentar mejor la observación y facilitan la comprensión de la situación.
                </p>
            </div>
        </div>
    );
}

export default function SafetyObservationForm({
    user,
    areas,
    categories,
    onClose,
    savedDraft,
}) {
    const [currentStep, setCurrentStep] = useState(1);
    const [isSaving, setIsSaving] = useState(false);

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

    // ✅ CORRECCIÓN: useEffect con dependencias específicas para evitar guardado duplicado
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
        // Solo incluir campos que deben disparar el autoguardado
        // NO incluir formData.id para evitar guardado duplicado
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
            className="relative overflow-hidden bg-white shadow-sm sm:rounded-lg"
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

                <div className="flex flex-col-reverse justify-between gap-4 pt-6 mt-6 border-t md:flex-row md:items-center md:gap-0">
                    <button
                        onClick={handlePrevious}
                        className={`w-full md:w-auto px-6 py-3 md:py-2 rounded-lg transition flex items-center justify-center ${
                            currentStep === 1
                                ? "bg-white text-gray-500 border border-gray-300 hover:bg-gray-50"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                    >
                        {currentStep === 1 ? "Cancelar" : "Anterior"}
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

                {(isSaving || lastSaved) && (
                    <div className="mt-4">
                        <AutoSaveIndicator isSaving={isSaving} />
                    </div>
                )}
                {!isSaving && lastSaved && (
                    <div className="text-xs text-center text-gray-400">
                        Guardado a las {lastSaved.toLocaleTimeString()}
                    </div>
                )}
            </div>
        </div>
    );
}