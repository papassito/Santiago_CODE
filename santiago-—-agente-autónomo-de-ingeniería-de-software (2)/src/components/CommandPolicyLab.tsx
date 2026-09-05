import React, { useState } from 'react';
import { ShieldAlert, CheckCircle, AlertTriangle, XCircle, Terminal, Play, HelpCircle } from 'lucide-react';
import { PermissionLevel, RiskLevel } from '../types';

interface PresetCommand {
  cmd: string;
  category: string;
  risk: RiskLevel;
  explanation: string;
}

const PRESET_COMMANDS: PresetCommand[] = [
  {
    cmd: 'git status',
    category: 'INSPECTION_SAFE',
    risk: 'SAFE',
    explanation: 'Comando de sólo lectura. Permite inspeccionar el árbol de trabajo sin modificar ningún archivo.'
  },
  {
    cmd: 'go test ./pkg/security/...',
    category: 'VERIFICATION',
    risk: 'MEDIUM',
    explanation: 'Ejecuta tests de verificación dentro del runtime. Requiere nivel EXECUTE.'
  },
  {
    cmd: 'go build -o bin/santiago.exe ./cmd/santiago',
    category: 'VERIFICATION',
    risk: 'MEDIUM',
    explanation: 'Compilación de binario local. Produce un artefacto verificable.'
  },
  {
    cmd: 'git commit -m "refactor: apply security patch"',
    category: 'MUTATION',
    risk: 'HIGH',
    explanation: 'Mutación del historial de Git. Requiere confirmación explícita del usuario y snapshot previo.'
  },
  {
    cmd: 'del /f /s /q C:\\Projects\\test\\*',
    category: 'DESTRUCTIVE_BLOCKED',
    risk: 'CRITICAL',
    explanation: 'Comando destructivo masivo. BLOQUEO AUTOMÁTICO por la regla absoluta de seguridad.'
  },
  {
    cmd: 'powershell -w hidden -enc JABzACAAPQAgAE4AZQB3...',
    category: 'DESTRUCTIVE_BLOCKED',
    risk: 'CRITICAL',
    explanation: 'Ejecución oculta u ofuscada en PowerShell. Bloqueado para garantizar cumplimiento con antivirus y AMSI.'
  }
];

