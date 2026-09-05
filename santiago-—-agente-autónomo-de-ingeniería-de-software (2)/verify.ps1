$ErrorActionPreference = "Continue"
$Failures = New-Object System.Collections.Generic.List[string]
$Warnings = New-Object System.Collections.Generic.List[string]
$Results  = New-Object System.Collections.Generic.List[object]

function Run-Step {
    param(
        [string]$Name,
        [scriptblock]$Command
    )
    Write-Host ""
    Write-Host "============================================================" -ForegroundColor Cyan
    Write-Host $Name -ForegroundColor Cyan
    Write-Host "============================================================" -ForegroundColor Cyan

    & $Command
    $code = $LASTEXITCODE

    if ($code -eq 0) {
        Write-Host "[PASS] $Name" -ForegroundColor Green
        $Results.Add([PSCustomObject]@{
            Comando = $Name
            Resultado = "PASS"
            ExitCode = $code
        })
    }
    else {
        Write-Host "[FAIL] $Name  (exit code: $code)" -ForegroundColor Red
        $Failures.Add("$Name (exit code: $code)")
        $Results.Add([PSCustomObject]@{
            Comando = $Name
            Resultado = "FAIL"
            ExitCode = $code
        })
    }

    return $code
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Magenta
Write-Host " SANTIAGO — VERIFICACIÓN REAL DEL PROYECTO" -ForegroundColor Magenta
Write-Host "============================================================" -ForegroundColor Magenta
Write-Host ""

Write-Host "[0] Identificando workspace..." -ForegroundColor Yellow
Get-Location
go version
node --version
npm --version

if (Test-Path "package.json") {
    Run-Step "npm install" { npm install }
    Run-Step "npm run lint" { npm run lint }
    Run-Step "npm run build" { npm run build }
} else {
    Write-Host "[WARNING] No existe package.json en la raíz." -ForegroundColor Yellow
    $Warnings.Add("No existe package.json en la raíz.")
}

$GoModule = Join-Path (Get-Location) "santiago-go"
if (-not (Test-Path $GoModule)) {
    Write-Host "[FAIL] No existe el directorio santiago-go." -ForegroundColor Red
    $Failures.Add("No existe santiago-go.")
} else {
    Push-Location $GoModule
    try {
        Run-Step "go mod tidy" { go mod tidy }
        Run-Step "gofmt -l ." {
            $formatted = gofmt -l .
            if ($formatted) {
                Write-Host "Archivos no formateados:" -ForegroundColor Yellow
                $formatted | ForEach-Object { Write-Host "  $_" -ForegroundColor Yellow }
                exit 1
            }
        }
        Run-Step "go vet ./..." { go vet ./... }
        Run-Step "go test ./..." { go test ./... }
        Run-Step "go build ./cmd/santiago" { go build ./cmd/santiago }
    } finally {
        Pop-Location
    }
}

if (Test-Path "package.json") {
    Write-Host ""
    Write-Host "============================================================" -ForegroundColor Cyan
    Write-Host "npm audit — DIAGNÓSTICO DE SEGURIDAD" -ForegroundColor Cyan
    Write-Host "============================================================" -ForegroundColor Cyan
    npm audit
    $auditCode = $LASTEXITCODE
    if ($auditCode -ne 0) {
        Write-Host "[WARNING] npm audit reportó vulnerabilidades." -ForegroundColor Yellow
        $Warnings.Add("npm audit reportó vulnerabilidades.")
    } else {
        Write-Host "[PASS] npm audit no reportó vulnerabilidades." -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Magenta
Write-Host " RESULTADO FINAL — NO MANIPULADO" -ForegroundColor Magenta
Write-Host "============================================================" -ForegroundColor Magenta
Write-Host ""
$Results | Format-Table -AutoSize

if ($Failures.Count -gt 0) {
    Write-Host "ESTADO FINAL: FAIL" -ForegroundColor Red
    $Failures | ForEach-Object { Write-Host " - $_" -ForegroundColor Red }
} else {
    Write-Host "ESTADO FINAL: CERTIFICADO (PASS)" -ForegroundColor Green
}
