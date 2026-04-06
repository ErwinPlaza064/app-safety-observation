<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Auth;

class LogController extends Controller
{
    /**
     * Get the system logs.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getLogs()
    {
        // Ensure only super admins can access
        if (!Auth::user()->is_super_admin) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $logPath = storage_path('logs/laravel.log');

        if (!File::exists($logPath)) {
            return response()->json([
                'logs' => [],
                'message' => 'No se encontró el archivo de logs.'
            ]);
        }

        // Read the file. For large files, we should use a more efficient way,
        // but for now, reading the last few KB or lines is okay.
        $content = File::get($logPath);
        $lines = explode("\n", $content);
        
        // Filter out empty lines and take the last 1000 to be safe before parsing
        $lines = array_filter($lines);
        $lines = array_slice($lines, -1000);

        $parsedLogs = [];
        $currentLog = null;

        foreach ($lines as $line) {
            // Pattern for Laravel log: [YYYY-MM-DD HH:MM:SS] environment.LEVEL: Message
            preg_match('/^\[(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})\] (\w+)\.(\w+): (.*)/', $line, $matches);

            if (count($matches) >= 5) {
                // If it's a new log line header
                if ($currentLog) {
                    $parsedLogs[] = $currentLog;
                }

                $currentLog = [
                    'date' => $matches[1],
                    'env' => $matches[2],
                    'level' => $matches[3],
                    'message' => $matches[4]
                ];
            } else if ($currentLog) {
                // If it doesn't match the pattern, it's likely part of a stack trace or multiline message
                $currentLog['message'] .= "\n" . $line;
            }
        }

        // Add the last log entry
        if ($currentLog) {
            $parsedLogs[] = $currentLog;
        }

        // Now reverse entries to have most recent first
        $parsedLogs = array_reverse($parsedLogs);

        return response()->json([
            'logs' => $parsedLogs,
            'file_size' => round(File::size($logPath) / 1024, 2) . ' KB'
        ]);
    }

    /**
     * Download the full log file.
     *
     * @return \Symfony\Component\HttpFoundation\BinaryFileResponse
     */
    public function downloadLogs()
    {
        if (!Auth::user()->is_super_admin) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $logPath = storage_path('logs/laravel.log');

        if (!File::exists($logPath)) {
            return response()->json(['error' => 'Log file not found'], 404);
        }

        return Response::download($logPath, 'laravel-log-' . now()->format('Y-m-d') . '.log');
    }

    /**
     * Clear the log file.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function clearLogs()
    {
        if (!Auth::user()->is_super_admin) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $logPath = storage_path('logs/laravel.log');

        if (File::exists($logPath)) {
            File::put($logPath, '');
            return response()->json(['status' => 'success', 'message' => 'Logs limpiados.']);
        }

        return response()->json(['status' => 'error', 'message' => 'No se encontró el archivo.']);
    }
}
