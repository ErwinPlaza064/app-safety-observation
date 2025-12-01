import { useState, useEffect, useRef } from "react";
import { router } from "@inertiajs/react";
import StatsCards from "@/Components/Dashboard/StatsCards";
import UsersTable from "@/Components/Dashboard/UsersTable";
import CreateUserModal from "@/Components/Dashboard/CreateUserModal";
import PrimaryButton from "@/Components/PrimaryButton";

export default function SuperAdminView({
    stats,
    users,
    onUserClick,
    filters,
    filterAreas,
}) {
    const [showCreateModal, setShowCreateModal] = useState(false);

    const [params, setParams] = useState({
        search: filters?.search || "",
        area: filters?.area || "",
        role: filters?.role || "",
        status: filters?.status || "",
    });

    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timer = setTimeout(() => {
            router.get(route("dashboard"), params, {
                preserveState: true,
                replace: true,
                only: ["users", "filters"],
            });
        }, 300);

        return () => clearTimeout(timer);
    }, [params]);

    const handleChange = (e) => {
        setParams({ ...params, [e.target.name]: e.target.value });
    };

    return (
        <div className="space-y-6">
            {stats && <StatsCards stats={stats} />}

            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                    Administración de Usuarios
                </h3>

                <PrimaryButton
                    onClick={() => setShowCreateModal(true)}
                    className="justify-center"
                >
                    <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                        />
                    </svg>
                    Crear Cuenta
                </PrimaryButton>
            </div>

            <div className="p-4 bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="relative w-full md:w-1/3">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg
                                className="w-5 h-5 text-gray-400 dark:text-gray-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                ></path>
                            </svg>
                        </div>
                        <input
                            type="text"
                            name="search"
                            value={params.search}
                            onChange={handleChange}
                            placeholder="Buscar por nombre, email o ID..."
                            className="w-full py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 bg-white border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="flex flex-col w-full gap-2 sm:flex-row md:w-auto">
                        <select
                            name="area"
                            value={params.area}
                            onChange={handleChange}
                            className="text-sm text-gray-900 bg-white border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Todas las Áreas</option>
                            {filterAreas &&
                                filterAreas.map((area, i) => (
                                    <option key={i} value={area}>
                                        {area}
                                    </option>
                                ))}
                        </select>

                        <select
                            name="role"
                            value={params.role}
                            onChange={handleChange}
                            className="text-sm text-gray-900 bg-white border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Todos los Roles</option>
                            <option value="admin">Super Admin</option>
                            <option value="manager">EHS Manager</option>
                            <option value="employee">Empleado</option>
                        </select>

                        <select
                            name="status"
                            value={params.status}
                            onChange={handleChange}
                            className="text-sm text-gray-900 bg-white border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Todos los Estados</option>
                            <option value="verified">Verificado</option>
                            <option value="pending">Pendiente</option>
                        </select>
                    </div>
                </div>
            </div>

            {users && <UsersTable users={users} onUserClick={onUserClick} />}

            <CreateUserModal
                show={showCreateModal}
                onClose={() => setShowCreateModal(false)}
            />
        </div>
    );
}
