
import React, { useState, useEffect, useRef } from 'react';
import { Landmark, ArrowRightLeft, Upload, Download, CheckCircle, AlertCircle, History, ChevronDown, Building2, CreditCard, Globe, Wifi, Shield, TrendingUp, DollarSign, Smartphone, QrCode, RefreshCw, Server, Activity, Lock, AlertTriangle, Check, FileText, Paperclip, ScanFace, Camera, CameraOff, Eye, EyeOff, X, CheckCircle2, Wallet, Briefcase, ShieldAlert, Loader2, ShieldCheck, ArrowRight, Zap } from 'lucide-react';
import { CoinData, TransactionType, User } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';

interface BankIntegrationProps {
  balance: number;
  selectedCoin: CoinData;
  currentUser: User | null;
  onTransaction: (amount: number, type: TransactionType, method: string) => void;
}

const ETHIOPIAN_BANKS = [
  { id: 'cbe', name: 'Commercial Bank of Ethiopia', color: '#8A1538', accent: '#F1B434', logo: 'CBE', description: 'Institutional standard for regional payouts.' },
  { id: 'telebirr', name: 'Telebirr (Ethio Telecom)', color: '#00AEEF', accent: '#89D3F3', logo: 'TB', isMobileWallet: true, description: 'Instant mobile liquidity for digital assets.' },
  { id: 'awash', name: 'Awash Bank', color: '#005596', accent: '#F68D2E', logo: 'AW' },
  { id: 'dashen', name: 'Dashen Bank', color: '#002E5F', accent: '#FDB913', logo: 'DB' },
  { id: 'abyssinia', name: 'Bank of Abyssinia', color: '#D4AF37', accent: '#000000', logo: 'BA' },
  { id: 'hibret', name: 'Hibret Bank', color: '#003366', accent: '#FFFFFF', logo: 'HB' },
];

