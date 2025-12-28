import React, { useState } from 'react';
import { 
    Zap, Sparkles, Coins, RefreshCw, Cpu, 
    ShieldCheck, Terminal, Layers, Box, 
    ArrowRight, Globe, Code, Database,
    Rocket, Gem, Activity
} from 'lucide-react';
import { generateCoinWhitepaper, generateMiningArt } from '../services/geminiService';
import { useToast } from '../contexts/ToastContext';

interface ForgedCoin {
    id: string;
    name: string;
    symbol: string;
    supply: string;
    description: string;
    logo: string;
    timestamp: string;
}

export const CoinForge: React.FC = () => {
    const { addToast } = useToast();
    const [step, setStep] = useState<'INPUT' | 'MINTING' | 'VAULT'>('INPUT');
    const [forgingLogs, setForgingLogs] = useState<string[]>([]);
    
    // Form Inputs
    const [coinName, setCoinName] = useState('');
    const [coinSymbol, setCoinSymbol] = useState('');
    const [coinPurpose, setCoinPurpose] = useState('');
    const [initialSupply, setInitialSupply] = useState('1000000000');
    
    const [isGenerating, setIsGenerating] = useState(false);
    const [currentCoin, setCurrentCoin] = useState<ForgedCoin | null>(null);

    const startForgeProcess = async () => {
        if (!coinName || !coinSymbol || !coinPurpose) {
            addToast("Validation Error", "Incomplete identity vectors for the new coin.", "error");
            return;
        }

        setStep('MINTING');
        setForgingLogs(["> Initializing Forge Protocol...", "> Linking to Global Liquidity Mesh..."]);

        try {
            // Step 1: AI Synthesis of Whitepaper
            setForgingLogs(prev => [...prev, "> Synchronizing with Neural Oracle..."]);
            const whitepaper = await generateCoinWhitepaper(coinName, coinSymbol, coinPurpose);
            
            // Step 2: AI Synthesis of Logo
            setForgingLogs(prev => [...prev, "> Whitepaper generated. Forging logo artifact..."]);
            const logo = await generateMiningArt(`A futuristic gold and cyan coin logo for a cryptocurrency named ${coinName}, 3D render, luxury, crypto symbol`);

            // Step 3: Simulation of Blockchain Minting
            const logs = [
                "> Deploying Smart Contract to Layer-1...",
                "> Minting Genesis Block...",
                "> Mapping initial supply to Sovereign Node...",
                "> Handshake Complete. Persistence established."
            ];

            for (const log of logs) {
                await new Promise(res => setTimeout(res, 800));
                setForgingLogs(prev => [...prev, log]);
            }

            const forged: ForgedCoin = {
                id: `node-${Math.random().toString(36).substr(2, 9)}`,
                name: coinName,
                symbol: coinSymbol.toUpperCase(),
                supply: initialSupply,
                description: whitepaper,
                logo: logo,
                timestamp: new Date().toLocaleTimeString()
            };

            setCurrentCoin(forged);
            addToast("Coin Minted", `Handshake successful. ${coinName} is now live in your vault.`, "success");
            setStep('VAULT');

        } catch (e) {
            addToast("Forge Terminal Failure", "Neural core disconnected during synthesis.", "error");
            setStep('INPUT');
        }
    };

    return (
        <div className="bg-transparent animate-in fade-in duration-1000 font-sans pb-20">
            <div className="max-w-6xl mx-auto space-y-10">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center shadow-[0_0_50px_rgba(99,102,241,0.3)] border border-indigo-400/30">
                            <Sparkles size={32} className="text-white animate-pulse" />
                        </div>
                        <div>
                            <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic text-smart-shimmer">Coin Forge Portal</h2>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-2 text-hibernate">Genesis Minting Node :: v2.5.ALPHA</p>
                        </div>
                    </div>
                    <div className="flex bg-slate-900 border border-slate-800 p-1.5 rounded-2xl">
                        <button onClick={() => setStep('INPUT')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${step === 'INPUT' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>Designer</button>
                        <button onClick={() => currentCoin && setStep('VAULT')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${step === 'VAULT' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>Vault</button>
                    </div>
                </div>

                {step === 'INPUT' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        <div className="lg:col-span-7 space-y-8">
                            <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 space-y-8 relative overflow-hidden shadow-2xl glass-shadow">
                                <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                                    <Coins size={250} className="text-indigo-500" />
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2">Token Identity Name</label>
                                        <input 
                                            value={coinName} 
                                            onChange={e => setCoinName(e.target.value)}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-6 text-white font-black text-xl outline-none focus:border-indigo-500 transition-all shadow-inner" 
                                            placeholder="Tigray Global Node" 
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2">Ticker Signature</label>
                                        <input 
                                            value={coinSymbol} 
                                            onChange={e => setCoinSymbol(e.target.value)}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-6 text-white font-mono text-xl font-black outline-none focus:border-indigo-500 transition-all shadow-inner" 
                                            placeholder="TGN" 
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3 relative z-10">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2">Mission Protocol (Purpose)</label>
                                    <textarea 
                                        value={coinPurpose} 
                                        onChange={e => setCoinPurpose(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-6 text-white text-sm font-medium outline-none focus:border-indigo-500 transition-all h-32 resize-none shadow-inner" 
                                        placeholder="Explain the technical or social utility of this token..."
                                    />
                                </div>

                                <div className="space-y-3 relative z-10">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2">Genesis Supply</label>
                                    <input 
                                        type="number"
                                        value={initialSupply} 
                                        onChange={e => setInitialSupply(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-6 text-indigo-400 font-mono text-2xl font-black outline-none focus:border-indigo-500 transition-all shadow-inner" 
                                    />
                                </div>

                                <button 
                                    onClick={startForgeProcess}
                                    className="w-full py-6 rounded-[2rem] bg-indigo-600 hover:bg-indigo-500 text-white font-black text-lg uppercase tracking-[0.4em] shadow-2xl transition-all active:scale-95 border-b-8 border-indigo-900 flex items-center justify-center gap-4"
                                >
                                    <RefreshCw size={24} /> INITIALIZE MINTING HANDSHAKE
                                </button>
                            </div>
                        </div>

                        <div className="lg:col-span-5 space-y-6">
                            <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 glass-shadow h-full flex flex-col justify-center text-center space-y-8">
                                <div className="relative">
                                    <div className="w-32 h-32 bg-slate-950 rounded-full border-4 border-dashed border-indigo-500/20 mx-auto flex items-center justify-center">
                                        <Layers size={48} className="text-slate-700 opacity-30" />
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Activity size={80} className="text-indigo-500/10 animate-pulse" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <h4 className="text-white font-black uppercase tracking-tighter text-xl">Forge Blueprint</h4>
                                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest leading-relaxed">
                                        Our AI nodes will synthesize a full whitepaper and generate a unique 3D visual artifact based on your design parameters.
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <ForgeStat label="Gas Protocol" value="Fixed 0.1%" />
                                    <ForgeStat label="Mint Speed" value="AI-Optimized" />
                                    <ForgeStat label="Liquidity" value="Node-Linked" />
                                    <ForgeStat label="Standard" value="TigApp-RC1" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 'MINTING' && (
                    <div className="max-w-3xl mx-auto py-20 space-y-12 animate-in zoom-in duration-500">
                        <div className="relative w-48 h-48 mx-auto">
                            <RefreshCw size={192} className="text-indigo-600 animate-spin opacity-20" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="relative">
                                    <div className="w-24 h-24 bg-indigo-600 rounded-full animate-ping opacity-20"></div>
                                    <Sparkles size={64} className="text-white absolute inset-0 m-auto animate-pulse" />
                                </div>
                            </div>
                        </div>

                        <div className="text-center space-y-4">
                            <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic">Minting in Progress</h3>
                            <p className="text-slate-500 text-xs font-black uppercase tracking-[0.5em]">Executing Sovereign Deployment Protocol</p>
                        </div>

                        <div className="bg-black/80 border border-slate-800 rounded-[2.5rem] p-10 font-mono text-xs text-indigo-400 space-y-2 shadow-2xl relative overflow-hidden h-[300px] flex flex-col-reverse justify-start overflow-y-auto no-scrollbar">
                            <div className="absolute top-0 left-0 w-full h-1 bg-indigo-600"></div>
                            {forgingLogs.map((log, i) => (
                                <div key={i} className="animate-in slide-in-from-left-2 flex gap-3">
                                    <span className="text-slate-700 opacity-50">[{new Date().toLocaleTimeString().slice(0, 8)}]</span>
                                    <span>{log}</span>
                                </div>
                            )).reverse()}
                        </div>
                    </div>
                )}

                {step === 'VAULT' && currentCoin && (
                    <div className="animate-in slide-in-from-bottom-10 duration-1000 space-y-10 pb-20">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                            
                            {/* Coin Visualization */}
                            <div className="lg:col-span-5">
                                <div className="aspect-square bg-slate-900 border-2 border-indigo-500/30 rounded-[4rem] overflow-hidden shadow-[0_0_100px_rgba(99,102,241,0.2)] relative group">
                                    <img src={currentCoin.logo} className="w-full h-full object-cover transition-transform duration-2000 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent flex flex-col justify-end p-12">
                                        <div className="text-5xl font-black text-white italic tracking-tighter uppercase">{currentCoin.symbol}</div>
                                        <div className="text-indigo-400 font-black uppercase tracking-[0.4em] text-[10px] mt-2">Node-01 Verified Handshake</div>
                                    </div>
                                    <div className="absolute top-10 right-10">
                                        <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/20">
                                            <ShieldCheck size={24} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Whitepaper Artifact */}
                            <div className="lg:col-span-7 flex flex-col justify-between">
                                <div className="bg-slate-900/50 border border-slate-800 rounded-[3rem] p-12 relative overflow-hidden glass-shadow">
                                    <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none rotate-12"><Terminal size={200} /></div>
                                    
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                                            <Code size={20} />
                                        </div>
                                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">Whitepaper Artifact</h3>
                                    </div>

                                    <div className="text-slate-300 text-lg leading-relaxed font-display font-medium whitespace-pre-line italic">
                                        "{currentCoin.description}"
                                    </div>

                                    <div className="mt-12 pt-10 border-t border-white/5 grid grid-cols-2 md:grid-cols-3 gap-8">
                                        <div>
                                            <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Max Supply</div>
                                            <div className="text-white font-mono text-xl font-black">{parseFloat(currentCoin.supply).toLocaleString()}</div>
                                        </div>
                                        <div>
                                            <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Genesis Date</div>
                                            <div className="text-white font-mono text-xl font-black">{currentCoin.timestamp}</div>
                                        </div>
                                        <div>
                                            <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Chain Link</div>
                                            <div className="text-emerald-400 font-mono text-xl font-black">Active</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4 mt-10">
                                    <button onClick={() => setStep('INPUT')} className="flex-1 py-5 bg-slate-900 hover:bg-slate-800 text-slate-500 hover:text-white rounded-2xl font-black text-xs uppercase tracking-widest border border-slate-800 transition-all">Forge New Entity</button>
                                    <button className="flex-[2] py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.4em] shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3">
                                        <Globe size={18} /> DEPLOY TO MAINNET (SOON)
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const ForgeStat = ({ label, value }: { label: string, value: string }) => (
    <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 flex flex-col items-center">
        <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">{label}</span>
        <span className="text-[10px] font-black text-white uppercase">{value}</span>
    </div>
);