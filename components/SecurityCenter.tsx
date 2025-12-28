
import React, { useState, useEffect } from 'react';
import { 
  Shield, Lock, Globe, AlertTriangle, Activity, Scan, Terminal, 
  CheckCircle, CheckCircle2, XCircle, AlertOctagon, Fingerprint, Eye, Server, 
  RefreshCw, Bug, ShieldOff, Zap, Key, Link, ClipboardList, 
  Database, Users, Globe2, Cpu, ShieldCheck, ChevronRight, Binary, Search
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

interface ThreatLog {
  id: string;
  timestamp: string;
  sourceIp: string;
  vector: string;
  status: 'BLOCKED' | 'DETECTED' | 'MITIGATED' | 'BREACH SUCCESSFUL';
  severity: 'HIGH' | 'MEDIUM' | 'LOW' | 'CRITICAL';
  location: string;
}

interface SecurityCenterProps {
  onNavigate?: (tab: string) => void;
}

export const SecurityCenter: React.FC<SecurityCenterProps> = ({ onNavigate }) => {
  const { addToast } = useToast();
  const [securityScore, setSecurityScore] = useState(85);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [threatCount, setThreatCount] = useState(0);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [activeThreats, setActiveThreats] = useState<ThreatLog[]>([
    { id: 'T-882', timestamp: '10:42:01', sourceIp: '185.122.x.x', vector: 'DDoS / HTTP Flood', status: 'MITIGATED', severity: 'HIGH', location: 'RU' },
    { id: 'T-881', timestamp: '09:15:33', sourceIp: '45.10.x.x', vector: 'Brute Force / SSH', status: 'BLOCKED', severity: 'MEDIUM', location: 'CN' },
    { id: 'T-880', timestamp: '04:12:12', sourceIp: '103.4.x.x', vector: 'SQL Injection', status: 'BLOCKED', severity: 'MEDIUM', location: 'IN' },
  ]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  useEffect(() => {
    const interval = setInterval(() => {
        setThreatCount(prev => prev + Math.floor(Math.random() * 5));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const runSecurityScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setSecurityScore(92);
          addToast("Audit Successful", "Advanced system hardening applied.", "success");
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const filteredThreats = activeThreats.filter(t => 
    t.vector.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    t.sourceIp.includes(debouncedSearch) ||
    t.id.includes(debouncedSearch)
  );

  return (
    <div className="p-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 overflow-y-auto h-full scrollbar-thin">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-3 uppercase tracking-tighter italic">
            <Shield className="text-indigo-500" /> Security Command Hub
          </h2>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Real-time Node Protection & Threat Intelligence</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl">
            <Activity size={16} className="text-green-500 animate-pulse" />
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">IDS Active</span>
          </div>
          <button 
            onClick={runSecurityScan}
            disabled={isScanning}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white px-8 py-2 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-2xl shadow-indigo-900/30"
          >
            {isScanning ? <RefreshCw className="animate-spin" size={16} /> : <Scan size={16} />}
            {isScanning ? `Audit ${scanProgress}%` : 'Execute Audit'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center flex flex-col items-center">
              <div className="relative w-28 h-28 mb-4">
                 <svg className="w-full h-full transform -rotate-90">
                    <circle cx="56" cy="56" r="48" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
                    <circle cx="56" cy="56" r="48" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-indigo-500" strokeDasharray={301} strokeDashoffset={301 - (301 * securityScore) / 100} strokeLinecap="round" />
                 </svg>
                 <div className="absolute inset-0 flex items-center justify-center text-3xl font-black text-white italic">{securityScore}%</div>
              </div>
              <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Integrity Rating</h4>
            </div>

            <StatCard icon={<Binary className="text-green-400" size={32}/>} value={`${42912 + threatCount}`} label="WAF Blocks" />
            <StatCard icon={<Bug className="text-yellow-500" size={32}/>} value="0" label="Active Exploits" />
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="bg-slate-950/50 p-5 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2 italic">
                <Terminal size={14} className="text-indigo-400" /> Advanced Threat Ledger
              </h3>
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-2 text-slate-500" size={14} />
                <input 
                  type="text" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filter threats..." 
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-white outline-none focus:border-indigo-500 transition-all"
                />
              </div>
              <span className="bg-indigo-500/10 text-indigo-400 text-[8px] px-3 py-1 rounded-full border border-indigo-500/20 font-black">LIVE STREAM</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950/30 text-slate-500 uppercase font-black">
                  <tr>
                    <th className="p-4">Event ID</th>
                    <th className="p-4">Vector Analysis</th>
                    <th className="p-4">Source Origin</th>
                    <th className="p-4 text-right">Protocol Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredThreats.map(threat => (
                    <tr key={threat.id} className="hover:bg-slate-800/30 transition-colors group">
                      <td className="p-4 text-slate-500 italic">{threat.id}</td>
                      <td className="p-4">
                        <div className="font-black text-white uppercase tracking-tight">{threat.vector}</div>
                        <div className="text-[10px] text-slate-600">{threat.timestamp} UTC</div>
                      </td>
                      <td className="p-4 text-slate-400">{threat.sourceIp}</td>
                      <td className="p-4 text-right">
                        <span className="text-green-400 font-black uppercase flex items-center justify-end gap-2">
                          <CheckCircle2 size={12} /> {threat.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredThreats.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-12 text-center text-slate-600 font-bold uppercase tracking-widest italic">
                        No matches found in threat ledger
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 border border-indigo-500/20 rounded-3xl p-8 relative overflow-hidden flex flex-col h-full">
             <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                <Shield size={160} />
             </div>
             
             <h3 className="text-xl font-black text-white mb-8 flex items-center gap-3 uppercase tracking-tighter">
                <Zap size={20} className="text-indigo-400" /> Infrastructure Hub
             </h3>

             <div className="grid grid-cols-1 gap-4 flex-1">
                <ManagementLink 
                   icon={<Key size={18} />} 
                   title="API Vault" 
                   desc="Manage linked cloud nodes"
                   color="bg-purple-500/10 text-purple-400 border-purple-500/20"
                   onClick={() => onNavigate?.('api')}
                />
                <ManagementLink 
                   icon={<Database size={18} />} 
                   title="Sync Manager" 
                   desc="Snapshot persistence"
                   color="bg-blue-500/10 text-blue-400 border-blue-500/20"
                   onClick={() => onNavigate?.('database')}
                />
                <ManagementLink 
                   icon={<Users size={18} />} 
                   title="Node Users" 
                   desc="Permission hierarchy"
                   color="bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                   onClick={() => onNavigate?.('admin')}
                />
                <ManagementLink 
                   icon={<Globe2 size={18} />} 
                   title="Affiliate Hub" 
                   desc="Global node referrals"
                   color="bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                   onClick={() => onNavigate?.('market')}
                />
             </div>

             <div className="mt-8 pt-8 border-t border-slate-800">
                <button onClick={() => addToast("LOCK ENGAGED", "All node API access suspended.", "error")} className="w-full bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/30 p-4 rounded-2xl flex items-center justify-between transition-all group">
                   <div className="flex items-center gap-4">
                      <AlertOctagon size={24} />
                      <div className="text-left">
                         <h4 className="text-xs font-black uppercase tracking-widest">Panic Protocol</h4>
                         <p className="text-[8px] opacity-60">Instantly revoke all access keys</p>
                      </div>
                   </div>
                   <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, value, label }: any) => (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col justify-center items-center text-center">
        <div className="mb-4 p-4 bg-slate-950 rounded-2xl border border-slate-800">{icon}</div>
        <div className="text-3xl font-black text-white italic mb-1">{value}</div>
        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{label}</p>
    </div>
);

const ManagementLink = ({ icon, title, desc, color, onClick }: any) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 p-5 rounded-2xl border transition-all hover:scale-[1.02] hover:shadow-xl text-left group bg-slate-950/30`}>
     <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        {icon}
     </div>
     <div className="flex-1 min-w-0">
        <h4 className="text-sm font-black text-white uppercase tracking-tighter truncate">{title}</h4>
        <p className="text-[10px] text-slate-500 font-bold italic truncate opacity-60">{desc}</p>
     </div>
     <ChevronRight size={16} className="text-slate-700 group-hover:text-white" />
  </button>
);
