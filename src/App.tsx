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
  const [activeFileId, setActiveFileId] = useState<string>(INITIAL_EDITOR_FILES[0].id);
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
      content: `### 🤖 SANTIAGO — Plataforma Soberana de Desarrollo
> **"UNA INTELIGENCIA — DOS INTERFACES"**

Regla Suprema Oficial:
\`VER -> ENTENDER -> DECIDIR -> ACTUAR -> VERIFICAR\`
*No inventar. La última palabra la tiene la evidencia de ejecución.*

Estoy orquestando localmente tus 4 micro-daemons:
- **Gateway Router (:34820)** — Orquestador de inferencia y router local.
- **RAG AST Memory (:34821)** — Grafo de símbolos en RAM (2,840 símbolos Go/TS).
- **Runner Daemon (:34822)** — Aislamiento PTY, compilación y captura de exit codes.
- **Vault Enclave (:34823)** — Estado sensible cifrado con ChaCha20-Poly1305.

**Prueba ahora**:
1. Usa el selector superior para alternar entre **Santiago Studio (IDE)** y **Santiago Plugin (VS Code)**.
2. Escribe código en el editor para probar **Ghost Text** (<kbd>Tab</kbd> para aceptar).
3. Prueba el botón de voz para dictar con **Whisper.cpp** o escuchar respuestas con **Piper TTS**.
4. Haz clic en **Agente Autónomo** para ver la ejecución del ciclo autónomo con verificación de pruebas reales.`,
      timestamp: '10:00 AM',
    },
  ]);
  const [isStreaming, setIsStreaming] = useState(false);

  // Voice Engine State (Whisper.cpp + Piper TTS)
  const [voiceState, setVoiceState] = useState<VoiceEngineState>({
    isListening: false,
    isSpeaking: false,
    transcript: '',
    voiceEngineName: 'Whisper.cpp (C++ via Go)',
    ttsEngineName: 'Piper TTS / Bark Neural',
    supported: true,
  });

  // Track voice engine
  useEffect(() => {
    voiceEngine.subscribe((state) => {
      setVoiceState(state);
    });
  }, []);

  // Swarm 10-second polling as required by prompt
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

  const activeFile = files.find((f) => f.id === activeFileId) || files[0];
  const gatewayDaemon = daemons.find((d) => d.id === 'gateway');
  const isGatewayOnline = gatewayDaemon?.status === 'online';

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
          content: `⚠️ **Error de Conexión:** ${err.message || 'No se pudo contactar al Gateway (:34820)'}`,
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

  // Delete file
  const handleDeleteFile = (id: string) => {
    if (files.length <= 1) return;
    setFiles((prev) => prev.filter((f) => f.id !== id));
    if (activeFileId === id) {
      setActiveFileId(files.find((f) => f.id !== id)?.id || files[0].id);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#141416] text-zinc-100 overflow-hidden font-sans">
      {/* 1. Global Master TitleBar & Interface Mode Switcher */}
      <TitleBar
        currentFileName={activeFile.name}
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
                activeLanguage={activeFile.language}
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
            ) : (
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
        activeLanguage={activeFile.language}
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
