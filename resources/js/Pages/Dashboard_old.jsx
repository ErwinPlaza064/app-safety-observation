import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Modal from "@/Components/Modal";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import DangerButton from "@/Components/DangerButton";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import { Head, usePage, useForm } from "@inertiajs/react";
import { useState } from "react";

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
            useForm().delete(route("admin.users.destroy", deletingUser.id), {
                onSuccess: () => setDeletingUser(null),
            });
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Panel de Control" />

            <div className="py-12">
                <div className="mx-auto space-y-6 max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-2xl font-bold text-gray-900">
                                Bienvenido, {userStats.name}
                            </h3>
                            <p className="mt-2 text-sm text-gray-600">
                                <strong>Puesto:</strong> {userStats.position}{" "}
                                <br /> <strong>Área:</strong> {userStats.area}
                            </p>
                            <div className="flex gap-2 mt-4">
                                {user.is_super_admin && (
                                    <span className="inline-flex items-center px-3 py-1 text-xs font-medium text-red-800 bg-gray-100 rounded-full">
                                        Super Administrador
                                    </span>
                                )}
                                {user.is_ehs_manager && (
                                    <span className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">
                                        EHS Manager
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {user.is_super_admin && stats && (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <div className="text-sm font-medium text-gray-500">
                                        Total de Usuarios
                                    </div>
                                    <div className="mt-2 text-3xl font-bold text-gray-900">
                                        {stats.total_users}
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <div className="text-sm font-medium text-gray-500">
                                        Usuarios Verificados
                                    </div>
                                    <div className="mt-2 text-3xl font-bold text-green-600">
                                        {stats.verified_users}
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <div className="text-sm font-medium text-gray-500">
                                        EHS Managers
                                    </div>
                                    <div className="mt-2 text-3xl font-bold text-blue-600">
                                        {stats.ehs_managers}
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <div className="text-sm font-medium text-gray-500">
                                        Super Admins
                                    </div>
                                    <div className="mt-2 text-3xl font-bold text-red-800">
                                        {stats.super_admins}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {user.is_ehs_manager && !user.is_super_admin && (
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6 text-center text-gray-600">
                                <p className="text-lg">Panel de Gestión EHS</p>
                                <p className="mt-2 text-sm">
                                    Próximamente podrás gestionar todas las
                                    observaciones de seguridad desde aquí.
                                </p>
                            </div>
                        </div>
                    )}

                    {user.is_super_admin && users && (
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                                    Gestión de Usuarios
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
                                                    Email
                                                </th>
                                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                                    Área
                                                </th>
                                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                                    Puesto
                                                </th>
                                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                                    Rol
                                                </th>
                                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                                    Estado
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {users.map((userData) => (
                                                <tr
                                                    key={userData.id}
                                                    onClick={() =>
                                                        openEditModal(userData)
                                                    }
                                                    className="transition-colors cursor-pointer hover:bg-gray-50"
                                                >
                                                    <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                                                        {
                                                            userData.employee_number
                                                        }
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                                                        {userData.name}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                                                        {userData.email}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                                                        {userData.area}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                                                        {userData.position}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                                                        <div className="flex gap-1">
                                                            {userData.is_super_admin && (
                                                                <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-800 bg-gray-100 rounded-full">
                                                                    Super Admin
                                                                </span>
                                                            )}
                                                            {userData.is_ehs_manager &&
                                                                !userData.is_super_admin && (
                                                                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">
                                                                        EHS
                                                                        Manager
                                                                    </span>
                                                                )}
                                                            {!userData.is_ehs_manager &&
                                                                !userData.is_super_admin && (
                                                                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-800 bg-gray-100 rounded-full">
                                                                        Empleado
                                                                    </span>
                                                                )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                                                        {userData.email_verified_at ? (
                                                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                                                                Verificado
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full">
                                                                Pendiente
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {!user.is_ehs_manager && !user.is_super_admin && (
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6 text-center text-gray-600">
                                <p className="text-lg">
                                    Bienvenido al sistema de observaciones de
                                    seguridad de Wasion.
                                </p>
                                <p className="mt-2 text-sm">
                                    Próximamente podrás crear y ver tus
                                    observaciones desde aquí.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de Edición */}
            <Modal
                show={editingUser !== null}
                onClose={closeEditModal}
                maxWidth="2xl"
            >
                <form onSubmit={handleUpdate} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        Editar Usuario
                    </h2>

                    <div className="mt-6 space-y-4">
                        <div>
                            <InputLabel htmlFor="name" value="Nombre" />
                            <TextInput
                                id="name"
                                className="block w-full mt-1"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                            />
                            <InputError
                                message={errors.name}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="email" value="Email" />
                            <TextInput
                                id="email"
                                type="email"
                                className="block w-full mt-1"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                            />
                            <InputError
                                message={errors.email}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel
                                htmlFor="employee_number"
                                value="Número de Empleado"
                            />
                            <TextInput
                                id="employee_number"
                                className="block w-full mt-1"
                                value={data.employee_number}
                                onChange={(e) =>
                                    setData("employee_number", e.target.value)
                                }
                            />
                            <InputError
                                message={errors.employee_number}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="area" value="Área" />
                            <TextInput
                                id="area"
                                className="block w-full mt-1"
                                value={data.area}
                                onChange={(e) =>
                                    setData("area", e.target.value)
                                }
                            />
                            <InputError
                                message={errors.area}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="position" value="Puesto" />
                            <TextInput
                                id="position"
                                className="block w-full mt-1"
                                value={data.position}
                                onChange={(e) =>
                                    setData("position", e.target.value)
                                }
                            />
                            <InputError
                                message={errors.position}
                                className="mt-2"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col items-center mt-6 lg:flex-row lg:justify-between">
                        <div className="py-3">
                            {editingUser && editingUser.id !== user.id && (
                                <DangerButton
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        closeEditModal();
                                        setDeletingUser(editingUser);
                                    }}
                                >
                                    Eliminar Usuario
                                </DangerButton>
                            )}
                        </div>
                        <div className="flex gap-3">
                            <SecondaryButton onClick={closeEditModal}>
                                Cancelar
                            </SecondaryButton>
                            <PrimaryButton disabled={processing}>
                                Guardar Cambios
                            </PrimaryButton>
                        </div>
                    </div>
                </form>
            </Modal>

            <Modal
                show={deletingUser !== null}
                onClose={() => setDeletingUser(null)}
            >
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        ¿Eliminar Usuario?
                    </h2>

                    <p className="mt-4 text-sm text-gray-600">
                        ¿Estás seguro de que deseas eliminar a{" "}
                        <strong>{deletingUser?.name}</strong>? Esta acción no se
                        puede deshacer.
                    </p>

                    <div className="flex justify-end gap-3 mt-6">
                        <SecondaryButton onClick={() => setDeletingUser(null)}>
                            Cancelar
                        </SecondaryButton>
                        <DangerButton onClick={handleDelete}>
                            Eliminar Usuario
                        </DangerButton>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
