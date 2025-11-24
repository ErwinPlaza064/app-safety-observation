import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import { router } from "@inertiajs/react";
import { useState } from "react";
import StatsCards from "@/Components/Dashboard/StatsCards";
import UsersTable from "@/Components/Dashboard/UsersTable";
import EditUserModal from "@/Components/Dashboard/EditUserModal";
import DeleteUserModal from "@/Components/Dashboard/DeleteUserModal";
import EmptyState from "@/Components/Dashboard/EmptyState";
import SafetyObservationForm from "@/Components/Observations/SafetyObservationForm";

export default function Dashboard({
    userStats,
    users,
    stats,
    areas,
    categories,
}) {
    const { auth } = usePage().props;
    const user = auth.user;

    const [showObservationForm, setShowObservationForm] = useState(false);

    const [editingUser, setEditingUser] = useState(null);
    const [deletingUser, setDeletingUser] = useState(null);

    const openEditModal = (userData) => {
        console.log("¡Click recibido!", userData);
        setEditingUser(userData);
    };

    const closeEditModal = () => {
        setEditingUser(null);
    };

    const handleDeleteFromEdit = () => {
        closeEditModal();
        setDeletingUser(editingUser);
    };

    const handleDelete = () => {
        if (deletingUser) {
            router.delete(route("admin.users.destroy", deletingUser.id), {
                onSuccess: () => setDeletingUser(null),
                preserveScroll: true,
            });
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Panel de Control" />

            <div className="py-6 sm:py-12">
                <div className="px-4 mx-auto space-y-4 sm:space-y-6 max-w-7xl sm:px-6 lg:px-8">
                    {user.is_super_admin && (
                        <>
                            {stats && <StatsCards stats={stats} />}
                            {users && (
                                <UsersTable
                                    users={users}
                                    onUserClick={openEditModal}
                                />
                            )}
                        </>
                    )}

                    {user.is_ehs_manager && !user.is_super_admin && (
                        <EmptyState
                            message="Panel de Gestión EHS"
                            submessage="Próximamente podrás gestionar todas las observaciones de seguridad desde aquí."
                        />
                    )}

                    {!user.is_ehs_manager && !user.is_super_admin && (
                        <>
                            {!showObservationForm ? (
                                <div className="space-y-6 animate-fade-in">
                                    <div>
                                        <button
                                            onClick={() =>
                                                setShowObservationForm(true)
                                            }
                                            className="w-full sm:w-auto flex items-center justify-center px-8 py-4 text-lg font-semibold text-white transition-all transform bg-[#1e3a8a] rounded-xl shadow-lg hover:bg-blue-900 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                        >
                                            <svg
                                                className="w-6 h-6 mr-2"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 4v16m8-8H4"
                                                />
                                            </svg>
                                            Nueva Observación
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                                        <div className="p-4 bg-white border-l-4 border-blue-500 shadow-sm sm:p-6 rounded-xl">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-base font-medium text-gray-600 sm:text-lg">
                                                    En Progreso
                                                </h3>
                                                <svg
                                                    className="w-6 h-6 text-blue-500"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                </svg>
                                            </div>
                                            <div className="flex items-end justify-between">
                                                <span className="text-3xl font-bold text-gray-800 sm:text-4xl">
                                                    {userStats?.in_progress ||
                                                        0}
                                                </span>
                                                <span className="text-xs text-gray-500 sm:text-sm">
                                                    En seguimiento
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-4 bg-white border-l-4 border-green-500 shadow-sm sm:p-6 rounded-xl">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-base font-medium text-gray-600 sm:text-lg">
                                                    Cerradas
                                                </h3>
                                                <svg
                                                    className="w-6 h-6 text-green-500"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                </svg>
                                            </div>
                                            <div className="flex items-end justify-between">
                                                <span className="text-3xl font-bold text-gray-800 sm:text-4xl">
                                                    {userStats?.completed || 0}
                                                </span>
                                                <span className="text-xs text-gray-500 sm:text-sm">
                                                    Completadas
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-white shadow-sm sm:p-6 sm:rounded-lg rounded-xl">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="flex items-center text-base font-semibold text-gray-800 sm:text-lg">
                                                <svg
                                                    className="w-5 h-5 mr-2 text-blue-600"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                                                    />
                                                </svg>
                                                Mis Reportes
                                            </h3>
                                            <span className="px-3 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">
                                                {(userStats?.total || 0) +
                                                    " Total"}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-center h-24 text-gray-400 border-2 border-dashed rounded-lg sm:h-32 bg-gray-50">
                                            <span className="px-4 text-xs text-center sm:text-sm">
                                                Gráfica de actividad reciente
                                                (Próximamente)
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="animate-fade-in-up">
                                    <SafetyObservationForm
                                        user={user}
                                        areas={areas || []}
                                        categories={categories || []}
                                        onClose={() =>
                                            setShowObservationForm(false)
                                        }
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            <EditUserModal
                show={editingUser !== null}
                user={editingUser}
                currentUser={user}
                onClose={closeEditModal}
                onDelete={handleDeleteFromEdit}
            />

            <DeleteUserModal
                show={deletingUser !== null}
                user={deletingUser}
                onClose={() => setDeletingUser(null)}
                onConfirm={handleDelete}
            />
        </AuthenticatedLayout>
    );
}
