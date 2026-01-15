import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useState, useMemo } from "react";
import DrillDownModal from "@/Components/Dashboard/DrillDownModal";
import ObservationDetailsModal from "@/Components/Dashboard/ObservationDetailsModal";
import axios from "axios";

export default function History({ auth, history, areas, filters }) {
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [employeeObservations, setEmployeeObservations] = useState([]);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);
    const [selectedObservation, setSelectedObservation] = useState(null);

    const { data, setData, get, processing } = useForm({
        start_date: filters.start_date || "",
        end_date: filters.end_date || "",
        area_id: filters.area_id || "",
        search: filters.search || "",
    });

    const handleFilter = (e) => {
        e.preventDefault();
        get(route("participation.history"), {
            preserveState: true,
            replace: true,
        });
    };

    const handleReset = () => {
        setData({
            start_date: "",
            end_date: "",
            area_id: "",
            search: "",
        });
        get(route("participation.history"));
    };

    const fetchDetails = async (employee) => {
        setSelectedEmployee(employee);
        setIsLoadingDetails(true);
        try {
            const response = await axios.get(
                route("participation.observations", {
                    user: employee.id,
                    start_date: data.start_date,
                    end_date: data.end_date,
                })
            );
            setEmployeeObservations(response.data);
        } catch (error) {
            console.error("Error fetching details:", error);
        } finally {
            setIsLoadingDetails(false);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Historial de Participación
                    </h2>
                    <Link
                        href={route("dashboard")}
                        className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                    >
                        Volver al Dashboard
                    </Link>
                </div>
            }
        >
            <Head title="Historial de Participación" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Filtros */}
                    <div className="p-6 mb-6 bg-white overflow-hidden shadow-sm sm:rounded-lg dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                        <form
                            onSubmit={handleFilter}
                            className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end"
                        >
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                                    Inicio
                                </label>
                                <input
                                    type="date"
                                    value={data.start_date}
                                    onChange={(e) =>
                                        setData("start_date", e.target.value)
                                    }
                                    className="w-full text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md shadow-sm focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                                    Fin
                                </label>
                                <input
                                    type="date"
                                    value={data.end_date}
                                    onChange={(e) =>
                                        setData("end_date", e.target.value)
                                    }
                                    className="w-full text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md shadow-sm focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                                    Planta / Área
                                </label>
                                <select
                                    value={data.area_id}
                                    onChange={(e) =>
                                        setData("area_id", e.target.value)
                                    }
                                    className="w-full text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md shadow-sm focus:ring-blue-500"
                                >
                                    <option value="">Todas las áreas</option>
                                    {areas.map((area) => (
                                        <option key={area.id} value={area.id}>
                                            {area.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                                    Empleado / Nómina
                                </label>
                                <input
                                    type="text"
                                    placeholder="Nombre o nómina..."
                                    value={data.search}
                                    onChange={(e) =>
                                        setData("search", e.target.value)
                                    }
                                    className="w-full text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md shadow-sm focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-150 ease-in-out disabled:opacity-50"
                                >
                                    Filtrar
                                </button>
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-bold py-2 px-4 rounded-md transition duration-150 ease-in-out"
                                >
                                    Limpiar
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Tabla de Resultados */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300 font-bold">
                                    <tr>
                                        <th className="px-6 py-4">Empleado</th>
                                        <th className="px-6 py-4">Área</th>
                                        <th className="px-6 py-4 text-center">
                                            Reportes en Periodo
                                        </th>
                                        <th className="px-6 py-4 text-right">
                                            Acción
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {history.data.length > 0 ? (
                                        history.data.map((row) => (
                                            <tr
                                                key={row.email}
                                                className="hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-colors"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-gray-900 dark:text-gray-100">
                                                        {row.name}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {row.email}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 dark:text-gray-300">
                                                    {row.area}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span
                                                        className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold ${
                                                            row.count > 0
                                                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                                : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                                                        }`}
                                                    >
                                                        {row.count}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        disabled={row.count === 0}
                                                        onClick={() => fetchDetails(row)}
                                                        className={`text-xs font-bold transition-colors ${
                                                            row.count > 0
                                                                ? "text-blue-600 dark:text-blue-400 hover:text-blue-800"
                                                                : "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                                                        }`}
                                                    >
                                                        {isLoadingDetails && selectedEmployee?.id === row.id 
                                                            ? "Cargando..." 
                                                            : "Ver Detalles"}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="4"
                                                className="px-6 py-10 text-center text-gray-500 italic"
                                            >
                                                No se encontraron registros en
                                                este periodo.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Paginación simple */}
                        {history.links && history.links.length > 3 && (
                            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex justify-center gap-1">
                                {history.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url}
                                        className={`px-3 py-1 text-sm rounded-md transition-colors ${
                                            link.active
                                                ? "bg-blue-600 text-white font-bold"
                                                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        } ${!link.url ? "opacity-30 cursor-not-allowed" : ""}`}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal de Lista de Observaciones */}
            <DrillDownModal
                show={!!selectedEmployee}
                onClose={() => setSelectedEmployee(null)}
                title={`Reportes de ${selectedEmployee?.name}`}
                data={employeeObservations}
                type="total" // Usamos total para mostrar la lista estándar de observaciones
                onItemClick={(obs) => setSelectedObservation(obs)}
            />

            {/* Modal de Detalle de Observación Individual */}
            <ObservationDetailsModal
                isOpen={!!selectedObservation}
                onClose={() => setSelectedObservation(null)}
                observation={selectedObservation}
            />
        </AuthenticatedLayout>
    );
}
