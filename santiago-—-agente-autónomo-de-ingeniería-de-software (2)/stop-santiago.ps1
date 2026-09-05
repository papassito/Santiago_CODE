<#
.SYNOPSIS
    Detiene todos los procesos de los micro-daemons de Santiago.
.DESCRIPTION
    Encuentra los procesos que escuchan en los puertos 34820-34823 y los termina
    para garantizar un entorno limpio.
#>
$ErrorActionPreference = "SilentlyContinue"

Write-Host "============================================================" -ForegroundColor Magenta
Write-Host " SANTIAGO - DETENIENDO INFRAESTRUCTURA SOBERANA" -ForegroundColor Magenta
Write-Host "============================================================"

$ports = 34820, 34821, 34822, 34823
$connections = Get-NetTCPConnection -LocalPort $ports -State Listen

if ($connections) {
    $pids = $connections.OwningProcess | Select-Object -Unique
    Write-Host "Procesos de Santiago detectados en PIDs: $($pids -join ', ')" -ForegroundColor Yellow
    Stop-Process -Id $pids -Force
    Write-Host "Todos los daemons de Santiago han sido detenidos." -ForegroundColor Green
} else {
    Write-Host "No se encontraron daemons de Santiago activos." -ForegroundColor White
}