export const BankIntegration: React.FC<BankIntegrationProps> = ({ balance, selectedCoin, currentUser, onTransaction }) => {
  const { t } = useLanguage();
  const { addToast } = useToast();
  
  const [bankingRegion, setBankingRegion] = useState<'LOCAL' | 'INTL'>('LOCAL');
  const [selectedBank, setSelectedBank] = useState(ETHIOPIAN_BANKS[0]); 
  const [showFaceScanVerification, setShowFaceScanVerification] = useState(false);
  const [faceScanStatus, setFaceScanStatus] = useState<'IDLE' | 'CONNECTING' | 'SCANNING' | 'SUCCESS' | 'FAILED'>('IDLE');
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mode, setMode] = useState<TransactionType>('WITHDRAW');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState<'IDLE' | 'PROCESSING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [errorMsg, setErrorMsg] = useState('');
  const [etbRate, setEtbRate] = useState(118.45); // Current simulated rate

  const isVerified = currentUser?.verificationStatus === 'verified';

  const getCryptoEquivalent = () => {
    const inputAmount = parseFloat(amount);
    if (isNaN(inputAmount)) return 0;
    const usdAmount = bankingRegion === 'LOCAL' ? inputAmount / etbRate : inputAmount;
    return usdAmount / selectedCoin.price;
  };

  const startFaceScan = async () => {
      setShowFaceScanVerification(true);
      setFaceScanStatus('CONNECTING');
      try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            await videoRef.current.play();
          }
          setFaceScanStatus('SCANNING');
          setTimeout(() => {
              setFaceScanStatus('SUCCESS');
              stream.getTracks().forEach(track => track.stop());
              setTimeout(() => {
                  setShowFaceScanVerification(false);
                  processTransaction();
              }, 1200);
          }, 3000);
      } catch (err) {
          setFaceScanStatus('FAILED');
          addToast("Biometric Error", "Camera access is mandatory for secure regional payouts.", "error");
      }
  };

  const processTransaction = () => {
      setStatus('PROCESSING');
      setTimeout(() => {
        onTransaction(getCryptoEquivalent(), mode, selectedBank.name);
        setStatus('SUCCESS');
        addToast("Handshake Complete", `${amount} ${bankingRegion === 'LOCAL' ? 'ETB' : 'USD'} dispatched to ${selectedBank.name}.`, "success");
        setTimeout(() => { setStatus('IDLE'); setAmount(''); }, 3000);
      }, 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (mode === 'WITHDRAW' && !isVerified) {
        setErrorMsg("Regional Identity Verification Required. Complete biometric scan in Identity Center.");
        addToast("Action Blocked", "Unverified accounts cannot withdraw fiat.", "warning");
        return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setErrorMsg('Please enter a valid currency amount.');
      return;
    }

    if (mode === 'WITHDRAW') {
        startFaceScan();
        return;
    }

    processTransaction();
  };

  return (
    <div className="p-8 space-y-10 animate-in fade-in duration-700 h-full overflow-y-auto scrollbar-thin">
      
      {/* FACE SCAN OVERLAY */}
      {showFaceScanVerification && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 animate-in fade-in">
              <div className="bg-slate-900 border border-slate-800 rounded-[3rem] w-full max-w-md overflow-hidden relative shadow-[0_0_150px_rgba(0,0,0,1)]">
                  <div className="p-10 text-center space-y-8">
                      <div className="relative w-72 h-72 mx-auto rounded-full overflow-hidden border-4 border-indigo-500/30 bg-black group">
                          {faceScanStatus === 'CONNECTING' && (
                              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                                  <Loader2 className="text-indigo-500 animate-spin" size={40} />
                                  <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">Linking Optical Sensor...</span>
                              </div>
                          )}
                          <video ref={videoRef} autoPlay playsInline muted className={`w-full h-full object-cover transform scale-x-[-1] transition-opacity duration-700 ${faceScanStatus === 'SCANNING' ? 'opacity-100' : 'opacity-0'}`} />
                          
                          {faceScanStatus === 'SCANNING' && (
                              <div className="absolute inset-0 pointer-events-none">
                                  <div className="absolute top-0 w-full h-[2px] bg-indigo-500 animate-scan-line shadow-[0_0_20px_#6366f1]"></div>
                                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-60 border-2 border-indigo-500/40 rounded-[4rem]"></div>
                              </div>
                          )}

                          {faceScanStatus === 'SUCCESS' && (
                              <div className="absolute inset-0 bg-emerald-600 flex flex-col items-center justify-center animate-in zoom-in">
                                  <CheckCircle2 size={80} className="text-white mb-4" />
                                  <span className="text-white font-black uppercase text-xs tracking-widest">Biometric Match</span>
                              </div>
                          )}
                      </div>

                      <div className="space-y-3">
                          <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">Regional Payout Handshake</h3>
                          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest leading-relaxed">Secure identification mandatory for Ethiopian banking settlement.</p>
                      </div>

                      <button onClick={() => { setShowFaceScanVerification(false); videoRef.current?.srcObject && (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop()); }} className="text-slate-600 hover:text-white text-[10px] font-black uppercase tracking-[0.4em] transition-colors">Abort Procedure</button>
                  </div>
              </div>
          </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-white/5 pb-10">
        <div>
            <h2 className="text-4xl font-black text-white flex items-center gap-4 uppercase tracking-tighter italic">
                <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg border border-red-400/30">
                    <Building2 className="text-white" size={28} />
                </div>
                Local Banking Gateway
            </h2>
            <p className="text-slate-500 text-xs font-black uppercase tracking-[0.4em] mt-3 text-hibernate">Direct Settlement :: 🇪🇹 Ethiopia Node v4.2</p>
        </div>
        <div className="flex bg-slate-900/80 backdrop-blur-md p-1.5 rounded-[1.5rem] border border-slate-800 shadow-xl">
           <button onClick={() => setBankingRegion('LOCAL')} className={`px-8 py-3 rounded-2xl font-black text-[10px] flex items-center gap-2 transition-all uppercase tracking-widest ${bankingRegion === 'LOCAL' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>
              <Globe size={14} /> Regional Banks
           </button>
           <button onClick={() => setBankingRegion('INTL')} className={`px-8 py-3 rounded-2xl font-black text-[10px] flex items-center gap-2 transition-all uppercase tracking-widest ${bankingRegion === 'INTL' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>
              <CreditCard size={14} /> Global Cards
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[3rem] p-10 space-y-10 glass-shadow shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
             <Landmark size={200} className="text-indigo-500" />
          </div>
          
          <div className="flex bg-slate-950 p-1.5 rounded-[2rem] border border-slate-800 relative z-10">
            <button onClick={() => setMode('WITHDRAW')} className={`flex-1 py-5 rounded-[1.75rem] font-black uppercase tracking-[0.3em] text-[11px] flex items-center justify-center gap-3 transition-all ${mode === 'WITHDRAW' ? 'bg-red-600 text-white shadow-2xl shadow-red-900/40' : 'text-slate-500 hover:text-slate-300'}`}><Download size={20}/> Withdraw Funds</button>
            <button onClick={() => setMode('DEPOSIT')} className={`flex-1 py-5 rounded-[1.75rem] font-black uppercase tracking-[0.3em] text-[11px] flex items-center justify-center gap-3 transition-all ${mode === 'DEPOSIT' ? 'bg-emerald-600 text-white shadow-2xl shadow-emerald-900/40' : 'text-slate-500 hover:text-slate-300'}`}><Upload size={20}/> Deposit Logic</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
            {errorMsg && <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-6 rounded-3xl flex items-center gap-4 text-sm font-bold animate-in slide-in-from-top-4"><AlertTriangle size={24} /> {errorMsg}</div>}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] block ml-2">Target Institution</label>
                   <div className="grid grid-cols-1 gap-3">
                      {ETHIOPIAN_BANKS.slice(0, 2).map(bank => (
                          <button 
                            key={bank.id}
                            type="button" 
                            onClick={() => setSelectedBank(bank)}
                            className={`w-full bg-slate-950 border p-5 rounded-[2rem] flex items-center justify-between group transition-all ${selectedBank.id === bank.id ? 'border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.2)]' : 'border-slate-800 hover:border-slate-600'}`}
                          >
                            <div className="flex items-center gap-5">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-white text-xl shadow-lg`} style={{ backgroundColor: bank.color }}>
                                    {bank.logo}
                                </div>
                                <div className="text-left">
                                    <div className="text-white font-black text-xs uppercase tracking-tight">{bank.name}</div>
                                    <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">{bank.isMobileWallet ? 'Mobile Gateway' : 'Institutional Link'}</div>
                                </div>
                            </div>
                            {selectedBank.id === bank.id && <CheckCircle2 size={20} className="text-indigo-400" />}
                          </button>
                      ))}
                   </div>
                </div>
                
                <div className="space-y-4">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] block ml-2">Transfer Parameters</label>
                   <div className="relative group">
                      <div className="absolute inset-0 bg-indigo-500/5 rounded-[2rem] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                      <input 
                        type="number" 
                        step="0.01" 
                        value={amount} 
                        onChange={e => setAmount(e.target.value)} 
                        placeholder="0.00" 
                        className="w-full bg-slate-950 border border-slate-800 rounded-[2rem] p-8 text-white font-mono text-4xl font-black focus:outline-none focus:border-indigo-500 transition-all shadow-inner relative z-10" 
                      />
                      <span className="absolute right-8 top-1/2 -translate-y-1/2 font-black text-slate-600 text-2xl uppercase tracking-tighter z-10">{bankingRegion === 'LOCAL' ? 'ETB' : 'USD'}</span>
                   </div>
                   <div className="flex justify-between items-center px-4">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Rate: 1 USD = {etbRate} ETB</span>
                      {/* Fixed: Added missing Zap icon import from lucide-react */}
                      <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest italic flex items-center gap-1.5 animate-pulse"><Zap size={10}/> Fast Link Enabled</span>
                   </div>
                </div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 group hover:border-indigo-500/30 transition-all">
                <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-indigo-600/10 rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                        <ArrowRightLeft size={28} />
                    </div>
                    <div>
                        <h4 className="text-white font-black text-sm uppercase tracking-tight italic">Synthesis Summary</h4>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Converting assets to {selectedBank.id.toUpperCase()} payout nodes.</p>
                    </div>
                </div>
                <div className="text-center md:text-right">
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Estimated Asset Reduction</div>
                    <div className="text-2xl font-black text-white font-mono text-smart-shimmer">-{getCryptoEquivalent().toFixed(8)} {selectedCoin.symbol}</div>
                </div>
            </div>

            <button type="submit" disabled={status === 'PROCESSING'} className="w-full py-7 rounded-[2.5rem] font-black text-xl bg-indigo-600 text-white hover:bg-indigo-500 transition-all flex items-center justify-center gap-5 shadow-[0_20px_50px_rgba(79,70,229,0.4)] active:scale-[0.98] border-b-4 border-indigo-900 group">
                {status === 'PROCESSING' ? <RefreshCw className="animate-spin" size={28} /> : <><ShieldCheck size={28}/> {mode === 'WITHDRAW' ? 'AUTHENTICATE & SETTLE' : 'INITIALIZE LOCAL GATEWAY'}</>}
            </button>
          </form>
        </div>

        <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] p-8 glass-shadow shadow-2xl group hover:border-indigo-500/20 transition-all duration-500">
               <div className="flex items-center gap-5 mb-8">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 ${isVerified ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.3)]'}`}>
                     {isVerified ? <ShieldCheck size={32} /> : <ShieldAlert size={32} />}
                  </div>
                  <div>
                     <h4 className="text-white font-black text-sm uppercase italic tracking-tighter">Handshake Standing</h4>
                     <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${isVerified ? 'text-emerald-500' : 'text-red-500'}`}>
                        {isVerified ? 'Profile Verified' : 'Compliance Pending'}
                     </p>
                  </div>
               </div>
               <p className="text-xs text-slate-400 leading-relaxed mb-8 font-medium italic">
                   "To secure the TigApp ecosystem, all local currency withdrawals exceeding $50.00 require an active biometric liveness anchor to prevent identity theft."
               </p>
               {!isVerified && (
                  <button className="w-full py-4 bg-slate-950 border border-slate-800 text-indigo-400 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-indigo-600 hover:text-white transition-all group shadow-inner">
                     Establish Identity <ArrowRight size={14} className="inline ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
               )}
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 space-y-6 relative overflow-hidden group">
               <div className="absolute inset-0 bg-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <div className="flex items-center gap-4 relative z-10">
                  <div className="p-3 bg-red-600/10 rounded-xl text-red-500 border border-red-500/20">
                     <AlertCircle size={24} />
                  </div>
                  <h4 className="text-white font-black uppercase text-xs tracking-widest">Regional Note</h4>
               </div>
               <p className="text-[10px] text-slate-500 leading-relaxed font-bold uppercase tracking-widest relative z-10">
                  Transfers to CBE and Telebirr endpoints are processed through specialized liquidity pools. Average synchronization time: <span className="text-white">2 - 15 minutes</span>.
               </p>
            </div>
        </div>
      </div>
      <style>{`
          @keyframes scan-line {
              0% { top: 0%; opacity: 0; }
              10% { opacity: 1; }
              90% { opacity: 1; }
              100% { top: 100%; opacity: 0; }
          }
          .animate-scan-line {
              animation: scan-line 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          }
      `}</style>
    </div>
  );
};
