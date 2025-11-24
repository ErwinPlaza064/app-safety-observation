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

// Nuevo componente: Formulario de Observación de Seguridad
const SafetyObservationForm = ({ user }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        observer_name: user.name || '',
        employee_id: user.employee_number || '',
        department: user.area || '',
        position: user.position || '',
        observation_date: new Date().toISOString().split('T')[0], // Formato YYYY-MM-DD
        observed_person: '',
        area: 'Planta 1',
        observation_type: '',
        categories: [],
        description: '',
        photos: []
    });

    const categories = [
        { id: 'epp', label: 'EPP (Equipo de Protección Personal)' },
        { id: 'sqp', label: 'Manejo de SQP' },
        { id: 'ergonomics', label: 'Actividades Ergonómicas' },
        { id: 'behavior', label: 'Comportamiento' },
        { id: 'materials', label: 'Manejo De Materiales' },
        { id: 'substances', label: 'Ingesta de sustancias' },
        { id: 'cleanliness', label: 'Orden Y Limpieza' },
        { id: 'electrical', label: 'Trabajos Eléctricos' },
        { id: 'tools', label: 'Mal uso de herramientas' },
        { id: 'other', label: 'Otro' }
    ];

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleCategoryToggle = (categoryId) => {
        setFormData(prev => ({
            ...prev,
            categories: prev.categories.includes(categoryId)
                ? prev.categories.filter(c => c !== categoryId)
                : [...prev.categories, categoryId]
        }));
    };

    const handleNext = () => {
        if (currentStep < 4) setCurrentStep(currentStep + 1);
    };

    const handlePrevious = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const handleSubmit = () => {
        router.post(route('safety-observations.submit'), formData, {
            onSuccess: () => {
                alert('Observación enviada exitosamente');
                // Resetear al paso 1
                setCurrentStep(1);
                // Resetear formulario
                setFormData({
                    observer_name: user.name || '',
                    employee_id: user.employee_number || '',
                    department: user.area || '',
                    position: user.position || '',
                    observation_date: new Date().toISOString().split('T')[0],
                    observed_person: '',
                    area: 'Planta 1',
                    observation_type: '',
                    categories: [],
                    description: '',
                    photos: []
                });
            },
            onError: (errors) => {
                console.error('Errores:', errors);
                alert('Error al enviar la observación. Por favor verifica los datos.');
            }
        });
    };

    const handleSaveDraft = () => {
        router.post(route('safety-observations.draft'), formData, {
            onSuccess: () => {
                alert('Borrador guardado');
            },
            onError: (errors) => {
                console.error('Errores:', errors);
                alert('Error al guardar el borrador.');
            }
        });
    };

    return (
        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
                <div className="mb-8">
                    <h2 className="mb-2 text-3xl font-semibold text-gray-800">
                        Nueva Observación de Seguridad
                    </h2>
                    <p className="text-gray-600">
                        Complete el formulario con los detalles de la observación
                    </p>
                </div>

                {/* Step 1: Observer Information */}
                {currentStep === 1 && (
                    <div className="py-4 pl-6 border-l-4 border-blue-500">
                        <div className="flex items-center mb-6">
                            <div className="flex items-center justify-center w-8 h-8 mr-3 bg-blue-500 rounded-full">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <h3 className="flex items-center text-xl font-semibold text-gray-800">
                                Información del Observador
                                <svg className="w-5 h-5 ml-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </h3>
                        </div>

                        <div className="grid grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-700">
                                    Nombre del Observador
                                </label>
                                <input
                                    type="text"
                                    value={formData.observer_name}
                                    onChange={(e) => handleInputChange('observer_name', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-700">
                                    ID de Empleado
                                </label>
                                <input
                                    type="text"
                                    value={formData.employee_id}
                                    onChange={(e) => handleInputChange('employee_id', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-700">
                                    Departamento
                                </label>
                                <input
                                    type="text"
                                    value={formData.department}
                                    onChange={(e) => handleInputChange('department', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-700">
                                    Fecha
                                </label>
                                <input
                                    type="date"
                                    value={formData.observation_date}
                                    onChange={(e) => handleInputChange('observation_date', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block mb-2 text-sm font-medium text-gray-700">
                                Persona Observada (Opcional)
                            </label>
                            <input
                                type="text"
                                value={formData.observed_person}
                                onChange={(e) => handleInputChange('observed_person', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                )}

                {/* Step 2: Observation Type */}
                {currentStep === 2 && (
                    <div className="py-4 pl-6 border-l-4 border-blue-500">
                        <div className="mb-6">
                            <label className="block mb-2 text-sm font-medium text-gray-700">
                                Área / Planta
                            </label>
                            <select
                                value={formData.area}
                                onChange={(e) => handleInputChange('area', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="Planta 1">Planta 1</option>
                                <option value="Planta 2">Planta 2</option>
                                <option value="Planta 3">Planta 3</option>
                            </select>
                        </div>

                        <div className="mb-6">
                            <label className="block mb-3 text-sm font-medium text-gray-700">
                                Tipo de Observación <span className="text-red-500">*</span>
                            </label>
                            <div className="space-y-3">
                                <label
                                    className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition ${
                                        formData.observation_type === 'unsafe-act'
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-300 hover:border-blue-300'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="observationType"
                                        value="unsafe-act"
                                        checked={formData.observation_type === 'unsafe-act'}
                                        onChange={(e) => handleInputChange('observation_type', e.target.value)}
                                        className="mt-1 mr-3"
                                    />
                                    <div>
                                        <div className="font-semibold text-gray-800">Acto Inseguro</div>
                                        <div className="text-sm text-gray-600">
                                            Comportamiento que puede causar un incidente
                                        </div>
                                    </div>
                                </label>

                                <label
                                    className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition ${
                                        formData.observation_type === 'unsafe-condition'
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-300 hover:border-blue-300'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="observationType"
                                        value="unsafe-condition"
                                        checked={formData.observation_type === 'unsafe-condition'}
                                        onChange={(e) => handleInputChange('observation_type', e.target.value)}
                                        className="mt-1 mr-3"
                                    />
                                    <div>
                                        <div className="font-semibold text-gray-800">Condición Insegura</div>
                                        <div className="text-sm text-gray-600">
                                            Situación física que puede causar un incidente
                                        </div>
                                    </div>
                                </label>

                                <label
                                    className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition ${
                                        formData.observation_type === 'safe-act'
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-300 hover:border-blue-300'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="observationType"
                                        value="safe-act"
                                        checked={formData.observation_type === 'safe-act'}
                                        onChange={(e) => handleInputChange('observation_type', e.target.value)}
                                        className="mt-1 mr-3"
                                    />
                                    <div>
                                        <div className="font-semibold text-gray-800">Acto Seguro</div>
                                        <div className="text-sm text-gray-600">
                                            Comportamiento positivo para reconocer
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Categories and Details */}
                {currentStep === 3 && (
                    <div className="py-4 pl-6 border-l-4 border-blue-500">
                        <div className="flex items-center mb-6">
                            <div className="flex items-center justify-center w-8 h-8 mr-3 bg-blue-500 rounded-full">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800">
                                Detalles y Categorías
                            </h3>
                        </div>

                        <div className="mb-6">
                            <label className="block mb-3 text-sm font-medium text-gray-700">
                                Categorías Aplicables
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {categories.map((category) => (
                                    <label
                                        key={category.id}
                                        className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition ${
                                            formData.categories.includes(category.id)
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-300 hover:border-blue-300'
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={formData.categories.includes(category.id)}
                                            onChange={() => handleCategoryToggle(category.id)}
                                            className="mr-3"
                                        />
                                        <span className="text-sm text-gray-700">{category.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block mb-2 text-sm font-medium text-gray-700">
                                Descripción Detallada <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                placeholder="Describa la observación en detalle: qué vio, dónde, cuándo y cualquier otra información relevante..."
                                rows={6}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                )}

                {/* Step 4: Photo Evidence */}
                {currentStep === 4 && (
                    <div className="py-4 pl-6 border-l-4 border-blue-500">
                        <div className="flex items-center mb-6">
                            <div className="flex items-center justify-center w-8 h-8 mr-3 bg-blue-500 rounded-full">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800">
                                Evidencia Fotográfica
                            </h3>
                        </div>

                        <div className="mb-6">
                            <label className="block mb-2 text-sm font-medium text-gray-700">
                                Fotografías (Opcional)
                            </label>
                            <div className="p-12 text-center transition border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-blue-400">
                                <svg className="w-16 h-16 mx-auto mb-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <div className="mb-2 text-lg font-medium text-gray-700">Subir Fotografías</div>
                                <div className="text-sm text-gray-500">
                                    Haga clic para seleccionar o arrastre archivos aquí
                                </div>
                                <div className="mt-1 text-xs text-gray-400">
                                    Máximo 5 imágenes, 10MB cada una
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-6 mt-6 border-t">
                    <button
                        onClick={handlePrevious}
                        disabled={currentStep === 1}
                        className={`px-6 py-2 rounded-lg transition flex items-center ${
                            currentStep === 1
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Anterior
                    </button>

                    <div className="text-sm text-gray-500">
                        <span className="inline-flex items-center justify-center w-6 h-6 mr-1 text-white bg-blue-500 rounded-full">
                            {currentStep}
                        </span>
                        de 4 pasos
                    </div>

                    {currentStep < 4 ? (
                        <button
                            onClick={handleNext}
                            className="flex items-center px-6 py-2 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
                        >
                            Siguiente
                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    ) : (
                        <div className="flex gap-3">
                            <button
                                onClick={handleSaveDraft}
                                className="flex items-center px-6 py-2 transition bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                </svg>
                                Guardar Borrador
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="flex items-center px-6 py-2 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                                Enviar Observación
                            </button>
                        </div>
                    )}
                </div>

                {/* Auto-save indicator */}
                <div className="flex items-center justify-center pt-4 text-xs text-gray-400">
                    <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Autoguardado activado
                </div>
            </div>
        </div>
    );
};

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
                        <>
                            <SafetyObservationForm user={user} />
                            <EmptyState
                                message="Bienvenido al sistema de observaciones de seguridad de Wasion."
                                submessage="Próximamente podrás crear y ver tus observaciones desde aquí."
                            />
                        </>
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