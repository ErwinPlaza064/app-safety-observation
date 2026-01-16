import { useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import Modal from "@/Components/Modal";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import DangerButton from "@/Components/DangerButton";
import { router } from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import Checkbox from "@/Components/Checkbox";

export default function EditUserModal({
    show,
    user,
    currentUser,
    onClose,
    onDelete,
    plants = [],
    areas = [],
}) {
    const { data, setData, patch, processing, errors, reset } = useForm({
        name: "",
        email: "",
        employee_number: "",
        area_id: "",
        plant_id: "",
        position: "",
        is_ehs_manager: false,
        is_ehs_coordinator: false,
        password: "",
    });

    const [legacyWarning, setLegacyWarning] = useState(false);

    useEffect(() => {
        if (user) {
            let initialAreaId = user.area_id || "";
            let initialPlantId = user.plant_id || "";

            // Intento de mapeo para usuarios legacy
            if (!initialAreaId && user.area && areas.length > 0) {
                const matchedArea = areas.find(
                    (a) =>
                        a.name.toLowerCase().trim() ===
                        user.area.toLowerCase().trim()
                );
                if (matchedArea) {
                    initialAreaId = matchedArea.id;
                }
            }

            // Si aún no hay planta, pero hay un área válida, podrías intentar inferir la planta
            // Pero como las áreas ya no dependen de las plantas, lo dejamos al admin.

            setData({
                name: user.name || "",
                email: user.email || "",
                employee_number: user.employee_number || "",
                area_id: initialAreaId,
                plant_id: initialPlantId,
                position: user.position || "",
                is_ehs_manager: !!user.is_ehs_manager,
                is_ehs_coordinator: !!user.is_ehs_coordinator,
                password: "",
            });

            setLegacyWarning(!initialAreaId || !initialPlantId);
            setSuspensionReason("");
            setShowSuspendConfirm(false);
        } else {
            reset();
            setLegacyWarning(false);
        }
    }, [user, areas]);

    const resendVerification = () => {
        router.post(
            route("admin.users.resend-verification", user.id),
            {},
            {
                onSuccess: () => {},
            }
        );
    };

    const manualVerify = () => {
        router.post(
            route("admin.users.manual-verify", user.id),
            {},
            {
                onSuccess: () => {
                    onClose();
                },
                preserveScroll: true,
            }
        );
    };

    const toggleSuspension = () => {
        router.post(
            route("admin.users.toggle-suspension", user.id),
            { reason: suspensionReason },
            {
                onSuccess: () => {
                    setShowSuspendConfirm(false);
                    onClose();
                },
                preserveScroll: true,
            }
        );
    };

    const submit = (e) => {
        e.preventDefault();
        patch(route("admin.users.update", user.id), {
            onSuccess: () => onClose(),
        });
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                    Editar Usuario
                </h2>
                <button
                    onClick={onClose}
                    className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </div>

            <form onSubmit={submit}>
                <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                    {legacyWarning && (
                        <div className="p-3 mb-4 text-sm text-yellow-800 bg-yellow-100 rounded-lg dark:bg-yellow-900/30 dark:text-yellow-400">
                            <strong>Nota:</strong> Este es un usuario antiguo con datos incompletos (sin Planta o Área asignada). Por favor, selecciona los valores correctos antes de guardar.
                        </div>
                    )}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="md:col-span-2">
                            <InputLabel
                                htmlFor="name"
                                value="Nombre Completo"
                            />
                            <TextInput
                                id="name"
                                className="block w-full mt-1"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                required
                            />
                            <InputError
                                message={errors.name}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="employee_number"
                                value="No. Empleado"
                            />
                            <TextInput
                                id="employee_number"
                                className="block w-full mt-1 bg-gray-50"
                                value={data.employee_number}
                                onChange={(e) =>
                                    setData("employee_number", e.target.value)
                                }
                                required
                            />
                            <InputError
                                message={errors.employee_number}
                                className="mt-2"
                            />
                        </div>
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="email"
                            value="Correo Electrónico"
                        />
                        <TextInput
                            id="email"
                            type="email"
                            className="block w-full mt-1"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            required
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <InputLabel
                                htmlFor="plant_id"
                                value="Planta"
                            />
                            <select
                                id="plant_id"
                                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                value={data.plant_id}
                                onChange={(e) =>
                                    setData("plant_id", e.target.value)
                                }
                                required
                            >
                                <option value="">Selecciona planta...</option>
                                {plants.map((plant) => (
                                    <option key={plant.id} value={plant.id}>
                                        {plant.name}
                                    </option>
                                ))}
                            </select>
                            <InputError
                                message={errors.plant_id}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="area_id"
                                value="Área / Departamento"
                            />
                            <select
                                id="area_id"
                                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                value={data.area_id}
                                onChange={(e) =>
                                    setData("area_id", e.target.value)
                                }
                                required
                            >
                                <option value="">Seleccionar área...</option>
                                {areas &&
                                    areas.map((area) => (
                                        <option key={area.id} value={area.id}>
                                            {area.name}
                                        </option>
                                    ))}
                            </select>
                            <InputError
                                message={errors.area_id}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="position"
                                value="Puesto / Cargo"
                            />
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

                    <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                        <h3 className="mb-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                            Roles y Permisos
                        </h3>
                        <div className="block">
                            <label className="flex items-center">
                                <Checkbox
                                    name="is_ehs_manager"
                                    checked={data.is_ehs_manager}
                                    onChange={(e) =>
                                        setData(
                                            "is_ehs_manager",
                                            e.target.checked
                                        )
                                    }
                                />
                                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                                    Asignar como <strong>Gerente de EHS</strong>
                                </span>
                            </label>
                        </div>
                        <div className="block mt-4">
                            <label className="flex items-center">
                                <Checkbox
                                    name="is_ehs_coordinator"
                                    checked={data.is_ehs_coordinator}
                                    onChange={(e) =>
                                        setData(
                                            "is_ehs_coordinator",
                                            e.target.checked
                                        )
                                    }
                                />
                                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                                    Asignar como{" "}
                                    <strong>Coordinador EHS</strong> (Vista
                                    Global)
                                </span>
                            </label>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                        <h3 className="mb-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                            Seguridad y Credenciales
                        </h3>
                        <div>
                            <InputLabel
                                htmlFor="edit_password"
                                value="Cambiar Contraseña (dejar en blanco para mantener la actual)"
                            />
                            <div className="relative mt-1">
                                <TextInput
                                    id="edit_password"
                                    type="password"
                                    className="block w-full pr-10"
                                    value={data.password}
                                    onChange={(e) => setData("password", e.target.value)}
                                    autoComplete="new-password"
                                    placeholder="••••••••"
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                                Mínimo 8 caracteres. Se actualizará solo si escribes algo aquí.
                            </p>
                            <InputError message={errors.password} className="mt-2" />
                        </div>
                    </div>

                    {user &&
                        currentUser &&
                        user.id !== currentUser.id &&
                        !user.is_super_admin && (
                            <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                                <h3 className="mb-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                                    Estado de la Cuenta
                                </h3>

                                {user.is_suspended ? (
                                    <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-shrink-0">
                                                <svg
                                                    className="w-5 h-5 text-red-500"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                                                    />
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-red-800 dark:text-red-300">
                                                    Cuenta Suspendida
                                                </p>
                                                {user.suspension_reason && (
                                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                                        Motivo:{" "}
                                                        {user.suspension_reason}
                                                    </p>
                                                )}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={toggleSuspension}
                                                className="px-3 py-1.5 text-sm font-medium text-green-700 bg-green-100 rounded-lg hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50 transition-colors"
                                            >
                                                Reactivar
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        {!showSuspendConfirm ? (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowSuspendConfirm(true)
                                                }
                                                className="text-sm font-medium text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-300 hover:underline focus:outline-none"
                                            >
                                                Suspender cuenta temporalmente
                                            </button>
                                        ) : (
                                            <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                                                <p className="mb-3 text-sm font-medium text-yellow-800 dark:text-yellow-300">
                                                    ¿Estás seguro de suspender
                                                    esta cuenta?
                                                </p>
                                                <div className="mb-3">
                                                    <TextInput
                                                        type="text"
                                                        placeholder="Motivo de la suspensión (opcional)"
                                                        value={suspensionReason}
                                                        onChange={(e) =>
                                                            setSuspensionReason(
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full text-sm"
                                                    />
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={
                                                            toggleSuspension
                                                        }
                                                        className="px-3 py-1.5 text-sm font-medium text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 transition-colors"
                                                    >
                                                        Confirmar Suspensión
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setShowSuspendConfirm(
                                                                false
                                                            );
                                                            setSuspensionReason(
                                                                ""
                                                            );
                                                        }}
                                                        className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
                                                    >
                                                        Cancelar
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                </div>

                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                    <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex justify-center sm:justify-start">
                            {user &&
                                currentUser &&
                                user.id !== currentUser.id && (
                                    <button
                                        type="button"
                                        onClick={onDelete}
                                        className="text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 hover:underline focus:outline-none"
                                    >
                                        Eliminar este usuario
                                    </button>
                                )}

                            {user && !user.email_verified_at && (
                                <>
                                    <button
                                        type="button"
                                        onClick={manualVerify}
                                        className="text-sm font-medium text-green-600 dark:text-green-400 transition-colors hover:text-green-800 dark:hover:text-green-300 hover:underline focus:outline-none sm:ml-4"
                                    >
                                        Marcar como Verificado
                                    </button>
                                    <button
                                        type="button"
                                        onClick={resendVerification}
                                        className="text-sm font-medium text-blue-600 dark:text-blue-400 transition-colors hover:text-blue-800 dark:hover:text-blue-300 hover:underline focus:outline-none sm:ml-4"
                                    >
                                        Reenviar verificación
                                    </button>
                                </>
                            )}
                        </div>
                        <div className="flex flex-col gap-3 sm:flex-row sm:w-auto">
                            <SecondaryButton
                                onClick={onClose}
                                className="justify-center w-full sm:w-auto"
                            >
                                Cancelar
                            </SecondaryButton>
                            <PrimaryButton
                                disabled={processing}
                                className="justify-center w-full sm:w-auto"
                            >
                                {processing
                                    ? "Guardando..."
                                    : "Guardar Cambios"}
                            </PrimaryButton>
                        </div>
                    </div>
                </div>
            </form>
        </Modal>
    );
}
