import React, { useState } from 'react';
import { GO_FILES } from '../data/specificationData';
import { Code2, Copy, Check, FileCode, Terminal, Download } from 'lucide-react';

export const GoCodeExplorer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState(GO_FILES[0]);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([selectedFile.code], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = selectedFile.name;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden shadow-2xl">
      {/* Top File Tab Bar */}
      <div className="border-b border-zinc-800 bg-zinc-900/90 px-4 py-2 flex items-center justify-between gap-4 overflow-x-auto">
        <div className="flex items-center gap-1.5 shrink-0">
          <FileCode className="w-4 h-4 text-emerald-400 mr-1" />
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider mr-2">
            Archivos Go Fase 0:
          </span>
          {GO_FILES.map((f) => {
            const isSelected = selectedFile.path === f.path;
            return (
              <button
                key={f.path}
                onClick={() => setSelectedFile(f)}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-colors flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-zinc-800 text-emerald-300 border border-zinc-700'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                }`}
              >
                <span>{f.name}</span>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCopy}
            className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs flex items-center gap-1 font-mono transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copiado</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-zinc-400" />
                <span>Copiar</span>
              </>
            )}
          </button>
          <button
            onClick={handleDownload}
            className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs flex items-center gap-1 font-mono transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-zinc-400" />
            <span>Descargar</span>
          </button>
        </div>
      </div>

      {/* File Description Header */}
      <div className="bg-zinc-900/40 border-b border-zinc-800/80 px-4 py-2.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="text-zinc-500 font-mono">Ruta:</span>
          <code className="text-emerald-400 font-mono bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">
            {selectedFile.path}
          </code>
        </div>
        <div className="text-zinc-400 truncate max-w-md hidden md:block">
          {selectedFile.description}
        </div>
      </div>

      {/* Code Area */}
      <div className="p-4 bg-zinc-950 font-mono text-xs text-zinc-300 overflow-x-auto max-h-[500px] scrollbar-thin">
        <pre className="leading-relaxed">
          <code>{selectedFile.code}</code>
        </pre>
      </div>

      {/* Footer Info */}
      <div className="bg-zinc-900/60 border-t border-zinc-800 px-4 py-2 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
        <span>Go 1.22 • Paquete: {selectedFile.package}</span>
        <span className="text-emerald-400">Totalmente desacoplado de proveedores externos</span>
      </div>
    </div>
  );
};
