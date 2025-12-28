
import React, { useState, useEffect } from 'react';
import { CreditCard, ArrowRight, ShieldCheck, Globe, Zap, RefreshCw, DollarSign, Wallet, CheckCircle2, X, Landmark, AlertCircle } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { User, CoinData } from '../types';

interface FiatOnRampProps {
  user: User | null;
  selectedCoin: CoinData;
}

const SUPPORTED_FIAT = [
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'ETB', name: 'Ethiopian Birr', symbol: 'Br', flag: '🇪🇹' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
];

export const FiatOnRamp: React.FC<FiatOnRampProps> = ({ user, selectedCoin }) => {
  const { addToast } = useToast();
  const [fiatAmount, setFiatAmount] = useState('100');
  const [selectedFiat, setSelectedFiat] = useState(SUPPORTED_FIAT[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showWidget, setShowWidget] = useState(false);
  const [step, setStep] = useState<'INPUT' | 'PAYMENT' | 'SUCCESS'>('INPUT');

  const cryptoOutput = (parseFloat(fiatAmount || '0') / (selectedFiat.code === 'ETB' ? selectedCoin.price * 118.5 : selectedCoin.price)).toFixed(8);

  const handleInitialize = () => {
    if (!fiatAmount || parseFloat(fiatAmount) <= 0) {
      addToast("Invalid Amount", "Please enter a valid fiat quantity.", "error");
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowWidget(true);
      setStep('PAYMENT');
    }, 1200);
  };

  const handleCompletePurchase = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep('SUCCESS');
      addToast("Asset Acquired", `${cryptoOutput} ${selectedCoin.symbol} linked to your vault.`, "success");
    }, 3000);
  };

  return (
    <div className="p-8 space-y-10 animate-in fade-in duration-700 h-full overflow-y-auto no-scrollbar pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-10">
        <div>
          <h2 className="text-4xl font-black text-white flex items-center gap-4 uppercase tracking-tighter italic">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg border border-indigo-400/30">
              <Landmark className="text-white" size={28} />
            </div>
            Fiat On-Ramp
          </h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-3 text-hibernate">Direct Liquidity Injection :: Protocol v5.2</p>
        </div>
        <div className="flex items-center gap-4 bg-slate-900/80 px-6 py-3 rounded-2xl border border-white/5 shadow-xl">
           <div className="flex flex-col items-end">
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Linked Node</span>
              <span className="text-indigo-400 font-mono text-[10px] font-black truncate max-w-[120px]">{user?.email}</span>
           </div>
           <ShieldCheck className="text-emerald-500" size={20} />
        </div>
      </div>

      {step !== 'SUCCESS' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-6xl mx-auto">
          <div className="lg:col-span-7 bg-slate-900/40 backdrop-blur-3xl border border-slate-800 rounded-[3rem] p-10 space-y-10 glass-shadow relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
              <CreditCard size={250} className="text-indigo-500" />
            </div>

            <div className="relative z-10 space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2">I want to spend</label>
                <div className="flex gap-4">
                  <div className="relative flex-1 group">
                    <input 
                      type="number" 
                      value={fiatAmount}
                      onChange={(e) => setFiatAmount(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-[2rem] p-8 text-white font-mono text-4xl font-black focus:outline-none focus:border-indigo-500 transition-all shadow-inner"
                      placeholder="0.00"
                    />
                    <div className="absolute right-8 top-1/2 -translate-y-1/2 flex items-center gap-3">
                        <select 
                          value={selectedFiat.code}
                          onChange={(e) => setSelectedFiat(SUPPORTED_FIAT.find(f => f.code === e.target.value) || SUPPORTED_FIAT[0])}
                          className="bg-slate-900 text-white font-black text-xl border-none outline-none cursor-pointer p-2 rounded-xl"
                        >
                          {SUPPORTED_FIAT.map(f => <option key={f.code} value={f.code}>{f.code}</option>)}
                        </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center -my-6 relative z-20">
                <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-[0_0_30px_rgba(79,70,229,0.5)] border-4 border-slate-950">
                  <ArrowRight className="rotate-90" size={24} />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2">Estimated {selectedCoin.symbol} Output</label>
                <div className="bg-slate-950 border border-slate-800 rounded-[2rem] p-8 relative group overflow-hidden">
                   <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                   <div className="text-indigo-400 font-mono text-4xl font-black italic tracking-tighter text-smart-shimmer">
                    {cryptoOutput}
                   </div>
                   <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2">To linked wallet: {user?.id.slice(-8).toUpperCase()}</div>
                </div>
              </div>

              <div className="bg-indigo-900/10 border border-indigo-500/20 p-6 rounded-[2rem] space-y-4">
                <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <span>Exchange Rate</span>
                  <span className="text-white">1 {selectedCoin.symbol} ≈ {selectedFiat.symbol}{(selectedFiat.code === 'ETB' ? selectedCoin.price * 118.5 : selectedCoin.price).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <span>Network Fee</span>
                  <span className="text-emerald-400">Zero (Mining Promo)</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <span>Processing Time</span>
                  <span className="text-white">~5 Minutes</span>
                </div>
              </div>

              <button 
                onClick={handleInitialize}
                disabled={isProcessing}
                className="w-full py-7 rounded-[2.5rem] bg-white text-slate-950 font-black text-xl uppercase tracking-[0.4em] shadow-2xl hover:bg-indigo-50 transition-all flex items-center justify-center gap-4 active:scale-95 group border-b-8 border-slate-300"
              >
                {isProcessing ? <RefreshCw className="animate-spin" size={28} /> : <Zap size={28} className="group-hover:scale-110 transition-transform" />}
                Initiate Secure Purchase
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-8">
            <div className="bg-slate-900/60 border border-slate-800 rounded-[2.5rem] p-8 space-y-8 glass-shadow">
               <h3 className="text-white font-black uppercase text-xs tracking-widest border-b border-white/5 pb-4">Security Protocol</h3>
               <div className="space-y-6">
                  <SecurityFeature icon={<ShieldCheck className="text-emerald-400" />} title="PCI-DSS Compliant" desc="Military grade encryption for all card data." />
                  <SecurityFeature icon={<Globe className="text-indigo-400" />} title="Global Gateway" desc="Supporting 150+ countries and local regional banks." />
                  <SecurityFeature icon={<Landmark className="text-rose-400" />} title="Direct IBAN/SWIFT" desc="Linked directly to TigApp liquidity nodes." />
               </div>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 rounded-[2.5rem] p-8 flex gap-5 items-start">
               <AlertCircle size={32} className="text-amber-500 shrink-0 mt-1" />
               <div className="space-y-2">
                  <h4 className="text-white font-black uppercase text-xs tracking-widest">Identity Sync Required</h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed font-bold uppercase tracking-widest">
                    Purchases exceeding $100.00 require a verified <b>Identity Center</b> handshake. Unverified nodes are limited to $50/daily.
                  </p>
               </div>
            </div>
          </div>
        </div>
      ) : (
        /* SUCCESS SCREEN */
        <div className="max-w-xl mx-auto py-20 text-center space-y-10 animate-in zoom-in duration-700">
           <div className="relative w-40 h-40 mx-auto">
              <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping"></div>
              <div className="relative w-full h-full bg-emerald-600 rounded-full flex items-center justify-center text-white shadow-[0_0_60px_rgba(16,185,129,0.5)]">
                 <CheckCircle2 size={80} />
              </div>
           </div>
           <div className="space-y-4">
              <h3 className="text-5xl font-black text-white uppercase tracking-tighter italic">Handshake Finalized</h3>
              <p className="text-slate-400 text-lg font-medium leading-relaxed">
                The node has been credited with <span className="text-emerald-400 font-black">{cryptoOutput} {selectedCoin.symbol}</span>. 
                Your hashrate potential has been updated.
              </p>
           </div>
           <div className="flex gap-4">
              <button 
                onClick={() => setStep('INPUT')}
                className="flex-1 py-5 bg-slate-900 border border-slate-800 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white"
              >
                Purchase More
              </button>
              <button className="flex-[2] py-5 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-900/40">
                View Ledger
              </button>
           </div>
        </div>
      )}

      {/* SIMULATED PROVIDER WIDGET */}
      {showWidget && step === 'PAYMENT' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 animate-in fade-in">
           <div className="bg-white text-slate-900 w-full max-w-md rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)] relative">
              <button 
                onClick={() => setShowWidget(false)}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition-colors"
              >
                <X size={24} />
              </button>

              <div className="p-10 border-b border-slate-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                  <Landmark size={28} />
                </div>
                <div>
                   <h3 className="text-xl font-black uppercase tracking-tighter italic">TigApp On-Ramp</h3>
                   <p className="text-slate-400 text-[8px] font-black uppercase tracking-[0.3em]">Institutional Liquidity Provider</p>
                </div>
              </div>

              <div className="p-10 space-y-10">
                 <div className="space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       <span>Total to Pay</span>
                       <span className="text-indigo-600 text-lg">{selectedFiat.symbol}{parseFloat(fiatAmount).toLocaleString()} {selectedFiat.code}</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-4">
                       <div className="space-y-2">
                          <label className="text-[8px] font-black text-slate-400 uppercase">Card Holder</label>
                          <input type="text" readOnly value={user?.name} className="w-full bg-transparent border-none font-bold text-sm outline-none" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[8px] font-black text-slate-400 uppercase">Card Number</label>
                          <input type="text" placeholder="XXXX XXXX XXXX XXXX" className="w-full bg-transparent border-none font-mono text-sm outline-none" />
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[8px] font-black text-slate-400 uppercase">Expiry</label>
                            <input type="text" placeholder="MM/YY" className="w-full bg-transparent border-none font-mono text-sm outline-none" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[8px] font-black text-slate-400 uppercase">CVV</label>
                            <input type="text" placeholder="XXX" className="w-full bg-transparent border-none font-mono text-sm outline-none" />
                          </div>
                       </div>
                    </div>
                 </div>

                 <button 
                  onClick={() => { handleCompletePurchase(); setShowWidget(false); }}
                  className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-indigo-900/20 transition-all uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-3"
                 >
                    {isProcessing ? <RefreshCw className="animate-spin" /> : <ShieldCheck size={20} />}
                    {isProcessing ? 'Processing Transaction...' : 'Confirm Handshake'}
                 </button>

                 <div className="flex items-center justify-center gap-2 opacity-30 text-[8px] font-black uppercase tracking-widest">
                    <Lock size={10} /> 256-Bit SSL Encryption Secured
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const SecurityFeature = ({ icon, title, desc }: any) => (
  <div className="flex gap-4 items-start group">
    <div className="p-3 bg-slate-950 rounded-xl border border-white/5 transition-transform group-hover:scale-110">
      {icon}
    </div>
    <div>
      <h4 className="text-white font-black uppercase text-xs tracking-widest mb-1">{title}</h4>
      <p className="text-slate-500 text-[10px] font-bold leading-relaxed">{desc}</p>
    </div>
  </div>
);
