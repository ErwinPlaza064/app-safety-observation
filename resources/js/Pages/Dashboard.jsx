import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage, router } from "@inertiajs/react";
import { useState } from "react";
import WelcomeCard from "@/Components/Dashboard/WelcomeCard";
import EditUserModal from "@/Components/Dashboard/EditUserModal";
import DeleteUserModal from "@/Components/Dashboard/DeleteUserModal";
import EmptyState from "@/Components/Dashboard/EmptyState";
import SuperAdminView from "@/Components/Dashboard/Views/SuperAdminView";
import EmployeeView from "@/Components/Dashboard/Views/EmployeeView";
import EhsManagerView from "@/Components/Dashboard/Views/EhsManagerView";

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
}) {
    const { auth } = usePage().props;
    const user = auth.user;

    const [editingUser, setEditingUser] = useState(null);
    const [deletingUser, setDeletingUser] = useState(null);

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
        <AuthenticatedLayout>
            <Head title="Panel de Control" />

            <div className="py-6 sm:py-12">
                <div className="px-4 mx-auto space-y-4 sm:space-y-6 max-w-7xl sm:px-6 lg:px-8">
                    {user.is_super_admin ? (
                        <SuperAdminView
                            stats={stats}
                            users={users}
                            onUserClick={openEditModal}
                            filters={filters}
                            filterAreas={filterAreas}
                        />
                    ) : user.is_ehs_manager ? (
                        ehsStats ? (
                            <EhsManagerView user={user} stats={ehsStats} />
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
                        />
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
