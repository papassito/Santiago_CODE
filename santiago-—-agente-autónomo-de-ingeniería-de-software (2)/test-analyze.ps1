<#
.SYNOPSIS
    Ejecuta una prueba de fuego de extremo a extremo del pipeline de análisis de código.
.DESCRIPTION
    Este script crea un archivo Go de prueba, invoca el endpoint /api/v1/analyze del
    Gateway de Santiago y muestra la respuesta completa del análisis cognitivo.
#>
$ErrorActionPreference = "Stop"

Write-Host "============================================================" -ForegroundColor Magenta
Write-Host " SANTIAGO - PRUEBA DE FUEGO: PIPELINE DE ANÁLISIS" -ForegroundColor Magenta
Write-Host "============================================================"

# --- Paso 1: Crear archivo Go de prueba ---
Write-Host "`n[1/3] Creando archivo de prueba 'santiago-go/test-dummy.go'..." -ForegroundColor Yellow
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

# --- Paso 2: Invocar el endpoint de análisis del Gateway ---
Write-Host "`n[2/3] Enviando solicitud de análisis al Gateway (127.0.0.1:34820)..." -ForegroundColor Yellow
$body = @{
    target_file = $dummyFilePath
    prompt      = "Analiza este código y dime qué hace y cómo mejorarlo en 2 oraciones."
} | ConvertTo-Json

$uri = "http://127.0.0.1:34820/api/v1/analyze"

try {
    $response = Invoke-RestMethod -Uri $uri -Method Post -Body $body -ContentType "application/json"

    # --- Paso 3: Mostrar la respuesta formateada ---
    Write-Host "`n[3/3] Respuesta recibida del orquestador:" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 5 | Write-Host
} catch {
    Write-Host "`n[ERROR] La prueba de fuego falló. No se pudo conectar con el Gateway de Santiago." -ForegroundColor Red
    Write-Host "Asegúrate de que la infraestructura esté corriendo con '.\start-santiago.ps1' antes de ejecutar este test." -ForegroundColor Red
    Write-Host "Detalle del error: $($_.Exception.Message)"
}