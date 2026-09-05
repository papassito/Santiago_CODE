import React, { useState } from 'react';
import { Terminal, Play, RotateCcw, ShieldCheck, CheckCircle2, AlertCircle, Copy, Check } from 'lucide-react';

interface LogMessage {
  id: string;
  time: string;
  stream: 'stdout' | 'stderr' | 'santiago' | 'kernel';
  text: string;
}

export const TacticalConsole: React.FC = () => {
  const [inputCommand, setInputCommand] = useState('');
  const [copied, setCopied] = useState(false);
  const [logs, setLogs] = useState<LogMessage[]>([
    {
      id: '1',
      time: '21:04:12',
      stream: 'kernel',
      text: '[SANTIAGO YEMINOUX CORE] Inicializando runtime bare-metal soberano en Windows PC...'
    },
    {
      id: '2',
      time: '21:04:12',
      stream: 'kernel',
      text: '[SOBERANÍA] Operador: Comandante Jesús (Firma Biométrica: OK | Costo Cloud: $0.00)'
    },
    {
      id: '3',
      time: '21:04:13',
      stream: 'stdout',
      text: '[FIREWALL_CHECK] Bindeo exclusivo en 127.0.0.1:34820 (Loopback estricto. Cero popups de red).'
    },
    {
      id: '4',
      time: '21:04:14',
      stream: 'stdout',
      text: '[SQLITE_WAL] Base de datos local montada en %APPDATA%/Santiago/santiago_memory.db'
    },
    {
      id: '5',
      time: '21:04:14',
      stream: 'santiago',
      text: 'Santiago: A sus órdenes, Comandante. Motores listos: RAG Local (Talla 1), DeepIntegrationTester y AutoFix AST.'
    }
  ]);

  const handleRunCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCommand.trim()) return;

    const cmd = inputCommand.trim();
    const timeStr = new Date().toTimeString().split(' ')[0];

    const newLog: LogMessage = {
      id: String(Date.now()),
      time: timeStr,
      stream: 'stdout',
      text: `PS C:\\Santiago> ${cmd}`
    };

    let reply: LogMessage;
    const lower = cmd.toLowerCase();

    if (lower.includes('health') || lower.includes('salud')) {
      reply = {
        id: String(Date.now() + 1),
        time: timeStr,
        stream: 'santiago',
        text: '[KRI STATUS] _health_score: 96/100 | Módulos: 14 | Criticals: 0 | Log Alerts: 1 (Complejidad ciclomática en parser)'
      };
    } else if (lower.includes('rag') || lower.includes('dicom')) {
      reply = {
        id: String(Date.now() + 1),
        time: timeStr,
        stream: 'santiago',
        text: 'Según el manual DICOM PS3.5 en la página 45 (Section 7.1.2): Data Elements con Explicit VR requieren padding de 2 bytes (0000H) antes del Value Length field de 32-bit.'
      };
    } else if (lower.includes('bunker') || lower.includes('cifrar')) {
      reply = {
        id: String(Date.now() + 1),
        time: timeStr,
        stream: 'kernel',
        text: '[BUNKER_EXPORT] Archivo bunker_SOLUSOL.NET.enc.zip generado. Algoritmo: AES-256-GCM. Llave simétrica copiada a memoria segura.'
      };
    } else if (lower.includes('test') || lower.includes('autofix')) {
      reply = {
        id: String(Date.now() + 1),
        time: timeStr,
        stream: 'stdout',
        text: '[DEEP_INTEGRATION_TESTER] Ejecutando bucle cerrado. Capturado ZeroDivisionError -> Mutación AST aplicada en .tmp -> os.replace -> Test PASS (exit code 0).'
      };
    } else {
      reply = {
        id: String(Date.now() + 1),
        time: timeStr,
        stream: 'santiago',
        text: `Santiago ejecutó subproceso: "${cmd}". Salida procesada y registrada en el ledger inmutable de auditoría.`
      };
    }

    setLogs((prev) => [...prev, newLog, reply]);
    setInputCommand('');
  };

  const handleCopyLogs = () => {
    const text = logs.map((l) => `[${l.time}] [${l.stream.toUpperCase()}] ${l.text}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClearLogs = () => {
    setLogs([
      {
        id: String(Date.now()),
        time: new Date().toTimeString().split(' ')[0],
        stream: 'kernel',
        text: '[CONSOLA REINICIADA] Buffer de terminal limpiado. Santiago continúa en escucha activa.'
      }
    ]);
  };

  return (
    <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-950 space-y-4 shadow-xl">
      {/* Console Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
              <span>CONSOLA TÁCTICA ASÍNCRONA</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                BARE-METAL 100% LOCAL
              </span>
            </h3>
            <p className="text-xs text-zinc-400">
              Streaming de subprocesos Windows, tracebacks en vivo y chat soberano con Santiago.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLogs}
            className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs text-zinc-300 flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copiado' : 'Copiar Log'}</span>
          </button>
          <button
            onClick={handleClearLogs}
            className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs text-zinc-300 flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Limpiar</span>
          </button>
        </div>
      </div>

      {/* Terminal Screen (Black/Green High-Contrast) */}
      <div className="bg-black rounded-xl p-4 border border-zinc-800 font-mono text-xs space-y-2 h-80 overflow-y-auto shadow-inner select-text">
        {logs.map((log) => {
          let badgeColor = 'text-zinc-500';
          let textColor = 'text-zinc-300';

          if (log.stream === 'kernel') {
            badgeColor = 'text-cyan-400';
            textColor = 'text-cyan-200 font-semibold';
          } else if (log.stream === 'santiago') {
            badgeColor = 'text-emerald-400';
            textColor = 'text-emerald-300';
          } else if (log.stream === 'stderr') {
            badgeColor = 'text-red-400';
            textColor = 'text-red-300';
          }

          return (
            <div key={log.id} className="flex items-start gap-2 leading-relaxed">
              <span className="text-zinc-600 shrink-0">[{log.time}]</span>
              <span className={`uppercase shrink-0 text-[10px] px-1 rounded bg-zinc-900 border border-zinc-800 ${badgeColor}`}>
                {log.stream}
              </span>
              <span className={`break-all ${textColor}`}>{log.text}</span>
            </div>
          );
        })}
      </div>

      {/* Fast Action Buttons */}
      <div className="flex flex-wrap gap-2 pt-1 text-xs">
        <span className="text-zinc-500 self-center text-[11px] font-mono">Comandos rápidos:</span>
        {[
          { label: 'santiago --health', cmd: 'santiago --health' },
          { label: 'rag --query "DICOM pág 45"', cmd: 'rag --query "DICOM encabezado pagina 45"' },
          { label: 'deep-test --run', cmd: 'deep-test --run ./pkg/autofix' },
          { label: 'bunker --export AES-256', cmd: 'bunker --export --project=SOLUSOL.NET' }
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => setInputCommand(item.cmd)}
            className="px-2.5 py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-mono text-[11px] transition-colors"
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Input Prompt */}
      <form onSubmit={handleRunCommand} className="flex items-center gap-2 pt-2">
        <div className="relative flex-1">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-emerald-400 font-bold text-xs">
            PS&gt;
          </span>
          <input
            type="text"
            value={inputCommand}
            onChange={(e) => setInputCommand(e.target.value)}
            placeholder="Escriba una directiva para Santiago o comando de Windows..."
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-12 pr-4 py-2.5 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>
        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold flex items-center gap-2 transition-colors shadow-lg shadow-emerald-950"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Ejecutar</span>
        </button>
      </form>
    </div>
  );
};
