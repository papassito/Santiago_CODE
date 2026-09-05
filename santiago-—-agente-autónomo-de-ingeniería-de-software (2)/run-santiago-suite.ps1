<#
.SYNOPSIS
    VERIFICADOR Y ARRANQUE MAESTRO - PROYECTO SANTIAGO
.DESCRIPTION
    Ejecuta el chequeo de limpieza y, si todo está correcto, compila e inicia
    toda la arquitectura de daemons en segundo plano.
#>

$currentDir = Get-Location

# Definir ruta raíz de Go
if (Test-Path (Join-Path $currentDir "cmd")) {
    $goProjectDir = $currentDir.Path
} else {
    $goProjectDir = Join-Path $currentDir.Path "santiago-go"
}

Write-Host "========================================================================" -ForegroundColor Cyan
Write-Host " CONFIRMACIÓN DE LIMPIEZA Y ARRANQUE DE DAEMONS" -ForegroundColor Cyan
Write-Host " Ruta base: $goProjectDir" -ForegroundColor Gray
Write-Host "========================================================================`n" -ForegroundColor Cyan

# 1. VERIFICAR ARCHIVOS RESTANTES EN LA RAÍZ
$ghostCheck = Get-ChildItem -Path $goProjectDir -Recurse -Filter "*.go" | Where-Object { $_.Length -eq 0 }

if ($ghostCheck) {
    Write-Host "[!] ALERTA: Aún se detectaron $($ghostCheck.Count) archivo(s) de 0 bytes." -ForegroundColor Red
    Write-Host "Ejecuta una limpieza antes de compilar." -ForegroundColor Yellow
} else {
    Write-Host "[V] ¡Confirmado! Cero archivos fantasma en el proyecto." -ForegroundColor Green
    
    # 2. INTENTAR COMPILACIÓN DE PRUEBA
    Push-Location $goProjectDir
    $vetCheck = go vet ./... 2>&1
    Pop-Location

    if ($vetCheck) {
        Write-Host "[!] Se encontraron errores durante 'go vet':" -ForegroundColor Red
        Write-Host $vetCheck -ForegroundColor DarkYellow
    } else {
        Write-Host "[V] Auditoría sintáctica impecable. Código listo para producción.`n" -ForegroundColor Green
        
        # 3. EJECUTAR SCRIPT DE ARRANQUE SI EXISTE
        $startScript = Join-Path $goProjectDir "start-santiago.ps1"
        if (Test-Path $startScript) {
            Write-Host "Iniciando infraestructura de microservicios..." -ForegroundColor Yellow
            & $startScript
        } else {
            Write-Host "[i] Recuerda crear o ejecutar '.\start-santiago.ps1' para iniciar los puertos." -ForegroundColor Cyan
        }
    }
}

Write-Host "`n========================================================================" -ForegroundColor Cyan