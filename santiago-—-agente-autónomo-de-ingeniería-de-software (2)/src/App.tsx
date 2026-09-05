import React, { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { SpecView } from './components/SpecView';
import { PhaseGateModal } from './components/PhaseGateModal';
import { SectionKey } from './types';

export default function App() {
  const [activeSection, setActiveSection] = useState<SectionKey>('overview');
  const [isGateOpen, setIsGateOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Header */}
      <Header
        onOpenGate={() => setIsGateOpen(true)}
        onSelectSection={(sec) => setActiveSection(sec)}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <Sidebar
          activeSection={activeSection}
          onSelectSection={(sec) => setActiveSection(sec)}
        />
        <main className="flex-1 overflow-y-auto bg-zinc-950/40">
          <SpecView
            sectionKey={activeSection}
            onNavigate={(sec) => setActiveSection(sec)}
            onOpenGate={() => setIsGateOpen(true)}
          />
        </main>
      </div>

      {/* Phase Gate Modal */}
      <PhaseGateModal
        isOpen={isGateOpen}
        onClose={() => setIsGateOpen(false)}
        onGoToChecklist={() => setActiveSection('acceptance-criteria')}
      />
    </div>
  );
}
