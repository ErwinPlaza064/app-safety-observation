export default function StatsCards({ stats }) {
    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="overflow-hidden bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg">
                <div className="p-6">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Total de Usuarios
                    </div>
                    <div className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
                        {stats.total_users}
                    </div>
                </div>
            </div>

            <div className="overflow-hidden bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg">
                <div className="p-6">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Usuarios Verificados
                    </div>
                    <div className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">
                        {stats.verified_users}
                    </div>
                </div>
            </div>

            <div className="overflow-hidden bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg">
                <div className="p-6">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        EHS Managers
                    </div>
                    <div className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-400">
                        {stats.ehs_managers}
                    </div>
                </div>
            </div>

            <div className="overflow-hidden bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg">
                <div className="p-6">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Super Admins
                    </div>
                    <div className="mt-2 text-3xl font-bold text-red-800 dark:text-red-400">
                        {stats.super_admins}
                    </div>
                </div>
            </div>
        </div>
    );
}
