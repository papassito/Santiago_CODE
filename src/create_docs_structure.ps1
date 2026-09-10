# SANTIAGO CODE — DOCUMENTATION STRUCTURE CREATION SCRIPT
# Este script crea de forma idempotente y segura la estructura documental autorizada.
# Respeta estrictamente las reglas de modificacion controlada (Zero Overwrite / Zero Modification).

$RootDir = $PSScriptRoot
if ($PSScriptRoot -and (Split-Path $PSScriptRoot -Leaf) -eq "src") {
    $RootDir = Split-Path $PSScriptRoot -Parent
}
if (-not $RootDir) {
    $RootDir = Get-Location
}

# 1. Validar la existencia de los directorios raiz baselines
$DocsDir = Join-Path $RootDir "docs"
$PhasesDir = Join-Path $RootDir "phases"

if (-not (Test-Path -Path $DocsDir -PathType Container)) {
    Write-Error "ERROR CRITICO: La carpeta raiz 'docs' no existe en la ruta: $DocsDir. Operacion abortada."
    exit 1
}

if (-not (Test-Path -Path $PhasesDir -PathType Container)) {
    Write-Error "ERROR CRITICO: La carpeta raiz 'phases' no existe en la ruta: $PhasesDir. Operacion abortada."
    exit 1
}

# 2. Definir subdirectorios autorizados a crear bajo la gobernanza de SITEMAP.md
$SubDirectories = @(
    "docs/architecture",
    "docs/architecture/ADR",
    "docs/contracts",
    "docs/security",
    "docs/governance",
    "docs/evidence",
    "docs/development",
    "docs/operations"
)

# Creacion controlada de subdirectorios
foreach ($SubDir in $SubDirectories) {
    $FullPath = Join-Path $RootDir $SubDir
    Write-Output "Verificando subdirectorio: $SubDir"
    if (-not (Test-Path -Path $FullPath -PathType Container)) {
        try {
            $null = New-Item -Path $FullPath -ItemType Directory -ErrorAction Stop
            Write-Output "-> CREADO: $SubDir"
        } catch {
            Write-Error "ERROR CRITICO: No se pudo crear el subdirectorio '$SubDir'. Detalles: $_"
            exit 1
        }
    } else {
        Write-Output "-> YA EXISTE: $SubDir (Conservado intacto)"
    }
}

# 3. Definir archivos autorizados a crear
$AuthorizedFiles = @(
    "docs/README.md",
    "docs/architecture/ARCHITECTURE.md",
    "docs/architecture/ADR/README.md",
    "docs/contracts/README.md",
    "docs/contracts/AGENT_CONTRACT.md",
    "docs/contracts/WORKSPACE_CONTRACT.md",
    "docs/contracts/TOOL_CONTRACT.md",
    "docs/contracts/AI_PROVIDER_CONTRACT.md",
    "docs/security/README.md",
    "docs/security/THREAT_MODEL.md",
    "docs/security/PERMISSIONS.md",
    "docs/governance/README.md",
    "docs/governance/TRACEABILITY.md",
    "docs/evidence/README.md",
    "docs/evidence/EVIDENCE_POLICY.md",
    "docs/development/BUILD.md",
    "docs/development/TESTING.md",
    "docs/development/LOGGING.md",
    "docs/development/ERROR_HANDLING.md",
    "docs/operations/INSTALLATION.md",
    "docs/operations/CONFIGURATION.md",
    "docs/operations/RECOVERY.md",
    "phases/README.md",
    "phases/PHASE-00-CONTRACT.md"
)

# Creacion controlada de archivos con encabezado minimo de borrador (STATUS: DRAFT)
foreach ($FileRelPath in $AuthorizedFiles) {
    $FullPath = Join-Path $RootDir $FileRelPath
    Write-Output "Verificando archivo: $FileRelPath"
    
    if (-not (Test-Path -Path $FullPath -PathType Leaf)) {
        $FileNameOnly = Split-Path $FileRelPath -Leaf
        $DocNameClean = $FileNameOnly.Replace(".md", "").Replace("_", " ").ToUpper()
        
        $InitialContent = @"
# $DocNameClean
STATUS: DRAFT
"@
        try {
            $InitialContent | Out-File -FilePath $FullPath -Encoding utf8 -NoClobber -ErrorAction Stop
            Write-Output "-> CREADO: $FileRelPath"
        } catch {
            Write-Error "ERROR CRITICO: Fallo al crear el archivo '$FileRelPath'. Detalles: $_"
            exit 1
        }
    } else {
        Write-Output "-> YA EXISTE: $FileRelPath (PRESERVADO SIN MODIFICACIONES)"
    }
}

# 4. Seccion de Evidencia Final y Reporte de Integridad
Write-Output "`n========================================================"
Write-Output "       SANTIAGO CODE — EVIDENCIA DE ESTRUCTURA"
Write-Output "========================================================"

foreach ($SubDir in $SubDirectories) {
    $FullPath = Join-Path $RootDir $SubDir
    if (Test-Path -Path $FullPath -PathType Container) {
        Write-Output "[DIR]  CONFIRMADO -> $SubDir"
    } else {
        Write-Error "[DIR]  ERROR: Falta subdirectorio -> $SubDir"
    }
}

foreach ($FileRelPath in $AuthorizedFiles) {
    $FullPath = Join-Path $RootDir $FileRelPath
    if (Test-Path -Path $FullPath -PathType Leaf) {
        $Size = (Get-Item -Path $FullPath).Length
        Write-Output "[FILE] CONFIRMADO -> $FileRelPath ($Size bytes)"
    } else {
        Write-Error "[FILE] ERROR: Falta archivo -> $FileRelPath"
    }
}
Write-Output "========================================================"
Write-Output "Estructura documental verificada. Operacion exitosa."
