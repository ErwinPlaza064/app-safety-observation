# Script para generar iconos PWA - WASION Safety Observer

Write-Host "================================================"
Write-Host "  WASION Safety Observer - Generador de Iconos PWA"
Write-Host "================================================"
Write-Host ""

$iconSizes = @(16, 32, 72, 96, 128, 144, 152, 192, 384, 512)
$iconPath = "public\images\icons"

if (-not (Test-Path $iconPath)) {
    New-Item -ItemType Directory -Path $iconPath -Force | Out-Null
}

Write-Host "Directorio: $iconPath"
Write-Host ""
Write-Host "Generando iconos PWA..."
Write-Host ""

Add-Type -AssemblyName System.Drawing

foreach ($size in $iconSizes) {
    $outputFile = Join-Path $iconPath "icon-${size}x${size}.png"

    $bitmap = New-Object System.Drawing.Bitmap($size, $size)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAlias

    $blueBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 30, 58, 138))
    $graphics.FillRectangle($blueBrush, 0, 0, $size, $size)

    $whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)

    $fontSize = [Math]::Max(8, $size * 0.5)
    $font = New-Object System.Drawing.Font("Arial", $fontSize, [System.Drawing.FontStyle]::Bold)
    $stringFormat = New-Object System.Drawing.StringFormat
    $stringFormat.Alignment = [System.Drawing.StringAlignment]::Center
    $stringFormat.LineAlignment = [System.Drawing.StringAlignment]::Center
    $rect = New-Object System.Drawing.RectangleF(0, 0, $size, $size)
    $graphics.DrawString("W", $font, $whiteBrush, $rect, $stringFormat)

    $bitmap.Save($outputFile, [System.Drawing.Imaging.ImageFormat]::Png)

    $font.Dispose()
    $whiteBrush.Dispose()
    $blueBrush.Dispose()
    $graphics.Dispose()
    $bitmap.Dispose()

    Write-Host "  [OK] icon-${size}x${size}.png"
}

Write-Host ""
Write-Host "================================================"
Write-Host "  Iconos generados exitosamente!"
Write-Host "================================================"
