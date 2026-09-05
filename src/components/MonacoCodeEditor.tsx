import { useEffect, useRef, useState } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import { EditorFile } from '../types';
import { swarmSimulator } from '../services/mockDaemonSwarm';
import {
  Sparkles,
  MessageSquare,
  Wrench,
  FlaskConical,
  Zap,
  X,
  Columns,
  Square,
  Eye,
  EyeOff,
} from 'lucide-react';

interface MonacoCodeEditorProps {
  files: EditorFile[];
  activeFileId: string;
  onSelectFile: (id: string) => void;
  onCloseFile?: (id: string) => void;
  onContentChange: (fileId: string, newContent: string) => void;
  onTriggerContextAction: (
    action: 'explain' | 'refactor' | 'generate_tests',
    code: string,
    lang: string
  ) => void;
  onCursorPositionChange?: (line: number, column: number) => void;
  insertedSnippet?: string | null;
  onSnippetConsumed?: () => void;
}

export function MonacoCodeEditor({
  files,
  activeFileId,
  onSelectFile,
  onCloseFile,
  onContentChange,
  onTriggerContextAction,
  onCursorPositionChange,
  insertedSnippet,
  onSnippetConsumed,
}: MonacoCodeEditorProps) {
  const activeFile = files.find((f) => f.id === activeFileId) || files[0];
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const [selectedCode, setSelectedCode] = useState<string>('');
  const [ghostLatency, setGhostLatency] = useState<number | null>(34);
  const [isSplit, setIsSplit] = useState(false);
  const [splitFileId, setSplitFileId] = useState<string>(
    files.find((f) => f.path.includes('test'))?.id || files[1]?.id || files[0].id
  );
  const [minimapEnabled, setMinimapEnabled] = useState(true);

  const splitFile = files.find((f) => f.id === splitFileId) || files[1] || files[0];

  // Handle inserted snippet from Santiago Assistant "Insert at Cursor"
  useEffect(() => {
    if (insertedSnippet && editorRef.current) {
      const editor = editorRef.current;
      const selection = editor.getSelection();
      const op = {
        range: selection,
        text: insertedSnippet,
        forceMoveMarkers: true,
      };
      editor.executeEdits('santiago-assistant', [op]);
      editor.focus();
      if (onSnippetConsumed) {
        onSnippetConsumed();
      }
    }
  }, [insertedSnippet, onSnippetConsumed]);

  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Track selection changes
    editor.onDidChangeCursorSelection((e: any) => {
      const model = editor.getModel();
      if (!model) return;
      const selection = e.selection;
      const text = model.getValueInRange(selection);
      setSelectedCode(text.trim());
    });

    // Track cursor position for status bar
    editor.onDidChangeCursorPosition((e: any) => {
      if (onCursorPositionChange) {
        onCursorPositionChange(e.position.lineNumber, e.position.column);
      }
    });

    // Register Sovereign Inline Autocomplete Provider (Ghost Text)
    // Matches vscode.InlineCompletionItemProvider
    const supportedLanguages = ['typescript', 'javascript', 'go', 'cpp', 'python', 'json'];

    supportedLanguages.forEach((lang) => {
      monaco.languages.registerInlineCompletionsProvider(lang, {
        provideInlineCompletions: async (model, position, context, token) => {
          if (token.isCancellationRequested) return { items: [] };

          const line = position.lineNumber;
          const col = position.column;

          const prefixRange = new monaco.Range(1, 1, line, col);
          const prefix = model.getValueInRange(prefixRange);

          const totalLines = model.getLineCount();
          const suffixRange = new monaco.Range(line, col, Math.min(totalLines, line + 25), 1);
          const suffix = model.getValueInRange(suffixRange);

          try {
            const result = await swarmSimulator.getInlineCompletion({
              prefix,
              suffix,
              language: lang,
              filePath: activeFile.path,
              line,
              column: col,
            });

            if (!result || !result.completion || token.isCancellationRequested) {
              return { items: [] };
            }

            setGhostLatency(result.latencyMs);

            return {
              items: [
                {
                  insertText: result.completion,
                  range: new monaco.Range(line, col, line, col),
                },
              ],
            };
          } catch (err) {
            return { items: [] };
          }
        },
        freeInlineCompletions: () => {},
      });
    });

    // Add Right-Click Context Menu Actions in Monaco
    editor.addAction({
      id: 'santiago-explain',
      label: 'Santiago: Explain Code',
      contextMenuGroupId: 'santiago_1',
      contextMenuOrder: 1,
      run: (ed: any) => {
        const text = ed.getModel()?.getValueInRange(ed.getSelection()) || ed.getModel()?.getValue();
        onTriggerContextAction('explain', text, activeFile.language);
      },
    });

    editor.addAction({
      id: 'santiago-refactor',
      label: 'Santiago: Refactor',
      contextMenuGroupId: 'santiago_1',
      contextMenuOrder: 2,
      run: (ed: any) => {
        const text = ed.getModel()?.getValueInRange(ed.getSelection()) || ed.getModel()?.getValue();
        onTriggerContextAction('refactor', text, activeFile.language);
      },
    });

    editor.addAction({
      id: 'santiago-generate-tests',
      label: 'Santiago: Generate Unit Tests',
      contextMenuGroupId: 'santiago_1',
      contextMenuOrder: 3,
      run: (ed: any) => {
        const text = ed.getModel()?.getValueInRange(ed.getSelection()) || ed.getModel()?.getValue();
        onTriggerContextAction('generate_tests', text, activeFile.language);
      },
    });
  };

  const triggerManualAction = (action: 'explain' | 'refactor' | 'generate_tests') => {
    const code = selectedCode || activeFile.content;
    onTriggerContextAction(action, code, activeFile.language);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#18181b] overflow-hidden relative">
      {/* File Tabs Bar */}
      <div className="flex items-center justify-between bg-[#141416] border-b border-[#27272a] select-none">
        <div className="flex items-center overflow-x-auto no-scrollbar">
          {files.map((file) => {
            const isActive = file.id === activeFileId;
            return (
              <div
                key={file.id}
                onClick={() => onSelectFile(file.id)}
                className={`flex items-center gap-2 px-3 py-2 border-r border-[#27272a] text-xs cursor-pointer border-t-2 transition-colors ${
                  isActive
                    ? 'bg-[#18181b] text-zinc-100 border-t-blue-500 font-medium'
                    : 'bg-[#141416] text-zinc-400 hover:text-zinc-200 hover:bg-[#1c1c20] border-t-transparent'
                }`}
              >
                <span className="font-mono text-[11px]">{file.name}</span>
                {file.isModified && <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
                {files.length > 1 && onCloseFile && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCloseFile(file.id);
                    }}
                    className="hover:bg-zinc-700/60 rounded p-0.5 text-zinc-500 hover:text-zinc-200"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* View Controls: Split Editor & Minimap */}
        <div className="flex items-center gap-2 px-3 text-zinc-400">
          <button
            onClick={() => setMinimapEnabled(!minimapEnabled)}
            className="p-1 hover:text-zinc-200 hover:bg-[#202024] rounded transition-colors text-[10px] flex items-center gap-1"
            title={minimapEnabled ? 'Ocultar minimapa' : 'Mostrar minimapa'}
          >
            {minimapEnabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">Minimap</span>
          </button>

          <button
            onClick={() => setIsSplit(!isSplit)}
            className={`p-1 rounded transition-colors text-[10px] flex items-center gap-1 ${
              isSplit ? 'bg-blue-600/30 text-blue-300' : 'hover:text-zinc-200 hover:bg-[#202024]'
            }`}
            title="Dividir editor (Split Editor)"
          >
            {isSplit ? <Square className="w-3.5 h-3.5" /> : <Columns className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{isSplit ? 'Unir Editor' : 'Split Editor'}</span>
          </button>
        </div>
      </div>

      {/* Floating Santiago Contextual Action Bar */}
      <div className="bg-[#1c1c20] border-b border-[#2a2a30] px-3 py-1 flex items-center justify-between text-xs text-zinc-300">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-zinc-400 font-medium flex items-center gap-1 mr-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Acciones Santiago:</span>
          </span>

          <button
            onClick={() => triggerManualAction('explain')}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#24242a] hover:bg-[#303038] border border-zinc-700/80 text-zinc-200 text-[11px] transition-colors"
            title="Santiago: Explicar código seleccionado"
          >
            <MessageSquare className="w-3 h-3 text-blue-400" />
            <span>Explicar</span>
          </button>

          <button
            onClick={() => triggerManualAction('refactor')}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#24242a] hover:bg-[#303038] border border-zinc-700/80 text-zinc-200 text-[11px] transition-colors"
            title="Santiago: Refactorizar código"
          >
            <Wrench className="w-3 h-3 text-emerald-400" />
            <span>Refactorizar</span>
          </button>

          <button
            onClick={() => triggerManualAction('generate_tests')}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#24242a] hover:bg-[#303038] border border-zinc-700/80 text-zinc-200 text-[11px] transition-colors"
            title="Santiago: Generar suite de tests unitarios"
          >
            <FlaskConical className="w-3 h-3 text-purple-400" />
            <span>Generar Tests</span>
          </button>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-zinc-400 font-mono">
          <div className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-blue-400" />
            <span>Ghost Text: <kbd className="px-1 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 text-[10px]">Tab</kbd></span>
          </div>
          {ghostLatency && (
            <span className="text-emerald-400 font-semibold">{ghostLatency}ms (P50: 31ms / P95: 46ms)</span>
          )}
        </div>
      </div>

      {/* Editor Main Canvas (Single or Split) */}
      <div className="flex-1 w-full h-full relative flex overflow-hidden">
        {/* Left Editor */}
        <div className="flex-1 h-full relative">
          <Editor
            height="100%"
            language={activeFile.language}
            value={activeFile.content}
            theme="vs-dark"
            onChange={(val) => onContentChange(activeFile.id, val || '')}
            onMount={handleEditorDidMount}
            options={{
              fontSize: 13,
              fontFamily: "'JetBrains Mono', 'Fira Code', 'Menlo', 'Monaco', monospace",
              minimap: { enabled: minimapEnabled, maxColumn: 80 },
              scrollBeyondLastLine: false,
              smoothScrolling: true,
              cursorBlinking: 'smooth',
              cursorSmoothCaretAnimation: 'on',
              lineNumbers: 'on',
              renderLineHighlight: 'all',
              automaticLayout: true,
              tabSize: 2,
              inlineSuggest: {
                enabled: true,
                mode: 'subwordSmart',
              },
              suggest: {
                preview: true,
              },
            }}
          />
        </div>

        {/* Right Split Editor (if enabled) */}
        {isSplit && (
          <div className="flex-1 h-full relative border-l border-zinc-700/80 flex flex-col">
            <div className="h-7 bg-[#141416] border-b border-[#27272a] px-3 flex items-center justify-between text-xs text-zinc-400 font-mono">
              <span>Split: {splitFile.name}</span>
              <select
                value={splitFileId}
                onChange={(e) => setSplitFileId(e.target.value)}
                className="bg-[#202024] text-zinc-200 border border-zinc-700 rounded px-1 text-[11px]"
              >
                {files.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1 h-full">
              <Editor
                height="100%"
                language={splitFile.language}
                value={splitFile.content}
                theme="vs-dark"
                onChange={(val) => onContentChange(splitFile.id, val || '')}
                options={{
                  fontSize: 13,
                  fontFamily: "'JetBrains Mono', 'Fira Code', 'Menlo', 'Monaco', monospace",
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  smoothScrolling: true,
                  lineNumbers: 'on',
                  automaticLayout: true,
                  tabSize: 2,
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
