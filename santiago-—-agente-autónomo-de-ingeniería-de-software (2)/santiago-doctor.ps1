<#
.SYNOPSIS
    SANTIAGO DOCTOR & AUDITOR - Centro de Control, Salud y Arquitectura

.DESCRIPTION
    Audita la integridad del código fuente Go, la estructura de carpetas de la
    arquitectura distribuida y el estado en tiempo real de la red local (Daemons).
#>

# ------------------------------------------------------------------------------
# RESOLUCIÓN Y NORMALIZACIÓN DE RUTAS
# ------------------------------------------------------------------------------
$currentDir = Get-Location

if (Test-Path (Join-Path $currentDir "cmd")) {
    $goProjectDir = $currentDir.Path
} elseif (Test-Path (Join-Path $currentDir "santiago-go\cmd")) {
    $goProjectDir = Join-Path $currentDir.Path "santiago-go"
} else {
    $goProjectDir = "C:\Users\Radio 2027\Desktop\Santiago Agenrte\santiago-go"
}

# Corregir rutas duplicadas en caso de existir
if (-not (Test-Path $goProjectDir) -and (Test-Path ($goProjectDir -replace '\\santiago-go\\santiago-go$', '\santiago-go'))) {
    $goProjectDir = $goProjectDir -replace '\\santiago-go\\santiago-go$', '\santiago-go'
}

$binDir = Join-Path $goProjectDir "bin"

Write-Host "========================================================================" -ForegroundColor Cyan
Write-Host " INICIANDO DIAGNÓSTICO Y LIMPIEZA - PROYECTO SANTIAGO" -ForegroundColor Cyan
Write-Host " Ruta base detectada: $goProjectDir" -ForegroundColor Gray
Write-Host "========================================================================`n" -ForegroundColor Cyan

# ------------------------------------------------------------------------------
# FASE 1: LIMPIEZA AUTOMÁTICA Y AUDITORÍA SINTÁCTICA
# ------------------------------------------------------------------------------
Write-Host "[1/3] AUDITORÍA SINTÁCTICA Y AUTO-LIMPIEZA" -ForegroundColor Yellow
Write-Host "------------------------------------------------------------------------" -ForegroundColor DarkGray

# A. Eliminación de archivos vacíos (0 bytes) que rompen Go
$ghostFiles = Get-ChildItem -Path $goProjectDir -Recurse -Filter '*.go' -ErrorAction SilentlyContinue | Where-Object { $_.Length -eq 0 }

if ($ghostFiles) {
    Write-Host "  [!] Archivos de 0 bytes detectados. Eliminando automáticamente..." -ForegroundColor Yellow
    foreach ($file in $ghostFiles) {
        Remove-Item -Path $file.FullName -Force
        Write-Host "      - Eliminado: $($file.RelativeName)" -ForegroundColor DarkYellow
    }
} else {
    Write-Host "  [V] Cero archivos fantasma de 0 bytes detectados." -ForegroundColor Green
}

# B. Limpieza de carpetas obsoletas (cmd\santiago)
$legacyFolder = Join-Path $goProjectDir "cmd\santiago"
if (Test-Path $legacyFolder) {
    Write-Host "  [!] Eliminando carpeta obsoleta '$legacyFolder'..." -ForegroundColor Yellow
    Remove-Item -Path $legacyFolder -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "  [V] Carpeta obsoleta removida con éxito." -ForegroundColor Green
} else {
    Write-Host "  [V] Estructura de paquetes limpia de residuos obsoletos." -ForegroundColor Green
}

# C. Auditoría sintáctica con 'go vet'
if (Test-Path $goProjectDir) {
    Push-Location $goProjectDir
    $vetResult = go vet ./... 2>&1 | Where-Object { $_ -notmatch 'go: downloading' }
    Pop-Location

    if ($vetResult) {
        Write-Host "  [!] ERRORES DE CÓDIGO DETECTADOS POR GO VET:" -ForegroundColor Red
        $vetResult | ForEach-Object { Write-Host "      ??  $_" -ForegroundColor DarkYellow }
    } else {
        Write-Host "  [V] Auditoría sintáctica de Go nativo ('go vet ./...'): LIMPIA." -ForegroundColor Green
    }
} else {
    Write-Host "  [?] ERROR CRÍTICO: No se encontró la carpeta del proyecto '$goProjectDir'." -ForegroundColor Red
}

Write-Host ""