export const CommandPolicyLab: React.FC = () => {
  const [inputCmd, setInputCmd] = useState(PRESET_COMMANDS[0].cmd);
  const [activePerm, setActivePerm] = useState<PermissionLevel>('ANALYZE');
  const [userApproved, setUserApproved] = useState<boolean>(false);

  // Policy evaluation logic identical to Go pkg/security/policy.go
  const evaluateCommand = (cmd: string, perm: PermissionLevel, approved: boolean) => {
    const clean = cmd.trim().toLowerCase();

    // Critical block
    if (
      clean.includes('format') ||
      clean.includes('diskpart') ||
      clean.includes('rmdir /s /q') ||
      clean.includes('del /f /s /q') ||
      clean.includes('powershell -w hidden') ||
      clean.includes('rm -rf') ||
      clean.includes('drop table') ||
      clean.includes('drop database')
    ) {
      return {
        category: 'DESTRUCTIVE_BLOCKED',
        risk: 'CRITICAL' as RiskLevel,
        allowed: false,
        reason: 'Regla de Seguridad Absoluta: El comando contiene tokens o llamadas destructivas no permitidas.',
        color: 'red'
      };
    }

    if (
      clean.startsWith('git status') ||
      clean.startsWith('git log') ||
      clean.startsWith('git diff') ||
      clean.startsWith('dir') ||
      clean.startsWith('ls') ||
      clean.startsWith('go version')
    ) {
      return {
        category: 'INSPECTION_SAFE',
        risk: 'SAFE' as RiskLevel,
        allowed: true,
        reason: 'Permitido: Operación de inspección inocua de sólo lectura.',
        color: 'emerald'
      };
    }

    if (
      clean.startsWith('go test') ||
      clean.startsWith('go build') ||
      clean.startsWith('dotnet build') ||
      clean.startsWith('pytest')
    ) {
      const allowed = perm !== 'READ_ONLY' && perm !== 'ANALYZE';
      return {
        category: 'VERIFICATION',
        risk: 'MEDIUM' as RiskLevel,
        allowed,
        reason: allowed
          ? 'Permitido bajo nivel de ejecución activo.'
          : 'Denegado: El permiso actual es sólo de lectura/análisis. Se requiere permiso EXECUTE.',
        color: allowed ? 'emerald' : 'amber'
      };
    }

    // Default to high risk mutation
    if (!approved) {
      return {
        category: 'MUTATION_REQUIRES_AUTH',
        risk: 'HIGH' as RiskLevel,
        allowed: false,
        reason: 'Detenido: Requiere autorización explícita del usuario para operaciones de mutación/ejecución.',
        color: 'amber'
      };
    }

    if (perm !== 'ADMIN' && perm !== 'EXECUTE') {
      return {
        category: 'INSUFFICIENT_PERMISSION',
        risk: 'HIGH' as RiskLevel,
        allowed: false,
        reason: 'Usuario aprobó, pero el nivel de permisos activo del agente es insuficiente (requiere EXECUTE o ADMIN).',
        color: 'amber'
      };
    }

    return {
      category: 'MUTATION_AUTHORIZED',
      risk: 'HIGH' as RiskLevel,
      allowed: true,
      reason: 'Autorizado explícitamente por el operador humano y registrado en el ledger de auditoría.',
      color: 'emerald'
    };
  };

  const result = evaluateCommand(inputCmd, activePerm, userApproved);

  return (
    <div className="space-y-6">
      <div className="border border-zinc-800 bg-zinc-950 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">
              Simulador Interactivo: Command Policy & Risk Engine
            </h3>
            <p className="text-xs text-zinc-400">
              Prueba en vivo la política de comandos de Santiago: CLASSIFY → RISK ANALYSIS → PERMISSION CHECK → AUDIT.
            </p>
          </div>
        </div>

        {/* Presets */}
        <div className="mb-4">
          <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 block mb-2">
            Comandos de Prueba Predefinidos:
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {PRESET_COMMANDS.map((item) => (
              <button
                key={item.cmd}
                onClick={() => setInputCmd(item.cmd)}
                className={`text-left p-2.5 rounded-lg border text-xs transition-all ${
                  inputCmd === item.cmd
                    ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300'
                    : 'border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:border-zinc-700'
                }`}
              >
                <div className="font-mono text-[11px] truncate">{item.cmd}</div>
                <div className="flex items-center justify-between mt-1 text-[10px] text-zinc-500">
                  <span>{item.category}</span>
                  <span className={item.risk === 'CRITICAL' ? 'text-red-400 font-bold' : ''}>{item.risk}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Input & Controls */}
        <div className="space-y-4 pt-2 border-t border-zinc-800">
          <div>
            <label className="text-xs font-mono text-zinc-400 block mb-1">
              Comando a Evaluar (Shell / Terminal):
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Terminal className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                <input
                  type="text"
                  value={inputCmd}
                  onChange={(e) => setInputCmd(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-emerald-500"
                  placeholder="Ej: git status, go test ./..., del /f /s /q..."
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono text-zinc-400 block mb-1">
                Nivel de Permisos Activo en Santiago:
              </label>
              <select
                value={activePerm}
                onChange={(e) => setActivePerm(e.target.value as PermissionLevel)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="READ_ONLY">READ_ONLY (Solo lectura)</option>
                <option value="ANALYZE">ANALYZE (Análisis sintáctico)</option>
                <option value="PROPOSE">PROPOSE (Propuesta y diffs)</option>
                <option value="MODIFY">MODIFY (Edición con snapshot)</option>
                <option value="EXECUTE">EXECUTE (Compilación y tests)</option>
                <option value="ADMIN">ADMIN (Operaciones críticas)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-mono text-zinc-400 block mb-1">
                Confirmación Explícita del Operador:
              </label>
              <button
                type="button"
                onClick={() => setUserApproved(!userApproved)}
                className={`w-full py-2 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                  userApproved
                    ? 'border-emerald-500/60 bg-emerald-500/15 text-emerald-300'
                    : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-zinc-300'
                }`}
              >
                {userApproved ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>Usuario ha autorizado expresamente la acción</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-zinc-500" />
                    <span>Sin autorización previa (Acción no confirmada)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Live Evaluation Box */}
        <div className="mt-6 pt-5 border-t border-zinc-800">
          <div className="text-xs font-mono uppercase text-zinc-400 mb-2">
            Resultado del Análisis de Política de Seguridad:
          </div>
          <div
            className={`p-4 rounded-xl border ${
              result.allowed
                ? 'border-emerald-500/40 bg-emerald-950/20'
                : result.category === 'DESTRUCTIVE_BLOCKED'
                ? 'border-red-500/40 bg-red-950/20'
                : 'border-amber-500/40 bg-amber-950/20'
            }`}
          >
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-2.5">
                {result.allowed ? (
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : result.category === 'DESTRUCTIVE_BLOCKED' ? (
                  <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                )}
                <div>
                  <div className="text-sm font-bold font-mono text-white flex items-center gap-2">
                    <span>{result.allowed ? 'COMANDO PERMITIDO' : 'EJECUCIÓN DENEGADA / DETENIDA'}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 font-mono text-zinc-300 border border-zinc-700">
                      CATEGORÍA: {result.category}
                    </span>
                  </div>
                  <div className="text-xs text-zinc-300 mt-1">{result.reason}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 font-mono text-xs">
                <div className="bg-zinc-900 px-3 py-1.5 rounded border border-zinc-800">
                  <span className="text-zinc-500 text-[10px] block">RIESGO:</span>
                  <span
                    className={
                      result.risk === 'CRITICAL'
                        ? 'text-red-400 font-bold'
                        : result.risk === 'HIGH'
                        ? 'text-amber-400 font-bold'
                        : result.risk === 'MEDIUM'
                        ? 'text-blue-400'
                        : 'text-emerald-400'
                    }
                  >
                    {result.risk}
                  </span>
                </div>
                <div className="bg-zinc-900 px-3 py-1.5 rounded border border-zinc-800">
                  <span className="text-zinc-500 text-[10px] block">ACCIÓN:</span>
                  <span className="text-white">
                    {result.allowed ? 'EXECUTE & AUDIT' : 'HALT & LOG'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
