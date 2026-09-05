import {
  Files,
  Bot,
  Network,
  FileCode2,
  GitBranch,
  Bug,
  TerminalSquare,
  ShieldCheck,
  BrainCircuit,
} from 'lucide-react';

export type ActivityView =
  | 'explorer'
  | 'chat'
  | 'git'
  | 'debugger'
  | 'swarm'
  | 'source'
  | 'terminal'
  | 'rag';

interface ActivityBarProps {
  activeView: ActivityView;
  onSelectView: (view: ActivityView) => void;
  isAllHealthy: boolean;
  hasUnreadMessage?: boolean;
  problemCount?: number;
}

export function ActivityBar({
  activeView,
  onSelectView,
  isAllHealthy,
  hasUnreadMessage,
  problemCount = 0,
}: ActivityBarProps) {
  const topItems: Array<{ id: ActivityView; label: string; icon: any; badge?: boolean | number }> = [
    { id: 'explorer', label: 'Explorador de Archivos', icon: Files },
    { id: 'chat', label: 'Santiago Agent (Inteligencia Común)', icon: Bot, badge: hasUnreadMessage },
    { id: 'git', label: 'Control de Versiones Git Local', icon: GitBranch },
    { id: 'debugger', label: 'Debugger (Go Delve)', icon: Bug },
    { id: 'terminal', label: 'Santiago Runner (:34822)', icon: TerminalSquare },
    { id: 'rag', label: 'RAG Memory & Grafo AST (:34821)', icon: BrainCircuit },
    { id: 'swarm', label: 'Enjambre Micro-Daemons (:34820-:34823)', icon: Network },
    { id: 'source', label: 'Código Fuente Plugin VS Code', icon: FileCode2 },
  ];

  return (
    <div className="w-12 bg-[#141416] border-r border-[#27272a] flex flex-col justify-between items-center py-2 z-10 select-none">
      {/* Top Navigation Items */}
      <div className="flex flex-col gap-1.5">
        {topItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectView(item.id)}
              title={item.label}
              className={`relative w-9 h-9 rounded flex items-center justify-center transition-all ${
                isActive
                  ? 'text-white bg-[#222226] before:absolute before:left-0 before:top-2 before:bottom-2 before:w-0.5 before:bg-blue-500'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#1a1a1e]'
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.badge && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-500 animate-ping" />
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Health Shield */}
      <div className="flex flex-col gap-2 items-center">
        <button
          onClick={() => onSelectView('swarm')}
          title={isAllHealthy ? 'Soberanía: Todos los daemons en línea (Nivel 3)' : 'Soberanía: Degrada'}
          className="w-8 h-8 rounded flex items-center justify-center text-zinc-400 hover:text-zinc-200 hover:bg-[#202024] transition-colors"
        >
          <ShieldCheck
            className={`w-4 h-4 ${isAllHealthy ? 'text-emerald-400' : 'text-amber-400'}`}
          />
        </button>
      </div>
    </div>
  );
}
