import { useState, useEffect, useRef } from "react";
import { router } from "@inertiajs/react";
import StatsCards from "@/Components/Dashboard/StatsCards";
import UsersTable from "@/Components/Dashboard/UsersTable";

export default function SuperAdminView({
    stats,
    users,
    onUserClick,
    filters,
    filterAreas,
}) {
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

            <div className="p-4 bg-white shadow-sm sm:rounded-lg">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="relative w-full md:w-1/3">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg
                                className="w-5 h-5 text-gray-400"
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
                            className="w-full py-2 pl-10 pr-4 text-sm border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="flex flex-col w-full gap-2 sm:flex-row md:w-auto">
                        <select
                            name="area"
                            value={params.area}
                            onChange={handleChange}
                            className="text-sm border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
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
                            className="text-sm border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
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
                            className="text-sm border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Todos los Estados</option>
                            <option value="verified">Verificado</option>
                            <option value="pending">Pendiente</option>
                        </select>
                    </div>
                </div>
            </div>

            {users && <UsersTable users={users} onUserClick={onUserClick} />}
        </div>
    );
}
