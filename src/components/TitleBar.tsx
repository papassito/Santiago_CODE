import {
  Download,
  Mic,
  Volume2,
  Server,
  Code2,
  Layers,
  Cpu,
  ShieldCheck,
  PanelLeftClose,
} from 'lucide-react';
import { InterfaceMode } from '../types';

interface TitleBarProps {
  currentFileName: string;
  isListening: boolean;
  isSpeaking: boolean;
  onToggleVoice: () => void;
  onExportExtensionZip: () => void;
  interfaceMode: InterfaceMode;
  onSelectInterfaceMode: (mode: InterfaceMode) => void;
  isAllHealthy: boolean;
}

export function TitleBar({
  currentFileName,
  isListening,
  isSpeaking,
  onToggleVoice,
  onExportExtensionZip,
  interfaceMode,
  onSelectInterfaceMode,
  isAllHealthy,
}: TitleBarProps) {
  return (
    <header className="h-10 bg-[#161618] border-b border-[#27272a] text-[#d4d4d8] flex items-center justify-between px-3 select-none text-xs z-30">
      {/* Window Controls & Brand */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 mr-1">
          <div className="w-3 h-3 rounded-full bg-[#ef4444] border border-[#dc2626] opacity-80" />
          <div className="w-3 h-3 rounded-full bg-[#f59e0b] border border-[#d97706] opacity-80" />
          <div className="w-3 h-3 rounded-full bg-[#10b981] border border-[#059669] opacity-80" />
        </div>

        <div className="flex items-center gap-2 font-medium tracking-wide text-zinc-100">
          <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center text-[11px] font-bold text-white shadow-sm shadow-blue-500/30">
            S
          </div>
          <span className="font-bold">SANTIAGO</span>
          <span className="hidden sm:inline text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700 font-mono">
            Una Inteligencia — Dos Interfaces
          </span>
        </div>
      </div>

      {/* Central Interface Mode Selector ("UNA INTELIGENCIA — DOS INTERFACES") */}
      <div className="flex items-center bg-[#202024] p-0.5 rounded-lg border border-zinc-700/80">
        <button
          onClick={() => onSelectInterfaceMode('studio')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
            interfaceMode === 'studio'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
          title="Santiago Studio: Software Propio / IDE Soberano Completo"
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Santiago Studio (IDE)</span>
        </button>

        <button
          onClick={() => onSelectInterfaceMode('plugin')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
            interfaceMode === 'plugin'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
          title="Santiago Plugin: Extensión Oficial corriendo en host VS Code"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Santiago Plugin (VS Code)</span>
        </button>

        <button
          onClick={() => onSelectInterfaceMode('architecture')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
            interfaceMode === 'architecture'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
          title="Arquitectura Maestra, Telemetría P50/P95/P99 y Matriz de Verificación"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Arquitectura & Salud</span>
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isAllHealthy ? 'bg-emerald-400' : 'bg-rose-400'
            }`}
          />
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Voice Module Button (Whisper.cpp + Piper TTS) */}
        <button
          onClick={onToggleVoice}
          title="Módulo de Voz Soberano (Whisper.cpp para escuchar + Piper TTS para hablar)"
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded border transition-colors ${
            isListening
              ? 'bg-red-500/20 text-red-300 border-red-500/50 animate-pulse'
              : isSpeaking
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
              : 'bg-[#27272a] hover:bg-[#323236] text-zinc-300 border-[#3f3f46]'
          }`}
        >
          {isListening ? (
            <>
              <Mic className="w-3.5 h-3.5 text-red-400" />
              <span className="text-[11px] font-medium hidden sm:inline">Whisper.cpp: Escuchando</span>
            </>
          ) : isSpeaking ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
              <span className="text-[11px] font-medium hidden sm:inline">Piper TTS: Hablando</span>
            </>
          ) : (
            <>
              <Mic className="w-3.5 h-3.5 text-zinc-400" />
              <span className="text-[11px] hidden sm:inline">Módulo Voz</span>
            </>
          )}
        </button>

        {/* Download VS Code Extension Bundle ZIP */}
        <button
          onClick={onExportExtensionZip}
          title="Descargar código fuente completo de la extensión VS Code (.ZIP listo para compilar con vsce)"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-sm shadow-blue-600/30 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Exportar Plugin VS Code</span>
        </button>
      </div>
    </header>
  );
}
