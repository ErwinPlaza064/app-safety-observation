import { Link } from "@inertiajs/react";

export default function UsersTable({ users, onUserClick }) {
    const formatLastActivity = (timestamp) => {
        if (!timestamp) return "Nunca";
        const date = new Date(timestamp * 1000);
        return date.toLocaleString("es-MX", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const userList = users.data || [];
    const links = users.links || [];

    return (
        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <div className="p-6">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                    Gestión de Usuarios{" "}
                    <span className="ml-2 text-sm font-normal text-gray-500">
                        ({users.total} resultados)
                    </span>
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
                                    Área
                                </th>
                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                    Rol
                                </th>
                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                    Última Actividad
                                </th>
                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                    Estado
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {userList.length > 0 ? (
                                userList.map((userData) => (
                                    <tr
                                        key={userData.id}
                                        onClick={() => onUserClick(userData)}
                                        className="transition-colors cursor-pointer hover:bg-blue-50"
                                    >
                                        <td className="px-6 py-4 text-sm font-medium text-blue-600 whitespace-nowrap">
                                            {userData.employee_number}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span>{userData.name}</span>
                                                <span className="text-xs text-gray-500">
                                                    {userData.email}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                                            {userData.area}
                                            <div className="text-xs text-gray-400">
                                                {userData.position}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap">
                                            {userData.is_super_admin ? (
                                                <span className="px-2 py-1 text-xs font-medium text-red-800 bg-red-100 rounded-full">
                                                    Super Admin
                                                </span>
                                            ) : userData.is_ehs_manager ? (
                                                <span className="px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">
                                                    Gerente EHS
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
                                                    Empleado
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                                            {formatLastActivity(
                                                userData.last_activity
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap">
                                            {userData.email_verified_at ? (
                                                <span className="text-xs font-bold text-green-600">
                                                    ● Verificado
                                                </span>
                                            ) : (
                                                <span className="text-xs font-bold text-yellow-600">
                                                    ● Pendiente
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="px-6 py-10 text-center text-gray-500"
                                    >
                                        No se encontraron usuarios con esos
                                        filtros.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {links.length > 3 && (
                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-200">
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Mostrando{" "}
                                    <span className="font-medium">
                                        {users.from}
                                    </span>{" "}
                                    a{" "}
                                    <span className="font-medium">
                                        {users.to}
                                    </span>{" "}
                                    de{" "}
                                    <span className="font-medium">
                                        {users.total}
                                    </span>{" "}
                                    resultados
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm">
                                    {links.map((link, key) =>
                                        link.url ? (
                                            <Link
                                                key={key}
                                                href={link.url}
                                                preserveState
                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                    link.active
                                                        ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                                                        : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                                                }`}
                                                dangerouslySetInnerHTML={{
                                                    __html: link.label,
                                                }}
                                            />
                                        ) : (
                                            <span
                                                key={key}
                                                className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-300 bg-white border border-gray-300 cursor-default"
                                                dangerouslySetInnerHTML={{
                                                    __html: link.label,
                                                }}
                                            />
                                        )
                                    )}
                                </nav>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
