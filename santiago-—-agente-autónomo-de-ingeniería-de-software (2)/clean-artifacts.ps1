<#
.SYNOPSIS
    LIMPIEZA DE RESIDUOS Y ORGANIZACIÓN DE PRUEBAS - PROYECTO SANTIAGO
.DESCRIPTION
    Elimina binarios huérfanos de la raíz y mueve archivos de prueba 
    a una carpeta segura (tests/) sin alterar los daemons.
#>

# 1. RESOLUCIÓN DE RUTA
$currentPath = (Get-Location).Path

if (Test-Path (Join-Path -Path $currentPath -ChildPath "cmd")) {
    $goProjectDir = $currentPath
} else {
    $goProjectDir = Join-Path -Path $currentPath -ChildPath "santiago-go"
}

Write-Host "========================================================================" -ForegroundColor Cyan
Write-Host " LIMPIEZA DE RESIDUOS Y ORGANIZACIÓN DE ARCHIVOS" -ForegroundColor Cyan
Write-Host " Ruta del proyecto: $goProjectDir" -ForegroundColor Gray
Write-Host "========================================================================`n" -ForegroundColor Cyan

Push-Location -Path $goProjectDir

# 2. ELIMINAR BINARIO HUÉRFANO (santiago.exe en la raíz)
$rootExe = Join-Path -Path $goProjectDir -ChildPath "santiago.exe"
if (Test-Path -Path $rootExe) {
    Remove-Item -Path $rootExe -Force
    Write-Host "  [X] Eliminado binario huérfano: santiago.exe" -ForegroundColor Red
} else {
    Write-Host "  [V] No hay binarios .exe en la raíz." -ForegroundColor Green
}

# 3. MOVER ARCHIVO DE PRUEBA (test-dummy.go) A LA CARPETA TESTS/
$dummyFile = Join-Path -Path $goProjectDir -ChildPath "test-dummy.go"
if (Test-Path -Path $dummyFile) {
    $testDir = Join-Path -Path $goProjectDir -ChildPath "tests"
    
    # Crear carpeta tests si no existe
    if (-not (Test-Path -Path $testDir)) {
        New-Item -ItemType Directory -Path $testDir | Out-Null
        Write-Host "  [+] Carpeta 'tests' creada en: $testDir" -ForegroundColor Green
    }

    $destPath = Join-Path -Path $testDir -ChildPath "test-dummy.go"
    Move-Item -Path $dummyFile -Destination $destPath -Force
    Write-Host "  [->] Mivido 'test-dummy.go' a 'tests\test-dummy.go'" -ForegroundColor Yellow
} else {
    Write-Host "  [V] La raíz está totalmente libre de archivos .go sueltos." -ForegroundColor Green
}

Pop-Location

Write-Host "`n========================================================================" -ForegroundColor Cyan
Write-Host " LIMPIEZA COMPLETADA - ESTRUCTURA 100% ORDENADA" -ForegroundColor Cyan
Write-Host "========================================================================" -ForegroundColor Cyan