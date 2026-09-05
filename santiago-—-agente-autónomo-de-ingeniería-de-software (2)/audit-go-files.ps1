<#
.SYNOPSIS
    AUDITOR COMPLETO DE CÓDIGO GO - PROYECTO SANTIAGO
.DESCRIPTION
    Inspecciona todos los archivos .go en busca de:
    1. Archivos vacíos o corruptos (0 bytes).
    2. Errores de formato de código (gofmt).
    3. Errores de sintaxis y reglas de código (go vet).
#>

# 1. RESOLUCIÓN DE LA RUTA DEL PROYECTO
$currentDir = Get-Location

if (Test-Path (Join-Path $currentDir "cmd")) {
    $goProjectDir = $currentDir.Path
} elseif (Test-Path (Join-Path $currentDir "santiago-go\cmd")) {
    $goProjectDir = Join-Path $currentDir.Path "santiago-go"
} else {
    $goProjectDir = "C:\Users\Radio 2027\Desktop\Santiago Agenrte\santiago-go"
}

Write-Host "========================================================================" -ForegroundColor Cyan
Write-Host " AUDITORÍA COMPLETA DE ARCHIVOS GO" -ForegroundColor Cyan
Write-Host " Ruta del proyecto: $goProjectDir" -ForegroundColor Gray
Write-Host "========================================================================`n" -ForegroundColor Cyan

Push-Location $goProjectDir

# Obtenemos todos los archivos .go excluyendo carpetas de terceros si existen
$goFiles = Get-ChildItem -Recurse -Filter "*.go" | Where-Object { $_.FullName -notmatch '\\vendor\\' }
$report = @()

Write-Host "Analizando $($goFiles.Count) archivos .go...`n" -ForegroundColor Gray

foreach ($file in $goFiles) {
    $relativePath = Resolve-Path -Path $file.FullName -Relative
    $hasError = $false
    $errorTypes = @()
    $details = @()

    # --------------------------------------------------------------------------
    # EVALUACIÓN 1: ARCHIVOS VACÍOS / CORRUPTOS (0 BYTES)
    # --------------------------------------------------------------------------
    if ($file.Length -eq 0) {
        $hasError = $true
        $errorTypes += "VACÍO (0 Bytes)"
        $details += "El archivo no contiene código y provocará un error de EOF."
    } else {
        # ----------------------------------------------------------------------
        # EVALUACIÓN 2: ERRORES DE FORMATO (gofmt)
        # ----------------------------------------------------------------------
        $fmtResult = gofmt -l "$($file.FullName)" 2>&1
        if ($fmtResult) {
            $hasError = $true
            $errorTypes += "FORMATO (gofmt)"
            $details += "El archivo no cumple con el estándar de formato Go."
        }

        # ----------------------------------------------------------------------
        # EVALUACIÓN 3: ERRORES DE SINTAXIS Y REGLAS (go vet)
        # ----------------------------------------------------------------------
        $fileDir = $file.DirectoryName
        $vetOutput = go vet "$fileDir" 2>&1 | Where-Object { $_ -notmatch 'go: downloading' }

        if ($vetOutput -and $LASTEXITCODE -ne 0) {
            $matchingErrors = $vetOutput | Where-Object { $_ -match [regex]::Escape($file.Name) }
            if ($matchingErrors) {
                $hasError = $true
                $errorTypes += "SINTAXIS (go vet)"
                $details += ($matchingErrors -join " | ")
            }
        }
    }

    # Registrar el resultado si se encontró algún problema
    if ($hasError) {
        $report += [PSCustomObject]@{
            Archivo = $relativePath
            Errores = ($errorTypes -join ", ")
            Detalle = ($details -join " - ")
        }
    }
}

Pop-Location

# ------------------------------------------------------------------------------
# REPORTE FINAL DE RESULTADOS
# ------------------------------------------------------------------------------
Write-Host "------------------------------------------------------------------------" -ForegroundColor DarkGray

if ($report.Count -gt 0) {
    Write-Host " [!] SE DETECTARON $($report.Count) ARCHIVO(S) CON OBSERVACIONES:`n" -ForegroundColor Red

    foreach ($item in $report) {
        Write-Host " 📄 Archivo : " -NoNewline -ForegroundColor Yellow
        Write-Host "$($item.Archivo)" -ForegroundColor White

        Write-Host "    Fallas  : " -NoNewline -ForegroundColor Red
        Write-Host "$($item.Errores)" -ForegroundColor DarkRed

        Write-Host "    Detalle : " -NoNewline -ForegroundColor Gray
        Write-Host "$($item.Detalle)`n" -ForegroundColor DarkYellow
    }
} else {
    Write-Host " [V] ¡TODOS LOS ARCHIVOS ESTÁN LIMPIOS!" -ForegroundColor Green
    Write-Host "     - 0 archivos de 0 bytes." -ForegroundColor Green
    Write-Host "     - Formato gofmt correcto." -ForegroundColor Green
    Write-Host "     - Sin errores detectados por go vet." -ForegroundColor Green
}

Write-Host "========================================================================" -ForegroundColor Cyan