# ------------------------------------------------------------------------------
# FASE 2: VERIFICACIÓN DE ARQUITECTURA
# ------------------------------------------------------------------------------
Write-Host "[2/3] AUDITORÍA DE ESTRUCTURA Y ARQUITECTURA" -ForegroundColor Yellow
Write-Host "------------------------------------------------------------------------" -ForegroundColor DarkGray

$expectedArchitecture = @(
    @{ Path = "cmd\gateway\main.go"; Label = "Gateway Orquestador (:34820)" },
    @{ Path = "cmd\rag\main.go";     Label = "RAG Engine Daemon (:34821)" },
    @{ Path = "cmd\runner\main.go";  Label = "Runner Exec Daemon (:34822)" },
    @{ Path = "cmd\vault\main.go";   Label = "CryptoVault Daemon (:34823)" },
    @{ Path = "pkg\contracts";       Label = "Contratos IPC & Protocolos DTO" }
)

$archStatusTable = @()

foreach ($item in $expectedArchitecture) {
    $fullPath = Join-Path $goProjectDir $item.Path
    $exists   = Test-Path $fullPath
    $status   = if ($exists) { "OK" } else { "FALTANTE" }

    $archStatusTable += [PSCustomObject]@{
        Módulo       = $item.Label
        RutaRelativa = $item.Path
        Estado       = $status
    }
}

$archStatusTable | Format-Table -AutoSize

# Verificación de binarios compilados
Write-Host "  Verificando binarios compilados en '$binDir':" -ForegroundColor Gray
$executables = @("gateway.exe", "rag.exe", "runner.exe", "vault.exe")
foreach ($exe in $executables) {
    $exePath = Join-Path $binDir $exe
    if (Test-Path $exePath) {
        $size = (Get-Item $exePath).Length / 1MB
        Write-Host ("   [V] {0,-15} COMPILADO ({1:N2} MB)" -f $exe, $size) -ForegroundColor Green
    } else {
        Write-Host "   [x] $exe NO ENCONTRADO (Ejecuta '.\start-santiago.ps1' para compilar)" -ForegroundColor DarkYellow 
    }
}

Write-Host ""

# ------------------------------------------------------------------------------
# FASE 3: TELEMETRÍA DE RED Y MONITOR DE SALUD
# ------------------------------------------------------------------------------
Write-Host "[3/3] TELEMETRÍA EN TIEMPO REAL (DAEMONS)" -ForegroundColor Yellow
Write-Host "------------------------------------------------------------------------" -ForegroundColor DarkGray

$gatewayUrl = "http://127.0.0.1:34820/health"
try {
    $healthResponse = Invoke-RestMethod -Uri $gatewayUrl -Method Get -TimeoutSec 3 -ErrorAction Stop
    Write-Host "  [V] Conexión establecida con Santiago Gateway Orquestador." -ForegroundColor Green
    Write-Host "      Estado Global del Enjambre: $($healthResponse.overall_status)" -ForegroundColor Cyan
    Write-Host ""
    
    Write-Host "  Reporte Consolidado del Supervisor:" -ForegroundColor Gray
    if ($healthResponse.daemons) {
        $healthResponse.daemons | Format-Table -AutoSize
    }
} catch {
    Write-Host "  [!] El Gateway en el puerto 34820 no responde. Sondeando puertos individuales..." -ForegroundColor Red

    $ports = @(
        @{ Daemon = "santiago-gateway"; Port = 34820 },
        @{ Daemon = "santiago-rag";     Port = 34821 },
        @{ Daemon = "santiago-runner";  Port = 34822 },
        @{ Daemon = "santiago-vault";   Port = 34823 }
    )

    foreach ($p in $ports) {
        $client = New-Object System.Net.Sockets.TcpClient
        $asyncResult = $client.BeginConnect("127.0.0.1", $p.Port, $null, $null)
        $wait = $asyncResult.AsyncWaitHandle.WaitOne(300, $false)

        if ($wait -and $client.Connected) {
            $client.EndConnect($asyncResult)
            $client.Close()
            Write-Host ("   [V] Puerto {0} ({1}): ESCUCHANDO" -f $p.Port, $p.Daemon) -ForegroundColor Yellow
        } else {
            $client.Close()
            Write-Host ("   [x] Puerto {0} ({1}): INACTIVO / CERRADO" -f $p.Port, $p.Daemon) -ForegroundColor Red
        }
    }
}

Write-Host "`n========================================================================" -ForegroundColor Cyan
Write-Host " DIAGNÓSTICO FINALIZADO" -ForegroundColor Cyan
Write-Host "========================================================================" -ForegroundColor Cyan