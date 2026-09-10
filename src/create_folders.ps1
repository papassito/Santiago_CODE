# SANTIAGO CODE — BASE FOLDER CREATION SCRIPT

$RootDir = $PSScriptRoot
if ($PSScriptRoot -and (Split-Path $PSScriptRoot -Leaf) -eq "scripts") {
    $RootDir = Split-Path $PSScriptRoot -Parent
}
if (-not $RootDir) {
    $RootDir = Get-Location
}

$Folders = @("docs", "phases")

foreach ($Folder in $Folders) {
    $TargetPath = Join-Path $RootDir $Folder
    Write-Output "Verificando carpeta: $TargetPath"

    if (Test-Path -Path $TargetPath -PathType Container) {
        Write-Output "La carpeta '$Folder' ya existe. Conservando sin modificar su contenido."
    } else {
        Write-Output "Creando carpeta: $TargetPath"
        try {
            $null = New-Item -Path $TargetPath -ItemType Directory -ErrorAction Stop
            Write-Output "Carpeta '$Folder' creada correctamente."
        } catch {
            Write-Error "ERROR: No se pudo crear la carpeta '$Folder'. Detalles: $_"
            exit 1
        }
    }
}

Write-Output "`n--- EVIDENCIA DE EXISTENCIA ---"
foreach ($Folder in $Folders) {
    $TargetPath = Join-Path $RootDir $Folder
    if (Test-Path -Path $TargetPath -PathType Container) {
        $DirInfo = Get-Item -Path $TargetPath
        Write-Output "CONFIRMADO: Carpeta [$Folder] existe en la ruta: $TargetPath (Ultima Modificacion: $($DirInfo.LastWriteTime))"
    } else {
        Write-Error "ERROR DE VERIFICACION: La carpeta [$Folder] no fue encontrada en: $TargetPath"
        exit 1
    }
}