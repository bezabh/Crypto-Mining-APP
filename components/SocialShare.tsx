
import React, { useState, useEffect } from 'react';
import { Share2, Copy, Twitter, Facebook, Linkedin, Send, MessageCircle, BarChart3, Download, CheckCircle2, Globe, Users, MousePointer2, Instagram, Youtube, Twitch, Disc, Hash, TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight, Trophy, Award, Zap } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

export const SocialShare: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const { addToast } = useToast();
  
  // Persist affiliate stats
  const [affiliateStats, setAffiliateStats] = useState(() => {
      const saved = localStorage.getItem('pm_referral_stats');
      return saved ? JSON.parse(saved) : { clicks: 1248, referrals: 15, earnings: 0.045 };
  });

  const [referralLink, setReferralLink] = useState("https://primemine.ai/ref/u-88219");

  useEffect(() => {
      if (typeof window !== 'undefined') {
          setReferralLink(`${window.location.origin}/?ref=u-88219`);
      }
  }, []);

  useEffect(() => {
      localStorage.setItem('pm_referral_stats', JSON.stringify(affiliateStats));
  }, [affiliateStats]);

  const defaultShareMessage = "I'm mining crypto with AI optimization on PrimeMine! Join me and boost your hashrate by 20%. #CryptoMining #PrimeMineAI #Bitcoin";

  const achievements = [
    { 
      id: 1, 
      title: "High Roller", 
      desc: "Mined 1.0 BTC total lifetime.", 
      icon: <Trophy size={24} className="text-yellow-400" />, 
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/20",
      message: "I just hit 1.0 BTC lifetime earnings on PrimeMine AI! 💰 Join the revolution. #Bitcoin #CryptoWhale #PrimeMine" 
    },
    { 
      id: 2, 
      title: "Power User", 
      desc: "Reached 150 TH/s hashrate.", 
      icon: <Zap size={24} className="text-blue-400" />, 
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      message: "My rig is on fire! 🔥 Reached 150 TH/s hashrate with PrimeMine AI optimization. #MiningRig #Hashrate #Tech" 
    },
    { 
      id: 3, 
      title: "Early Adopter", 
      desc: "Joined during beta phase.", 
      icon: <Award size={24} className="text-purple-400" />, 
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
      message: "Proud early adopter of PrimeMine AI. The future of mining is here. 🚀 #Crypto #EarlyAccess #Innovation" 
    }
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setAffiliateStats(prev => ({ ...prev, clicks: prev.clicks + 1 }));
    addToast("Link Copied", "Referral link linked to clipboard!", "success");
  };

  const shareToSocial = (platform: string, customMsg?: string) => {
    let url = '';
    const text = encodeURIComponent(customMsg || defaultShareMessage);
    const link = encodeURIComponent(referralLink);

    switch (platform) {
      case 'twitter': url = `https://twitter.com/intent/tweet?text=${text}&url=${link}`; break;
      case 'facebook': url = `https://www.facebook.com/sharer/sharer.php?u=${link}`; break;
      case 'linkedin': url = `https://www.linkedin.com/sharing/share-offsite/?url=${link}`; break;
      case 'telegram': url = `https://t.me/share/url?url=${link}&text=${text}`; break;
      case 'whatsapp': url = `https://wa.me/?text=${text}%20${link}`; break;
      default: url = `https://www.${platform}.com/`; break;
    }
    window.open(url, '_blank', 'width=800,height=600');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Share2 className="text-indigo-500" /> Linked Affiliate Hub
          </h2>
          <p className="text-slate-400 text-sm mt-1">Global referral data is linked to your core profile identity.</p>
        </div>
        <div className="bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
           <Users size={16} /> Gold Partner (5% Payout)
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="font-bold text-white mb-4">Your Linked Referral Link</h3>
              <div className="flex gap-2">
                 <div className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-slate-300 font-mono text-sm flex items-center truncate">
                    {referralLink}
                 </div>
                 <button onClick={handleCopy} className={`px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-all ${copied ? 'bg-green-600 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}>
                    {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />} {copied ? 'Linked' : 'Copy'}
                 </button>
              </div>
           </div>

           <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Trophy size={20} className="text-yellow-500" /> Linked Achievements</h3>
              <div className="grid grid-cols-1 gap-4">
                 {achievements.map((ach) => (
                    <div key={ach.id} className={`flex items-center justify-between p-4 rounded-xl border ${ach.border} ${ach.bg} transition-all hover:bg-opacity-20`}>
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-full bg-slate-950/30 flex items-center justify-center shadow-lg backdrop-blur-sm">{ach.icon}</div>
                           <div><h4 className="font-bold text-white text-sm">{ach.title}</h4><p className="text-xs text-slate-300">{ach.desc}</p></div>
                        </div>
                        <div className="flex gap-2">
                           <button onClick={() => shareToSocial('twitter', ach.message)} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"><Twitter size={16} /></button>
                           <button onClick={() => shareToSocial('telegram', ach.message)} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"><Send size={16} /></button>
                        </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        <div className="space-y-6">
           <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="font-bold text-white mb-6 flex items-center gap-2"><BarChart3 size={18} className="text-emerald-400" /> Campaign Metrics</h3>
              <div className="space-y-4">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 relative overflow-hidden">
                      <div className="relative z-10">
                         <div className="text-[10px] text-slate-500 font-black uppercase mb-1">Linked Clicks</div>
                         <div className="text-3xl font-black text-white">{affiliateStats.clicks.toLocaleString()}</div>
                      </div>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 relative overflow-hidden">
                      <div className="relative z-10">
                         <div className="text-[10px] text-slate-500 font-black uppercase mb-1">Conversions</div>
                         <div className="text-3xl font-black text-green-400">{affiliateStats.referrals}</div>
                      </div>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 relative overflow-hidden">
                      <div className="relative z-10">
                         <div className="text-[10px] text-slate-500 font-black uppercase mb-1">Accumulated Payout</div>
                         <div className="text-3xl font-black text-indigo-400">{affiliateStats.earnings} <span className="text-xs">BTC</span></div>
                      </div>
                  </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
