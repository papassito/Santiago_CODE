import { useState, useRef, useEffect, type FormEvent } from 'react';
import { ChatMessage, AgentPlanStep } from '../types';
import { voiceEngine, VoiceEngineState } from '../services/voiceEngine';
import { swarmSimulator } from '../services/mockDaemonSwarm';
import {
  Send,
  Mic,
  MicOff,
  Copy,
  Check,
  Zap,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  Bot,
  User,
  CheckCircle2,
  Clock,
  Terminal,
  Play,
  Layers,
  ShieldCheck,
} from 'lucide-react';

interface SantiagoChatSidebarProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onInsertAtCursor: (code: string) => void;
  onClearHistory: () => void;
  isStreaming: boolean;
  selectedCode?: string;
  activeLanguage?: string;
  isGatewayOnline: boolean;
}

export function SantiagoChatSidebar({
  messages,
  onSendMessage,
  onInsertAtCursor,
  onClearHistory,
  isStreaming,
  selectedCode,
  activeLanguage,
  isGatewayOnline,
}: SantiagoChatSidebarProps) {
  const [inputText, setInputText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [mode, setMode] = useState<'chat' | 'agent'>('agent');
  const [agentSteps, setAgentSteps] = useState<AgentPlanStep[]>([]);
  const [isAgentRunning, setIsAgentRunning] = useState(false);

  const [voiceState, setVoiceState] = useState<VoiceEngineState>({
    isListening: false,
    isSpeaking: false,
    transcript: '',
    voiceEngineName: 'Whisper.cpp (C++ via Go)',
    ttsEngineName: 'Piper TTS / Bark Neural',
    supported: true,
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  // Subscribe to voice engine events
  useEffect(() => {
    voiceEngine.subscribe(
      (state) => {
        setVoiceState(state);
      },
      (transcript) => {
        setInputText(transcript);
      },
      (finalTranscript) => {
        setInputText(finalTranscript);
        if (finalTranscript.trim()) {
          if (mode === 'agent') {
            handleRunAutonomousAgent(finalTranscript);
          } else {
            onSendMessage(finalTranscript);
          }
        }
      }
    );
  }, [mode, onSendMessage]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isStreaming, agentSteps]);

  // Auto-speak new assistant messages if toggled
  useEffect(() => {
    if (autoSpeak && messages.length > 0 && !isStreaming) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.role === 'assistant') {
        voiceEngine.speak(lastMsg.content);
      }
    }
  }, [messages, isStreaming, autoSpeak]);

  const handleSubmit = (e?: FormEvent) => {
    if (e) e.preventDefault();
    const text = inputText.trim();
    if (!text || isStreaming || isAgentRunning) return;
    setInputText('');

    if (mode === 'agent') {
      handleRunAutonomousAgent(text);
    } else {
      onSendMessage(text);
    }
  };

  const handleRunAutonomousAgent = async (objective: string) => {
    setIsAgentRunning(true);
    // User message
    onSendMessage(`[OBJETIVO AUTÓNOMO]: ${objective}`);

    try {
      const result = await swarmSimulator.runAutonomousAgentWorkflow(objective, (steps) => {
        setAgentSteps([...steps]);
      });

      onSendMessage(result.finalSummary);
    } catch (err: any) {
      onSendMessage(`⚠️ Error en ejecución autónoma: ${err.message}`);
    } finally {
      setIsAgentRunning(false);
    }
  };

  const handleCopyCode = (code: string, blockId: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(blockId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Render markdown text and extract code blocks with Copy & Insert buttons
  const renderMessageContent = (content: string, msgId: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const lines = part.slice(3, -3).trim().split('\n');
        const lang = lines[0].trim() || 'typescript';
        const code = lines.slice(1).join('\n') || lines[0];
        const blockId = `${msgId}-${index}`;
        const isCopied = copiedId === blockId;

        return (
          <div
            key={index}
            className="my-3 rounded-lg overflow-hidden border border-zinc-700/80 bg-[#121215] font-mono text-xs shadow-md"
          >
            <div className="flex items-center justify-between px-3 py-1.5 bg-[#18181c] border-b border-zinc-800 text-[11px] text-zinc-400">
              <span className="font-semibold text-zinc-300 lowercase">{lang}</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onInsertAtCursor(code)}
                  title="Insertar este bloque en el cursor del editor activo"
                  className="flex items-center gap-1 px-2 py-0.5 rounded bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 transition-colors"
                >
                  <Zap className="w-3 h-3 text-blue-400" />
                  <span>Insertar en Cursor</span>
                </button>
                <button
                  onClick={() => handleCopyCode(code, blockId)}
                  title="Copiar código al portapapeles"
                  className="flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-700/50 hover:bg-zinc-700 text-zinc-300 transition-colors"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            <pre className="p-3 text-zinc-200 overflow-x-auto leading-relaxed text-[11px]">
              <code>{code}</code>
            </pre>
          </div>
        );
      }

      return (
        <div key={index} className="whitespace-pre-wrap leading-relaxed text-xs">
          {part}
        </div>
      );
    });
  };

  return (
    <div className="w-80 md:w-96 bg-[#18181b] border-r border-[#27272a] flex flex-col h-full select-none text-zinc-200">
      {/* Top Header */}
      <div className="px-3 py-2 border-b border-[#27272a] flex items-center justify-between bg-[#161618]">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center text-white text-[11px] font-bold">
            <Bot className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs text-zinc-100">Santiago Agent</span>
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isGatewayOnline ? 'bg-emerald-400' : 'bg-rose-500'
                }`}
              />
            </div>
            <div className="text-[10px] text-zinc-400 font-mono">Inteligencia Soberana Común</div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Read aloud toggle */}
          <button
            onClick={() => setAutoSpeak(!autoSpeak)}
            title={autoSpeak ? 'Silenciar lectura automática (Piper TTS)' : 'Activar lectura automática por voz'}
            className={`p-1.5 rounded transition-colors ${
              autoSpeak ? 'bg-blue-600/30 text-blue-300' : 'text-zinc-400 hover:bg-[#27272a]'
            }`}
          >
            {autoSpeak ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* Clear history */}
          <button
            onClick={onClearHistory}
            title="Limpiar historial"
            className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-[#27272a] rounded transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Mode Switcher: Interactive Chat vs Autonomous Agent Loop */}
      <div className="px-3 py-1.5 bg-[#141416] border-b border-zinc-800 flex items-center justify-between text-xs">
        <div className="flex items-center bg-[#1e1e23] p-0.5 rounded-lg border border-zinc-700/60 w-full">
          <button
            onClick={() => setMode('agent')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1 rounded text-xs font-semibold transition-all ${
              mode === 'agent'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
            <span>Agente Autónomo (VER→VERIFICAR)</span>
          </button>

          <button
            onClick={() => setMode('chat')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1 rounded text-xs font-medium transition-all ${
              mode === 'chat'
                ? 'bg-zinc-700 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Chat Asistente</span>
          </button>
        </div>
      </div>

      {/* Active Autonomous Agent Cycle Tracker */}
      {agentSteps.length > 0 && (
        <div className="p-3 bg-[#131317] border-b border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-300">
            <span className="flex items-center gap-1 text-blue-400 font-mono">
              <Play className="w-3 h-3" />
              <span>Flujo Autónomo en Progreso</span>
            </span>
            <span className="text-[10px] text-zinc-400 font-mono">Regla Suprema</span>
          </div>

          <div className="space-y-1.5">
            {agentSteps.map((step) => (
              <div
                key={step.id}
                className={`p-2 rounded border text-[11px] transition-all ${
                  step.status === 'running'
                    ? 'bg-blue-950/30 border-blue-600/50 text-blue-200 shadow-sm'
                    : step.status === 'completed'
                    ? 'bg-emerald-950/20 border-emerald-800/40 text-zinc-200'
                    : 'bg-zinc-900/50 border-zinc-800 text-zinc-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold">{step.label}</span>
                  {step.status === 'completed' ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : step.status === 'running' ? (
                    <Clock className="w-3.5 h-3.5 text-blue-400 animate-spin" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-zinc-700" />
                  )}
                </div>
                <div className="text-[10px] text-zinc-400 mt-0.5">{step.detail}</div>
                {step.verificationLevel && (
                  <div className="mt-1 text-[9px] font-mono text-emerald-400">
                    Criterio: {step.verificationLevel}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Message History Container */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-6 h-6 rounded-full bg-blue-600/30 border border-blue-500/40 flex items-center justify-center shrink-0 mt-0.5 text-blue-400">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-[88%] rounded-xl p-3 text-xs ${
                  isUser
                    ? 'bg-blue-600 text-white rounded-br-sm'
                    : 'bg-[#202024] text-zinc-200 border border-zinc-700/60 rounded-bl-sm shadow-sm'
                }`}
              >
                {renderMessageContent(msg.content, msg.id)}
                <div
                  className={`mt-1.5 text-[10px] flex items-center justify-end gap-1 ${
                    isUser ? 'text-blue-200' : 'text-zinc-500'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                </div>
              </div>

              {isUser && (
                <div className="w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center shrink-0 mt-0.5 text-zinc-300">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          );
        })}

        {isStreaming && (
          <div className="flex items-center gap-2 text-zinc-400 text-xs p-2">
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="italic">Santiago está procesando localmente en :34820...</span>
          </div>
        )}
      </div>

      {/* Quick Prompts */}
      <div className="px-3 py-1.5 bg-[#141416] border-t border-zinc-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11px]">
        <button
          onClick={() => {
            if (mode === 'agent') {
              handleRunAutonomousAgent('Inspeccionar y compilar todo el workspace verificando tests');
            } else {
              onSendMessage('¿Cuál es la regla suprema de Santiago y cómo se verifica la ejecución?');
            }
          }}
          className="px-2 py-0.5 rounded bg-[#202024] hover:bg-[#2b2b32] border border-zinc-700 text-zinc-300 text-[10px] whitespace-nowrap transition-colors"
        >
          {mode === 'agent' ? '⚡ Probar todo el workspace' : '💡 Preguntar regla suprema'}
        </button>
        <button
          onClick={() => {
            if (mode === 'agent') {
              handleRunAutonomousAgent('Verificar que no existan fugas de telemetría externa en el Vault');
            } else {
              onSendMessage('Explica la paridad funcional entre Santiago Studio y Santiago Plugin.');
            }
          }}
          className="px-2 py-0.5 rounded bg-[#202024] hover:bg-[#2b2b32] border border-zinc-700 text-zinc-300 text-[10px] whitespace-nowrap transition-colors"
        >
          {mode === 'agent' ? '🔒 Auditoría Vault Enclave' : '⚡ Paridad funcional'}
        </button>
      </div>

      {/* Input Box with Whisper.cpp Voice Mic */}
      <div className="p-3 border-t border-[#27272a] bg-[#161618]">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder={
              mode === 'agent'
                ? 'Indica el objetivo para Santiago Agent (o usa el micrófono)...'
                : 'Pregunta a Santiago o pide un refactor...'
            }
            rows={2}
            className="w-full bg-[#1e1e23] border border-zinc-700/80 rounded-lg pl-3 pr-20 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500 resize-none font-sans"
          />

          <div className="absolute right-2 bottom-2.5 flex items-center gap-1.5">
            {/* Voice Dictation (Whisper.cpp) */}
            <button
              type="button"
              onClick={() => voiceEngine.toggleListening()}
              title="Dictar por voz con Whisper.cpp (C++ orquestado desde Go)"
              className={`p-1.5 rounded-full transition-colors ${
                voiceState.isListening
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/50'
              }`}
            >
              {voiceState.isListening ? (
                <MicOff className="w-3.5 h-3.5" />
              ) : (
                <Mic className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputText.trim() || isStreaming || isAgentRunning}
              className="p-1.5 rounded-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
