import React, { useState } from 'react';
import { Mail, ArrowRight, ShieldCheck, CheckCircle2, CreditCard, RefreshCw, LogOut, TrendingUp, Wallet, Star } from 'lucide-react';

export const CryptoComIntegration: React.FC = () => {
  const [step, setStep] = useState<'LOGIN' | 'MAGIC_LINK' | 'DASHBOARD'>('LOGIN');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    // Simulate API call for Magic Link
    setTimeout(() => {
      setLoading(false);
      setStep('MAGIC_LINK');
    }, 2000);
  };

  const checkMagicLink = () => {
    setLoading(true);
    // Simulate clicking the link in email
    setTimeout(() => {
      setLoading(false);
      setStep('DASHBOARD');
    }, 2000);
  };

  // Login Interface (Mimicking accounts.crypto.com)
  if (step === 'LOGIN') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] p-4 font-sans">
        <div className="w-full max-w-[480px] space-y-8">
          
          {/* Logo Area */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                 {/* Stylized Lion Icon Representation */}
                 <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-[#002D74]" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                 </svg>
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">Crypto.com</span>
            </div>
          </div>

          <div className="bg-[#11131E] border border-[#2B3144] rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-2 text-center">Log In</h2>
            <p className="text-slate-400 text-center text-sm mb-8">
              Enter your email address to receive a sign-in link.
            </p>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 ml-1">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-[#0B0D17] border border-[#2B3144] rounded-lg px-4 py-4 text-white focus:border-[#0099FF] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#0057E6] to-[#0099FF] hover:from-[#004AC2] hover:to-[#0088E6] text-white font-bold py-4 rounded-lg shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2"
              >
                {loading ? <RefreshCw className="animate-spin" /> : 'Continue'}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-[#2B3144] text-center">
              <p className="text-slate-500 text-sm">
                Don't have an account? <span className="text-[#0099FF] font-bold cursor-pointer hover:underline">Sign Up</span>
              </p>
            </div>
          </div>

          <div className="text-center text-xs text-slate-600 space-y-2">
            <p>Protected by reCAPTCHA and subject to the Privacy Policy and Terms of Service.</p>
          </div>
        </div>
      </div>
    );
  }

  // Magic Link Sent State
  if (step === 'MAGIC_LINK') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] p-4">
        <div className="bg-[#11131E] border border-[#2B3144] rounded-2xl p-10 shadow-2xl text-center max-w-[480px] w-full">
           <div className="w-16 h-16 bg-[#0099FF]/10 rounded-full flex items-center justify-center mx-auto mb-6 text-[#0099FF]">
              <Mail size={32} />
           </div>
           <h2 className="text-2xl font-bold text-white mb-4">Check your email</h2>
           <p className="text-slate-400 text-sm mb-8 leading-relaxed">
             We sent a magic link to <span className="text-white font-medium">{email}</span>.<br/>
             Click the link in the email to sign in.
           </p>
           
           <button 
             onClick={checkMagicLink}
             className="text-[#0099FF] text-sm font-bold hover:text-white transition-colors flex items-center gap-2 mx-auto"
           >
             {loading ? <RefreshCw className="animate-spin" size={16} /> : <span className="flex items-center gap-2">Resend Email <ArrowRight size={16} /></span>}
           </button>
           
           <div className="mt-8 text-xs text-slate-600">
              <button onClick={() => setStep('LOGIN')} className="hover:text-slate-400">Use a different email</button>
           </div>
        </div>
      </div>
    );
  }

  // Dashboard Interface (Mimicking Crypto.com App)
  return (
    <div className="p-6 space-y-6">
       
       {/* Header */}
       <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                 <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-[#002D74]" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                 </svg>
             </div>
             <div>
                <h2 className="text-2xl font-bold text-white">Crypto.com</h2>
                <div className="flex items-center gap-1 text-xs text-green-400">
                   <ShieldCheck size={12} /> Connected
                </div>
             </div>
          </div>
          <button 
            onClick={() => setStep('LOGIN')}
            className="text-slate-500 hover:text-white transition-colors p-2"
          >
             <LogOut size={20} />
          </button>
       </div>

       {/* Balance Card - Gradient Style */}
       <div className="bg-gradient-to-br from-[#002D74] to-[#050C1F] rounded-2xl p-8 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#0099FF] opacity-10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>
          
          <div className="relative z-10">
             <div className="text-sm font-medium opacity-80 mb-1">Total Balance</div>
             <div className="text-4xl font-bold mb-6">$24,592.42 <span className="text-sm font-normal opacity-70">USD</span></div>
             
             <div className="flex gap-4">
                <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md px-6 py-2 rounded-lg font-bold text-sm transition-colors border border-white/10">
                   Trade
                </button>
                <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md px-6 py-2 rounded-lg font-bold text-sm transition-colors border border-white/10">
                   Transfer
                </button>
             </div>
          </div>
       </div>

       {/* Assets & Card Grid */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* CRO Holdings */}
          <div className="bg-[#11131E] border border-[#2B3144] rounded-2xl p-6">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-white flex items-center gap-2">
                   <TrendingUp className="text-[#0099FF]" size={20} /> Crypto Assets
                </h3>
             </div>
             
             <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-[#0B0D17] rounded-xl border border-[#2B3144]">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#002D74] flex items-center justify-center font-bold text-white text-xs">CRO</div>
                      <div>
                         <div className="text-white font-bold">Cronos</div>
                         <div className="text-xs text-slate-500">125,400 CRO</div>
                      </div>
                   </div>
                   <div className="text-right">
                      <div className="text-white font-bold">$11,286.00</div>
                      <div className="text-xs text-green-400">+2.4%</div>
                   </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-[#0B0D17] rounded-xl border border-[#2B3144]">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#F7931A] flex items-center justify-center font-bold text-white text-xs">BTC</div>
                      <div>
                         <div className="text-white font-bold">Bitcoin</div>
                         <div className="text-xs text-slate-500">0.154 BTC</div>
                      </div>
                   </div>
                   <div className="text-right">
                      <div className="text-white font-bold">$10,076.42</div>
                      <div className="text-xs text-red-400">-0.8%</div>
                   </div>
                </div>
             </div>
          </div>

          {/* Visa Card */}
          <div className="bg-[#11131E] border border-[#2B3144] rounded-2xl p-6">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-white flex items-center gap-2">
                   <CreditCard className="text-[#0099FF]" size={20} /> Crypto.com Visa Card
                </h3>
                <span className="text-xs font-bold bg-[#2B3144] text-slate-300 px-2 py-1 rounded">Icy White</span>
             </div>

             {/* Card Visual - Icy White */}
             <div className="relative h-48 rounded-xl bg-gradient-to-r from-slate-200 to-white p-6 shadow-lg mb-4 text-slate-800 overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-50">
                    <svg viewBox="0 0 24 24" fill="none" className="w-12 h-12 text-slate-400" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                </div>
                <div className="flex flex-col justify-between h-full relative z-10">
                   <div className="font-mono font-bold text-lg opacity-60">VISA</div>
                   <div>
                      <div className="font-mono text-xl tracking-widest mb-1">4324 •••• •••• 9921</div>
                      <div className="flex justify-between items-end">
                         <div className="text-xs uppercase font-bold opacity-70">Demo User</div>
                         <div className="text-xs font-bold opacity-70">VALID THRU 12/26</div>
                      </div>
                   </div>
                </div>
                {/* Shiny effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent pointer-events-none"></div>
             </div>

             <div className="flex items-center justify-between text-sm">
                <div className="text-slate-400">Card Balance</div>
                <div className="text-white font-bold">$3,230.00 <span className="text-slate-500 font-normal">USD</span></div>
             </div>
             <div className="mt-3 pt-3 border-t border-[#2B3144] flex items-center gap-2 text-xs text-green-400">
                <Star size={12} fill="currentColor" /> 3% CRO Rewards Active
             </div>
          </div>
       </div>

    </div>
  );
};