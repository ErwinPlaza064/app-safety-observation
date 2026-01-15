import { useState, useEffect, useRef } from "react";
import { router } from "@inertiajs/react";
import { IoMdClose } from "react-icons/io";
import { HiUsers, HiOfficeBuilding, HiUpload } from "react-icons/hi";
import StatsCards from "@/Components/Dashboard/StatsCards";
import UsersTable from "@/Components/Dashboard/UsersTable";
import CreateUserModal from "@/Components/Dashboard/CreateUserModal";
import AreasManagement from "@/Components/Dashboard/AreasManagement";
import PrimaryButton from "@/Components/PrimaryButton";

export default function SuperAdminView({
    stats,
    users,
    areas = [],
    onUserClick,
    onImportClick,
    filters,
    filterAreas,
}) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [activeTab, setActiveTab] = useState("users");

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

        if (activeTab !== "users") return;

        const timer = setTimeout(() => {
            router.get(route("dashboard"), params, {
                preserveState: true,
                replace: true,
                only: ["users", "filters"],
            });
        }, 300);

        return () => clearTimeout(timer);
    }, [params, activeTab]);

    const handleChange = (e) => {
        setParams({ ...params, [e.target.name]: e.target.value });
    };

    const handleCardClick = (type) => {
        setActiveTab("users");
        let newParams = { ...params };

        switch (type) {
            case "all":
                newParams = { search: "", area: "", role: "", status: "" };
                break;
            case "verified":
                newParams = { ...params, status: "verified", role: "" };
                break;
            case "manager":
                newParams = { ...params, role: "manager", status: "" };
                break;
            case "admin":
                newParams = { ...params, role: "admin", status: "" };
                break;
        }

        setParams(newParams);
    };

    const tabs = [
        { id: "users", label: "Usuarios", icon: HiUsers },
        { id: "areas", label: "Áreas / Plantas", icon: HiOfficeBuilding },
    ];

    return (
        <div className="space-y-6">
            {stats && (
                <StatsCards stats={stats} onCardClick={handleCardClick} />
            )}

            <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex -mb-px space-x-8">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                                    activeTab === tab.id
                                        ? "border-blue-500 text-blue-600 dark:text-blue-400"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                                }`}
                            >
                                <Icon className="w-5 h-5" />
                                {tab.label}
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Tab: Usuarios */}
            {activeTab === "users" && (
                <>
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                            Administración de Usuarios
                        </h3>

                        <div className="flex flex-wrap gap-2">
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

                            <button
                                onClick={onImportClick}
                                className="inline-flex items-center justify-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg font-semibold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all active:scale-95"
                            >
                                <HiUpload className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                                Importar Excel/CSV
                            </button>
                        </div>
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
                                    className="w-full py-2 pl-10 pr-10 text-sm text-gray-900 placeholder-gray-400 bg-white border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
                                />
                                {params.search && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setParams({ ...params, search: "" })
                                        }
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
                                    >
                                        <IoMdClose className="w-5 h-5" />
                                    </button>
                                )}
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
                                    <option value="coordinator">Coordinador EHS</option>
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
                                    <option value="suspended">
                                        Suspendido
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {users && (
                        <UsersTable users={users} onUserClick={onUserClick} />
                    )}
                </>
            )}

            {activeTab === "areas" && <AreasManagement areas={areas} />}

            <CreateUserModal
                show={showCreateModal}
                onClose={() => setShowCreateModal(false)}
            />
        </div>
    );
}
