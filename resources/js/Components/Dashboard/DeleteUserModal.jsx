import Modal from "@/Components/Modal";
import SecondaryButton from "@/Components/SecondaryButton";
import DangerButton from "@/Components/DangerButton";

export default function DeleteUserModal({ show, user, onClose, onConfirm }) {
    return (
        <Modal show={show} onClose={onClose}>
            <div className="flex flex-col p-6">
                <h2 className="text-lg font-medium text-gray-900">
                    ¿Eliminar Usuario?
                </h2>

                <p className="mt-4 text-sm text-gray-600">
                    ¿Estás seguro de que deseas eliminar a{" "}
                    <strong>{user?.name}</strong>? Esta acción no se puede
                    deshacer.
                </p>

                <div className="flex justify-end gap-3 mt-6">
                    <SecondaryButton onClick={onClose}>
                        Cancelar
                    </SecondaryButton>
                    <DangerButton onClick={onConfirm}>
                        Eliminar Usuarios
                    </DangerButton>
                </div>
            </div>
        </Modal>
    );
}
