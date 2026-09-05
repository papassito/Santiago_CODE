<#
.SYNOPSIS
    Empaqueta Santiago Agent para su distribucion en Windows.
.DESCRIPTION
    Detiene procesos activos, filtra binarios limpios,
    genera las instrucciones y empaqueta en un ZIP portatil.
#>
$ErrorActionPreference = "Stop"

# --- 0. Liberacion Silenciosa de Procesos Activos ---
Write-Host "Liberando ejecutables de la memoria..." -ForegroundColor DarkGray
$daemons = @("gateway", "rag", "runner", "vault")
foreach ($daemon in $daemons) {
    Get-Process -Name $daemon -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
}

# --- 1. Definicion de Rutas y Version ---
$version = "0.1.0-alpha"
$architecture = "windows-amd64"

$currentPath = (Get-Location).Path
if (Test-Path (Join-Path -Path $currentPath -ChildPath "cmd")) {
    $goProjectDir = $currentPath
    $rootDir = Split-Path -Path $currentPath -Parent
} else {
    $rootDir = $currentPath
    $goProjectDir = Join-Path -Path $currentPath -ChildPath "santiago-go"
}

$releaseDir = Join-Path -Path $rootDir -ChildPath "release"
$packageName = "santiago-agent-v" + $version + "-" + $architecture
$stagingDir = Join-Path -Path $releaseDir -ChildPath $packageName
$zipFilePath = Join-Path -Path $releaseDir -ChildPath ($packageName + ".zip")

Write-Host "========================================================================" -ForegroundColor Cyan
Write-Host " INICIANDO EMPAQUETADO DE SANTIAGO AGENT PARA WINDOWS" -ForegroundColor White
Write-Host "========================================================================" -ForegroundColor Cyan

# --- 2. Limpieza de Release Anterior ---
Write-Host "`n[1/5] Preparando directorio de release..." -ForegroundColor Yellow
if (Test-Path -Path $releaseDir) {
    Remove-Item -Path $releaseDir -Recurse -Force
}
New-Item -ItemType Directory -Path $stagingDir | Out-Null
Write-Host " -> Carpeta 'release' preparada." -ForegroundColor Green

# --- 3. Validacion del Build (Solo copia) ---
Write-Host "`n[2/5] Verificando binarios compilados..." -ForegroundColor Yellow
$binDir = Join-Path -Path $goProjectDir -ChildPath "bin"
if (-not (Test-Path -Path $binDir)) {
    Write-Host "[ERROR] No se encontro la carpeta /bin. Corre .\build.ps1 primero." -ForegroundColor Red
    exit 1
}
Write-Host " -> Directorio /bin localizado." -ForegroundColor Green

# --- 4. Copia Filtrada de Binarios y Scripts ---
Write-Host "`n[3/5] Reuniendo artefactos limpios..." -ForegroundColor Yellow

Get-ChildItem -Path $binDir -Filter "*.exe" | ForEach-Object {
    if ($_.Name -notlike "*~*") {
        Copy-Item -Path $_.FullName -Destination $stagingDir
        Write-Host " -> Binario copiado: $($_.Name)" -ForegroundColor Gray
    }
}

$scriptsToCopy = @("start-santiago.ps1", "stop-santiago.ps1", "diagnostico.ps1")
foreach ($script in $scriptsToCopy) {
    $scriptPath = Join-Path -Path $rootDir -ChildPath $script
    if (-not (Test-Path $scriptPath)) {
        $scriptPath = Join-Path -Path $goProjectDir -ChildPath $script
    }
    
    if (Test-Path $scriptPath) {
        Copy-Item -Path $scriptPath -Destination $stagingDir
        Write-Host " -> Script copiado: $script" -ForegroundColor Gray
    }
}

# --- 5. Generacion de Instrucciones y ZIP ---
Write-Host "`n[4/5] Generando INSTRUCCIONES.txt..." -ForegroundColor Yellow
$readmeLines = @(
    "=========================================",
    " SANTIAGO AGENT v" + $version,
    "=========================================",
    "",
    "Este paquete contiene el enjambre completo de Santiago Agent (Soberano y Local).",
    "",
    "INSTRUCCIONES DE INICIO RAPIDO:",
    "1. Abre una terminal de PowerShell en esta carpeta.",
    "2. Ejecuta '.\start-santiago.ps1' para iniciar los 4 micro-daemons en segundo plano.",
    "3. Verifica la salud del enjambre con '.\diagnostico.ps1'.",
    "4. Para detener todos los procesos, ejecuta '.\stop-santiago.ps1'."
)
$instructionsPath = Join-Path -Path $stagingDir -ChildPath "INSTRUCCIONES.txt"
Set-Content -Path $instructionsPath -Value $readmeLines
Write-Host " -> INSTRUCCIONES.txt creado." -ForegroundColor Green

Write-Host "`n[5/5] Comprimiendo en archivo ZIP..." -ForegroundColor Yellow

$maxRetries = 4
$retryCount = 0
$zipSuccess = $false

while (-not $zipSuccess -and $retryCount -lt $maxRetries) {
    try {
        $retryCount++
        Start-Sleep -Seconds 1
        # -ErrorAction Stop obliga a PowerShell a atrapar el error si el archivo esta bloqueado
        Compress-Archive -Path "$stagingDir\*" -DestinationPath $zipFilePath -Force -ErrorAction Stop
        $zipSuccess = $true
    }
    catch {
        if ($retryCount -lt $maxRetries) {
            Write-Host " -> Archivo ocupado por Windows. Reintentando en 3 segundos... (Intento $retryCount/$maxRetries)" -ForegroundColor DarkYellow
            Start-Sleep -Seconds 3
        } else {
            Write-Host "[ERROR DE COMPRESION] No se pudo generar el archivo ZIP. Revisa que los daemons esten detenidos." -ForegroundColor Red
            throw $_
        }
    }
}

Write-Host " -> Archivo ZIP generado exitosamente." -ForegroundColor Green

Write-Host "`n========================================================================" -ForegroundColor Cyan
Write-Host " EMPAQUETADO COMPLETADO CON EXITO" -ForegroundColor Green
Write-Host " Tu paquete portatil esta listo en: $zipFilePath" -ForegroundColor White
Write-Host "========================================================================" -ForegroundColor Cyan