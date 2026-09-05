import React, { useState } from 'react';
import { ShieldCheck, Laptop, Network, HardDrive, Cpu, AlertCircle, CheckCircle2, Lock } from 'lucide-react';

export const WindowsSafetyLab: React.FC = () => {
  const [bindHost, setBindHost] = useState('127.0.0.1');
  const [bindPort, setBindPort] = useState(34820);
  const [testPath, setTestPath] = useState('C:\\Projects\\ContableFix\\app.go');

  const isLoopback = bindHost === '127.0.0.1' || bindHost === 'localhost';
  const isTempPath = testPath.toLowerCase().includes('temp') || testPath.toLowerCase().includes('appdata\\local\\temp');

  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="border border-blue-500/30 bg-blue-950/20 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <Laptop className="w-6 h-6 text-blue-400 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-base font-bold text-white">
              Arquitectura Específica para Windows PC
            </h3>
            <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
              Diseñado minuciosamente para convivir con los mecanismos de protección de Windows 10/11:
              Windows Defender, AMSI, Firewall de Windows con filtrado estricto, sin requerir privilegios de Administrador (UAC) para operaciones ordinarias y manteniendo un consumo de RAM y CPU ultrabajo gracias a Go compilado nativamente.
            </p>
          </div>
        </div>
      </div>

      {/* 3 Pillars of Windows PC Compliance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Pillar 1: Antivirus */}
        <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-950 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
            <h4 className="text-sm font-semibold text-white">Amigable con Antivirus</h4>
          </div>
          <ul className="text-xs text-zinc-300 space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Sin inyección de memoria:</strong> No utiliza técnicas sospechosas como Process Hollowing ni DLL Injection.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Manifiesto Windows (asInvoker):</strong> No solicita elevación innecesaria a UAC; opera en espacio de usuario.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Bloqueo de %TEMP%:</strong> Prohíbe ejecutar binarios o scripts generados en carpetas temporales para evitar disparar heurísticas.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Compatibilidad AMSI:</strong> No utiliza scripts PowerShell ofuscados con `-EncodedCommand` ni parámetros `bypass`.</span>
            </li>
          </ul>
        </div>

        {/* Pillar 2: Firewall */}
        <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-950 space-y-3">
          <div className="flex items-center gap-2 text-blue-400">
            <Network className="w-5 h-5" />
            <h4 className="text-sm font-semibold text-white">Amigable con Firewall</h4>
          </div>
          <ul className="text-xs text-zinc-300 space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Loopback Estricto (127.0.0.1):</strong> Nunca escucha en <code className="text-amber-400 font-mono">0.0.0.0</code>. Esto elimina por completo el popup emergente de alerta del Firewall de Windows.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Ollama Local:</strong> La comunicación con el LLM ocurre exclusivamente en <code className="text-zinc-200 font-mono">127.0.0.1:11434</code> sin tráfico a internet.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Cero puertos entrantes públicos:</strong> Ningún puerto es accesible desde la red local (LAN) o WAN sin configuración explícita.</span>
            </li>
          </ul>
        </div>

        {/* Pillar 3: Resources */}
        <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-950 space-y-3">
          <div className="flex items-center gap-2 text-purple-400">
            <Cpu className="w-5 h-5" />
            <h4 className="text-sm font-semibold text-white">Bajo Consumo de Recursos</h4>
          </div>
          <ul className="text-xs text-zinc-300 space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Binario Go Estático:</strong> Sin runtime de Python, sin Electron, sin Node.js en background. Consumo base &lt; 25 MB de RAM.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>SQLite con WAL Mode:</strong> Escrituras rápidas y asíncronas con mínima degradación de disco SSD/HDD.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Pool de Goroutines:</strong> Límites de concurrencia para evitar saturar los hilos de la CPU cuando Ollama esté procesando.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Interactive Verification Lab */}
      <div className="border border-zinc-800 bg-zinc-950 rounded-xl p-5 space-y-4">
        <h4 className="text-sm font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2">
          <span>Laboratorio de Validación de Parámetros Windows</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-mono text-zinc-400 block mb-1">
              Dirección de Red para Servidor / API:
            </label>
            <input
              type="text"
              value={bindHost}
              onChange={(e) => setBindHost(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
              placeholder="127.0.0.1"
            />
            <div className="mt-2 text-xs">
              {isLoopback ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Loopback seguro. El Firewall de Windows no emitirá alertas.
                </span>
              ) : (
                <span className="text-red-400 flex items-center gap-1 font-semibold">
                  <AlertCircle className="w-3.5 h-3.5" /> PELIGRO: {bindHost} activa el diálogo de bloqueo del Firewall de Windows. Santiago prohíbe esta configuración.
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="text-xs font-mono text-zinc-400 block mb-1">
              Ruta de Archivo para Operación:
            </label>
            <input
              type="text"
              value={testPath}
              onChange={(e) => setTestPath(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
              placeholder="C:\Projects\..."
            />
            <div className="mt-2 text-xs">
              {!isTempPath ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Directorio de proyecto seguro. Conforme con políticas de antivirus.
                </span>
              ) : (
                <span className="text-amber-400 flex items-center gap-1 font-semibold">
                  <AlertCircle className="w-3.5 h-3.5" /> ALERTA ANTIVIRUS: La ruta está en %TEMP%. Santiago denegará la ejecución para evitar flags heurísticos de Windows Defender.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
