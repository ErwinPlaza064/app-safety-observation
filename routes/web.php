<?php
// use App\Http\Controllers\SafetyObservationController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ObservationController;


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

Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    Route::patch('/users/{user}', [App\Http\Controllers\Admin\UserManagementController::class, 'update'])->name('users.update');
    Route::delete('/users/{user}', [App\Http\Controllers\Admin\UserManagementController::class, 'destroy'])->name('users.destroy');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('observations')->name('observations.')->group(function () {
        Route::get('/', [ObservationController::class, 'index'])->name('index');
        Route::post('/', [ObservationController::class, 'store'])->name('store');
        Route::post('/draft', [ObservationController::class, 'draft'])->name('draft');
        Route::get('/{observation}', [ObservationController::class, 'show'])->name('show');
        Route::delete('/{observation}', [ObservationController::class, 'destroy'])->name('destroy');
    });

    Route::get('/observations/export/csv', [ObservationController::class, 'exportCsv'])->name('observations.export.csv');

    Route::put('/observations/{observation}/close', [ObservationController::class, 'close'])->name('observations.close');

    Route::get('/observations/export/pdf', [ObservationController::class, 'exportPdf'])->name('observations.export.pdf');

    Route::put('/observations/{observation}', [ObservationController::class, 'update'])->name('observations.update');

    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');


    Route::prefix('observations')->name('observations.')->group(function () {

        Route::post('/', [ObservationController::class, 'store'])->name('store');
        Route::post('/draft', [ObservationController::class, 'draft'])->name('draft');

        Route::get('/{observation}', [ObservationController::class, 'show'])->name('show');

        Route::delete('/{observation}', [ObservationController::class, 'destroy'])
            ->name('destroy');
    });

    Route::middleware('can:manage,App\Models\Observation')->group(function () {

        Route::get('/observations', [ObservationController::class, 'index'])
            ->name('observations.index');

        Route::post('/observations/{observation}/close', [ObservationController::class, 'close'])
            ->name('observations.close');

        Route::post('/observations/{observation}/reopen', [ObservationController::class, 'reopen'])
            ->name('observations.reopen');
    });
});


require __DIR__.'/auth.php';
