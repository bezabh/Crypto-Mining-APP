
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { Mic, MicOff, Volume2, ShieldCheck, Activity, RefreshCw, Zap, BrainCircuit } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

const ADVANCED_ROBOT_URL = "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop";

export const AILiveLink: React.FC = () => {
  const { addToast } = useToast();
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [transcription, setTranscription] = useState('');
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);

  const toggleSession = async () => {
    if (isActive) {
      sessionRef.current?.close();
      setIsActive(false);
      return;
    }

    setIsConnecting(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = inputCtx;
      outputAudioContextRef.current = outputCtx;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (event) => {
              const inputData = event.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
            setIsConnecting(false);
            setIsActive(true);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.modelTurn?.parts[0]?.inlineData?.data) {
                const base64 = message.serverContent.modelTurn.parts[0].inlineData.data;
                handleModelAudio(base64);
            }
            if (message.serverContent?.inputTranscription) {
                setTranscription(prev => prev + ' ' + message.serverContent!.inputTranscription!.text);
            }
          },
          onerror: (e) => { setIsActive(false); setIsConnecting(false); },
          onclose: () => { setIsActive(false); setIsConnecting(false); }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          systemInstruction: 'You are TigAppMining AI. A high-tech mining assistant.',
          inputAudioTranscription: {}
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (e) {
      addToast("Hardware Link Error", "Microphone not detected.", "error");
      setIsConnecting(false);
    }
  };

  const handleModelAudio = async (base64: string) => {
    const ctx = outputAudioContextRef.current;
    if (!ctx) return;
    nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
    const audioBuffer = await decodeAudioData(decodeBase64(base64), ctx, 24000, 1);
    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);
    source.start(nextStartTimeRef.current);
    nextStartTimeRef.current += audioBuffer.duration;
    sourcesRef.current.add(source);
    source.onended = () => sourcesRef.current.delete(source);
  };

  const decodeBase64 = (base64: string) => {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number) => {
    const dataInt16 = new Int16Array(data.buffer);
    const buffer = ctx.createBuffer(numChannels, dataInt16.length / numChannels, sampleRate);
    for (let ch = 0; ch < numChannels; ch++) {
      const chData = buffer.getChannelData(ch);
      for (let i = 0; i < chData.length; i++) chData[i] = dataInt16[i * numChannels + ch] / 32768.0;
    }
    return buffer;
  };

  const createBlob = (data: Float32Array) => {
    const int16 = new Int16Array(data.length);
    for (let i = 0; i < data.length; i++) int16[i] = data[i] * 32768;
    let binary = '';
    const bytes = new Uint8Array(int16.buffer);
    for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
    return { data: btoa(binary), mimeType: 'audio/pcm;rate=16000' };
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-[#050508] relative overflow-hidden font-sans">
      <div className="absolute inset-0 bg-indigo-500/5 pointer-events-none"></div>
      
      {/* Advanced Robot Display */}
      <div className="relative w-80 h-80 mb-16">
         {isActive && (
           <div className="absolute inset-0 flex items-center justify-center">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="absolute border border-indigo-500/40 rounded-full animate-ping" style={{ width: `${100 + i * 25}%`, height: `${100 + i * 25}%`, animationDuration: `${3 + i}s` }}></div>
              ))}
              <div className="absolute inset-[-40px] border-2 border-dashed border-indigo-500/20 rounded-full animate-spin" style={{ animationDuration: '20s' }}></div>
           </div>
         )}
         <div className={`w-full h-full rounded-full flex items-center justify-center border-4 transition-all duration-1000 shadow-[0_0_80px_rgba(99,102,241,0.3)] overflow-hidden bg-slate-900 group ${isActive ? 'bg-indigo-600 border-indigo-400 scale-110 shadow-indigo-500/60' : 'border-slate-800'}`}>
            <img src={ADVANCED_ROBOT_URL} alt="Advanced AI Entity" className={`w-full h-full object-cover transition-all duration-1000 ${isActive ? 'opacity-100 scale-110 brightness-125' : 'opacity-30 grayscale blur-[2px]'}`} />
            {isActive && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-[2px] bg-indigo-400/50 absolute top-1/2 -translate-y-1/2 animate-scan shadow-[0_0_20px_#6366f1]"></div>
                    <Activity size={120} className="text-white opacity-20 animate-pulse" />
                </div>
            )}
            {!isActive && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                    <BrainCircuit size={64} className="text-slate-700 opacity-50" />
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Neural Core Idle</span>
                </div>
            )}
         </div>
      </div>

      <div className="max-w-xl text-center space-y-6 relative z-10">
         <div className="flex flex-col items-center gap-2">
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-slate-700'}`}></div>
                Neural Voice Handshake
            </h2>
            <p className="text-indigo-400 text-xs font-black uppercase tracking-[0.4em] opacity-80">Autonomous Optimization Hub</p>
         </div>
         
         <p className="text-slate-500 text-sm font-bold uppercase tracking-widest leading-relaxed max-w-md mx-auto">
           Connect directly to the TigApp cluster via real-time biometric audio handshake.
         </p>
         
         <div className="flex flex-col items-center gap-8 mt-10">
            <button 
              onClick={toggleSession}
              disabled={isConnecting}
              className={`px-16 py-5 rounded-[2rem] font-black text-lg flex items-center gap-4 transition-all shadow-2xl active:scale-95 border-b-4 ${isActive ? 'bg-red-600 hover:bg-red-500 text-white border-red-900 shadow-red-900/40' : 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-900 shadow-indigo-900/40'}`}
            >
               {isConnecting ? <RefreshCw size={24} className="animate-spin" /> : (isActive ? <MicOff size={24}/> : <Mic size={24}/>)}
               {isConnecting ? 'LINKING...' : (isActive ? 'CLOSE NEURAL LINK' : 'INITIATE VOICE LINK')}
            </button>
            
            {isActive && (
              <div className="bg-slate-900/80 backdrop-blur border border-indigo-500/20 p-6 rounded-3xl w-full text-left font-mono text-xs text-indigo-300 min-h-[80px] animate-in slide-in-from-bottom-4 shadow-2xl relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                 <div className="text-slate-500 mb-2 uppercase font-black text-[9px] flex items-center gap-2">
                    <Activity size={10} className="text-green-500"/> Real-time Synthesis:
                 </div>
                 {transcription || "Handshake established. Listening for mining telemetry query..."}
              </div>
            )}
         </div>
      </div>

      <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-5xl">
         <VoiceMetric icon={<ShieldCheck size={18}/>} label="Encryption" value="AES-XTS" />
         <VoiceMetric icon={<Activity size={18}/>} label="Neural Speed" value="85 tps" />
         <VoiceMetric icon={<RefreshCw size={18}/>} label="Handshake" value="v4.2" />
         <VoiceMetric icon={<Volume2 size={18}/>} label="Auth Node" value="CLUSTER-01" />
      </div>

      <style>{`
        @keyframes scan {
            0% { top: 0%; opacity: 0; }
            50% { opacity: 1; }
            100% { top: 100%; opacity: 0; }
        }
        .animate-scan {
            animation: scan 2s linear infinite;
        }
      `}</style>
    </div>
  );
};

const VoiceMetric = ({ icon, label, value }: any) => (
  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-4 group hover:border-indigo-500/30 transition-all cursor-default">
    <div className="text-indigo-500 group-hover:scale-110 transition-transform">{icon}</div>
    <div>
      <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</div>
      <div className="text-xs font-black text-white uppercase mt-0.5 tracking-tight">{value}</div>
    </div>
  </div>
);
