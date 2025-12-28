
import React, { useState, useEffect } from 'react';
import { Power, Server, Zap, Activity, Fan, Cpu, Network, ChevronDown, Gauge, Thermometer, AlertTriangle, Globe, Sparkles, Sliders, RefreshCw, ShieldCheck } from 'lucide-react';
import { MiningAlgorithm, MiningStats } from '../types';
import { getAutoPilotStrategy } from '../services/geminiService';
import { useToast } from '../contexts/ToastContext';

interface MiningServerProps {
  isMining: boolean;
  onToggle: () => void;
  stats: MiningStats;
  algorithm: MiningAlgorithm;
  onAlgorithmChange: (algo: MiningAlgorithm) => void;
}

export const MiningServer: React.FC<MiningServerProps> = ({ isMining, onToggle, stats, algorithm, onAlgorithmChange }) => {
  const { addToast } = useToast();
  const [selectedPool, setSelectedPool] = useState('NiceHash Stratum');
  const [fanRotation, setFanRotation] = useState(0);
  const [autoPilot, setAutoPilot] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [hwSettings, setHwSettings] = useState({ frequency: 725, voltage: 13200, fan: 75 });
  const [autoPilotLog, setAutoPilotLog] = useState<string>("KERNEL IDLE. WAITING FOR COMMAND.");

  useEffect(() => {
    let interval: number;
    if (isMining) {
      interval = window.setInterval(() => {
        setFanRotation(prev => (prev + 45) % 360);
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isMining]);

  useEffect(() => {
      if (isMining && autoPilot) {
          const autoInterval = setInterval(async () => {
              setIsApplying(true);
              try {
                  const strategy = await getAutoPilotStrategy(stats);
                  setHwSettings({ frequency: strategy.frequency, voltage: strategy.voltage, fan: strategy.fanSpeed });
                  setAutoPilotLog(strategy.explanation.toUpperCase());
                  addToast("AI Auto-Pilot", "Optimization parameters updated.", "success");
              } catch (e) {
                  console.error("AutoPilot Error", e);
              } finally {
                  setIsApplying(false);
              }
          }, 15000);
          return () => clearInterval(autoInterval);
      }
  }, [isMining, autoPilot, stats]);

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
        <div className="bg-black border border-green-500/20 rounded-[2rem] overflow-hidden relative shadow-2xl">
            <div className="bg-black/60 p-8 border-b border-green-500/10 flex flex-wrap justify-between items-center relative z-10 gap-6">
                <div className="flex items-center gap-6">
                    <div className={`w-4 h-4 rounded-full ${isMining ? 'bg-green-500 animate-pulse shadow-[0_0_20px_#22c55e]' : 'bg-red-900'}`}></div>
                    <div>
                        <h3 className="text-2xl font-black text-white flex items-center gap-3 uppercase tracking-tighter italic">
                            <Server size={24} className="text-green-500" /> CORE KERNEL ALPHA
                        </h3>
                        <p className="text-[10px] text-green-900 font-mono font-black uppercase tracking-[0.4em]">SHA-256 :: INSTANCE-882 :: SECURED</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => { setAutoPilot(!autoPilot); if(!autoPilot) addToast("Neural Auto-Pilot", "Gemini AI control engaged.", "info"); }}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg text-[10px] font-black transition-all border ${autoPilot ? 'bg-green-600 text-black border-green-400 shadow-[0_0_30px_rgba(34,197,94,0.4)]' : 'bg-black text-green-900 border-green-900/30 hover:border-green-500 hover:text-green-500'}`}
                    >
                        <Sparkles size={14} className={autoPilot ? 'animate-spin' : ''} /> {autoPilot ? 'NEURAL ENGINE ACTIVE' : 'ENGAGE NEURAL PILOT'}
                    </button>

                    <button 
                        onClick={onToggle}
                        className={`px-10 py-3 rounded-lg font-black text-[10px] uppercase tracking-widest flex items-center gap-3 transition-all shadow-xl active:scale-95 ${
                        isMining ? 'bg-red-900 hover:bg-red-800 text-white border border-red-500/30' : 'bg-green-600 hover:bg-green-500 text-black border border-green-400'
                        }`}
                    >
                        <Power size={14} /> {isMining ? 'SYSTEM SHUTDOWN' : 'INITIATE MINING'}
                    </button>
                </div>
            </div>

            <div className="p-10 grid grid-cols-1 lg:grid-cols-4 gap-10">
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-black/80 p-8 rounded-2xl border border-green-500/10 shadow-inner">
                        <h4 className="text-[10px] font-black text-green-900 uppercase tracking-[0.4em] mb-6 flex items-center gap-2 italic"><Sliders size={14}/> Node Telemetry</h4>
                        <div className="space-y-6">
                            <SettingSlider label="FREQ OFFSET" value={`${hwSettings.frequency} MHZ`} />
                            <SettingSlider label="CORE VOLTAGE" value={`${hwSettings.voltage} MV`} />
                            <SettingSlider label="FAN VELOCITY" value={`${hwSettings.fan}%`} />
                        </div>
                        {autoPilot && (
                            <div className="mt-8 p-5 bg-green-500/5 rounded-xl border border-green-500/10 animate-in slide-in-from-top-4">
                                <div className="flex items-center gap-2 text-[9px] font-black text-green-500 mb-3 uppercase tracking-widest">
                                    {isApplying ? <RefreshCw size={12} className="animate-spin" /> : <ShieldCheck size={12}/>}
                                    NEURAL CALIBRATION ACTIVE
                                </div>
                                <p className="text-[10px] text-green-900 italic leading-relaxed font-black uppercase tracking-wider">{autoPilotLog}</p>
                            </div>
                        )}
                    </div>
                    
                    <div className="bg-black/80 p-8 rounded-2xl border border-green-500/10 shadow-inner">
                       <h4 className="text-[10px] font-black text-green-900 uppercase tracking-[0.4em] mb-4 italic">LIQUIDITY TARGET</h4>
                       <select 
                            value={selectedPool}
                            onChange={(e) => setSelectedPool(e.target.value)}
                            className="w-full bg-slate-900 border border-green-500/20 text-green-500 text-[10px] font-black p-4 rounded-lg outline-none focus:border-green-400 transition-all cursor-pointer uppercase tracking-widest"
                       >
                            <option>NICEHASH STRATUM V2</option>
                            <option>BINANCE GLOBAL POOL</option>
                            <option>VIABTC INSTITUTIONAL</option>
                       </select>
                    </div>
                </div>

                <div className="lg:col-span-3 bg-[#010409] rounded-[2.5rem] border border-green-500/10 p-12 relative overflow-hidden flex flex-col justify-between shadow-inner">
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                    
                    <div className="flex justify-around mb-20 relative z-10">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="relative w-48 h-48 rounded-full border-2 border-green-500/10 bg-black flex items-center justify-center shadow-[inset_0_0_60px_rgba(0,0,0,1)]">
                                <Fan 
                                    size={120} 
                                    className={`text-green-950 transition-transform duration-75`} 
                                    style={{ transform: `rotate(${isMining ? fanRotation + (i * 30) : 0}deg)` }} 
                                />
                                {isMining && <div className="absolute inset-0 rounded-full border-t border-green-500/40 animate-spin" style={{ animationDuration: `${0.4 + i*0.1}s` }}></div>}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
                        <TelemetryBox label="ACTIVE HASH" value={isMining ? `${stats.hashrate}` : "0.00"} unit={stats.hashrateUnit} color="text-white" />
                        <TelemetryBox label="THERMAL LOG" value={isMining ? `${stats.temperature.toFixed(1)}` : "24.0"} unit="°C" color={stats.temperature > 75 ? 'text-red-500' : 'text-green-500'} />
                        <TelemetryBox label="TOTAL LOAD" value={isMining ? `${stats.power}` : "0"} unit="W" color="text-green-400" />
                        <TelemetryBox label="J/TH EFF" value={isMining ? "0.38" : "0.00"} unit="NODE" color="text-green-600" />
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

const SettingSlider = ({ label, value }: { label: string, value: string }) => (
    <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest group">
        <span className="text-green-900 group-hover:text-green-500 transition-colors">{label}</span>
        <span className="text-white font-mono bg-green-500/5 px-2 py-0.5 rounded">{value}</span>
    </div>
);

const TelemetryBox = ({ label, value, unit, color }: any) => (
    <div className="bg-black border border-green-500/5 p-8 rounded-2xl text-center glass-shadow hover:border-green-500/20 transition-all">
        <div className="text-[10px] font-black text-green-900 uppercase tracking-[0.3em] mb-3 text-hibernate">{label}</div>
        <div className={`text-4xl font-black font-mono tracking-tighter ${color} text-hibernate`}>{value} <span className="text-[10px] text-green-900">{unit}</span></div>
    </div>
);
