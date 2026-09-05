import { useState } from 'react';
import { EditorFile } from '../types';
import {
  FileCode,
  FileText,
  Plus,
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Search,
  Trash2,
} from 'lucide-react';

interface FileExplorerProps {
  files: EditorFile[];
  activeFileId: string;
  onSelectFile: (id: string) => void;
  onNewFile: () => void;
  onDeleteFile?: (id: string) => void;
}

export function FileExplorer({
  files,
  activeFileId,
  onSelectFile,
  onNewFile,
  onDeleteFile,
}: FileExplorerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({
    cmd: true,
    'cmd/santiago': true,
    internal: true,
    'internal/gateway': true,
    'internal/rag': true,
    'internal/runner': true,
    'internal/vault': true,
    tests: true,
    docs: true,
  });

  const toggleFolder = (folderPath: string) => {
    setOpenFolders((prev) => ({
      ...prev,
      [folderPath]: !prev[folderPath],
    }));
  };

  const filteredFiles = files.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.path.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group files by root folders
  const rootFiles = filteredFiles.filter((f) => !f.folder || f.folder === '');
  const cmdFiles = filteredFiles.filter((f) => f.folder?.startsWith('cmd'));
  const internalFiles = filteredFiles.filter((f) => f.folder?.startsWith('internal'));
  const testFiles = filteredFiles.filter((f) => f.folder?.startsWith('tests'));

  const renderFileRow = (file: EditorFile) => {
    const isActive = file.id === activeFileId;
    return (
      <div
        key={file.id}
        onClick={() => onSelectFile(file.id)}
        className={`group flex items-center justify-between px-2 py-1 rounded cursor-pointer transition-colors text-left ${
          isActive
            ? 'bg-[#2a2a30] text-blue-300 font-medium'
            : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#222226]'
        }`}
      >
        <div className="flex items-center gap-2 truncate">
          <FileCode
            className={`w-3.5 h-3.5 shrink-0 ${
              file.language === 'go'
                ? 'text-cyan-400'
                : file.language === 'typescript'
                ? 'text-sky-400'
                : file.language === 'markdown'
                ? 'text-amber-400'
                : 'text-emerald-400'
            }`}
          />
          <span className="truncate text-xs">{file.name}</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {file.isModified && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />}
          {onDeleteFile && files.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteFile(file.id);
              }}
              title="Eliminar archivo"
              className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-rose-400 text-zinc-500 transition-opacity"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-64 bg-[#18181b] border-r border-[#27272a] text-zinc-300 flex flex-col h-full select-none text-xs">
      {/* Explorer Header */}
      <div className="px-3 py-2 border-b border-[#27272a] flex items-center justify-between text-zinc-400 font-semibold tracking-wider uppercase text-[10px]">
        <span>Workspace Soberano</span>
        <button
          onClick={onNewFile}
          title="Nuevo archivo en workspace"
          className="p-1 hover:bg-[#27272a] rounded text-zinc-300 hover:text-white transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-2 border-b border-zinc-800/80">
        <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#1f1f23] border border-zinc-700/60 text-zinc-400">
          <Search className="w-3 h-3 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar archivos..."
            className="w-full bg-transparent text-zinc-200 placeholder-zinc-500 focus:outline-none text-[11px]"
          />
        </div>
      </div>

      {/* Directory Tree */}
      <div className="p-2 flex-1 overflow-y-auto space-y-1">
        {/* cmd/ folder */}
        <div>
          <div
            onClick={() => toggleFolder('cmd')}
            className="flex items-center gap-1 px-1 py-1 rounded hover:bg-zinc-800/60 cursor-pointer text-zinc-300 font-medium"
          >
            {openFolders['cmd'] ? (
              <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
            )}
            <Folder className="w-3.5 h-3.5 text-blue-400" />
            <span>cmd/</span>
          </div>
          {openFolders['cmd'] && (
            <div className="ml-3 pl-2 border-l border-zinc-800 space-y-0.5">
              {cmdFiles.map(renderFileRow)}
            </div>
          )}
        </div>

        {/* internal/ folder */}
        <div>
          <div
            onClick={() => toggleFolder('internal')}
            className="flex items-center gap-1 px-1 py-1 rounded hover:bg-zinc-800/60 cursor-pointer text-zinc-300 font-medium"
          >
            {openFolders['internal'] ? (
              <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
            )}
            <Folder className="w-3.5 h-3.5 text-purple-400" />
            <span>internal/ (Daemons)</span>
          </div>
          {openFolders['internal'] && (
            <div className="ml-3 pl-2 border-l border-zinc-800 space-y-0.5">
              {internalFiles.map(renderFileRow)}
            </div>
          )}
        </div>

        {/* tests/ folder */}
        <div>
          <div
            onClick={() => toggleFolder('tests')}
            className="flex items-center gap-1 px-1 py-1 rounded hover:bg-zinc-800/60 cursor-pointer text-zinc-300 font-medium"
          >
            {openFolders['tests'] ? (
              <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
            )}
            <Folder className="w-3.5 h-3.5 text-emerald-400" />
            <span>tests/</span>
          </div>
          {openFolders['tests'] && (
            <div className="ml-3 pl-2 border-l border-zinc-800 space-y-0.5">
              {testFiles.map(renderFileRow)}
            </div>
          )}
        </div>

        {/* Root configuration files (go.mod, README.md, etc.) */}
        <div className="pt-1 border-t border-zinc-800/60 space-y-0.5">
          {rootFiles.map(renderFileRow)}
        </div>
      </div>

      {/* Sovereign Context Footer */}
      <div className="p-3 border-t border-[#27272a] bg-[#141416] text-[10px] text-zinc-400">
        <div className="flex items-center gap-1.5 text-zinc-200 font-semibold mb-1">
          <Sparkles className="w-3 h-3 text-blue-400" />
          <span>Local Sovereign Workspace</span>
        </div>
        <p className="text-zinc-500 leading-normal">
          Sin telemetría externa. Memoria RAG indexando <code className="text-zinc-400 font-mono">2,840</code> símbolos en <code className="text-zinc-400 font-mono">:34821</code>.
        </p>
      </div>
    </div>
  );
}
