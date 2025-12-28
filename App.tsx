
import React, { useState, useEffect } from 'react';
// Added Gem and ArrowRightLeft to the lucide-react imports
import { 
  Users, Database, Code, Settings, LayoutDashboard, Wallet, TrendingUp, 
  Cpu, Menu, Bell, Search, LogOut, Sun, Moon, Globe, Layers, Zap, Activity,
  Server, Wifi, Thermometer, Gauge, ClipboardList, BookOpen, LineChart, ShieldCheck, CloudSync, ShieldAlert,
  RefreshCw, Shield, BarChart3, Lock, Key, Link, Smartphone, Download, Sparkles, BrainCircuit, Mic, Eye, Rocket, Heart, ExternalLink, Bot, Palette, Share2, Target, ArrowUpRight, Command, CircleDollarSign, Landmark, FileText, Monitor, Globe2, Crown,
  User as UserIcon, CreditCard, Newspaper, ShieldEllipsis, Table, Fingerprint, Scan, ShieldAlert as AlertIcon, Gem, ArrowRightLeft
} from 'lucide-react';
import { useLanguage } from './contexts/LanguageContext';
import { useTheme, Theme } from './contexts/ThemeContext';
import { UserManagement } from './components/UserManagement';
import { DatabaseManager } from './components/DatabaseManager';
import { APIManagement } from './components/APIManagement';
import { Auth } from './components/Auth';
import { Transaction, UserActivity, Feedback, User, CoinData, MiningAlgorithm, HardwareType, LogEntry, VerificationStatus, BinanceTicker, MiningStats } from './types';
import { Terminal } from './components/Terminal';
import { MiningChart, EarningsChart, SharesPieChart } from './components/Chart';
import { AIAdvisor } from './components/AIAdvisor';
import { ProfitPredictor } from './components/ProfitPredictor';
import { BankIntegration } from './components/BankIntegration';
import { BinanceMarket } from './components/BinanceMarket';
import { CryptoMarket } from './components/CryptoMarket';
import { SocialShare } from './components/SocialShare';
import { DownloadCenter } from './components/DownloadCenter';
import { VPNInterface } from './components/VPNInterface';
import { SecurityCenter } from './components/SecurityCenter';
import { AIAssistant } from './components/AIAssistant';
import { AIConsultant } from './components/AIConsultant';
import { PromoCarousel } from './components/PromoCarousel';
import { AdBanner } from './components/AdBanner';
import { TelegramConnect } from './components/TelegramConnect';
import { SecuritySettings } from './components/SecuritySettings';
import { WebPlatform } from './components/WebPlatform';
import { InstallPortal } from './components/InstallPortal';
import { PlatformIntegrations } from './components/PlatformIntegrations';
import { MiningServer } from './components/MiningServer';
import { UserProfile } from './components/UserProfile';
import { SystemLogs } from './components/SystemLogs';
import { MiningResources } from './components/MiningResources';
import { XtrendInterface } from './components/XtrendInterface';
import { VerificationCenter } from './components/VerificationCenter';
import { AILab } from './components/AILab';
import { NodeIntel } from './components/NodeIntel';
import { AILiveLink } from './components/AILiveLink';
import { AIVision } from './components/AIVision';
import { AIBrain } from './components/AIBrain';
import { MoneyApps } from './components/MoneyApps';
import { GlobalWealthHub } from './components/GlobalWealthHub';
import { McAfeeScanner } from './components/McAfeeScanner';
import { FiatOnRamp } from './components/FiatOnRamp';
import { MarketNewsHub } from './components/MarketNewsHub';
import { BinanceNewsFeed } from './components/BinanceNewsFeed';
import { CoinForge } from './components/CoinForge';
import { BitcoinMaker } from './components/BitcoinMaker';
import { useToast } from './contexts/ToastContext';

