export default function PhotosStep({ formData, onPhotoChange, onRemovePhoto }) {
    return (
        <div className="py-4 pl-4 border-l-4 border-[#1e3a8a] md:pl-6">
            <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                    Fotografías <span>(Opcional)</span>
                </label>
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={onPhotoChange}
                    className="hidden"
                    id="p-upload"
                />
                <label
                    htmlFor="p-upload"
                    className="block p-8 text-center transition border-2 border-gray-300 border-dashed rounded-lg cursor-pointer md:p-12 hover:border-[#1e3a8a]"
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
                            <div key={index} className="relative group">
                                <img
                                    src={URL.createObjectURL(photo)}
                                    alt={`Preview ${index + 1}`}
                                    className="object-cover w-full h-24 rounded-lg md:h-24"
                                />
                                <button
                                    type="button"
                                    onClick={() => onRemovePhoto(index)}
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
    );
}
