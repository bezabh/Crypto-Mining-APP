import React, { useState } from 'react';
import { Send, QrCode, CheckCircle2, Copy, RefreshCw, ShieldCheck, MessageSquare, X } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

export const TelegramConnect: React.FC = () => {
  const { addToast } = useToast();
  const [step, setStep] = useState<'GENERATE' | 'WAITING' | 'CONNECTED'>('GENERATE');
  const [pairingCode, setPairingCode] = useState('');
  const [telegramUser, setTelegramUser] = useState<string | null>(null);

  const generateCode = () => {
    const code = 'TIG-' + Math.floor(1000 + Math.random() * 9000);
    setPairingCode(code);
    setStep('WAITING');

    setTimeout(() => {
        setStep('CONNECTED');
        setTelegramUser('@tig_operator_01');
        addToast("Telegram Linked", "Notifications active via @TigAppMiningBot", "success");
    }, 5000);
  };

  const handleDisconnect = () => {
      if(confirm('Disconnect Telegram? You will lose remote control capabilities.')) {
          setStep('GENERATE');
          setTelegramUser(null);
          setPairingCode('');
      }
  };

  const botLink = `https://t.me/TigAppMiningBot?start=${pairingCode}`;

  return (
    <div className="bg-slate-900 border border-[#0088cc]/30 rounded-xl p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start gap-6 relative z-10">
            <div className="w-16 h-16 bg-[#0088cc]/10 rounded-2xl flex items-center justify-center shrink-0 border border-[#0088cc]/20">
                <Send size={32} className="text-[#0088cc]" />
            </div>
            <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">TigAppMining Remote Node</h3>
                <p className="text-slate-400 text-sm mb-4 leading-relaxed max-w-xl">
                    Connect to @TigAppMiningBot to receive instant alerts for hashrate drops, payout confirmations, and system health. Enable secure remote start/stop via encrypted chat commands.
                </p>

                {step === 'GENERATE' && (
                    <button 
                        onClick={generateCode}
                        className="bg-[#0088cc] hover:bg-[#0077b5] text-white font-bold py-2 px-6 rounded-lg transition-colors flex items-center gap-2"
                    >
                        <QrCode size={18} /> INITIALIZE LINK
                    </button>
                )}

                {step === 'WAITING' && (
                    <div className="space-y-4 animate-in fade-in">
                        <div className="flex items-center gap-3 text-indigo-400 font-bold text-sm bg-indigo-500/10 p-3 rounded-lg border border-indigo-500/20">
                            <RefreshCw size={16} className="animate-spin" /> Awaiting Handshake...
                        </div>
                        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col gap-2">
                            <span className="text-[10px] font-black text-slate-500 uppercase">Command to send to @TigAppMiningBot</span>
                            <div className="flex items-center justify-between">
                                <code className="text-white font-mono text-lg font-black tracking-widest">{pairingCode}</code>
                                <button className="text-indigo-400 hover:text-white"><Copy size={16} /></button>
                            </div>
                        </div>
                    </div>
                )}

                {step === 'CONNECTED' && (
                    <div className="flex flex-col sm:flex-row items-center gap-4 animate-in zoom-in">
                        <div className="flex items-center gap-2 bg-green-500/10 text-green-400 px-4 py-2 rounded-lg border border-green-500/20 font-bold text-sm">
                            <ShieldCheck size={18} /> Linked: {telegramUser}
                        </div>
                        <button onClick={handleDisconnect} className="text-slate-500 hover:text-red-400 text-xs font-bold uppercase flex items-center gap-1 transition-colors">
                           <X size={14} /> Disconnect
                        </button>
                    </div>
                )}
            </div>
        </div>
        <div className="absolute -right-4 -bottom-4 text-[#0088cc] opacity-5">
            <Send size={120} />
        </div>
    </div>
  );
};