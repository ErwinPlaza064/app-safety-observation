import { useState, useEffect, useRef } from "react";

export default function PhotosStep({ formData, onPhotoChange, onRemovePhoto }) {
    const [showWebcam, setShowWebcam] = useState(false);
    const [stream, setStream] = useState(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const startWebcam = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment" },
            });
            setStream(mediaStream);
            setShowWebcam(true);
        } catch (error) {
            console.error("Error accessing webcam:", error);
            alert("No se pudo acceder a la cámara. Verifica los permisos.");
        }
    };

    useEffect(() => {
        if (showWebcam && stream && videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    }, [showWebcam, stream]);

    const stopWebcam = () => {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
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

            const context = canvas.getContext("2d");
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            canvas.toBlob(
                (blob) => {
                    const file = new File([blob], `photo_${Date.now()}.jpg`, {
                        type: "image/jpeg",
                    });
                    const event = {
                        target: {
                            files: [file],
                        },
                    };
                    onPhotoChange(event);
                    stopWebcam();
                },
                "image/jpeg",
                0.9
            );
        }
    };

    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, [stream]);

    return (
        <div className="space-y-8">
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40">
                    <svg
                        className="w-8 h-8 text-blue-600 dark:text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                    </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                    Evidencia Fotográfica
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Opcional - Adjunta hasta 5 fotografías para documentar mejor
                    la observación
                </p>
            </div>

            {showWebcam && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="relative w-full max-w-2xl overflow-hidden bg-white shadow-2xl rounded-2xl dark:bg-gray-800">
                        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
                            <h4 className="font-semibold text-gray-800 dark:text-gray-100">
                                Capturar Foto
                            </h4>
                            <button
                                onClick={stopWebcam}
                                className="p-2 text-gray-500 transition-colors rounded-full hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"
                            >
                                <svg
                                    className="w-5 h-5"
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

                        <div className="p-4">
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                className="w-full rounded-xl"
                            />
                            <canvas ref={canvasRef} className="hidden" />
                        </div>

                        <div className="p-4 border-t dark:border-gray-700">
                            <button
                                onClick={capturePhoto}
                                className="flex items-center justify-center w-full gap-2 px-6 py-3 text-white transition-all bg-blue-600 rounded-xl hover:bg-blue-700"
                            >
                                <svg
                                    className="w-5 h-5"
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
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                </svg>
                                Capturar Foto
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <button
                    type="button"
                    onClick={startWebcam}
                    disabled={formData.photos.length >= 5}
                    className="flex flex-col items-center justify-center gap-3 p-6 transition-all border-2 border-purple-200 border-dashed group rounded-xl bg-purple-50/50 dark:bg-purple-900/10 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/20 hover:border-purple-400 dark:hover:border-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <div className="flex items-center justify-center w-12 h-12 transition-colors bg-purple-100 rounded-full dark:bg-purple-900/30 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50">
                        <svg
                            className="w-6 h-6 text-purple-600 dark:text-purple-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                        </svg>
                    </div>
                    <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                        Usar Webcam
                    </span>
                </button>

                <label className="flex flex-col items-center justify-center gap-3 p-6 transition-all border-2 border-blue-200 border-dashed cursor-pointer group rounded-xl bg-blue-50/50 dark:bg-blue-900/10 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/20 hover:border-blue-400 dark:hover:border-blue-600">
                    <div className="flex items-center justify-center w-12 h-12 transition-colors bg-blue-100 rounded-full dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50">
                        <svg
                            className="w-6 h-6 text-blue-600 dark:text-blue-400"
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
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                        </svg>
                    </div>
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                        Tomar Foto
                    </span>
                    <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={onPhotoChange}
                        className="hidden"
                        disabled={formData.photos.length >= 5}
                    />
                </label>

                <label className="flex flex-col items-center justify-center gap-3 p-6 transition-all border-2 border-gray-200 border-dashed cursor-pointer group rounded-xl bg-gray-50/50 dark:bg-gray-800/50 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-600">
                    <div className="flex items-center justify-center w-12 h-12 transition-colors bg-gray-100 rounded-full dark:bg-gray-700 group-hover:bg-gray-200 dark:group-hover:bg-gray-600">
                        <svg
                            className="w-6 h-6 text-gray-600 dark:text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Subir Galería
                    </span>
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

            <div className="flex items-center justify-center gap-2">
                <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            className={`w-2 h-2 rounded-full transition-colors ${
                                i < formData.photos.length
                                    ? "bg-blue-500"
                                    : "bg-gray-200 dark:bg-gray-700"
                            }`}
                        />
                    ))}
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formData.photos.length} de 5 fotos
                </span>
            </div>

            {formData.photos.length > 0 && (
                <div className="p-5 border border-gray-100 rounded-xl bg-gray-50/50 dark:bg-gray-800/50 dark:border-gray-700">
                    <h4 className="flex items-center gap-2 mb-4 text-sm font-semibold text-gray-700 dark:text-gray-200">
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
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                        Fotos Adjuntas
                    </h4>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
                        {formData.photos.map((photo, index) => (
                            <div
                                key={index}
                                className="relative overflow-hidden shadow-sm group rounded-xl aspect-square"
                            >
                                <img
                                    src={URL.createObjectURL(photo)}
                                    alt={`Foto ${index + 1}`}
                                    className="object-cover w-full h-full"
                                />
                                <div className="absolute inset-0 transition-opacity opacity-0 bg-black/40 group-hover:opacity-100" />
                                <button
                                    type="button"
                                    onClick={() => onRemovePhoto(index)}
                                    className="absolute p-2 text-white transition-all transform translate-y-2 bg-red-500 rounded-full shadow-lg opacity-0 top-2 right-2 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-red-600"
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
                                <div className="absolute bottom-0 left-0 right-0 px-2 py-1.5 text-xs font-medium text-center text-white bg-gradient-to-t from-black/60 to-transparent">
                                    Foto {index + 1}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {formData.photos.length >= 5 && (
                <div className="flex items-center gap-3 p-4 border border-orange-200 rounded-xl bg-orange-50 dark:bg-orange-900/20 dark:border-orange-800">
                    <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-orange-100 rounded-full dark:bg-orange-900/30">
                        <svg
                            className="w-5 h-5 text-orange-600 dark:text-orange-400"
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
                    </div>
                    <p className="text-sm text-orange-700 dark:text-orange-300">
                        Has alcanzado el límite de 5 fotos. Elimina una para
                        agregar otra.
                    </p>
                </div>
            )}

            <div className="flex items-start gap-3 p-4 border border-blue-100 rounded-xl bg-blue-50/50 dark:bg-blue-900/10 dark:border-blue-900/30">
                <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 mt-0.5 bg-blue-100 rounded-full dark:bg-blue-900/30">
                    <span className="text-base">💡</span>
                </div>
                <div>
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                        Consejo
                    </p>
                    <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">
                        Las fotos ayudan a documentar mejor la observación y
                        facilitan la comprensión de la situación.
                    </p>
                </div>
            </div>
        </div>
    );
}
