
import React, { useState, useEffect } from 'react';
import { 
    Globe, Coins, Zap, ArrowUpRight, ShieldCheck, 
    CircleDollarSign, BrainCircuit, Activity, 
    ExternalLink, Layers, TrendingUp, Cpu, 
    Network, Radar, BarChart3, Wallet, 
    Sparkles, Lock, RefreshCw, Star, ArrowRight,
    TrendingDown, Gem
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { getGroundedNodeIntel } from '../services/geminiService';

interface WealthNode {
    id: string;
    title: string;
    platform: string;
    category: 'PASSIVE' | 'ACTIVE' | 'ALPHA';
    potential: string;
    difficulty: 'LOW' | 'MEDIUM' | 'EXPERT';
    url: string;
    icon: React.ReactNode;
    description: string;
    region: string;
}

const GLOBAL_STREAMS: WealthNode[] = [
    {
        id: 'w-1',
        title: 'Institutional Staking',
        platform: 'Binance Earn',
        category: 'PASSIVE',
        potential: 'Up to 18% APR',
        difficulty: 'LOW',
        url: 'https://www.binance.com/en/earn',
        icon: <Coins size={24} />,
        description: 'Auto-compounding liquidity nodes for Tier-1 digital assets.',
        region: 'Global'
    },
    {
        id: 'w-2',
        title: 'Neural Data Harvester',
        platform: 'Scale AI',
        category: 'ACTIVE',
        potential: '$15 - $45 / hr',
        difficulty: 'MEDIUM',
        url: 'https://scale.com/rlhf',
        icon: <BrainCircuit size={24} />,
        description: 'High-precision RLHF training for frontier LLM models.',
        region: 'Global / Remote'
    },
    {
        id: 'w-3',
        title: 'Delta Arbitrage Hub',
        platform: 'Remotasks',
        category: 'ACTIVE',
        potential: '$800+ / mo',
        difficulty: 'MEDIUM',
        url: 'https://www.remotasks.com/',
        icon: <Zap size={24} />,
        description: 'Autonomous vehicle sensor validation and LiDAR mapping tasks.',
        region: 'Global'
    },
    {
        id: 'w-4',
        title: 'Yield Aggregator',
        platform: 'Nexo Pro',
        category: 'PASSIVE',
        potential: '12% APY',
        difficulty: 'LOW',
        url: 'https://nexo.com/',
        icon: <ShieldCheck size={24} />,
        description: 'Collateralized credit lines and high-yield digital asset interest.',
        region: 'Global / CH'
    },
    {
        id: 'w-5',
        title: 'Expert Logic Pipeline',
        platform: 'Toptal',
        category: 'ACTIVE',
        potential: '$100k+ / yr',
        difficulty: 'EXPERT',
        url: 'https://www.toptal.com/',
        icon: <Cpu size={24} />,
        description: 'Elite network for top 3% software engineers and architects.',
        region: 'Global'
    },
    {
        id: 'w-6',
        title: 'Cloud Liquidity Mine',
        platform: 'HashKey Hub',
        category: 'ALPHA',
        potential: 'Variable High',
        difficulty: 'EXPERT',
        url: 'https://www.hashkey.com/',
        icon: <Network size={24} />,
        description: 'Institutional-grade asset management and liquidity provision.',
        region: 'Hong Kong / Global'
    }
];

export const GlobalWealthHub: React.FC = () => {
    const { addToast } = useToast();
    const [activeFilter, setActiveFilter] = useState<'ALL' | 'PASSIVE' | 'ACTIVE' | 'ALPHA'>('ALL');
    const [oracleAdvice, setOracleAdvice] = useState<string>('Initializing Neural Oracle...');
    const [isConnecting, setIsConnecting] = useState<string | null>(null);
    const [loadingOracle, setLoadingOracle] = useState(false);

    useEffect(() => {
        refreshOracle();
    }, []);

    const refreshOracle = async () => {
        setLoadingOracle(true);
        try {
            const context = "Top global money makers: Binance Earn, Scale AI, Remotasks, Toptal, Nexo. Current market: High volatility, AI sector booming.";
            const result = await getGroundedNodeIntel("What is the most profitable remote wealth stream for a tech-savvy miner right now?");
            setOracleAdvice(result.text || "Focus on Neural RLHF streams for immediate USD liquidity.");
        } catch (e) {
            setOracleAdvice("Market sync error. Suggested path: AI Data Arbitrage via Scale AI.");
        } finally {
            setLoadingOracle(false);
        }
    };

    const handleNodeConnect = (node: WealthNode) => {
        setIsConnecting(node.id);
        addToast("Handshake Initiated", `Linking to ${node.platform} secure gateway...`, "info");
        setTimeout(() => {
            setIsConnecting(null);
            window.open(node.url, '_blank');
        }, 1500);
    };

    const filteredNodes = activeFilter === 'ALL' 
        ? GLOBAL_STREAMS 
        : GLOBAL_STREAMS.filter(n => n.category === activeFilter);

    return (
        <div className="p-8 space-y-10 animate-in fade-in duration-700 h-full overflow-y-auto">
            {/* Header Section */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8 border-b border-white/5 pb-10">
                <div className="space-y-3">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center shadow-[0_0_50px_rgba(99,102,241,0.4)] border border-indigo-400/30">
                            <Globe size={36} className="text-white animate-slow-rotate" />
                        </div>
                        <div>
                            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter italic text-smart-shimmer">Global Alpha Pipeline</h2>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-1 text-hibernate">Aggregated Wealth Hub :: v5.0.SYN</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3">
                    {['ALL', 'PASSIVE', 'ACTIVE', 'ALPHA'].map((f) => (
                        <button 
                            key={f}
                            onClick={() => setActiveFilter(f as any)}
                            className={`px-6 md:px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border ${
                                activeFilter === f 
                                ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-900/40' 
                                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-white'
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Oracle & Visualizer */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 bg-slate-900/40 backdrop-blur-3xl border border-slate-800 rounded-[3rem] p-6 md:p-10 relative overflow-hidden glass-shadow group">
                    <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-1000">
                        <Radar size={350} className="text-indigo-500 animate-pulse" />
                    </div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
                        <div className="relative shrink-0">
                            <div className="w-40 h-40 md:w-56 md:h-56 rounded-full border-4 border-dashed border-indigo-500/20 flex items-center justify-center animate-slow-rotate">
                                <div className="w-32 h-32 md:w-44 md:h-44 rounded-full border-2 border-indigo-500/40 flex items-center justify-center bg-indigo-500/5">
                                    <Globe size={64} className="text-indigo-400 opacity-80" />
                                </div>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-4 h-4 bg-indigo-400 rounded-full animate-ping shadow-[0_0_20px_#6366f1]"></div>
                            </div>
                        </div>

                        <div className="space-y-6 flex-1 text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-3">
                                <Sparkles className="text-yellow-400" size={20} />
                                <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight italic">Wealth Oracle Analysis</h3>
                            </div>
                            <div className="bg-slate-950/50 border border-white/5 rounded-3xl p-6 relative overflow-y-auto max-h-[250px]">
                                {loadingOracle ? (
                                    <div className="flex items-center gap-3 text-indigo-400 animate-pulse font-mono text-xs uppercase tracking-widest">
                                        <RefreshCw size={16} className="animate-spin" /> Synthesizing Global Market Nodes...
                                    </div>
                                ) : (
                                    <p className="text-slate-300 text-sm leading-relaxed font-medium italic animate-in fade-in slide-in-from-left-2 whitespace-normal">
                                        "{oracleAdvice}"
                                    </p>
                                )}
                            </div>
                            <button 
                                onClick={refreshOracle}
                                className="text-[10px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-6 py-2.5 rounded-full border border-indigo-500/20 hover:bg-indigo-500 hover:text-white transition-all flex items-center gap-2"
                            >
                                <RefreshCw size={12} className={loadingOracle ? 'animate-spin' : ''} /> Recalibrate Oracle
                            </button>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border border-indigo-500/20 rounded-[2.5rem] p-8 flex flex-col justify-between h-full group hover:border-indigo-500/50 transition-all duration-500 glass-shadow">
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="p-4 bg-indigo-600 rounded-2xl shadow-xl border border-indigo-400/50">
                                    <Gem size={24} className="text-white" />
                                </div>
                                <div>
                                    <h4 className="text-white font-black uppercase text-sm tracking-widest italic">Best Performing</h4>
                                    <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">Neural Labeling (Scale AI)</p>
                                </div>
                            </div>
                            <p className="text-xs text-indigo-200/70 leading-relaxed font-bold uppercase tracking-wider italic">
                                Current arbitrage efficiency: <span className="text-white">94.2%</span>. Transition idle node capacity to RLHF active tasks for maximum yield.
                            </p>
                        </div>
                        <div className="space-y-4 pt-8">
                            <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase">
                                <span>Risk Level</span>
                                <span className="text-emerald-400">Minimal</span>
                            </div>
                            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-white/5">
                                <div className="h-full bg-emerald-500 w-[15%]"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stream Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-20">
                {filteredNodes.map((node) => (
                    <div key={node.id} className="bg-slate-900/60 border border-slate-800 rounded-[2.5rem] p-8 relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-500 glass-shadow">
                        <div className="absolute -right-6 -top-6 w-40 h-40 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/10 transition-all"></div>
                        
                        <div className="relative z-10 space-y-8">
                            <div className="flex justify-between items-start">
                                <div className="p-5 bg-slate-950 border border-white/5 rounded-[1.25rem] text-indigo-400 group-hover:scale-110 transition-transform shadow-inner">
                                    {node.icon}
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className={`text-[8px] font-black px-3 py-1 rounded-full border ${
                                        node.category === 'PASSIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                                        node.category === 'ACTIVE' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 
                                        'bg-rose-500/10 text-rose-500 border-rose-500/20'
                                    }`}>
                                        {node.category} STREAM
                                    </span>
                                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">{node.region}</span>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-1 h-1 bg-indigo-500 rounded-full animate-pulse"></div>
                                    <div className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{node.platform}</div>
                                </div>
                                <h3 className="text-2xl font-black text-white uppercase tracking-tight italic">{node.title}</h3>
                                <p className="text-slate-500 text-xs mt-4 leading-relaxed font-medium">
                                    {node.description}
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex justify-between items-end border-b border-white/5 pb-4">
                                    <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Yield Potential</div>
                                    <div className="text-2xl font-black text-white italic tracking-tighter text-smart-shimmer">{node.potential}</div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="flex gap-0.5">
                                            {[1,2,3].map(i => (
                                                <Star key={i} size={10} className={`${i <= (node.difficulty === 'LOW' ? 1 : node.difficulty === 'MEDIUM' ? 2 : 3) ? 'text-indigo-400 fill-indigo-400' : 'text-slate-800'}`} />
                                            ))}
                                        </div>
                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Complexity: {node.difficulty}</span>
                                    </div>
                                    <button 
                                        onClick={() => handleNodeConnect(node)}
                                        disabled={isConnecting !== null}
                                        className={`px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 ${
                                            isConnecting === node.id 
                                            ? 'bg-slate-800 text-indigo-400' 
                                            : 'bg-white text-slate-950 hover:bg-indigo-50 active:scale-95'
                                        }`}
                                    >
                                        {isConnecting === node.id ? (
                                            <RefreshCw size={12} className="animate-spin" />
                                        ) : (
                                            <ArrowUpRight size={14} />
                                        )}
                                        {isConnecting === node.id ? 'HANDSHAKE...' : 'CONNECT NODE'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Global Earning Alert */}
            <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-500"></div>
                <div className="flex items-center gap-8">
                    <div className="w-16 h-16 bg-rose-600/10 rounded-2xl flex items-center justify-center text-rose-500 border border-rose-500/20 shadow-lg">
                        <Lock size={32} />
                    </div>
                    <div>
                        <h4 className="text-white font-black text-xl uppercase tracking-tight italic">Encrypted Alpha Gateway</h4>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2 max-w-lg leading-relaxed">
                            All external wealth streams are synthesized via TigApp secure AES-256 tunnels. Your regional identities are masked for maximum compliance safety.
                        </p>
                    </div>
                </div>
                <div className="flex flex-col items-center md:items-end gap-3 shrink-0">
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">Tunnel Integrity: Verified</span>
                    <div className="flex gap-1.5 h-6 items-end">
                        {[1,2,3,4,5,6,7,8].map(i => (
                            <div key={i} className="w-1.5 bg-emerald-500/40 rounded-full animate-pulse" style={{ height: `${20 + Math.random() * 80}%`, animationDelay: `${i*0.1}s` }}></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
