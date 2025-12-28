import React, { useState, useEffect } from 'react';
/* Added ShieldCheck to the lucide-react imports */
import { Newspaper, RefreshCw, Zap, TrendingUp, TrendingDown, Info, Globe, Activity, BarChart3, Bell, ExternalLink, ShieldCheck } from 'lucide-react';
import { getBinanceSpecificNews } from '../services/geminiService';
import { MarketNews } from '../types';
import { useToast } from '../contexts/ToastContext';

export const BinanceNewsFeed: React.FC = () => {
  const { addToast } = useToast();
  const [news, setNews] = useState<MarketNews[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBinanceNews = async () => {
    setLoading(true);
    try {
      const data = await getBinanceSpecificNews();
      setNews(data);
      addToast("Binance Intel Synced", "Platform announcements synchronized via neural probe.", "success");
    } catch (e) {
      addToast("Node Outage", "Unable to establish handshake with Binance news cluster.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBinanceNews();
  }, []);

  const getSentimentStyle = (sentiment: string) => {
    switch (sentiment) {
      case 'Positive': return 'text-green-500 bg-green-500/10 border-green-500/30';
      case 'Negative': return 'text-red-500 bg-red-500/10 border-red-500/30';
      default: return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30';
    }
  };

  return (
    <div className="bg-[#0b0e11] border border-yellow-500/10 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in fade-in duration-1000 relative font-mono">
      {/* Decorative Binance Background */}
      <div className="absolute -top-12 -right-12 p-8 opacity-[0.03] pointer-events-none">
        <BarChart3 size={400} className="text-[#FCD535]" />
      </div>

      <div className="bg-[#FCD535]/5 p-8 border-b border-[#FCD535]/10 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-[#FCD535] rounded-2xl flex items-center justify-center text-black shadow-[0_0_30px_rgba(252,213,53,0.3)]">
            <Bell size={28} className="animate-bounce" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">Binance Announcements</h3>
            <p className="text-[10px] text-[#FCD535] font-black uppercase tracking-[0.5em]">Direct Liquidity Node Intelligence</p>
          </div>
        </div>
        <button 
          onClick={fetchBinanceNews}
          disabled={loading}
          className="p-4 bg-black hover:bg-yellow-900/20 text-[#FCD535] rounded-2xl border border-yellow-500/20 transition-all active:scale-90 group"
        >
          <RefreshCw size={24} className={`${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-700'}`} />
        </button>
      </div>

      <div className="p-8 space-y-6 max-h-[650px] overflow-y-auto no-scrollbar relative z-10">
        {loading ? (
          <div className="py-24 text-center space-y-6">
            <div className="flex justify-center gap-4">
              {[0,1,2].map(i => (
                <div key={i} className="w-3 h-3 rounded-full bg-[#FCD535] animate-pulse" style={{ animationDelay: `${i*200}ms` }}></div>
              ))}
            </div>
            <p className="text-xs font-black text-yellow-900 uppercase tracking-[0.6em] animate-pulse">Probing Official API Endpoints...</p>
          </div>
        ) : news.length > 0 ? (
          news.map((item, idx) => (
            <div 
              key={item.id} 
              className="bg-black/60 border border-yellow-500/5 hover:border-yellow-500/30 p-8 rounded-3xl transition-all group relative overflow-hidden"
              style={{ animationDelay: `${idx * 150}ms` }}
            >
              {/* Index Number */}
              <div className="absolute -left-2 top-1/2 -translate-y-1/2 text-8xl font-black text-white/[0.02] pointer-events-none italic">
                0{idx + 1}
              </div>

              <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                <div className="flex flex-wrap items-center gap-4">
                  <span className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${getSentimentStyle(item.sentiment)}`}>
                    <Zap size={12} /> {item.sentiment}
                  </span>
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest bg-white/5 px-3 py-1 rounded">PLATFORM_EVENT</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600 font-mono text-[10px] font-black uppercase tracking-wider">
                  <Globe size={14} className="text-[#FCD535]" /> {item.source} • {item.time}
                </div>
              </div>

              <h4 className="text-xl font-black text-slate-100 uppercase tracking-tight leading-tight group-hover:text-[#FCD535] transition-colors cursor-pointer relative z-10">
                {item.title}
              </h4>

              <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-4">
                <div className="flex gap-2">
                   {[...Array(6)].map((_, i) => (
                     <div key={i} className={`h-1.5 w-1.5 rounded-full ${i < 3 ? 'bg-[#FCD535]/40' : 'bg-slate-800'}`}></div>
                   ))}
                </div>
                <button className="flex items-center gap-2 text-[#FCD535] text-[10px] font-black uppercase tracking-widest hover:translate-x-2 transition-transform">
                   Read Full Node <ExternalLink size={12} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-32 text-center text-slate-700 space-y-6 border-2 border-dashed border-yellow-900/10 rounded-[3rem]">
             <Activity size={64} className="mx-auto opacity-10 animate-pulse" />
             <p className="text-sm font-black uppercase tracking-[0.5em] italic">No platform updates captured in current cycle.</p>
             <button onClick={fetchBinanceNews} className="text-[#FCD535] text-xs font-black uppercase tracking-widest border-b border-[#FCD535]/30 pb-1">Force Re-Sync</button>
          </div>
        )}
      </div>

      <div className="bg-[#FCD535]/5 p-6 flex flex-wrap justify-center items-center gap-8 border-t border-yellow-500/10 text-[10px] font-black text-yellow-900 uppercase tracking-[0.4em]">
         <span className="flex items-center gap-2"><RefreshCw size={12} className="animate-spin-slow"/> Engine: Neural-X</span>
         <span className="flex items-center gap-2"><ShieldCheck size={12}/> Origin: Verified Binance Cluster</span>
         <span className="flex items-center gap-2"><Globe size={12}/> Regional Nodes: 12</span>
      </div>
    </div>
  );
};