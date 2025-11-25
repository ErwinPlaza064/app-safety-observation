import { CgSpinner } from "react-icons/cg";
import { BsCloudCheck } from "react-icons/bs";

export default function AutoSaveIndicator({ isSaving }) {
    return (
        <div className="flex items-center justify-center pt-4 text-xs text-gray-400 transition-all duration-300">
            {isSaving ? (
                <>
                    <CgSpinner className="w-4 h-4 mr-2 animate-spin text-[#1e3a8a]" />
                    <span>Guardando...</span>
                </>
            ) : (
                <>
                    <BsCloudCheck className="w-5 h-5 mr-1.5 text-green-500" />
                    <span>Autoguardado activado</span>
                </>
            )}
        </div>
    );
}
