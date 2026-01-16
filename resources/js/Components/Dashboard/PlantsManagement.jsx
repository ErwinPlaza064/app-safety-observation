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

export default function PlantsManagement({ plants = [] }) {
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editingPlant, setEditingPlant] = useState(null);
    const [deletingPlant, setDeletingPlant] = useState(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: "",
    });

    const openCreateModal = () => {
        reset();
        setEditingPlant(null);
        setShowModal(true);
    };

    const openEditModal = (plant) => {
        setEditingPlant(plant);
        setData({
            name: plant.name,
        });
        setShowModal(true);
    };

    const openDeleteModal = (plant) => {
        setDeletingPlant(plant);
        setShowDeleteModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        reset();
        setEditingPlant(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingPlant) {
            put(route("admin.plants.update", editingPlant.id), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route("admin.plants.store"), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = () => {
        router.delete(route("admin.plants.destroy", deletingPlant.id), {
            onSuccess: () => {
                setShowDeleteModal(false);
                setDeletingPlant(null);
            },
        });
    };

    const togglePlantStatus = (plant) => {
        router.post(
            route("admin.plants.toggle-status", plant.id),
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
                    Gestión de Plantas
                </h3>

                <PrimaryButton
                    onClick={openCreateModal}
                    className="justify-center"
                >
                    <HiPlus className="w-5 h-5 mr-2" />
                    Nueva Planta
                </PrimaryButton>
            </div>

            <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
                <div className="p-6">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">
                                        Nombre de Planta
                                    </th>
                                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase dark:text-gray-300">
                                        Áreas
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
                                {plants.length > 0 ? (
                                    plants.map((plant) => (
                                        <tr key={plant.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        {plant.name}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-center text-gray-600 dark:text-gray-300">
                                                {plant.areas?.length || 0}
                                            </td>
                                            <td className="px-6 py-4 text-center whitespace-nowrap">
                                                {plant.is_active ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                                        Activa
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                                                        Inactiva
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-center whitespace-nowrap">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button onClick={() => openEditModal(plant)} className="p-2 text-blue-600 rounded-lg hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/30">
                                                        <HiPencil className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => togglePlantStatus(plant)} className="p-2 text-yellow-600 rounded-lg hover:bg-yellow-100">
                                                        <HiX className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => openDeleteModal(plant)} className="p-2 text-red-600 rounded-lg hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30">
                                                        <HiTrash className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-10 text-center text-gray-500">
                                            No hay plantas registradas.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Modal show={showModal} onClose={closeModal} maxWidth="md">
                <form onSubmit={handleSubmit} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        {editingPlant ? "Editar Planta" : "Nueva Planta"}
                    </h2>
                    <div className="mt-6">
                        <InputLabel htmlFor="plant_name" value="Nombre de la Planta" />
                        <TextInput
                            id="plant_name"
                            className="block w-full mt-1"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            required
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <SecondaryButton onClick={closeModal}>Cancelar</SecondaryButton>
                        <PrimaryButton disabled={processing}>
                            {editingPlant ? "Actualizar" : "Crear"}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>

            <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)} maxWidth="sm">
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">¿Eliminar esta planta?</h2>
                    <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                        Estás a punto de eliminar la planta <strong>{deletingPlant?.name}</strong>.
                    </p>
                    <div className="flex justify-end gap-3 mt-6">
                        <SecondaryButton onClick={() => setShowDeleteModal(false)}>Cancelar</SecondaryButton>
                        <DangerButton onClick={handleDelete}>Sí, eliminar</DangerButton>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
