
import React, { useState, useEffect } from 'react';
import { Shield, ShieldAlert, ShieldCheck, RefreshCw, Trash2, Zap, Bug, Search, Activity, Lock, CheckCircle2, AlertTriangle, Layers, Smartphone, Database } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

interface Threat {
    id: string;
    name: string;
    path: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
    type: 'MALWARE' | 'CRYPTOJACKER' | 'TRACKER';
}

export const McAfeeScanner: React.FC = () => {
    const { addToast } = useToast();
    const [isScanning, setIsScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [scanningFile, setScanningFile] = useState('');
    const [foundThreats, setFoundThreats] = useState<Threat[]>([]);
    const [isCleaning, setIsCleaning] = useState(false);
    const [isProtected, setIsProtected] = useState(true);

    const FILE_MOCKS = [
        '/kernel/mining/sha256_core.bin',
        '/drivers/gpu/nv_thermal_control.sys',
        '/users/operator/config/vault.json',
        '/tmp/hidden_miner_script.sh',
        '/system/integrity/auth_nodes.db',
        '/usr/bin/python3.11/site-packages/malicious_req.py'
    ];

    const runScan = () => {
        setIsScanning(true);
        setFoundThreats([]);
        setScanProgress(0);
        
        let p = 0;
        const interval = setInterval(() => {
            p += Math.random() * 8;
            setScanProgress(Math.min(p, 100));
            setScanningFile(FILE_MOCKS[Math.floor(Math.random() * FILE_MOCKS.length)]);

            // Randomly find "threats" during scan
            if (p > 30 && p < 35 && foundThreats.length === 0) {
                setFoundThreats([{ 
                    id: 'T-101', 
                    name: 'XMRig Hidden Injector', 
                    path: '/tmp/hidden_miner_script.sh', 
                    severity: 'HIGH',
                    type: 'CRYPTOJACKER'
                }]);
            }

            if (p >= 100) {
                clearInterval(interval);
                setIsScanning(false);
                addToast("Scan Complete", foundThreats.length > 0 ? `${foundThreats.length} threats found!` : "No threats detected.", foundThreats.length > 0 ? "warning" : "success");
            }
        }, 150);
    };

    const handleClean = () => {
        setIsCleaning(true);
        setTimeout(() => {
            setFoundThreats([]);
            setIsCleaning(false);
            addToast("Node Sanitized", "System registry cleaned and optimized.", "success");
        }, 2000);
    };

    return (
        <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 h-full overflow-y-auto scrollbar-thin">
            {/* Header with McAfee Branding */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-8">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-[#C01718] rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(192,23,24,0.4)] border border-white/20">
                        <Shield size={32} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic flex items-center gap-3">
                            McAfee <span className="text-slate-500 font-normal">Antivirus</span>
                        </h2>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-2 text-hibernate">Active Node Defense :: Engine v9.4.2</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-6 bg-slate-900 border border-slate-800 px-6 py-3 rounded-2xl shadow-inner">
                    <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${isProtected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Real-time Shield</span>
                    </div>
                    <button 
                        onClick={() => setIsProtected(!isProtected)}
                        className={`text-[9px] font-black px-4 py-1.5 rounded-lg transition-all ${isProtected ? 'bg-green-600/10 text-green-400 border border-green-500/30' : 'bg-red-600 text-white'}`}
                    >
                        {isProtected ? 'ACTIVE' : 'DISABLED'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Scan Status Area */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                            <RefreshCw size={200} className={isScanning ? 'animate-spin' : ''} />
                        </div>

                        <div className="relative z-10 flex flex-col items-center text-center space-y-8">
                            <div className="relative">
                                <div className={`w-32 h-32 rounded-full border-4 flex items-center justify-center transition-all duration-700 ${isScanning ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-800 bg-slate-950'}`}>
                                    {isScanning ? (
                                        <RefreshCw size={48} className="text-indigo-400 animate-spin" />
                                    ) : foundThreats.length > 0 ? (
                                        <ShieldAlert size={48} className="text-red-500 animate-pulse" />
                                    ) : (
                                        <ShieldCheck size={48} className="text-emerald-500" />
                                    )}
                                </div>
                                {isScanning && (
                                    <div className="absolute inset-0 border-2 border-indigo-400 rounded-full animate-ping opacity-20"></div>
                                )}
                            </div>

                            <div>
                                <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">
                                    {isScanning ? 'Scanning Cluster Nodes...' : foundThreats.length > 0 ? 'Threats Detected' : 'System Secure'}
                                </h3>
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">
                                    {isScanning ? `Analyzing: ${scanningFile}` : 'Last scan: Just now'}
                                </p>
                            </div>

                            <div className="w-full max-w-lg space-y-3">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                                    <span>Analysis Progress</span>
                                    <span className="text-indigo-400">{Math.round(scanProgress)}%</span>
                                </div>
                                <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-white/5 p-0.5">
                                    <div 
                                        className="h-full bg-indigo-500 rounded-full shadow-[0_0_15px_#6366f1] transition-all duration-300 text-smart-shimmer" 
                                        style={{ width: `${scanProgress}%` }}
                                    ></div>
                                </div>
                            </div>

                            {!isScanning && (
                                <div className="flex gap-4">
                                    <button 
                                        onClick={runScan}
                                        className="bg-white text-slate-950 px-12 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-xl active:scale-95"
                                    >
                                        INITIALIZE DEEP SCAN
                                    </button>
                                    {foundThreats.length > 0 && (
                                        <button 
                                            onClick={handleClean}
                                            className="bg-red-600 hover:bg-red-500 text-white px-12 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-red-900/20 flex items-center gap-2"
                                        >
                                            <Trash2 size={16} /> NEUTRALIZE ALL
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Threat List */}
                    {foundThreats.length > 0 && (
                        <div className="bg-red-900/10 border border-red-500/20 rounded-3xl overflow-hidden animate-in slide-in-from-top-4">
                            <div className="bg-red-600/20 p-4 border-b border-red-500/20 flex items-center gap-3">
                                <AlertTriangle size={18} className="text-red-500" />
                                <span className="text-xs font-black text-red-500 uppercase tracking-widest">Active Security Breaches</span>
                            </div>
                            <div className="divide-y divide-red-500/10">
                                {foundThreats.map(threat => (
                                    <div key={threat.id} className="p-6 flex items-center justify-between group hover:bg-red-500/5 transition-colors">
                                        <div className="flex items-center gap-5">
                                            <div className="p-3 bg-red-600/10 rounded-xl text-red-500">
                                                <Bug size={24} />
                                            </div>
                                            <div>
                                                <h4 className="text-white font-black uppercase text-sm">{threat.name}</h4>
                                                <p className="text-red-400/60 font-mono text-[10px] mt-1">{threat.path}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-[10px] font-black bg-red-600 text-white px-3 py-1 rounded-full">{threat.severity}</span>
                                            <button className="text-slate-500 hover:text-white transition-colors"><Lock size={16}/></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar Diagnostics */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-8">
                        <h3 className="text-white font-black uppercase text-xs tracking-widest border-b border-slate-800 pb-4">Security Telemetry</h3>
                        
                        <div className="space-y-6">
                            <MetricRow label="Heuristic Link" value="v9.2" status="Active" color="text-green-400" />
                            <MetricRow label="Firewall Node" value="CLUSTER-X" status="Secured" color="text-indigo-400" />
                            <MetricRow label="Database Sync" value="12ms ago" status="Synced" color="text-cyan-400" />
                            <MetricRow label="Threat Index" value="CRITICAL: 0" status="Clean" color="text-emerald-400" />
                        </div>

                        <div className="pt-4">
                            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 relative overflow-hidden">
                                <Activity size={48} className="absolute -right-2 -bottom-2 text-indigo-500 opacity-10" />
                                <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Global Reputation</div>
                                <div className="text-3xl font-black text-white italic text-hibernate">98.5</div>
                                <p className="text-[8px] text-slate-600 uppercase font-black tracking-tighter mt-4">Node verified by McAfee cloud mesh</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-indigo-900/10 border border-indigo-500/20 rounded-3xl p-8 flex flex-col items-center text-center">
                        <Zap size={32} className="text-indigo-400 mb-4" />
                        <h4 className="text-white font-black uppercase text-sm italic mb-2">Web Shield Active</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase leading-relaxed tracking-widest">
                            Mining traffic is currently routed through an encrypted McAfee tunnel to prevent Man-in-the-Middle logic manipulation.
                        </p>
                    </div>
                </div>
            </div>
            
            {/* Cleaning Overlay */}
            {isCleaning && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in">
                    <div className="flex flex-col items-center space-y-8 text-center">
                        <div className="relative w-32 h-32">
                            <RefreshCw size={128} className="text-red-600 animate-spin" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Trash2 size={40} className="text-white animate-pulse" />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-white font-black text-2xl uppercase tracking-tighter">Neutron Sanitization</h3>
                            <p className="text-slate-400 text-xs font-black uppercase tracking-[0.3em] animate-pulse">Shredding Malicious Artifacts...</p>
                        </div>
                        <div className="flex gap-2">
                            {[0,1,2,3].map(i => (
                                <div key={i} className="w-2 h-2 rounded-full bg-red-600 animate-bounce" style={{ animationDelay: `${i * 150}ms` }}></div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const MetricRow = ({ label, value, status, color }: any) => (
    <div className="flex justify-between items-center group">
        <div>
            <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</div>
            <div className="text-xs font-black text-white font-mono mt-0.5">{value}</div>
        </div>
        <span className={`text-[8px] font-black px-2 py-1 rounded border border-white/5 uppercase ${color}`}>{status}</span>
    </div>
);
