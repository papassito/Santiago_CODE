import React from 'react';
import { Lock, CheckCircle2, ShieldCheck, ArrowRight, AlertTriangle, X } from 'lucide-react';

interface PhaseGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToChecklist: () => void;
}

export const PhaseGateModal: React.FC<PhaseGateModalProps> = ({
  isOpen,
  onClose,
  onGoToChecklist
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-emerald-500/40 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold font-mono text-white">
                  PUERTA DE CERTIFICACIÓN // FASE 0
                </h3>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/50 text-emerald-300">
                  ESTADO: DETENIDO
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Cumplimiento estricto de la Directiva Maestra #29: Detenerse tras finalizar la Fase 0.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Callout */}
        <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>FASE 0 — ARQUITECTURA Y ESPECIFICACIÓN: 100% COMPLETADA</span>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed">
            Se ha completado la totalidad de los 17 puntos maestros requeridos, las interfaces en Go (`interfaces.go`, `types.go`, `policy.go`, `ollama.go`, `windows_optimization.go`), el archivo de configuración YAML, el documento `ARCHITECTURE.md` y las salvaguardas para Windows PC (Antivirus + Firewall Loopback).
          </p>
        </div>

        {/* Master Directive Notice */}
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-zinc-300 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-semibold font-mono">
            <AlertTriangle className="w-4 h-4" />
            <span>PROTOCOLO MAESTRO: ESPERANDO AUTORIZACIÓN PARA FASE 1</span>
          </div>
          <p className="text-zinc-300 leading-relaxed">
            Por mandato explícito: <em>«Al finalizar cada fase, DETENTE. No continúes automáticamente hacia la siguiente fase. Espera autorización para continuar.»</em>
            <br />
            Santiago no iniciará la <strong>FASE 1 — SANTIAGO CORE</strong> hasta que el operador humano revise la arquitectura y otorgue su aprobación formal.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={() => {
              onClose();
              onGoToChecklist();
            }}
            className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-medium text-zinc-200 transition-colors"
          >
            Revisar Checklist de Criterios (Punto 14)
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-lg shadow-emerald-950"
          >
            <span>Confirmar Revisión de Fase 0</span>
          </button>
        </div>
      </div>
    </div>
  );
};
