
import React, { useState, useEffect } from 'react';
import { 
    Target, Zap, TrendingUp, ShieldCheck, Timer, MousePointer2, 
    Play, CheckCircle2, Star, Coins, BrainCircuit, Activity, 
    Sparkles, ChevronRight, Layers, RefreshCw, Trophy, Lock, 
    Rocket, Cpu, Network
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { getDynamicTasks } from '../services/geminiService';
import { MiningTask } from '../types';

export const MoneyApps: React.FC = () => {
    const { addToast } = useToast();
    const [tasks, setTasks] = useState<MiningTask[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [executing, setExecuting] = useState<string | null>(null);
    const [totalPoints, setTotalPoints] = useState(() => {
        const saved = localStorage.getItem('tigapp_quest_points');
        return saved ? parseInt(saved) : 42880;
    });

    const fetchTasks = async () => {
        setIsLoading(true);
        try {
            const dynamicTasks = await getDynamicTasks();
            if (dynamicTasks.length > 0) {
                setTasks(dynamicTasks);
            } else {
                // Fallback
                setTasks([
                    { id: '1', title: 'Neural Data Labeling', description: 'Verify AI object detection for autonomous hardware clusters.', reward: 1250, rewardType: 'POINTS', difficulty: 'EASY', progress: 0, status: 'AVAILABLE', category: 'AI' },
                    { id: '2', title: 'Cloud Mesh Validation', description: 'Synchronize regional node packets to ensure network stability.', reward: 4500, rewardType: 'POINTS', difficulty: 'HARD', progress: 0, status: 'AVAILABLE', category: 'MINING' },
                ]);
            }
        } catch (e) {
            addToast("Task Handshake Error", "Unable to sync with quest nodes.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    useEffect(() => {
        localStorage.setItem('tigapp_quest_points', totalPoints.toString());
    }, [totalPoints]);

    const handleExecute = (task: MiningTask) => {
        if (task.status !== 'AVAILABLE') return;
        
        setExecuting(task.id);
        addToast("Task Initiated", `Synchronizing node for ${task.title}...`, "info");
        
        // Progress simulation
        let currentProgress = 0;
        const interval = setInterval(() => {
            currentProgress += 5;
            setTasks(prev => prev.map(t => t.id === task.id ? { ...t, progress: currentProgress, status: 'IN_PROGRESS' } : t));
            
            if (currentProgress >= 100) {
                clearInterval(interval);
                setExecuting(null);
                setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: 'COMPLETED', progress: 100 } : t));
                setTotalPoints(prev => prev + task.reward);
                addToast("Quest Finalized", `Node reward of ${task.reward} units synthesized.`, "success");
            }
        }, 100);
    };

    const getDifficultyStyle = (diff: string) => {
        switch(diff) {
            case 'ELITE': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
            case 'HARD': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
            case 'MEDIUM': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
            default: return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
        }
    };

    const getCategoryIcon = (cat: string) => {
        switch(cat) {
            case 'AI': return <BrainCircuit size={18} />;
            case 'SECURITY': return <ShieldCheck size={18} />;
            case 'MARKET': return <TrendingUp size={18} />;
            default: return <Cpu size={18} />;
        }
    };

    return (
        <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 h-full overflow-y-auto scrollbar-thin">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-8">
                <div>
                    <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter italic text-smart-shimmer">Quest Center</h2>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-2 text-hibernate">Autonomous Revenue Stream :: Global Node Quests</p>
                </div>
                <div className="flex items-center gap-8">
                    <div className="flex flex-col items-end">
                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Global Ranking</span>
                        <div className="flex items-center gap-2">
                             <Trophy size={16} className="text-yellow-500 animate-bounce" />
                             <span className="text-white font-black italic">#142</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 bg-slate-900 border border-slate-800 px-8 py-3 rounded-[2rem] shadow-inner relative group overflow-hidden">
                        <div className="absolute inset-0 bg-indigo-500/5 group-hover:bg-indigo-500/10 transition-colors"></div>
                        <div className="flex flex-col items-end relative z-10">
                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Synthesized Points</span>
                            <span className="text-indigo-400 font-mono text-2xl font-black tracking-tighter text-hibernate">
                                {totalPoints.toLocaleString()}
                            </span>
                        </div>
                        <Coins size={28} className="text-yellow-400 relative z-10" />
                    </div>
                </div>
            </div>

            {/* Task Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {isLoading ? (
                    <div className="col-span-full py-24 text-center space-y-6">
                        <RefreshCw size={48} className="text-indigo-500 animate-spin mx-auto" />
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.6em] animate-pulse">Syncing with Task Node Matrix...</p>
                    </div>
                ) : tasks.map((task) => (
                    <div key={task.id} className={`bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-500 shadow-2xl ${task.status === 'COMPLETED' ? 'opacity-60' : ''}`}>
                        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                            {getCategoryIcon(task.category)}
                        </div>
                        
                        <div className="relative z-10 space-y-6">
                            <div className="flex justify-between items-start">
                                <div className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border flex items-center gap-2 ${getDifficultyStyle(task.difficulty)}`}>
                                    {getCategoryIcon(task.category)} {task.difficulty}
                                </div>
                                {task.status === 'COMPLETED' && <CheckCircle2 size={20} className="text-emerald-500 animate-in zoom-in" />}
                            </div>

                            <div>
                                <h3 className="text-2xl font-black text-white uppercase tracking-tight italic group-hover:text-indigo-400 transition-colors">{task.title}</h3>
                                <p className="text-slate-500 text-xs mt-3 leading-relaxed h-12 overflow-hidden font-medium">{task.description}</p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Reward Nodes</div>
                                    <div className="text-3xl font-black text-white italic tracking-tighter text-hibernate">+{task.reward}</div>
                                </div>
                                
                                {task.status === 'IN_PROGRESS' && (
                                    <div className="space-y-2 animate-in fade-in">
                                        <div className="flex justify-between text-[8px] font-black text-indigo-400 uppercase tracking-widest">
                                            <span>Synthesis Progress</span>
                                            <span>{task.progress}%</span>
                                        </div>
                                        <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-white/5">
                                            <div 
                                                className={`h-full bg-indigo-500 shadow-[0_0_15px_#6366f1] transition-all duration-300 text-smart-shimmer`} 
                                                style={{ width: `${task.progress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button 
                                onClick={() => handleExecute(task)}
                                disabled={executing !== null || task.status === 'COMPLETED'}
                                className={`w-full py-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 relative overflow-hidden active:scale-95 ${
                                    task.status === 'COMPLETED'
                                    ? 'bg-emerald-600/20 text-emerald-500 border border-emerald-500/20'
                                    : task.id === executing
                                    ? 'bg-slate-800 text-indigo-400' 
                                    : 'bg-white text-slate-950 hover:bg-indigo-50 border-b-4 border-slate-300'
                                }`}
                            >
                                {task.id === executing ? (
                                    <>
                                        <RefreshCw size={14} className="animate-spin" />
                                        SYNCHRONIZING...
                                    </>
                                ) : task.status === 'COMPLETED' ? (
                                    <>
                                        <CheckCircle2 size={14} />
                                        QUEST FINALIZED
                                    </>
                                ) : (
                                    <>
                                        <Play size={14} fill="currentColor" />
                                        INITIALIZE QUEST
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20">
                <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-[3rem] p-10 relative overflow-hidden shadow-2xl glass-shadow">
                    <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                        <Sparkles size={160} className="text-indigo-500" />
                    </div>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-14 h-14 bg-indigo-600/10 rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/20 shadow-lg">
                            <Layers size={28} />
                        </div>
                        <div>
                            <h4 className="text-white font-black uppercase text-2xl tracking-tighter italic">Strategic Questing</h4>
                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">AI Suggested Development Path</p>
                        </div>
                    </div>
                    <p className="text-slate-300 text-lg leading-relaxed max-w-3xl font-medium italic font-display">
                        "Operational data suggests your current GPU node group is underutilized. By engaging in <span className="text-indigo-400 font-black">Cloud Mesh Validation</span> ELITE quests, you can improve regional stability while earning 25% higher dividend points."
                    </p>
                    <div className="mt-10 flex flex-wrap gap-4">
                        <button 
                            onClick={fetchTasks}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-indigo-900/40 flex items-center gap-2"
                        >
                            <RefreshCw size={14} /> Recalibrate Quest Matrix
                        </button>
                        <button className="bg-slate-950 border border-slate-800 text-slate-500 hover:text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">View Legacy Archive</button>
                    </div>
                </div>

                <div className="lg:col-span-4 bg-indigo-900/10 border border-indigo-500/20 rounded-[3rem] p-10 flex flex-col items-center text-center justify-center space-y-8 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-indigo-500/5 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative w-24 h-24">
                        <div className="absolute inset-0 bg-indigo-500/20 rounded-full animate-ping"></div>
                        <div className="relative w-full h-full bg-indigo-600 rounded-full flex items-center justify-center shadow-[0_0_40px_#6366f1] border-2 border-indigo-400/50">
                            <Rocket size={48} className="text-white group-hover:-translate-y-2 transition-transform duration-500" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h4 className="text-white font-black uppercase tracking-tighter text-2xl italic">Redemption Node</h4>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-relaxed">
                            Convert synthesized points into pure BTC or regional currency via CBE / Telebirr.
                        </p>
                    </div>
                    <div className="w-full bg-black/40 p-6 rounded-2xl border border-white/5 space-y-4">
                        <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase">
                            <span>Target</span>
                            <span>50,000 Points</span>
                        </div>
                        <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-white/10">
                            <div className="h-full bg-emerald-500" style={{ width: `${(totalPoints / 50000) * 100}%` }}></div>
                        </div>
                        <button 
                            disabled={totalPoints < 50000}
                            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 disabled:grayscale text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-emerald-900/20"
                        >
                            {totalPoints >= 50000 ? 'CONVERT TO BTC' : 'THRESHOLD NOT REACHED'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
