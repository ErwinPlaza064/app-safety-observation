export default function UsersTable({ users, onUserClick }) {
    return (
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
                                    onClick={() => onUserClick(userData)}
                                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                                >
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                                        {userData.employee_number}
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
                                                <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-800 bg-gray-100 rounded-full">
                                                    Super Admin
                                                </span>
                                            )}
                                            {userData.is_ehs_manager &&
                                                !userData.is_super_admin && (
                                                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">
                                                        EHS Manager
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
    );
}
