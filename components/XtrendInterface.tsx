
import React, { useState, useEffect, useRef } from 'react';
import { 
    TrendingUp, TrendingDown, Clock, ShieldCheck, Zap, 
    ArrowRightLeft, Star, ChevronDown, BarChart3, 
    Wallet, History, Info, Settings, RefreshCw, 
    LayoutGrid, ChevronRight, HelpCircle, Gift, DollarSign
} from 'lucide-react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer, ReferenceLine 
} from 'recharts';
import { TradingPair, AssetCategory, TradePosition } from '../types';
import { useToast } from '../contexts/ToastContext';

const TRADING_PAIRS: TradingPair[] = [
    { symbol: 'BTC/USDT', name: 'Bitcoin', category: 'Crypto', price: 67245.50, changePercent: 2.4, leverage: 100 },
    { symbol: 'EUR/USD', name: 'Euro/USD', category: 'Forex', price: 1.0845, changePercent: -0.15, leverage: 500 },
    { symbol: 'XAU/USD', name: 'Gold', category: 'Commo', price: 2384.20, changePercent: 1.1, leverage: 200 },
    { symbol: 'ETH/USDT', name: 'Ethereum', category: 'Crypto', price: 3450.12, changePercent: 1.8, leverage: 50 },
    { symbol: 'NAS100', name: 'Nasdaq 100', category: 'Index', price: 18240.40, changePercent: 0.65, leverage: 100 },
    { symbol: 'OIL', name: 'Crude Oil', category: 'Commo', price: 82.45, changePercent: -1.2, leverage: 50 },
];

