
import React, { useState } from 'react';
import { Rocket, RefreshCw, Zap, Brain, MessageSquare, ChevronRight, Activity, Terminal, Shield, Sparkles, BrainCircuit } from 'lucide-react';
import { getStrategicThought } from '../services/geminiService';
import { useToast } from '../contexts/ToastContext';

const ADVANCED_ROBOT_URL = "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop";

export const AIBrain: React.FC = () => {
  const { addToast } = useToast();
  const [query, setQuery] = useState('Analyze BTC hash ribbon volatility and propose a defensive mining strategy for the TigApp cluster over the next 72 hours.');
  const [isThinking, setIsThinking] = useState(false);
  const [result, setResult] = useState<{ thought: string, answer: string } | null>(null);

  const handleReason = async () => {
    if (!query.trim()) return;
    setIsThinking(true);
    setResult(null);

    try {
      const data = await getStrategicThought(query);
      setResult(data);
      addToast("Synthesis Complete", "Logic node finalized.", "success");
    } catch (e) {
      addToast("Core Overload", "Strategic synthesis failed.", "error");
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="p-10 h-full overflow-y-auto bg-[#050508] scrollbar-thin font-sans">
      <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-1000">
        <div className="flex flex-col md:flex-row items-center gap-8 border-b border-slate-800 pb-10">
          <div className="relative group">
              <div className="w-24 h-24 bg-purple-600 rounded-[2rem] flex items-center justify-center shadow-[0_0_50px_rgba(147,51,234,0.5)] overflow-hidden border-2 border-purple-400 group-hover:scale-105 transition-all duration-500">
                <img src={ADVANCED_ROBOT_URL} alt="Robot Core" className="w-full h-full object-cover grayscale brightness-125" />
                {isThinking && <div className="absolute inset-0 bg-purple-500/20 animate-pulse"></div>}
              </div>
              <div className="absolute -top-2 -right-2 bg-slate-950 border border-purple-500/50 p-2 rounded-xl text-purple-400">
                <BrainCircuit size={20} className={isThinking ? 'animate-spin' : ''} />
              </div>
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-5xl font-black text-white uppercase tracking-tighter italic leading-none mb-2">Strategic Brain</h2>
            <p className="text-slate-500 text-xs font-black uppercase tracking-[0.5em] ml-1">Advanced Reasoning & Arbitrage synthesis</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
           {/* Left: Input Logic */}
           <div className="lg:col-span-7 space-y-8">
              <div className="bg-slate-900/50 border border-slate-800 rounded-[3rem] p-10 space-y-8 relative overflow-hidden shadow-2xl backdrop-blur-xl">
                 <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-focus-within:opacity-10 transition-opacity">
                    <Rocket size={200} className="text-purple-500" />
                 </div>
                 
                 <div className="space-y-4 relative z-10">
                    <div className="flex items-center justify-between ml-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Query Parameter</label>
                       <span className="text-[8px] text-purple-400 font-black uppercase tracking-widest bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">Input Secured</span>
                    </div>
                    <textarea 
                      value={query}
                      onChange={e => setQuery(e.target.value)}
                      placeholder="Input strategic scenario for synthesis..."
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-[2rem] p-8 text-white text-xl focus:border-purple-500 outline-none resize-none h-56 transition-all font-display shadow-inner placeholder:text-slate-800"
                    />
                 </div>

                 <button 
                   onClick={handleReason}
                   disabled={isThinking}
                   className={`w-full font-black py-6 rounded-[2rem] flex items-center justify-center gap-4 shadow-2xl transition-all active:scale-95 uppercase tracking-[0.3em] text-sm border-b-4 ${isThinking ? 'bg-slate-800 text-slate-500 border-slate-950' : 'bg-purple-600 hover:bg-purple-500 text-white border-purple-900 shadow-purple-900/40'}`}
                 >
                   {isThinking ? <RefreshCw className="animate-spin" size={24} /> : <Zap size={24} />}
                   {isThinking ? 'Synthesizing Scenarios...' : 'Engage Strategic Core'}
                 </button>
              </div>
           </div>

           {/* Right: AI Visualization */}
           <div className="lg:col-span-5">
              <div className={`w-full aspect-[4/5] bg-slate-900 border-2 rounded-[3.5rem] overflow-hidden relative shadow-2xl transition-all duration-1000 ${isThinking ? 'border-purple-500 shadow-purple-500/50 scale-105' : 'border-slate-800 shadow-black grayscale'}`}>
                 <img src={ADVANCED_ROBOT_URL} alt="Strategic Entity" className={`w-full h-full object-cover transition-all duration-2000 ${isThinking ? 'scale-110 brightness-110' : 'scale-100 opacity-40'}`} />
                 
                 {/* Glitch/HUD Overlays */}
                 <div className={`absolute inset-0 bg-gradient-to-t from-slate-950 via-purple-900/10 to-transparent transition-opacity duration-1000 ${isThinking ? 'opacity-100' : 'opacity-0'}`}></div>
                 
                 {isThinking && (
                    <div className="absolute inset-0 pointer-events-none">
                       <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-48 h-1 bg-cyan-400 shadow-[0_0_30px_#22d3ee] animate-pulse"></div>
                       <div className="absolute inset-0 flex items-center justify-center">
                          <Activity size={200} className="text-purple-400 opacity-10 animate-ping" />
                       </div>
                       <div className="absolute bottom-10 left-10 right-10 grid grid-cols-2 gap-4">
                          <div className="h-1 bg-purple-500/30 rounded-full overflow-hidden"><div className="h-full bg-purple-400 animate-loading-bar"></div></div>
                          <div className="h-1 bg-purple-500/30 rounded-full overflow-hidden"><div className="h-full bg-cyan-400 animate-loading-bar" style={{animationDelay:'0.5s'}}></div></div>
                       </div>
                       <div className="absolute top-10 right-10"><RefreshCw size={32} className="text-purple-500 animate-spin" /></div>
                    </div>
                 )}
                 
                 <div className="absolute top-10 left-10">
                    <span className={`text-[10px] font-black px-4 py-1.5 rounded-full border transition-all duration-500 ${isThinking ? 'bg-purple-600 text-white border-purple-400 animate-pulse' : 'bg-slate-950 text-slate-500 border-slate-800'}`}>
                       {isThinking ? 'ANALYSIS ACTIVE' : 'NODE STANDBY'}
                    </span>
                 </div>
              </div>
           </div>
        </div>

        {result && (
           <div className="space-y-10 animate-in slide-in-from-bottom-12 duration-1000">
              {/* Internal Thought Process */}
              <div className="bg-slate-950/80 backdrop-blur-sm border border-slate-800 rounded-[2.5rem] p-10 font-mono text-[11px] leading-relaxed relative overflow-hidden shadow-inner">
                 <div className="absolute top-0 right-0 p-8 opacity-5 text-purple-400"><Brain size={120}/></div>
                 <div className="flex items-center gap-3 text-slate-500 mb-8 border-b border-slate-800 pb-4">
                    <Terminal size={16} className="text-purple-400"/>
                    <span className="uppercase font-black tracking-[0.4em]">Chain-of-Thought Handshake (v4.0.2)</span>
                 </div>
                 <div className="text-slate-500 overflow-y-auto max-h-60 no-scrollbar whitespace-pre-line italic">
                    {result.thought}
                 </div>
              </div>

              {/* Strategic Artifact */}
              <div className="bg-gradient-to-br from-indigo-900/40 via-slate-900 to-purple-900/40 border border-indigo-500/30 rounded-[3rem] p-12 relative shadow-2xl">
                 <div className="absolute -top-6 -right-6 w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center shadow-[0_0_40px_#6366f1] overflow-hidden border-2 border-indigo-400/50 group">
                    <img src={ADVANCED_ROBOT_URL} alt="Robot Identity" className="w-full h-full object-cover grayscale contrast-125" />
                 </div>
                 <h3 className="text-white font-black text-3xl mb-8 uppercase tracking-tighter italic flex items-center gap-4">
                    <Sparkles size={28} className="text-yellow-400" /> Strategic Artifact
                 </h3>
                 <div className="text-slate-200 text-lg leading-relaxed whitespace-pre-line font-medium font-display">
                    {result.answer}
                 </div>
                 <div className="mt-10 pt-10 border-t border-white/10 flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <span>Artifact ID: STR-NODE-{Math.floor(Math.random()*10000)}</span>
                    <span className="text-indigo-400 flex items-center gap-2 animate-pulse"><Activity size={12}/> Handshake Secure</span>
                 </div>
              </div>
           </div>
        )}
      </div>
      
      <style>{`
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-loading-bar {
          animation: loading-bar 1.5s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};
