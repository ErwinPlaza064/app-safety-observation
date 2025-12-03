import { useState } from "react";
import { useForm, router } from "@inertiajs/react";
import {
    HiPencil,
    HiTrash,
    HiPlus,
    HiOfficeBuilding,
    HiCheck,
    HiX,
} from "react-icons/hi";
import PrimaryButton from "@/Components/PrimaryButton";
import DangerButton from "@/Components/DangerButton";
import SecondaryButton from "@/Components/SecondaryButton";
import Modal from "@/Components/Modal";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";

export default function AreasManagement({ areas = [] }) {
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editingArea, setEditingArea] = useState(null);
    const [deletingArea, setDeletingArea] = useState(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: "",
        code: "",
        description: "",
    });

    const openCreateModal = () => {
        reset();
        setEditingArea(null);
        setShowModal(true);
    };

    const openEditModal = (area) => {
        setEditingArea(area);
        setData({
            name: area.name,
            code: area.code || "",
            description: area.description || "",
        });
        setShowModal(true);
    };

    const openDeleteModal = (area) => {
        setDeletingArea(area);
        setShowDeleteModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        reset();
        setEditingArea(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingArea) {
            put(route("areas.update", editingArea.id), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route("areas.store"), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = () => {
        router.delete(route("areas.destroy", deletingArea.id), {
            onSuccess: () => {
                setShowDeleteModal(false);
                setDeletingArea(null);
            },
        });
    };

    const toggleAreaStatus = (area) => {
        router.post(
            route("areas.toggle-status", area.id),
            {},
            {
                preserveScroll: true,
            }
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                    Gestión de Áreas / Plantas
                </h3>

                <PrimaryButton
                    onClick={openCreateModal}
                    className="justify-center"
                >
                    <HiPlus className="w-5 h-5 mr-2" />
                    Nueva Área
                </PrimaryButton>
            </div>

            {/* Tabla de Áreas */}
            <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
                <div className="p-6">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">
                                        Área
                                    </th>
                                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">
                                        Código
                                    </th>
                                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">
                                        Descripción
                                    </th>
                                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase dark:text-gray-300">
                                        Observaciones
                                    </th>
                                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase dark:text-gray-300">
                                        Estado
                                    </th>
                                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase dark:text-gray-300">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                {areas.length > 0 ? (
                                    areas.map((area) => (
                                        <tr
                                            key={area.id}
                                            className={`transition-colors ${
                                                !area.is_active
                                                    ? "opacity-60 bg-gray-50 dark:bg-gray-900/50"
                                                    : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                            }`}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg dark:bg-blue-900/30">
                                                        <HiOfficeBuilding className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                            {area.name}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap dark:text-gray-300">
                                                {area.code ? (
                                                    <span className="px-2 py-1 text-xs font-mono bg-gray-100 rounded dark:bg-gray-700">
                                                        {area.code}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">
                                                        —
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                                <span className="line-clamp-2">
                                                    {area.description ||
                                                        "Sin descripción"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-center text-gray-600 whitespace-nowrap dark:text-gray-300">
                                                <span className="px-2 py-1 text-xs font-medium bg-gray-100 rounded-full dark:bg-gray-700">
                                                    {area.observations_count ??
                                                        0}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center whitespace-nowrap">
                                                {area.is_active ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                                        <HiCheck className="w-3 h-3 mr-1" />
                                                        Activa
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                                                        <HiX className="w-3 h-3 mr-1" />
                                                        Inactiva
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-center whitespace-nowrap">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() =>
                                                            openEditModal(area)
                                                        }
                                                        className="p-2 text-blue-600 transition-colors rounded-lg hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/30"
                                                        title="Editar"
                                                    >
                                                        <HiPencil className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            toggleAreaStatus(
                                                                area
                                                            )
                                                        }
                                                        className={`p-2 transition-colors rounded-lg ${
                                                            area.is_active
                                                                ? "text-yellow-600 hover:bg-yellow-100 dark:text-yellow-400 dark:hover:bg-yellow-900/30"
                                                                : "text-green-600 hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-900/30"
                                                        }`}
                                                        title={
                                                            area.is_active
                                                                ? "Desactivar"
                                                                : "Activar"
                                                        }
                                                    >
                                                        {area.is_active ? (
                                                            <HiX className="w-4 h-4" />
                                                        ) : (
                                                            <HiCheck className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            openDeleteModal(
                                                                area
                                                            )
                                                        }
                                                        className="p-2 text-red-600 transition-colors rounded-lg hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30"
                                                        title="Eliminar"
                                                    >
                                                        <HiTrash className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="px-6 py-10 text-center text-gray-500 dark:text-gray-400"
                                        >
                                            <HiOfficeBuilding className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                                            <p>No hay áreas registradas.</p>
                                            <button
                                                onClick={openCreateModal}
                                                className="mt-2 text-blue-600 hover:underline dark:text-blue-400"
                                            >
                                                Crear la primera área
                                            </button>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Crear/Editar */}
            <Modal show={showModal} onClose={closeModal} maxWidth="md">
                <form onSubmit={handleSubmit} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        {editingArea ? "Editar Área" : "Nueva Área"}
                    </h2>

                    <div className="mt-6 space-y-4">
                        <div>
                            <InputLabel
                                htmlFor="name"
                                value="Nombre del Área *"
                            />
                            <TextInput
                                id="name"
                                type="text"
                                className="block w-full mt-1"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                placeholder="Ej: Planta 3"
                                required
                            />
                            <InputError
                                message={errors.name}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel
                                htmlFor="code"
                                value="Código (opcional)"
                            />
                            <TextInput
                                id="code"
                                type="text"
                                className="block w-full mt-1"
                                value={data.code}
                                onChange={(e) =>
                                    setData(
                                        "code",
                                        e.target.value.toUpperCase()
                                    )
                                }
                                placeholder="Ej: P3, ADM, IT"
                                maxLength={20}
                            />
                            <InputError
                                message={errors.code}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel
                                htmlFor="description"
                                value="Descripción (opcional)"
                            />
                            <textarea
                                id="description"
                                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                value={data.description}
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                                placeholder="Descripción del área..."
                                rows={3}
                            />
                            <InputError
                                message={errors.description}
                                className="mt-2"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <SecondaryButton type="button" onClick={closeModal}>
                            Cancelar
                        </SecondaryButton>
                        <PrimaryButton type="submit" disabled={processing}>
                            {processing
                                ? "Guardando..."
                                : editingArea
                                ? "Actualizar"
                                : "Crear Área"}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* Modal Confirmar Eliminación */}
            <Modal
                show={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                maxWidth="sm"
            >
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        ¿Eliminar esta área?
                    </h2>

                    <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                        Estás a punto de eliminar el área{" "}
                        <strong className="text-gray-900 dark:text-gray-100">
                            {deletingArea?.name}
                        </strong>
                        . Esta acción no se puede deshacer.
                    </p>

                    {deletingArea?.observations_count > 0 && (
                        <div className="p-3 mt-4 text-sm text-yellow-800 bg-yellow-100 rounded-lg dark:bg-yellow-900/30 dark:text-yellow-400">
                            ⚠️ Esta área tiene {deletingArea.observations_count}{" "}
                            observaciones asociadas. Considera desactivarla en
                            lugar de eliminarla.
                        </div>
                    )}

                    <div className="flex justify-end gap-3 mt-6">
                        <SecondaryButton
                            onClick={() => setShowDeleteModal(false)}
                        >
                            Cancelar
                        </SecondaryButton>
                        <DangerButton onClick={handleDelete}>
                            Sí, eliminar
                        </DangerButton>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
