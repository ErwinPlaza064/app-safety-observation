export default function WelcomeCard({ user, userStats }) {
    return (
        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900">
                    Bienvenido, {userStats.name}
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                    {userStats.position} {userStats.area}
                </p>
                <div className="flex gap-2 mt-4">
                    {user.is_super_admin && (
                        <span className="inline-flex items-center px-3 py-1 text-xs font-medium text-red-800 bg-gray-100 rounded-full">
                            Super Administrador
                        </span>
                    )}
                    {user.is_ehs_manager && (
                        <span className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">
                            EHS Manager
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
