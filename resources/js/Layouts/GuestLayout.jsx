import WasionLogo from "@/Components/WasionLogo";
import Footer from "@/Components/Common/Footer";

export default function GuestLayout({ children }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 py-2 bg-gray-50 dark:bg-gray-900">
            <div className="mb-8 text-center">
                <WasionLogo className="w-auto h-12 mx-auto mb-4" />
                <h1 className="mb-2 text-2xl font-bold text-blue-900 dark:text-blue-400">
                    Safety Observation
                </h1>
            </div>

            <div className="w-full max-w-md px-8 py-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900/50">
                {children}
            </div>

            <Footer className="mt-3" />
        </div>
    );
}
