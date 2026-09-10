import { useState, useEffect, useCallback } from 'react';
import { TitleBar } from './components/TitleBar';
import { ActivityBar, ActivityView } from './components/ActivityBar';
import { FileExplorer } from './components/FileExplorer';
import { MonacoCodeEditor } from './components/MonacoCodeEditor';
import { SantiagoChatSidebar } from './components/SantiagoChatSidebar';
import { SwarmDaemonsPanel } from './components/SwarmDaemonsPanel';
import { ExtensionSourceViewer } from './components/ExtensionSourceViewer';
import { BottomPanel } from './components/BottomPanel';
import { MasterArchitectureView } from './components/MasterArchitectureView';
import { VSCodePluginHostView } from './components/VSCodePluginHostView';
import { StatusBar } from './components/StatusBar';

import {
  EditorFile,
  ChatMessage,
  SwarmDaemon,
  InterfaceMode,
  BottomPanelTab,
  DiagnosticProblem,
} from './types';
import { INITIAL_EDITOR_FILES } from './services/sampleFiles';
import { swarmSimulator } from './services/mockDaemonSwarm';
import { voiceEngine, VoiceEngineState } from './services/voiceEngine';
import { EXTENSION_DELIVERABLE_FILES } from './services/extensionFiles';
import JSZip from 'jszip';

