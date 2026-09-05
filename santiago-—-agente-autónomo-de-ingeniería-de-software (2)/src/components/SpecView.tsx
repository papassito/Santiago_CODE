import React from 'react';
import { SectionKey } from '../types';
import { SPEC_SECTIONS } from '../data/specificationData';
import { 
  CheckCircle2, 
  Layers, 
  ShieldAlert, 
  Database, 
  Terminal, 
  GitBranch, 
  Bot, 
  CheckSquare, 
  Cpu, 
  Code2, 
  Laptop, 
  Scale, 
  AlertTriangle, 
  FolderTree, 
  Package, 
  Award, 
  Lightbulb, 
  TerminalSquare 
} from 'lucide-react';
import { GoCodeExplorer } from './GoCodeExplorer';
import { CommandPolicyLab } from './CommandPolicyLab';
import { WindowsSafetyLab } from './WindowsSafetyLab';
import { TacticalConsole } from './TacticalConsole';
import { AutoFixLab } from './AutoFixLab';
import { LocalRAGLab } from './LocalRAGLab';
import { KRIDashboard } from './KRIDashboard';
import { SovereignDNALab } from './SovereignDNALab';
import { BunkerCryptoLab } from './BunkerCryptoLab';
import { MultimodalInstallerLab } from './MultimodalInstallerLab';
import { AntigravityVSCodeLab } from './AntigravityVSCodeLab';

interface SpecViewProps {
  sectionKey: SectionKey;
  onNavigate: (key: SectionKey) => void;
  onOpenGate: () => void;
}

