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

// Backup trigger endpoint (Protected: Only superadmin@wasion.com)
Route::get('/trigger-backup', function () {
    if (!Auth::check() || Auth::user()->email !== 'superadmin@wasion.com') {
        return response()->json([
            'status' => 'error',
            'message' => 'Acceso denegado. Solo el super administrador puede ejecutar respaldos manually.'
        ], 403);
    }

    try {
        \Illuminate\Support\Facades\Artisan::call('backup:run', ['--disable-notifications' => true]);
        $output = \Illuminate\Support\Facades\Artisan::output();

        return response()->json([
            'status' => 'success',
            'message' => 'Backup completed successfully',
            'output' => $output
        ], 200);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => 'Backup failed',
            'error' => $e->getMessage()
        ], 500);
    }
});

// Restore backup endpoint (Protected: Only superadmin@wasion.com)
Route::post('/restore-backup', function (Illuminate\Http\Request $request) {
    if (!Auth::check() || Auth::user()->email !== 'superadmin@wasion.com') {
        return response()->json([
            'status' => 'error',
            'message' => 'Acceso denegado. Solo el super administrador puede restaurar respaldos.'
        ], 403);
    }

    $request->validate([
        'backup_zip' => 'required|file|mimes:zip',
    ]);

    $file = $request->file('backup_zip');
    $zipPath = $file->storeAs('temp-restores', 'upload_' . uniqid() . '.zip', 'local');
    $absoluteZipPath = storage_path('app/' . $zipPath);
    $extractTo = storage_path('app/temp-restores/extracted_' . uniqid());

    try {
        // 1. Extraer ZIP
        $zip = new \ZipArchive();
        if ($zip->open($absoluteZipPath) === true) {
            $zip->extractTo($extractTo);
            $zip->close();
        } else {
            throw new \Exception('No se pudo abrir o leer el archivo ZIP de respaldo.');
        }

        // 2. Restaurar Base de Datos (MySQL)
        $dumpFiles = glob($extractTo . '/db-dumps/*.sql');
        if (!empty($dumpFiles)) {
            $sqlFile = $dumpFiles[0];
            
            $host = config('database.connections.mysql.host', '127.0.0.1');
            $port = config('database.connections.mysql.port', '3306');
            $database = config('database.connections.mysql.database');
            $username = config('database.connections.mysql.username');
            $password = config('database.connections.mysql.password');
            
            $mysqlPath = config('database.connections.mysql.dump.dump_binary_path') 
                            ? config('database.connections.mysql.dump.dump_binary_path') . DIRECTORY_SEPARATOR . 'mysql'
                            : 'mysql';

            // MySQL expects password without space after -p if passed inline, but Process with array is safer
            $command = [
                $mysqlPath,
                '-h', $host,
                '-P', $port,
                '-u', $username,
            ];
            
            if (!empty($password)) {
                 $command[] = '--password=' . $password;
            }
            $command[] = $database;

            // Para redirigir la entrada de archivo en Process de Symfony, pasamos el contenido o usamos shell si es complicado
            $process = \Symfony\Component\Process\Process::fromShellCommandline(
                implode(' ', array_map('escapeshellarg', $command)) . ' < ' . escapeshellarg($sqlFile)
            );
            $process->setTimeout(600);
            $process->run();

            if (!$process->isSuccessful()) {
                throw new \Exception('Error restaurando la BD: ' . $process->getErrorOutput());
            }
        }

        // 3. Restaurar Archivos de la carpeta public (observaciones, etc)
        $appStorageSource = $extractTo . '/storage/app/public';
        if (\Illuminate\Support\Facades\File::exists($appStorageSource)) {
            \Illuminate\Support\Facades\File::copyDirectory($appStorageSource, storage_path('app/public'));
        }
        
        // 4. Limpieza del ZIP y los extraídos
        \Illuminate\Support\Facades\File::deleteDirectory($extractTo);
        \Illuminate\Support\Facades\Storage::disk('local')->delete($zipPath);

        return response()->json([
            'status' => 'success',
            'message' => 'El sistema y la base de datos se han restaurado exitosamente.'
        ], 200);
        
    } catch (\Exception $e) {
         if (\Illuminate\Support\Facades\File::exists($extractTo)) {
             \Illuminate\Support\Facades\File::deleteDirectory($extractTo);
         }
         if (\Illuminate\Support\Facades\Storage::disk('local')->exists($zipPath)) {
             \Illuminate\Support\Facades\Storage::disk('local')->delete($zipPath);
         }
             
        return response()->json([
            'status' => 'error',
            'message' => $e->getMessage()
        ], 500);
    }
});


Route::get('/', function () {
    return redirect()->route('login');
});


// Ruta pública para ver reportes compartidos
Route::get('/observations/{observation:uuid}', [App\Http\Controllers\ObservationController::class, 'show'])
    ->name('observations.show');

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

        // Movido fuera para permitir ver reportes compartidos sin logearse
        // Route::get('/{observation}', [ObservationController::class, 'show'])->name('show');
        Route::put('/{observation}/close', [ObservationController::class, 'close'])
            ->name('close');
        Route::post('/{observation}/reopen', [ObservationController::class, 'reopen'])
            ->name('reopen');
    });

    Route::get('/participation/history', [ParticipationController::class, 'history'])
        ->middleware(['verified'])
        ->name('participation.history');

    Route::get('/participation/observations/{user}', [ParticipationController::class, 'observations'])
        ->middleware(['verified'])
        ->name('participation.observations');
});

require __DIR__ . '/auth.php';
