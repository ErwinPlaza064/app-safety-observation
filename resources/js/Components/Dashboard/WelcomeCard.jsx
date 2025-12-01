export default function WelcomeCard({ user, userStats }) {
    return (
        <div className="overflow-hidden bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg">
            <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Bienvenido, {userStats.name}
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    <strong>Puesto: </strong>
                    {userStats.position} <br />
                    <strong>Área: </strong>
                    {userStats.area}
                </p>
                <div className="flex gap-2 mt-4">
                    {user.is_super_admin && (
                        <span className="inline-flex items-center px-3 py-1 text-xs font-medium text-red-800 dark:text-red-300 bg-gray-100 dark:bg-red-900/30 rounded-full">
                            Super Administrador
                        </span>
                    )}
                    {user.is_ehs_manager && (
                        <span className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-800 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                            EHS Manager
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
