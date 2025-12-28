
import React, { useState, useEffect } from 'react';
import { Globe, Search, Play, Volume2, Link as LinkIcon, RefreshCw, BarChart2, TrendingUp, Zap, ShieldAlert, Cpu, Newspaper, ExternalLink, Activity } from 'lucide-react';
import { getGroundedNodeIntel, getVoiceBriefing } from '../services/geminiService';
import { useToast } from '../contexts/ToastContext';
import { MiningStats } from '../types';

export const NodeIntel: React.FC<{ stats: MiningStats }> = ({ stats }) => {
  const { addToast } = useToast();
  const [query, setQuery] = useState('bitcoin halving mining impact 2024');
  const [intel, setIntel] = useState<string | null>(null);
  const [sources, setSources] = useState<{ uri: string, title: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    try {
      const result = await getGroundedNodeIntel(query);
      setIntel(result.text);
      setSources(result.links);
      addToast("Grounding Link Established", "Real-time web context integrated.", "success");
    } catch (e) {
      addToast("Search Failure", "Unable to establish search grounding.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = async () => {
    if (!intel || isSpeaking) return;
    setIsSpeaking(true);
    try {
      const audioData = await getVoiceBriefing(intel.slice(0, 500)); // Limit for speed
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      // Raw PCM decoding helper
      const decodeAudio = async (data: Uint8Array) => {
        const dataInt16 = new Int16Array(data.buffer);
        const buffer = audioContext.createBuffer(1, dataInt16.length, 24000);
        const channelData = buffer.getChannelData(0);
        for (let i = 0; i < dataInt16.length; i++) {
          channelData[i] = dataInt16[i] / 32768.0;
        }
        return buffer;
      };

      const buffer = await decodeAudio(audioData);
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);
      source.onended = () => setIsSpeaking(false);
      source.start();
      addToast("Briefing Started", "AI synthesis active.", "info");
    } catch (e) {
      addToast("Briefing Error", "Audio node connection lost.", "error");
      setIsSpeaking(false);
    }
  };

  return (
    <div className="p-6 h-full overflow-y-auto bg-[#050508] animate-in slide-in-from-right-10 duration-500 scrollbar-thin">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                <Globe size={28} />
             </div>
             <div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Node Intel Hub</h2>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-0.5">Grounded Web Intelligence & Synthesis</p>
             </div>
          </div>
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-4 py-2 rounded-full">
             <Activity size={14} className="text-green-500 animate-pulse" />
             <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Grounding: ENABLED</span>
          </div>
        </div>

        <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" size={24} />
            <input 
              type="text" 
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="Query the global intelligence network..."
              className="w-full bg-slate-900 border border-slate-800 rounded-[2rem] py-6 pl-16 pr-32 text-white text-lg font-display focus:border-indigo-500 outline-none shadow-2xl transition-all"
            />
            <button 
              onClick={handleSearch}
              disabled={isLoading}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-500 text-white font-black px-6 py-3 rounded-full text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95"
            >
              {isLoading ? <RefreshCw className="animate-spin" size={16} /> : 'Sync Intel'}
            </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           <div className="lg:col-span-8 space-y-6">
              {intel ? (
                 <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 relative overflow-hidden animate-in fade-in duration-700">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                       <Newspaper size={120} />
                    </div>
                    
                    <div className="flex justify-between items-center mb-6 relative z-10">
                       <h3 className="text-indigo-400 font-black text-xs uppercase tracking-[0.3em] flex items-center gap-2 italic">
                          <Zap size={14}/> Synthesis Report
                       </h3>
                       <button 
                         onClick={handleSpeak}
                         disabled={isSpeaking}
                         className={`p-3 rounded-full transition-all ${isSpeaking ? 'bg-indigo-500 text-white animate-pulse' : 'bg-slate-950 text-indigo-400 hover:bg-indigo-600 hover:text-white border border-indigo-500/30'}`}
                       >
                         {isSpeaking ? <Volume2 size={24}/> : <Play size={24}/>}
                       </button>
                    </div>

                    <div className="text-slate-200 text-sm leading-relaxed font-medium whitespace-pre-line relative z-10">
                       {intel}
                    </div>

                    <div className="mt-10 pt-6 border-t border-slate-800 space-y-4">
                       <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Grounding Sources</h4>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {sources.map((src, i) => (
                             <a key={i} href={src.uri} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 bg-slate-950 border border-slate-800 rounded-xl hover:border-indigo-500/50 transition-all group">
                                <div className="p-2 bg-indigo-600/10 rounded-lg text-indigo-400">
                                   <LinkIcon size={14} />
                                </div>
                                <div className="overflow-hidden">
                                   <div className="text-white text-[10px] font-black uppercase truncate group-hover:text-indigo-400">{src.title}</div>
                                   <div className="text-[8px] text-slate-600 truncate">{src.uri}</div>
                                </div>
                             </a>
                          ))}
                       </div>
                    </div>
                 </div>
              ) : (
                <div className="bg-slate-900 border border-slate-800 border-dashed rounded-3xl p-16 text-center space-y-4">
                   <Globe size={48} className="mx-auto text-slate-800" />
                   <div>
                      <h4 className="text-white font-black uppercase tracking-tight">No Active Intelligence</h4>
                      <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Execute a search to link web context nodes</p>
                   </div>
                </div>
              )}
           </div>

           <div className="lg:col-span-4 space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                 <h3 className="text-white font-black text-xs uppercase tracking-widest mb-6">Market Sentiment</h3>
                 <div className="space-y-6">
                    <SentimentItem label="Bullish Flow" value="72%" color="bg-emerald-500" />
                    <SentimentItem label="Mining Difficulty" value="High" color="bg-red-500" />
                    <SentimentItem label="Regulatory Sync" value="Verified" color="bg-indigo-500" />
                 </div>
              </div>

              <div className="bg-indigo-900/10 border border-indigo-500/20 rounded-2xl p-6 flex flex-col items-center text-center">
                  <ShieldAlert size={32} className="text-indigo-400 mb-4" />
                  <h4 className="text-white font-black uppercase text-sm italic mb-2">Autonomous Risk Filter</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase leading-relaxed tracking-widest">
                     Our AI forge continuously monitors search grounding for potential mining bans or hardware volatility alerts in your region.
                  </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const SentimentItem = ({ label, value, color }: any) => (
  <div className="space-y-2">
     <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
        <span className="text-slate-500">{label}</span>
        <span className="text-white">{value}</span>
     </div>
     <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
        <div className={`h-full ${color}`} style={{ width: value.includes('%') ? value : '100%' }}></div>
     </div>
  </div>
);
