import React, { useState } from 'react';
import { 
  Boxes, 
  Terminal, 
  Layers, 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  FileCode, 
  Copy, 
  Check, 
  Play, 
  ExternalLink, 
  Cpu, 
  RefreshCw, 
  Search, 
  Lock,
  ArrowRight,
  Code2
} from 'lucide-react';

export const AntigravityVSCodeLab: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'antigravity' | 'vscode' | 'manifests'>('antigravity');
  const [selectedTool, setSelectedTool] = useState<'autofix' | 'rag' | 'ast' | 'bunker'>('autofix');
  const [isExecutingTool, setIsExecutingTool] = useState(false);
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [codeRefactored, setCodeRefactored] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Antigravity bridge simulated execution log
  const [toolLogs, setToolLogs] = useState<Array<{
    timestamp: string;
    sender: 'Antigravity' | 'Santiago-Core';
    message: string;
    status?: 'ok' | 'running' | 'warn';
  }>>([
    { timestamp: '21:12:40', sender: 'Antigravity', message: 'Handshake inicial establecido con agente antigravity-preview-05-2026', status: 'ok' },
    { timestamp: '21:12:41', sender: 'Santiago-Core', message: 'Loopback 127.0.0.1:34820 verificado. Herramientas registradas: 4', status: 'ok' },
  ]);

  const handleCopy = (filename: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedFile(filename);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  const handleRunTool = (tool: 'autofix' | 'rag' | 'ast' | 'bunker') => {
    setIsExecutingTool(true);
    const now = new Date().toLocaleTimeString();

    setToolLogs(prev => [
      ...prev,
      { timestamp: now, sender: 'Antigravity', message: `Invocando tool: santiago_${tool}_loop...`, status: 'running' }
    ]);

    setTimeout(() => {
      let resultMsg = '';
      if (tool === 'autofix') {
        resultMsg = 'AutoFix completado: Parche atómico aplicado (+ if err != nil return). Test 100% OK.';
      } else if (tool === 'rag') {
        resultMsg = 'RAG Local: Hallado en DICOM PS3.5 Pág. 45 - Explicit VR 32-bit offset verificado.';
      } else if (tool === 'ast') {
        resultMsg = 'AST Graph: _health_score=96.4/100, 28 funciones escaneadas, 0 ciclos circulares.';
      } else {
        resultMsg = 'Búnker AES-256: Paquete cifrado santiago_bunker_release.zip.enc generado en disco.';
      }

      setToolLogs(prev => [
        ...prev,
        { timestamp: new Date().toLocaleTimeString(), sender: 'Santiago-Core', message: resultMsg, status: 'ok' }
      ]);
      setIsExecutingTool(false);
    }, 850);
  };

  const antigravityManifest = `{
  "$schema": "https://antigravity.google/schemas/agent-v1.json",
  "name": "santiago-yeminoux",
  "version": "1.0.0",
  "description": "Agente Soberano de Ingeniería Bare-Metal acoplado a Google DeepMind Antigravity",
  "agent_id": "antigravity-preview-05-2026",
  "runtime": {
    "engine": "go1.22",
    "loopback_bridge": "http://127.0.0.1:34820",
    "cgo_enabled": 0,
    "cloud_cost_usd": 0.00
  },
  "capabilities": [
    "autofix_closed_loop",
    "rag_offline_talla1",
    "dna_enforcement",
    "bunker_aes256",
    "ast_graph_inspector"
  ],
  "tools": [
    {
      "name": "santiago_autofix_loop",
      "description": "Bucle autónomo de auto-refactor sin molestar al operador ante fallos de tests"
    },
    {
      "name": "santiago_local_rag_query",
      "description": "Motor de búsqueda vectorial offline de manuales DICOM y arquitectura KlikSoft"
    },
    {
      "name": "santiago_ast_health_score",
      "description": "Análisis estático de AST y puntuación de riesgo KRI"
    },
    {
      "name": "santiago_bunker_encrypt",
      "description": "Cifrado simétrico AES-256-GCM para empaque de seguridad"
    }
  ]
}`;

  const vscodeExtensionManifest = `{
  "name": "santiago-sovereign-assistant",
  "displayName": "Santiago Yeminoux — Sovereign Coding Agent",
  "version": "1.0.0",
  "publisher": "kliksoft",
  "engines": {
    "vscode": "^1.85.0"
  },
  "categories": ["Programming Languages", "Linters", "AI Assistants"],
  "activationEvents": [
    "onStartupFinished",
    "onLanguage:go",
    "onLanguage:typescript",
    "onLanguage:kotlin"
  ],
  "main": "./dist/extension.js",
  "contributes": {
    "viewsContainers": {
      "activitybar": [
        {
          "id": "santiago-explorer",
          "title": "Santiago Sovereign Core",
          "icon": "resources/santiago-shield.svg"
        }
      ]
    },
    "views": {
      "santiago-explorer": [
        {
          "id": "santiago.healthView",
          "name": "Health Score & KRI"
        },
        {
          "id": "santiago.ragView",
          "name": "Local RAG (Offline Docs)"
        },
        {
          "id": "santiago.autofixView",
          "name": "AutoFix History"
        }
      ]
    },
    "commands": [
      {
        "command": "santiago.runAutoFix",
        "title": "Santiago: Ejecutar Auto-Refactor en Archivo Activo"
      },
      {
        "command": "santiago.queryLocalRAG",
        "title": "Santiago: Consultar Manuales Locales (RAG Talla 1)"
      },
      {
        "command": "santiago.syncAntigravity",
        "title": "Santiago: Sincronizar con Google Antigravity Agent"
      },
      {
        "command": "santiago.exportBunker",
        "title": "Santiago: Exportar a Búnker Criptográfico (AES-256)"
      }
    ],
    "configuration": {
      "title": "Santiago Sovereign Core",
      "properties": {
        "santiago.serverUrl": {
          "type": "string",
          "default": "http://127.0.0.1:34820",
          "description": "Dirección loopback local del demonio Santiago en Go"
        },
        "santiago.dnaEnforcement": {
          "type": "string",
          "enum": ["strict", "warning", "off"],
          "default": "strict",
          "description": "Nivel de restricción de estilo según el ADN de Jesús"
        }
      }
    }
  }
}`;

  const vscodeTasksConfig = `{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Santiago: AutoFix Loop",
      "type": "shell",
      "command": "santiago --mode=autofix --target=\${file}",
      "group": {
        "kind": "build",
        "isDefault": true
      },
      "presentation": {
        "reveal": "always",
        "panel": "shared",
        "focus": false
      },
      "problemMatcher": "$go"
    },
    {
      "label": "Santiago: Iniciar Daemon Loopback (Port 34820)",
      "type": "shell",
      "command": "santiago --mode=server --port=34820",
      "isBackground": true,
      "problemMatcher": []
    }
  ]
}`;

  return (
    <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-950 space-y-6 shadow-xl font-mono">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-cyan-400 mb-1 uppercase tracking-wider">
            <span>ECOSISTEMAS EXTERNOS SOBERANOS</span>
            <span>•</span>
            <span>DEEPMIND & MICROSOFT</span>
          </div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Boxes className="w-5 h-5 text-cyan-400" />
            <span>Compatibilidad con Google Antigravity & Visual Studio Code</span>
          </h3>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl font-sans">
            Santiago expone un puente bidireccional en loopback (`127.0.0.1:34820`) que permite orquestarlo como subagente bare-metal desde <strong className="text-white">Google DeepMind Antigravity</strong> y como extensión nativa de <strong className="text-white">VS Code</strong> mediante Language Server Protocol (LSP) y Model Context Protocol (MCP).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-xs text-cyan-300 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Loopback: 127.0.0.1:34820</span>
          </span>
          <span className="px-3 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Costo Cloud: $0.00</span>
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
        <button
          onClick={() => setActiveSubTab('antigravity')}
          className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
            activeSubTab === 'antigravity'
              ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          <Boxes className="w-4 h-4" />
          <span>Google DeepMind Antigravity Bridge</span>
        </button>

        <button
          onClick={() => setActiveSubTab('vscode')}
          className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
            activeSubTab === 'vscode'
              ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>VS Code Native IDE Simulator</span>
        </button>

        <button
          onClick={() => setActiveSubTab('manifests')}
          className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
            activeSubTab === 'manifests'
              ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          <FileCode className="w-4 h-4" />
          <span>Manifiestos (.vsix & .antigravity)</span>
        </button>
      </div>

      {/* TAB 1: GOOGLE DEEPMIND ANTIGRAVITY */}
      {activeSubTab === 'antigravity' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></div>
              <div>
                <span className="text-white font-bold">Agente Host:</span>
                <span className="text-cyan-400 ml-1">antigravity-preview-05-2026</span>
              </div>
              <span className="text-zinc-600">|</span>
              <div>
                <span className="text-white font-bold">Subordinado Bare-Metal:</span>
                <span className="text-emerald-400 ml-1">Santiago Yeminoux Core (Go 1.22)</span>
              </div>
            </div>
            <div className="text-zinc-400 text-[11px]">
              Protocolo: JSON-RPC sobre Loopback HTTP/WebSocket
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left: Toolhooks exposed to Antigravity */}
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
              <div className="text-xs text-zinc-300 font-bold uppercase tracking-wider flex items-center justify-between">
                <span>Herramientas para Antigravity</span>
                <span className="text-[10px] text-cyan-400">4 Disponibles</span>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => setSelectedTool('autofix')}
                  className={`w-full p-2.5 rounded-lg border text-left text-xs transition-all ${
                    selectedTool === 'autofix'
                      ? 'bg-cyan-950/50 border-cyan-500 text-white'
                      : 'bg-black/40 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="font-bold flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                    <span>santiago_autofix_loop</span>
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-1 font-sans">
                    Bucle cerrado de corrección automática ante fallos de tests unitarios
                  </div>
                </button>

                <button
                  onClick={() => setSelectedTool('rag')}
                  className={`w-full p-2.5 rounded-lg border text-left text-xs transition-all ${
                    selectedTool === 'rag'
                      ? 'bg-cyan-950/50 border-cyan-500 text-white'
                      : 'bg-black/40 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="font-bold flex items-center gap-1.5">
                    <Search className="w-3.5 h-3.5 text-cyan-400" />
                    <span>santiago_local_rag_query</span>
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-1 font-sans">
                    Consultas vectoriales offline a manuales DICOM y arquitectura KlikSoft
                  </div>
                </button>

                <button
                  onClick={() => setSelectedTool('ast')}
                  className={`w-full p-2.5 rounded-lg border text-left text-xs transition-all ${
                    selectedTool === 'ast'
                      ? 'bg-cyan-950/50 border-cyan-500 text-white'
                      : 'bg-black/40 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="font-bold flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-purple-400" />
                    <span>santiago_ast_health_score</span>
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-1 font-sans">
                    Cálculo del _health_score y reporte de complejidad ciclomática KRI
                  </div>
                </button>

                <button
                  onClick={() => setSelectedTool('bunker')}
                  className={`w-full p-2.5 rounded-lg border text-left text-xs transition-all ${
                    selectedTool === 'bunker'
                      ? 'bg-cyan-950/50 border-cyan-500 text-white'
                      : 'bg-black/40 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="font-bold flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>santiago_bunker_encrypt</span>
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-1 font-sans">
                    Empaquetado y cifrado simétrico AES-256-GCM para entrega segura
                  </div>
                </button>
              </div>

              <button
                onClick={() => handleRunTool(selectedTool)}
                disabled={isExecutingTool}
                className="w-full py-2 px-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-black text-xs font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isExecutingTool ? 'Ejecutando en Bare-Metal...' : 'Despachar a Santiago desde Antigravity'}</span>
              </button>
            </div>

            {/* Right: Live Event Telemetry & Bridge Logs */}
            <div className="lg:col-span-2 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-300 font-bold uppercase tracking-wider flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span>Telemetría de Puente Bidireccional (Antigravity ↔ Santiago)</span>
                </span>
                <span className="text-[10px] text-zinc-500">Live JSON-RPC Feed</span>
              </div>

              <div className="p-3 bg-black rounded-lg border border-zinc-800/80 font-mono text-[11px] h-64 overflow-y-auto space-y-2">
                {toolLogs.map((log, idx) => (
                  <div key={idx} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-zinc-600 select-none">[{log.timestamp}]</span>
                    <span className={`px-1 rounded text-[10px] font-bold ${
                      log.sender === 'Antigravity' ? 'bg-cyan-950 text-cyan-300' : 'bg-emerald-950 text-emerald-300'
                    }`}>
                      {log.sender}
                    </span>
                    <span className={log.status === 'ok' ? 'text-zinc-300' : 'text-amber-400 animate-pulse'}>
                      {log.message}
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 text-[11px] text-zinc-400 flex items-center justify-between">
                <span>Estado de Sesión Antigravity:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  ONLINE • Sincronizado sin costo cloud
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: VS CODE NATIVE IDE SIMULATOR */}
      {activeSubTab === 'vscode' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs text-zinc-300">
              Simulador interactivo de la extensión oficial de VS Code: <strong className="text-white">santiago-sovereign-assistant</strong>.
            </div>
            <button
              onClick={() => setCommandPaletteOpen(!commandPaletteOpen)}
              className="px-3 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 border border-zinc-700 flex items-center gap-1.5"
            >
              <Terminal className="w-3 h-3 text-cyan-400" />
              <span>Abrir Command Palette (Ctrl+Shift+P)</span>
            </button>
          </div>

          {/* Command Palette Modal Simulator */}
          {commandPaletteOpen && (
            <div className="p-3 bg-zinc-900 border border-cyan-500/50 rounded-xl shadow-2xl space-y-2 text-xs">
              <div className="text-[10px] text-zinc-400 uppercase tracking-wider">Command Palette: Santiago Sovereign</div>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    setCodeRefactored(true);
                    setCommandPaletteOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 text-cyan-200 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Santiago: Ejecutar Auto-Refactor en Archivo Activo (Aplicar ADN Jesús)</span>
                  </span>
                  <span className="text-[10px] text-zinc-400">Ctrl+Alt+R</span>
                </button>
                <button
                  onClick={() => setCommandPaletteOpen(false)}
                  className="w-full text-left px-3 py-2 rounded bg-zinc-950 hover:bg-zinc-800 text-zinc-300 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Search className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Santiago: Consultar Manuales Locales (RAG Talla 1)</span>
                  </span>
                  <span className="text-[10px] text-zinc-400">Ctrl+Alt+Q</span>
                </button>
              </div>
            </div>
          )}

          {/* Simulated VS Code Window */}
          <div className="rounded-xl border border-zinc-800 bg-[#1e1e1e] overflow-hidden text-xs shadow-2xl font-mono">
            {/* Title Bar */}
            <div className="h-8 bg-[#323233] px-3 flex items-center justify-between border-b border-zinc-700 text-zinc-400 text-[11px]">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                <span className="text-zinc-200 ml-2 font-sans font-medium">patient_service.go — Visual Studio Code (Santiago Sovereign Mode)</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>LSP: Santiago Daemon Active</span>
              </div>
            </div>

            {/* Main Workbench Layout */}
            <div className="flex h-96">
              {/* Activity Bar */}
              <div className="w-12 bg-[#333333] flex flex-col items-center py-3 gap-4 border-r border-zinc-800 text-zinc-400">
                <div className="p-1.5 rounded text-white bg-cyan-600/30 border border-cyan-500/40" title="Santiago Sovereign Core">
                  <ShieldCheck className="w-5 h-5 text-cyan-400" />
                </div>
                <div className="p-1.5 hover:text-white" title="Explorer">
                  <Layers className="w-5 h-5" />
                </div>
                <div className="p-1.5 hover:text-white" title="Search">
                  <Search className="w-5 h-5" />
                </div>
                <div className="p-1.5 hover:text-white" title="Extensions">
                  <Boxes className="w-5 h-5" />
                </div>
              </div>

              {/* Sidebar View: Santiago Explorer */}
              <div className="w-64 bg-[#252526] border-r border-zinc-800 p-3 space-y-3 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="text-[11px] text-zinc-300 font-bold uppercase tracking-wider flex items-center justify-between border-b border-zinc-700/60 pb-1.5">
                    <span>SANTIAGO SOVEREIGN</span>
                    <span className="text-[10px] text-emerald-400 font-mono">v1.0</span>
                  </div>

                  {/* Health Score Card */}
                  <div className="p-2.5 rounded-lg bg-[#1e1e1e] border border-zinc-700 space-y-1">
                    <div className="text-[10px] text-zinc-400 flex items-center justify-between">
                      <span>_health_score:</span>
                      <span className="text-emerald-400 font-bold">96.4 / 100</span>
                    </div>
                    <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full w-[96.4%]"></div>
                    </div>
                    <div className="text-[9px] text-zinc-500 pt-0.5">KRI: 0 Incidentes críticos</div>
                  </div>

                  {/* Quick Status List */}
                  <div className="space-y-1.5 text-[10px]">
                    <div className="p-1.5 rounded bg-zinc-900/80 flex items-center justify-between text-zinc-300">
                      <span>ADN de Jesús:</span>
                      <span className="text-amber-400 font-bold">ESTRICTO</span>
                    </div>
                    <div className="p-1.5 rounded bg-zinc-900/80 flex items-center justify-between text-zinc-300">
                      <span>Local RAG:</span>
                      <span className="text-cyan-400">14 Manuales Ingestados</span>
                    </div>
                    <div className="p-1.5 rounded bg-zinc-900/80 flex items-center justify-between text-zinc-300">
                      <span>DeepIntegrationTester:</span>
                      <span className="text-emerald-400">100% Pasando</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setCodeRefactored(!codeRefactored)}
                  className="w-full py-1.5 px-2 rounded bg-cyan-600 hover:bg-cyan-500 text-black font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>{codeRefactored ? 'Revertir a Código Previo' : 'Auto-Refactor ADN Jesús'}</span>
                </button>
              </div>

              {/* Editor Workspace */}
              <div className="flex-1 bg-[#1e1e1e] p-4 flex flex-col justify-between overflow-y-auto">
                <div className="space-y-2">
                  <div className="text-xs text-zinc-400 border-b border-zinc-800 pb-2 flex items-center justify-between">
                    <span className="text-zinc-200">pkg/patient/patient_service.go</span>
                    <span className="text-[10px] text-zinc-500">Go 1.22.4</span>
                  </div>

                  {/* Code with or without Santiago Refactor */}
                  <div className="text-[11px] leading-relaxed font-mono">
                    <span className="text-purple-400">func</span> <span className="text-yellow-300">RegisterPatient</span>(ctx context.Context, p Patient) (*Patient, error) &#123;<br />
                    
                    {!codeRefactored ? (
                      <>
                        <span className="text-zinc-500 ml-4">// Código antes de intervención Santiago: anidamiento múltiple</span><br />
                        <span className="text-purple-400 ml-4">if</span> p.FullName != "" &#123;<br />
                        <span className="text-purple-400 ml-8">if</span> p.NationalID != "" &#123;<br />
                        <span className="text-purple-400 ml-12">if</span> p.BirthDate.Before(time.Now()) &#123;<br />
                        <div className="my-1.5 p-2 bg-amber-950/40 border-l-2 border-amber-500 rounded text-amber-300 text-[10px] font-sans">
                          <strong>[LSP Diagnostic: Santiago-DNA]</strong> Anidamiento if/else mayor a 3 niveles detectado. Aplica guard clauses y retornos tempranos.
                          <button
                            onClick={() => setCodeRefactored(true)}
                            className="ml-2 px-1.5 py-0.5 rounded bg-amber-500 text-black font-bold text-[9px] hover:bg-amber-400"
                          >
                            QuickFix: Aplicar Refactor
                          </button>
                        </div>
                        <span className="text-zinc-300 ml-16">return s.repo.Save(ctx, p)</span><br />
                        <span className="ml-12">&#125;</span><br />
                        <span className="ml-8">&#125;</span><br />
                        <span className="ml-4">&#125;</span><br />
                        <span className="text-purple-400 ml-4">return</span> nil, errors.New("invalid patient data")<br />
                      </>
                    ) : (
                      <>
                        <span className="text-emerald-400 ml-4">// Refactorizado por Santiago: Guard Clauses & Early Returns (ADN Jesús)</span><br />
                        <span className="text-purple-400 ml-4">if</span> p.FullName == "" &#123;<br />
                        <span className="text-purple-400 ml-8">return</span> nil, errors.New("nombre obligatorio")<br />
                        <span className="ml-4">&#125;</span><br />
                        <span className="text-purple-400 ml-4">if</span> p.NationalID == "" &#123;<br />
                        <span className="text-purple-400 ml-8">return</span> nil, errors.New("cédula obligatoria")<br />
                        <span className="ml-4">&#125;</span><br />
                        <span className="text-purple-400 ml-4">if</span> !p.BirthDate.Before(time.Now()) &#123;<br />
                        <span className="text-purple-400 ml-8">return</span> nil, errors.New("fecha de nacimiento inválida")<br />
                        <span className="ml-4">&#125;</span><br />
                        <span className="text-emerald-300 ml-4 font-bold">return s.repo.Save(ctx, p)</span><br />
                      </>
                    )}
                    &#125;
                  </div>
                </div>

                <div className="p-2 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400 flex items-center justify-between">
                  <span>Language Server Protocol:</span>
                  <span className="text-cyan-400">textDocument/publishDiagnostics: 0 errores, 0 warnings</span>
                </div>
              </div>
            </div>

            {/* Status Bar */}
            <div className="h-6 bg-[#007acc] text-white px-3 flex items-center justify-between text-[10px]">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 font-bold">
                  <ShieldCheck className="w-3 h-3" /> Santiago: 96.4/100
                </span>
                <span>•</span>
                <span>Antigravity: Sincronizado</span>
                <span>•</span>
                <span>Go: 1.22.4 Bare-Metal</span>
              </div>
              <div className="flex items-center gap-2">
                <span>UTF-8</span>
                <span>LF</span>
                <span>Go</span>
                <span>Costo: $0.00</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MANIFESTS & CONFIG GENERATOR */}
      {activeSubTab === 'manifests' && (
        <div className="space-y-4">
          <div className="text-xs text-zinc-300">
            Archivos canónicos para empaquetar la extensión de VS Code e integrar Santiago en workspaces de Google Antigravity:
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Manifest 1: Antigravity agent spec */}
            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-cyan-400 font-bold">.antigravity/agent.json</span>
                <button
                  onClick={() => handleCopy('.antigravity/agent.json', antigravityManifest)}
                  className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] flex items-center gap-1 transition-colors"
                >
                  {copiedFile === '.antigravity/agent.json' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedFile === '.antigravity/agent.json' ? 'Copiado' : 'Copiar'}</span>
                </button>
              </div>
              <pre className="p-3 bg-black rounded-lg border border-zinc-800 text-[10px] text-zinc-300 overflow-x-auto max-h-56 leading-relaxed">
                {antigravityManifest}
              </pre>
            </div>

            {/* Manifest 2: VS Code Extension Manifest */}
            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-emerald-400 font-bold">extension/package.json (.vsix)</span>
                <button
                  onClick={() => handleCopy('extension/package.json', vscodeExtensionManifest)}
                  className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] flex items-center gap-1 transition-colors"
                >
                  {copiedFile === 'extension/package.json' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedFile === 'extension/package.json' ? 'Copiado' : 'Copiar'}</span>
                </button>
              </div>
              <pre className="p-3 bg-black rounded-lg border border-zinc-800 text-[10px] text-zinc-300 overflow-x-auto max-h-56 leading-relaxed">
                {vscodeExtensionManifest}
              </pre>
            </div>

            {/* Config 3: .vscode/tasks.json */}
            <div className="md:col-span-2 p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-purple-400 font-bold">.vscode/tasks.json (Integración de Compilador y Daemon)</span>
                <button
                  onClick={() => handleCopy('.vscode/tasks.json', vscodeTasksConfig)}
                  className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] flex items-center gap-1 transition-colors"
                >
                  {copiedFile === '.vscode/tasks.json' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedFile === '.vscode/tasks.json' ? 'Copiado' : 'Copiar'}</span>
                </button>
              </div>
              <pre className="p-3 bg-black rounded-lg border border-zinc-800 text-[10px] text-zinc-300 overflow-x-auto max-h-40 leading-relaxed">
                {vscodeTasksConfig}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
