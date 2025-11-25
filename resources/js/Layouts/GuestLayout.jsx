import WasionLogo from "@/Components/WasionLogo";

export default function GuestLayout({ children }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 py-2 bg-gray-50">
            <div className="mb-8 text-center">
                <WasionLogo className="w-auto h-12 mx-auto mb-4" />
                <h1 className="mb-2 text-2xl font-bold text-blue-900">
                    Safety Observation
                </h1>
            </div>

            <div className="w-full max-w-md px-8 py-8 bg-white rounded-lg shadow-lg">
                {children}
            </div>

            <div className="mt-3 text-xs text-center text-gray-500">
                <p>© 2025 Wasion México. Todos los derechos reservados.</p>
            </div>
        </div>
    );
}
