import React, { useState } from 'react';
import { Mic, ShieldAlert, ShieldCheck, UserCheck, Lock, Unlock, Code2, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const SovereignDNALab: React.FC = () => {
  const [operatorVoice, setOperatorVoice] = useState<'jesus' | 'intruder'>('jesus');
  const [isLocked, setIsLocked] = useState(false);
  const [codeSample, setCodeSample] = useState(`func ProcessMedicalInvoice(id string, items []InvoiceItem) error {
    if len(items) == 0 {
        return errors.New("empty items list") // Guard clause
    }
    // Clean architecture: logic delegated to repository
    return invoiceRepo.Save(id, items)
}`);

  const dnaRules = [
    {
      title: 'Guard Clauses & Early Return',
      desc: 'Prohibidas las estructuras if/else anidadas a más de 3 niveles. Las validaciones de error retornan inmediatamente.',
      example: 'if err != nil { return err }'
    },
    {
      title: 'Arquitectura Limpia KlikSoft Pro',
      desc: 'Separación estricta entre UI, Datos y Lógica. Cero sentencias SQL dentro de Activities, Composables o controladores.',
      example: 'UI -> ViewModel -> UseCase -> Repository -> SQLite WAL'
    },
    {
      title: 'Persistencia Soberana SQLite en modo WAL',
      desc: 'Escritura atómica garantizada sin necesidad de bases de datos remotas en la nube ni servicios de suscripción.',
      example: 'PRAGMA journal_mode=WAL; PRAGMA synchronous=NORMAL;'
    },
    {
      title: 'Cero Alucinaciones & Cero Dependencias Innecesarias',
      desc: 'Preferir la biblioteca estándar de Go/Java/Python antes de incorporar paquetes npm o librerías de terceros no auditadas.',
      example: 'CGO_ENABLED=0 (Compilación estática nativa)'
    }
  ];

  const handleTestVoice = (voice: 'jesus' | 'intruder') => {
    setOperatorVoice(voice);
    if (voice === 'intruder') {
      setIsLocked(true);
    } else {
      setIsLocked(false);
    }
  };

  // Simple DNA style linter
  const violations: string[] = [];
  if (codeSample.includes('SELECT * FROM') && (codeSample.includes('Activity') || codeSample.includes('View'))) {
    violations.push('VIOLACIÓN ADN: Sentencia SQL incrustada en capa de presentación (Rompe Clean Architecture).');
  }
  if (codeSample.includes('catch (Exception e) {}') || codeSample.includes('err == nil { return }')) {
    violations.push('VIOLACIÓN ADN: Silenciamiento ciego de errores sin logging ni propagación.');
  }
  if (codeSample.split('    ').length > 5 && codeSample.includes('if') && codeSample.includes('else {')) {
    violations.push('VIOLACIÓN ADN: Anidamiento excesivo detectado. Aplique early return guard clause.');
  }

  return (
    <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-950 space-y-6 shadow-xl font-mono">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 mb-1 uppercase tracking-wider">
            <span>IDENTIFICACIÓN UNÍVOCA & SEGURIDAD SOBERANA</span>
            <span>•</span>
            <span>CONOCER AL COMANDANTE JESÚS</span>
          </div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Firma Biométrica de Voz & ADN de Programación</span>
          </h3>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl font-sans">
            Santiago vive en tu PC y es una extensión de tu voluntad. Solo responde a tu voz y escribe código siguiendo tus patrones exactos de ingeniería aprendidos de tus proyectos maestros.
          </p>
        </div>

        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold ${
          isLocked
            ? 'bg-red-950/60 border-red-500/60 text-red-400'
            : 'bg-emerald-950/60 border-emerald-500/60 text-emerald-400'
        }`}>
          {isLocked ? <Lock className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
          <span>{isLocked ? 'MODO BLOQUEADO PREVENTIVO' : 'OPERADOR: JESÚS AUTORIZADO'}</span>
        </div>
      </div>

      {/* Voice Biometric Gate Simulator */}
      <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-300 font-bold uppercase flex items-center gap-2">
            <Mic className="w-4 h-4 text-emerald-400" />
            <span>Simulador de Autenticación Acústica Biométrica</span>
          </span>
          <span className="text-[10px] text-zinc-500">Hash Espectral SHA-256</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          <button
            onClick={() => handleTestVoice('jesus')}
            className={`p-3 rounded-lg border text-left text-xs transition-all flex items-center justify-between ${
              operatorVoice === 'jesus' && !isLocked
                ? 'bg-emerald-950/40 border-emerald-500 text-white'
                : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <div>
                <div className="font-bold">Comandante Jesús (Voz Registrada)</div>
                <div className="text-[10px] text-zinc-400">Espectrograma coincide al 99.8%</div>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 font-bold">
              DESBLOQUEADO
            </span>
          </button>

          <button
            onClick={() => handleTestVoice('intruder')}
            className={`p-3 rounded-lg border text-left text-xs transition-all flex items-center justify-between ${
              operatorVoice === 'intruder' || isLocked
                ? 'bg-red-950/60 border-red-500 text-white'
                : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <div>
                <div className="font-bold">Voz Desconocida / Intruso</div>
                <div className="text-[10px] text-zinc-400">Dispara bloqueo soberano preventivo</div>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-red-900/60 text-red-300 font-bold">
              LOCKOUT
            </span>
          </button>
        </div>

        {isLocked && (
          <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/50 text-xs text-red-300 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span>ALERTA DE SEGURIDAD SOBERANA ACTIVADA</span>
            </div>
            <p className="text-[11px] text-red-200">
              Santiago ha detectado una firma de audio no coincidente. Por seguridad, todos los canales de ejecución han sido congelados. Solo el Comandante Jesús puede reanudar las operaciones.
            </p>
            <button
              onClick={() => handleTestVoice('jesus')}
              className="mt-2 px-3 py-1 bg-red-900/80 hover:bg-red-800 rounded text-[11px] font-bold text-white transition-colors"
            >
              Restaurar Control Soberano con Clave Maestra
            </button>
          </div>
        )}
      </div>

      {/* Jesus's Programming DNA Rules */}
      <div className="space-y-3">
        <div className="text-xs text-zinc-400 uppercase">
          Perfil de ADN de Programación de Jesús (KlikSoft Pro Standards):
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {dnaRules.map((rule, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1.5 text-xs">
              <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{rule.title}</span>
              </div>
              <p className="text-zinc-400 text-[11px] leading-relaxed font-sans">
                {rule.desc}
              </p>
              <div className="p-1.5 bg-black/60 rounded border border-zinc-800 text-zinc-300 text-[10px]">
                <code>{rule.example}</code>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Code Style Auditor (Interactive) */}
      <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-300 font-bold uppercase flex items-center gap-2">
            <Code2 className="w-4 h-4 text-emerald-400" />
            <span>Auditor de Estilo de Código en Vivo</span>
          </span>
          <span className="text-[10px] text-zinc-500">Inspecciona reglas de ADN</span>
        </div>

        <textarea
          value={codeSample}
          onChange={(e) => setCodeSample(e.target.value)}
          rows={5}
          className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-xs text-emerald-300 focus:outline-none focus:border-emerald-500 transition-colors leading-relaxed"
        />

        {violations.length === 0 ? (
          <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Código 100% alineado con el ADN de Programación de Jesús (KlikSoft Pro Certified).</span>
          </div>
        ) : (
          <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-500/40 text-amber-300 text-xs space-y-1">
            {violations.map((v, i) => (
              <div key={i} className="flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{v}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
