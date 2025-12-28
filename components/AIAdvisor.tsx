import React, { useState } from 'react';
import { MiningStats, MiningAlgorithm, HardwareType } from '../types';
import { getMiningOptimizationAdvice } from '../services/geminiService';
import { Sparkles, Cpu, RefreshCw, Zap, BrainCircuit } from 'lucide-react';

interface AIAdvisorProps {
  stats: MiningStats;
  algorithm: MiningAlgorithm;
  hardware: HardwareType;
}

export const AIAdvisor: React.FC<AIAdvisorProps> = ({ stats, algorithm, hardware }) => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const AI_AVATAR_URL = "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=400&auto=format&fit=crop";

  const handleAnalyze = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    const result = await getMiningOptimizationAdvice(stats, algorithm, hardware);
    setAdvice(result);
    setLoading(false);
  };

  return (
    <div className="bg-slate-900 border border-indigo-500/30 rounded-xl p-6 relative overflow-hidden group">
      <div className={`absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl transition-all duration-1000 ${loading ? 'opacity-100 scale-150 bg-indigo-500/20' : 'opacity-30'}`}></div>
      
      <div className="flex items-start gap-4 mb-6 relative z-10">
        <div className="relative">
            <div className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-500 ${loading ? 'border-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.6)]' : 'border-slate-700 shadow-lg'}`}>
                <img 
                    src={AI_AVATAR_URL} 
                    alt="AI Core" 
                    className={`w-full h-full object-cover transition-transform duration-1000 ${loading ? 'scale-110' : 'scale-100'}`} 
                />
                {loading && <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/20 to-transparent animate-scan"></div>}
            </div>
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 ${loading ? 'bg-indigo-400 animate-ping' : 'bg-green-500'}`}></div>
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 ${loading ? 'bg-indigo-400' : 'bg-green-500'}`}></div>
        </div>

        <div className="flex-1">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                TigAppMining <span className="text-indigo-400">Core AI</span>
            </h2>
            <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                Autonomous system generator active. 
                {loading ? <span className="text-indigo-300 animate-pulse"> Analyzing telemetry nodes...</span> : " Ready to optimize mining parameters."}
            </p>
        </div>
      </div>

      {advice && !loading && (
        <div className="bg-indigo-950/30 border border-indigo-500/20 rounded-xl p-4 mb-6 animate-in fade-in slide-in-from-bottom-2 backdrop-blur-sm relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 rounded-l-xl"></div>
          <h3 className="text-indigo-300 font-bold text-xs uppercase mb-2 flex items-center gap-2">
             <BrainCircuit size={14} /> Optimization Protocol Generated
          </h3>
          <div className="text-slate-200 text-sm whitespace-pre-line leading-relaxed font-medium">
            {advice}
          </div>
        </div>
      )}

      <button
        onClick={handleAnalyze}
        disabled={loading}
        className={`w-full py-4 px-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all relative overflow-hidden ${
          loading 
            ? 'bg-slate-800 text-indigo-300 cursor-not-allowed border border-slate-700' 
            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 border border-indigo-500'
        }`}
      >
        {!loading && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>}
        
        {loading ? (
          <>
            <RefreshCw className="animate-spin" size={20} /> Generating Configuration...
          </>
        ) : (
          <>
            <Zap size={20} className={advice ? "text-yellow-300" : "text-white"} /> 
            {advice ? "Regenerate System Optimization" : "Generate Mining Strategy"}
          </>
        )}
      </button>

      <div className="mt-4 flex justify-between items-center text-[10px] text-slate-600 font-mono">
          <span>MDL: TIGAPP-ENG-3.0</span>
          <span>LATENCY: 42ms</span>
      </div>

      <style>{`
        @keyframes scan {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100%); }
        }
        .animate-scan {
            animation: scan 1.5s linear infinite;
        }
      `}</style>
    </div>
  );
};