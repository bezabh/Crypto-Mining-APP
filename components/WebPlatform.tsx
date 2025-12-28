
import React, { useState } from 'react';
import { Globe, Layout, Eye, Save, ExternalLink, BarChart, Smartphone, Monitor, CheckCircle2, Globe2, ToggleLeft, ToggleRight, Share2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export const WebPlatform: React.FC = () => {
  const [isPublished, setIsPublished] = useState(false);
  const [siteTitle, setSiteTitle] = useState('Prime Mining Farm');
  const [description, setDescription] = useState('Professional crypto mining operation powered by AI.');
  const [theme, setTheme] = useState<'DARK' | 'LIGHT' | 'CYBER'>('DARK');
  const [viewMode, setViewMode] = useState<'DESKTOP' | 'MOBILE'>('DESKTOP');
  
  // Widget Toggles
  const [showHashrate, setShowHashrate] = useState(true);
  const [showPayouts, setShowPayouts] = useState(true);
  const [showUptime, setShowUptime] = useState(true);

  // Mock Analytics Data
  const visitorData = [
    { day: 'Mon', visits: 120 },
    { day: 'Tue', visits: 145 },
    { day: 'Wed', visits: 290 },
    { day: 'Thu', visits: 210 },
    { day: 'Fri', visits: 450 },
    { day: 'Sat', visits: 380 },
    { day: 'Sun', visits: 520 },
  ];

  const handlePublish = () => {
    setIsPublished(true);
  };

  return (
    <div className="p-6 space-y-6 animate-in fade-in slide-in-from-bottom-4">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Globe2 className="text-indigo-500" /> Public Web Platform
          </h2>
          <p className="text-slate-400 text-sm mt-1">Build and host a public website for your mining operation to attract investors.</p>
        </div>
        
        <div className="flex gap-3">
           {isPublished && (
             <button className="bg-slate-900 border border-slate-700 text-slate-300 hover:text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors">
                <ExternalLink size={16} /> Visit Live Site
             </button>
           )}
           <button 
             onClick={handlePublish}
             disabled={isPublished}
             className={`px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors ${
                isPublished 
                ? 'bg-green-600/20 text-green-400 border border-green-600/30 cursor-default' 
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg'
             }`}
           >
             {isPublished ? <><CheckCircle2 size={16} /> Published</> : <><Save size={16} /> Publish Changes</>}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-200px)]">
         
         {/* Editor Sidebar (Left) */}
         <div className="lg:col-span-4 space-y-6 overflow-y-auto pr-2">
            
            {/* Status Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
               <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold text-slate-500 uppercase">Platform Status</span>
                  <div className={`flex items-center gap-2 text-xs font-bold ${isPublished ? 'text-green-400' : 'text-yellow-400'}`}>
                     <span className={`w-2 h-2 rounded-full ${isPublished ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`}></span>
                     {isPublished ? 'ONLINE' : 'DRAFT MODE'}
                  </div>
               </div>
               <div className="bg-slate-950 rounded-lg p-3 border border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-mono">primemine.ai/u/bezabh</span>
                  <button className="text-indigo-400 hover:text-white"><Share2 size={14}/></button>
               </div>
            </div>

            {/* General Settings */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
               <h3 className="font-bold text-white flex items-center gap-2"><Layout size={18} className="text-indigo-400"/> General Settings</h3>
               
               <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Site Title</label>
                  <input 
                    type="text" 
                    value={siteTitle}
                    onChange={(e) => setSiteTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-indigo-500 outline-none text-sm"
                  />
               </div>

               <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description</label>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-indigo-500 outline-none text-sm resize-none h-24"
                  />
               </div>

               <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Theme Preset</label>
                  <div className="grid grid-cols-3 gap-2">
                     {['DARK', 'LIGHT', 'CYBER'].map((t) => (
                        <button 
                           key={t}
                           onClick={() => setTheme(t as any)}
                           className={`py-2 rounded-lg text-xs font-bold border transition-all ${
                              theme === t 
                              ? 'bg-indigo-600 border-indigo-500 text-white' 
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600'
                           }`}
                        >
                           {t}
                        </button>
                     ))}
                  </div>
               </div>
            </div>

            {/* Widget Visibility */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
               <h3 className="font-bold text-white flex items-center gap-2"><Eye size={18} className="text-blue-400"/> Public Widgets</h3>
               
               <div className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-sm text-slate-300">Live Hashrate</span>
                  <button onClick={() => setShowHashrate(!showHashrate)} className="text-indigo-500">
                     {showHashrate ? <ToggleRight size={28} /> : <ToggleLeft size={28} className="text-slate-600" />}
                  </button>
               </div>

               <div className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-sm text-slate-300">Payout History</span>
                  <button onClick={() => setShowPayouts(!showPayouts)} className="text-indigo-500">
                     {showPayouts ? <ToggleRight size={28} /> : <ToggleLeft size={28} className="text-slate-600" />}
                  </button>
               </div>

               <div className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-sm text-slate-300">Uptime Status</span>
                  <button onClick={() => setShowUptime(!showUptime)} className="text-indigo-500">
                     {showUptime ? <ToggleRight size={28} /> : <ToggleLeft size={28} className="text-slate-600" />}
                  </button>
               </div>
            </div>

            {/* Visitor Analytics */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
               <h3 className="font-bold text-white flex items-center gap-2 mb-4"><BarChart size={18} className="text-emerald-400"/> Visitor Traffic</h3>
               <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={visitorData}>
                        <defs>
                           <linearGradient id="visitGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                           </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis dataKey="day" tick={{fontSize: 10, fill: '#64748b'}} axisLine={false} tickLine={false} />
                        <Tooltip 
                           contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px'}}
                           itemStyle={{color: '#fff'}}
                        />
                        <Area type="monotone" dataKey="visits" stroke="#10b981" fill="url(#visitGrad)" strokeWidth={2} />
                     </AreaChart>
                  </ResponsiveContainer>
               </div>
            </div>

         </div>

         {/* Live Preview (Right) */}
         <div className="lg:col-span-8 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col overflow-hidden shadow-2xl relative">
            
            {/* Browser Toolbar */}
            <div className="bg-slate-900 border-b border-slate-800 p-3 flex items-center justify-between">
               <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
               </div>
               <div className="bg-slate-950 border border-slate-800 rounded-md px-3 py-1 text-xs text-slate-500 flex items-center gap-2 min-w-[200px] justify-center">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  https://primemine.ai/u/bezabh...
               </div>
               <div className="flex gap-2 text-slate-500">
                  <button onClick={() => setViewMode('DESKTOP')} className={viewMode === 'DESKTOP' ? 'text-white' : 'hover:text-white'}><Monitor size={16}/></button>
                  <button onClick={() => setViewMode('MOBILE')} className={viewMode === 'MOBILE' ? 'text-white' : 'hover:text-white'}><Smartphone size={16}/></button>
               </div>
            </div>

            {/* Preview Viewport */}
            <div className="flex-1 bg-slate-950 flex items-center justify-center p-8 overflow-y-auto">
               <div 
                  className={`bg-white dark:bg-black transition-all duration-500 shadow-2xl overflow-hidden relative ${
                     viewMode === 'MOBILE' ? 'w-[375px] h-[667px] rounded-[2rem] border-8 border-slate-800' : 'w-full h-full rounded-lg border border-slate-800'
                  }`}
                  style={{
                     backgroundColor: theme === 'LIGHT' ? '#f8fafc' : (theme === 'CYBER' ? '#09090b' : '#0f172a'),
                     color: theme === 'LIGHT' ? '#0f172a' : '#fff'
                  }}
               >
                  {/* Website Content Mockup */}
                  <div className="h-full overflow-y-auto scrollbar-thin">
                     
                     {/* Hero */}
                     <div className={`p-8 text-center ${theme === 'CYBER' ? 'bg-gradient-to-b from-purple-900/20 to-transparent' : 'bg-gradient-to-b from-indigo-500/10 to-transparent'}`}>
                        <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                           PM
                        </div>
                        <h1 className={`text-3xl font-black mb-2 ${theme === 'CYBER' ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400' : ''}`}>
                           {siteTitle}
                        </h1>
                        <p className={`text-sm max-w-md mx-auto ${theme === 'LIGHT' ? 'text-slate-600' : 'text-slate-400'}`}>
                           {description}
                        </p>
                     </div>

                     {/* Stats Grid */}
                     <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {showHashrate && (
                           <div className={`p-4 rounded-xl border ${theme === 'LIGHT' ? 'bg-white border-slate-200' : 'bg-white/5 border-white/10'}`}>
                              <div className="text-xs font-bold opacity-60 uppercase mb-1">Live Hashrate</div>
                              <div className="text-2xl font-mono font-bold flex items-center gap-2">
                                 145.2 <span className="text-sm opacity-60">TH/s</span>
                                 <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                              </div>
                           </div>
                        )}
                        {showUptime && (
                           <div className={`p-4 rounded-xl border ${theme === 'LIGHT' ? 'bg-white border-slate-200' : 'bg-white/5 border-white/10'}`}>
                              <div className="text-xs font-bold opacity-60 uppercase mb-1">System Uptime</div>
                              <div className="text-2xl font-mono font-bold text-green-500">99.99%</div>
                           </div>
                        )}
                     </div>

                     {/* Payout Table */}
                     {showPayouts && (
                        <div className="p-6 pt-0">
                           <h3 className="font-bold text-sm mb-4 uppercase opacity-60 tracking-wider">Recent Payouts</h3>
                           <div className={`rounded-xl border overflow-hidden ${theme === 'LIGHT' ? 'bg-white border-slate-200' : 'bg-white/5 border-white/10'}`}>
                              {[1,2,3].map(i => (
                                 <div key={i} className={`flex justify-between p-3 text-sm border-b last:border-0 ${theme === 'LIGHT' ? 'border-slate-100' : 'border-white/5'}`}>
                                    <span className="font-mono opacity-70">2023-10-{20+i}</span>
                                    <span className="font-bold text-green-500">0.0241 BTC</span>
                                 </div>
                              ))}
                           </div>
                        </div>
                     )}

                     {/* Footer */}
                     <div className="p-8 text-center text-xs opacity-40">
                        <p>Powered by PrimeMine AI &copy; 2024</p>
                     </div>

                  </div>
               </div>
            </div>

         </div>

      </div>
    </div>
  );
};
