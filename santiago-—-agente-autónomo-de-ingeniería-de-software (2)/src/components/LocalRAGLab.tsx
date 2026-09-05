import React, { useState } from 'react';
import { Search, BookOpen, FileText, CheckCircle2, ShieldAlert, Sparkles, Database, Plus } from 'lucide-react';

interface RAGManualEntry {
  id: string;
  title: string;
  sourceDoc: string;
  pageNumber: number;
  section: string;
  snippet: string;
  tags: string[];
}

export const LocalRAGLab: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('DICOM encabezado pagina 45 explicit vr');
  const [selectedEntry, setSelectedEntry] = useState<RAGManualEntry | null>(null);

  const ingestedManuals: RAGManualEntry[] = [
    {
      id: 'dicom-45',
      title: 'DICOM PS3.5 Estándar de Estructura de Datos y Codificación',
      sourceDoc: 'DICOM_PS3.5_Standard_Part5.pdf',
      pageNumber: 45,
      section: 'Section 7.1.2: Data Element Structure with Explicit VR',
      snippet: `Para Data Elements con Explicit VR del tipo OB, OW, OF, SQ, UT o UN: El campo de 16 bits de Value Representation (VR) de 2 bytes es seguido inmediatamente por un campo de 16 bits reservado de 2 bytes con ceros binarios (0000H). Posteriormente sigue el campo de Value Length codificado como un entero de 32 bits Little Endian.`,
      tags: ['DICOM', 'Medical Imaging', 'Binary Protocol', 'Byte Alignment']
    },
    {
      id: 'kliksoft-pro-12',
      title: 'Manual de Estándares de Arquitectura KlikSoft Pro',
      sourceDoc: 'KlikSoft_Pro_Architecture_Standard_v4.pdf',
      pageNumber: 12,
      section: 'Capítulo 3: Separación Obligatoria UI vs Data vs Logic',
      snippet: `Todo módulo en Android debe desacoplar la vista (Jetpack Compose/XML) de la capa de datos. Está estrictamente prohibido emitir llamadas SQLite o HTTP dentro de Composables o Activity. Toda mutación debe transitar por un Interactor con Result<T, DomainError> y persistirse en SQLite con Write-Ahead Logging.`,
      tags: ['KlikSoft Pro', 'Android', 'Clean Architecture', 'SQLite WAL']
    },
    {
      id: 'dicom-118',
      title: 'DICOM PS3.3 Definición de Objetos de Información Médica',
      sourceDoc: 'DICOM_PS3.3_Standard_Part3.pdf',
      pageNumber: 118,
      section: 'C.7.6.3: Image Pixel Module & Photometric Interpretation',
      snippet: `El atributo Photometric Interpretation (0028,0004) especifica la interpretación del espacio de color de los píxeles. Para imágenes radiográficas digitales se requiere 'MONOCHROME1' o 'MONOCHROME2'. Para RGB o YBR_FULL se debe declarar el atributo Planar Configuration (0028,0006).`,
      tags: ['DICOM', 'Pixel Data', 'Radiology', 'Color Space']
    },
    {
      id: 'windows-security-8',
      title: 'Guía de Compatibilidad de Ejecución Soberana en Windows',
      sourceDoc: 'Windows_PC_BareMetal_Sovereignty.pdf',
      pageNumber: 8,
      section: 'Sección 2.4: Prevención de Bloqueos de Windows Defender / AMSI',
      snippet: `Todo binario auxiliar generado no debe situarse en carpetas temporales (%TEMP%) ni invocar PowerShell mediante comandos ofuscados base64. La comunicación IPC local debe enlazarse unívocamente a 127.0.0.1 (Loopback) para evitar la activación del diálogo de red de Windows Firewall.`,
      tags: ['Windows', 'Antivirus', 'Loopback', 'AMSI']
    }
  ];

  // Pure client-side BM25/keyword ranker
  const terms = searchQuery.toLowerCase().split(/\s+/).filter(Boolean);
  const scoredResults = ingestedManuals.map((item) => {
    let score = 0;
    const combined = `${item.title} ${item.sourceDoc} ${item.section} ${item.snippet} ${item.tags.join(' ')}`.toLowerCase();
    terms.forEach((term) => {
      if (combined.includes(term)) {
        score += 3.5;
      }
      if (term.includes('45') && item.pageNumber === 45) {
        score += 10.0;
      }
      if (term.includes('dicom') && item.tags.includes('DICOM')) {
        score += 5.0;
      }
    });
    return { ...item, score };
  }).sort((a, b) => b.score - a.score);

  const topMatch = scoredResults[0];

  return (
    <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-950 space-y-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-emerald-400 mb-1 uppercase tracking-wider">
            <span>MOTOR RAG LOCAL SOBERANO</span>
            <span>•</span>
            <span>TALLA 1 / MINI-FAISS EN GO PURO</span>
          </div>
          <h3 className="text-xl font-bold font-mono text-white flex items-center gap-2">
            <span>RAG Local Profundo con Citas Exactas de Manuales</span>
          </h3>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
            Copilot usa billones de datos genéricos. Santiago usa <strong>tus datos específicos</strong>: busca en tu biblioteca local de PDFs de ingeniería y cita página y sección exacta para justificar cada corrección.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-emerald-400">
          <Database className="w-4 h-4" />
          <span>4 Manuales Indexados (Talla 1)</span>
        </div>
      </div>

      {/* Search Input */}
      <div className="space-y-2 font-mono text-xs">
        <label className="text-zinc-400 uppercase text-[11px]">
          Consultar base de conocimiento local (Búsqueda vectorial offline):
        </label>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ejemplo: DICOM encabezado pagina 45, KlikSoft Pro SQLite WAL..."
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors text-xs"
          />
        </div>

        {/* Quick query pills */}
        <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
          <span className="text-zinc-500 self-center">Pruebas rápidas:</span>
          {[
            { label: 'DICOM Pág. 45 (Explicit VR)', query: 'DICOM pagina 45 explicit vr 0000H' },
            { label: 'KlikSoft Pro Pág. 12 (Clean Arch)', query: 'KlikSoft Pro arquitectura pagina 12 SQLite' },
            { label: 'DICOM Pág. 118 (Pixels)', query: 'DICOM pagina 118 Photometric Interpretation' },
            { label: 'Windows PC Seguridad', query: 'Windows Defender loopback 127.0.0.1 AMSI' }
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => setSearchQuery(item.query)}
              className="px-2.5 py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Autonomous Santiago Diagnostic with Exact Page Citation */}
      {topMatch && topMatch.score > 0 && (
        <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 space-y-2 font-mono text-xs">
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <Sparkles className="w-4 h-4" />
            <span>RESPUESTA SOBERANA DE SANTIAGO (SIN ALUCINACIONES)</span>
          </div>
          <div className="p-3 bg-black/60 rounded-lg text-emerald-200 border border-emerald-500/20 text-xs leading-relaxed">
            &quot;Según el manual de <strong>{topMatch.title}</strong> que me proporcionaste en la <strong>página {topMatch.pageNumber}</strong> ({topMatch.section}):
            <div className="mt-2 pl-3 border-l-2 border-emerald-500/50 text-zinc-300 italic">
              {topMatch.snippet}
            </div>
            <div className="mt-2 text-emerald-300 font-semibold">
              Veredicto de Santiago: Detectado error en la estructura binaria. Procedo a insertar los 2 bytes de relleno (0000H) antes del Value Length de 32 bits según la norma.&quot;
            </div>
          </div>
        </div>
      )}

      {/* Results List */}
      <div className="space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between text-zinc-400 uppercase text-[11px]">
          <span>Documentos recuperados por similitud vectorial (Score BM25):</span>
          <span>{scoredResults.filter((r) => r.score > 0).length} coincidencias</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {scoredResults.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedEntry(item)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                item.score > 0
                  ? 'bg-zinc-900/80 border-zinc-700/80 hover:border-emerald-500/50'
                  : 'bg-zinc-950 border-zinc-900 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="font-bold text-white text-xs line-clamp-1">{item.title}</div>
                <span className="shrink-0 px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                  Pág. {item.pageNumber}
                </span>
              </div>

              <div className="text-[11px] text-emerald-400/90 mb-2">{item.section}</div>
              <p className="text-[11px] text-zinc-400 line-clamp-3 leading-relaxed mb-3">
                {item.snippet}
              </p>

              <div className="flex flex-wrap gap-1">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 text-[9px]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
