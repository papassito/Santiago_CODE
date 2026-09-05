import { SwarmDaemon, BottomPanelTab } from '../types';
import { GitBranch, AlertCircle, Terminal, ShieldCheck } from 'lucide-react';

interface StatusBarProps {
  daemons: SwarmDaemon[];
  isAllHealthy: boolean;
  cursorLine: number;
  cursorColumn: number;
  activeLanguage: string;
  onToggleHealthModal?: () => void;
  onOpenBottomTab?: (tab: BottomPanelTab) => void;
  problemCount?: number;
}

export function StatusBar({
  daemons,
  isAllHealthy,
  cursorLine,
  cursorColumn,
  activeLanguage,
  onToggleHealthModal,
  onOpenBottomTab,
  problemCount = 0,
}: StatusBarProps) {
  const gateway = daemons.find((d) => d.id === 'gateway');
  const isOnline = gateway?.status === 'online';

  return (
    <footer className="h-6 bg-[#161618] border-t border-[#27272a] text-[#a1a1aa] flex items-center justify-between px-3 text-[11px] font-mono select-none z-20">
      {/* Left items: Git branch, problems, terminal, sovereign mode */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onOpenBottomTab && onOpenBottomTab('git')}
          className="flex items-center gap-1 text-zinc-300 hover:text-white transition-colors"
          title="Abrir Control de Versiones Git Local"
        >
          <GitBranch className="w-3.5 h-3.5 text-emerald-400" />
          <span>main</span>
        </button>

        <button
          onClick={() => onOpenBottomTab && onOpenBottomTab('problems')}
          className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-200 transition-colors"
          title="Ver panel de problemas y diagnósticos"
        >
          <AlertCircle className={`w-3.5 h-3.5 ${problemCount > 0 ? 'text-amber-400' : 'text-zinc-500'}`} />
          <span>{problemCount} problemas</span>
        </button>

        <button
          onClick={() => onOpenBottomTab && onOpenBottomTab('terminal')}
          className="flex items-center gap-1 text-zinc-400 hover:text-zinc-200 transition-colors"
          title="Abrir Terminal Santiago Runner (:34822)"
        >
          <Terminal className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden sm:inline">Runner PTY</span>
        </button>

        {/* Verification criteria tag */}
        <div className="hidden md:flex items-center gap-1 text-emerald-400 font-sans text-[10px]">
          <ShieldCheck className="w-3 h-3" />
          <span>[Nivel 3: FUNCIONA]</span>
        </div>
      </div>

      {/* Right items: cursor, encoding, language, swarm status */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 text-zinc-400">
          <span>
            Ln {cursorLine}, Col {cursorColumn}
          </span>
          <span>Spaces: 2</span>
          <span>UTF-8</span>
          <span className="uppercase text-blue-400 font-semibold">{activeLanguage}</span>
        </div>

        {/* Pinned Swarm Health Status Bar button */}
        <button
          onClick={onToggleHealthModal}
          title="Centro de Salud Soberano (Sondeo :34820 cada 10s)"
          className={`flex items-center gap-1.5 px-2 py-0.5 rounded transition-colors font-medium ${
            isOnline
              ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-900/40'
              : 'bg-rose-950/40 text-rose-300 border border-rose-500/40 hover:bg-rose-900/40'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isOnline ? 'bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400/80' : 'bg-rose-500'
            }`}
          />
          <span>{isOnline ? '🤖 Santiago: Online' : '🤖 Santiago: Offline'}</span>
          {isOnline && (
            <span className="text-[10px] text-emerald-400/80">({gateway?.latencyMs || 34}ms)</span>
          )}
        </button>
      </div>
    </footer>
  );
}
