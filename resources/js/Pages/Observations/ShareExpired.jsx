import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function ShareExpired() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 dark:bg-gray-900">
            <Head title="Enlace Expirado" />
            
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="p-3 bg-red-100 rounded-full dark:bg-red-900/30">
                        <svg className="w-12 h-12 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                    Enlace Expirado
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                    Este reporte ya no está disponible públicamente por seguridad.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                    <div className="space-y-6">
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                            <p className="mb-4">
                                Los enlaces de reportes compartidos tienen una vigencia de <strong>7 días</strong>. Esto es parte de nuestra política de protección de datos de seguridad.
                            </p>
                            <div className="bg-blue-50 p-4 rounded-lg dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 text-xs">
                                <p className="font-bold mb-1">¿Cómo ver este reporte?</p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Si eres personal EHS, inicia sesión para verlo.</li>
                                    <li>Si no tienes cuenta, solicita un nuevo enlace a la persona que te compartió el reporte original.</li>
                                </ul>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <Link
                                href={route('login')}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            >
                                Iniciar Sesión
                            </Link>
                            <Link
                                href="/"
                                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 transition-colors"
                            >
                                Ir al Inicio
                            </Link>
                        </div>
                    </div>
                </div>
                
                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        © {new Date().getFullYear()} Wasion Safety Observations. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </div>
    );
}
