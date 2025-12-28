
import React, { useState, useMemo } from 'react';
import { Mail, Lock, User, ArrowRight, Loader2, RefreshCw, Sparkles, ChevronRight, Fingerprint, ShieldCheck, Zap, Binary, Heart, ShieldAlert, Users, BrainCircuit, Crown } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { User as UserType, UserRole } from '../types';

interface AuthProps {
  onLogin: (user: UserType) => void;
}

const ADVANCED_ROBOT_URL = "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop";

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const { addToast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState<'FORM' | 'VERIFY' | 'WELCOME'>('FORM');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('Guest');
  const [otp, setOtp] = useState('');
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (!isLogin && !name)) {
      addToast("Handshake Error", "Required identity vectors missing.", "error");
      return;
    }
    setLoading(true);
    
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('tigapp_db_users') || '[]');
      
      const isPrivileged = 
        email.toLowerCase() === 'beckylove2004@gmail.com' || 
        email.toLowerCase() === 'admin@tigapp.ai';

      if (isLogin) {
        const found = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
        if (found) {
          setCurrentUser(found);
          setStep('VERIFY');
        } else if (isPrivileged && password === 'admin') {
            const adminUser: UserType = { id: 'root-01', name: 'Master Architect', email, password: 'admin', role: 'Super Admin', status: 'Active', verificationStatus: 'verified', lastLogin: 'Today' };
            setCurrentUser(adminUser);
            setStep('VERIFY');
        } else {
          addToast("Access Denied", "Identity hash mismatch or node not registered.", "error");
        }
      } else {
        const exists = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
        if (exists) {
            addToast("Node Exists", "Email already registered in the cluster.", "warning");
        } else {
            const finalRole: UserRole = isPrivileged ? 'Super Admin' : role;
            const newUser: UserType = {
              id: Math.random().toString(36).substr(2, 9),
              name, email, password, role: finalRole,
              status: 'Active', verificationStatus: isPrivileged ? 'verified' : 'unverified', lastLogin: 'Just now'
            };
            localStorage.setItem('tigapp_db_users', JSON.stringify([...users, newUser]));
            setCurrentUser(newUser);
            setStep('VERIFY');
            if (isPrivileged) {
                addToast("Sovereign Forge", "Elevated credentials recognized. Node upgraded to ROOT.", "success");
            }
        }
      }
      setLoading(false);
    }, 1500);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return;
    setLoading(true);
    setTimeout(() => {
      setStep('WELCOME');
      setLoading(false);
    }, 1200);
  };

  if (step === 'WELCOME' && currentUser) {
    const isSuper = currentUser.role === 'Super Admin';
    return (
      <div className="min-h-screen flex flex-col items-center justify-start py-20 p-6 bg-transparent relative overflow-y-auto">
        <div className={`absolute inset-0 bg-amber-500/5 ${isSuper ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000 fixed`}></div>
        <div className="w-full max-w-4xl flex flex-col items-center animate-in zoom-in duration-1000 relative z-10">
           <div className="mb-16 flex flex-col items-center text-center">
              <div className={`relative w-48 h-48 md:w-64 md:h-64 rounded-full border-2 flex items-center justify-center mb-10 bg-slate-900 shadow-[0_0_150px_rgba(99,102,241,0.3)] ${isSuper ? 'border-amber-500 shadow-amber-500/50' : 'border-indigo-500/20'}`}>
                <div className={`absolute inset-0 rounded-full border animate-slow-rotate opacity-20 ${isSuper ? 'border-amber-500' : 'border-indigo-500'}`}></div>
                {isSuper && <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-amber-500 animate-bounce"><Crown size={64} /></div>}
                <img src={ADVANCED_ROBOT_URL} className="w-full h-full object-cover rounded-full p-1" />
              </div>
              <h1 className={`text-5xl md:text-8xl font-black mb-4 tracking-tighter uppercase italic text-smart-shimmer ${isSuper ? 'from-amber-400 via-yellow-200 to-amber-600' : ''}`}>
                {isSuper ? 'SOVEREIGN' : 'LINKED'}
              </h1>
              <p className={`text-xl md:text-3xl font-black font-mono tracking-[0.4em] uppercase opacity-80 ${isSuper ? 'text-amber-400' : 'text-indigo-400'} text-wrap px-4`}>
                {isSuper ? 'SUPER ADMIN' : 'NODE'} :: {currentUser.name}
              </p>
           </div>
           <button 
             onClick={() => onLogin(currentUser)}
             className={`px-10 md:px-20 py-6 text-white rounded-[3rem] font-black uppercase tracking-[0.6em] text-lg transition-all flex items-center gap-6 group active:scale-95 border-b-8 ${isSuper ? 'bg-amber-600 hover:bg-amber-500 border-amber-900 shadow-[0_20px_50px_rgba(245,158,11,0.4)]' : 'bg-indigo-600 hover:bg-indigo-500 border-indigo-900'}`}
           >
             Initialize Root <ArrowRight size={28} className="group-hover:translate-x-2 transition-transform" />
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 font-sans relative overflow-y-auto">
      <div className={`w-full ${isLogin ? 'max-w-xl' : 'max-w-6xl'} glass-shadow rounded-[4rem] relative z-10 overflow-hidden transition-all duration-1000 bg-slate-950/40 my-10`}>
        <div className="grid grid-cols-1 lg:grid-cols-12">
            {!isLogin && (
                <div className="lg:col-span-5 bg-indigo-600/10 p-12 flex flex-col justify-center border-r border-white/5 relative">
                   <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                   <div className="relative z-10 space-y-8">
                       <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-2xl border border-indigo-400">
                          <BrainCircuit size={40} />
                       </div>
                       <h2 className="text-5xl font-black text-white leading-none uppercase italic tracking-tighter text-wrap">Forge Your Identity</h2>
                       <p className="text-slate-400 text-sm font-bold uppercase tracking-widest leading-relaxed">
                          Initialize your node protocol to access global hashrate pools and institutional liquidity bridges.
                       </p>
                       <div className="space-y-4">
                          <div className="flex items-center gap-4 text-white font-black text-[10px] uppercase tracking-widest"><ShieldCheck size={18} className="text-indigo-400"/> AES-256 Protocol</div>
                          <div className="flex items-center gap-4 text-white font-black text-[10px] uppercase tracking-widest"><Fingerprint size={18} className="text-indigo-400"/> Biometric Anchor</div>
                          <div className="flex items-center gap-4 text-white font-black text-[10px] uppercase tracking-widest"><Zap size={18} className="text-indigo-400"/> Instant Payouts</div>
                       </div>
                   </div>
                </div>
            )}

            <div className={`${isLogin ? 'lg:col-span-12' : 'lg:col-span-7'} p-8 md:p-16`}>
              <div className="text-center mb-12">
                  <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter italic uppercase text-smart-shimmer mb-2">TigAppMining</h1>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.6em]">Neural Security Protocol v5.0</p>
              </div>

              {step === 'FORM' ? (
                  <form onSubmit={handleAuth} className="space-y-10">
                    {!isLogin && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Entity Name</label>
                                <input value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-950 border border-white/10 rounded-2xl py-5 px-8 text-white outline-none focus:border-indigo-500/60 transition-all font-bold" placeholder="BEZABH ABRHA" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Node Protocol</label>
                                <div className="flex gap-2 p-1.5 bg-slate-950 border border-white/10 rounded-2xl">
                                    <button type="button" onClick={() => setRole('Operator')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${role === 'Operator' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500'}`}>Operator</button>
                                    <button type="button" onClick={() => setRole('Guest')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${role === 'Guest' ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-500'}`}>Guest</button>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Uplink Address (Email)</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-950 border border-white/10 rounded-2xl py-5 px-8 text-white outline-none focus:border-indigo-500/60 transition-all font-mono" placeholder="OPERATOR@TIGAPP.AI" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Cipher Key (Password)</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-950 border border-white/10 rounded-2xl py-5 px-8 text-white outline-none focus:border-indigo-500/60 transition-all font-mono" placeholder="••••••••" />
                      </div>
                    </div>
                    
                    <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-6 rounded-[2.5rem] shadow-2xl flex items-center justify-center gap-6 transition-all active:scale-[0.98] uppercase tracking-[0.4em] text-sm group border-b-4 border-indigo-900">
                       {loading ? <RefreshCw className="animate-spin" size={24} /> : <>{isLogin ? 'Initiate Uplink' : 'Initialize Node'} <ChevronRight className="group-hover:translate-x-2 transition-transform"/></>}
                    </button>

                    <div className="text-center">
                        <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] hover:text-white transition-colors">
                            {isLogin ? "Generate New Node Access?" : "Return to Uplink Terminal"}
                        </button>
                    </div>
                  </form>
              ) : (
                  <form onSubmit={handleVerify} className="space-y-12 animate-in zoom-in duration-500">
                      <div className="text-center space-y-6">
                         <div className="w-28 h-28 mx-auto rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-white/10 shadow-[0_0_80px_rgba(99,102,241,0.2)] animate-pulse"><Fingerprint size={56} /></div>
                         <h3 className="text-white font-black uppercase text-3xl tracking-tighter italic">Neural Handshake</h3>
                         <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.4em] leading-relaxed">Check your terminal for the verification signature.</p>
                      </div>
                      <input type="text" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} className="w-full bg-slate-950/80 border border-white/10 rounded-[3rem] p-10 text-center text-4xl md:text-6xl font-mono tracking-[0.5em] text-indigo-400 focus:outline-none focus:border-indigo-500 shadow-inner" placeholder="000000" />
                      <button type="submit" disabled={otp.length !== 6 || loading} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-7 rounded-[3rem] shadow-2xl flex items-center justify-center gap-6 transition-all uppercase tracking-[0.4em] text-lg border-b-8 border-emerald-900">
                        {loading ? <RefreshCw className="animate-spin" size={28}/> : <><ShieldCheck size={28}/> Verify Handshake</>}
                      </button>
                  </form>
              )}
            </div>
        </div>
      </div>
    </div>
  );
};
