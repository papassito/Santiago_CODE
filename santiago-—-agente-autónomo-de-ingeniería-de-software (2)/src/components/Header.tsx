import React from 'react';
import { ShieldCheck, Terminal, Cpu, HardDrive, Download, CheckCircle2, Lock, Boxes } from 'lucide-react';

interface HeaderProps {
  onOpenGate: () => void;
  onSelectSection: (id: any) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenGate, onSelectSection }) => {
  const handleDownloadSpecs = () => {
    const element = document.createElement('a');
    const file = new Blob([
      `# SANTIAGO AGENT - MASTER ARCHITECTURE SPECIFICATION (PHASE 0)\n\nConsulte el archivo ARCHITECTURE.md y la carpeta pkg/ en el repositorio.\nRuntime: Go 1.22+\nProvider: Ollama Local (127.0.0.1:11434)\nStorage: SQLite Local WAL\n`
    ], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = 'SANTIAGO_FASE_0_SPEC.md';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <header className="border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md sticky top-0 z-30 text-zinc-100 px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Brand & Identity */}
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-lg bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-950/40 shrink-0">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl font-bold tracking-tight text-white font-mono flex items-center gap-2">
                SANTIAGO YEMINOUX
                <span className="text-xs px-2 py-0.5 rounded border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-sans font-medium">
                  SOVEREIGN BARE-METAL CORE
                </span>
              </h1>
              <span className="text-xs px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-300 border border-zinc-700 font-mono">
                OPERADOR: COMANDANTE JESÚS
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1 flex items-center gap-2 flex-wrap">
              <span>Agente Autónomo de Ingeniería & Arquitecto</span>
              <span className="text-zinc-600">•</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5" /> RAG Local (Talla 1)
              </span>
              <span className="text-zinc-600">•</span>
              <span className="text-blue-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> DeepIntegrationTester
              </span>
              <span className="text-zinc-600">•</span>
              <span className="text-amber-400 flex items-center gap-1">
                Costo Cloud: $0.00
              </span>
            </p>
          </div>
        </div>

        {/* Windows Compliance & Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => onSelectSection('tactical-console')}
            className="px-3 py-1.5 rounded-md bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 text-xs font-mono text-emerald-300 flex items-center gap-1.5 transition-colors"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Consola Táctica</span>
          </button>

          <button
            onClick={() => onSelectSection('autofix-loop')}
            className="px-3 py-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-mono text-zinc-200 flex items-center gap-1.5 transition-colors"
          >
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span>Auto-Refactor</span>
          </button>

          <button
            onClick={() => onSelectSection('kri-metrics')}
            className="px-3 py-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-mono text-zinc-200 flex items-center gap-1.5 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>_health_score</span>
          </button>

          <button
            onClick={() => onSelectSection('antigravity-vscode')}
            className="px-3 py-1.5 rounded-md bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 text-xs font-mono text-cyan-300 flex items-center gap-1.5 transition-colors"
          >
            <Boxes className="w-3.5 h-3.5 text-cyan-400" />
            <span>Antigravity & VS Code</span>
          </button>

          <button
            onClick={() => onSelectSection('acceptance-criteria')}
            className="px-3 py-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-medium text-zinc-200 flex items-center gap-1.5 transition-colors"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Checklist Fase 0</span>
          </button>

          <button
            onClick={onOpenGate}
            className="px-3.5 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Puerta de Fase 0 (Detenido)</span>
          </button>
        </div>
      </div>
    </header>
  );
};
