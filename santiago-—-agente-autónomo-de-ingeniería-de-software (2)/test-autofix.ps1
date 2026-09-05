<#
.SYNOPSIS
    Ejecuta una prueba de fuego del pipeline de auto-corrección de código.
.DESCRIPTION
    Este script crea un archivo Go de prueba con un error, invoca el endpoint /api/v1/fix
    del Gateway de Santiago y muestra el resultado del ciclo completo de reparación.
#>
$ErrorActionPreference = "Stop"

Write-Host "============================================================" -ForegroundColor Magenta
Write-Host " SANTIAGO - PRUEBA DE FUEGO: PIPELINE DE AUTO-CORRECCIÓN" -ForegroundColor Magenta
Write-Host "============================================================"

# --- Paso 1: Crear archivo Go de prueba con un defecto ---
Write-Host "`n[1/4] Creando archivo de prueba 'santiago-go/test-dummy.go'..." -ForegroundColor Yellow
$baseDir = if ($PSScriptRoot) { $PSScriptRoot } else { Get-Location }
$goProjectDir = Join-Path $baseDir "santiago-go"
$dummyFilePath = Join-Path $goProjectDir "test-dummy.go"
$dummyFileContent = @"
package main

import "fmt"

// this function adds two numbers
func AddNumbers(a int, b int) int {
	var result = a + b
	fmt.Println("The result is:", result) // Side effect, not ideal for a utility function
	return result
}
"@
Set-Content -Path $dummyFilePath -Value $dummyFileContent -Force
Write-Host " -> Archivo de prueba creado." -ForegroundColor Green

# --- Paso 2: Invocar el endpoint de auto-corrección del Gateway ---
Write-Host "`n[2/4] Enviando solicitud de auto-corrección al Gateway (127.0.0.1:34820)..." -ForegroundColor Yellow
$body = @{
    target_file        = $dummyFilePath
    problem_diagnostic = "Esta función tiene un efecto secundario (imprime en consola) que debe ser eliminado para que sea una función pura."
} | ConvertTo-Json

$uri = "http://127.0.0.1:34820/api/v1/fix"

try {
    $response = Invoke-RestMethod -Uri $uri -Method Post -Body $body -ContentType "application/json"

    Write-Host "`n[3/4] Respuesta recibida del orquestador:" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 10 | Write-Host

    Write-Host "`n[4/4] Verificando el archivo corregido..." -ForegroundColor Yellow
    $correctedContent = Get-Content -Path $dummyFilePath -Raw
    if ($correctedContent -notlike '*fmt.Println*') {
        Write-Host " -> ¡VERIFICADO! El efecto secundario fue eliminado del archivo." -ForegroundColor Green
    } else {
        Write-Host " -> ¡FALLO! El archivo no fue corregido como se esperaba." -ForegroundColor Red
    }

} catch {
    Write-Host "`n[ERROR] La prueba de fuego falló. No se pudo conectar con el Gateway de Santiago." -ForegroundColor Red
    Write-Host "Asegúrate de que la infraestructura esté corriendo con '.\start-santiago.ps1' antes de ejecutar este test." -ForegroundColor Red
    Write-Host "Detalle del error: $($_.Exception.Message)"
}