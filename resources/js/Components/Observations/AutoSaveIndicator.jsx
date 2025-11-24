export default function AutoSaveIndicator({ isSaving }) {
    return (
        <div className="flex items-center justify-center pt-4 text-xs text-gray-400 transition-all duration-300">
            {isSaving ? (
                <>
                    <svg
                        className="w-4 h-4 mr-2 animate-spin text-[#1e3a8a]"
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
                    <span>Guardando...</span>
                </>
            ) : (
                <>
                    <svg
                        className="w-5 h-5 mr-1.5 text-green-500"
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
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M7 19.333c-2.35-.336-4-2.476-4-4.833a5 5 0 012.5-4.33M19.333 14.5A5 5 0 0019 5a5 5 0 00-4.9-4"
                            className="opacity-50"
                        />
                    </svg>
                    <span>Autoguardado activado</span>
                </>
            )}
        </div>
    );
}
