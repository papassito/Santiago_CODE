import { useState } from 'react';
import { EXTENSION_DELIVERABLE_FILES } from '../services/extensionFiles';
import JSZip from 'jszip';
import {
  FileCode,
  Download,
  Copy,
  Check,
  Package,
  Terminal,
  FileCheck2,
  ExternalLink,
  Layers,
} from 'lucide-react';

interface ExtensionSourceViewerProps {
  onExportZip: () => void;
}

export function ExtensionSourceViewer({ onExportZip }: ExtensionSourceViewerProps) {
  const [selectedFilePath, setSelectedFilePath] = useState<string>(
    EXTENSION_DELIVERABLE_FILES[0].path
  );
  const [isCopied, setIsCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  const activeFile =
    EXTENSION_DELIVERABLE_FILES.find((f) => f.path === selectedFilePath) ||
    EXTENSION_DELIVERABLE_FILES[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile.content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownloadAllZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();

      // Add each file to ZIP
      EXTENSION_DELIVERABLE_FILES.forEach((file) => {
        zip.file(file.path, file.content);
      });

      // Add sample icon
      const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>`;
      zip.file('resources/icon.svg', iconSvg);

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'santiago-agent-vscode-extension.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to generate ZIP:', err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#141416] text-zinc-200 select-none text-xs overflow-hidden">
      {/* Top Header */}
      <div className="p-4 border-b border-[#27272a] bg-[#1a1a1d] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-400" />
            <h2 className="text-sm font-bold text-zinc-100">
              Código Fuente de la Extensión Oficial VS Code: "Santiago Agent"
            </h2>
          </div>
          <p className="text-zinc-400 text-[11px] mt-0.5">
            Código modular TypeScript 100% de grado de producción, listo para compilar con <code className="text-blue-300 font-mono">tsc</code> y empaquetar con <code className="text-blue-300 font-mono">vsce package</code>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#27272b] hover:bg-[#333338] border border-zinc-700 text-zinc-200 text-xs font-medium transition-colors"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{isCopied ? 'Copiado al portapapeles' : 'Copiar archivo'}</span>
          </button>

          <button
            onClick={handleDownloadAllZip}
            disabled={isZipping}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-medium transition-colors shadow-sm shadow-blue-600/30"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isZipping ? 'Comprimiendo...' : 'Descargar Extensión (.ZIP)'}</span>
          </button>
        </div>
      </div>

      {/* Main Layout: File Selector Sidebar + Code Viewer */}
      <div className="flex-1 flex overflow-hidden">
        {/* File Tabs List */}
        <div className="w-64 bg-[#18181b] border-r border-[#27272a] p-2 overflow-y-auto space-y-1">
          <div className="px-2 py-1 text-[10px] uppercase font-semibold text-zinc-400 tracking-wider">
            Archivos del Paquete
          </div>
          {EXTENSION_DELIVERABLE_FILES.map((file) => {
            const isSelected = file.path === selectedFilePath;
            return (
              <button
                key={file.path}
                onClick={() => setSelectedFilePath(file.path)}
                className={`w-full text-left px-2.5 py-2 rounded-md flex flex-col gap-0.5 transition-colors ${
                  isSelected
                    ? 'bg-blue-600/20 border border-blue-500/40 text-blue-200'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#202023] border border-transparent'
                }`}
              >
                <div className="flex items-center gap-1.5 font-mono text-xs font-medium truncate">
                  <FileCode className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-blue-400' : 'text-zinc-400'}`} />
                  <span className="truncate">{file.path}</span>
                </div>
                <span className="text-[10px] text-zinc-500 truncate">{file.title}</span>
              </button>
            );
          })}

          {/* Compilation Quick Guide */}
          <div className="mt-4 p-3 rounded bg-[#121214] border border-zinc-800 text-[11px] space-y-2 text-zinc-400">
            <div className="flex items-center gap-1.5 font-semibold text-zinc-200">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>Comandos de Compilación:</span>
            </div>
            <pre className="p-2 rounded bg-black text-cyan-300 font-mono text-[10px] leading-relaxed overflow-x-auto">
{`npm install
npm run compile
vsce package
# -> santiago-agent-1.0.0.vsix`}
            </pre>
          </div>
        </div>

        {/* Code Content View */}
        <div className="flex-1 flex flex-col bg-[#0f0f11] overflow-hidden">
          <div className="px-4 py-2 bg-[#18181a] border-b border-[#27272a] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-mono text-zinc-200 font-semibold">{activeFile.path}</span>
              <span className="text-zinc-500">— {activeFile.description}</span>
            </div>
            <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 uppercase">
              {activeFile.language}
            </span>
          </div>

          <div className="flex-1 p-4 overflow-auto font-mono text-[12px] leading-relaxed text-zinc-300 select-text">
            <pre className="font-mono">{activeFile.content}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
