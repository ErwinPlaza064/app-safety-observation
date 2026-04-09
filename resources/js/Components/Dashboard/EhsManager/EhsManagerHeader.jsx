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
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between mb-8">
            <div className="space-y-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        Dashboard EHS
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">
                        {user.name} — Estadísticas y Métricas de Seguridad
                    </p>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                    {canViewAllPlants && plants && plants.length > 0 && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50/50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl shadow-sm hover:shadow-md transition-all">
                            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                                Planta
                            </span>
                            <div className="h-4 w-[1px] bg-blue-200 dark:bg-blue-800 mx-1"></div>
                            <select
                                name="plant_id"
                                value={params.plant_id}
                                onChange={handleFilterChange}
                                className="bg-transparent border-none text-sm font-bold text-blue-700 dark:text-blue-300 focus:ring-0 py-0 pl-1 pr-8 cursor-pointer"
                            >
                                <option value="" className="bg-white dark:bg-gray-800">Todas las Plantas</option>
                                {plants.map((plant) => (
                                    <option key={plant.id} value={plant.id} className="bg-white dark:bg-gray-800">
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
                            className={`flex items-center gap-2 px-3 py-2 border rounded-xl text-sm font-semibold transition-all cursor-pointer shadow-sm hover:shadow-md ${
                                hasDateFilter
                                    ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300'
                                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                            }`}
                        >
                            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-xs uppercase tracking-wider whitespace-nowrap">
                                {getDateLabel()}
                            </span>
                            {hasDateFilter && (
                                <span
                                    onClick={(e) => { e.stopPropagation(); handlePreset('clear'); }}
                                    className="ml-1 w-4 h-4 flex items-center justify-center rounded-full bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200 hover:bg-purple-300 transition-colors"
                                >
                                    ×
                                </span>
                            )}
                        </button>

                        {/* Date Picker Dropdown */}
                        {showDatePicker && (
                            <div className="absolute left-0 lg:right-0 lg:left-auto top-full mt-2 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl p-4 w-[320px] animate-in fade-in slide-in-from-top-2 duration-200">
                                {/* Quick Presets */}
                                <div className="mb-4">
                                    <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">
                                        Atajos rápidos
                                    </p>
                                    <div className="grid grid-cols-3 gap-2">
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
                                                className={`px-2 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                                                    key === 'clear'
                                                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                                                        : 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-800/50'
                                                }`}
                                            >
                                                {label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                                    <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">
                                        Rango personalizado
                                    </p>
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center gap-3">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase w-10">Desde</label>
                                            <input
                                                type="date"
                                                name="date_from"
                                                value={params.date_from || ""}
                                                onChange={handleFilterChange}
                                                className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-bold text-gray-800 dark:text-gray-200 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                                            />
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase w-10">Hasta</label>
                                            <input
                                                type="date"
                                                name="date_to"
                                                value={params.date_to || ""}
                                                onChange={handleFilterChange}
                                                className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-bold text-gray-800 dark:text-gray-200 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className={`flex items-center gap-2.5 px-4 py-2 bg-white dark:bg-gray-800 border rounded-full shadow-sm transition-all ${isSyncing ? 'border-orange-200 dark:border-orange-800 ring-4 ring-orange-50 dark:ring-orange-900/10' : 'border-blue-100 dark:border-blue-900'}`}>
                    <span className="relative flex w-2 h-2">
                        <span className={`absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping ${isSyncing ? 'bg-orange-400' : 'bg-blue-400'}`}></span>
                        <span className={`relative inline-flex w-2 h-2 rounded-full ${isSyncing ? 'bg-orange-600' : 'bg-blue-600'}`}></span>
                    </span>
                    <span className={`text-[10px] font-black tracking-widest uppercase transition-colors ${isSyncing ? 'text-orange-700 dark:text-orange-400' : 'text-blue-700 dark:text-blue-400'}`}>
                        {isSyncing ? 'Actualizando...' : 'Sincronizado'}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <a
                        href={route("observations.export.csv", params)}
                        target="_blank"
                        className="p-2.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-800 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/40 transition-all active:scale-95 shadow-sm group"
                        title="Exportar CSV"
                    >
                        <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </a>
                    <a
                        href={route("observations.export.pdf", params)}
                        target="_blank"
                        className="p-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-800 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all active:scale-95 shadow-sm group"
                        title="Exportar PDF"
                    >
                        <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                    </a>
                    
                    {canViewAllPlants && (
                        <button
                            onClick={() => {
                                const section = document.getElementById('recent-observations-table');
                                section?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-bold hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-500/25 transition-all active:scale-95 shadow-md group"
                        >
                            <IoMdShare className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                            <span>Compartir</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
