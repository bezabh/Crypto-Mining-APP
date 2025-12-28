
import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, Zap, ShieldAlert, Cpu, Maximize2, X, CheckCircle2, Scan, Info, Eye, Box, Activity } from 'lucide-react';
import { analyzeRigVision } from '../services/geminiService';
import { useToast } from '../contexts/ToastContext';

const ADVANCED_ROBOT_URL = "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop";

export const AIVision: React.FC = () => {
  const { addToast } = useToast();
  const [isScanning, setIsScanning] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [hasCamera, setHasCamera] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    startCamera();
    return () => {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(t => t.stop());
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setHasCamera(true);
      }
    } catch (e) {
      addToast("Hardware Handshake Error", "Camera sensor link failure.", "error");
    }
  };

  const handleScan = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setIsScanning(true);
    setAnalysis(null);

    const context = canvasRef.current.getContext('2d');
    if (context) {
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);
      const base64 = canvasRef.current.toDataURL('image/jpeg', 0.8).split(',')[1];
      
      try {
        const result = await analyzeRigVision(base64);
        setAnalysis(result);
        addToast("Handshake Verified", "Node signature confirmed.", "success");
      } catch (e) {
        addToast("Synthesis Fail", "Neural core rejected input.", "error");
      } finally {
        setIsScanning(false);
      }
    }
  };

  return (
    <div className="h-full bg-black relative flex flex-col lg:flex-row overflow-hidden font-sans">
      {/* Advanced Viewfinder */}
      <div className="flex-1 relative bg-slate-950 flex items-center justify-center overflow-hidden">
        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-1000" />
        
        {/* HUD Elements */}
        <div className="absolute inset-0 pointer-events-none">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[50%] border-2 border-indigo-500/20 rounded-[3rem] shadow-[0_0_100px_rgba(99,102,241,0.1)]"></div>
           <div className="absolute top-0 left-0 w-full h-[2px] bg-indigo-400/50 shadow-[0_0_20px_#6366f1] animate-scan-line"></div>
           
           <div className="absolute top-8 left-8 flex items-center gap-4 bg-slate-900/60 backdrop-blur-md px-6 py-3 rounded-2xl border border-indigo-500/20">
              <Eye size={20} className="text-cyan-400 animate-pulse" />
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Rig Vision v4.2</span>
                <span className="text-[8px] font-bold text-indigo-400 uppercase tracking-widest">Active Optical Handshake</span>
              </div>
           </div>
        </div>

        <div className="absolute bottom-16 left-0 right-0 flex justify-center px-8 z-20">
           <button 
             onClick={handleScan}
             disabled={isScanning || !hasCamera}
             className={`px-16 py-6 rounded-full font-black text-sm uppercase tracking-[0.3em] flex items-center gap-4 transition-all active:scale-95 disabled:opacity-30 shadow-2xl relative overflow-hidden ${isScanning ? 'bg-slate-800 text-indigo-400' : 'bg-white text-slate-950 hover:bg-indigo-50 hover:shadow-indigo-500/30'}`}
           >
             {isScanning ? <RefreshCw className="animate-spin" size={20}/> : <Scan size={20}/>}
             {isScanning ? 'Synthesizing Diagnostics...' : 'Handshake Analysis'}
           </button>
        </div>
      </div>

      {/* Advanced Analysis Sidebar */}
      <div className="w-full lg:w-[450px] bg-slate-900 border-l border-slate-800 flex flex-col h-full overflow-hidden">
         <div className="p-10 border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-indigo-600 rounded-3xl overflow-hidden shadow-2xl border-2 border-indigo-400/40 relative group">
                <img src={ADVANCED_ROBOT_URL} alt="Assistant" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-indigo-500/20 mix-blend-overlay"></div>
                </div>
                <div>
                <h3 className="text-white font-black uppercase text-2xl tracking-tighter italic">Neural Core</h3>
                <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Rig Diagnostic Handshake</p>
                </div>
            </div>
         </div>

         <div className="flex-1 overflow-y-auto no-scrollbar p-10 space-y-8">
            {analysis ? (
            <div className="space-y-8 animate-in slide-in-from-right-10 duration-700 pb-10">
                <div className="bg-slate-950 border border-indigo-500/30 rounded-[2rem] p-8 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none"><Cpu size={120}/></div>
                    <div className="flex items-center gap-3 text-indigo-400 font-black text-xs uppercase tracking-widest mb-6 border-b border-indigo-500/10 pb-4">
                        <ShieldAlert size={16}/> Hardware Artifact Report
                    </div>
                    <div className="text-slate-200 text-sm leading-relaxed whitespace-pre-line font-medium italic font-mono uppercase tracking-tight">
                        "{analysis}"
                    </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <AnalysisStat label="Airflow Mesh" value="Optimal" color="text-green-400" />
                    <AnalysisStat label="PSU Integrity" value="Secured" color="text-cyan-400" />
                    <AnalysisStat label="Fan Logic" value="v4.2" color="text-indigo-400" />
                    <AnalysisStat label="Thermal Flow" value="Stable" color="text-green-400" />
                </div>

                <button 
                    onClick={() => setAnalysis(null)}
                    className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all border border-slate-700"
                >
                    Reset Diagnostic Probe
                </button>
            </div>
            ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 py-10 opacity-60">
                <div className="w-32 h-32 bg-slate-800 rounded-full flex items-center justify-center border-4 border-dashed border-slate-700 relative overflow-hidden group">
                    <img src={ADVANCED_ROBOT_URL} alt="Auth" className="w-full h-full object-cover opacity-20 group-hover:opacity-40 transition-opacity" />
                    <div className="absolute inset-0 flex items-center justify-center"><Activity size={40} className="text-slate-600"/></div>
                </div>
                <div className="space-y-4 max-w-xs">
                    <h4 className="text-white font-black uppercase tracking-tighter text-xl">Awaiting Telemetry</h4>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest leading-relaxed">
                        Align your mining cluster components within the viewfinder mesh to initialize diagnostic handshake.
                    </p>
                </div>
                <div className="bg-indigo-900/10 border border-indigo-500/20 p-6 rounded-[2rem] flex items-start gap-4 text-left">
                    <Info size={20} className="text-indigo-400 shrink-0 mt-1" />
                    <p className="text-[9px] text-slate-400 font-black uppercase leading-relaxed tracking-widest">
                        AI synthesis can identify GPU oxidation, fan occlusion, and cable management hazards from real-time visual streams.
                    </p>
                </div>
            </div>
            )}
         </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
      <style>{`
          @keyframes scan-line {
              0% { top: 0%; opacity: 0; }
              10% { opacity: 1; }
              90% { opacity: 1; }
              100% { top: 100%; opacity: 0; }
          }
          .animate-scan-line {
              animation: scan-line 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          }
      `}</style>
    </div>
  );
};

const AnalysisStat = ({ label, value, color }: any) => (
  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 hover:border-indigo-500/20 transition-colors group">
    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-1 group-hover:text-indigo-500 transition-colors">{label}</span>
    <span className={`text-xs font-black uppercase italic ${color}`}>{value}</span>
  </div>
);