export const SpecView: React.FC<SpecViewProps> = ({ sectionKey, onNavigate, onOpenGate }) => {
  const currentSection = SPEC_SECTIONS.find((s) => s.id === sectionKey) || SPEC_SECTIONS[0];

  return (
    <div className="flex-1 p-6 max-w-5xl mx-auto space-y-8 overflow-y-auto">
      {/* Section Header */}
      <div className="border-b border-zinc-800 pb-5">
        <div className="flex items-center gap-2 font-mono text-xs text-emerald-400 mb-1.5 uppercase tracking-wider">
          <span>Punto {typeof currentSection.number === 'number' ? String(currentSection.number).padStart(2, '0') : currentSection.number}</span>
          <span>•</span>
          <span className="text-zinc-400">{currentSection.category}</span>
        </div>
        <h2 className="text-2xl font-bold font-mono text-white tracking-tight">
          {currentSection.title}
        </h2>
        <p className="text-sm text-zinc-400 mt-1 leading-relaxed">
          {currentSection.shortDesc}
        </p>
      </div>

      {/* Render Operational Tactical Labs */}
      {sectionKey === 'tactical-console' && <TacticalConsole />}
      {sectionKey === 'autofix-loop' && <AutoFixLab />}
      {sectionKey === 'local-rag' && <LocalRAGLab />}
      {sectionKey === 'kri-metrics' && <KRIDashboard />}
      {sectionKey === 'jesus-dna' && <SovereignDNALab />}
      {sectionKey === 'bunker-crypto' && <BunkerCryptoLab />}
      {sectionKey === 'multimodal-installer' && <MultimodalInstallerLab />}
      {sectionKey === 'antigravity-vscode' && <AntigravityVSCodeLab />}

      {/* Render Dynamic Content based on sectionKey */}
      {sectionKey === 'overview' && (
        <div className="space-y-6">
          <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-950 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              <span>Desacoplamiento Absoluto: Santiago Core vs. Model Provider</span>
            </h3>
            <p className="text-sm text-zinc-300 leading-relaxed">
              La arquitectura de Santiago establece que <strong>el modelo de IA NO es el agente</strong>. El modelo (Ollama local con Qwen2.5-Coder, DeepSeek-Coder, o Llama) es únicamente el componente cognitivo intercambiable.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-lg bg-zinc-900/80 border border-zinc-800">
                <div className="text-xs font-mono font-bold text-emerald-400 uppercase mb-2">
                  SANTIAGO CORE (Permanece Inmutable)
                </div>
                <ul className="text-xs text-zinc-300 space-y-1.5 list-disc list-inside">
                  <li>Identidad y reglas de ingeniería senior</li>
                  <li>Memoria de 6 capas en SQLite local</li>
                  <li>Motor de herramientas con sandbox tipado</li>
                  <li>Aislamiento de proyectos y registro de dependencias</li>
                  <li>Políticas de seguridad: DETECTAR ≠ DECIDIR ≠ EJECUTAR</li>
                  <li>Ledger inmutable de auditoría con SHA-256</li>
                  <li>Snapshots atómicos y motor de rollback</li>
                </ul>
              </div>

              <div className="p-4 rounded-lg bg-zinc-900/80 border border-zinc-800">
                <div className="text-xs font-mono font-bold text-blue-400 uppercase mb-2">
                  MODEL PROVIDER (Intercambiable)
                </div>
                <ul className="text-xs text-zinc-300 space-y-1.5 list-disc list-inside">
                  <li>Ollama en loopback local (127.0.0.1:11434)</li>
                  <li>Soporte de pesos GGUF locales (llama.cpp)</li>
                  <li>Cero dependencia de Gemini, OpenAI o Claude</li>
                  <li>Intercambio de modelo en caliente sin pérdida de estado</li>
                  <li>Monitoreo de tokens y latencia por tarea</li>
                  <li>Capacidad de operar 100% offline sin conexión a internet</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-950 font-mono text-xs text-zinc-300">
            <div className="text-zinc-500 uppercase mb-2 font-bold text-[11px]">
              Diagrama de Capas de Santiago Core:
            </div>
            <pre className="p-4 bg-zinc-900/90 rounded-lg border border-zinc-800 overflow-x-auto text-emerald-400 leading-relaxed">
{`SANTIAGO RUNTIME (GO 1.22+)
│
├── internal/core (Lifecycle Orchestrator)
├── internal/memory (SQLite WAL: 6 Capas de Memoria)
├── internal/planner (Task Breakdown & AST Context Graph)
├── internal/tools (Filesystem, Terminal, Git, Compilers)
├── internal/execution (Windows Native Process & Sanitize)
├── internal/verification (Independent Compile & Test Verifier)
├── internal/security (Command Policy: Detect != Decide != Exec)
├── internal/audit (Immutable Cryptographic Ledger)
└── internal/model (Model Router)
          │
          ├── Ollama Daemon (http://127.0.0.1:11434)
          └── GGUF Local Fallback (CGO-free)`}
            </pre>
          </div>
        </div>
      )}

      {sectionKey === 'project-tree' && (
        <div className="space-y-6">
          <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-950 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FolderTree className="w-5 h-5 text-emerald-400" />
              <span>Estructura Canónica de Paquetes Go</span>
            </h3>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Diseñado siguiendo las directrices estándar de arquitectura en Go (Standard Go Project Layout). Separación clara entre ejecutables en <code className="text-emerald-400 font-mono">cmd/</code>, código interno protegido en <code className="text-emerald-400 font-mono">internal/</code>, y contratos públicos en <code className="text-emerald-400 font-mono">pkg/</code>.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 space-y-2 text-xs">
                <div className="font-mono text-emerald-400 font-bold">internal/</div>
                <p className="text-zinc-400">
                  Código privado que no puede ser importado por módulos externos. Encapsula toda la lógica de ejecución del agente, SQLite, parsers y políticas de seguridad.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 space-y-2 text-xs">
                <div className="font-mono text-emerald-400 font-bold">pkg/ (interfaces & types)</div>
                <p className="text-zinc-400">
                  Tipos puros e interfaces canónicas. Permite desacoplamiento absoluto, tests unitarios con mocks y extensión modular para futuros agentes especializados.
                </p>
              </div>
            </div>
          </div>

          <GoCodeExplorer />
        </div>
      )}

      {sectionKey === 'components' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                name: 'Core Orchestrator',
                pkg: 'internal/core',
                desc: 'Controla el ciclo de vida del agente y la transición de fases del Protocolo Maestro.',
                color: 'emerald'
              },
              {
                name: 'Model Router',
                pkg: 'internal/model',
                desc: 'Abstrae Ollama y modelos locales; gestiona prompts, tokens y latencia.',
                color: 'blue'
              },
              {
                name: '6-Tier Memory Store',
                pkg: 'internal/memory',
                desc: 'SQLite con modo WAL: almacena conocimiento por proyecto, fallos previos y decisiones.',
                color: 'purple'
              },
              {
                name: 'Task Planner & AST Graph',
                pkg: 'internal/planner',
                desc: 'Descompone tareas complejas en micro-operaciones y modela el Project Context Graph.',
                color: 'amber'
              },
              {
                name: 'Command Policy & Safety',
                pkg: 'internal/security',
                desc: 'Aplica la regla DETECTAR ≠ DECIDIR ≠ EJECUTAR y bloquea comandos destructivos.',
                color: 'red'
              },
              {
                name: 'Verification Engine',
                pkg: 'internal/verification',
                desc: 'Compila, ejecuta tests y compara diffs. Distingue inferencias de pruebas empíricas.',
                color: 'emerald'
              },
              {
                name: 'Rollback & Snapshots',
                pkg: 'internal/tools/filesystem',
                desc: 'Genera instantáneas con hash SHA-256 antes de cada mutación para reversión atómica.',
                color: 'cyan'
              },
              {
                name: 'Cryptographic Audit Ledger',
                pkg: 'internal/audit',
                desc: 'Registro inmutable append-only con timestamp, hashes de antes/después y evidencias.',
                color: 'indigo'
              }
            ].map((c) => (
              <div key={c.name} className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white font-mono">{c.name}</h4>
                  <code className="text-[10px] text-zinc-500 font-mono bg-zinc-900 px-2 py-0.5 rounded">
                    {c.pkg}
                  </code>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {sectionKey === 'go-interfaces' && (
        <div className="space-y-6">
          <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-950 space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Code2 className="w-5 h-5 text-emerald-400" />
              <span>Contratos e Interfaces Puras en Go</span>
            </h3>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Las interfaces definen los límites del sistema. Ninguna implementación depende de paquetes concretos de proveedores comerciales.
            </p>
          </div>
          <GoCodeExplorer />
        </div>
      )}

      {sectionKey === 'data-flow' && (
        <div className="space-y-6">
          <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-950 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-emerald-400" />
              <span>Protocolo Operativo Maestro (7 Fases)</span>
            </h3>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Todas las tareas de desarrollo en Santiago deben obedecer obligatoriamente el flujo maestro de certificación:
            </p>

            <div className="space-y-3 pt-2">
              {[
                { stage: '1. COMPRENDER', desc: 'Inspecciona el proyecto completo, dependencias, tecnologías y entry points. Construye el Project Context Graph.' },
                { stage: '2. DEMOSTRAR', desc: 'Presenta evidencias empíricas (hashes, salidas de herramientas, logs de compilación) antes de afirmar cualquier diagnóstico.' },
                { stage: '3. PROPONER', desc: 'Formula un plan descompuesto en sub-tareas con archivos objetivo, riesgos y herramientas requeridas.' },
                { stage: '4. AUTORIZACIÓN', desc: 'Solicita y verifica la autorización del usuario si la operación implica riesgo medio o alto (MODIFY, EXECUTE, ADMIN).' },
                { stage: '5. EJECUTAR', desc: 'Genera un snapshot del archivo y aplica la modificación o comando a través del sandbox de herramientas.' },
                { stage: '6. VERIFICAR', desc: 'Compila el código, ejecuta suites de tests automáticos, valida linters y revisa diffs. Si falla, activa Rollback.' },
                { stage: '7. CERTIFICAR', desc: 'Registra la evidencia final en el ledger de auditoría y reporta el estatus (VERIFIED) al operador.' }
              ].map((step, idx) => (
                <div key={step.stage} className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="text-xs font-mono font-bold text-white">{step.stage}</div>
                    <div className="text-xs text-zinc-400 mt-0.5">{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {sectionKey === 'memory-model' && (
        <div className="space-y-6">
          <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-950 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-400" />
              <span>Modelo de Memoria de 6 Capas Persistentes (SQLite WAL)</span>
            </h3>
            <p className="text-sm text-zinc-300 leading-relaxed">
              La memoria de Santiago reside localmente en una base de datos SQLite con modo Write-Ahead Logging (WAL), permitiendo lecturas concurrentes sin bloquear escrituras.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: 'Short-Term Memory', desc: 'Contexto de la tarea actual, variables temporales y estado del turno activo.' },
                { title: 'Project Memory', desc: 'Grafo de archivos, módulos, stack y arquitectura de cada proyecto (SOLUSOL, KLIK, etc.) estrictamente aislado por ProjectID.' },
                { title: 'Long-Term Memory', desc: 'Conocimiento general y heurísticas de ingeniería de software aplicables a múltiples proyectos.' },
                { title: 'Decision Memory', desc: 'Historial de decisiones arquitectónicas previas y las justificaciones dadas por el equipo.' },
                { title: 'Failure Memory', desc: 'Registro de errores de compilación previos, causas raíces identificadas y soluciones comprobadas.' },
                { title: 'User Instructions', desc: 'Reglas, directivas maestras y preferencias inmutables establecidas por el operador humano.' }
              ].map((m) => (
                <div key={m.title} className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 space-y-1.5">
                  <div className="text-xs font-bold font-mono text-emerald-400">{m.title}</div>
                  <div className="text-xs text-zinc-300 leading-relaxed">{m.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {sectionKey === 'tools-model' && (
        <div className="space-y-6">
          <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-950 space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-emerald-400" />
              <span>Sistema Modular de Herramientas y Sandbox</span>
            </h3>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Cada herramienta implementa la interfaz <code className="text-emerald-400 font-mono">Tool</code>, declarando explícitamente su nivel de riesgo y permiso mínimo requerido.
            </p>

            <div className="overflow-x-auto pt-2">
              <table className="w-full text-left text-xs border border-zinc-800 rounded-lg overflow-hidden">
                <thead className="bg-zinc-900 text-zinc-400 font-mono uppercase">
                  <tr>
                    <th className="p-3">Herramienta</th>
                    <th className="p-3">Permiso Mínimo</th>
                    <th className="p-3">Nivel de Riesgo</th>
                    <th className="p-3">Capacidades</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 text-zinc-300">
                  <tr>
                    <td className="p-3 font-mono text-emerald-400">filesystem.read</td>
                    <td className="p-3">READ_ONLY</td>
                    <td className="p-3 text-emerald-400">SAFE</td>
                    <td className="p-3">Lectura de archivos, listado de directorios, cálculo de SHA-256.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-emerald-400">code_intel.parse</td>
                    <td className="p-3">ANALYZE</td>
                    <td className="p-3 text-emerald-400">SAFE</td>
                    <td className="p-3">AST parsing (Go AST, Roslyn, TypeScript), extracción de símbolos.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-amber-400">compiler.run</td>
                    <td className="p-3">EXECUTE</td>
                    <td className="p-3 text-blue-400">MEDIUM</td>
                    <td className="p-3">go build, dotnet build, tsc; captura de errores sintácticos.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-amber-400">test.execute</td>
                    <td className="p-3">EXECUTE</td>
                    <td className="p-3 text-blue-400">MEDIUM</td>
                    <td className="p-3">go test, dotnet test, pytest; análisis de fallos y timeouts.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-red-400">filesystem.write</td>
                    <td className="p-3">MODIFY</td>
                    <td className="p-3 text-amber-400">HIGH</td>
                    <td className="p-3">Modificación de código (requiere snapshot obligatorio).</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-red-400">filesystem.delete</td>
                    <td className="p-3">ADMIN</td>
                    <td className="p-3 text-red-400 font-bold">CRITICAL</td>
                    <td className="p-3">Eliminación de archivos (requiere confirmación explícita del usuario).</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {sectionKey === 'permissions-model' && (
        <div className="space-y-6">
          <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-950 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              <span>Matriz de Permisos y Principio Epistémico</span>
            </h3>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Regla fundamental de diseño en Santiago: <strong>DETECTAR ≠ DECIDIR ≠ EJECUTAR</strong>.
              Detectar una vulnerabilidad o un error no faculta automáticamente al agente para aplicar cambios destructivos.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-2">
              {[
                { lvl: 'READ_ONLY', desc: 'Inspección de código y lecturas de proyectos.' },
                { lvl: 'ANALYZE', desc: 'AST parsing, linters y grafos de dependencias.' },
                { lvl: 'PROPOSE', desc: 'Generación de planes de refactorización y diffs.' },
                { lvl: 'MODIFY', desc: 'Edición y creación de archivos con snapshot previo.' },
                { lvl: 'EXECUTE', desc: 'Ejecución de compiladores y suites de pruebas.' },
                { lvl: 'ADMIN', desc: 'Operaciones críticas o cambios estructurales.' }
              ].map((p) => (
                <div key={p.lvl} className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 space-y-1">
                  <div className="text-xs font-mono font-bold text-emerald-400">{p.lvl}</div>
                  <div className="text-[11px] text-zinc-400">{p.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <CommandPolicyLab />
        </div>
      )}

      {sectionKey === 'audit-model' && (
        <div className="space-y-6">
          <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-950 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-400" />
              <span>Ledger Inmutable de Auditoría Forense</span>
            </h3>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Toda mutación o ejecución relevante produce un registro inmutable con timestamps UTC, actor, herramienta, objetivo, hashes SHA-256 de antes y después, nivel de riesgo y evidencia capturada.
            </p>

            <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-800 font-mono text-xs text-zinc-300 overflow-x-auto">
              <pre className="text-emerald-400">
{`{
  "id": "e4f8b2d1-0012-4f32-bb18-a89c3140ab82",
  "timestamp": "2026-09-02T20:50:00Z",
  "project_id": "SOLUSOL.NET",
  "actor": "santiago-core",
  "tool": "filesystem.write",
  "target": "internal/auth/token.go",
  "before_hash": "a1b2c3d4e5f6...",
  "after_hash": "f6e5d4c3b2a1...",
  "risk": "HIGH",
  "perm_required": "MODIFY",
  "user_authorized": true,
  "result": "SUCCESS",
  "evidence": "Compilation passed (go test ./... exit code 0)",
  "evidence_status": "VERIFIED",
  "duration_ms": 142
}`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {sectionKey === 'ollama-strategy' && (
        <div className="space-y-6">
          <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-950 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Bot className="w-5 h-5 text-blue-400" />
              <span>Estrategia Ollama (Local-First y Privacidad Absoluta)</span>
            </h3>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Santiago se conecta localmente al demonio de Ollama en <code className="text-emerald-400 font-mono">http://127.0.0.1:11434</code>. Los modelos recomendados para desarrollo de software autónomo son:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 space-y-2">
                <div className="text-xs font-mono font-bold text-emerald-400">qwen2.5-coder:7b</div>
                <p className="text-xs text-zinc-400">
                  Modelo primario recomendado. Excelente equilibrio entre velocidad de inferencia en GPU/CPU y precisión en generación de código Go, C# y TypeScript.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 space-y-2">
                <div className="text-xs font-mono font-bold text-blue-400">deepseek-coder:6.7b / 16b</div>
                <p className="text-xs text-zinc-400">
                  Modelo para análisis profundo y refactorizaciones complejas de arquitectura.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 space-y-2">
                <div className="text-xs font-mono font-bold text-purple-400">llama3.1:8b</div>
                <p className="text-xs text-zinc-400">
                  Modelo general de respaldo para análisis de documentación, planes y síntesis.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {sectionKey === 'test-strategy' && (
        <div className="space-y-6">
          <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-950 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-emerald-400" />
              <span>Estrategia de Pruebas y Validación Rigurosa</span>
            </h3>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Antes de considerar cualquier fase como operativa, se ejecutan baterías automáticas de verificación:
            </p>
            <ul className="text-xs text-zinc-300 space-y-2 list-disc list-inside">
              <li><strong>Unit Tests en Go:</strong> Cobertura de Command Policy, serialización de tipos y cómputo SHA-256 sin dependencias externas.</li>
              <li><strong>Mock de Inferencia:</strong> Pruebas del Model Router con un mock HTTP para garantizar compilación en entornos sin GPU.</li>
              <li><strong>Pruebas de Snapshots & Rollback:</strong> Verificación de restauración byte-por-byte tras abortar mutaciones fallidas.</li>
              <li><strong>Pruebas de Bloqueo de Comandos Destructivos:</strong> Comprobación de que comandos peligrosos son rechazados inmediatamente.</li>
            </ul>
          </div>
        </div>
      )}

      {sectionKey === 'technical-risks' && (
        <div className="space-y-6">
          <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-950 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span>Matriz de Riesgos Técnicos y Mitigaciones</span>
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-zinc-800 rounded-lg overflow-hidden">
                <thead className="bg-zinc-900 text-zinc-400 font-mono uppercase">
                  <tr>
                    <th className="p-3">Riesgo Técnico</th>
                    <th className="p-3">Impacto</th>
                    <th className="p-3">Estrategia de Mitigación en Santiago</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 text-zinc-300">
                  <tr>
                    <td className="p-3 font-semibold text-white">Consumo excesivo de RAM por Ollama</td>
                    <td className="p-3 text-red-400">Alto</td>
                    <td className="p-3">Ventana de contexto acotada (16K), streaming con buffers reciclados y límites en config YAML.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Alerta de Firewall de Windows al iniciar</td>
                    <td className="p-3 text-amber-400">Medio</td>
                    <td className="p-3">Bindeo obligatorio y exclusivo a 127.0.0.1 (Loopback). Cero escuchas en 0.0.0.0.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Falsos positivos de Windows Defender</td>
                    <td className="p-3 text-red-400">Alto</td>
                    <td className="p-3">Manifiesto asInvoker, prohibición de ejecutar binarios en %TEMP% y sin scripts ofuscados.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Alucinación de compilación o tests</td>
                    <td className="p-3 text-red-400">Crítico</td>
                    <td className="p-3">Regla Epistémica: Prohibido afirmar que un código funciona sin haber ejecutado `go test` o `go build` real.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {sectionKey === 'dependencies' && (
        <div className="space-y-6">
          <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-950 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-emerald-400" />
              <span>Dependencias Mínimas y Stack CGO-Free para Windows</span>
            </h3>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Para garantizar que el binario de Santiago compile limpiamente en cualquier PC con Windows sin requerir la instalación de compiladores de C (GCC o MinGW), se priorizan dependencias en Go puro:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                <div className="font-mono text-emerald-400 font-bold">Go Standard Library (net/http, os, exec, crypto)</div>
                <div className="text-zinc-400 mt-1">Núcleo del sistema: networking, gestión de procesos y cómputo de hashes.</div>
              </div>
              <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                <div className="font-mono text-emerald-400 font-bold">github.com/google/uuid</div>
                <div className="text-zinc-400 mt-1">Identificadores universales inmutables para el ledger de auditoría y snapshots.</div>
              </div>
              <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                <div className="font-mono text-emerald-400 font-bold">modernc.org/sqlite (CGO-Free)</div>
                <div className="text-zinc-400 mt-1">Motor SQLite en Go puro, permitiendo distribución en binario único sin DLLs adicionales.</div>
              </div>
              <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                <div className="font-mono text-emerald-400 font-bold">gopkg.in/yaml.v3</div>
                <div className="text-zinc-400 mt-1">Lectura y validación de configuración declarativa del agente.</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {sectionKey === 'acceptance-criteria' && (
        <div className="space-y-6">
          <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-950 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-400" />
                <span>Criterios de Aceptación y Estado de la Fase 0</span>
              </h3>
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                100% CUMPLIDO
              </span>
            </div>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Checklist normativo exigido por el usuario antes de proceder a la Fase 1:
            </p>

            <div className="space-y-2 pt-2 text-xs">
              {[
                { id: '1', label: '1. Arquitectura y separación Core vs Model Provider completada.', done: true },
                { id: '2', label: '2. Árbol canónico del proyecto Go estructurado en santiago-go/.', done: true },
                { id: '3', label: '3. Componentes y responsabilidades unívocamente especificados.', done: true },
                { id: '4', label: '4. Interfaces en Go codificadas en pkg/interfaces/interfaces.go.', done: true },
                { id: '5', label: '5. Flujo de datos y Protocolo Maestro de 7 fases formalizado.', done: true },
                { id: '6', label: '6. Modelo de memoria en 6 capas especificado para SQLite local.', done: true },
                { id: '7', label: '7. Modelo de herramientas tipado con riesgos y permisos.', done: true },
                { id: '8', label: '8. Modelo de permisos y regla DETECTAR ≠ DECIDIR ≠ EJECUTAR implementada en policy.go.', done: true },
                { id: '9', label: '9. Modelo de auditoría con ledger criptográfico y hashes SHA-256 en ledger.go.', done: true },
                { id: '10', label: '10. Estrategia Ollama local (127.0.0.1:11434) codificada en ollama.go.', done: true },
                { id: '11', label: '11. Estrategia de pruebas unitarias, mocks y rollback definida.', done: true },
                { id: '12', label: '12. Matriz de riesgos técnicos y mitigaciones aprobada.', done: true },
                { id: '13', label: '13. Dependencias en Go puro y compilación CGO-Free para Windows.', done: true },
                { id: '14', label: '14. Criterios de aceptación verificados y parada formal de fase.', done: true },
                { id: '15', label: '15. Perfil experto de troubleshooting y resolución de problemas.', done: true },
                { id: '16', label: '16. Rigor objetivo y prohibición de alucinar resultados.', done: true },
                { id: '17', label: '17. Programabilidad vía CLI, API REST local y archivo YAML.', done: true },
                { id: 'win', label: 'WINDOWS PC: Amigable con Antivirus (asInvoker, sin %TEMP%) y Firewall (Loopback estricto 127.0.0.1).', done: true }
              ].map((item) => (
                <div key={item.id} className="p-3 rounded-lg bg-zinc-900 border border-zinc-800/80 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-zinc-200">{item.label}</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase shrink-0">
                    Verificado
                  </span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-zinc-300 mt-4 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300 block font-mono uppercase mb-1">
                  ORDEN DE DETENCIÓN MAESTRA ACTIVA
                </strong>
                Por mandato de la directiva #29: «Al finalizar cada fase, DETENTE. No continúes automáticamente hacia la siguiente fase. Espera autorización para continuar.» La Fase 0 está completada y en espera de su autorización para iniciar la Fase 1.
              </div>
            </div>
          </div>
        </div>
      )}

      {sectionKey === 'expert-problem-solving' && (
        <div className="space-y-6">
          <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-950 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-400" />
              <span>Perfil Experto en Desarrollo y Resolución de Problemas</span>
            </h3>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Santiago opera con la disciplina analítica de un ingeniero de software senior:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 space-y-2">
                <div className="font-mono text-emerald-400 font-bold">1. Análisis Forense de Fallos</div>
                <p className="text-zinc-400">
                  Desglosa compiler errors, stack traces y panics hasta su origen de código exacto en lugar de aplicar parches superficiales a ciegas.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 space-y-2">
                <div className="font-mono text-emerald-400 font-bold">2. Hipótesis Falsables</div>
                <p className="text-zinc-400">
                  Formula suposiciones claras y diseña pruebas mínimas para comprobarlas o refutarlas antes de alterar archivos de producción.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 space-y-2">
                <div className="font-mono text-emerald-400 font-bold">3. Modificación Quirúrgica</div>
                <p className="text-zinc-400">
                  Aplica cambios acotados y precisos sobre funciones específicas, preservando la arquitectura y formato del proyecto.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 space-y-2">
                <div className="font-mono text-emerald-400 font-bold">4. Memoria de Aprendizaje</div>
                <p className="text-zinc-400">
                  Almacena el error y la solución comprobada en la Failure Memory de SQLite para evitar tropezar con el mismo problema dos veces.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {sectionKey === 'objectivity-rigor' && (
        <div className="space-y-6">
          <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-950 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-emerald-400" />
              <span>Objetividad Absoluta y Estatus Epistémico</span>
            </h3>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Santiago tiene prohibido inventar resultados, tests o archivos. Toda conclusión emitida por el agente posee una categoría epistémica formal:
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-zinc-900 border border-emerald-500/30">
                <div className="font-mono font-bold text-emerald-400">VERIFIED</div>
                <div className="text-zinc-400 mt-1">Comprobado empíricamente por una prueba o compilación ejecutada.</div>
              </div>
              <div className="p-3 rounded-lg bg-zinc-900 border border-blue-500/30">
                <div className="font-mono font-bold text-blue-400">INFERENCE</div>
                <div className="text-zinc-400 mt-1">Deducción lógica basada en código, pendiente de prueba empírica.</div>
              </div>
              <div className="p-3 rounded-lg bg-zinc-900 border border-purple-500/30">
                <div className="font-mono font-bold text-purple-400">HYPOTHESIS</div>
                <div className="text-zinc-400 mt-1">Posible explicación de un error pendiente de comprobación.</div>
              </div>
              <div className="p-3 rounded-lg bg-zinc-900 border border-amber-500/30">
                <div className="font-mono font-bold text-amber-400">UNVERIFIED</div>
                <div className="text-zinc-400 mt-1">Afirmación no comprobada todavía por las herramientas.</div>
              </div>
              <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-700">
                <div className="font-mono font-bold text-zinc-400">UNKNOWN</div>
                <div className="text-zinc-400 mt-1">Estado desconocido. Se detiene antes de conjeturar falsedades.</div>
              </div>
              <div className="p-3 rounded-lg bg-zinc-900 border border-red-500/30">
                <div className="font-mono font-bold text-red-400">INSUFFICIENT EVIDENCE</div>
                <div className="text-zinc-400 mt-1">Falta de datos empíricos suficientes para emitir un juicio.</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {sectionKey === 'programmability' && (
        <div className="space-y-6">
          <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-950 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TerminalSquare className="w-5 h-5 text-emerald-400" />
              <span>Programabilidad Total (CLI, REST API y YAML)</span>
            </h3>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Santiago está diseñado como software programable que puede ser integrado en pipelines de CI/CD locales, scripts de automatización de PowerShell o consumido mediante REST:
            </p>

            <div className="space-y-3 text-xs font-mono">
              <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800 text-zinc-300">
                <div className="text-zinc-500 text-[11px] mb-1">Comando CLI en PowerShell:</div>
                <span className="text-emerald-400">santiago.exe</span> --project="SOLUSOL.NET" --mode=ANALYZE --directive="auditar vulnerabilidades de inyección"
              </div>

              <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800 text-zinc-300">
                <div className="text-zinc-500 text-[11px] mb-1">Petición REST Local a la API de Santiago (127.0.0.1:34820):</div>
                <span className="text-blue-400">POST</span> http://127.0.0.1:34820/api/v1/task/plan<br />
                <span className="text-zinc-500">&#123; "project_id": "RepairerGO", "objective": "optimizar pool de SQLite" &#125;</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {sectionKey === 'windows-optimization' && (
        <div className="space-y-6">
          <WindowsSafetyLab />
        </div>
      )}

      {sectionKey === 'simulator-policy' && (
        <div className="space-y-6">
          <CommandPolicyLab />
        </div>
      )}

      {sectionKey === 'simulator-protocol' && (
        <div className="space-y-6">
          <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-950 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-emerald-400" />
              <span>Simulador Interactivo del Protocolo Maestro</span>
            </h3>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Ejemplo paso a paso de cómo Santiago aborda un requerimiento real de ingeniería sobre un proyecto como <strong>SOLUSOL.NET</strong>:
            </p>

            <div className="space-y-3 pt-2">
              {[
                {
                  fase: 'FASE 1: COMPRENDER',
                  badge: 'INSPECCIÓN',
                  output: 'Escanea el repositorio. Identifica Go 1.22, SQLite, 14 módulos, 88 tests unitarios pasando.',
                  color: 'emerald'
                },
                {
                  fase: 'FASE 2: DEMOSTRAR',
                  badge: 'EVIDENCIA',
                  output: 'Localiza fuga de memoria en conexión HTTP. Evidencia: MemStats Alloc crece 18 MB cada 1000 requests.',
                  color: 'blue'
                },
                {
                  fase: 'FASE 3: PROPONER',
                  badge: 'PLAN',
                  output: 'Plan formulado: Reemplazar cliente HTTP por singleton con Transport reutilizable y Body.Close() deferido.',
                  color: 'purple'
                },
                {
                  fase: 'FASE 4: AUTORIZACIÓN',
                  badge: 'SEGURIDAD',
                  output: 'Riesgo: MEDIUM. Requiere permiso EXECUTE y confirmación del usuario para modificar pkg/client/http.go.',
                  color: 'amber'
                },
                {
                  fase: 'FASE 5: EJECUTAR',
                  badge: 'ACCIÓN',
                  output: 'Toma snapshot con hash SHA256 (e3b0c44...). Aplica modificación del cliente HTTP en memoria.',
                  color: 'emerald'
                },
                {
                  fase: 'FASE 6: VERIFICAR',
                  badge: 'COMPROBACIÓN',
                  output: 'Ejecuta `go test -v ./pkg/client/...`. Todos los 14 tests pasan. Memoria estabilizada.',
                  color: 'emerald'
                },
                {
                  fase: 'FASE 7: CERTIFICAR',
                  badge: 'LEDGER',
                  output: 'Registra entrada inmutable en el ledger de auditoría con status VERIFIED. Tarea completada con éxito.',
                  color: 'emerald'
                }
              ].map((step) => (
                <div key={step.fase} className="p-3.5 rounded-lg bg-zinc-900 border border-zinc-800 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-white">{step.fase}</span>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                      {step.badge}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 font-mono">{step.output}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="pt-6 border-t border-zinc-800 flex items-center justify-between">
        <button
          onClick={onOpenGate}
          className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-md"
        >
          <span>Revisar Estado de la Fase 0 (Detenido)</span>
        </button>
        <button
          onClick={() => onNavigate('acceptance-criteria')}
          className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-medium transition-colors"
        >
          Ir a Criterios de Aceptación
        </button>
      </div>
    </div>
  );
};