const SidebarItem = ({ id, icon: Icon, label, active, onClick, badge, verified, color, role }: any) => {
  const isSuper = role === 'Super Admin';
  
  const colors: any = {
    yellow: { text: 'text-yellow-400', bar: 'bg-yellow-500' },
    orange: { text: 'text-orange-400', bar: 'bg-orange-500' },
    indigo: { text: 'text-indigo-400', bar: 'bg-indigo-500' },
    green: { text: 'text-green-400', bar: 'bg-green-500' },
    emerald: { text: 'text-emerald-400', bar: 'bg-emerald-500' },
    rose: { text: 'text-rose-400', bar: 'bg-rose-500' },
    cyan: { text: 'text-cyan-400', bar: 'bg-cyan-500' },
    slate: { text: 'text-slate-400', bar: 'bg-slate-500' },
    blue: { text: 'text-blue-400', bar: 'bg-blue-500' }
  };

  const currentColors = colors[color] || (isSuper ? colors.green : (role === 'Admin' ? colors.emerald : colors.green));

  return (
    <button
        onClick={() => onClick(id)}
        className={`w-full flex items-center gap-4 px-6 py-3 text-sm font-black transition-all duration-300 relative group ${
        active ? 'bg-white/[0.05]' : 'text-slate-500 hover:text-white hover:bg-white/[0.02]'
        }`}
    >
        {active && <div className={`absolute left-0 top-0 bottom-0 w-1 ${currentColors.bar} shadow-[0_0_15px_rgba(34,197,94,0.8)]`}></div>}
        <Icon size={18} className={`transition-transform group-hover:scale-110 ${active ? currentColors.text : ''}`} />
        <span className={`flex-1 text-left uppercase tracking-[0.25em] text-[9px] font-black ${active ? 'text-hibernate' : 'opacity-70'}`}>{label}</span>
        {badge && <span className={`text-[7px] font-black ${currentColors.bar} text-black px-1.5 py-0.5 rounded leading-none animate-pulse`}>{badge}</span>}
    </button>
  );
};

const LOGO_URI = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 500 500'%3E%3Crect width='500' height='500' fill='%23010409'/%3E%3Cpath d='M100 100L400 250L100 400Z' fill='%2322c55e'/%3E%3Cg transform='translate(150, 250) scale(4)'%3E%3Cpath d='M0 -10L2.3 -3.1H9.5L3.6 1.2L5.9 8.1L0 3.8L-5.9 8.1L-3.6 1.2L-9.5 -3.1H-2.3Z' fill='%23010409'/%3E%3C/g%3E%3C/svg%3E";

