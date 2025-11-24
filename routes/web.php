<?php
use App\Http\Controllers\SafetyObservationController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('login');
});

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Rutas de administración (solo Super Admin)
Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    Route::patch('/users/{user}', [App\Http\Controllers\Admin\UserManagementController::class, 'update'])->name('users.update');
    Route::delete('/users/{user}', [App\Http\Controllers\Admin\UserManagementController::class, 'destroy'])->name('users.destroy');
});

// Rutas para observaciones de seguridad
Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('safety-observations')->name('safety-observations.')->group(function () {
        Route::get('/', [SafetyObservationController::class, 'index'])->name('index');
        Route::post('/draft', [SafetyObservationController::class, 'saveDraft'])->name('draft');
        Route::post('/submit', [SafetyObservationController::class, 'submit'])->name('submit');
        Route::get('/{observation}', [SafetyObservationController::class, 'show'])->name('show');
        Route::delete('/{observation}', [SafetyObservationController::class, 'destroy'])->name('destroy');
    });

    // Rutas para EHS Managers - Ver todas las observaciones
    Route::get('/ehs/observations', [SafetyObservationController::class, 'ehsIndex'])
        ->name('ehs.observations');
});

require __DIR__.'/auth.php'; 