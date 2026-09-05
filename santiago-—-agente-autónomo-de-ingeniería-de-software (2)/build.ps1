<#
.SYNOPSIS
    Script de Compilacion Pura (Build) - Proyecto Santiago
.DESCRIPTION
    Compila los 4 micro-daemons de Go en ejecutables .exe dentro de la carpeta /bin.
#>
$ErrorActionPreference = "Stop"

# --- 1. Resolucion Inteligente de Rutas ---
$currentPath = (Get-Location).Path
if (Test-Path (Join-Path -Path $currentPath -ChildPath "cmd")) {
    $goProjectDir = $currentPath
} else {
    $goProjectDir = Join-Path -Path $currentPath -ChildPath "santiago-go"
}

$binDir = Join-Path -Path $goProjectDir -ChildPath "bin"

if (-not (Test-Path -Path $binDir)) {
    New-Item -ItemType Directory -Path $binDir | Out-Null
}

Write-Host "========================================================================" -ForegroundColor Cyan
Write-Host " INICIANDO PROCESO DE COMPILACION (BUILD)" -ForegroundColor White
Write-Host " Ruta base: $goProjectDir" -ForegroundColor Gray
Write-Host "========================================================================" -ForegroundColor Cyan

$targets = @(
    @{ Name = "gateway.exe"; Package = "./cmd/gateway" },
    @{ Name = "rag.exe";     Package = "./cmd/rag" },
    @{ Name = "runner.exe";  Package = "./cmd/runner" },
    @{ Name = "vault.exe";   Package = "./cmd/vault" }
)

Push-Location -Path $goProjectDir

try {
    foreach ($target in $targets) {
        $outputPath = Join-Path -Path $binDir -ChildPath $target.Name
        Write-Host "Compilando $($target.Name) desde $($target.Package)... " -NoNewline -ForegroundColor Yellow
        
        $buildOutput = go build -o $outputPath $($target.Package) 2>&1
        if ($LASTEXITCODE -eq 0) {
            $sizeMB = (Get-Item -Path $outputPath).Length / 1MB
            $formattedSize = [math]::Round($sizeMB, 2)
            $msg = "[OK - " + $formattedSize + " MB]"
            Write-Host $msg -ForegroundColor Green
        } else {
            Write-Host "[FALLO]" -ForegroundColor Red
            Write-Host "Detalle del error de compilacion:" -ForegroundColor DarkRed
            Write-Host $buildOutput -ForegroundColor Red
            exit 1
        }
    }
    Write-Host "========================================================================" -ForegroundColor Cyan
    Write-Host " BUILD COMPLETADO CON EXITO: Todos los binarios estan en /bin" -ForegroundColor Green
    Write-Host "========================================================================" -ForegroundColor Cyan
}
finally {
    Pop-Location
}