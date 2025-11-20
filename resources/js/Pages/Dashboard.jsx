import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";

export default function Dashboard({ userStats, users, stats }) {
    const { auth } = usePage().props;
    const user = auth.user;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Panel de Control
                </h2>
            }
        >
            <Head title="Panel de Control" />

            <div className="py-12">
                <div className="mx-auto space-y-6 max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-2xl font-bold text-gray-900">
                                ¡Bienvenido, {userStats.name}!
                            </h3>
                            <p className="mt-2 text-sm text-gray-600">
                                {userStats.position} - {userStats.area}
                            </p>
                            <div className="flex gap-2 mt-4">
                                {user.is_super_admin && (
                                    <span className="inline-flex items-center px-3 py-1 text-xs font-medium text-purple-800 bg-purple-100 rounded-full">
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

                    {stats && (
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
                                    <div className="mt-2 text-3xl font-bold text-purple-600">
                                        {stats.super_admins}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {user.is_super_admin && users && (
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                                    Gestión de Usuarios
                                </h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                                    No. Empleado
                                                </th>
                                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                                    Nombre
                                                </th>
                                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                                    Email
                                                </th>
                                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                                    Área
                                                </th>
                                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                                    Puesto
                                                </th>
                                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                                    Rol
                                                </th>
                                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                                    Estado
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {users.map((userData) => (
                                                <tr
                                                    key={userData.id}
                                                    className="hover:bg-gray-50"
                                                >
                                                    <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                                                        {
                                                            userData.employee_number
                                                        }
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                                                        {userData.name}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                                                        {userData.email}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                                                        {userData.area}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                                                        {userData.position}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                                                        <div className="flex gap-1">
                                                            {userData.is_super_admin && (
                                                                <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-purple-800 bg-purple-100 rounded-full">
                                                                    Super Admin
                                                                </span>
                                                            )}
                                                            {userData.is_ehs_manager &&
                                                                !userData.is_super_admin && (
                                                                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">
                                                                        EHS
                                                                        Manager
                                                                    </span>
                                                                )}
                                                            {!userData.is_ehs_manager &&
                                                                !userData.is_super_admin && (
                                                                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-800 bg-gray-100 rounded-full">
                                                                        Empleado
                                                                    </span>
                                                                )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                                                        {userData.email_verified_at ? (
                                                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                                                                Verificado
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full">
                                                                Pendiente
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Mensaje para empleados normales */}
                    {!user.is_ehs_manager && !user.is_super_admin && (
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6 text-center text-gray-600">
                                <p className="text-lg">
                                    Bienvenido al sistema de observaciones de
                                    seguridad de Wasion.
                                </p>
                                <p className="mt-2 text-sm">
                                    Próximamente podrás crear y ver tus
                                    observaciones desde aquí.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
