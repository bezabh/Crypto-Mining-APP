
import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Activity, Sparkles, Zap, BrainCircuit, Terminal, RefreshCw, MessageSquare, ChevronRight, Volume2, ShieldCheck, AlertCircle } from 'lucide-react';
import { getDetailedConsultation, getVoiceBriefing } from '../services/geminiService';
import { MiningStats } from '../types';
import { useToast } from '../contexts/ToastContext';

const ADVANCED_ROBOT_URL = "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop";

interface AIConsultantProps {
  stats: MiningStats;
}

interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
  thinking?: string;
  timestamp: string;
}

export const AIConsultant: React.FC<AIConsultantProps> = ({ stats }) => {
  const { addToast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      role: 'ai', 
      text: 'Neural connection established. I am your Lead System Architect. I have analyzed your node telemetry: hashrate is steady at ' + stats.hashrate + ' ' + stats.hashrateUnit + '. How shall we optimize your deployment?',
      timestamp: new Date().toLocaleTimeString().slice(0, 5)
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [deepAudit, setDeepAudit] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || isThinking) return;

    const userMsg = inputText;
    setInputText('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg, timestamp: new Date().toLocaleTimeString().slice(0, 5) }]);
    setIsThinking(true);

    try {
        const response = await getDetailedConsultation(userMsg, stats, deepAudit);
        setMessages(prev => [...prev, { 
            role: 'ai', 
            text: response.text, 
            thinking: response.thinking,
            timestamp: new Date().toLocaleTimeString().slice(0, 5)
        }]);
        if (deepAudit) setDeepAudit(false); // Reset after one audit
    } catch (error) {
        addToast("Handshake Error", "AI core failed to synchronize.", "error");
    } finally {
        setIsThinking(false);
    }
  };

  const runProtocol = (protocol: string) => {
      setInputText(protocol);
      setTimeout(() => handleSend(), 100);
  };

  return (
    <div className="h-full flex flex-col bg-[#050508] relative overflow-hidden font-sans">
      <div className="absolute inset-0 bg-indigo-500/5 pointer-events-none"></div>
      
      {/* Consultant Header */}
      <div className="p-6 bg-slate-900/50 backdrop-blur-xl border-b border-slate-800 flex items-center justify-between z-10">
         <div className="flex items-center gap-5">
            <div className="relative">
                <div className={`w-16 h-16 rounded-2xl overflow-hidden border-2 transition-all duration-700 ${isThinking ? 'border-indigo-400 shadow-[0_0_30px_#6366f1]' : 'border-slate-700'}`}>
                   <img src={ADVANCED_ROBOT_URL} alt="Consultant" className={`w-full h-full object-cover grayscale transition-all duration-700 ${isThinking ? 'grayscale-0 scale-110' : ''}`} />
                   {isThinking && <div className="absolute inset-0 bg-indigo-500/20 animate-pulse"></div>}
                </div>
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-950 ${isThinking ? 'bg-indigo-400 animate-ping' : 'bg-green-500'}`}></div>
            </div>
            <div>
               <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Neural Consultant</h2>
               <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.3em]">Lead System Architect v4.0</span>
                  <div className="h-1 w-1 rounded-full bg-slate-700"></div>
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Active Link: 12ms</span>
               </div>
            </div>
         </div>

         <div className="hidden md:flex gap-4">
            <div className="bg-slate-950 border border-slate-800 px-4 py-2 rounded-xl flex items-center gap-3">
               <Activity size={16} className="text-indigo-400" />
               <div>
                  <div className="text-[8px] font-black text-slate-500 uppercase">Context Sync</div>
                  <div className="text-[10px] font-bold text-white uppercase">Live Telemetry Linked</div>
               </div>
            </div>
            <button 
              onClick={() => setDeepAudit(!deepAudit)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${deepAudit ? 'bg-purple-600 border-purple-400 text-white shadow-[0_0_20px_#a855f7]' : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-white'}`}
            >
               {deepAudit ? 'DEEP AUDIT ACTIVE' : 'REQUEST DEEP AUDIT'}
            </button>
         </div>
      </div>

      {/* Chat Space */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 scrollbar-thin">
         {messages.map((msg, idx) => (
           <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
              <div className={`max-w-[85%] md:max-w-[70%] rounded-[2.5rem] p-6 shadow-2xl relative border ${
                msg.role === 'user' 
                ? 'bg-indigo-600 text-white border-indigo-400 rounded-br-none' 
                : 'bg-slate-900 text-slate-200 border-slate-800 rounded-bl-none'
              }`}>
                 {msg.thinking && (
                   <div className="mb-4 pb-4 border-b border-white/10 font-mono text-[10px] text-indigo-300 italic whitespace-pre-line overflow-hidden max-h-40 hover:max-h-full transition-all cursor-help">
                      <div className="flex items-center gap-2 mb-2 not-italic font-black uppercase tracking-widest opacity-60">
                        <BrainCircuit size={12}/> Analysis Subroutine:
                      </div>
                      {msg.thinking}
                   </div>
                 )}
                 <div className="text-sm md:text-base leading-relaxed whitespace-pre-line font-medium">
                    {msg.text}
                 </div>
                 <div className="mt-4 flex items-center justify-between opacity-40">
                    <span className="text-[9px] font-black uppercase tracking-widest">
                       {msg.timestamp} :: {msg.role === 'ai' ? 'ARCHITECT-NODE' : 'OPERATOR-ID'}
                    </span>
                    {msg.role === 'ai' && <ShieldCheck size={14} className="text-indigo-400" />}
                 </div>
              </div>
           </div>
         ))}
         {isThinking && (
            <div className="flex flex-col items-start animate-pulse">
                <div className="bg-slate-900 border border-indigo-500/20 rounded-[2.5rem] rounded-bl-none p-6 flex gap-4 items-center">
                    <div className="flex gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce"></div>
                        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">Synthesizing Optimization Report...</span>
                </div>
            </div>
         )}
         <div ref={chatEndRef} />
      </div>

      {/* Interface Footer */}
      <div className="p-6 bg-slate-900/50 backdrop-blur-xl border-t border-slate-800 space-y-4">
         <div className="flex flex-wrap gap-2 justify-center">
            <ProtocolBtn label="Optimize Hardware" onClick={() => runProtocol("Run a thermal audit and suggest fan curves for my current temperature.")} />
            <ProtocolBtn label="Efficiency Audit" onClick={() => runProtocol("Analyze my current power draw and suggest voltage offsets for maximum J/TH.")} />
            <ProtocolBtn label="Market Strategy" onClick={() => runProtocol("Which mining algorithm is currently most profitable for my hardware given the live market?")} />
            <ProtocolBtn label="Security Check" onClick={() => runProtocol("Verify my API node integrity and check for any unauthorized access patterns.")} />
         </div>

         <form onSubmit={handleSend} className="max-w-4xl mx-auto flex gap-4">
            <div className="flex-1 relative group">
               <MessageSquare className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" size={20} />
               <input 
                 value={inputText}
                 onChange={e => setInputText(e.target.value)}
                 placeholder="Input command for Neural Consultant..."
                 className="w-full bg-slate-950 border border-slate-800 rounded-[2rem] py-5 pl-16 pr-6 text-white text-lg focus:border-indigo-500 outline-none transition-all shadow-inner placeholder:text-slate-800"
               />
            </div>
            <button 
              type="submit"
              disabled={isThinking || !inputText.trim()}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white p-5 rounded-[2rem] shadow-2xl transition-all active:scale-90 group"
            >
               {isThinking ? <RefreshCw className="animate-spin" size={28} /> : <Send size={28} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
            </button>
         </form>
         
         <div className="flex justify-center items-center gap-6 text-[9px] font-black text-slate-600 uppercase tracking-widest pb-2">
            <span className="flex items-center gap-1.5"><ShieldCheck size={12}/> Handshake Secure</span>
            <span className="flex items-center gap-1.5"><Zap size={12}/> LLM Mode: {deepAudit ? 'Gemini 3 Pro' : 'Gemini 3 Flash'}</span>
            <span className="flex items-center gap-1.5"><Volume2 size={12}/> Voice Output Standby</span>
         </div>
      </div>
    </div>
  );
};

const ProtocolBtn = ({ label, onClick }: any) => (
  <button 
    onClick={onClick}
    className="bg-slate-950 hover:bg-indigo-600 border border-slate-800 hover:border-indigo-400 px-4 py-2 rounded-full text-[9px] font-black text-slate-500 hover:text-white uppercase tracking-widest transition-all"
  >
    {label}
  </button>
);
