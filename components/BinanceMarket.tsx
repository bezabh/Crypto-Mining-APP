
import React, { useState, useEffect, useRef } from 'react';
import { BinanceTicker } from '../types';
// Added BarChart3 to the lucide-react imports below
import { RefreshCw, Wallet, TrendingUp, Lock, CheckCircle, ExternalLink, ShieldCheck, LogIn, Calculator, History, ArrowUpRight, ArrowDownLeft, Shield, Key, Settings, LayoutGrid, Database, Users, Globe2, ChevronRight, Activity, Command, BarChart3 } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

interface TradeRecord {
  id: string;
  type: 'BUY' | 'SELL';
  amount: string;
  price: string;
  total: string;
  status: 'Completed' | 'Pending';
  time: string;
}

interface BinanceMarketProps {
  onNavigate?: (tab: string) => void;
}

export const BinanceMarket: React.FC<BinanceMarketProps> = ({ onNavigate }) => {
  const { addToast } = useToast();
  const [tickers, setTickers] = useState<Record<string, BinanceTicker>>({
    'BTCUSDT': { symbol: 'BTC/USDT', lastPrice: '0.00', priceChange: '0.00', priceChangePercent: '0.00%', volume: '0' },
    'ETHUSDT': { symbol: 'ETH/USDT', lastPrice: '0.00', priceChange: '0.00', priceChangePercent: '0.00%', volume: '0' },
    'BNBUSDT': { symbol: 'BNB/USDT', lastPrice: '0.00', priceChange: '0.00', priceChangePercent: '0.00%', volume: '0' },
    'XMRUSDT': { symbol: 'XMR/USDT', lastPrice: '0.00', priceChange: '0.00', priceChangePercent: '0.00%', volume: '0' },
  });
  const wsRef = useRef<WebSocket | null>(null);

  const [showConnectModal, setShowConnectModal] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [linkedAccount, setLinkedAccount] = useState<{ uid: string; scopes: string[] } | null>(null);

  const [orderType, setOrderType] = useState<'BUY' | 'SELL'>('BUY');
  const [price, setPrice] = useState('');
  const [amount, setAmount] = useState('');
  const [tradeStatus, setTradeStatus] = useState<'IDLE' | 'PROCESSING' | 'SUCCESS'>('IDLE');

  const [tradeHistory, setTradeHistory] = useState<TradeRecord[]>([
    { id: 'tx-8832', type: 'BUY', amount: '0.0234', price: '64,230.50', total: '1,503.00', status: 'Completed', time: '10:42:15' },
    { id: 'tx-9941', type: 'SELL', amount: '0.1500', price: '65,100.00', total: '9,765.00', status: 'Completed', time: '09:15:22' },
  ]);

  useEffect(() => {
    const streams = ['btcusdt@ticker', 'ethusdt@ticker', 'bnbusdt@ticker', 'xmrusdt@ticker'].join('/');
    const wsUrl = `wss://stream.binance.com:9443/stream?streams=${streams}`;
    wsRef.current = new WebSocket(wsUrl);
    wsRef.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const data = message.data;
      if (data && data.s) {
        setTickers(prev => ({
          ...prev,
          [data.s]: {
            symbol: data.s.replace('USDT', '/USDT'),
            lastPrice: parseFloat(data.c).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            priceChange: parseFloat(data.p).toFixed(2),
            priceChangePercent: `${parseFloat(data.P).toFixed(2)}%`,
            volume: parseFloat(data.v).toLocaleString('en-US', { maximumFractionDigits: 0 }) + ' ' + data.s.replace('USDT', '')
          }
        }));
      }
    };
    return () => { if (wsRef.current) wsRef.current.close(); };
  }, []);

  const initiateOAuth = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnected(true);
      setIsConnecting(false);
      setShowConnectModal(false);
      setLinkedAccount({ uid: 'TIG-BIN-884', scopes: ['trading', 'read'] });
      addToast("Binance Linked", "External node established successfully.", "success");
    }, 2000);
  };

  const executeTrade = () => {
    if (!isConnected) { setShowConnectModal(true); return; }
    setTradeStatus('PROCESSING');
    setTimeout(() => {
      setTradeStatus('SUCCESS');
      const newTrade: TradeRecord = {
        id: `tx-${Math.floor(Math.random() * 10000)}`,
        type: orderType,
        amount: amount || '0.00',
        price: price || tickers['BTCUSDT'].lastPrice,
        total: (parseFloat(price || '0') * parseFloat(amount || '0')).toFixed(2),
        status: 'Completed',
        time: new Date().toLocaleTimeString()
      };
      setTradeHistory(prev => [newTrade, ...prev].slice(0, 5));
      addToast("Order Executed", `${orderType} order successful on Binance.`, "success");
      setTimeout(() => { setTradeStatus('IDLE'); setAmount(''); }, 2000);
    }, 1500);
  };

  return (
    <div className="p-8 space-y-8 relative overflow-y-auto h-full scrollbar-thin animate-in fade-in duration-700">
       {showConnectModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-xl p-4 animate-in fade-in">
           <div className="bg-white text-slate-900 rounded-[3rem] w-full max-w-md shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden">
             <div className="bg-[#FCD535] p-12 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none rotate-12"><BarChart3 size={200} /></div>
                <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center text-[#FCD535] mx-auto mb-8 shadow-2xl relative z-10">
                  <TrendingUp size={48} />
                </div>
                <h3 className="text-4xl font-black text-black uppercase tracking-tight italic relative z-10">Connect Binance</h3>
                <p className="text-black/60 font-black text-[10px] uppercase tracking-[0.4em] mt-2 relative z-10">Secure API Protocol Synchronization</p>
             </div>
             <div className="p-10 space-y-8">
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-200">
                        <CheckCircle className="text-green-500" size={24} />
                        <div className="text-xs font-black text-slate-700 uppercase tracking-widest">Read Institutional Balances</div>
                    </div>
                    <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-200">
                        <CheckCircle className="text-green-500" size={24} />
                        <div className="text-xs font-black text-slate-700 uppercase tracking-widest">Execute Cloud Spot Trades</div>
                    </div>
                </div>
                <button onClick={initiateOAuth} disabled={isConnecting} className="w-full bg-[#FCD535] hover:bg-[#F0B90B] text-black py-5 rounded-2xl font-black transition-all shadow-xl shadow-yellow-500/20 uppercase tracking-[0.3em] flex items-center justify-center gap-4 active:scale-95">
                   {isConnecting ? <RefreshCw className="animate-spin" /> : <LogIn size={24}/>} 
                   {isConnecting ? 'LINKING BINANCE...' : 'AUTHORIZE HANDSHAKE'}
                </button>
                <button onClick={() => setShowConnectModal(false)} className="w-full text-slate-400 font-black text-[10px] uppercase tracking-[0.4em] hover:text-slate-900 transition-colors">Abort Link</button>
             </div>
           </div>
         </div>
       )}

       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-8">
          <div className="flex items-center gap-4">
             <div className="w-14 h-14 bg-[#FCD535] rounded-2xl flex items-center justify-center text-black shadow-lg border border-yellow-400/30">
                <BarChart3 size={32} />
             </div>
             <div>
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Binance Cloud Hub</h2>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-1 text-hibernate">Direct Spot & P2P Settlement :: Cluster-X</p>
             </div>
          </div>
          <div className="flex items-center gap-4">
              {isConnected ? (
                <div className="flex items-center gap-4 bg-slate-900 border border-slate-800 p-2 rounded-2xl">
                    <div className="px-4 border-r border-slate-800">
                        <div className="text-[8px] text-slate-500 font-black uppercase tracking-widest mb-1">UID Verified</div>
                        <div className="text-xs font-mono text-[#FCD535] font-black">{linkedAccount?.uid}</div>
                    </div>
                    <button onClick={() => setIsConnected(false)} className="bg-red-600/10 text-red-500 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-red-500/20 hover:bg-red-600 hover:text-white transition-all">Disconnect</button>
                </div>
            ) : (
                <button onClick={() => setShowConnectModal(true)} className="bg-[#FCD535] hover:bg-[#F0B90B] text-black px-10 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-yellow-500/10 flex items-center gap-3 transition-all active:scale-95">
                    <Wallet size={18} /> INITIALIZE LINK
                </button>
            )}
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(Object.values(tickers) as BinanceTicker[]).map((ticker) => (
             <div key={ticker.symbol} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl group hover:border-[#FCD535]/40 transition-all relative overflow-hidden glass-shadow">
                <div className="flex justify-between items-center mb-4">
                    <span className="font-black text-white text-xl tracking-tight italic text-smart-shimmer">{ticker.symbol}</span>
                    <span className={`text-[9px] font-black px-3 py-1 rounded-full border ${ticker.priceChangePercent.startsWith('-') ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20'}`}>
                        {ticker.priceChangePercent}
                    </span>
                </div>
                <div className="text-2xl font-black font-mono text-white mb-2 tracking-tighter">{ticker.lastPrice}</div>
                <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Vol: {ticker.volume}</div>
                <div className="absolute -right-6 -bottom-6 opacity-5 group-hover:opacity-10 transition-opacity">
                    <TrendingUp size={120} />
                </div>
             </div>
          ))}
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20">
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 glass-shadow h-fit">
             <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2 italic border-b border-white/5 pb-4">
               Live Order Depth <span className="text-indigo-400 font-black">BTC/USDT</span>
             </h3>
             <div className="space-y-1.5 font-mono text-[10px] font-black">
                {Array.from({length: 8}).map((_, i) => (
                    <div key={i} className="flex justify-between py-1 text-red-400/80">
                        <span>{(65000 + (8-i) * 2.5).toFixed(2)}</span>
                        <span>{(Math.random() * 2).toFixed(4)}</span>
                    </div>
                ))}
                <div className="py-6 border-y border-white/5 my-4 text-center">
                    <span className="text-3xl font-black text-green-400 tracking-tighter italic text-hibernate">{tickers['BTCUSDT'].lastPrice}</span>
                </div>
                {Array.from({length: 8}).map((_, i) => (
                    <div key={i} className="flex justify-between py-1 text-green-400/80">
                        <span>{(65000 - i * 2.5).toFixed(2)}</span>
                        <span>{(Math.random() * 2).toFixed(4)}</span>
                    </div>
                ))}
             </div>
          </div>

          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 space-y-10 flex flex-col shadow-2xl glass-shadow">
             <div className="flex bg-slate-950 p-2 rounded-[2rem] border border-slate-800">
                <button onClick={() => setOrderType('BUY')} className={`flex-1 py-5 rounded-[1.75rem] text-[11px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 ${orderType === 'BUY' ? 'bg-green-600 text-white shadow-2xl shadow-green-900/40' : 'text-slate-500 hover:text-slate-300'}`}>Spot Node Buy</button>
                <button onClick={() => setOrderType('SELL')} className={`flex-1 py-5 rounded-[1.75rem] text-[11px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 ${orderType === 'SELL' ? 'bg-red-600 text-white shadow-2xl shadow-red-900/40' : 'text-slate-500 hover:text-slate-300'}`}>Spot Node Sell</button>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2">Market Price (USDT)</label>
                        <input type="text" value={price} onChange={e => setPrice(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-6 text-white font-mono text-2xl font-black outline-none focus:border-[#FCD535] transition-all shadow-inner" placeholder="67,245.50" />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2">Node Quantity (BTC)</label>
                        <input type="text" value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-6 text-white font-mono text-2xl font-black outline-none focus:border-[#FCD535] transition-all shadow-inner" placeholder="0.000000" />
                    </div>
                    <button onClick={executeTrade} disabled={tradeStatus === 'PROCESSING'} className={`w-full py-6 rounded-[2rem] font-black text-sm uppercase tracking-[0.4em] transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-4 ${orderType === 'BUY' ? 'bg-green-600 hover:bg-green-500 text-white shadow-green-900/40' : 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/40'}`}>
                        {tradeStatus === 'PROCESSING' ? <RefreshCw className="animate-spin" size={24} /> : <ShieldCheck size={24}/>}
                        {tradeStatus === 'PROCESSING' ? 'Processing Handshake...' : `EXECUTE ${orderType} COMMAND`}
                    </button>
                </div>
                
                <div className="bg-slate-950/50 border border-slate-800 rounded-[2.5rem] p-10 border-dashed flex flex-col items-center justify-center text-center group">
                    {isConnected ? (
                        <>
                            <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mb-8 animate-pulse border border-green-500/20 shadow-[0_0_40px_rgba(34,197,94,0.2)]">
                                <Lock size={48} />
                            </div>
                            <h4 className="text-white font-black uppercase text-xl tracking-tighter italic">TigApp session active</h4>
                            <p className="text-[10px] text-slate-500 mt-4 leading-relaxed font-bold uppercase tracking-widest px-4">
                                Direct settlement to your regional CBE/Telebirr node is enabled. All trades are encrypted via TigApp protocol.
                            </p>
                        </>
                    ) : (
                        <>
                            <div className="w-24 h-24 bg-[#FCD535]/10 rounded-full flex items-center justify-center text-[#FCD535] mb-8 border border-yellow-500/20 group-hover:scale-110 transition-transform">
                                <ShieldCheck size={48} />
                            </div>
                            <h4 className="text-white font-black uppercase text-xl tracking-tighter italic">Liquidity Link Pending</h4>
                            <p className="text-[10px] text-slate-500 mt-4 leading-relaxed font-bold uppercase tracking-widest px-4">
                                Connect your Binance ID to activate zero-fee liquidity swaps and institutional asset bridging.
                            </p>
                        </>
                    )}
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};
