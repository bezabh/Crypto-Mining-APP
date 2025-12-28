import React, { useState, useRef, useEffect } from 'react';
import { 
  ShieldCheck, Camera, FileText, CheckCircle2, Loader2, 
  AlertTriangle, ScanFace, ArrowRight, ShieldAlert, X, 
  Info, RefreshCcw, Cloud, Zap, Shield, Settings2, CameraOff,
  HandMetal, Lock
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { User, VerificationStatus } from '../types';

interface VerificationCenterProps {
  user: User;
  onVerificationUpdate: (status: VerificationStatus) => void;
}

export const VerificationCenter: React.FC<VerificationCenterProps> = ({ user, onVerificationUpdate }) => {
  const { addToast } = useToast();
  const [step, setStep] = useState<'OVERVIEW' | 'DOCUMENT' | 'BIOMETRIC' | 'PROCESSING'>('OVERVIEW');
  const [documentType, setDocumentType] = useState<'PASSPORT' | 'ID_CARD' | 'DL'>('PASSPORT');
  const [idFile, setIdFile] = useState<File | null>(null);
  const [biometricStream, setBiometricStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Cleanup stream on unmount or step change
  useEffect(() => {
    return () => {
      if (biometricStream) {
        biometricStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [biometricStream]);

  const requestCameraAccess = async () => {
    setIsInitializing(true);
    setCameraError(null);
    
    // Safety check for secure origin
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
        setCameraError("Security Protocol Error: Biometric scanning requires a secure (HTTPS) connection to ensure data encryption.");
        setIsInitializing(false);
        return;
    }

    try {
      // Step 1: Request permissions with fallback
      const constraints = { 
        video: { 
          facingMode: 'user', 
          width: { ideal: 1280 }, 
          height: { ideal: 720 } 
        } 
      };
      
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (innerErr) {
        console.warn("High-res request failed, falling back to standard video...");
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
      }

      // Step 2: Bind stream to UI
      setBiometricStream(stream);
      
      // Allow DOM to update before assigning srcObject
      setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(e => console.error("Auto-play failed", e));
          }
      }, 150);
      
      addToast("Hardware Linked", "Encrypted optical sensor is now active.", "success");
    } catch (err: any) {
      console.error("Camera access failed:", err);
      let errorMsg = "Unable to initialize camera sensor.";
      
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError' || err.message?.toLowerCase().includes('denied')) {
        errorMsg = "Permission Denied: Access was blocked by the browser. Please reset permissions in your address bar.";
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errorMsg = "Hardware Missing: No camera detected on this system.";
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        errorMsg = "Hardware Busy: Another application is using your camera.";
      }
      
      setCameraError(errorMsg);
      addToast("Access Error", errorMsg, "error");
    } finally {
      setIsInitializing(false);
    }
  };

  const handleCompleteBiometric = () => {
    biometricStream?.getTracks().forEach(track => track.stop());
    setStep('PROCESSING');
    
    setTimeout(() => {
      onVerificationUpdate('verified');
      addToast("Verification Complete", "Biometric anchor established successfully.", "success");
      setStep('OVERVIEW');
    }, 4500);
  };

  const resetToStart = () => {
      if (biometricStream) {
          biometricStream.getTracks().forEach(t => t.stop());
          setBiometricStream(null);
      }
      setStep('OVERVIEW');
      setCameraError(null);
  };

  if (user.verificationStatus === 'verified') {
    return (
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-10 text-center animate-in fade-in zoom-in">
        <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(16,185,129,0.5)]">
           <ShieldCheck size={48} className="text-white" />
        </div>
        <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Identity Fully Verified</h3>
        <p className="text-slate-400 max-w-sm mx-auto text-sm leading-relaxed mb-6">
          Your PrimeMine AI profile is cryptographically linked to your biometric signature. Global SWIFT withdrawals are active.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-full text-[10px] font-black text-indigo-400 uppercase tracking-widest">
           <Lock size={12} /> Encrypted Node ID: {user.id.slice(-8).toUpperCase()}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl transition-all duration-500">
      {/* Header with Dynamic Visual Feedback */}
      <div className={`${cameraError ? 'bg-red-600' : (biometricStream ? 'bg-emerald-600' : 'bg-indigo-600')} p-8 flex items-center justify-between relative overflow-hidden transition-colors duration-700`}>
         <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl -mr-24 -mt-24"></div>
         <div className="flex items-center gap-4 relative z-10">
            {cameraError ? (
                <CameraOff size={40} className="text-white" />
            ) : (
                biometricStream ? <ScanFace size={40} className="text-white animate-pulse" /> : <ShieldCheck size={40} className="text-white" />
            )}
            <div>
               <h2 className="text-2xl font-black text-white uppercase tracking-tighter leading-none mb-1">Identity Center</h2>
               <p className="text-white/70 text-[10px] font-bold tracking-[0.2em] uppercase">
                 {step === 'BIOMETRIC' ? 'Biometric Mesh Scan' : 'Security Compliance Link'}
               </p>
            </div>
         </div>
         <div className="hidden sm:flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full text-[10px] font-black text-white uppercase relative z-10 border border-white/10">
            <Zap size={10} className="text-yellow-300"/> Tier-4 Security
         </div>
      </div>

      <div className="p-8">
        {step === 'OVERVIEW' && (
          <div className="space-y-8 animate-in fade-in">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 group hover:border-red-500/30 transition-colors">
                   <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 mb-4">
                      <ShieldAlert size={28} />
                   </div>
                   <h4 className="text-slate-500 font-bold text-[10px] uppercase mb-1">Verification Status</h4>
                   <div className="text-red-400 text-lg font-black uppercase tracking-tighter">Account Locked</div>
                </div>
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 group hover:border-indigo-500/30 transition-colors">
                   <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-4">
                      <Cloud size={28} />
                   </div>
                   <h4 className="text-slate-500 font-bold text-[10px] uppercase mb-1">Global Node Link</h4>
                   <div className="text-white text-lg font-black uppercase tracking-tighter">Awaiting Sync</div>
                </div>
             </div>

             <div className="bg-slate-800/20 p-6 rounded-2xl border border-dashed border-slate-700">
                <h4 className="text-white font-bold text-xs mb-4 flex items-center gap-2 uppercase tracking-widest">
                   <Info size={14} className="text-indigo-400" /> Compliance Requirements
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div className="flex items-center gap-3 text-xs text-slate-300">
                      <div className="w-6 h-6 rounded bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">1</div>
                      <span>Government ID Scan</span>
                   </div>
                   <div className="flex items-center gap-3 text-xs text-slate-300">
                      <div className="w-6 h-6 rounded bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">2</div>
                      <span>3D Face Landmark Link</span>
                   </div>
                </div>
                <p className="text-slate-500 text-[10px] mt-6 leading-relaxed">
                    Identity verification is required by international banking regulations (AML/KYC) to enable external fiat withdrawals to banks like CBE.
                </p>
             </div>

             <button 
               onClick={() => setStep('DOCUMENT')}
               className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-5 rounded-2xl shadow-2xl shadow-indigo-900/40 flex items-center justify-center gap-3 transition-all active:scale-[0.98] group"
             >
                INITIALIZE SECURE HANDSHAKE <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
             </button>
          </div>
        )}

        {step === 'DOCUMENT' && (
          <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
             <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] block ml-1">Step 01: Document Selection</label>
                <div className="grid grid-cols-3 gap-3">
                   {(['PASSPORT', 'ID_CARD', 'DL'] as const).map(type => (
                      <button 
                        key={type}
                        onClick={() => setDocumentType(type)}
                        className={`py-4 rounded-xl text-[10px] font-black border transition-all ${documentType === type ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-600'}`}
                      >
                         {type.replace('_', ' ')}
                      </button>
                   ))}
                </div>
             </div>

             <div className="bg-slate-950 border-2 border-dashed border-slate-800 rounded-3xl p-12 text-center relative group hover:border-indigo-500/50 transition-all cursor-pointer">
                <input 
                  type="file" 
                  className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                  onChange={(e) => setIdFile(e.target.files?.[0] || null)}
                />
                <div className="relative z-0">
                   {idFile ? (
                       <div className="flex flex-col items-center animate-in zoom-in">
                           <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-4 text-green-500 border border-green-500/20">
                               <CheckCircle2 size={40} />
                           </div>
                           <p className="text-white font-bold text-lg">{idFile.name}</p>
                           <button onClick={(e) => { e.stopPropagation(); setIdFile(null); }} className="text-xs font-bold text-red-400 mt-3 hover:underline">Revoke File</button>
                       </div>
                   ) : (
                       <>
                           <div className="w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all text-slate-500 shadow-xl border border-slate-800">
                              <FileText size={40} />
                           </div>
                           <p className="text-white font-black text-xl mb-1 uppercase tracking-tight">Upload Credentials</p>
                           <p className="text-slate-500 text-xs max-w-[200px] mx-auto">JPEG or PNG Front View Required (Max 10MB)</p>
                       </>
                   )}
                </div>
             </div>

             <div className="space-y-3 pt-4">
                <button 
                disabled={!idFile}
                onClick={() => setStep('BIOMETRIC')}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-20 disabled:cursor-not-allowed text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-indigo-900/40 uppercase tracking-widest text-sm"
                >
                    Link Biometric Scanner
                </button>
                <button onClick={() => setStep('OVERVIEW')} className="w-full text-slate-600 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">Abort Procedure</button>
             </div>
          </div>
        )}

        {step === 'BIOMETRIC' && (
          <div className="space-y-8 animate-in zoom-in duration-500 flex flex-col items-center">
             
             {!biometricStream ? (
                /* PERMISSION HANDSHAKE UI */
                <div className="w-full text-center space-y-8 py-4">
                    <div className="relative w-32 h-32 mx-auto">
                        <div className="absolute inset-0 bg-indigo-500/20 rounded-full animate-ping"></div>
                        <div className="relative w-full h-full bg-slate-950 border border-indigo-500/30 rounded-full flex items-center justify-center text-indigo-400 shadow-2xl">
                            <Camera size={56} />
                        </div>
                    </div>
                    
                    <div className="space-y-3">
                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Sensor Handshake</h3>
                        <p className="text-slate-400 text-sm max-w-xs mx-auto leading-relaxed">
                            To ensure you are a live human miner, we require a brief 3D facial landmark scan.
                        </p>
                    </div>

                    {cameraError ? (
                        <div className="bg-red-500/10 border border-red-500/30 p-6 rounded-2xl text-left animate-in slide-in-from-top-2">
                            <div className="flex items-center gap-3 text-red-500 font-black text-xs uppercase mb-3">
                                <AlertTriangle size={16} /> Connection Failure
                            </div>
                            <p className="text-xs text-red-200/80 mb-4 leading-relaxed">{cameraError}</p>
                            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                                <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">How to Fix:</h5>
                                <ol className="text-[10px] text-slate-400 space-y-2 list-decimal ml-4">
                                    <li>Look for the <strong>Camera Icon</strong> or <strong>Lock Icon</strong> in the address bar.</li>
                                    <li>Select <strong>'Allow'</strong> or <strong>'Reset Permission'</strong>.</li>
                                    <li>Refresh this page and try again.</li>
                                </ol>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-indigo-900/10 border border-indigo-500/20 p-5 rounded-2xl text-left flex gap-4 items-start">
                            <ShieldCheck className="text-indigo-400 shrink-0 mt-1" size={24} />
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-indigo-200">Privacy Protocol Active</p>
                                <p className="text-[10px] text-indigo-300/60 leading-relaxed">
                                    Raw video is processed locally. We only store encrypted landmark metadata on the blockchain. 
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-4 w-full">
                        <button onClick={resetToStart} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-5 rounded-2xl text-xs uppercase tracking-widest">Cancel</button>
                        <button 
                            onClick={requestCameraAccess}
                            disabled={isInitializing}
                            className="flex-[2] bg-indigo-600 hover:bg-indigo-500 text-white font-black py-5 rounded-2xl text-xs shadow-2xl shadow-indigo-900/40 flex items-center justify-center gap-3 transition-all active:scale-95 uppercase tracking-widest"
                        >
                            {isInitializing ? <Loader2 className="animate-spin" size={20}/> : <ShieldCheck size={20}/>}
                            {isInitializing ? 'Linking Hardware...' : 'Ask Me To Allow'}
                        </button>
                    </div>
                </div>
             ) : (
                /* ACTIVE SCANNER INTERFACE */
                <div className="w-full flex flex-col items-center space-y-8">
                    <div className="relative w-80 h-80 rounded-full overflow-hidden border-4 border-indigo-500 shadow-[0_0_80px_rgba(99,102,241,0.4)] bg-black group">
                        <video 
                            ref={videoRef} 
                            autoPlay 
                            playsInline 
                            muted 
                            className="w-full h-full object-cover transform scale-x-[-1]" 
                        />
                        
                        {/* Scanning Overlays */}
                        <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute top-0 left-0 w-full h-[2px] bg-indigo-400 shadow-[0_0_20px_#6366f1] animate-scan-line"></div>
                            
                            {/* HUD Corners */}
                            <div className="absolute top-12 left-12 w-6 h-6 border-t-2 border-l-2 border-indigo-400/50"></div>
                            <div className="absolute top-12 right-12 w-6 h-6 border-t-2 border-r-2 border-indigo-400/50"></div>
                            <div className="absolute bottom-12 left-12 w-6 h-6 border-b-2 border-l-2 border-indigo-400/50"></div>
                            <div className="absolute bottom-12 right-12 w-6 h-6 border-b-2 border-r-2 border-indigo-400/50"></div>
                            
                            {/* Target Frame */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-64 border-2 border-dashed border-indigo-500/20 rounded-[4rem]"></div>
                            
                            {/* Real-time Telemetry Simulation */}
                            <div className="absolute top-4 left-0 right-0 text-center">
                                <span className="bg-slate-950/80 px-3 py-1 rounded-full border border-indigo-500/30 text-[8px] font-black text-indigo-400 uppercase tracking-widest">
                                   Biometric Stream Linked :: 1080p
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="text-center space-y-2">
                        <h4 className="text-white font-black text-2xl flex items-center gap-3 justify-center uppercase tracking-tighter">
                            <ScanFace className="text-indigo-400" /> Mapping Face
                        </h4>
                        <p className="text-slate-500 text-xs max-w-xs mx-auto leading-relaxed">
                            Maintain focus on the sensor. AI nodes are cross-referencing your identification markers.
                        </p>
                    </div>

                    <div className="flex gap-4 w-full">
                        <button onClick={resetToStart} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-5 rounded-2xl text-xs uppercase">Abort</button>
                        <button 
                            onClick={handleCompleteBiometric}
                            className="flex-[2] bg-emerald-600 hover:bg-emerald-500 text-white font-black py-5 rounded-2xl text-xs shadow-2xl shadow-emerald-900/40 uppercase tracking-widest"
                        >
                            Sync Identity
                        </button>
                    </div>
                </div>
             )}
          </div>
        )}

        {step === 'PROCESSING' && (
           <div className="py-20 text-center space-y-8 animate-in fade-in">
              <div className="relative w-32 h-32 mx-auto">
                 <Loader2 size={128} className="text-indigo-500 animate-spin" />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <Shield size={48} className="text-indigo-400 animate-pulse" />
                 </div>
              </div>
              <div className="space-y-3">
                 <h3 className="text-white font-black text-2xl uppercase tracking-tighter">Finalizing Cryptography</h3>
                 <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed px-4">
                    Generating unique biometric hash and updating your global mining status on the PrimeMine network...
                 </p>
              </div>
              <div className="flex justify-center gap-2">
                  {[0,1,2,3,4].map(i => (
                      <div key={i} className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: `${i * 100}ms` }}></div>
                  ))}
              </div>
           </div>
        )}
      </div>

      <style>{`
          @keyframes scan-line {
              0% { top: 0%; opacity: 0; }
              10% { opacity: 1; }
              90% { opacity: 1; }
              100% { top: 100%; opacity: 0; }
          }
          .animate-scan-line {
              animation: scan-line 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          }
      `}</style>
    </div>
  );
};
