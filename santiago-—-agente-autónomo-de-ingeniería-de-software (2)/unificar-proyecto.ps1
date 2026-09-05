<#
.SYNOPSIS
    DIRECTIVA TÁCTICA DE FUSIÓN (OPERACIÓN UNIFICACIÓN)
.DESCRIPTION
    Audita, enruta, limpia duplicados mediante hash SHA-256,
    fusiona dependencias de manifiestos y purga el directorio temporal.
#>
$ErrorActionPreference = "Stop"

$currentDir = (Get-Location).Path
$sourceDir = Join-Path -Path $currentDir -ChildPath "santiago-code-&-agent-ide"
$goTargetDir = Join-Path -Path $currentDir -ChildPath "santiago-go"
$webTargetDir = Join-Path -Path $currentDir -ChildPath "src"
$vscodeTargetDir = Join-Path -Path $currentDir -ChildPath "santiago-vscode"

Write-Host "========================================================================" -ForegroundColor Cyan
Write-Host " OPERACIÓN UNIFICACIÓN: SANTIAGO CODE & AGENT IDE" -ForegroundColor White
Write-Host "========================================================================" -ForegroundColor Cyan

# Inicializar listas para el log final
$global:fusionados = @()
$global:descartados = @()
$global:modificados = @()

if (-not (Test-Path -Path $sourceDir)) {
    Write-Host "[X] Carpeta 'santiago-code-&-agent-ide' no encontrada." -ForegroundColor Yellow
    Write-Host "-> Estructura limpia o ya unificada previamente." -ForegroundColor Green
    Write-Host "========================================================================" -ForegroundColor Cyan
    exit 0
}

# Asegurar directorios destino
foreach ($dir in @($goTargetDir, $webTargetDir, $vscodeTargetDir)) {
    if (-not (Test-Path -Path $dir)) {
        New-Item -ItemType Directory -Path $dir | Out-Null
    }
}

function Fucionar-Archivo {
    param (
        [string]$Origen,
        [string]$Destino,
        [string]$Categoria
    )

    $nombre = Split-Path $Origen -Leaf
    
    if (Test-Path -Path $Destino) {
        # Comparación de integridad mediante SHA-256
        $hashOrigen = (Get-FileHash -Path $Origen -Algorithm SHA256).Hash
        $hashDest = (Get-FileHash -Path $Destino -Algorithm SHA256).Hash

        if ($hashOrigen -eq $hashDest) {
            $global:descartados += [PSCustomObject]@{ Archivo = $nombre; Ruta = $Destino; Razon = "Duplicado idéntico (SHA-256 coincidente)" }
            Remove-Item -Path $Origen -Force
            Write-Host "  [-] Descartado (duplicado): $nombre" -ForegroundColor Gray
        } else {
            # Si difieren, realizamos una fusión segura (o backup preventivo)
            $backupPath = $Destino + ".bak"
            Copy-Item -Path $Destino -Destination $backupPath -Force
            Copy-Item -Path $Origen -Destination $Destino -Force
            Remove-Item -Path $Origen -Force
            $global:modificados += [PSCustomObject]@{ Archivo = $nombre; Ruta = $Destino; Accion = "Actualizado con lógica nueva (Backup .bak creado)" }
            Write-Host "  [*] Modificado/Actualizado: $nombre (Backup creado)" -ForegroundColor Yellow
        }
    } else {
        # Archivo nuevo
        $parentDir = Split-Path $Destino -Parent
        if (-not (Test-Path -Path $parentDir)) {
            New-Item -ItemType Directory -Path $parentDir | Out-Null
        }
        Move-Item -Path $Origen -Destination $Destino -Force
        $global:fusionados += [PSCustomObject]@{ Archivo = $nombre; Destino = $Destino; Tipo = $Categoria }
        Write-Host "  [+] Fusionado (nuevo): $nombre -> $Categoria" -ForegroundColor Green
    }
}

# --- 1. Enrutamiento Estricto ---
Write-Host "`n[1/4] Enrutando y auditando archivos en '$sourceDir'..." -ForegroundColor Yellow

# A. Paquetes Go (santiago-go/)
Get-ChildItem -Path $sourceDir -Recurse -Filter "*.go" | ForEach-Object {
    $relPath = $_.FullName.Substring($sourceDir.Length + 1)
    $destFile = Join-Path -Path $goTargetDir -ChildPath $relPath
    Fucionar-Archivo -Origen $_.FullName -Destino $destFile -Categoria "Go-Backend"
}

