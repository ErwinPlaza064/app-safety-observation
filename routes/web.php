<?php

use App\Http\Controllers\Admin\AreaController;
use App\Http\Controllers\Admin\PlantController;
use App\Http\Controllers\Admin\UserManagementController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ObservationController;
use App\Http\Controllers\ParticipationController;
use App\Http\Controllers\ProfileController;
use App\Services\MicrosoftGraphMailer;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Mail;

// Health check endpoint for Railway
Route::get('/health', function () {
    return response()->json(['status' => 'ok', 'timestamp' => now()->toIso8601String()], 200);
});

Route::get('/', function () {
    return redirect()->route('login');
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
    Route::middleware(['verified', 'role:super_admin'])->prefix('admin')->name('admin.')->group(function () {
        Route::post('/users', [UserManagementController::class, 'store'])->name('users.store');
        Route::patch('/users/{user}', [UserManagementController::class, 'update'])->name('users.update');
        Route::delete('/users/{user}', [UserManagementController::class, 'destroy'])->name('users.destroy');
        Route::post('/users/{user}/resend-verification', [UserManagementController::class, 'resendVerification'])
            ->name('users.resend-verification');
        Route::post('/users/{user}/manual-verify', [UserManagementController::class, 'manualVerify'])
            ->name('users.manual-verify');
        Route::post('/users/{user}/toggle-suspension', [UserManagementController::class, 'toggleSuspension'])
            ->name('users.toggle-suspension');
        Route::post('/users/import', [UserManagementController::class, 'import'])->name('users.import');
        Route::get('/users/template', [UserManagementController::class, 'downloadTemplate'])->name('users.template');
    });

    // --- ADMINISTRACIÓN DE PLANTAS (Super Admin) ---
    Route::middleware(['verified', 'role:super_admin'])->prefix('admin/plants')->name('admin.plants.')->group(function () {
        Route::post('/', [PlantController::class, 'store'])->name('store');
        Route::put('/{plant}', [PlantController::class, 'update'])->name('update');
        Route::post('/{plant}/toggle-status', [PlantController::class, 'toggleStatus'])->name('toggle-status');
        Route::delete('/{plant}', [PlantController::class, 'destroy'])->name('destroy');
    });

    // --- ADMINISTRACIÓN DE ÁREAS (Super Admin) ---
    Route::middleware(['verified', 'role:super_admin'])->prefix('admin/areas')->name('areas.')->group(function () {
        Route::post('/', [AreaController::class, 'store'])->name('store');
        Route::put('/{area}', [AreaController::class, 'update'])->name('update');
        Route::post('/{area}/toggle-status', [AreaController::class, 'toggleStatus'])->name('toggle-status');
        Route::delete('/{area}', [AreaController::class, 'destroy'])->name('destroy');
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
        Route::get('/export/csv', [ObservationController::class, 'exportCsv'])
            ->middleware('role:super_admin,ehs_manager,ehs_coordinator')
            ->name('export.csv');
        Route::get('/export/pdf', [ObservationController::class, 'exportPdf'])
            ->middleware('role:super_admin,ehs_manager,ehs_coordinator')
            ->name('export.pdf');

        Route::get('/{observation}', [ObservationController::class, 'show'])->name('show');
        Route::put('/{observation}/close', [ObservationController::class, 'close'])
            ->middleware('role:super_admin,ehs_manager,ehs_coordinator')
            ->name('close');
        Route::post('/{observation}/reopen', [ObservationController::class, 'reopen'])
            ->middleware('role:super_admin,ehs_manager,ehs_coordinator')
            ->name('reopen');
    });

    Route::get('/participation/history', [ParticipationController::class, 'history'])
        ->middleware(['verified'])
        ->name('participation.history');

    Route::get('/participation/observations/{user}', [ParticipationController::class, 'observations'])
        ->middleware(['verified'])
        ->name('participation.observations');
});

Route::get('/test-graph-final', function () {
    try {
        Mail::raw('¡Funciona! Este es un correo de prueba enviado vía Microsoft Graph API desde Laravel.', function ($message) {
            $message->to('erwin.martinez@wasionmx.onmicrosoft.com')
                ->subject('✅ Prueba Final Microsoft Graph');
        });
        return "Correo enviado exitosamente. Revisa tu bandeja de entrada.";
    } catch (\Exception $e) {
        return "Error: " . $e->getMessage();
    }
});

require __DIR__ . '/auth.php';
