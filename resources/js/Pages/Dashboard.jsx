import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage, useForm } from "@inertiajs/react";
import { router } from "@inertiajs/react";
import { useState } from "react";
import WelcomeCard from "@/Components/Dashboard/WelcomeCard";
import StatsCards from "@/Components/Dashboard/StatsCards";
import UsersTable from "@/Components/Dashboard/UsersTable";
import EditUserModal from "@/Components/Dashboard/EditUserModal";
import DeleteUserModal from "@/Components/Dashboard/DeleteUserModal";
import EmptyState from "@/Components/Dashboard/EmptyState";

export default function Dashboard({ userStats, users, stats }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const [editingUser, setEditingUser] = useState(null);
    const [deletingUser, setDeletingUser] = useState(null);

    const { data, setData, patch, processing, errors, reset } = useForm({
        name: "",
        email: "",
        employee_number: "",
        area: "",
        position: "",
        is_ehs_manager: false,
    });

    const openEditModal = (userData) => {
        setData({
            name: userData.name,
            email: userData.email,
            employee_number: userData.employee_number,
            area: userData.area,
            position: userData.position,
            is_ehs_manager: userData.is_ehs_manager,
        });
        setEditingUser(userData);
    };

    const closeEditModal = () => {
        setEditingUser(null);
        reset();
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        patch(route("admin.users.update", editingUser.id), {
            onSuccess: () => closeEditModal(),
        });
    };

    const handleDelete = () => {
        if (deletingUser) {
            router.delete(route("admin.users.destroy", deletingUser.id), {
                onSuccess: () => setDeletingUser(null),
                preserveScroll: true,
            });
        }
    };

    const handleDeleteFromEdit = () => {
        closeEditModal();
        setDeletingUser(editingUser);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Panel de Control" />

            <div className="py-12">
                <div className="mx-auto space-y-6 max-w-7xl sm:px-6 lg:px-8">
                    <WelcomeCard user={user} userStats={userStats} />

                    {user.is_super_admin && stats && (
                        <StatsCards stats={stats} />
                    )}

                    {user.is_ehs_manager && !user.is_super_admin && (
                        <EmptyState
                            message="Panel de Gestión EHS"
                            submessage="Próximamente podrás gestionar todas las observaciones de seguridad desde aquí."
                        />
                    )}

                    {user.is_super_admin && users && (
                        <UsersTable users={users} onUserClick={openEditModal} />
                    )}

                    {!user.is_ehs_manager && !user.is_super_admin && (
                        <EmptyState
                            message="Bienvenido al sistema de observaciones de seguridad de Wasion."
                            submessage="Próximamente podrás crear y ver tus observaciones desde aquí."
                        />
                    )}
                </div>
            </div>

            <EditUserModal
                show={editingUser !== null}
                user={editingUser}
                currentUser={user}
                data={data}
                setData={setData}
                processing={processing}
                errors={errors}
                onClose={closeEditModal}
                onSubmit={handleUpdate}
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
