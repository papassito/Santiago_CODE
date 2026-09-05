<#
.SYNOPSIS
    Script de Orquestacion - Santiago Agent
.DESCRIPTION
    Inicia los 4 micro-daemons en segundo plano sin requerir administrador.
#>
$ErrorActionPreference = "Continue"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " SANTIAGO AGENT - INICIANDO INFRAESTRUCTURA SOBERANA" -ForegroundColor White
Write-Host "============================================================" -ForegroundColor Cyan

# Determinar si los binarios estan en /bin o en el directorio actual (instalador)
$binPath = $scriptDir
if (Test-Path (Join-Path $scriptDir "bin")) {
    $binPath = Join-Path $scriptDir "bin"
}

$daemons = @("gateway.exe", "rag.exe", "runner.exe", "vault.exe")

foreach ($daemon in $daemons) {
    $exePath = Join-Path $binPath $daemon
    if (Test-Path $exePath) {
        $name = [System.IO.Path]::GetFileNameWithoutExtension($daemon)
        
        # Limpiar ejecucion previa si existia
        Get-Process -Name $name -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
        
        Write-Host "Iniciando $daemon..." -NoNewline -ForegroundColor Yellow
        Start-Process -FilePath $exePath -WorkingDirectory $scriptDir -WindowStyle Hidden
        Write-Host " [OK]" -ForegroundColor Green
    } else {
        Write-Host "Error: No se encontro $daemon en $binPath" -ForegroundColor Red
    }
}

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " Servicios iniciados. Corre .\diagnostico.ps1 para validar." -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Cyan