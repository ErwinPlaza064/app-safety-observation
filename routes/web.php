<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ObservationController;
use App\Http\Controllers\Admin\UserManagementController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Mail;

Route::get('/', function () {
    return redirect()->route('login');
});

Route::get('/test-email', function () {
    try {
        Mail::raw('Hola, si lees esto, la conexión SMTP funciona correctamente desde XAMPP.', function ($message) {
            $message->to('erwin.martinez@wasionmx.onmicrosoft.com')
                    ->subject('Prueba de Conexión SMTP Wasion');
        });

        return 'El correo se envió correctamente (o al menos Laravel lo entregó al servidor SMTP). Revisa tu bandeja.';
    } catch (\Exception $e) {
        return 'Error al enviar el correo: ' . $e->getMessage();
    }
});

Route::middleware(['auth', 'prevent-back-history'])->group(function () {



    // --- DASHBOARD ---
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->middleware(['verified']) // Si usas verificación de email
        ->name('dashboard');

    // --- PERFIL DE USUARIO ---
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');



    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // --- ADMINISTRACIÓN DE USUARIOS (Super Admin) ---
    Route::middleware(['verified'])->prefix('admin')->name('admin.')->group(function () {
        Route::post('/users', [App\Http\Controllers\Admin\UserManagementController::class, 'store'])->name('users.store');
        Route::patch('/users/{user}', [UserManagementController::class, 'update'])->name('users.update');
        Route::delete('/users/{user}', [UserManagementController::class, 'destroy'])->name('users.destroy');
        Route::post('/users/{user}/resend-verification', [UserManagementController::class, 'resendVerification'])
        ->name('users.resend-verification');
    });

    // --- OBSERVACIONES (Rutas limpias y agrupadas) ---
    Route::prefix('observations')->name('observations.')->group(function () {

        // CRUD Básico
        Route::get('/', [ObservationController::class, 'index'])->name('index');
        Route::post('/', [ObservationController::class, 'store'])->name('store');       // Crear nuevo
        Route::put('/{observation}', [ObservationController::class, 'update'])->name('update'); // Actualizar existente
        Route::delete('/{observation}', [ObservationController::class, 'destroy'])->name('destroy');

        // Acciones Específicas
        Route::post('/draft', [ObservationController::class, 'draft'])->name('draft');
        Route::get('/export/csv', [ObservationController::class, 'exportCsv'])->name('export.csv');
        Route::get('/export/pdf', [ObservationController::class, 'exportPdf'])->name('export.pdf');

        Route::get('/{observation}', [ObservationController::class, 'show'])->name('show');
        Route::put('/{observation}/close', [ObservationController::class, 'close'])->name('close');
        Route::post('/{observation}/reopen', [ObservationController::class, 'reopen'])->name('reopen');
    });

});

require __DIR__.'/auth.php';
