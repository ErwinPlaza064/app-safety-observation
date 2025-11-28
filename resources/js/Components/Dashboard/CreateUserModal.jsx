import { useForm } from "@inertiajs/react";
import Modal from "@/Components/Modal";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import Checkbox from "@/Components/Checkbox";

export default function CreateUserModal({ show, onClose }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        employee_number: "",
        area: "",
        position: "",
        password: "",
        is_ehs_manager: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("admin.users.store"), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="4xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-xl font-semibold text-gray-800">
                    Crear Nuevo Usuario
                </h2>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600"
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
                                htmlFor="new_name"
                                value="Nombre Completo"
                            />
                            <TextInput
                                id="new_name"
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
                                htmlFor="new_employee_number"
                                value="No. Empleado"
                            />
                            <TextInput
                                id="new_employee_number"
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
                            htmlFor="new_email"
                            value="Correo Electrónico"
                        />
                        <TextInput
                            id="new_email"
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
                                htmlFor="new_area"
                                value="Área / Departamento"
                            />
                            <TextInput
                                id="new_area"
                                className="block w-full mt-1"
                                value={data.area}
                                onChange={(e) =>
                                    setData("area", e.target.value)
                                }
                                required
                            />
                            <InputError
                                message={errors.area}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="new_position"
                                value="Puesto / Cargo"
                            />
                            <TextInput
                                id="new_position"
                                className="block w-full mt-1"
                                value={data.position}
                                onChange={(e) =>
                                    setData("position", e.target.value)
                                }
                                required
                            />
                            <InputError
                                message={errors.position}
                                className="mt-2"
                            />
                        </div>
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="new_password"
                            value="Contraseña Temporal"
                        />
                        <TextInput
                            id="new_password"
                            type="text"
                            className="block w-full mt-1"
                            value={data.password}
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            required
                            placeholder="Asigna una contraseña inicial"
                        />
                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                        <label className="flex items-center">
                            <Checkbox
                                name="is_ehs_manager"
                                checked={data.is_ehs_manager}
                                onChange={(e) =>
                                    setData("is_ehs_manager", e.target.checked)
                                }
                            />
                            <span className="ml-2 text-sm text-gray-600">
                                Asignar como <strong>Gerente de EHS</strong>
                            </span>
                        </label>
                    </div>
                </div>

                <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <SecondaryButton onClick={onClose}>
                        Cancelar
                    </SecondaryButton>
                    <PrimaryButton disabled={processing}>
                        Crear Cuenta Verificada
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
