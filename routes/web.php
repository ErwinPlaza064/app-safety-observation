<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ObservationController;
use App\Http\Controllers\ParticipationController;
use App\Http\Controllers\Admin\UserManagementController;
use App\Http\Controllers\Admin\AreaController;
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

Route::get('/test-email', function () {
    $recipient = 'erwin.martinez@wasionmx.onmicrosoft.com';
    $startTime = microtime(true);

    try {
        // Configuración actual
        $config = [
            'Mailer' => config('mail.default'),
            'Host' => config('mail.mailers.smtp.host'),
            'Port' => config('mail.mailers.smtp.port'),
            'Encryption' => config('mail.mailers.smtp.encryption'),
            'From' => config('mail.from.address'),
            'From Name' => config('mail.from.name'),
        ];

        Mail::raw(
            '✅ Este es un correo de prueba enviado desde el Sistema de Observaciones de Seguridad de Wasion.' . "\n\n" .
                '📧 Remitente: ' . config('mail.from.address') . "\n" .
                '📬 Destinatario: ' . $recipient . "\n" .
                '🕐 Fecha y hora: ' . now()->format('d/m/Y H:i:s') . "\n\n" .
                'Si recibes este mensaje, la configuración SMTP está funcionando correctamente.',
            function ($message) use ($recipient) {
                $message->to($recipient)
                    ->subject('✅ Prueba de Correo - Wasion Safety Observation')
                    ->priority(1);
            }
        );

        $endTime = microtime(true);
        $duration = round(($endTime - $startTime) * 1000, 2);

        return response()->json([
            'success' => true,
            'message' => '✅ Correo enviado exitosamente',
            'details' => [
                'recipient' => $recipient,
                'sent_at' => now()->format('d/m/Y H:i:s'),
                'duration_ms' => $duration,
                'configuration' => $config,
            ],
            'instructions' => [
                '1. Revisa tu bandeja de entrada: ' . $recipient,
                '2. Si no está ahí, revisa SPAM/Correo no deseado',
                '3. Si está en spam, márcalo como "No es spam"',
                '4. Agrega observacionwasion@gmail.com a tus contactos seguros',
            ]
        ], 200, [], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    } catch (\Exception $e) {
        $endTime = microtime(true);
        $duration = round(($endTime - $startTime) * 1000, 2);

        return response()->json([
            'success' => false,
            'message' => '❌ Error al enviar el correo',
            'error' => $e->getMessage(),
            'details' => [
                'recipient' => $recipient,
                'attempted_at' => now()->format('d/m/Y H:i:s'),
                'duration_ms' => $duration,
            ],
            'configuration' => $config ?? null,
        ], 500, [], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    }
});

Route::get('/test-graph-email', function () {
    $recipient = 'erwin.martinez@wasionmx.onmicrosoft.com';
    $startTime = microtime(true);

    try {
        $mailer = app(MicrosoftGraphMailer::class);

        $body = '<html><body>' .
            '<h2>✅ Prueba de Microsoft Graph API</h2>' .
            '<p>Este correo fue enviado usando OAuth2 con Microsoft Graph.</p>' .
            '<ul>' .
            '<li><strong>Remitente:</strong> ' . config('services.microsoft.sender_email') . '</li>' .
            '<li><strong>Destinatario:</strong> ' . $recipient . '</li>' .
            '<li><strong>Fecha:</strong> ' . now()->format('d/m/Y H:i:s') . '</li>' .
            '</ul>' .
            '<p>Si recibes este mensaje, OAuth2 está funcionando correctamente.</p>' .
            '</body></html>';

        $mailer->send(
            $recipient,
            '✅ Prueba Microsoft Graph - Wasion Safety Observation',
            $body
        );

        $endTime = microtime(true);
        $duration = round(($endTime - $startTime) * 1000, 2);

        return response()->json([
            'success' => true,
            'message' => '✅ Correo enviado con Microsoft Graph',
            'details' => [
                'method' => 'Microsoft Graph API (OAuth2)',
                'recipient' => $recipient,
                'sent_at' => now()->format('d/m/Y H:i:s'),
                'duration_ms' => $duration,
                'tenant_id' => config('services.microsoft.tenant_id'),
                'client_id' => config('services.microsoft.client_id'),
                'sender' => config('services.microsoft.sender_email'),
            ],
        ], 200, [], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    } catch (\Exception $e) {
        $endTime = microtime(true);
        $duration = round(($endTime - $startTime) * 1000, 2);

        return response()->json([
            'success' => false,
            'message' => '❌ Error al enviar con Microsoft Graph',
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString(),
            'details' => [
                'recipient' => $recipient,
                'attempted_at' => now()->format('d/m/Y H:i:s'),
                'duration_ms' => $duration,
            ],
        ], 500, [], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    }
});

Route::get('/test-verification-email', function () {
    $recipient = 'erwin.martinez@wasionmx.onmicrosoft.com';

    try {
        Mail::send('emails.verify-test', ['name' => 'Erwin Dayan Martinez Plaza'], function ($message) use ($recipient) {
            $message->to($recipient)
                ->subject('Verificar Dirección de Correo Electrónico')
                ->priority(1);
        });

        return response()->json([
            'success' => true,
            'message' => '✅ Correo de verificación enviado',
            'details' => [
                'type' => 'Email Verification',
                'recipient' => $recipient,
                'sent_at' => now()->format('d/m/Y H:i:s'),
                'from' => config('mail.from.address'),
            ],
            'note' => 'Este es el mismo tipo de correo que se envía al registrarse. Revisa tu bandeja y spam.'
        ], 200, [], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => '❌ Error al enviar',
            'error' => $e->getMessage(),
            'line' => $e->getLine(),
            'file' => basename($e->getFile()),
        ], 500, [], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
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
        Route::post('/users/{user}/manual-verify', [UserManagementController::class, 'manualVerify'])
            ->name('users.manual-verify');
        Route::post('/users/{user}/toggle-suspension', [UserManagementController::class, 'toggleSuspension'])
            ->name('users.toggle-suspension');
    });

    // --- ADMINISTRACIÓN DE ÁREAS (Super Admin) ---
    Route::middleware(['verified'])->prefix('admin/areas')->name('areas.')->group(function () {
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
        Route::get('/export/csv', [ObservationController::class, 'exportCsv'])->name('export.csv');
        Route::get('/export/pdf', [ObservationController::class, 'exportPdf'])->name('export.pdf');

        Route::get('/{observation}', [ObservationController::class, 'show'])->name('show');
        Route::put('/{observation}/close', [ObservationController::class, 'close'])->name('close');
        Route::post('/{observation}/reopen', [ObservationController::class, 'reopen'])->name('reopen');
    });

    // --- PARTICIPACIÓN HISTÓRICA ---
    Route::get('/participation/history', [ParticipationController::class, 'history'])
        ->middleware(['verified'])
        ->name('participation.history');
});

require __DIR__ . '/auth.php';
