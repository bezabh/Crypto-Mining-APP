
import React, { useState, useEffect } from 'react';
import { Cpu, Globe, ShieldCheck, Code, MapPin, Heart, ExternalLink } from 'lucide-react';

const LOGO_URI = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 500 500'%3E%3Crect width='500' height='500' fill='%23DA121A'/%3E%3Cpath d='M0 0L300 250L0 500Z' fill='%23FCDD09'/%3E%3Cg transform='translate(100, 250) rotate(-20) scale(4)'%3E%3Cpath d='M0 -10L2.3 -3.1H9.5L3.6 1.2L5.9 8.1L0 3.8L-5.9 8.1L-3.6 1.2L-9.5 -3.1H-2.3Z' fill='%23DA121A'/%3E%3C/g%3E%3Cpath d='M360 450 L380 100 L400 50 L420 100 L440 450 Z' fill='%23FFFFFF'/%3E%3Cpath d='M400 50 L400 450' stroke='%23CBD5E1' stroke-width='2'/%3E%3Crect x='340' y='450' width='120' height='20' fill='%23CBD5E1'/%3E%3C/svg%3E";
const GOFUNDME_URL = "https://www.gofundme.com/f/tigappmining-support";

const SLIDES = [
  {
    id: 1,
    title: "TigApp AI Mining",
    desc: "Boost hashrates by up to 20% with Gemini 3.0 optimization algorithms.",
    icon: <Cpu size={32} className="text-indigo-400" />,
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20"
  },
  {
    id: 5,
    title: "Support Our Mission",
    desc: "Help us expand the TigApp infrastructure and empower the community through decentralized finance.",
    icon: <Heart size={32} className="text-rose-400 animate-pulse" />,
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    isGoFundMe: true
  },
  {
    id: 2,
    title: "Tigray Financial Link",
    desc: "Seamless deposits via Commercial Bank of Ethiopia & Telebirr wallets.",
    icon: <Globe size={32} className="text-blue-400" />,
    bg: "bg-blue-500/10",
    border: "border-blue-500/20"
  },
  {
    id: 3,
    title: "Military-Grade Assets",
    desc: "TigAppMining is protected by enterprise firewalls and real-time threat detection.",
    icon: <ShieldCheck size={32} className="text-emerald-400" />,
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20"
  },
  {
    id: 4,
    title: "Chief Architect",
    developer: "Bezabh Abrha",
    address: "Germany Bavaria, Regensburg, Pbox 93053",
    icon: <Code size={32} className="text-purple-400" />,
    image: LOGO_URI,
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    isCredit: true
  }
];

export const PromoCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const slide = SLIDES[currentIndex];

  return (
    <div className={`relative rounded-xl border ${slide.border} ${slide.bg} p-6 overflow-hidden transition-all duration-500 h-[240px] flex flex-col justify-center group`}>
      <div className="relative z-10 flex flex-col items-center text-center animate-in fade-in slide-in-from-right-4 duration-500" key={slide.id}>
        <div className="mb-4 relative w-24 h-24 flex items-center justify-center">
           {slide.isCredit ? (
             <>
               <div className="absolute inset-0 rounded-full border-2 border-t-purple-500 border-b-purple-500 animate-spin" style={{ animationDuration: '3s' }}></div>
               <div className="w-16 h-16 rounded-full overflow-hidden shadow-[0_0_30px_rgba(168,85,247,0.6)] z-10 border-2 border-white/20 relative">
                  <img src={slide.image} alt="Developer" className="w-full h-full object-cover" />
               </div>
             </>
           ) : (
             <div className="w-full h-full bg-slate-950/30 rounded-full backdrop-blur-sm flex items-center justify-center">{slide.icon}</div>
           )}
        </div>
        
        {slide.isCredit ? (
           <>
             <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 opacity-80">Architect & Developer</div>
             <h3 className="text-xl font-black text-white mb-2 tracking-tight">Bezabh Abrha</h3>
             <div className="flex items-center gap-1.5 text-[10px] text-slate-300 bg-slate-900/60 px-3 py-1.5 rounded-full border border-slate-700/50">
                <MapPin size={10} className="text-purple-400" /> Regensburg, Germany
             </div>
           </>
        ) : (
           <>
             <h3 className="text-lg font-bold text-white mb-2">{slide.title}</h3>
             <p className="text-xs text-slate-300 leading-relaxed max-w-[280px]">{slide.desc}</p>
             {slide.isGoFundMe && (
               <a 
                href={GOFUNDME_URL} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="mt-4 px-6 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg"
               >
                 GoFundMe <ExternalLink size={12} />
               </a>
             )}
           </>
        )}
      </div>
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
        {SLIDES.map((s, idx) => (
          <button key={s.id} onClick={() => setCurrentIndex(idx)} className={`h-1 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/20'}`} />
        ))}
      </div>
    </div>
  );
};