export default function App() {
  // Master Architecture: "UNA INTELIGENCIA — DOS INTERFACES"
  const [interfaceMode, setInterfaceMode] = useState<InterfaceMode>('studio');

  // Studio IDE View State
  const [activeView, setActiveView] = useState<ActivityView>('chat');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Bottom Panel State (Terminal Runner, Problems, Git, Debugger, Audit, RAG)
  const [isBottomPanelOpen, setIsBottomPanelOpen] = useState(true);
  const [bottomPanelTab, setBottomPanelTab] = useState<BottomPanelTab>('terminal');

  // Files & Editor State
  const [files, setFiles] = useState<EditorFile[]>(INITIAL_EDITOR_FILES);
  const [activeFileId, setActiveFileId] = useState<string>(INITIAL_EDITOR_FILES[0]?.id || '');
  const [cursorPosition, setCursorPosition] = useState<{ line: number; column: number }>({
    line: 1,
    column: 1,
  });
  const [insertedSnippet, setInsertedSnippet] = useState<string | null>(null);

  // Diagnostics & Problems
  const [problems, setProblems] = useState<DiagnosticProblem[]>(swarmSimulator.getProblems());

  // Swarm Daemons State
  const [daemons, setDaemons] = useState<SwarmDaemon[]>(swarmSimulator.getDaemons());
  const [isAllHealthy, setIsAllHealthy] = useState<boolean>(true);

  // Santiago Chat & Agent State (Shared across Studio and Plugin!)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: `### 🤖 SANTIAGO — Entorno de Simulación (Fase 00)
> **"UNA INTELIGENCIA — DOS INTERFACES"**

Regla Suprema Oficial:
\`VER -> ENTENDER -> DECIDIR -> ACTUAR -> VERIFICAR\`
*No inventar. La última palabra la tiene la evidencia de ejecución.*

**AVISO DE GOBERNANZA**: Este entorno ejecuta una **SIMULACIÓN** de los componentes autorizados en COMPONENTS.md. No se realiza ninguna operación física real de borrado, ejecución ni cifrado en el host, dado que los adaptadores reales no están implementados ni verificados en el baseline maestro.

Subsistemas autorizados en simulación:
- **SANTIAGO ENGINE** — Orquestador y núcleo de reglas, gobernanza y seguridad.
- **CASA DE SANTIAGO** — Interfaz de usuario y entorno de edición principal.
- **SANTIAGO VOICE** — Módulo de procesamiento de comandos e intenciones por voz.
- **SANTIAGO VS CODE EXTENSION** — Cliente de integración externa.

**Prueba ahora**:
1. Usa el selector superior para alternar entre **Santiago Studio (IDE)**, **Santiago Plugin (VS Code)** y la vista de **Arquitectura**.
2. Escribe código en el editor para probar la simulación de autocompletado de texto.
3. Interactúa con el chat del asistente para consultar el estado del sistema.
4. Haz clic en **Agente Autónomo** para simular la ejecución del bucle de control.`,
      timestamp: '10:00 AM',
    },
  ]);
  const [isStreaming, setIsStreaming] = useState(false);

  // Voice Engine State (Whisper.cpp + Piper TTS)
  const [voiceState, setVoiceState] = useState<VoiceEngineState>({
    isListening: false,
    isSpeaking: false,
    transcript: '',
    voiceEngineName: 'SANTIAGO VOICE (Simulación)',
    ttsEngineName: 'SANTIAGO VOICE (Síntesis)',
    supported: true,
  });

  // Track voice engine
  useEffect(() => {
    const unsubscribe = voiceEngine.subscribe((state) => {
      setVoiceState(state);
    });
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  // Swarm 10-second polling simulation
  useEffect(() => {
    const checkHealth = () => {
      const current = swarmSimulator.getDaemons();
      setDaemons(current);
      const allUp = current.every((d) => d.status === 'online');
      setIsAllHealthy(allUp);
    };

    checkHealth();
    const interval = setInterval(checkHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  // Selección segura del archivo activo
  const activeFile = (files && files.length > 0)
    ? (files.find((f) => f.id === activeFileId) || files[0])
    : null;
  const engineStatus = daemons.find((d) => d.id === 'gateway')?.status === 'online';
  const isGatewayOnline = engineStatus;

  // Toggle daemon state
  const handleToggleDaemon = (daemonId: string) => {
    swarmSimulator.toggleDaemonStatus(daemonId);
    const updated = swarmSimulator.getDaemons();
    setDaemons(updated);
    setIsAllHealthy(updated.every((d) => d.status === 'online'));
  };

  const handleRefreshHealth = () => {
    const updated = swarmSimulator.getDaemons();
    setDaemons(updated);
    setIsAllHealthy(updated.every((d) => d.status === 'online'));
  };

  // Editor content update
  const handleContentChange = (fileId: string, newContent: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, content: newContent, isModified: true } : f))
    );
  };

  // Send Message to Santiago Assistant
  const handleSendMessage = useCallback(
    async (
      text: string,
      contextCode?: string,
      language?: string,
      actionType?: 'explain' | 'refactor' | 'generate_tests'
    ) => {
      const userMsg: ChatMessage = {
        id: Math.random().toString(36).substring(2, 9),
        role: 'user',
        content: text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsStreaming(true);

      try {
        const responseText = await swarmSimulator.generateChatResponse(
          text,
          contextCode,
          language,
          actionType
        );

        const assistantMsg: ChatMessage = {
          id: Math.random().toString(36).substring(2, 9),
          role: 'assistant',
          content: responseText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages((prev) => [...prev, assistantMsg]);
      } catch (err: any) {
        const errorMsg: ChatMessage = {
          id: Math.random().toString(36).substring(2, 9),
          role: 'assistant',
          content: `⚠️ **Error de Conexión:** ${err.message || 'No se pudo establecer conexión con Santiago Engine'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsStreaming(false);
      }
    },
    []
  );

  // Context Actions (Explain, Refactor, Generate Tests)
  const handleTriggerContextAction = (
    action: 'explain' | 'refactor' | 'generate_tests',
    code: string,
    lang: string
  ) => {
    setActiveView('chat');
    setIsSidebarOpen(true);

    const actionPrompts = {
      explain: `Explica este bloque de código en ${lang} y su relación con la arquitectura soberana:`,
      refactor: `Refactoriza este código en ${lang} optimizando tipado defensivo y rendimiento:`,
      generate_tests: `Genera una suite de tests unitarios completa para este código en ${lang}:`,
    };

    handleSendMessage(actionPrompts[action], code, lang, action);
  };

  // Insert code at cursor in Monaco editor
  const handleInsertAtCursor = (code: string) => {
    setInsertedSnippet(code);
  };

  // Apply Quick Fix to Problem
  const handleApplyQuickFix = (problem: DiagnosticProblem) => {
    if (problem.quickFix) {
      handleContentChange(problem.fileId, problem.quickFix.suggestedCode);
      swarmSimulator.resolveProblem(problem.id);
      setProblems(swarmSimulator.getProblems());
    }
  };

  // Export full VS Code Extension as ZIP
  const handleExportExtensionZip = async () => {
    try {
      const zip = new JSZip();
      EXTENSION_DELIVERABLE_FILES.forEach((file) => {
        zip.file(file.path, file.content);
      });

      const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>`;
      zip.file('resources/icon.svg', iconSvg);

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'santiago-agent-vscode-extension.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error generating extension ZIP:', err);
    }
  };

  // Add new file in workspace
  const handleNewFile = () => {
    const ext = prompt('Nombre del nuevo archivo (ej: internal/worker/job.go):', 'worker.go');
    if (!ext) return;

    let lang = 'go';
    if (ext.endsWith('.ts') || ext.endsWith('.tsx')) lang = 'typescript';
    if (ext.endsWith('.cpp') || ext.endsWith('.c')) lang = 'cpp';
    if (ext.endsWith('.json')) lang = 'json';

    const newF: EditorFile = {
      id: Math.random().toString(36).substring(2, 9),
      name: ext.split('/').pop() || ext,
      path: ext,
      folder: ext.includes('/') ? ext.substring(0, ext.lastIndexOf('/')) : '',
      language: lang,
      content: `package main\n\n// ${ext} - Santiago Sovereign Workspace\n`,
    };

    setFiles((prev) => [...prev, newF]);
    setActiveFileId(newF.id);
  };

  // Delete file (Lógica corregida de borrado seguro)
  const handleDeleteFile = (id: string) => {
    if (!files || files.length === 0) return;

    const targetFile = files.find((f) => f.id === id);
    if (!targetFile) return;

    // 1. INTENCIÓN Y CONFIRMACIÓN HUMANA (UI TRIGGER ONLY)
    const hasConsent = window.confirm(
      `Confirmación de Operador requerida (REQ-SEC-010):\n¿Desea solicitar la simulación de eliminación de "${targetFile.path}" del Workspace?`
    );

    if (!hasConsent) {
      swarmSimulator.addAudit(
        'User',
        'EDIT',
        targetFile.path,
        'Cancelación de solicitud de borrado por el operador humano',
        'NIVEL_1_EXISTE',
        false,
        1,
        'SC-MUT-002: MUTATION_DENIED (Operador canceló la acción)'
      );
      return;
    }

    // 2. DELEGACIÓN AL MOTOR DE SIMULACIÓN PARA EVALUACIÓN LÓGICA
    const result = swarmSimulator.simulateSecureDelete(targetFile.path);

    // 3. PROCESAMIENTO DEL RESULTADO SIMULADO (NOT_VERIFIED EN HOST REAL - SC-VER-002)
    if (result.status === 'SUCCESS') {
      // Actualización segura del estado de interfaz como consecuencia lógica de la simulación exitosa
      const remainingFiles = files.filter((f) => f.id !== id);
      setFiles(remainingFiles);

      if (activeFileId === id) {
        setActiveFileId(remainingFiles[0]?.id || '');
      }

      swarmSimulator.addAudit(
        'Santiago-Agent',
        'EDIT',
        targetFile.path,
        'Borrado simulado en memoria de UI (Fase 00: Estado Físico NO VERIFICADO)',
        'NIVEL_1_EXISTE',
        true,
        0,
        'SC-SYS-000: Simulación completada con éxito'
      );
    } else {
      // Fallo o denegación por Fail-Closed
      alert(
        `OPERACIÓN RECHAZADA O NO COMPATIBLE (${result.code})\n\n` +
        `Motivo: ${result.message}\n` +
        `Verificación de Límites: ${result.targetValidated ? 'PASSED' : 'FAILED'}\n` +
        `Estado de Permiso: ${result.permissionVerified ? 'AUTHORIZED' : 'DENIED'}\n` +
        `Fase 00 - Estado en Host Real: NOT_VERIFIED (SC-VER-002)`
      );
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#141416] text-zinc-100 overflow-hidden font-sans">
      {/* 1. Global Master TitleBar & Interface Mode Switcher */}
      <TitleBar
        currentFileName={activeFile?.name || 'Sin Archivo'}
        isListening={voiceState.isListening}
        isSpeaking={voiceState.isSpeaking}
        onToggleVoice={() => voiceEngine.toggleListening()}
        onExportExtensionZip={handleExportExtensionZip}
        interfaceMode={interfaceMode}
        onSelectInterfaceMode={setInterfaceMode}
        isAllHealthy={isAllHealthy}
      />

      {/* 2. Main Content Area according to selected Interface Mode */}
      {interfaceMode === 'architecture' ? (
        /* Architecture & Health Center View */
        <MasterArchitectureView
          daemons={daemons}
          onToggleDaemon={handleToggleDaemon}
          onRefreshHealth={handleRefreshHealth}
          onSwitchToStudio={() => setInterfaceMode('studio')}
          onSwitchToPlugin={() => setInterfaceMode('plugin')}
        />
      ) : interfaceMode === 'plugin' ? (
        /* Santiago Plugin running inside VS Code Host View */
        <VSCodePluginHostView
          files={files}
          activeFileId={activeFileId}
          onSelectFile={setActiveFileId}
          onContentChange={handleContentChange}
          onTriggerContextAction={handleTriggerContextAction}
          messages={messages}
          onSendMessage={(txt) => handleSendMessage(txt)}
          onInsertAtCursor={handleInsertAtCursor}
          onClearHistory={() => setMessages([])}
          isStreaming={isStreaming}
          isGatewayOnline={isGatewayOnline}
          daemons={daemons}
          onExportExtensionZip={handleExportExtensionZip}
          onSwitchToStudio={() => setInterfaceMode('studio')}
        />
      ) : (
        /* Santiago Studio (Software Propio / IDE Soberano Completo) */
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 flex overflow-hidden">
            {/* Left Activity Bar */}
            <ActivityBar
              activeView={activeView}
              onSelectView={(view) => {
                if (view === 'terminal') {
                  setIsBottomPanelOpen(true);
                  setBottomPanelTab('terminal');
                  return;
                }
                if (view === 'git') {
                  setIsBottomPanelOpen(true);
                  setBottomPanelTab('git');
                  return;
                }
                if (view === 'debugger') {
                  setIsBottomPanelOpen(true);
                  setBottomPanelTab('debugger');
                  return;
                }
                if (view === 'rag') {
                  setIsBottomPanelOpen(true);
                  setBottomPanelTab('rag_ast');
                  return;
                }

                if (activeView === view) {
                  setIsSidebarOpen(!isSidebarOpen);
                } else {
                  setActiveView(view);
                  setIsSidebarOpen(true);
                }
              }}
              isAllHealthy={isAllHealthy}
              problemCount={problems.length}
            />

            {/* Left Drawer / Sidebar */}
            {isSidebarOpen && activeView === 'explorer' && (
              <FileExplorer
                files={files}
                activeFileId={activeFileId}
                onSelectFile={setActiveFileId}
                onNewFile={handleNewFile}
                onDeleteFile={handleDeleteFile}
              />
            )}

            {isSidebarOpen && activeView === 'chat' && (
              <SantiagoChatSidebar
                messages={messages}
                onSendMessage={(txt) => handleSendMessage(txt)}
                onInsertAtCursor={handleInsertAtCursor}
                onClearHistory={() => setMessages([])}
                isStreaming={isStreaming}
                activeLanguage={activeFile?.language || 'text'}
                isGatewayOnline={isGatewayOnline}
              />
            )}

            {/* Center Area: Either Monaco Editor, Swarm Dashboard, or Extension Code Viewer */}
            {activeView === 'swarm' ? (
              <SwarmDaemonsPanel
                daemons={daemons}
                onToggleDaemon={handleToggleDaemon}
                onRefreshHealth={handleRefreshHealth}
              />
            ) : activeView === 'source' ? (
              <ExtensionSourceViewer onExportZip={handleExportExtensionZip} />
            ) : activeFile ? (
              <MonacoCodeEditor
                files={files}
                activeFileId={activeFileId}
                onSelectFile={setActiveFileId}
                onContentChange={handleContentChange}
                onTriggerContextAction={handleTriggerContextAction}
                onCursorPositionChange={(line, col) => setCursorPosition({ line, column: col })}
                insertedSnippet={insertedSnippet}
                onSnippetConsumed={() => setInsertedSnippet(null)}
              />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 bg-[#141416] p-8 text-center border border-zinc-800/40">
                <span className="text-4xl mb-4">📂</span>
                <p className="text-sm font-medium text-zinc-400">No hay archivos abiertos en el Workspace</p>
                <p className="text-xs text-zinc-600 mt-1">Crea un nuevo archivo para comenzar la edición.</p>
                <button
                  onClick={handleNewFile}
                  className="mt-4 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-zinc-100 rounded text-xs font-medium transition-colors"
                >
                  Nuevo Archivo
                </button>
              </div>
            )}
          </div>

          {/* Bottom Panel with Terminal Runner, Problems, Git Local, Debugger, RAG, and Audit Trail */}
          {isBottomPanelOpen && activeView !== 'swarm' && activeView !== 'source' && (
            <BottomPanel
              activeTab={bottomPanelTab}
              onSelectTab={setBottomPanelTab}
              onClose={() => setIsBottomPanelOpen(false)}
              problems={problems}
              onApplyQuickFix={handleApplyQuickFix}
              onOpenFileAtLine={(filePath) => {
                const target = files.find((f) => f.path === filePath);
                if (target) setActiveFileId(target.id);
              }}
            />
          )}
        </div>
      )}

      {/* 3. Global Status Bar */}
      <StatusBar
        daemons={daemons}
        isAllHealthy={isAllHealthy}
        cursorLine={cursorPosition.line}
        cursorColumn={cursorPosition.column}
        activeLanguage={activeFile?.language || 'text'}
        problemCount={problems.length}
        onOpenBottomTab={(tab) => {
          setIsBottomPanelOpen(true);
          setBottomPanelTab(tab);
        }}
        onToggleHealthModal={() => {
          setInterfaceMode('architecture');
        }}
      />
    </div>
  );
}