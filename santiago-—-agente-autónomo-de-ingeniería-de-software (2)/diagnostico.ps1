<#
.SYNOPSIS
    DOCTOR Y TELEMETRÍA DE RED - PROYECTO SANTIAGO
.DESCRIPTION
    Audita la integridad de archivos, la presencia de binarios y
    el estado en tiempo real de la conectividad TCP/HTTP de los daemons.
#>

# 1. RESOLUCIÓN DE RUTAS
$currentPath = (Get-Location).Path

if (Test-Path (Join-Path -Path $currentPath -ChildPath "cmd")) {
    $goProjectDir = $currentPath
} else {
    $goProjectDir = Join-Path -Path $currentPath -ChildPath "santiago-go"
}

$binDir = Join-Path -Path $goProjectDir -ChildPath "bin"

Write-Host "========================================================================" -ForegroundColor Cyan
Write-Host " DIAGNÓSTICO DE SALUD Y TELEMETRÍA EN TIEMPO REAL" -ForegroundColor Cyan
Write-Host " Ruta del proyecto: $goProjectDir" -ForegroundColor Gray
Write-Host "========================================================================`n" -ForegroundColor Cyan

# ------------------------------------------------------------------------------
# FASE 1: AUDITORÍA SINTÁCTICA Y DE ARCHIVOS FANTASMA
# ------------------------------------------------------------------------------
Write-Host "[1/3] AUDITORÍA SINTÁCTICA Y LIMPIEZA" -ForegroundColor Yellow
Write-Host "------------------------------------------------------------------------" -ForegroundColor DarkGray

$ghostFiles = Get-ChildItem -Path $goProjectDir -Recurse -Filter "*.go" -ErrorAction SilentlyContinue | Where-Object { $_.Length -eq 0 }

if ($ghostFiles) {
    Write-Host "  [!] Archivos de 0 bytes detectados. Eliminando..." -ForegroundColor Yellow
    foreach ($f in $ghostFiles) {
        Remove-Item -Path $f.FullName -Force
        Write-Host "      - Eliminado: $($f.Name)" -ForegroundColor DarkYellow
    }
} else {
    Write-Host "  [V] Cero archivos fantasma de 0 bytes detectados." -ForegroundColor Green
}

if (Test-Path -Path $goProjectDir) {
    Push-Location -Path $goProjectDir
    $vetResult = go vet ./... 2>&1 | Where-Object { $_ -notmatch 'go: downloading' }
    Pop-Location

    if ($vetResult) {
        Write-Host "  [!] ERRORES DETECTADOS POR GO VET:" -ForegroundColor Red
        $vetResult | ForEach-Object { Write-Host "      ?? $_" -ForegroundColor DarkYellow }
    } else {
        Write-Host "  [V] Auditoría sintáctica de Go nativo ('go vet ./...'): LIMPIA." -ForegroundColor Green
    }
}

Write-Host ""

# ------------------------------------------------------------------------------
# FASE 2: VERIFICACIÓN DE ARQUITECTURA Y BINARIOS
# ------------------------------------------------------------------------------
Write-Host "[2/3] AUDITORÍA DE ESTRUCTURA Y ARQUITECTURA" -ForegroundColor Yellow
Write-Host "------------------------------------------------------------------------" -ForegroundColor DarkGray

$expectedArchitecture = @(
    @{ Path = "cmd\gateway\main.go"; Label = "Gateway Orquestador (:34820)" },
    @{ Path = "cmd\rag\main.go";     Label = "RAG Engine Daemon (:34821)" },
    @{ Path = "cmd\runner\main.go";  Label = "Runner Exec Daemon (:34822)" },
    @{ Path = "cmd\vault\main.go";   Label = "CryptoVault Daemon (:34823)" },
    @{ Path = "pkg\contracts\contracts.go"; Label = "Contratos IPC & Protocolos DTO" }
)

$archStatusTable = @()

foreach ($item in $expectedArchitecture) {
    $fullPath = Join-Path -Path $goProjectDir -ChildPath $item.Path
    $exists   = Test-Path -Path $fullPath
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
    $exePath = Join-Path -Path $binDir -ChildPath $exe
    if (Test-Path -Path $exePath) {
        $size = (Get-Item -Path $exePath).Length / 1MB
        Write-Host ("   [V] {0,-15} COMPILADO ({1:N2} MB)" -f $exe, $size) -ForegroundColor Green
    } else {
        Write-Host "   [x] $exe NO ENCONTRADO (Ejecuta '.\start-santiago.ps1' para compilar)" -ForegroundColor DarkYellow
    }
}

Write-Host ""

# ------------------------------------------------------------------------------
# FASE 3: TELEMETRÍA DE RED Y MONITOR DE PUERTOS
# ------------------------------------------------------------------------------
Write-Host "[3/3] TELEMETRÍA EN TIEMPO REAL (DAEMONS)" -ForegroundColor Yellow
Write-Host "------------------------------------------------------------------------" -ForegroundColor DarkGray

$gatewayUrl = "http://127.0.0.1:34820/health"
try {
    $healthResponse = Invoke-RestMethod -Uri $gatewayUrl -Method Get -TimeoutSec 3 -ErrorAction Stop
    Write-Host "  [V] Conexión establecida con Santiago Gateway Orquestador." -ForegroundColor Green
    Write-Host "      Estado Global: $($healthResponse.overall_status)" -ForegroundColor Cyan
} catch {
    Write-Host "  [!] El Gateway en el puerto 34820 no responde HTTP. Sondeando puertos TCP..." -ForegroundColor Red

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