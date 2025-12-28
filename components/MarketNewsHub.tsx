
import React, { useState, useEffect } from 'react';
import { Newspaper, RefreshCw, Zap, TrendingUp, TrendingDown, Info, Globe, Activity, Terminal } from 'lucide-react';
import { getMarketNewsWithSentiment } from '../services/geminiService';
import { MarketNews } from '../types';
import { useToast } from '../contexts/ToastContext';

interface MarketNewsHubProps {
  coinSymbol: string;
}

export const MarketNewsHub: React.FC<MarketNewsHubProps> = ({ coinSymbol }) => {
  const { addToast } = useToast();
  const [news, setNews] = useState<MarketNews[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const data = await getMarketNewsWithSentiment(coinSymbol);
      setNews(data);
      addToast("News Feed Linked", `Real-time intelligence for ${coinSymbol} synchronized.`, "success");
    } catch (e) {
      addToast("News Node Offline", "Unable to establish search grounding handshake.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [coinSymbol]);

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case 'Positive':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 border border-green-500/30 text-green-400 text-[10px] font-black uppercase tracking-widest rounded-full animate-pulse">
            <TrendingUp size={12} /> Bullish
          </span>
        );
      case 'Negative':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-black uppercase tracking-widest rounded-full animate-pulse">
            <TrendingDown size={12} /> Bearish
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 border border-slate-700 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-full">
            <Info size={12} /> Neutral
          </span>
        );
    }
  };

  return (
    <div className="bg-black border border-green-500/10 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in fade-in duration-1000 relative">
      <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
        <Newspaper size={200} className="text-green-500" />
      </div>

      <div className="bg-green-500/5 p-8 border-b border-green-500/10 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center text-black shadow-[0_0_20px_rgba(34,197,94,0.3)]">
            <Terminal size={24} />
          </div>
          <div>
            <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">News Buffer :: {coinSymbol}</h3>
            <p className="text-[10px] text-green-900 font-black uppercase tracking-[0.4em]">Sub-Node Intel Handshake Active</p>
          </div>
        </div>
        <button 
          onClick={fetchNews}
          disabled={loading}
          className="p-3 bg-black hover:bg-green-900/20 text-green-500 rounded-xl border border-green-500/20 transition-all active:scale-90 group"
        >
          <RefreshCw size={20} className={`${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-700'}`} />
        </button>
      </div>

      <div className="p-8 space-y-6 max-h-[600px] overflow-y-auto no-scrollbar relative z-10">
        {loading ? (
          <div className="py-20 text-center space-y-4">
            <div className="flex justify-center gap-3">
              {[0,1,2].map(i => (
                <div key={i} className="w-2 h-2 rounded-full bg-green-500 animate-bounce" style={{ animationDelay: `${i*150}ms` }}></div>
              ))}
            </div>
            <p className="text-[10px] font-black text-green-900 uppercase tracking-[0.5em] animate-pulse">Establishing Web-Search Grounding...</p>
          </div>
        ) : news.length > 0 ? (
          news.map((item, idx) => (
            <div 
              key={item.id} 
              className="bg-black/40 border border-green-500/5 hover:border-green-500/20 p-6 rounded-2xl transition-all group hover:scale-[1.01] animate-in slide-in-from-left-4"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-[9px] font-black text-green-800 uppercase tracking-widest bg-green-500/5 px-2 py-1 rounded">#{idx + 1} SENSOR</span>
                  {getSentimentBadge(item.sentiment)}
                </div>
                <div className="flex items-center gap-2 text-slate-600 font-mono text-[10px] font-black uppercase">
                  <Globe size={12} /> {item.source} • {item.time}
                </div>
              </div>
              <h4 className="text-lg font-black text-slate-100 uppercase tracking-tight leading-tight group-hover:text-green-400 transition-colors cursor-pointer">
                {item.title}
              </h4>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex gap-1.5 h-1 items-end">
                   {[...Array(8)].map((_, i) => (
                     <div key={i} className="w-1 bg-green-900/30 rounded-full h-full"></div>
                   ))}
                </div>
                <div className="text-[9px] font-black text-green-900 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  Decrypt Handshake ->
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center text-slate-600 space-y-4 border-2 border-dashed border-green-900/10 rounded-3xl">
             <Activity size={48} className="mx-auto opacity-20" />
             <p className="text-xs font-black uppercase tracking-widest">No Intelligence Packets Captured</p>
          </div>
        )}
      </div>

      <div className="bg-green-500/5 p-4 flex justify-center items-center gap-6 border-t border-green-500/10 text-[9px] font-black text-green-900 uppercase tracking-[0.4em]">
         <span className="flex items-center gap-1.5"><Zap size={10}/> Pulse: Synchronized</span>
         <span className="flex items-center gap-1.5"><Globe size={10}/> Global Alpha Nodes: 4</span>
      </div>
    </div>
  );
};
