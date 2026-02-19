import { Link, usePage, router } from "@inertiajs/react";

export default function UsersTable({ users, onUserClick, onDelete }) {
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

    const getStatusBadge = (userData) => {
        if (userData.is_suspended) {
            return (
                <span className="text-xs font-bold text-red-600 dark:text-red-400">
                    ● Suspendido
                </span>
            );
        }
        if (userData.email_verified_at) {
            return (
                <span className="text-xs font-bold text-green-600 dark:text-green-400">
                    ● Verificado
                </span>
            );
        }
        return (
            <span className="text-xs font-bold text-yellow-600 dark:text-yellow-400">
                ● Pendiente
            </span>
        );
    };

    const userList = users.data || [];
    const links = users.links || [];

    return (
        <div className="overflow-hidden bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg">
            <div className="p-6">
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Gestión de Usuarios{" "}
                    <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                        ({users.total} resultados)
                    </span>
                </h3>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 dark:text-gray-300 uppercase">
                                    No. Empleado
                                </th>
                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 dark:text-gray-300 uppercase">
                                    Nombre
                                </th>
                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 dark:text-gray-300 uppercase">
                                    Área
                                </th>
                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 dark:text-gray-300 uppercase">
                                    Rol
                                </th>
                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 dark:text-gray-300 uppercase">
                                    Última Actividad
                                </th>
                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 dark:text-gray-300 uppercase">
                                    Estado
                                </th>
                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 dark:text-gray-300 uppercase">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {userList.length > 0 ? (
                                userList.map((userData) => (
                                    <tr
                                        key={userData.id}
                                        onClick={() => onUserClick(userData)}
                                        className={`transition-colors cursor-pointer ${
                                            userData.is_suspended
                                                ? "opacity-60 bg-red-50/50 dark:bg-red-900/10 hover:bg-red-100/50 dark:hover:bg-red-900/20"
                                                : "hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                        }`}
                                    >
                                        <td className="px-6 py-4 text-sm font-medium text-blue-600 dark:text-blue-400 whitespace-nowrap">
                                            {userData.employee_number}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span
                                                    className={
                                                        userData.is_suspended
                                                            ? "line-through"
                                                            : ""
                                                    }
                                                >
                                                    {userData.name}
                                                </span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    {userData.email}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                                            {userData.area}
                                            <div className="text-xs text-gray-400 dark:text-gray-500">
                                                {userData.position}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap">
                                            {userData.is_super_admin ? (
                                                <span className="px-2 py-1 text-xs font-medium text-red-800 dark:text-red-200 bg-red-100 dark:bg-red-900/30 rounded-full">
                                                    Super Admin
                                                </span>
                                            ) : userData.is_ehs_coordinator ? (
                                                <span className="px-2 py-1 text-xs font-medium text-purple-800 dark:text-purple-200 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                                                    Coordinador EHS
                                                </span>
                                            ) : userData.is_ehs_manager ? (
                                                <span className="px-2 py-1 text-xs font-medium text-blue-800 dark:text-blue-200 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                                                    Gerente EHS
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-full">
                                                    Empleado
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                                            {formatLastActivity(
                                                userData.last_activity
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap">
                                            {getStatusBadge(userData)}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                                            <div className="flex justify-end gap-2 px-1">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onUserClick(userData);
                                                    }}
                                                    className="p-1 px-2 text-blue-600 transition-colors bg-blue-100 rounded-md dark:text-blue-400 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50"
                                                    title="Editar"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                    </svg>
                                                </button>
                                                
                                                {userData.id !== usePage().props.auth.user.id && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onDelete(userData);
                                                        }}
                                                        className="p-1 px-2 text-red-600 transition-colors bg-red-100 rounded-md dark:text-red-400 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50"
                                                        title="Eliminar"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="7"
                                        className="px-6 py-10 text-center text-gray-500 dark:text-gray-400"
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
                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
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
                                                        ? "z-10 bg-blue-50 dark:bg-blue-900/30 border-blue-500 dark:border-blue-600 text-blue-600 dark:text-blue-400"
                                                        : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                                                }`}
                                                dangerouslySetInnerHTML={{
                                                    __html: link.label,
                                                }}
                                            />
                                        ) : (
                                            <span
                                                key={key}
                                                className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-300 dark:text-gray-600 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 cursor-default"
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