export const App: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { addToast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [logs, setLogs] = useState<LogEntry[]>([
      { id: '1', timestamp: new Date().toLocaleTimeString(), level: 'INFO', message: 'TigApp Cluster Initialization Complete.' },
      { id: '2', timestamp: new Date().toLocaleTimeString(), level: 'SUCCESS', message: 'Neural Handshake established with Global Alpha Node.' }
  ]);
  
  const [users, setUsers] = useState<User[]>(() => {
      const saved = localStorage.getItem('tigapp_db_users');
      return saved ? JSON.parse(saved) : [];
  });

  const [marketPulse, setMarketPulse] = useState<any[]>([
    { symbol: 'BTC', price: 67245.50, change: '+2.4%' },
    { symbol: 'ETH', price: 3450.12, change: '+1.8%' },
    { symbol: 'BNB', price: 590.20, change: '-0.4%' }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
        setMarketPulse(prev => prev.map(p => ({
            ...p,
            price: p.price * (1 + (Math.random() - 0.5) * 0.001)
        })));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('tigapp_active_session', JSON.stringify(userData));
    addToast("Uplink Successful", `Authenticated as ${userData.role} node.`, "success");
  };

  const handleLogout = () => {
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem('tigapp_active_session');
      addToast("Uplink Terminated", "Session terminated safely.", "info");
  };

  if (!isAuthenticated) return <Auth onLogin={handleLogin} />;

  const miningStats: MiningStats = {
      hashrate: user?.role === 'Guest' ? 12.5 : 145.2,
      hashrateUnit: user?.role === 'Guest' ? 'MH/s' : 'TH/s',
      temperature: 42.0,
      power: user?.role === 'Guest' ? 120 : 3200,
      acceptedShares: 1420,
      rejectedShares: 12,
      fanSpeed: 80
  };

  const selectedCoin: CoinData = {
    symbol: 'BTC',
    name: 'Bitcoin',
    price: marketPulse.find(p => p.symbol === 'BTC')?.price || 67245.50,
    difficulty: '83.1T',
    profitability: 'High',
    color: '#22c55e',
    algorithm: MiningAlgorithm.SHA256
  };

  const isSuper = user?.role === 'Super Admin';
  const isFullScreenTool = ['vision', 'live'].includes(activeTab);

  return (
    <div className={`min-h-screen text-slate-200 font-mono flex overflow-hidden ${theme}`}>
        <aside className={`bg-black/80 backdrop-blur-3xl border-r border-green-500/10 w-72 flex-shrink-0 transition-all duration-500 flex flex-col z-30 shadow-2xl ${sidebarOpen ? 'translate-x-0' : '-translate-x-72 absolute h-full'}`}>
            <div className="p-8 flex items-center gap-5 border-b border-green-500/10 shrink-0">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-black text-white overflow-hidden shadow-[0_0_30px_rgba(34,197,94,0.3)] border border-green-500/30`}>
                    <img src={LOGO_URI} alt="Logo" className="w-full h-full object-cover" />
                </div>
                <span className={`font-black text-2xl tracking-tighter uppercase italic text-green-500 text-hibernate`}>TigApp</span>
            </div>
            
            <div className="flex-1 overflow-y-auto py-6 no-scrollbar">
                {/* Sector 1: Production */}
                <p className="px-8 text-[8px] font-black text-slate-500 uppercase mb-3 tracking-[0.5em] text-hibernate">Production Sector</p>
                <SidebarItem id="dashboard" icon={LayoutDashboard} label="Command Hub" active={activeTab === 'dashboard'} onClick={setActiveTab} />
                <SidebarItem id="mining" icon={Cpu} label="Mining Core" active={activeTab === 'mining'} onClick={setActiveTab} badge={user?.role === 'Guest' ? 'DEMO' : 'LIVE'} />
                <SidebarItem id="btc_maker" icon={Zap} label="Bitcoin Maker" active={activeTab === 'btc_maker'} onClick={setActiveTab} color="orange" badge="ELITE" />
                <SidebarItem id="forge" icon={Gem} label="Coin Forge" active={activeTab === 'forge'} onClick={setActiveTab} color="indigo" />
                <SidebarItem id="binance" icon={BarChart3} label="Binance Cloud" active={activeTab === 'binance'} onClick={setActiveTab} color="yellow" />
                <SidebarItem id="market" icon={TrendingUp} label="Global Market" active={activeTab === 'market'} onClick={setActiveTab} color="green" />

                {/* Sector 2: Revenue Matrix */}
                <p className="px-8 text-[8px] font-black text-slate-500 uppercase mt-8 mb-3 tracking-[0.5em] text-hibernate">Revenue Matrix</p>
                <SidebarItem id="earning" icon={Target} label="Quest Center" active={activeTab === 'earning'} onClick={setActiveTab} color="emerald" badge="HOT" />
                <SidebarItem id="wealth" icon={CircleDollarSign} label="Wealth Hub" active={activeTab === 'wealth'} onClick={setActiveTab} color="green" />
                <SidebarItem id="binance_news" icon={Newspaper} label="Binance Feed" active={activeTab === 'binance_news'} onClick={setActiveTab} color="yellow" />
                <SidebarItem id="news" icon={Globe} label="News Node" active={activeTab === 'news'} onClick={setActiveTab} color="cyan" />
                <SidebarItem id="onramp" icon={CreditCard} label="Fiat On-Ramp" active={activeTab === 'onramp'} onClick={setActiveTab} color="green" />
                <SidebarItem id="wallet" icon={Landmark} label="Bank Gateway" active={activeTab === 'wallet'} onClick={setActiveTab} color="green" badge="CBE" />

                {/* Sector 3: Neural Intelligence */}
                <p className="px-8 text-[8px] font-black text-slate-500 uppercase mt-8 mb-3 tracking-[0.5em] text-hibernate">Neural Layer</p>
                <SidebarItem id="consultant" icon={Bot} label="AI Architect" active={activeTab === 'consultant'} onClick={setActiveTab} color="indigo" badge="PRO" />
                <SidebarItem id="brain" icon={Rocket} label="Strategic Brain" active={activeTab === 'brain'} onClick={setActiveTab} color="indigo" />
                <SidebarItem id="intel" icon={Wifi} label="Node Intel" active={activeTab === 'intel'} onClick={setActiveTab} color="indigo" />
                <SidebarItem id="vision" icon={Eye} label="Rig Vision" active={activeTab === 'vision'} onClick={setActiveTab} color="indigo" />
                <SidebarItem id="live" icon={Mic} label="Voice Link" active={activeTab === 'live'} onClick={setActiveTab} color="indigo" />
                <SidebarItem id="lab" icon={Palette} label="Forge Lab" active={activeTab === 'lab'} onClick={setActiveTab} color="indigo" />

                {/* Sector 4: Defense & Trade */}
                <p className="px-8 text-[8px] font-black text-slate-500 uppercase mt-8 mb-3 tracking-[0.5em] text-hibernate">Security & Trade</p>
                <SidebarItem id="antivirus" icon={ShieldCheck} label="McAfee Scanner" active={activeTab === 'antivirus'} onClick={setActiveTab} color="rose" />
                <SidebarItem id="trading" icon={ArrowRightLeft} label="Xtrend Trading" active={activeTab === 'trading'} onClick={setActiveTab} color="emerald" />
                <SidebarItem id="security" icon={Shield} label="Security Hub" active={activeTab === 'security'} onClick={setActiveTab} color="slate" />
                <SidebarItem id="social" icon={Share2} label="Social Hub" active={activeTab === 'social'} onClick={setActiveTab} color="slate" />
                <SidebarItem id="vpn" icon={Globe2} label="VPN Shield" active={activeTab === 'vpn'} onClick={setActiveTab} color="blue" />

                {/* Sector 5: System Kernels */}
                <p className="px-8 text-[8px] font-black text-slate-500 uppercase mt-8 mb-3 tracking-[0.5em] text-hibernate">OS Kernels</p>
                <SidebarItem id="logs" icon={FileText} label="System Logs" active={activeTab === 'logs'} onClick={setActiveTab} />
                <SidebarItem id="database" icon={Database} label="Persistence" active={activeTab === 'database'} onClick={setActiveTab} />
                <SidebarItem id="platforms" icon={Layers} label="Platform SDK" active={activeTab === 'platforms'} onClick={setActiveTab} />
                <SidebarItem id="install" icon={Download} label="Install Portal" active={activeTab === 'install'} onClick={setActiveTab} color="green" />
                <SidebarItem id="resources" icon={BookOpen} label="Node Resources" active={activeTab === 'resources'} onClick={setActiveTab} />

                {/* Sector 6: Identity */}
                <p className="px-8 text-[8px] font-black text-slate-500 uppercase mt-8 mb-3 tracking-[0.5em] text-hibernate">Identity</p>
                <SidebarItem id="admin" icon={Users} label="Node Registry" active={activeTab === 'admin'} onClick={setActiveTab} />
                <SidebarItem id="verify" icon={Fingerprint} label="Identity Audit" active={activeTab === 'verify'} onClick={setActiveTab} color="rose" />
                <SidebarItem id="web" icon={Monitor} label="Public Platform" active={activeTab === 'web'} onClick={setActiveTab} color="indigo" />
                <SidebarItem id="settings" icon={Settings} label="Node Config" active={activeTab === 'settings'} onClick={setActiveTab} />
            </div>

            <div className="p-8 border-t border-green-500/10 bg-black/40 shrink-0">
                <div className="flex items-center gap-4 mb-6 group cursor-pointer" onClick={() => setActiveTab('settings')}>
                    <div className={`w-12 h-12 rounded-lg bg-slate-900 overflow-hidden border-2 transition-all duration-500 shadow-xl ${isSuper ? 'border-green-500' : 'border-green-800/50'}`}>
                        {user?.avatar ? <img src={user.avatar} alt="User" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-500"><UserIcon size={24}/></div>}
                    </div>
                    <div className="overflow-hidden">
                        <div className="font-black text-green-400 text-xs truncate flex items-center gap-1.5 uppercase tracking-tighter italic">
                            {user?.name}
                            {isSuper ? <Crown size={12} className="text-green-500" /> : user?.verificationStatus === 'verified' && <ShieldCheck size={12} className="text-emerald-500" />}
                        </div>
                        <div className={`text-[8px] font-black tracking-widest uppercase text-slate-500`}>{user?.role} NODE</div>
                    </div>
                </div>
                <button onClick={handleLogout} className="w-full bg-red-600/5 hover:bg-red-600/20 hover:text-red-400 text-slate-600 py-3 rounded-xl text-[8px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all border border-red-900/20">
                    <LogOut size={14} /> HALT SYSTEM
                </button>
            </div>
        </aside>

        <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
            <header className="bg-black/20 backdrop-blur-3xl border-b border-green-500/10 h-20 flex items-center justify-between px-10 z-20 shrink-0">
                <div className="flex items-center gap-8">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-green-800 hover:text-green-400 transition-all transform active:scale-90">
                        <Menu size={24} />
                    </button>
                    <div className="flex flex-col">
                      <h2 className="font-black text-green-500 uppercase tracking-[0.4em] text-xs text-hibernate">
                        {activeTab.toUpperCase()} ACTIVE
                      </h2>
                      <div className="flex items-center gap-2.5 mt-1">
                        <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isSuper ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-emerald-600'}`}></div>
                        <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.5em]">
                          KERNEL STATE: {isSuper ? 'ROOT SOVEREIGN' : (user?.role === 'Guest' ? 'SANDBOX' : 'MAINNET LINKED')}
                        </span>
                      </div>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    {isSuper && (
                        <div className="hidden lg:flex items-center gap-2 bg-green-500/5 px-4 py-2 rounded-lg border border-green-500/20">
                            <Crown size={14} className="text-green-500" />
                            <span className="text-[9px] font-black text-green-500 uppercase tracking-0.3em]">Master Override Active</span>
                        </div>
                    )}
                    <div className="hidden md:flex items-center gap-3 bg-green-500/5 px-5 py-2.5 rounded-xl border border-green-500/10 shadow-inner">
                      <Zap size={18} className="text-green-400" />
                      <span className="text-xs font-black text-green-400 uppercase tracking-[0.2em]">{miningStats.hashrate} {miningStats.hashrateUnit}</span>
                    </div>
                    <button className="w-12 h-12 bg-black/60 rounded-xl flex items-center justify-center text-green-800 hover:text-green-400 transition-all transform active:scale-90 border border-green-500/10 glass-shadow">
                        <RefreshCw size={20} className="animate-spin-slow" />
                    </button>
                </div>
            </header>

            <div className={`flex-1 ${isFullScreenTool ? 'h-full overflow-hidden' : 'overflow-y-auto'}`}>
                <div className={`${isFullScreenTool ? 'h-full' : 'p-6 md:p-12 max-w-7xl mx-auto'}`}>
                    {activeTab === 'dashboard' && (
                        <div className="space-y-12 animate-in fade-in duration-1000 pb-20">
                            <PromoCarousel />
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                <StatBox label="SYNC BALANCE" value={user?.role === 'Guest' ? "$1,240.00" : (isSuper ? "$12,842,520.42" : "$3,842,520.42")} shimmer />
                                <StatBox label="CORE HASHRATE" value={`${miningStats.hashrate} ${miningStats.hashrateUnit}`} />
                                <StatBox label="NODE STABILITY" value={isSuper || user?.verificationStatus === 'verified' ? '100.0%' : '20.0%'} color="text-emerald-500" />
                                <StatBox label="TEMP READOUT" value="45.5°C" />
                            </div>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                                <div className={`lg:col-span-8 bg-black/40 backdrop-blur-3xl p-12 rounded-[2.5rem] border border-green-500/10 shadow-2xl relative overflow-hidden group`}>
                                    <div className="flex justify-between items-center mb-12">
                                    <h3 className="text-xl font-black text-green-500 uppercase tracking-[0.5em] italic text-hibernate">Market Telemetry :: Binance</h3>
                                    <button onClick={() => setActiveTab('wealth')} className={`text-[9px] font-black uppercase tracking-[0.3em] px-8 py-3 rounded-lg border transition-all bg-green-500/5 text-green-500 border-green-500/20 hover:bg-green-500 hover:text-black`}>Open Pipeline</button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        {marketPulse.map((ticker) => (
                                            <div key={ticker.symbol} className="bg-black/60 p-8 rounded-2xl border border-green-500/5 group hover:border-green-500/30 transition-all shadow-inner">
                                                <div className="flex justify-between items-center mb-4">
                                                    <span className="font-black text-slate-500 text-[10px] tracking-[0.3em]">{ticker.symbol}/USDT</span>
                                                    <span className={`text-[10px] font-black ${ticker.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{ticker.change}</span>
                                                </div>
                                                <div className="text-3xl font-black text-white font-mono tracking-tighter text-smart-shimmer">
                                                    ${ticker.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="lg:col-span-4 space-y-10">
                                    <AIAdvisor stats={miningStats} algorithm={MiningAlgorithm.SHA256} hardware={HardwareType.ASIC} />
                                    <ProfitPredictor />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* PROTOCOL SWITCHER - COMPREHENSIVE LIST */}
                    {activeTab === 'btc_maker' && <BitcoinMaker />}
                    {activeTab === 'forge' && <CoinForge />}
                    {activeTab === 'binance_news' && <BinanceNewsFeed />}
                    {activeTab === 'news' && <MarketNewsHub coinSymbol={selectedCoin.symbol} />}
                    {activeTab === 'onramp' && <FiatOnRamp user={user} selectedCoin={selectedCoin} />}
                    {activeTab === 'wealth' && <GlobalWealthHub />}
                    {activeTab === 'antivirus' && <McAfeeScanner />}
                    {activeTab === 'earning' && <MoneyApps />}
                    {activeTab === 'consultant' && <AIConsultant stats={miningStats} />}
                    {activeTab === 'brain' && <AIBrain />}
                    {activeTab === 'vision' && <AIVision />}
                    {activeTab === 'live' && <AILiveLink />}
                    {activeTab === 'lab' && <AILab onUpdateAvatar={(url) => setUser(u => u ? {...u, avatar: url} : null)} />}
                    {activeTab === 'intel' && <NodeIntel stats={miningStats} />}
                    {activeTab === 'binance' && <div className="h-full"><BinanceMarket onNavigate={setActiveTab} /></div>}
                    {activeTab === 'market' && <CryptoMarket />}
                    {activeTab === 'trading' && <XtrendInterface />}
                    {activeTab === 'social' && <SocialShare />}
                    {activeTab === 'mining' && <MiningServer isMining={true} onToggle={() => {}} stats={miningStats} algorithm={MiningAlgorithm.SHA256} onAlgorithmChange={() => {}} />}
                    {activeTab === 'wallet' && <BankIntegration balance={56789} selectedCoin={selectedCoin} currentUser={user} onTransaction={() => {}} />}
                    {activeTab === 'verify' && user && <div className="h-full flex items-center justify-center"><div className="w-full max-w-3xl"><VerificationCenter user={user} onVerificationUpdate={(s) => user && setUser({...user, verificationStatus: s})} /></div></div>}
                    {activeTab === 'security' && <SecurityCenter onNavigate={setActiveTab} />}
                    {activeTab === 'settings' && user && <div className="space-y-12"><UserProfile user={user} onUpdate={setUser} /><SecuritySettings /><APIManagement /></div>}
                    {activeTab === 'admin' && <UserManagement users={user?.role === 'Guest' ? users.filter(u => u.parentId === user.id) : users} setUsers={setUsers} currentUser={user} />}
                    {activeTab === 'logs' && <SystemLogs logs={logs} />}
                    {activeTab === 'database' && <DatabaseManager />}
                    {activeTab === 'platforms' && <PlatformIntegrations />}
                    {activeTab === 'web' && <WebPlatform />}
                    {activeTab === 'install' && <InstallPortal reviews={[]} />}
                    {activeTab === 'vpn' && <VPNInterface />}
                    {activeTab === 'resources' && <MiningResources />}
                </div>
            </div>
            
            <AIAssistant />
        </main>
    </div>
  );
};

const StatBox = ({ label, value, color = "text-white", shimmer }: any) => (
  <div className="bg-black/60 backdrop-blur-2xl p-8 rounded-[2rem] border border-green-500/10 group hover:border-green-500/40 transition-all duration-500 shadow-2xl relative overflow-hidden">
    <div className="absolute -right-6 -top-6 w-32 h-32 bg-green-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
    <div className="text-[9px] text-slate-600 mb-3 font-black uppercase tracking-[0.5em] text-hibernate">{label}</div>
    <div className={`text-4xl font-black font-mono tracking-tighter ${color} text-hibernate ${shimmer ? 'text-smart-shimmer' : ''} group-hover:scale-105 transition-transform origin-left text-wrap`}>{value}</div>
  </div>
);
