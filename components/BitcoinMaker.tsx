import React, { useState, useEffect } from 'react';
import { 
    Zap, Sparkles, Coins, RefreshCw, Cpu, 
    ShieldCheck, Terminal, Layers, Box, 
    ArrowRight, Globe, Code, Database,
    Rocket, Gem, Activity, Landmark, TrendingUp, Gauge
} from 'lucide-react';
import { getBitcoinMakerStrategy } from '../services/geminiService';
import { useToast } from '../contexts/ToastContext';

export const BitcoinMaker: React.FC = () => {
    const { addToast } = useToast();
    const [status, setStatus] = useState<'IDLE' | 'ANALYZING' | 'OVERDRIVE'>('IDLE');
    const [targetHash, setTargetHash] = useState('500 PH/s');
    const [strategy, setStrategy] = useState<string | null>(null);
    const [payoutNode, setPayoutNode] = useState('NICEHASH_MAIN_01');
    const [simulatedProduction, setSimulatedProduction] = useState(0);

    const initiateAnalysis = async () => {
        setStatus('ANALYZING');
        setStrategy(null);
        try {
            const result = await getBitcoinMakerStrategy(targetHash);
            setStrategy(result);
            addToast("Logic Synthesized", "Elite BTC production strategy finalized.", "success");
            setStatus('IDLE');
        } catch (e) {
            addToast("Node Error", "Strategy core timed out.", "error");
            setStatus('IDLE');
        }
    };

    const toggleOverdrive = () => {
        if (status === 'OVERDRIVE') {
            setStatus('IDLE');
            addToast("Overdrive Disengaged", "System returning to baseline.", "info");
        } else {
            if (!strategy) {
                addToast("Handshake Required", "Synthesize a strategy first.", "warning");
                return;
            }
            setStatus('OVERDRIVE');
            addToast("OVERDRIVE ENGAGED", "All node cycles diverted to BTC production.", "success");
        }
    };

    useEffect(() => {
        let interval: number;
        if (status === 'OVERDRIVE') {
            interval = window.setInterval(() => {
                setSimulatedProduction(prev => prev + Math.random() * 0.0000001);
            }, 100);
        }
        return () => clearInterval(interval);
    }, [status]);

    return (
        <div className="bg-transparent animate-in fade-in duration-1000 font-sans pb-20">
            <div className="max-w-6xl mx-auto space-y-10">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-orange-500/10 pb-8">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-orange-600 rounded-[1.5rem] flex items-center justify-center shadow-[0_0_50px_rgba(249,115,22,0.4)] border border-orange-400/30">
                            <Zap size={32} className="text-white animate-pulse" />
                        </div>
                        <div>
                            <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter italic text-smart-shimmer">Bitcoin Maker</h2>
                            <p className="text-orange-900 text-[10px] font-black uppercase tracking-[0.4em] mt-2 text-hibernate">Sovereign BTC Production Node :: vX.ALPHA</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 bg-black/40 border border-orange-500/20 p-6 rounded-3xl shadow-inner">
                        <div className="text-right">
                            <div className="text-[9px] font-black text-orange-900 uppercase tracking-widest">Simulated Yield</div>
                            <div className="text-2xl font-black text-orange-500 font-mono tracking-tighter">
                                {simulatedProduction.toFixed(8)} <span className="text-xs">BTC</span>
                            </div>
                        </div>
                        <Coins size={32} className="text-orange-500 animate-bounce" />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Control Panel */}
                    <div className="lg:col-span-7 space-y-8">
                        <div className="bg-[#120800] border border-orange-500/20 rounded-[3rem] p-10 space-y-10 relative overflow-hidden shadow-2xl">
                            <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                                <TrendingUp size={300} className="text-orange-500" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-orange-900 uppercase tracking-[0.4em] ml-2">Target Node Power</label>
                                    <select 
                                        value={targetHash}
                                        onChange={e => setTargetHash(e.target.value)}
                                        className="w-full bg-black border border-orange-900/30 rounded-2xl p-6 text-white font-black text-xl outline-none focus:border-orange-500 transition-all shadow-inner uppercase italic"
                                    >
                                        <option>500 PH/s</option>
                                        <option>1.2 EH/s</option>
                                        <option>5.0 EH/s (ELITE)</option>
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-orange-900 uppercase tracking-[0.4em] ml-2">Payout Protocol</label>
                                    <select 
                                        value={payoutNode}
                                        onChange={e => setPayoutNode(e.target.value)}
                                        className="w-full bg-black border border-orange-900/30 rounded-2xl p-6 text-orange-500 font-mono text-lg font-black outline-none focus:border-orange-500 transition-all shadow-inner"
                                    >
                                        <option>NICEHASH_MAIN_01</option>
                                        <option>BINANCE_POOL_X</option>
                                        <option>LOCAL_VALUT_SVR</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-4 relative z-10">
                                <button 
                                    onClick={initiateAnalysis}
                                    disabled={status === 'ANALYZING'}
                                    className="w-full py-6 rounded-[2rem] bg-orange-600 hover:bg-orange-500 text-white font-black text-lg uppercase tracking-[0.4em] shadow-2xl transition-all active:scale-95 border-b-8 border-orange-900 flex items-center justify-center gap-4 group"
                                >
                                    {status === 'ANALYZING' ? (
                                        <RefreshCw size={24} className="animate-spin" />
                                    ) : (
                                        <Sparkles size={24} className="group-hover:rotate-12 transition-transform" />
                                    )}
                                    {status === 'ANALYZING' ? 'SYNTHESIZING BTC LOGIC...' : 'GENERATE OVERLORD STRATEGY'}
                                </button>
                            </div>

                            {strategy && (
                                <div className="bg-black/60 border border-orange-500/20 rounded-3xl p-8 relative overflow-hidden animate-in slide-in-from-top-4 duration-500">
                                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none rotate-12"><Terminal size={120} /></div>
                                    <div className="flex items-center gap-3 text-orange-500 font-black text-[10px] uppercase tracking-widest mb-4">
                                        <Code size={14}/> Node Blueprint Synthesized:
                                    </div>
                                    <p className="text-slate-200 text-sm leading-relaxed font-medium italic font-mono uppercase tracking-tight">
                                        "{strategy}"
                                    </p>
                                    <div className="mt-8 pt-6 border-t border-orange-500/10 flex justify-between items-center">
                                        <button 
                                            onClick={toggleOverdrive}
                                            className={`px-10 py-4 rounded-xl font-black text-xs uppercase tracking-[0.3em] transition-all flex items-center gap-3 shadow-xl ${
                                                status === 'OVERDRIVE' 
                                                ? 'bg-red-600 text-white border-red-900 animate-pulse' 
                                                : 'bg-white text-black hover:bg-orange-50'
                                            }`}
                                        >
                                            <Rocket size={18} /> {status === 'OVERDRIVE' ? 'TERMINATE OVERDRIVE' : 'ENGAGE OVERDRIVE'}
                                        </button>
                                        <div className="flex items-center gap-2">
                                            <Activity size={16} className={status === 'OVERDRIVE' ? 'text-green-500 animate-pulse' : 'text-slate-700'} />
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Protocol Sync</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Visualizer / Stats */}
                    <div className="lg:col-span-5 space-y-8">
                        <div className="bg-slate-900 border border-orange-500/20 rounded-[3rem] p-10 flex flex-col items-center justify-center text-center space-y-10 relative overflow-hidden glass-shadow">
                            <div className="absolute inset-0 bg-orange-500/5 opacity-50"></div>
                            
                            <div className="relative">
                                <div className={`w-48 h-48 md:w-64 md:h-64 rounded-full border-8 border-dashed flex items-center justify-center transition-all duration-1000 ${status === 'OVERDRIVE' ? 'border-orange-500 animate-slow-rotate' : 'border-slate-800'}`}>
                                    <div className={`w-40 h-40 md:w-56 md:h-56 rounded-full border-2 flex items-center justify-center bg-black shadow-[inset_0_0_60px_rgba(0,0,0,1)] ${status === 'OVERDRIVE' ? 'border-orange-500 shadow-orange-500/20' : 'border-slate-700'}`}>
                                        <div className="text-center">
                                            <div className={`text-4xl md:text-6xl font-black italic tracking-tighter transition-all duration-500 ${status === 'OVERDRIVE' ? 'text-orange-500 scale-110' : 'text-slate-800'}`}>BTC</div>
                                            <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-2">Core Master</div>
                                        </div>
                                    </div>
                                </div>
                                {status === 'OVERDRIVE' && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <div className="w-full h-full rounded-full border-t-4 border-orange-400 animate-spin" style={{ animationDuration: '0.8s' }}></div>
                                        <div className="absolute w-2 h-2 bg-orange-500 rounded-full animate-ping"></div>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-6 w-full relative z-10">
                                <MakerStat label="CORE TEMP" value={status === 'OVERDRIVE' ? "84.2°C" : "42.0°C"} color={status === 'OVERDRIVE' ? "text-red-500" : "text-white"} />
                                <MakerStat label="LOAD" value={status === 'OVERDRIVE' ? "100%" : "25%"} color={status === 'OVERDRIVE' ? "text-orange-400" : "text-white"} />
                                <MakerStat label="STABILITY" value={status === 'OVERDRIVE' ? "94.5%" : "100%"} color="text-indigo-400" />
                                <MakerStat label="NETWORK" value="MAINNET" color="text-emerald-400" />
                            </div>
                        </div>

                        <div className="bg-indigo-900/10 border border-indigo-500/20 rounded-[2.5rem] p-8 flex gap-5 items-start">
                            <Landmark size={32} className="text-indigo-400 shrink-0 mt-1" />
                            <div className="space-y-2">
                                <h4 className="text-white font-black uppercase text-xs tracking-widest italic">Institutional Anchor</h4>
                                <p className="text-[10px] text-slate-400 leading-relaxed font-bold uppercase tracking-widest">
                                    Simulated Bitcoin production is linked to the <b>Global Liquidity Vault</b>. Tier-1 access required for direct SWIFT settlement.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MakerStat = ({ label, value, color }: { label: string, value: string, color: string }) => (
    <div className="bg-black/60 p-4 rounded-2xl border border-white/5 shadow-inner">
        <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</div>
        <div className={`text-lg font-black font-mono tracking-tighter ${color} italic`}>{value}</div>
    </div>
);