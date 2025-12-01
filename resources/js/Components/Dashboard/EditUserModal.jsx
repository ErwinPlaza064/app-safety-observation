import { useForm } from "@inertiajs/react";
import { useEffect } from "react";
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
}) {
    const { data, setData, patch, processing, errors, reset } = useForm({
        name: "",
        email: "",
        employee_number: "",
        area: "",
        position: "",
        is_ehs_manager: false,
    });

    useEffect(() => {
        if (user) {
            setData({
                name: user.name || "",
                email: user.email || "",
                employee_number: user.employee_number || "",
                area: user.area || "",
                position: user.position || "",
                is_ehs_manager: !!user.is_ehs_manager,
            });
        } else {
            reset();
        }
    }, [user]);

    const resendVerification = () => {
        router.post(
            route("admin.users.resend-verification", user.id),
            {},
            {
                onSuccess: () => {},
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
        <Modal show={show} onClose={onClose} maxWidth="4xl">
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
                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <InputLabel
                                htmlFor="area"
                                value="Área / Departamento"
                            />
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
                    </div>
                </div>

                {/* ... Footer igual que antes ... */}
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
                                <button
                                    type="button"
                                    onClick={resendVerification}
                                    className="text-sm font-medium text-blue-600 dark:text-blue-400 transition-colors hover:text-blue-800 dark:hover:text-blue-300 hover:underline focus:outline-none sm:ml-4"
                                >
                                    Reenviar verificación
                                </button>
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
