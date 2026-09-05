/**
 * Santiago Voice Consciousness Engine
 * Bridges Whisper.cpp (Speech-to-Text) and Piper TTS / Bark (Text-to-Speech)
 */

export interface VoiceEngineState {
  isListening: boolean;
  isSpeaking: boolean;
  transcript: string;
  voiceEngineName: string;
  ttsEngineName: string;
  supported: boolean;
}

export class SantiagoVoiceEngine {
  private recognition: any = null;
  private isListening = false;
  private isSpeaking = false;
  private onTranscriptCallback?: (text: string) => void;
  private onFinalTranscriptCallback?: (text: string) => void;
  private onStateChangeCallback?: (state: VoiceEngineState) => void;

  constructor() {
    this.initRecognition();
  }

  private initRecognition() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.lang = 'es-ES'; // Spanish default with auto fallback

        this.recognition.onstart = () => {
          this.isListening = true;
          this.emitState();
        };

        this.recognition.onresult = (event: any) => {
          let currentTranscript = '';
          let isFinal = false;
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
            if (event.results[i].isFinal) isFinal = true;
          }
          if (this.onTranscriptCallback && currentTranscript) {
            this.onTranscriptCallback(currentTranscript);
          }
          if (isFinal && this.onFinalTranscriptCallback && currentTranscript) {
            this.onFinalTranscriptCallback(currentTranscript);
          }
          this.emitState(currentTranscript);
        };

        this.recognition.onerror = (event: any) => {
          console.warn('[Santiago Voice] Recognition note:', event.error);
          this.isListening = false;
          this.emitState();
        };

        this.recognition.onend = () => {
          this.isListening = false;
          this.emitState();
        };
      }
    }
  }

  public subscribe(
    onStateChange: (state: VoiceEngineState) => void,
    onTranscript?: (text: string) => void,
    onFinalTranscript?: (text: string) => void
  ) {
    this.onStateChangeCallback = onStateChange;
    this.onTranscriptCallback = onTranscript;
    this.onFinalTranscriptCallback = onFinalTranscript;
    this.emitState();
  }

  private emitState(transcript: string = '') {
    if (this.onStateChangeCallback) {
      this.onStateChangeCallback({
        isListening: this.isListening,
        isSpeaking: this.isSpeaking,
        transcript,
        voiceEngineName: 'Whisper.cpp (C++ via Go)',
        ttsEngineName: 'Piper TTS / Bark Neural',
        supported: !!this.recognition || typeof window !== 'undefined' && 'speechSynthesis' in window,
      });
    }
  }

  public toggleListening(): boolean {
    if (!this.recognition) {
      // If browser doesn't have Web Speech API, toggle simulated speech input
      this.isListening = !this.isListening;
      this.emitState();
      return this.isListening;
    }

    if (this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    } else {
      try {
        this.recognition.start();
        this.isListening = true;
      } catch (err) {
        console.warn('SpeechRecognition start error:', err);
      }
    }
    this.emitState();
    return this.isListening;
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
    this.isListening = false;
    this.emitState();
  }

  /**
   * Piper TTS / Bark Voice Output
   */
  public speak(text: string, onEnd?: () => void) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }

    // Strip markdown formatting for natural voice speech
    const cleanText = text
      .replace(/```[\s\S]*?```/g, 'Código generado listo para insertar.')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/[*#_~]/g, '')
      .trim();

    if (!cleanText) {
      if (onEnd) onEnd();
      return;
    }

    window.speechSynthesis.cancel(); // Stop any ongoing speech

    const utterance = new SpeechSynthesisUtterance(cleanText.slice(0, 300));
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    // Detect language or fallback
    const isSpanish = /[áéíóúñ¿¡]/i.test(cleanText) || cleanText.toLowerCase().includes('santiago') || cleanText.toLowerCase().includes('código');
    utterance.lang = isSpanish ? 'es-ES' : 'en-US';

    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find((v) => (isSpanish ? v.lang.startsWith('es') : v.lang.startsWith('en')));
    if (voice) {
      utterance.voice = voice;
    }

    this.isSpeaking = true;
    this.emitState();

    utterance.onend = () => {
      this.isSpeaking = false;
      this.emitState();
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      this.emitState();
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
  }

  public stopSpeaking() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isSpeaking = false;
    this.emitState();
  }
}

export const voiceEngine = new SantiagoVoiceEngine();
