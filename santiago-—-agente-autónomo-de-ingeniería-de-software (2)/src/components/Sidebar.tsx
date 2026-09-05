import React from 'react';
import { SPEC_SECTIONS } from '../data/specificationData';
import { SectionKey, SpecSection } from '../types';
import { 
  Layers, 
  FolderTree, 
  Cpu, 
  Code2, 
  GitPullRequest, 
  Database, 
  Wrench, 
  ShieldAlert, 
  FileText, 
  Bot, 
  CheckSquare, 
  AlertTriangle, 
  Package, 
  Award, 
  Lightbulb, 
  Scale, 
  TerminalSquare, 
  Laptop,
  PlayCircle,
  Terminal,
  RefreshCw,
  BookOpen,
  Activity,
  Fingerprint,
  Lock,
  Eye,
  Boxes
} from 'lucide-react';

interface SidebarProps {
  activeSection: SectionKey;
  onSelectSection: (id: SectionKey) => void;
}

const getSectionIcon = (id: SectionKey) => {
  switch (id) {
    case 'tactical-console': return <Terminal className="w-4 h-4 text-emerald-400" />;
    case 'autofix-loop': return <RefreshCw className="w-4 h-4 text-emerald-400" />;
    case 'local-rag': return <BookOpen className="w-4 h-4 text-cyan-400" />;
    case 'kri-metrics': return <Activity className="w-4 h-4 text-emerald-400" />;
    case 'jesus-dna': return <Fingerprint className="w-4 h-4 text-amber-400" />;
    case 'bunker-crypto': return <Lock className="w-4 h-4 text-cyan-400" />;
    case 'multimodal-installer': return <Eye className="w-4 h-4 text-purple-400" />;
    case 'antigravity-vscode': return <Boxes className="w-4 h-4 text-cyan-400" />;
    case 'overview': return <Layers className="w-4 h-4" />;
    case 'project-tree': return <FolderTree className="w-4 h-4" />;
    case 'components': return <Cpu className="w-4 h-4" />;
    case 'go-interfaces': return <Code2 className="w-4 h-4" />;
    case 'data-flow': return <GitPullRequest className="w-4 h-4" />;
    case 'memory-model': return <Database className="w-4 h-4" />;
    case 'tools-model': return <Wrench className="w-4 h-4" />;
    case 'permissions-model': return <ShieldAlert className="w-4 h-4" />;
    case 'audit-model': return <FileText className="w-4 h-4" />;
    case 'ollama-strategy': return <Bot className="w-4 h-4" />;
    case 'test-strategy': return <CheckSquare className="w-4 h-4" />;
    case 'technical-risks': return <AlertTriangle className="w-4 h-4" />;
    case 'dependencies': return <Package className="w-4 h-4" />;
    case 'acceptance-criteria': return <Award className="w-4 h-4" />;
    case 'expert-problem-solving': return <Lightbulb className="w-4 h-4" />;
    case 'objectivity-rigor': return <Scale className="w-4 h-4" />;
    case 'programmability': return <TerminalSquare className="w-4 h-4" />;
    case 'windows-optimization': return <Laptop className="w-4 h-4 text-blue-400" />;
    case 'simulator-policy': return <PlayCircle className="w-4 h-4 text-amber-400" />;
    case 'simulator-protocol': return <PlayCircle className="w-4 h-4 text-emerald-400" />;
    default: return <Layers className="w-4 h-4" />;
  }
};

export const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSelectSection }) => {
  const categories: Array<SpecSection['category']> = [
    'Operativa Táctica',
    'Core Architecture',
    'Intelligence & Execution',
    'Security & Platform',
    'Certification'
  ];

  return (
    <aside className="w-full lg:w-72 border-r border-zinc-800/80 bg-zinc-950/60 p-4 shrink-0 overflow-y-auto max-h-[calc(100vh-73px)] scrollbar-thin">
      <div className="mb-4 px-2">
        <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
          Especificación Fase 0 (17 Puntos)
        </span>
        <div className="mt-1 text-xs text-zinc-400">
          Documento maestro normativo de arquitectura previa a Fase 1.
        </div>
      </div>

      <nav className="space-y-6">
        {categories.map((cat) => {
          const items = SPEC_SECTIONS.filter((s) => s.category === cat);
          return (
            <div key={cat} className="space-y-1">
              <div className="px-2.5 py-1 text-[10px] font-mono uppercase font-bold text-zinc-400 tracking-wider flex items-center justify-between">
                <span>{cat}</span>
                <span className="text-zinc-400 font-normal">({items.length})</span>
              </div>
              <div className="space-y-0.5">
                {items.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onSelectSection(item.id)}
                      className={`w-full text-left px-2.5 py-2 rounded-md text-xs font-medium flex items-center gap-2.5 transition-all group ${
                        isActive
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-sm'
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/80 border border-transparent'
                      }`}
                    >
                      <span className={`shrink-0 ${isActive ? 'text-emerald-400' : 'text-zinc-500 group-hover:text-zinc-400'}`}>
                        {getSectionIcon(item.id)}
                      </span>
                      <span className="truncate flex-1">
                        <span className="font-mono text-[10px] text-zinc-500 mr-1.5 font-normal">
                          {typeof item.number === 'number' ? String(item.number).padStart(2, '0') : item.number}
                        </span>
                        {item.title}
                      </span>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>
    </aside>
  );
};
