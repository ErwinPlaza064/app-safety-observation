export default function StatsCards({ stats, onCardClick }) {
    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <button
                onClick={() => onCardClick("all")}
                className="overflow-hidden text-left transition-all duration-200 bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg hover:shadow-md hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
                <div className="p-6">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Total de Usuarios
                    </div>
                    <div className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
                        {stats.total_users}
                    </div>
                    <div className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                        Click para ver todos
                    </div>
                </div>
            </button>

            <button
                onClick={() => onCardClick("verified")}
                className="overflow-hidden text-left transition-all duration-200 bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg hover:shadow-md hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
                <div className="p-6">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Usuarios Verificados
                    </div>
                    <div className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">
                        {stats.verified_users}
                    </div>
                    <div className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                        Click para filtrar verificados
                    </div>
                </div>
            </button>

            <button
                onClick={() => onCardClick("manager")}
                className="overflow-hidden text-left transition-all duration-200 bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg hover:shadow-md hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
                <div className="p-6">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        EHS Managers
                    </div>
                    <div className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-400">
                        {stats.ehs_managers}
                    </div>
                    <div className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                        Click para filtrar managers
                    </div>
                </div>
            </button>

            <button
                onClick={() => onCardClick("admin")}
                className="overflow-hidden text-left transition-all duration-200 bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg hover:shadow-md hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
                <div className="p-6">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Super Admins
                    </div>
                    <div className="mt-2 text-3xl font-bold text-red-800 dark:text-red-400">
                        {stats.super_admins}
                    </div>
                    <div className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                        Click para filtrar admins
                    </div>
                </div>
            </button>
        </div>
    );
}