export const XtrendInterface: React.FC = () => {
    const { addToast } = useToast();
    const [selectedPair, setSelectedPair] = useState<TradingPair>(TRADING_PAIRS[0]);
    const [activeCategory, setActiveCategory] = useState<AssetCategory | 'All'>('All');
    const [accountMode, setAccountMode] = useState<'Real' | 'Demo'>('Demo');
    
    // Linked State Persistence
    const [demoBalance, setDemoBalance] = useState(() => {
        const saved = localStorage.getItem('pm_xtrend_demo_balance');
        return saved ? parseFloat(saved) : 10000.00;
    });
    
    const [positions, setPositions] = useState<TradePosition[]>(() => {
        const saved = localStorage.getItem('pm_xtrend_positions');
        return saved ? JSON.parse(saved) : [];
    });

    const [chartData, setChartData] = useState<{ time: string; value: number }[]>([]);
    const [leverage, setLeverage] = useState(selectedPair.leverage);
    const [tradeAmount, setTradeAmount] = useState('100');
    const [xCoins, setXCoins] = useState(450);

    // Save linked data
    useEffect(() => {
        localStorage.setItem('pm_xtrend_demo_balance', demoBalance.toString());
    }, [demoBalance]);

    useEffect(() => {
        localStorage.setItem('pm_xtrend_positions', JSON.stringify(positions));
    }, [positions]);

    // Initial Chart Data
    useEffect(() => {
        const generateInitialData = () => {
            const data = [];
            let currentPrice = selectedPair.price;
            for (let i = 0; i < 40; i++) {
                currentPrice *= (1 + (Math.random() - 0.5) * 0.002);
                data.push({ time: `${i}:00`, value: currentPrice });
            }
            setChartData(data);
        };
        generateInitialData();
    }, [selectedPair]);

    // Live Price Updates
    useEffect(() => {
        const interval = setInterval(() => {
            setChartData(prev => {
                if (prev.length === 0) return prev;
                const lastPrice = prev[prev.length - 1].value;
                const nextPrice = lastPrice * (1 + (Math.random() - 0.5) * 0.001);
                return [...prev.slice(1), { time: new Date().toLocaleTimeString().slice(0, 5), value: nextPrice }];
            });

            setPositions(prev => prev.map(pos => {
                const currentPrice = chartData[chartData.length - 1]?.value || pos.entryPrice;
                const diff = pos.type === 'BUY' ? (currentPrice - pos.entryPrice) : (pos.entryPrice - currentPrice);
                const pnl = (diff / pos.entryPrice) * pos.margin * pos.leverage;
                return { ...pos, pnl };
            }));
        }, 1500);
        return () => clearInterval(interval);
    }, [chartData]);

    const handleExecuteTrade = (type: 'BUY' | 'SELL') => {
        const amountNum = parseFloat(tradeAmount);
        const currentBalance = accountMode === 'Real' ? 12450.00 : demoBalance;

        if (amountNum > currentBalance) {
            addToast("Insufficient Balance", "Please top up your account.", "error");
            return;
        }

        const entryPrice = chartData[chartData.length - 1].value;
        const newPos: TradePosition = {
            id: `p-${Math.floor(Math.random() * 10000)}`,
            symbol: selectedPair.symbol,
            type,
            entryPrice,
            amount: amountNum * leverage,
            leverage,
            margin: amountNum,
            pnl: 0,
            time: new Date().toLocaleTimeString()
        };

        setPositions([newPos, ...positions]);
        if (accountMode === 'Demo') setDemoBalance(prev => prev - amountNum);
        
        addToast("Position Opened", `${type} ${selectedPair.symbol} at ${entryPrice.toFixed(2)}`, "success");
    };

    const closePosition = (id: string) => {
        const pos = positions.find(p => p.id === id);
        if (pos) {
            if (accountMode === 'Demo') setDemoBalance(prev => prev + pos.margin + pos.pnl);
            setPositions(prev => prev.filter(p => p.id !== id));
            addToast("Position Closed", `Profit/Loss: ${pos.pnl.toFixed(2)}`, pos.pnl >= 0 ? "success" : "info");
        }
    };

    const currentPrice = chartData[chartData.length - 1]?.value || selectedPair.price;
    const priceChange = chartData.length > 0 ? ((currentPrice - chartData[0]?.value) / chartData[0]?.value * 100).toFixed(2) : "0.00";
    const isUp = parseFloat(priceChange) >= 0;

    return (
        <div className="flex flex-col h-full bg-[#050508] text-slate-200 overflow-hidden font-sans">
            <header className="bg-slate-900/50 backdrop-blur-md border-b border-slate-800/50 p-4 flex items-center justify-between sticky top-0 z-20">
                <div className="flex items-center gap-6">
                    <div className="flex bg-slate-950 rounded-full p-1 border border-slate-800">
                        <button onClick={() => setAccountMode('Real')} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${accountMode === 'Real' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>Real</button>
                        <button onClick={() => setAccountMode('Demo')} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${accountMode === 'Demo' ? 'bg-amber-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>Demo</button>
                    </div>
                    <div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Equity ({accountMode})</div>
                        <div className="text-xl font-black text-white font-mono">
                            ${(accountMode === 'Real' ? 12450.00 : demoBalance).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-2 bg-indigo-950/30 border border-indigo-500/20 px-3 py-1.5 rounded-lg">
                        <Gift size={16} className="text-indigo-400" />
                        <div className="text-[10px] font-bold">
                            <div className="text-slate-500 uppercase">X-Coins</div>
                            <div className="text-indigo-300">{xCoins} Linked</div>
                        </div>
                    </div>
                    <button className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg font-bold text-sm shadow-lg shadow-green-900/20 transition-all active:scale-95">DEPOSIT</button>
                </div>
            </header>

            <div className="border-b border-slate-800/50 bg-slate-900/30 px-4 py-2 flex items-center gap-4 overflow-x-auto no-scrollbar">
                <button onClick={() => setActiveCategory('All')} className={`shrink-0 text-xs font-bold px-3 py-1 rounded-full transition-colors ${activeCategory === 'All' ? 'bg-slate-200 text-slate-900' : 'text-slate-500 hover:text-slate-200'}`}>All Markets</button>
                {['Forex', 'Crypto', 'Commo', 'Index'].map(cat => (
                    <button key={cat} onClick={() => setActiveCategory(cat as AssetCategory)} className={`shrink-0 text-xs font-bold px-3 py-1 rounded-full transition-colors ${activeCategory === cat ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-200'}`}>{cat}</button>
                ))}
            </div>

            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                <div className="w-full lg:w-72 bg-slate-900/20 border-r border-slate-800/50 overflow-y-auto no-scrollbar hidden md:block">
                    <div className="p-4 border-b border-slate-800/50 sticky top-0 bg-slate-950/50 backdrop-blur-sm">
                        <div className="relative">
                            <LayoutGrid size={14} className="absolute left-3 top-2.5 text-slate-500" />
                            <input type="text" placeholder="Search Symbol..." className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-9 pr-4 text-xs text-white focus:border-indigo-500 outline-none"/>
                        </div>
                    </div>
                    <div className="divide-y divide-slate-800/30">
                        {TRADING_PAIRS.filter(p => activeCategory === 'All' || p.category === activeCategory).map(pair => (
                            <button key={pair.symbol} onClick={() => setSelectedPair(pair)} className={`w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors ${selectedPair.symbol === pair.symbol ? 'bg-indigo-600/5 border-l-4 border-indigo-500' : 'border-l-4 border-transparent'}`}>
                                <div className="text-left"><div className="text-sm font-bold text-white">{pair.symbol}</div><div className="text-[10px] text-slate-500">{pair.name}</div></div>
                                <div className="text-right">
                                    <div className={`text-sm font-mono font-bold ${pair.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>{pair.price.toFixed(pair.category === 'Forex' ? 4 : 2)}</div>
                                    <div className={`text-[10px] ${pair.changePercent >= 0 ? 'text-green-500/60' : 'text-red-500/60'}`}>{pair.changePercent > 0 ? '+' : ''}{pair.changePercent}%</div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 flex flex-col bg-slate-950/50 relative overflow-hidden">
                    <div className="p-6 flex justify-between items-start z-10 relative">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h2 className="text-3xl font-black text-white tracking-tight">{selectedPair.symbol}</h2>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${isUp ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{isUp ? 'Bullish' : 'Bearish'}</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                                <span className="font-mono text-xl font-bold text-slate-300">{currentPrice.toFixed(selectedPair.category === 'Forex' ? 4 : 2)}</span>
                                <span className={`font-bold ${isUp ? 'text-green-500' : 'text-red-500'}`}>{isUp ? '▲' : '▼'} {Math.abs(parseFloat(priceChange))}%</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 w-full min-h-[300px] relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="chartColor" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={isUp ? "#22c55e" : "#ef4444"} stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor={isUp ? "#22c55e" : "#ef4444"} stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                                <Area type="monotone" dataKey="value" stroke={isUp ? "#22c55e" : "#ef4444"} strokeWidth={3} fill="url(#chartColor)" animationDuration={1000}/>
                                <ReferenceLine y={chartData[0]?.value} stroke="#64748b" strokeDasharray="3 3" opacity={0.5} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="bg-slate-950 border-t border-slate-800/50 p-4 max-h-48 overflow-y-auto">
                        <div className="flex items-center justify-between mb-3 px-2">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2"><History size={14} /> Active Positions ({positions.length})</h3>
                        </div>
                        {positions.length === 0 ? <div className="text-center py-6 text-slate-600 text-sm">No linked positions found</div> : (
                            <div className="space-y-2">
                                {positions.map(pos => (
                                    <div key={pos.id} className="bg-slate-900/50 border border-slate-800 rounded-xl p-3 flex items-center justify-between group animate-in slide-in-from-bottom-2">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${pos.type === 'BUY' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>{pos.type === 'BUY' ? 'L' : 'S'}</div>
                                            <div>
                                                <div className="text-sm font-bold text-white">{pos.symbol} <span className="text-[10px] text-slate-500 ml-1">x{pos.leverage}</span></div>
                                                <div className="text-[10px] text-slate-500">Entry: {pos.entryPrice.toFixed(2)}</div>
                                            </div>
                                        </div>
                                        <div className="text-right flex items-center gap-6">
                                            <div>
                                                <div className={`text-sm font-mono font-bold ${pos.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>{pos.pnl >= 0 ? '+' : ''}{pos.pnl.toFixed(2)}</div>
                                                <div className="text-[10px] text-slate-500">PnL Linked</div>
                                            </div>
                                            <button onClick={() => closePosition(pos.id)} className="bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all">CLOSE</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="w-full lg:w-80 bg-slate-900 border-l border-slate-800/50 p-6 flex flex-col gap-6 overflow-y-auto">
                    <div>
                        <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-white text-sm">Linked Engine</h3><button className="text-slate-500 hover:text-white"><Settings size={16} /></button></div>
                        <div className="space-y-4">
                            <div><div className="flex justify-between text-xs font-bold text-slate-500 uppercase mb-2"><span>Leverage</span><span className="text-indigo-400">x{leverage}</span></div><div className="flex gap-2">{[10, 50, 100, 200, 500].map(val => (<button key={val} onClick={() => setLeverage(val)} disabled={val > (selectedPair.category === 'Crypto' ? 100 : 500)} className={`flex-1 py-1 rounded text-[10px] font-bold border transition-all ${leverage === val ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-600 disabled:opacity-30'}`}>{val}x</button>))}</div></div>
                            <div><label className="block text-xs font-bold text-slate-500 uppercase mb-2">Investment (USD)</label><div className="relative group"><DollarSign size={16} className="absolute left-3 top-3 text-slate-500"/><input type="number" value={tradeAmount} onChange={(e) => setTradeAmount(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white font-mono focus:border-indigo-500 outline-none transition-colors" placeholder="0.00"/></div><div className="flex justify-between mt-2 text-[10px] text-slate-500 font-medium"><span>Available: ${(accountMode === 'Real' ? 12450.00 : demoBalance).toLocaleString()}</span><span className="text-indigo-400">Power: ${(parseFloat(tradeAmount || '0') * leverage).toLocaleString()}</span></div></div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-auto">
                        <button onClick={() => handleExecuteTrade('BUY')} className="flex flex-col items-center gap-2 bg-[#22c55e] hover:bg-[#16a34a] text-white py-4 rounded-2xl shadow-xl transition-all active:scale-95 group relative"><TrendingUp size={24} /> <span className="font-black text-lg">BUY</span></button>
                        <button onClick={() => handleExecuteTrade('SELL')} className="flex flex-col items-center gap-2 bg-[#ef4444] hover:bg-[#dc2626] text-white py-4 rounded-2xl shadow-xl transition-all active:scale-95 group relative"><TrendingDown size={24} /> <span className="font-black text-lg">SELL</span></button>
                    </div>
                    <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 border-dashed text-center"><p className="text-[10px] text-slate-500 leading-relaxed font-bold">ALL TRADES ARE LINKED TO SECURE VAULT</p></div>
                </div>
            </div>
        </div>
    );
};
