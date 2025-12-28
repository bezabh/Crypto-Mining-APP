
import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Search, Star, ArrowRightLeft, BarChart2, Globe, Zap, Newspaper, RefreshCw, Loader2, Database } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MarketCoin, MarketNews } from '../types';
import { fetchFullMarketData } from '../services/geminiService';
import { useToast } from '../contexts/ToastContext';

export const CryptoMarket: React.FC = () => {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<'MARKET' | 'NEWS' | 'SWAP'>('MARKET');
  const [coins, setCoins] = useState<MarketCoin[]>([]);
  const [news, setNews] = useState<MarketNews[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [swapFrom, setSwapFrom] = useState('BTC');
  const [swapTo, setSwapTo] = useState('USDT');
  const [swapAmount, setSwapAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Debounce logic for search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Initial Mock Data and Live Price Simulation
  useEffect(() => {
    const mockCoins: MarketCoin[] = [
      { id: 'bitcoin', rank: 1, name: 'Bitcoin', symbol: 'BTC', price: 65430.50, change24h: 2.45, volume24h: '34.2B', marketCap: '1.28T', chartData: [64000, 64500, 64200, 64800, 65100, 65430] },
      { id: 'ethereum', rank: 2, name: 'Ethereum', symbol: 'ETH', price: 3450.10, change24h: -1.20, volume24h: '15.8B', marketCap: '415B', chartData: [3500, 3480, 3490, 3460, 3440, 3450] },
      { id: 'binancecoin', rank: 3, name: 'BNB', symbol: 'BNB', price: 590.20, change24h: 0.85, volume24h: '1.2B', marketCap: '87B', chartData: [585, 588, 587, 589, 591, 590] },
      { id: 'solana', rank: 4, name: 'Solana', symbol: 'SOL', price: 145.60, change24h: 5.60, volume24h: '4.5B', marketCap: '65B', chartData: [138, 140, 142, 141, 144, 145] },
      { id: 'ripple', rank: 5, name: 'XRP', symbol: 'XRP', price: 0.62, change24h: -0.50, volume24h: '980M', marketCap: '34B', chartData: [0.63, 0.625, 0.62, 0.622, 0.618, 0.62] },
    ];
    setCoins(mockCoins);

    setNews([
        { id: 'n1', title: 'Bitcoin Hashrate Hits All-Time High Amidst Mining Boom', source: 'CoinDesk', time: '1h ago', sentiment: 'Positive' },
        { id: 'n2', title: 'SEC Delays Decision on Ethereum ETF Application', source: 'Bloomberg', time: '3h ago', sentiment: 'Negative' },
    ]);

    const interval = setInterval(() => {
        setCoins(prev => prev.map(coin => ({
            ...coin,
            price: coin.price * (1 + (Math.random() - 0.5) * 0.005),
            chartData: [...coin.chartData.slice(1), coin.price]
        })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleSyncFullMarket = async () => {
      setIsLoading(true);
      addToast("Deep Scan Initiated", "Synchronizing all available cryptocurrencies via global search grounding...", "info");
      try {
          const fullData = await fetchFullMarketData();
          if (fullData.length > 0) {
              setCoins(fullData);
              addToast("Market Synchronized", `Successfully linked ${fullData.length} active cryptocurrencies.`, "success");
          } else {
              addToast("Sync Error", "Grounding node returned empty dataset. Using cached data.", "warning");
          }
      } catch (e) {
          addToast("Hardware Handshake Error", "Search grounding node offline.", "error");
      } finally {
          setIsLoading(false);
      }
  };

  const filteredCoins = coins.filter(c => 
    c.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) || 
    c.symbol.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
  );

  const getChartData = (data: number[]) => {
      return data.map((val, idx) => ({ time: idx, value: val }));
  };

  const calculateSwap = () => {
      if(!swapAmount) return '0.00';
      const fromPrice = coins.find(c => c.symbol === swapFrom)?.price || 1;
      const toPrice = coins.find(c => c.symbol === swapTo)?.price || 1;
      const effectiveToPrice = swapTo === 'USDT' ? 1 : toPrice;
      return ((parseFloat(swapAmount) * fromPrice) / effectiveToPrice).toFixed(6);
  };

  return (
    <div className="p-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 h-full flex flex-col">
        
        {/* Market Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-green-500/10 pb-4">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center text-black shadow-lg">
                    <BarChart2 size={28} />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Global Market Pulse</h2>
                    <p className="text-green-900 text-[10px] font-black uppercase tracking-[0.4em] mt-1">Total Assets Tracked: {coins.length}</p>
                </div>
            </div>
            
            <div className="flex items-center gap-3">
                <button 
                    onClick={handleSyncFullMarket}
                    disabled={isLoading}
                    className="px-6 py-2.5 bg-green-600 hover:bg-green-500 disabled:bg-slate-800 text-black rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95 shadow-xl shadow-green-900/20"
                >
                    {isLoading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                    {isLoading ? 'Scanning...' : 'Sync All Assets'}
                </button>
                <div className="flex bg-black/40 rounded-lg p-1 border border-green-500/10">
                    <button 
                        onClick={() => setActiveTab('MARKET')}
                        className={`px-4 py-2 rounded-md text-[10px] font-black flex items-center gap-2 transition-colors uppercase tracking-widest ${activeTab === 'MARKET' ? 'bg-green-600 text-black' : 'text-slate-500 hover:text-white'}`}
                    >
                        <Globe size={14} /> Market
                    </button>
                    <button 
                        onClick={() => setActiveTab('SWAP')}
                        className={`px-4 py-2 rounded-md text-[10px] font-black flex items-center gap-2 transition-colors uppercase tracking-widest ${activeTab === 'SWAP' ? 'bg-green-600 text-black' : 'text-slate-500 hover:text-white'}`}
                    >
                        <ArrowRightLeft size={14} /> Swap
                    </button>
                </div>
            </div>
        </div>

        {activeTab === 'MARKET' && (
            <div className="flex-1 flex flex-col min-h-0 space-y-6 overflow-hidden">
                {/* Search Bar */}
                <div className="relative group">
                    <Search className="absolute left-4 top-3.5 text-green-900 group-focus-within:text-green-500 transition-colors" size={20} />
                    <input 
                        type="text" 
                        placeholder="SEARCH ALL CRYPTOCURRENCIES..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-black border border-green-500/10 rounded-xl py-3 pl-12 pr-4 text-white font-black uppercase tracking-widest focus:outline-none focus:border-green-500/50 transition-colors placeholder:text-green-950"
                    />
                </div>

                {/* Coins Table */}
                <div className="flex-1 bg-black/40 border border-green-500/10 rounded-[2rem] overflow-hidden shadow-2xl flex flex-col min-h-0">
                    <div className="overflow-y-auto flex-1 no-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead className="sticky top-0 z-10 bg-black/90 backdrop-blur-md border-b border-green-500/10 shadow-lg">
                                <tr className="text-[10px] text-green-900 uppercase font-black tracking-widest italic">
                                    <th className="p-5"># Rank</th>
                                    <th className="p-5">Identifier</th>
                                    <th className="p-5 text-right">Unit Price</th>
                                    <th className="p-5 text-right">24h Delta</th>
                                    <th className="p-5 text-right hidden md:table-cell">Market Volume</th>
                                    <th className="p-5 text-right">Handshake</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-green-500/5 font-mono text-sm">
                                {filteredCoins.length > 0 ? (
                                    filteredCoins.map(coin => (
                                        <tr key={coin.id} className="hover:bg-green-500/5 transition-all group">
                                            <td className="p-5 text-green-900 font-black italic">{coin.rank}</td>
                                            <td className="p-5">
                                                <div className="flex flex-col">
                                                    <span className="font-black text-white uppercase tracking-tighter italic text-hibernate">{coin.name}</span>
                                                    <span className="text-[9px] text-green-800 font-black uppercase tracking-[0.2em]">{coin.symbol}</span>
                                                </div>
                                            </td>
                                            <td className="p-5 text-right font-black text-white italic text-smart-shimmer">
                                                ${coin.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="p-5 text-right">
                                                <span className={`flex items-center justify-end gap-1 font-black text-[11px] uppercase ${coin.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                    {coin.change24h >= 0 ? '▲' : '▼'} {Math.abs(coin.change24h)}%
                                                </span>
                                            </td>
                                            <td className="p-5 text-right text-green-900 font-black hidden md:table-cell uppercase tracking-widest text-[10px]">
                                                {coin.volume24h}
                                            </td>
                                            <td className="p-5 text-right">
                                                <button className="bg-green-500/10 hover:bg-green-600 border border-green-500/20 hover:text-black text-green-500 px-4 py-1.5 rounded text-[9px] font-black transition-all uppercase tracking-widest">
                                                    Deploy
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="p-20 text-center text-green-900 font-black uppercase tracking-[0.5em]">
                                            <Database size={48} className="mx-auto mb-4 opacity-10" />
                                            No asset matching node signature
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'SWAP' && (
            <div className="flex-1 flex items-center justify-center min-h-[500px]">
                <div className="bg-black border border-green-500/10 rounded-[3rem] p-10 w-full max-w-lg relative overflow-hidden shadow-2xl glass-shadow">
                    <div className="absolute top-0 left-0 w-full h-1 bg-green-600"></div>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500 border border-green-500/20">
                            <ArrowRightLeft size={24} />
                        </div>
                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">Liquid Swap Engine</h3>
                    </div>
                    
                    <div className="space-y-6">
                        <div className="bg-[#010409] p-6 rounded-[2rem] border border-green-500/10 shadow-inner">
                            <div className="flex justify-between text-[10px] font-black text-green-900 uppercase tracking-widest mb-3">
                                <span>Inject Origin</span>
                                <span>Vault: 0.45 {swapFrom}</span>
                            </div>
                            <div className="flex gap-4 items-center">
                                <input 
                                    type="number" 
                                    value={swapAmount}
                                    onChange={(e) => setSwapAmount(e.target.value)}
                                    placeholder="0.00"
                                    className="bg-transparent text-3xl font-black text-white outline-none w-full font-mono placeholder:text-green-950"
                                />
                                <select 
                                    value={swapFrom}
                                    onChange={(e) => setSwapFrom(e.target.value)}
                                    className="bg-green-600 text-black font-black rounded-xl px-4 py-2 outline-none uppercase text-xs tracking-widest"
                                >
                                    {coins.map(c => <option key={c.symbol} value={c.symbol}>{c.symbol}</option>)}
                                    <option value="USDT">USDT</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-center -my-3 relative z-10">
                            <button className="bg-green-600 p-3 rounded-full border-4 border-black text-black shadow-xl hover:scale-110 transition-transform">
                                <ArrowRightLeft className="rotate-90" size={20} />
                            </button>
                        </div>

                        <div className="bg-[#010409] p-6 rounded-[2rem] border border-green-500/10 shadow-inner">
                            <div className="flex justify-between text-[10px] font-black text-green-900 uppercase tracking-widest mb-3">
                                <span>Output target (Estimated)</span>
                            </div>
                            <div className="flex gap-4 items-center">
                                <input 
                                    type="text" 
                                    readOnly
                                    value={calculateSwap()}
                                    className="bg-transparent text-3xl font-black text-green-400 outline-none w-full font-mono"
                                />
                                <select 
                                    value={swapTo}
                                    onChange={(e) => setSwapTo(e.target.value)}
                                    className="bg-green-600 text-black font-black rounded-xl px-4 py-2 outline-none uppercase text-xs tracking-widest"
                                >
                                    <option value="USDT">USDT</option>
                                    {coins.map(c => <option key={c.symbol} value={c.symbol}>{c.symbol}</option>)}
                                </select>
                            </div>
                        </div>

                        <button className="w-full bg-green-600 hover:bg-green-500 text-black font-black py-5 rounded-[2rem] shadow-2xl transition-all flex items-center justify-center gap-3 mt-4 uppercase tracking-[0.4em] text-xs border-b-4 border-green-900">
                            <RefreshCw size={18} /> INITIALIZE HANDSHAKE
                        </button>
                        <p className="text-center text-[9px] font-black text-green-900 uppercase tracking-[0.3em]">Protocol Fee: 0.1% Node Capacity</p>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};
