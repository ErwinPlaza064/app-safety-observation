import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage, router } from "@inertiajs/react";
import { useState } from "react";
import EditUserModal from "@/Components/Dashboard/EditUserModal";
import DeleteUserModal from "@/Components/Dashboard/DeleteUserModal";
import EmptyState from "@/Components/Dashboard/EmptyState";
import SuperAdminView from "@/Components/Dashboard/Views/SuperAdminView";
import EmployeeView from "@/Components/Dashboard/Views/EmployeeView";
import EhsManagerView from "@/Components/Dashboard/Views/EhsManagerView";
import ImportUsersModal from "@/Components/Dashboard/ImportUsersModal";

export default function Dashboard({
    userStats,
    users,
    stats,
    areas,
    categories,
    savedDraft,
    ehsStats,
    myObservations,
    filters,
    filterAreas,
    filteredReports,
    employeeNotifications,
    employeeNotificationCount,
    canViewAllPlants,
}) {
    const { auth } = usePage().props;
    const user = auth.user;

    const [editingUser, setEditingUser] = useState(null);
    const [deletingUser, setDeletingUser] = useState(null);
    const [showImportModal, setShowImportModal] = useState(false);

    const openEditModal = (userData) => setEditingUser(userData);
    const closeEditModal = () => setEditingUser(null);

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
        <AuthenticatedLayout
            notificationCount={
                ehsStats ? ehsStats.event_count : employeeNotificationCount || 0
            }
            notifications={
                ehsStats 
                    ? (ehsStats.bell_notifications || ehsStats.recent) 
                    : employeeNotifications || []
            }
        >
            <Head title="Dashboard" />

            <div className="py-6 sm:py-12">
                <div className="px-4 mx-auto space-y-4 sm:space-y-6 max-w-7xl sm:px-6 lg:px-8">
                    {user.is_super_admin ? (
                        <SuperAdminView
                            stats={stats}
                            users={users}
                            areas={areas}
                            onUserClick={openEditModal}
                            onImportClick={() => setShowImportModal(true)}
                            filters={filters}
                            filterAreas={filterAreas}
                        />
                    ) : user.is_ehs_manager ? (
                        ehsStats ? (
                            <EhsManagerView
                                user={user}
                                stats={ehsStats}
                                areas={areas}
                                filters={filters}
                                canViewAllPlants={canViewAllPlants}
                            />
                        ) : (
                            <EmptyState message="Cargando..." submessage="" />
                        )
                    ) : (
                        <EmployeeView
                            user={user}
                            userStats={userStats}
                            areas={areas}
                            categories={categories}
                            savedDraft={savedDraft}
                            myObservations={myObservations}
                            filteredReports={filteredReports}
                            employeeNotifications={employeeNotifications}
                        />
                    )}
                </div>
            </div>

            <EditUserModal
                show={editingUser !== null}
                user={editingUser}
                currentUser={user}
                areas={areas}
                onClose={closeEditModal}
                onDelete={handleDeleteFromEdit}
            />

            <DeleteUserModal
                show={deletingUser !== null}
                user={deletingUser}
                onClose={() => setDeletingUser(null)}
                onConfirm={handleDelete}
            />

            <ImportUsersModal
                show={showImportModal}
                onClose={() => setShowImportModal(false)}
            />
        </AuthenticatedLayout>
    );
}
