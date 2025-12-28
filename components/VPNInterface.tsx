
import React, { useState, useEffect } from 'react';
import { Shield, Globe, Power, RefreshCw, Wifi, Lock, Zap, MapPin, Activity, ArrowDownUp, CheckCircle2, AlertTriangle, Server } from 'lucide-react';

interface ServerNode {
  id: string;
  country: string;
  city: string;
  flag: string;
  ping: number;
  load: number;
}

const SERVERS: ServerNode[] = [
  { id: 'us', country: 'United States', city: 'New York', flag: '🇺🇸', ping: 145, load: 45 },
  { id: 'de', country: 'Germany', city: 'Frankfurt', flag: '🇩🇪', ping: 110, load: 32 },
  { id: 'sg', country: 'Singapore', city: 'Singapore', flag: '🇸🇬', ping: 280, load: 15 },
  { id: 'jp', country: 'Japan', city: 'Tokyo', flag: '🇯🇵', ping: 310, load: 22 },
  { id: 'nl', country: 'Netherlands', city: 'Amsterdam', flag: '🇳🇱', ping: 115, load: 28 },
];

export const VPNInterface: React.FC = () => {
  const [status, setStatus] = useState<'DISCONNECTED' | 'CONNECTING' | 'CONNECTED'>('DISCONNECTED');
  const [selectedServer, setSelectedServer] = useState<ServerNode>(SERVERS[0]);
  const [protocol, setProtocol] = useState<'WireGuard' | 'OpenVPN UDP' | 'OpenVPN TCP'>('WireGuard');
  
  // Network Stats
  const [stats, setStats] = useState({
    ping: 185,
    jitter: 45,
    loss: 2.5,
    ip: '192.168.x.x (Exposed)',
    up: 0,
    down: 0
  });

  // Simulation Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => {
        // If connected, simulate GOOD stats
        if (status === 'CONNECTED') {
          return {
            ...prev,
            ping: Math.max(20, selectedServer.ping - 80 + (Math.random() * 10)), // Simulated reduction
            jitter: Math.random() * 5,
            loss: 0,
            up: 15 + Math.random() * 5,
            down: 120 + Math.random() * 20
          };
        } 
        // If disconnected, simulate BAD stats
        else if (status === 'DISCONNECTED') {
          return {
            ...prev,
            ping: 150 + Math.random() * 100, // High ping
            jitter: 30 + Math.random() * 40, // High jitter
            loss: Math.random() * 5, // Packet loss
            up: Math.random() * 2,
            down: Math.random() * 10
          };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [status, selectedServer]);

  const handleConnect = () => {
    if (status === 'CONNECTED') {
      setStatus('DISCONNECTED');
      setStats(prev => ({ ...prev, ip: '192.168.x.x (Exposed)' }));
    } else {
      setStatus('CONNECTING');
      setTimeout(() => {
        setStatus('CONNECTED');
        setStats(prev => ({ ...prev, ip: `10.8.0.${Math.floor(Math.random() * 255)} (Masked)` }));
      }, 2000);
    }
  };

  const getStatusColor = () => {
    if (status === 'CONNECTED') return 'text-green-400';
    if (status === 'CONNECTING') return 'text-yellow-400';
    return 'text-red-400';
  };

  const getHealthLabel = () => {
    if (status === 'CONNECTED') return 'Excellent';
    if (stats.ping > 200 || stats.loss > 1) return 'Poor / Unstable';
    return 'Moderate';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Shield className="text-indigo-500" /> Network Optimizer (VPN)
          </h2>
          <p className="text-slate-400 text-sm mt-1">Route mining traffic through secure, low-latency tunnels to fix connection drops.</p>
        </div>
        <div className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 border ${status === 'CONNECTED' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
           <Activity size={16} /> Network Health: {getHealthLabel()}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Control Panel */}
        <div className="lg:col-span-2 space-y-6">
           {/* Map / Connection Visualizer */}
           <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 relative overflow-hidden min-h-[400px] flex flex-col items-center justify-center">
              {/* Abstract Map Background */}
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                 <svg viewBox="0 0 100 50" className="w-full h-full fill-indigo-500">
                    <path d="M20,10 Q30,0 40,10 T60,15 T80,10 T95,20 V40 Q85,50 75,45 T55,50 T35,45 T15,40 Z" />
                 </svg>
              </div>

              {/* Central Button */}
              <div className="relative z-10 text-center">
                 <button 
                   onClick={handleConnect}
                   className={`w-32 h-32 rounded-full border-4 flex items-center justify-center transition-all shadow-2xl relative group ${
                     status === 'CONNECTED' 
                       ? 'bg-green-600 border-green-500 shadow-green-600/50' 
                       : (status === 'CONNECTING' ? 'bg-yellow-600 border-yellow-500 animate-pulse' : 'bg-slate-800 border-slate-700 hover:border-slate-500')
                   }`}
                 >
                    <Power size={48} className={`text-white transition-transform ${status === 'CONNECTED' ? 'drop-shadow-md' : 'group-hover:scale-110'}`} />
                    
                    {/* Ripple Effect when connecting */}
                    {status === 'CONNECTING' && (
                       <>
                         <div className="absolute inset-0 rounded-full border-2 border-yellow-500 animate-ping opacity-50"></div>
                         <div className="absolute -inset-4 rounded-full border border-yellow-500/50 animate-pulse opacity-30"></div>
                       </>
                    )}
                 </button>
                 
                 <div className="mt-6 space-y-1">
                    <div className="text-2xl font-bold text-white tracking-wide">
                        {status === 'CONNECTED' ? 'CONNECTED' : (status === 'CONNECTING' ? 'CONNECTING...' : 'DISCONNECTED')}
                    </div>
                    <div className="text-sm font-mono text-slate-400">
                        {status === 'CONNECTED' ? `00:42:15` : '---'}
                    </div>
                    <div className="text-xs font-bold text-indigo-400 mt-2">
                        {status === 'CONNECTED' ? selectedServer.city.toUpperCase() : 'Not Protected'}
                    </div>
                 </div>
              </div>

              {/* Live Stats Overlay */}
              <div className="absolute bottom-6 left-6 right-6 grid grid-cols-3 gap-4">
                 <div className="bg-slate-950/80 backdrop-blur-sm p-3 rounded-lg border border-slate-800 text-center">
                    <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Ping</div>
                    <div className={`text-lg font-mono font-bold ${stats.ping < 100 ? 'text-green-400' : 'text-red-400'}`}>
                        {stats.ping.toFixed(0)} <span className="text-xs text-slate-500">ms</span>
                    </div>
                 </div>
                 <div className="bg-slate-950/80 backdrop-blur-sm p-3 rounded-lg border border-slate-800 text-center">
                    <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Down</div>
                    <div className="text-lg font-mono font-bold text-white">
                        {stats.down.toFixed(1)} <span className="text-xs text-slate-500">Mbps</span>
                    </div>
                 </div>
                 <div className="bg-slate-950/80 backdrop-blur-sm p-3 rounded-lg border border-slate-800 text-center">
                    <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Packet Loss</div>
                    <div className={`text-lg font-mono font-bold ${stats.loss < 1 ? 'text-green-400' : 'text-red-400'}`}>
                        {stats.loss.toFixed(1)} <span className="text-xs text-slate-500">%</span>
                    </div>
                 </div>
              </div>
           </div>

           {/* Connection Details */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                    <Globe size={20} />
                 </div>
                 <div className="flex-1">
                    <div className="text-xs text-slate-500 font-bold uppercase">Virtual IP Address</div>
                    <div className="text-white font-mono">{stats.ip}</div>
                 </div>
                 {status === 'CONNECTED' ? <Lock size={16} className="text-green-400" /> : <Lock size={16} className="text-red-400" />}
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400">
                    <Zap size={20} />
                 </div>
                 <div className="flex-1">
                    <div className="text-xs text-slate-500 font-bold uppercase">Protocol</div>
                    <select 
                       value={protocol}
                       onChange={(e) => setProtocol(e.target.value as any)}
                       disabled={status !== 'DISCONNECTED'}
                       className="bg-transparent text-white font-bold outline-none cursor-pointer disabled:cursor-not-allowed"
                    >
                       <option>WireGuard</option>
                       <option>OpenVPN UDP</option>
                       <option>OpenVPN TCP</option>
                    </select>
                 </div>
              </div>
           </div>
        </div>

        {/* Server List Sidebar */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl flex flex-col overflow-hidden h-full max-h-[600px]">
           <div className="p-4 border-b border-slate-800 bg-slate-950/50">
              <h3 className="font-bold text-white flex items-center gap-2">
                 <Server size={16} /> Server Location
              </h3>
              <p className="text-xs text-slate-500 mt-1">Select a low-latency mining node.</p>
           </div>
           
           <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {SERVERS.map((server) => (
                 <button
                    key={server.id}
                    onClick={() => setSelectedServer(server)}
                    disabled={status !== 'DISCONNECTED'}
                    className={`w-full p-3 rounded-lg flex items-center justify-between transition-all group ${
                       selectedServer.id === server.id 
                       ? 'bg-indigo-600/20 border border-indigo-500/50' 
                       : 'hover:bg-slate-800 border border-transparent'
                    } ${status !== 'DISCONNECTED' ? 'opacity-50 cursor-not-allowed' : ''}`}
                 >
                    <div className="flex items-center gap-3">
                       <span className="text-xl">{server.flag}</span>
                       <div className="text-left">
                          <div className={`text-sm font-bold ${selectedServer.id === server.id ? 'text-indigo-400' : 'text-slate-300'}`}>
                             {server.city}
                          </div>
                          <div className="text-[10px] text-slate-500">{server.country}</div>
                       </div>
                    </div>
                    
                    <div className="text-right">
                       <div className="text-xs font-mono text-white">{server.ping} ms</div>
                       <div className="flex items-center gap-1 justify-end mt-1">
                          <div className={`w-1.5 h-1.5 rounded-full ${server.load < 40 ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                          <div className="text-[10px] text-slate-500">{server.load}%</div>
                       </div>
                    </div>
                 </button>
              ))}
           </div>
           
           <div className="p-4 border-t border-slate-800 bg-slate-950/50 text-[10px] text-slate-500 text-center">
              Encryption: AES-256-GCM
           </div>
        </div>

      </div>
    </div>
  );
};
