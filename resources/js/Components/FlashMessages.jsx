import { usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { HiCheckCircle, HiExclamationCircle, HiX } from "react-icons/hi";
import { Transition } from "@headlessui/react";

export default function FlashMessages() {
    const { flash } = usePage().props;
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        if (flash.success) {
            setShowSuccess(true);
            const timer = setTimeout(() => setShowSuccess(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash.success]);

    useEffect(() => {
        if (flash.error) {
            setShowError(true);
            const timer = setTimeout(() => setShowError(false), 8000);
            return () => clearTimeout(timer);
        }
    }, [flash.error]);

    return (
        <div className="fixed top-20 right-4 z-[9999] flex flex-col gap-3 pointer-events-none w-full max-w-sm">
            {/* Success Message */}
            <Transition
                show={showSuccess}
                enter="transition ease-out duration-300 transform"
                enterFrom="translate-x-full opacity-0"
                enterTo="translate-x-0 opacity-100"
                leave="transition ease-in duration-200 transform"
                leaveFrom="translate-x-0 opacity-100"
                leaveTo="translate-x-full opacity-0"
            >
                <div className="pointer-events-auto bg-green-50 dark:bg-green-900/40 border-l-4 border-green-500 p-4 rounded-r-lg shadow-lg flex items-start gap-3">
                    <HiCheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div className="flex-1">
                        <h3 className="text-sm font-bold text-green-800 dark:text-green-300">
                            ¡Éxito!
                        </h3>
                        <p className="text-xs text-green-700 dark:text-green-400 mt-1">
                            {flash.success}
                        </p>
                    </div>
                    <button 
                        onClick={() => setShowSuccess(false)}
                        className="text-green-500 hover:text-green-700 transition-colors"
                    >
                        <HiX className="w-4 h-4" />
                    </button>
                </div>
            </Transition>

            {/* Error Message */}
            <Transition
                show={showError}
                enter="transition ease-out duration-300 transform"
                enterFrom="translate-x-full opacity-0"
                enterTo="translate-x-0 opacity-100"
                leave="transition ease-in duration-200 transform"
                leaveFrom="translate-x-0 opacity-100"
                leaveTo="translate-x-full opacity-0"
            >
                <div className="pointer-events-auto bg-red-50 dark:bg-red-900/40 border-l-4 border-red-500 p-4 rounded-r-lg shadow-lg flex items-start gap-3">
                    <HiExclamationCircle className="w-5 h-5 text-red-500 mt-0.5" />
                    <div className="flex-1">
                        <h3 className="text-sm font-bold text-red-800 dark:text-red-300">
                            Hubo un error
                        </h3>
                        <p className="text-xs text-red-700 dark:text-red-400 mt-1">
                            {flash.error}
                        </p>
                    </div>
                    <button 
                        onClick={() => setShowError(false)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                    >
                        <HiX className="w-4 h-4" />
                    </button>
                </div>
            </Transition>
        </div>
    );
}