# B. Componentes Visuales TSX/TS (src/)
Get-ChildItem -Path $sourceDir -Recurse -Include "*.tsx", "*.ts" | ForEach-Object {
    # Evitar mover archivos de configuración o de santiago-vscode
    if ($_.FullName -notlike "*santiago-vscode*" -and $_.Name -notlike "*config*") {
        $relPath = $_.FullName.Substring($sourceDir.Length + 1)
        $destFile = Join-Path -Path $webTargetDir -ChildPath $relPath
        Fucionar-Archivo -Origen $_.FullName -Destino $destFile -Categoria "React-UI"
    }
}

# C. Lógica del Editor (santiago-vscode/)
$vscodeSource = Join-Path -Path $sourceDir -ChildPath "santiago-vscode"
if (Test-Path -Path $vscodeSource) {
    Get-ChildItem -Path $vscodeSource -Recurse | Where-Object { -not $_.PSIsContainer } | ForEach-Object {
        $relPath = $_.FullName.Substring($vscodeSource.Length + 1)
        $destFile = Join-Path -Path $vscodeTargetDir -ChildPath $relPath
        Fucionar-Archivo -Origen $_.FullName -Destino $destFile -Categoria "VSCode-Extension"
    }
}

# --- 2. Fusión Segura de Manifiestos ---
Write-Host "`n[2/4] Consolidando dependencias de manifiestos..." -ForegroundColor Yellow

$injectedPkgJson = Join-Path -Path $sourceDir -ChildPath "package.json"
if (Test-Path -Path $injectedPkgJson) {
    Write-Host "  -> Procesando dependencias de package.json inyectado..." -ForegroundColor Gray
    # Aquí integramos lógicas adicionales de dependencias de forma segura sin sobreescribir el package.json actual.
    $mainPkgJsonPath = Join-Path -Path $currentDir -ChildPath "package.json"
    $mainPkg = Get-Content -Raw -Path $mainPkgJsonPath | ConvertFrom-Json
    $injPkg = Get-Content -Raw -Path $injectedPkgJson | ConvertFrom-Json
    
    $updated = $false
    foreach ($prop in @("dependencies", "devDependencies")) {
        if ($injPkg.PSObject.Properties[$prop]) {
            foreach ($dep in $injPkg.$prop.PSObject.Properties) {
                if (-not $mainPkg.$prop.PSObject.Properties[$dep.Name]) {
                    $mainPkg.$prop | Add-Member -MemberType NoteProperty -Name $dep.Name -Value $dep.Value
                    Write-Host "    [+] Añadida dependencia: $($dep.Name) ($($dep.Value)) en $prop" -ForegroundColor Green
                    $updated = $true
                }
            }
        }
    }
    if ($updated) {
        $mainPkg | ConvertTo-Json -Depth 10 | Set-Content -Path $mainPkgJsonPath
        Write-Host "  [V] package.json principal actualizado con éxito." -ForegroundColor Green
    } else {
        Write-Host "  [V] package.json ya contiene todas las dependencias requeridas." -ForegroundColor Green
    }
}

# --- 3. Purga Final de Residuos ---
Write-Host "`n[3/4] Ejecutando purga final del directorio temporal..." -ForegroundColor Yellow
if (Test-Path -Path $sourceDir) {
    Remove-Item -Path $sourceDir -Recurse -Force
    Write-Host "  [X] Eliminado directorio '$sourceDir' de forma segura." -ForegroundColor Red
}

# --- 4. Reporte Consolidado ---
Write-Host "`n========================================================================" -ForegroundColor Cyan
Write-Host " REPORTE FINAL DE LA OPERACIÓN DE UNIFICACIÓN" -ForegroundColor White
Write-Host "========================================================================" -ForegroundColor Cyan
Write-Host "  Archivos Nuevos Fusionados : $($global:fusionados.Count)" -ForegroundColor Green
Write-Host "  Archivos Modificados/Backup: $($global:modificados.Count)" -ForegroundColor Yellow
Write-Host "  Archivos Descartados (Dupl): $($global:descartados.Count)" -ForegroundColor Gray
Write-Host "========================================================================" -ForegroundColor Cyan
Write-Host " Unificación completada exitosamente. Corre santiago-doctor.ps1 para verificar." -ForegroundColor Green