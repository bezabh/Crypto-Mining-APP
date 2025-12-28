
import React, { useState } from 'react';
import { X, ExternalLink, Megaphone, Shield, Lock, CreditCard } from 'lucide-react';

interface AdBannerProps {
  variant?: 'sidebar' | 'banner' | 'card';
  className?: string;
}

const AD_CONTENT = [
  {
    id: 'ledger',
    title: "Ledger Nano X",
    desc: "Secure your crypto with the world's best hardware wallet. Keep your keys offline.",
    cta: "Shop Now",
    icon: <Shield size={24} className="text-orange-400" />,
    color: "from-orange-500/10 to-red-500/10",
    border: "border-orange-500/20",
    textColor: "text-orange-100"
  },
  {
    id: 'nordvpn',
    title: "NordVPN Crypto",
    desc: "Mask your mining IP address. No logs, high speed, and DDoS protection for miners.",
    cta: "Get 68% Off",
    icon: <Lock size={24} className="text-blue-400" />,
    color: "from-blue-500/10 to-cyan-500/10",
    border: "border-blue-500/20",
    textColor: "text-blue-100"
  },
  {
    id: 'trezor',
    title: "Trezor Model T",
    desc: "The safe place for your coins. Discover the next level of security.",
    cta: "Buy Trezor",
    icon: <CreditCard size={24} className="text-emerald-400" />,
    color: "from-emerald-500/10 to-green-500/10",
    border: "border-emerald-500/20",
    textColor: "text-emerald-100"
  }
];

export const AdBanner: React.FC<AdBannerProps> = ({ variant = 'banner', className = '' }) => {
  const [isVisible, setIsVisible] = useState(true);
  
  // Select ad based on variant for variety
  const adIndex = variant === 'sidebar' ? 1 : (variant === 'card' ? 2 : 0);
  const ad = AD_CONTENT[adIndex];

  if (!isVisible) return null;

  if (variant === 'sidebar') {
     return (
       <div className={`relative p-4 rounded-xl border ${ad.border} bg-gradient-to-br ${ad.color} ${className} group`}>
          <button 
            onClick={(e) => { e.stopPropagation(); setIsVisible(false); }} 
            className="absolute top-2 right-2 text-white/30 hover:text-white transition-colors"
          >
            <X size={14}/>
          </button>
          <div className="text-[10px] font-bold uppercase text-white/40 mb-3 flex items-center gap-1 tracking-wider">
             <Megaphone size={10}/> Sponsored
          </div>
          <div className="flex items-start gap-3 mb-2">
             <div className="p-2 bg-slate-950/30 rounded-lg backdrop-blur-sm">
                {ad.icon}
             </div>
             <div>
                <h4 className="font-bold text-white text-sm leading-tight mb-1">{ad.title}</h4>
                <p className="text-xs text-slate-400 leading-snug">{ad.desc}</p>
             </div>
          </div>
          <button className="w-full mt-2 bg-white/5 hover:bg-white/10 border border-white/5 text-white text-xs font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-1 group-hover:border-white/20">
             {ad.cta} <ExternalLink size={10}/>
          </button>
       </div>
     );
  }

  if (variant === 'card') {
    return (
       <div className={`relative p-6 rounded-xl border ${ad.border} bg-gradient-to-r ${ad.color} flex flex-col justify-between h-full ${className}`}>
           <div className="absolute top-3 right-3 text-[10px] font-bold uppercase text-white/30 px-2 py-1 rounded bg-black/20">Ad</div>
           <div className="mb-4">
              <div className="mb-3 w-12 h-12 rounded-full bg-slate-950/30 flex items-center justify-center">
                  {ad.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{ad.title}</h3>
              <p className="text-sm text-slate-300">{ad.desc}</p>
           </div>
           <button className="w-full bg-white text-slate-900 font-bold py-3 rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center gap-2">
              {ad.cta} <ExternalLink size={16}/>
           </button>
       </div>
    );
  }

  // Banner variant
  return (
    <div className={`relative px-6 py-4 rounded-xl border ${ad.border} bg-gradient-to-r ${ad.color} flex items-center justify-between ${className}`}>
       <button onClick={() => setIsVisible(false)} className="absolute top-2 right-2 text-white/30 hover:text-white"><X size={14}/></button>
       <div className="flex items-center gap-4">
          <div className="bg-slate-950/30 p-2 rounded-lg hidden sm:block">
             {ad.icon}
          </div>
          <div>
             <h4 className="font-bold text-white text-sm md:text-base flex items-center gap-2">
                {ad.title} 
                <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-white/60 font-normal uppercase tracking-wide border border-white/5">Sponsored</span>
             </h4>
             <p className="text-xs md:text-sm text-slate-300 max-w-xl">{ad.desc}</p>
          </div>
       </div>
       <button className="hidden md:flex bg-white/10 hover:bg-white/20 text-white border border-white/10 px-4 py-2 rounded-lg text-sm font-bold transition-colors items-center gap-2 whitespace-nowrap">
          {ad.cta} <ExternalLink size={14}/>
       </button>
    </div>
  );
};
