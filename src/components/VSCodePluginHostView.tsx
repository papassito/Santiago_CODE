import { useState } from 'react';
import { EditorFile, ChatMessage, SwarmDaemon } from '../types';
import { SantiagoChatSidebar } from './SantiagoChatSidebar';
import { MonacoCodeEditor } from './MonacoCodeEditor';
import { ExtensionSourceViewer } from './ExtensionSourceViewer';
import {
  Code2,
  Download,
  ExternalLink,
  Bot,
  Terminal,
  Server,
  Layers,
  Sparkles,
} from 'lucide-react';

interface VSCodePluginHostViewProps {
  files: EditorFile[];
  activeFileId: string;
  onSelectFile: (id: string) => void;
  onContentChange: (id: string, content: string) => void;
  onTriggerContextAction: (
    action: 'explain' | 'refactor' | 'generate_tests',
    code: string,
    lang: string
  ) => void;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onInsertAtCursor: (code: string) => void;
  onClearHistory: () => void;
  isStreaming: boolean;
  isGatewayOnline: boolean;
  daemons: SwarmDaemon[];
  onExportExtensionZip: () => void;
  onSwitchToStudio: () => void;
}

export function VSCodePluginHostView({
  files,
  activeFileId,
  onSelectFile,
  onContentChange,
  onTriggerContextAction,
  messages,
  onSendMessage,
  onInsertAtCursor,
  onClearHistory,
  isStreaming,
  isGatewayOnline,
  daemons,
  onExportExtensionZip,
  onSwitchToStudio,
}: VSCodePluginHostViewProps) {
  const [activeTab, setActiveTab] = useState<'editor' | 'source_code'>('editor');
  const activeFile = files.find((f) => f.id === activeFileId) || files[0];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#1e1e1e] text-zinc-200 overflow-hidden select-none">
      {/* VS Code Host Header / Banner */}
      <div className="h-8 bg-[#2d2d2d] border-b border-[#3c3c3c] px-3 flex items-center justify-between text-xs text-zinc-300">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-[#007acc] flex items-center justify-center text-[10px] font-bold text-white">
            VS
          </div>
          <span className="font-semibold text-zinc-100">Visual Studio Code</span>
          <span className="text-zinc-400 font-mono text-[11px]">— Santiago Plugin Host Session</span>
          <span className="px-2 py-0.5 rounded bg-blue-900/40 text-blue-300 border border-blue-600/40 text-[10px]">
            Host Compatible (:34820)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-2.5 py-0.5 rounded text-xs transition-colors ${
              activeTab === 'editor'
                ? 'bg-[#1e1e1e] text-blue-400 font-medium'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Vista Extensión en Vivo
          </button>

          <button
            onClick={() => setActiveTab('source_code')}
            className={`px-2.5 py-0.5 rounded text-xs transition-colors ${
              activeTab === 'source_code'
                ? 'bg-[#1e1e1e] text-blue-400 font-medium'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Código Fuente del Plugin (TypeScript)
          </button>

          <button
            onClick={onSwitchToStudio}
            className="flex items-center gap-1 px-2.5 py-0.5 rounded bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 text-blue-200 text-xs transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            <span>Regresar a Santiago Studio</span>
          </button>
        </div>
      </div>

      {/* Main Host Area */}
      {activeTab === 'source_code' ? (
        <ExtensionSourceViewer onExportZip={onExportExtensionZip} />
      ) : (
        <div className="flex-1 flex overflow-hidden">
          {/* Santiago Chat View Provider inside VS Code Activity Bar Container */}
          <div className="w-80 md:w-96 border-r border-[#333333] flex flex-col h-full bg-[#252526]">
            <div className="px-3 py-1.5 bg-[#2d2d2d] border-b border-[#3c3c3c] flex items-center justify-between text-[11px] text-zinc-300 font-semibold uppercase tracking-wider">
              <span>SANTIAGO: AI ASSISTANT</span>
              <span className="text-[10px] text-emerald-400 font-mono">ONLINE</span>
            </div>
            <SantiagoChatSidebar
              messages={messages}
              onSendMessage={onSendMessage}
              onInsertAtCursor={onInsertAtCursor}
              onClearHistory={onClearHistory}
              isStreaming={isStreaming}
              activeLanguage={activeFile.language}
              isGatewayOnline={isGatewayOnline}
            />
          </div>

          {/* VS Code Active Editor Area */}
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            <MonacoCodeEditor
              files={files}
              activeFileId={activeFileId}
              onSelectFile={onSelectFile}
              onContentChange={onContentChange}
              onTriggerContextAction={onTriggerContextAction}
            />
          </div>
        </div>
      )}
    </div>
  );
}
