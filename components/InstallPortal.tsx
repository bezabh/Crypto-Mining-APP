
import React, { useState, useEffect } from 'react';
// Added RefreshCw to fix 'Cannot find name RefreshCw' error
import { Smartphone, Star, Download, ShieldCheck, CheckCircle2, ChevronRight, Play, Info, X, MoreVertical, Share, MessageSquare, Cpu, Activity, Globe, Wallet, Zap, Monitor, Terminal, Layout, Shield, RefreshCw } from 'lucide-react';
import { Feedback } from '../types';
import { useToast } from '../contexts/ToastContext';

interface InstallPortalProps {
  reviews?: Feedback[];
  deferredPrompt?: any;
}

export const InstallPortal: React.FC<InstallPortalProps> = ({ reviews = [], deferredPrompt }) => {
  const { addToast } = useToast();
  const [installState, setInstallState] = useState<'IDLE' | 'DOWNLOADING' | 'INSTALLING' | 'INSTALLED'>('IDLE');
  const [progress, setProgress] = useState(0);
  const [showInstructions, setShowInstructions] = useState(false);
  const [platform, setPlatform] = useState<'ANDROID' | 'IOS' | 'DESKTOP'>('ANDROID');

  const averageRating = '4.9';
  const totalReviews = 1420;

  const SCREENS = [
    { title: "AI Dashboard", icon: <Activity size={20}/>, img: "https://images.unsplash.com/photo-1642790551116-18e150f248e3?auto=format&fit=crop&w=400&q=80", model: 'samsung' },
    { title: "Mining Core", icon: <Cpu size={20}/>, img: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=400&q=80", model: 'iphone' },
    { title: "macOS Command", icon: <Terminal size={20}/>, img: "https://images.unsplash.com/photo-1614624532983-4ce03382d63d?auto=format&fit=crop&w=600&q=80", model: 'mac' },
  ];

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes('iphone') || ua.includes('ipad')) setPlatform('IOS');
    else if (ua.includes('android')) setPlatform('ANDROID');
    else setPlatform('DESKTOP');
    
    if (window.matchMedia('(display-mode: standalone)').matches) {
        setInstallState('INSTALLED');
    }
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setInstallState('INSTALLED');
        addToast("Handshake Established", "TigAppMining Native Link is active.", "success");
      } else {
        setShowInstructions(true);
      }
    } else {
      // Fallback for iOS or already triggered
      if (platform === 'IOS') {
          setShowInstructions(true);
      } else {
          runSimulation();
      }
    }
  };

  const runSimulation = () => {
    setInstallState('DOWNLOADING');
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 20;
      if (p >= 100) {
        clearInterval(interval);
        setProgress(100);
        setInstallState('INSTALLING');
        setTimeout(() => {
          setInstallState('IDLE');
          setShowInstructions(true);
          addToast("Manual Link Required", "Please use your browser's 'Add to Home Screen' option.", "info");
        }, 1500);
      } else {
        setProgress(p);
      }
    }, 150);
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 relative h-full overflow-y-auto no-scrollbar pb-24">
      
      {showInstructions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950">
                 <h3 className="font-black text-white uppercase tracking-tighter">Direct {platform} Install</h3>
                 <button onClick={() => setShowInstructions(false)} className="text-slate-500 hover:text-white">
                    <X size={20} />
                 </button>
              </div>
              <div className="p-8 space-y-8">
                 <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-black shrink-0">1</div>
                    <div>
                       <p className="text-sm text-slate-300 font-bold mb-2">
                          {platform === 'IOS' ? "Tap the 'Share' icon in Safari footer." : "Tap the 'Menu' (3 dots) in Chrome header."}
                       </p>
                       <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-center">
                          {platform === 'IOS' ? <Share className="text-indigo-400" /> : <MoreVertical className="text-indigo-400" />}
                       </div>
                    </div>
                 </div>
                 <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-black shrink-0">2</div>
                    <div>
                       <p className="text-sm text-slate-300 font-bold mb-2">
                          Scroll and select 'Add to Home Screen'.
                       </p>
                       <div className="bg-indigo-600 text-white py-2 px-4 rounded-lg text-xs font-black uppercase tracking-widest inline-flex items-center gap-2 shadow-lg">
                          {platform === 'IOS' ? <span className="w-4 h-4 border-2 border-white rounded flex items-center justify-center">+</span> : <Download size={14} />}
                          Add to Home Screen
                       </div>
                    </div>
                 </div>
                 <div className="bg-indigo-900/20 p-4 rounded-2xl border border-indigo-500/20 text-[10px] text-indigo-300 font-bold uppercase tracking-widest leading-relaxed">
                    This creates a high-performance native bridge to the TigAppMining cluster with biometric support.
                 </div>
              </div>
              <div className="p-4 border-t border-slate-800 bg-slate-950 text-center">
                 <button onClick={() => setShowInstructions(false)} className="text-indigo-400 font-black text-xs uppercase tracking-[0.2em]">Close Installer</button>
              </div>
           </div>
        </div>
      )}

      {/* App Header Section (Like Play Store) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Smartphone size={160} className="text-indigo-500" />
        </div>
        
        <div className="flex flex-col md:flex-row gap-8 relative z-10">
           <div className="w-32 h-32 rounded-[2.5rem] shadow-2xl border-4 border-slate-800 overflow-hidden shrink-0">
              <img 
                 src="https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=256&auto=format&fit=crop" 
                 alt="App Icon" 
                 className="w-full h-full object-cover"
              />
           </div>
           <div className="flex-1">
              <h1 className="text-4xl font-black text-white mb-2 uppercase tracking-tighter italic">TigApp<span className="text-indigo-500">Mining</span> Pro</h1>
              <p className="text-indigo-400 font-black text-xs uppercase tracking-[0.3em] mb-4">Native Deployment Cluster</p>
              <div className="flex items-center gap-6 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-8">
                 <span className="flex items-center gap-1.5 bg-slate-800 px-3 py-1 rounded-full text-white">
                    {averageRating} <Star size={12} className="fill-white text-white" />
                 </span>
                 <span className="flex items-center gap-1.5"><Smartphone size={14}/> Mobile Verified</span>
                 <span className="flex items-center gap-1.5"><ShieldCheck size={14}/> Safe Protocol</span>
              </div>

              {installState === 'IDLE' && (
                <div className="flex flex-col sm:flex-row gap-4">
                    <button 
                    onClick={handleInstall}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 px-12 rounded-2xl transition-all shadow-2xl shadow-indigo-900/40 flex items-center justify-center gap-3 uppercase tracking-widest active:scale-95"
                    >
                        <Download size={20} /> DIRECT INSTALL NOW
                    </button>
                    <button onClick={() => setShowInstructions(true)} className="px-6 py-4 bg-slate-800 hover:bg-slate-700 text-white font-black rounded-2xl text-xs uppercase tracking-widest transition-all">
                        Manual Instructions
                    </button>
                </div>
              )}

              {installState === 'DOWNLOADING' && (
                 <div className="w-full max-w-sm">
                    <div className="flex justify-between text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">
                       <span>Linking Node Components...</span>
                       <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                       <div className="bg-indigo-500 h-full transition-all duration-200 shadow-[0_0_10px_#6366f1]" style={{ width: `${progress}%` }}></div>
                    </div>
                 </div>
              )}

              {installState === 'INSTALLING' && (
                 <div className="flex items-center gap-3 text-indigo-400 text-sm font-black uppercase tracking-widest animate-pulse">
                    <RefreshCw size={20} className="animate-spin" /> Handshake Synchronization...
                 </div>
              )}

              {installState === 'INSTALLED' && (
                 <div className="flex gap-4">
                    <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-xs">
                        <CheckCircle2 size={18} /> Established
                    </div>
                    <button className="bg-indigo-600 text-white font-black px-12 py-4 rounded-2xl shadow-lg uppercase tracking-widest">
                       Enter Node
                    </button>
                 </div>
              )}
           </div>
        </div>
      </div>

      {/* Play Store Style Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-12">
            
            {/* Horizontal Device Previews */}
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-2 px-2">
                {SCREENS.map((s, i) => (
                    <div key={i} className="flex-none w-48 aspect-[9/16] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden relative group hover:border-indigo-500/50 transition-all">
                        <img src={s.img} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-700" alt={s.title} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
                            <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">{s.title}</div>
                            <div className="text-[8px] text-slate-500 font-bold uppercase">Pro Interface v2.5</div>
                        </div>
                    </div>
                ))}
            </div>

            <div>
                <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-4 flex items-center gap-2">
                    <Info size={20} className="text-indigo-400"/> System Intelligence
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-line">
                   TigAppMining is a military-grade crypto mining deployment cluster designed for the Tigray diaspora and global mining professionals. Installing the native application enables persistent node monitoring and biometric-locked fiat withdrawals.

                   ⚡ <b>Native Features:</b>
                   • <b>Cloud Link:</b> Automatic 24/7 background mining sync.
                   • <b>Biometric Vault:</b> Face landmark verification for bank payouts.
                   • <b>Push Alerts:</b> Real-time Telegram and system notifications.
                   • <b>Resource Lock:</b> Battery and hardware temperature protection.
                </p>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
             <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                <h4 className="text-white font-black text-xs uppercase tracking-widest mb-6">Technical Specifications</h4>
                <div className="space-y-4">
                   <TechStat label="Version" value="2.0.5 (Build 882)" />
                   <TechStat label="Deployment" value="Native PWA Cluster" />
                   <TechStat label="Security" value="AES-256 / Biometric" />
                   <TechStat label="Region" value="Global / Tigray Hub" />
                </div>
             </div>

             <div className="bg-indigo-900/10 border border-indigo-500/20 rounded-3xl p-6">
                <div className="flex gap-4 items-start">
                    <Shield size={32} className="text-indigo-400 shrink-0" />
                    <div>
                        <h4 className="text-white font-black text-sm uppercase tracking-tight mb-2">Verified Direct</h4>
                        <p className="text-[10px] text-slate-400 leading-relaxed uppercase font-bold tracking-widest">
                           This application package is cryptographically signed and verified safe by the TigAppMining core team.
                        </p>
                    </div>
                </div>
             </div>
          </div>
      </div>
    </div>
  );
};

const TechStat = ({ label, value }: { label: string, value: string }) => (
    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
        <span className="text-slate-500">{label}</span>
        <span className="text-white">{value}</span>
    </div>
);
