import Modal from "@/Components/Modal";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import DangerButton from "@/Components/DangerButton";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";

export default function EditUserModal({
    show,
    user,
    currentUser,
    data,
    setData,
    processing,
    errors,
    onClose,
    onSubmit,
    onDelete,
}) {
    if (!data) return null;
    return (
        <Modal show={show} onClose={onClose} maxWidth="2xl">
            <form onSubmit={onSubmit} className="p-6">
                <h2 className="text-lg font-medium text-gray-900">
                    Editar Usuario
                </h2>

                <div className="mt-6 space-y-4">
                    <div>
                        <InputLabel htmlFor="name" value="Nombre" />
                        <TextInput
                            id="name"
                            className="block w-full mt-1"
                            value={data?.name || ""}
                            onChange={(e) => setData("name", e.target.value)}
                        />
                        <InputError message={errors?.name} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="email" value="Email" />
                        <TextInput
                            id="email"
                            type="email"
                            className="block w-full mt-1"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                        />
                        <InputError message={errors.email} className="mt-2" />
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
                            onChange={(e) => setData("area", e.target.value)}
                        />
                        <InputError message={errors.area} className="mt-2" />
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

                <div className="flex flex-col items-center justify-between mt-6 lg:flex-row">
                    <div className="py-3">
                        {user && user.id !== currentUser.id && (
                            <DangerButton type="button" onClick={onDelete}>
                                Eliminar Usuario
                            </DangerButton>
                        )}
                    </div>
                    <div className="flex items-center justify-center gap-3 lg:flex-row">
                        <SecondaryButton onClick={onClose}>
                            Cancelar
                        </SecondaryButton>
                        <PrimaryButton disabled={processing}>
                            Guardar Cambios
                        </PrimaryButton>
                    </div>
                </div>
            </form>
        </Modal>
    );
}
