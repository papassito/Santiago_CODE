#define MyAppName "Santiago Agent"
#define MyAppVersion "0.1.0-alpha"
#define MyAppPublisher "Local & Sovereign"
#define MyAppExe "gateway.exe"
#define SourceDir "release\santiago-agent-v0.1.0-alpha-windows-amd64"

[Setup]
AppId={{D3F1E7C4-9A21-4E89-B853-2F10A0B36741}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}
DefaultDirName={autopf}\SantiagoAgent
DefaultGroupName={#MyAppName}
OutputBaseFilename=SantiagoAgentSetup-v{#MyAppVersion}
OutputDir=release
Compression=lzma2/ultra64
SolidCompression=yes
WizardStyle=modern
PrivilegesRequired=lowest

[Files]
; Copia todos los ejecutables, scripts e instrucciones del directorio de release
Source: "{#SourceDir}\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
; Crear accesos directos en el menú Inicio
Name: "{group}\Iniciar Santiago Agent"; Filename: "powershell.exe"; Parameters: "-ExecutionPolicy Bypass -NoExit -File ""{app}\start-santiago.ps1"""; IconFilename: "{app}\{#MyAppExe}"
Name: "{group}\Detener Santiago Agent"; Filename: "powershell.exe"; Parameters: "-ExecutionPolicy Bypass -File ""{app}\stop-santiago.ps1"""
Name: "{group}\Diagnóstico del Enjambre"; Filename: "powershell.exe"; Parameters: "-ExecutionPolicy Bypass -NoExit -File ""{app}\diagnostico.ps1"""
Name: "{group}\Desinstalar {#MyAppName}"; Filename: "{uninstallexe}"

[Run]
; Opción para iniciar los micro-daemons al finalizar la instalación
Filename: "powershell.exe"; Parameters: "-ExecutionPolicy Bypass -File ""{app}\start-santiago.ps1"""; Description: "Iniciar los 4 micro-daemons de Santiago"; Flags: postinstall runhidden unchecked

[UninstallRun]
; Detener los micro-daemons antes de borrar los archivos en la desinstalación
Filename: "powershell.exe"; Parameters: "-ExecutionPolicy Bypass -File ""{app}\stop-santiago.ps1"""; Flags: runhidden