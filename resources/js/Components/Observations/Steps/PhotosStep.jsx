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
        <div className="space-y-6">
            <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-800">
                    Evidencia Fotográfica (Opcional)
                </h3>
                <p className="mb-4 text-sm text-gray-600">
                    Puede adjuntar hasta 5 fotografías que documenten la
                    observación.
                </p>
            </div>

            {showWebcam && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
                    <div className="relative w-full max-w-2xl p-4 bg-white rounded-lg">
                        <button
                            onClick={stopWebcam}
                            className="absolute p-2 text-white bg-red-500 rounded-full top-2 right-2 hover:bg-red-600"
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

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <button
                    type="button"
                    onClick={startWebcam}
                    disabled={formData.photos.length >= 5}
                    className="flex items-center justify-center gap-2 px-6 py-4 transition-all border-2 border-purple-300 border-dashed rounded-lg bg-purple-50 hover:bg-purple-100 hover:border-purple-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <svg
                        className="w-5 h-5 text-purple-600"
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
                    <span className="font-medium text-purple-700">
                        Usar Webcam
                    </span>
                </button>

                <label className="flex items-center justify-center gap-2 px-6 py-4 transition-all border-2 border-blue-300 border-dashed rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 hover:border-blue-400">
                    <svg
                        className="w-5 h-5 text-blue-600"
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
                    <span className="font-medium text-blue-700">
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

                <label className="flex items-center justify-center gap-2 px-6 py-4 transition-all border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-gray-400">
                    <svg
                        className="w-5 h-5 text-gray-600"
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
                    <span className="font-medium text-gray-700">
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

            <div className="text-sm text-center text-gray-500">
                {formData.photos.length} de 5 fotos agregadas
            </div>

            {formData.photos.length > 0 && (
                <div className="p-4 rounded-lg bg-gray-50">
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
                    Has alcanzado el límite de 5 fotos. Elimina una para agregar
                    otra.
                </div>
            )}

            <div className="p-4 rounded-lg bg-blue-50">
                <p className="text-sm text-blue-800">
                    <span className="font-semibold">💡 Consejo:</span> Las fotos
                    ayudan a documentar mejor la observación y facilitan la
                    comprensión de la situación.
                </p>
            </div>
        </div>
    );
}
