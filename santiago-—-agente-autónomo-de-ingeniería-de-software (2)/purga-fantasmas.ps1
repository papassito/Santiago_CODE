<#
.SYNOPSIS
    PURGA DE ARCHIVOS FANTASMA DE 0 BYTES - PROYECTO SANTIAGO
.DESCRIPTION
    Busca y elimina de forma segura los archivos .go de 0 bytes
    ubicados en la raíz que provocan errores de EOF en el compilador de Go.
#>

# 1. OBTENER LA RUTA DEL PROYECTO
$projectDir = Get-Location

Write-Host "========================================================================" -ForegroundColor Cyan
Write-Host " ELIMINANDO ARCHIVOS FANTASMA (0 BYTES)" -ForegroundColor Cyan
Write-Host " Ruta actual: $projectDir" -ForegroundColor Gray
Write-Host "========================================================================`n" -ForegroundColor Cyan

# 2. BUSCAR ARCHIVOS DE 0 BYTES
$ghostFiles = Get-ChildItem -Path $projectDir -Filter "*.go" | Where-Object { $_.Length -eq 0 }

if ($ghostFiles) {
    Write-Host "Se encontraron $($ghostFiles.Count) archivo(s) vacío(s) para eliminar:`n" -ForegroundColor Yellow

    foreach ($file in $ghostFiles) {
        Remove-Item -Path $file.FullName -Force
        Write-Host "  [X] Eliminado: $($file.Name)" -ForegroundColor Red
    }

    Write-Host "`n[V] ¡Limpieza completada con éxito!" -ForegroundColor Green
} else {
    Write-Host "[V] No se encontraron archivos de 0 bytes en la raíz." -ForegroundColor Green
}

Write-Host "`n========================================================================" -ForegroundColor Cyan