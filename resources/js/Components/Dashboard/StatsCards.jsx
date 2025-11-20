export default function StatsCards({ stats }) {
    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                <div className="p-6">
                    <div className="text-sm font-medium text-gray-500">
                        Total de Usuarios
                    </div>
                    <div className="mt-2 text-3xl font-bold text-gray-900">
                        {stats.total_users}
                    </div>
                </div>
            </div>

            <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                <div className="p-6">
                    <div className="text-sm font-medium text-gray-500">
                        Usuarios Verificados
                    </div>
                    <div className="mt-2 text-3xl font-bold text-green-600">
                        {stats.verified_users}
                    </div>
                </div>
            </div>

            <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                <div className="p-6">
                    <div className="text-sm font-medium text-gray-500">
                        EHS Managers
                    </div>
                    <div className="mt-2 text-3xl font-bold text-blue-600">
                        {stats.ehs_managers}
                    </div>
                </div>
            </div>

            <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                <div className="p-6">
                    <div className="text-sm font-medium text-gray-500">
                        Super Admins
                    </div>
                    <div className="mt-2 text-3xl font-bold text-red-800">
                        {stats.super_admins}
                    </div>
                </div>
            </div>
        </div>
    );
}
