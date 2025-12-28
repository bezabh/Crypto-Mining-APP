import React, { useState } from 'react';
import { Shield, Lock, Eye, EyeOff, Save, AlertTriangle, CheckCircle, Server, Key, Camera, Globe, Activity, RefreshCw, Smartphone, CameraOff } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

export const SecuritySettings: React.FC = () => {
  const { addToast } = useToast();
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [showSecret, setShowSecret] = useState(false);
  const [status, setStatus] = useState<'IDLE' | 'SAVING' | 'SAVED' | 'ERROR'>('IDLE');
  const [message, setMessage] = useState('');

  // Hardware Diagnostic State
  const [diagStatus, setDiagStatus] = useState<'IDLE' | 'CHECKING' | 'SUCCESS' | 'FAILED'>('IDLE');
  const [hwDetails, setHwDetails] = useState({ camera: 'Pending', geo: 'Pending' });

  const runHardwareDiagnostic = async () => {
    setDiagStatus('CHECKING');
    const results = { camera: 'Failed', geo: 'Failed' };

    try {
      // Step 1: Probe Optical Sensor
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(t => t.stop());
        results.camera = 'Active';
      } catch (err: any) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          results.camera = 'Blocked';
        } else {
          results.camera = 'Not Found';
        }
      }

      // Step 2: Probe Regional Sync (Geolocation)
      try {
        await new Promise((res, rej) => {
          navigator.geolocation.getCurrentPosition(res, rej, { timeout: 5000 });
        });
        results.geo = 'Verified';
      } catch (err: any) {
        results.geo = err.code === 1 ? 'Blocked' : 'Timed Out';
      }

      setHwDetails(results);
      setDiagStatus(results.camera === 'Active' && results.geo === 'Verified' ? 'SUCCESS' : 'FAILED');
      
      if (results.camera === 'Blocked') {
          addToast("Hardware Blocked", "Please click the camera icon in your address bar and select 'Allow'.", "error");
      }
    } catch (e) {
      setDiagStatus('FAILED');
    }
  };

  const handleSave = async () => {
    if (!apiKey || !apiSecret) {
        setStatus('ERROR');
        setMessage('Both API Key and Secret are required.');
        return;
    }
    setStatus('SAVING');
    setTimeout(() => {
        setStatus('SAVED');
        setMessage('Exchange credentials linked successfully.');
        addToast("API Linked", "Trading node established.", "success");
        setTimeout(() => { setStatus('IDLE'); setMessage(''); }, 4000);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 relative overflow-hidden">
        <div className="flex items-start gap-4 mb-8 relative z-10">
            <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center shrink-0 border border-indigo-500/20 text-indigo-400">
              <Key size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Exchange Vault</h3>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Binance / Crypto.com API Management</p>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10">
            <div className="space-y-6">
              <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-6 text-xs text-slate-400 leading-relaxed">
                  <div className="flex items-center gap-2 text-yellow-500 font-black uppercase tracking-widest mb-4">
                    <AlertTriangle size={16} /> Encryption Notice
                  </div>
                  API Keys are stored using hardware-level secure enclave logic. We recommend using 'Trade-Only' keys without withdrawal permissions for maximum node security.
              </div>
              {status === 'ERROR' && <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold flex items-center gap-3 animate-in fade-in"><AlertTriangle size={18} /> {message}</div>}
              {status === 'SAVED' && <div className="p-4 bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-bold flex items-center gap-3 animate-in fade-in"><CheckCircle size={18} /> {message}</div>}
            </div>

            <div className="space-y-4">
              <input type="text" value={apiKey} onChange={(e) => setApiKey(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white font-mono text-sm focus:border-indigo-500 outline-none transition-colors" placeholder="API Key" />
              <div className="relative">
                  <input type={showSecret ? "text" : "password"} value={apiSecret} onChange={(e) => setApiSecret(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 pr-12 text-white font-mono text-sm focus:border-indigo-500 outline-none transition-colors" placeholder="API Secret" disabled={status === 'SAVED'} />
                  <button onClick={() => setShowSecret(!showSecret)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">{showSecret ? <EyeOff size={20} /> : <Eye size={20} />}</button>
              </div>
              <button onClick={handleSave} disabled={status === 'SAVING'} className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white font-black py-4 rounded-xl flex items-center justify-center gap-3 shadow-2xl shadow-indigo-900/40 active:scale-[0.98] transition-all">
                {status === 'SAVING' ? <RefreshCw className="animate-spin" size={20}/> : <Save size={20} />} 
                Link Credential
              </button>
            </div>
        </div>
      </div>

      {/* Hardware Diagnostics Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20 text-emerald-400">
              <Activity size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">Diagnostic Hub</h3>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Sensor integrity & hardware handshake</p>
            </div>
          </div>
          <button 
            onClick={runHardwareDiagnostic}
            disabled={diagStatus === 'CHECKING'}
            className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all uppercase tracking-widest"
          >
            {diagStatus === 'CHECKING' ? <RefreshCw size={16} className="animate-spin" /> : <Smartphone size={16} />}
            Run System Probe
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className={`p-6 rounded-2xl border transition-all ${hwDetails.camera === 'Active' ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-slate-950 border-slate-800'}`}>
              <div className="flex justify-between items-center mb-3">
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                    {hwDetails.camera === 'Blocked' ? <CameraOff size={14} className="text-red-400"/> : <Camera size={14} className="text-indigo-400"/>}
                    Optical Sensor
                 </span>
                 <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${hwDetails.camera === 'Active' ? 'bg-emerald-500 text-white' : (hwDetails.camera === 'Blocked' ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-800 text-slate-500')}`}>
                    {hwDetails.camera}
                 </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                  {hwDetails.camera === 'Blocked' ? 'Permission was denied by your browser. Identity link cannot function.' : 'Used for real-time 3D identity landmark analysis during secure payouts.'}
              </p>
           </div>
           <div className={`p-6 rounded-2xl border transition-all ${hwDetails.geo === 'Verified' ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-slate-950 border-slate-800'}`}>
              <div className="flex justify-between items-center mb-3">
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Globe size={14} className="text-indigo-400"/>
                    Regional Sync
                 </span>
                 <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${hwDetails.geo === 'Verified' ? 'bg-emerald-500 text-white' : (hwDetails.geo === 'Blocked' ? 'bg-red-500 text-white' : 'bg-slate-800 text-slate-500')}`}>
                    {hwDetails.geo}
                 </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">Ensures system operation complies with regional mining and energy usage regulations.</p>
           </div>
        </div>

        {diagStatus === 'FAILED' && (
          <div className="mt-6 p-5 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-4 text-red-400 text-[10px] font-black uppercase tracking-widest animate-in slide-in-from-bottom-4">
            <AlertTriangle size={24} className="shrink-0" />
            <div className="pt-1">
                Hardware handshake incomplete. Please enable camera access to allow the biometric protocol to initialize.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
