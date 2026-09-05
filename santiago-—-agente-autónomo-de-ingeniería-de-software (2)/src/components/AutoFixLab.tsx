import React, { useState } from 'react';
import { RefreshCw, Play, CheckCircle2, AlertTriangle, ShieldCheck, FileCode, Layers, ArrowRight } from 'lucide-react';

interface AutoFixStep {
  stepNumber: number;
  phase: string;
  detail: string;
  status: 'passed' | 'failed' | 'in_progress';
  codeDiff?: { before: string; after: string };
}

export const AutoFixLab: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedError, setSelectedError] = useState<'zerodiv' | 'dicom' | 'nameerror'>('zerodiv');
  const [showArchMap, setShowArchMap] = useState(false);

  const errorScenarios = {
    zerodiv: {
      title: 'ZeroDivisionError en módulo de facturación médica',
      file: 'pkg/billing/invoice.go',
      initialCode: `func CalculateTaxRate(amount, factor float64) (float64, error) {
    // Calculo directo sin proteccion
    rate := amount / factor
    return rate, nil
}`,
      stderr: `panic: runtime error: integer divide by zero
goroutine 1 [running]:
main.CalculateTaxRate(0x4059000000000000, 0x0)
    C:/Santiago/pkg/billing/invoice.go:3 +0x34
FAIL    pkg/billing [build failed]`,
      fixStrategy: 'AST Mutation: add_guard_condition_zero_check',
      patchedCode: `func CalculateTaxRate(amount, factor float64) (float64, error) {
    // [Santiago AutoFix: Guarded ZeroDivisionError]
    if factor == 0 {
        return 0, fmt.Errorf("factor de division no puede ser cero (KlikSoft Pro Rule)")
    }
    rate := amount / factor
    return rate, nil
}`
    },
    dicom: {
      title: 'DICOM Header Explicit VR Misalignment (Pág. 45)',
      file: 'pkg/imaging/dicom_parser.go',
      initialCode: `func WriteHeaderElement(tag uint32, vr string, data []byte) []byte {
    buf := new(bytes.Buffer)
    binary.Write(buf, binary.LittleEndian, tag)
    buf.WriteString(vr)
    // Falta padding de 2 bytes reservado segun DICOM PS3.5
    binary.Write(buf, binary.LittleEndian, uint32(len(data)))
    buf.Write(data)
    return buf.Bytes()
}`,
      stderr: `DICOM Validation Error: Tag (0028,0010) malformed Value Length offset.
Expected 2-byte reserved padding (0000H) after Explicit VR 'OB'.
Found premature length marker. Parser rejected image frame.`,
      fixStrategy: 'RAG Knowledge: DICOM PS3.5 Section 7.1.2 pág 45',
      patchedCode: `func WriteHeaderElement(tag uint32, vr string, data []byte) []byte {
    buf := new(bytes.Buffer)
    binary.Write(buf, binary.LittleEndian, tag)
    buf.WriteString(vr)
    // Segun manual DICOM PS3.5 pag 45: 2 bytes reservados (0000H)
    binary.Write(buf, binary.LittleEndian, uint16(0x0000))
    binary.Write(buf, binary.LittleEndian, uint32(len(data)))
    buf.Write(data)
    return buf.Bytes()
}`
    },
    nameerror: {
      title: 'ImportError / Undefined Symbol en cliente de red',
      file: 'pkg/network/client.go',
      initialCode: `func FetchSovereignData(ctx context.Context, url string) ([]byte, error) {
    req, _ := http.NewRequestWithContext(ctx, "GET", url, nil)
    resp, err := httpClient.Do(req) // httpClient indefinido
    return io.ReadAll(resp.Body)
}`,
      stderr: `pkg/network/client.go:3:16: undefined: httpClient
pkg/network/client.go:4:5: undefined: io`,
      fixStrategy: 'AST Mutation: declare_typed_variable + canonical imports',
      patchedCode: `func FetchSovereignData(ctx context.Context, url string) ([]byte, error) {
    var httpClient = &http.Client{Timeout: 10 * time.Second}
    req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
    if err != nil { return nil, err }
    resp, err := httpClient.Do(req)
    if err != nil { return nil, err }
    defer resp.Body.Close()
    return io.ReadAll(resp.Body)
}`
    }
  };

  const scenario = errorScenarios[selectedError];

  const handleRunFeedbackLoop = () => {
    setIsRunning(true);
    setCurrentStep(1);

    setTimeout(() => {
      setCurrentStep(2); // DeepIntegrationTester runs test & catches error
      setTimeout(() => {
        setCurrentStep(3); // Reads error, searches solution library
        setTimeout(() => {
          setCurrentStep(4); // Writes to .tmp, atomic rename, creates .bak
          setTimeout(() => {
            setCurrentStep(5); // Test re-executed in closed loop -> PASSED!
            setIsRunning(false);
          }, 900);
        }, 800);
      }, 800);
    }, 700);
  };

  return (
    <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-950 space-y-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-emerald-400 mb-1 uppercase tracking-wider">
            <span>SANTIAGO YEMINOUX</span>
            <span>•</span>
            <span>AUTONOMÍA REAL (MÁS ALLÁ DE DEVIN)</span>
          </div>
          <h3 className="text-xl font-bold font-mono text-white flex items-center gap-2">
            <span>Bucle de Auto-Refactoring & DeepIntegrationTester</span>
          </h3>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
            Si el test falla, Santiago <strong>no te molesta</strong>: lee el error en stderr, busca en su biblioteca la solución o muta el AST, y reintenta en bucle cerrado hasta que el test pase.
          </p>
        </div>

        <button
          onClick={() => setShowArchMap(!showArchMap)}
          className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-mono text-zinc-200 flex items-center gap-2 transition-colors"
        >
          <Layers className="w-4 h-4 text-emerald-400" />
          <span>{showArchMap ? 'Ocultar Mapa KlikSoft' : 'Ver Mapa de Arquitectura'}</span>
        </button>
      </div>

      {/* KlikSoft Pro Architecture Map Modal/Section */}
      {showArchMap && (
        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between">
            <span className="text-emerald-400 font-bold uppercase">
              Mapa de Arquitectura KlikSoft Pro (UI vs Data vs Logic)
            </span>
            <span className="text-[10px] text-zinc-500">
              Generado antes de escribir cualquier línea de código
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 space-y-1">
              <div className="text-emerald-400 font-bold">1. UI Presentation</div>
              <ul className="text-zinc-400 text-[11px] space-y-1 list-disc list-inside">
                <li>Stateless Composables / Android XML</li>
                <li>ViewModels con StateFlow inmutable</li>
                <li>Cero consultas SQL en vistas</li>
              </ul>
            </div>
            <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 space-y-1">
              <div className="text-blue-400 font-bold">2. Data Layer</div>
              <ul className="text-zinc-400 text-[11px] space-y-1 list-disc list-inside">
                <li>OfflineLocalStore (SQLite WAL)</li>
                <li>DataMappers (DTO a Domain Entity)</li>
                <li>Monads Result&lt;T, Err&gt; con zero-crash</li>
              </ul>
            </div>
            <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 space-y-1">
              <div className="text-purple-400 font-bold">3. Logic Core</div>
              <ul className="text-zinc-400 text-[11px] space-y-1 list-disc list-inside">
                <li>UseCases puros sin frameworks</li>
                <li>Domain Models inmutables</li>
                <li>Guard clauses y validadores estrictos</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Scenario Selector */}
      <div className="space-y-2">
        <label className="text-xs font-mono text-zinc-400 uppercase">
          Seleccionar escenario de fallo para el DeepIntegrationTester:
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { id: 'zerodiv', label: 'ZeroDivisionError (Facturación)' },
            { id: 'dicom', label: 'DICOM Header Malformed (Pág. 45)' },
            { id: 'nameerror', label: 'ImportError / Indefinido (Red)' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setSelectedError(item.id as any);
                setCurrentStep(0);
              }}
              className={`p-3 rounded-xl border text-left text-xs font-mono transition-colors ${
                selectedError === item.id
                  ? 'bg-emerald-950/40 border-emerald-500/60 text-white shadow-lg'
                  : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              <div className="font-bold">{item.label}</div>
              <div className="text-[11px] text-zinc-500 mt-0.5">Simulación de bucle cerrado</div>
            </button>
          ))}
        </div>
      </div>

      {/* Execution Tracker (Steps) */}
      <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between">
          <span className="text-zinc-300 font-bold uppercase">
            Estado del Bucle Autónomo de Santiago:
          </span>
          <button
            onClick={handleRunFeedbackLoop}
            disabled={isRunning}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isRunning ? 'Auto-Reparando en Bucle...' : 'Disparar AutoFix en Bucle'}</span>
          </button>
        </div>

        {/* Step Progress Visualizer */}
        <div className="space-y-2 pt-2">
          {[
            {
              step: 1,
              title: '1. ESCRITURA ATÓMICA SEGURA',
              desc: `Código escrito primero en ${scenario.file}.tmp y reemplazado con atomic rename. Copia ${scenario.file}.bak generada.`
            },
            {
              step: 2,
              title: '2. EJECUCIÓN DEL DEEP INTEGRATION TESTER',
              desc: 'El test falla en la consola con exit code 1. Santiago intercepta el stderr y NO molesta al operador.'
            },
            {
              step: 3,
              title: '3. ANÁLISIS DE TRACEBACK & BÚSQUEDA DE SOLUCIÓN',
              desc: `Extrae la línea exacta. Estrategia seleccionada: ${scenario.fixStrategy}.`
            },
            {
              step: 4,
              title: '4. MUTACIÓN SEMÁNTICA AST & REEMPLAZO',
              desc: 'Aplica la mutación en el árbol sintáctico sin reemplazos ciegos de texto.'
            },
            {
              step: 5,
              title: '5. RE-EJECUCIÓN DEL TEST -> RESULTADO EXITOSO',
              desc: 'go test / python test exit code 0. Código certificado y registrado en el ledger inmutable.'
            }
          ].map((s) => {
            const isDone = currentStep >= s.step;
            const isCurrent = currentStep === s.step && isRunning;

            return (
              <div
                key={s.step}
                className={`p-2.5 rounded-lg border transition-colors flex items-start gap-3 ${
                  isDone
                    ? 'bg-emerald-950/20 border-emerald-500/40 text-zinc-200'
                    : 'bg-zinc-950/40 border-zinc-800 text-zinc-500'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                    isDone ? 'bg-emerald-500 text-black' : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {isDone ? '✓' : s.step}
                </span>
                <div>
                  <div className={`font-bold ${isDone ? 'text-emerald-400' : 'text-zinc-400'}`}>
                    {s.title}
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">{s.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Code Comparison (Before vs After Santiago's AutoFix) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 font-mono text-xs">
        <div className="p-4 rounded-xl bg-zinc-900 border border-red-500/30 space-y-2">
          <div className="flex items-center justify-between text-red-400 font-bold">
            <span>CÓDIGO INICIAL (CON ERROR)</span>
            <span className="text-[10px] bg-red-950 px-2 py-0.5 rounded border border-red-500/40">TEST FALLA</span>
          </div>
          <pre className="p-3 bg-black rounded-lg text-red-300 overflow-x-auto text-[11px] leading-relaxed">
            {scenario.initialCode}
          </pre>
          <div className="text-[11px] text-zinc-400 pt-1">
            <strong>Stderr capturado por Santiago:</strong>
            <pre className="mt-1 p-2 bg-zinc-950 rounded border border-zinc-800 text-zinc-400 text-[10px]">
              {scenario.stderr}
            </pre>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900 border border-emerald-500/30 space-y-2">
          <div className="flex items-center justify-between text-emerald-400 font-bold">
            <span>MUTACIÓN APLICADA POR SANTIAGO</span>
            <span className="text-[10px] bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/40">TEST PASA 100%</span>
          </div>
          <pre className="p-3 bg-black rounded-lg text-emerald-300 overflow-x-auto text-[11px] leading-relaxed">
            {scenario.patchedCode}
          </pre>
          <div className="p-3 bg-emerald-950/20 border border-emerald-500/20 rounded-lg text-[11px] text-emerald-300 leading-relaxed">
            <strong>Cero Interrupción Humana:</strong> Santiago leyó el traceback, buscó en su biblioteca la regla, generó el snapshot atómico y resolvió el problema sin que el operador tuviera que intervenir.
          </div>
        </div>
      </div>
    </div>
  );
};
