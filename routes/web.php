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

// Backup trigger endpoint (TEMPORARY - REMOVE AUTH FOR TESTING)
Route::get('/trigger-backup', function () {
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

// TEMPORARY - TLS Diagnostic endpoint
Route::get('/debug-tls', function () {
    $r2Endpoint = env('R2_ENDPOINT', 'NOT SET');

    $info = [
        'php_version' => PHP_VERSION,
        'openssl_version' => defined('OPENSSL_VERSION_TEXT') ? OPENSSL_VERSION_TEXT : 'N/A',
        'curl_version' => curl_version(),
        'env' => [
            'OPENSSL_CONF' => getenv('OPENSSL_CONF') ?: '(not set)',
            'SSL_CERT_FILE' => getenv('SSL_CERT_FILE') ?: '(not set)',
            'CURL_CA_BUNDLE' => getenv('CURL_CA_BUNDLE') ?: '(not set)',
        ],
        'r2_endpoint' => $r2Endpoint,
        'openssl_cnf_exists' => file_exists('/app/openssl-custom.cnf'),
        'openssl_cnf_contents' => file_exists('/app/openssl-custom.cnf') ? file_get_contents('/app/openssl-custom.cnf') : 'FILE NOT FOUND',
    ];

    // Test 1: Raw PHP curl with SECLEVEL=0
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $r2Endpoint);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_NOBODY, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    curl_setopt($ch, CURLOPT_SSLVERSION, CURL_SSLVERSION_TLSv1_2);
    curl_setopt($ch, CURLOPT_SSL_CIPHER_LIST, 'DEFAULT@SECLEVEL=0');

    $verbose = fopen('php://temp', 'w+');
    curl_setopt($ch, CURLOPT_STDERR, $verbose);
    curl_setopt($ch, CURLOPT_VERBOSE, true);

    curl_exec($ch);
    $info['test_seclevel0'] = [
        'error' => curl_error($ch),
        'errno' => curl_errno($ch),
        'http_code' => curl_getinfo($ch, CURLINFO_HTTP_CODE),
    ];
    rewind($verbose);
    $info['test_seclevel0']['verbose'] = stream_get_contents($verbose);
    curl_close($ch);
    fclose($verbose);

    // Test 2: Raw PHP curl with DEFAULT ciphers (no SECLEVEL override)
    $ch2 = curl_init();
    curl_setopt($ch2, CURLOPT_URL, $r2Endpoint);
    curl_setopt($ch2, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch2, CURLOPT_NOBODY, true);
    curl_setopt($ch2, CURLOPT_TIMEOUT, 10);

    $verbose2 = fopen('php://temp', 'w+');
    curl_setopt($ch2, CURLOPT_STDERR, $verbose2);
    curl_setopt($ch2, CURLOPT_VERBOSE, true);

    curl_exec($ch2);
    $info['test_default'] = [
        'error' => curl_error($ch2),
        'errno' => curl_errno($ch2),
        'http_code' => curl_getinfo($ch2, CURLINFO_HTTP_CODE),
    ];
    rewind($verbose2);
    $info['test_default']['verbose'] = stream_get_contents($verbose2);
    curl_close($ch2);
    fclose($verbose2);

    // Test 3: Try connecting to a known-good HTTPS endpoint
    $ch3 = curl_init();
    curl_setopt($ch3, CURLOPT_URL, 'https://cloudflare.com');
    curl_setopt($ch3, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch3, CURLOPT_NOBODY, true);
    curl_setopt($ch3, CURLOPT_TIMEOUT, 10);

    curl_exec($ch3);
    $info['test_cloudflare_com'] = [
        'error' => curl_error($ch3),
        'errno' => curl_errno($ch3),
        'http_code' => curl_getinfo($ch3, CURLINFO_HTTP_CODE),
    ];
    curl_close($ch3);

    // Test 4: Check if CA certificates exist
    $caPaths = [
        '/etc/ssl/certs/ca-certificates.crt',
        '/etc/ssl/certs/ca-bundle.crt',
        '/etc/pki/tls/certs/ca-bundle.crt',
    ];
    foreach ($caPaths as $p) {
        $info['ca_files'][$p] = file_exists($p) ? filesize($p) . ' bytes' : 'NOT FOUND';
    }

    return response()->json($info, 200, [], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
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
