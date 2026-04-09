import React, { useState, useRef, useEffect } from "react";
import { route } from "@/Utils/helpers";
import { IoMdShare } from "react-icons/io";

export default function EhsManagerHeader({ 
    user, 
    canViewAllPlants, 
    plants, 
    params, 
    handleFilterChange,
    setParams,
    isSyncing
}) {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const datePickerRef = useRef(null);

    // Close date picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (datePickerRef.current && !datePickerRef.current.contains(e.target)) {
                setShowDatePicker(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const hasDateFilter = params.date_from || params.date_to;

    const getDateLabel = () => {
        if (params.date_from && params.date_to) {
            return `${formatDateShort(params.date_from)} — ${formatDateShort(params.date_to)}`;
        }
        if (params.date_from) return `Desde ${formatDateShort(params.date_from)}`;
        if (params.date_to) return `Hasta ${formatDateShort(params.date_to)}`;
        return 'Todo el periodo';
    };

    const formatDateShort = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr + 'T00:00:00');
        return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const handlePreset = (preset) => {
        const today = new Date();
        let from = '';
        let to = today.toISOString().split('T')[0];

        switch (preset) {
            case 'today':
                from = to;
                break;
            case 'week': {
                const weekAgo = new Date(today);
                weekAgo.setDate(today.getDate() - 7);
                from = weekAgo.toISOString().split('T')[0];
                break;
            }
            case 'month': {
                const monthAgo = new Date(today);
                monthAgo.setMonth(today.getMonth() - 1);
                from = monthAgo.toISOString().split('T')[0];
                break;
            }
            case '3months': {
                const threeMonths = new Date(today);
                threeMonths.setMonth(today.getMonth() - 3);
                from = threeMonths.toISOString().split('T')[0];
                break;
            }
            case 'year': {
                from = `${today.getFullYear()}-01-01`;
                break;
            }
            case 'clear':
                from = '';
                to = '';
                break;
        }

        if (setParams) {
            setParams(prev => ({ ...prev, date_from: from, date_to: to }));
        }
        if (preset !== 'clear') {
            setShowDatePicker(false);
        }
    };

    return (
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div className="space-y-1">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    Dashboard EHS - {user.name}
                </h2>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center flex-wrap">
                    <p className="text-gray-500 dark:text-gray-400">
                        Estadísticas y Métricas de Seguridad
                    </p>
                    {canViewAllPlants && plants && plants.length > 0 && (
                        <div className="flex items-center gap-2 px-2 py-1 bg-blue-50/50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg animate-fade-in">
                            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                                Planta:
                            </span>
                            <select
                                name="plant_id"
                                value={params.plant_id}
                                onChange={handleFilterChange}
                                className="bg-transparent border-none text-sm font-bold text-blue-700 dark:text-blue-400 focus:ring-0 py-0 pl-1 pr-8 cursor-pointer hover:text-blue-800 transition-colors"
                            >
                                <option
                                    value=""
                                    className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                >
                                    Todas las Plantas
                                </option>
                                {plants.map((plant) => (
                                    <option
                                        key={plant.id}
                                        value={plant.id}
                                        className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                    >
                                        {plant.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Date Range Filter */}
                    <div className="relative" ref={datePickerRef}>
                        <button
                            onClick={() => setShowDatePicker(!showDatePicker)}
                            className={`flex items-center gap-2 px-2.5 py-1 border rounded-lg text-sm font-medium transition-all cursor-pointer hover:shadow-md ${
                                hasDateFilter
                                    ? 'bg-purple-50/50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-400'
                                    : 'bg-gray-50/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-purple-300 dark:hover:border-purple-600'
                            }`}
                        >
                            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
                                {getDateLabel()}
                            </span>
                            {hasDateFilter && (
                                <span
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handlePreset('clear');
                                    }}
                                    className="ml-1 w-4 h-4 flex items-center justify-center rounded-full bg-purple-200 dark:bg-purple-700 text-purple-700 dark:text-purple-200 hover:bg-purple-300 dark:hover:bg-purple-600 transition-colors text-xs leading-none cursor-pointer"
                                    title="Limpiar filtro de fecha"
                                >
                                    ×
                                </span>
                            )}
                        </button>

                        {/* Date Picker Dropdown */}
                        {showDatePicker && (
                            <div className="absolute left-0 top-full mt-2 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl p-4 w-[320px] animate-fade-in">
                                {/* Quick Presets */}
                                <div className="mb-3">
                                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                        Atajos rápidos
                                    </p>
                                    <div className="grid grid-cols-3 gap-1.5">
                                        {[
                                            { key: 'today', label: 'Hoy' },
                                            { key: 'week', label: '7 días' },
                                            { key: 'month', label: '30 días' },
                                            { key: '3months', label: '3 meses' },
                                            { key: 'year', label: 'Este año' },
                                            { key: 'clear', label: 'Todo' },
                                        ].map(({ key, label }) => (
                                            <button
                                                key={key}
                                                onClick={() => handlePreset(key)}
                                                className={`px-2 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                                                    key === 'clear'
                                                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                                        : 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/50'
                                                }`}
                                            >
                                                {label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 dark:border-gray-700 pt-3">
                                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                        Rango personalizado
                                    </p>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2">
                                            <label className="text-xs text-gray-500 dark:text-gray-400 w-12 shrink-0">Desde</label>
                                            <input
                                                type="date"
                                                name="date_from"
                                                value={params.date_from}
                                                onChange={handleFilterChange}
                                                max={params.date_to || undefined}
                                                className="flex-1 px-2.5 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <label className="text-xs text-gray-500 dark:text-gray-400 w-12 shrink-0">Hasta</label>
                                            <input
                                                type="date"
                                                name="date_to"
                                                value={params.date_to}
                                                onChange={handleFilterChange}
                                                min={params.date_from || undefined}
                                                className="flex-1 px-2.5 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap w-full gap-3 md:w-auto">
                <div className={`flex items-center justify-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 border rounded-full shadow-sm transition-all ${isSyncing ? 'border-orange-200 dark:border-orange-800 ring-2 ring-orange-100 dark:ring-orange-900/30' : 'border-blue-200 dark:border-blue-700'}`}>
                    <span className="relative flex w-2.5 h-2.5">
                        <span className={`absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping ${isSyncing ? 'bg-orange-400' : 'bg-blue-400'}`}></span>
                        <span className={`relative inline-flex w-2.5 h-2.5 rounded-full ${isSyncing ? 'bg-orange-600' : 'bg-blue-600'}`}></span>
                    </span>
                    <span className={`text-xs font-bold tracking-wide uppercase transition-colors ${isSyncing ? 'text-orange-700 dark:text-orange-400' : 'text-blue-700 dark:text-blue-400'}`}>
                        {isSyncing ? 'Actualizando...' : 'Sincronizado'}
                    </span>
                </div>
                <a
                    href={route("observations.export.csv", params)}
                    target="_blank"
                    className="px-4 py-2 bg-green-700 text-white rounded-lg text-sm font-medium hover:bg-green-800 flex items-center justify-center transition-all active:scale-95 shadow-sm"
                >
                    <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                    </svg>
                    CSV
                </a>
                <a
                    href={route("observations.export.pdf", params)}
                    target="_blank"
                    className="px-4 py-2 bg-[#1e3a8a] text-white rounded-lg text-sm font-medium hover:bg-blue-900 flex items-center justify-center transition-all active:scale-95 shadow-sm"
                >
                    <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                    </svg>
                    PDF
                </a>
                {canViewAllPlants && (
                    <button
                        onClick={() => {
                            const section = document.getElementById('recent-observations-table');
                            section?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 flex items-center justify-center transition-all active:scale-95 shadow-sm"
                    >
                        <IoMdShare className="w-4 h-4 mr-2" />
                        Compartir Reporte
                    </button>
                )}
            </div>
        </div>
    );
}
