# Queue Worker para Safety Observation - XAMPP
# =============================================
# Este script inicia el worker de colas de Laravel

Set-Location "C:\xampp\htdocs\safety-observation"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Queue Worker - Safety Observation" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Procesando colas de correos electrónicos..." -ForegroundColor Yellow
Write-Host "Presiona Ctrl+C para detener" -ForegroundColor Gray
Write-Host ""

# Bucle infinito que reinicia el worker si falla
while ($true) {
    try {
        # Ejecutar el worker
        & C:\xampp\php\php.exe artisan queue:work --sleep=3 --tries=3 --timeout=60

        # Si termina, esperar 5 segundos antes de reiniciar
        Write-Host "`nWorker detenido. Reiniciando en 5 segundos..." -ForegroundColor Yellow
        Start-Sleep -Seconds 5

    } catch {
        Write-Host "`nError: $_" -ForegroundColor Red
        Write-Host "Reiniciando en 5 segundos..." -ForegroundColor Yellow
        Start-Sleep -Seconds 5
    }
}
