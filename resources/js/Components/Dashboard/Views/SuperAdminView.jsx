import { useState, useEffect, useRef } from "react";
import { router } from "@inertiajs/react";
import { IoMdClose } from "react-icons/io";
import { HiUsers, HiOfficeBuilding, HiUpload, HiDatabase } from "react-icons/hi";
import StatsCards from "@/Components/Dashboard/StatsCards";
import UsersTable from "@/Components/Dashboard/UsersTable";
import CreateUserModal from "@/Components/Dashboard/CreateUserModal";
import AreasManagement from "@/Components/Dashboard/AreasManagement";
import PlantsManagement from "@/Components/Dashboard/PlantsManagement";
import PrimaryButton from "@/Components/PrimaryButton";
import Modal from "@/Components/Modal";
import SecondaryButton from "@/Components/SecondaryButton";
import axios from "axios";

export default function SuperAdminView({
    stats,
    users,
    plants = [],
    areas = [],
    onUserClick,
    onDeleteUser,
    onImportClick,
    filters,
}) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showBackupModal, setShowBackupModal] = useState(false);
    const [isBackingUp, setIsBackingUp] = useState(false);
    const [backupStatus, setBackupStatus] = useState(null); // 'success' | 'error' | null
    const [backupMessage, setBackupMessage] = useState("");
    const [activeTab, setActiveTab] = useState("users");

    const [params, setParams] = useState({
        search: filters?.search || "",
        plant_id: filters?.plant_id || "",
        area_id: filters?.area_id || "",
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
                only: ["users", "filters", "areas"],
            });
        }, 300);

        return () => clearTimeout(timer);
    }, [params, activeTab]);

    const handleChange = (e) => {
        setParams({ ...params, [e.target.name]: e.target.value });
    };

    const setParamsState = (newParams) => {
        setParams(newParams);
    };

    const handleBackup = async () => {
        setIsBackingUp(true);
        setBackupStatus(null);
        setBackupMessage("");

        try {
            const response = await axios.get("/trigger-backup");
            if (response.data.status === "success") {
                setBackupStatus("success");
                setBackupMessage("El respaldo se ha completado correctamente y se ha guardado en la nube.");
            } else {
                setBackupStatus("error");
                setBackupMessage(response.data.message || "Hubo un problema al realizar el respaldo.");
            }
        } catch (error) {
            setBackupStatus("error");
            setBackupMessage(
                error.response?.data?.message || 
                "Error de conexión. No se pudo completar el respaldo."
            );
        } finally {
            setIsBackingUp(false);
        }
    };

    const handleCardClick = (type) => {
        setActiveTab("users");
        let newParams = { ...params };

        switch (type) {
            case "all":
                newParams = { search: "", plant_id: "", area_id: "", role: "", status: "" };
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
                                        ? "border-[#1e3a8a] text-[#1e3a8a] dark:border-blue-400 dark:text-blue-400"
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

                            <button
                                onClick={() => setShowBackupModal(true)}
                                className="inline-flex items-center justify-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg font-semibold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all active:scale-95"
                            >
                                <HiDatabase className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
                                Crear Respaldo
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
                                    name="plant_id"
                                    value={params.plant_id}
                                    onChange={handleChange}
                                    className="text-sm text-gray-900 bg-white border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Todas las Plantas</option>
                                    {plants.map((plant) => (
                                        <option key={plant.id} value={plant.id}>
                                            {plant.name}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    name="area_id"
                                    value={params.area_id}
                                    onChange={handleChange}
                                    className="text-sm text-gray-900 bg-white border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Todas las Áreas</option>
                                    {areas.map((area) => (
                                        <option key={area.id} value={area.id}>
                                            {area.name}
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
                        <UsersTable 
                            users={users} 
                            onUserClick={onUserClick} 
                            onDelete={onDeleteUser} 
                        />
                    )}
                </>
            )}

            {activeTab === "areas" && (
                <div className="space-y-10">
                    <PlantsManagement plants={plants} />
                    <hr className="border-gray-200 dark:border-gray-700" />
                    <AreasManagement areas={areas} />
                </div>
            )}

            <CreateUserModal
                show={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                plants={plants}
                areas={areas}
            />

            <Modal 
                show={showBackupModal} 
                onClose={() => !isBackingUp && setShowBackupModal(false)} 
                maxWidth="md"
            >
                <div className="p-6">
                    {backupStatus === null ? (
                        <>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-green-100 rounded-full dark:bg-green-900/30">
                                    <HiDatabase className="w-6 h-6 text-green-600 dark:text-green-400" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                    Confirmar Respaldo
                                </h2>
                            </div>

                            <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
                                ¿Estás seguro de que deseas iniciar un nuevo respaldo completo de la base de datos y archivos? 
                                Este proceso puede tardar unos segundos. El archivo se guardará automáticamente en Cloudflare R2.
                            </p>

                            <div className="flex justify-end gap-3">
                                <SecondaryButton 
                                    onClick={() => setShowBackupModal(false)}
                                    disabled={isBackingUp}
                                >
                                    Cancelar
                                </SecondaryButton>
                                <PrimaryButton
                                    onClick={handleBackup}
                                    disabled={isBackingUp}
                                    className="!bg-green-600 hover:!bg-green-700 dark:!bg-green-500 dark:hover:!bg-green-600"
                                >
                                    {isBackingUp ? (
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Procesando...
                                        </div>
                                    ) : (
                                        "Comenzar Respaldo"
                                    )}
                                </PrimaryButton>
                            </div>
                        </>
                    ) : (
                        <div className="text-center">
                            <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full mb-4 ${
                                backupStatus === 'success' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
                            }`}>
                                {backupStatus === 'success' ? (
                                    <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                )}
                            </div>
                            
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                {backupStatus === 'success' ? '¡Excelente!' : 'Hubo un error'}
                            </h3>
                            
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                                {backupMessage}
                            </p>

                            <PrimaryButton
                                onClick={() => {
                                    setShowBackupModal(false);
                                    setTimeout(() => {
                                        setBackupStatus(null);
                                        setBackupMessage("");
                                    }, 300);
                                }}
                                className="w-full justify-center"
                            >
                                Entendido
                            </PrimaryButton>
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
}
