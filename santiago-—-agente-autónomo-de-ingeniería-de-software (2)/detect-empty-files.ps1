<#
.SYNOPSIS
    DETECTOR DE ARCHIVOS VACÍOS Y CORRUPTOS - PROYECTO GO
.DESCRIPTION
    Escanea la estructura de carpetas en busca de archivos .go de 0 bytes
    o archivos sin la palabra clave obligatoria 'package'.
#>

# 1. DETERMINACIÓN DE LA RUTA
$projectDir = Get-Location

Write-Host "========================================================================" -ForegroundColor Cyan
Write-Host " ESCANEO DE ARCHIVOS VACÍOS Y CORRUPTOS (.GO)" -ForegroundColor Cyan
Write-Host " Ruta actual: $projectDir" -ForegroundColor Gray
Write-Host "========================================================================`n" -ForegroundColor Cyan

# 2. BÚSQUEDA DE ARCHIVOS .GO (excluyendo la carpeta vendor)
$goFiles = Get-ChildItem -Path $projectDir -Recurse -Filter "*.go" | Where-Object { $_.FullName -notmatch '\\vendor\\' }

$problemFiles = @()

Write-Host "Analizando $($goFiles.Count) archivos .go...`n" -ForegroundColor Gray

# 3. EVALUACIÓN ARCHIVO POR ARCHIVO
foreach ($file in $goFiles) {
    $relativePath = Resolve-Path -Path $file.FullName -Relative
    $reason = ""

    # Regla 1: Archivo de 0 bytes
    if ($file.Length -eq 0) {
        $reason = "ARCHIVO VACÍO (0 Bytes) - Provoca error EOF en Go."
    } 
    # Regla 2: Archivo no vacío pero carece de la sintaxis 'package'
    else {
        $content = Get-Content -Path $file.FullName -Raw
        if ($null -eq $content -or $content.Trim().Length -eq 0) {
            $reason = "CONTENIDO EN BLANCO (Solo espacios/saltos de línea)."
        } elseif (-not ($content -match '(?m)^\s*package\s+\w+')) {
            $reason = "SINTAXIS INCOMPLETA - Falta la declaración 'package'."
        }
    }

    # Si se encontró algún problema, se añade al reporte
    if ($reason -ne "") {
        $problemFiles += [PSCustomObject]@{
            Archivo = $relativePath
            Causa   = $reason
        }
    }
}

# 4. PRESENTACIÓN DE RESULTADOS
Write-Host "------------------------------------------------------------------------" -ForegroundColor DarkGray

if ($problemFiles.Count -gt 0) {
    Write-Host " [!] ATENCIÓN: Se encontraron $($problemFiles.Count) archivo(s) problemático(s):`n" -ForegroundColor Red

    foreach ($item in $problemFiles) {
        Write-Host " 📄 Archivo : " -NoNewline -ForegroundColor Yellow
        Write-Host "$($item.Archivo)" -ForegroundColor White
        
        Write-Host "    Problema: " -NoNewline -ForegroundColor Red
        Write-Host "$($item.Causa)`n" -ForegroundColor DarkRed
    }
} else {
    Write-Host " [V] ¡EXCELENTE! No se encontraron archivos vacíos ni incompletos." -ForegroundColor Green
}

Write-Host "========================================================================" -ForegroundColor Cyan