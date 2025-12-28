
import React, { useState } from 'react';
import { BookOpen, CheckCircle2, Globe, Play, ExternalLink, Monitor, Cpu, Wifi, HardDrive, Tv } from 'lucide-react';

export const MiningResources: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'GUIDES' | 'TUTORIALS'>('GUIDES');
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  const REQUIREMENTS = [
    { icon: <Cpu size={20}/>, title: "Hardware", desc: "NVIDIA RTX 3060+ or ASIC Miner (Antminer S19)" },
    { icon: <Monitor size={20}/>, title: "OS Environment", desc: "Windows 10/11 (64-bit) or Ubuntu 20.04 LTS" },
    { icon: <HardDrive size={20}/>, title: "System Memory", desc: "Minimum 8GB RAM (16GB Recommended) + 50GB SSD" },
    { icon: <Wifi size={20}/>, title: "Network", desc: "Stable Broadband Connection (Ping < 50ms)" },
  ];

  const PORTALS = [
    { name: "NiceHash", url: "nicehash.com", region: "Global", status: "Active", color: "text-orange-400" },
    { name: "Binance Pool", url: "pool.binance.com", region: "Asia/Global", status: "Active", color: "text-yellow-400" },
    { name: "F2Pool", url: "f2pool.com", region: "Global", status: "Active", color: "text-blue-400" },
    { name: "Ethermine", url: "ethermine.org", region: "US/EU", status: "Active", color: "text-purple-400" },
    { name: "AntPool", url: "antpool.com", region: "CN/Global", status: "Active", color: "text-red-400" },
    { name: "ViaBTC", url: "viabtc.com", region: "Global", status: "Active", color: "text-green-400" },
  ];

  const VIDEOS = [
    { id: 'v1', title: "Getting Started with PrimeMine", duration: "5:20", thumb: "https://images.unsplash.com/photo-1624996379697-f01d168b1a52?auto=format&fit=crop&w=400&q=80" },
    { id: 'v2', title: "How to Connect Your Wallet", duration: "3:15", thumb: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=400&q=80" },
    { id: 'v3', title: "Optimizing GPU Overclocking", duration: "8:45", thumb: "https://images.unsplash.com/photo-1591405351990-4726e331f141?auto=format&fit=crop&w=400&q=80" },
    { id: 'v4', title: "Understanding Payout Methods", duration: "4:10", thumb: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=400&q=80" },
  ];

  return (
    <div className="p-6 space-y-6 animate-in fade-in slide-in-from-bottom-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-4">
            <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <BookOpen className="text-indigo-500" /> Mining Resources & Learning Center
                </h2>
                <p className="text-slate-400 text-sm mt-1">Global mining requirements, pool portals, and video tutorials.</p>
            </div>
            <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-800">
               <button 
                 onClick={() => setActiveTab('GUIDES')}
                 className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-colors ${activeTab === 'GUIDES' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
               >
                 <Globe size={16} /> Portals & Req.
               </button>
               <button 
                 onClick={() => setActiveTab('TUTORIALS')}
                 className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-colors ${activeTab === 'TUTORIALS' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
               >
                 <Tv size={16} /> Video Tutorials
               </button>
            </div>
        </div>

        {activeTab === 'GUIDES' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Requirements Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                        <CheckCircle2 className="text-green-500" size={20} /> System Requirements
                    </h3>
                    <div className="space-y-4">
                        {REQUIREMENTS.map((req, idx) => (
                            <div key={idx} className="flex items-start gap-4 p-3 rounded-lg bg-slate-950 border border-slate-800">
                                <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
                                    {req.icon}
                                </div>
                                <div>
                                    <h4 className="text-white text-sm font-bold">{req.title}</h4>
                                    <p className="text-slate-400 text-xs mt-1">{req.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Global Portals Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                        <Globe className="text-blue-500" size={20} /> Global Mining Portals
                    </h3>
                    <div className="space-y-2">
                        {PORTALS.map((portal, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-800 transition-colors group border border-transparent hover:border-slate-700">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full bg-green-500`}></div>
                                    <div>
                                        <div className={`text-sm font-bold ${portal.color}`}>{portal.name}</div>
                                        <div className="text-xs text-slate-500">{portal.region}</div>
                                    </div>
                                </div>
                                <a href={`https://${portal.url}`} target="_blank" rel="noreferrer" className="text-xs text-slate-400 hover:text-white flex items-center gap-1 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                                    {portal.url} <ExternalLink size={10} />
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'TUTORIALS' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {VIDEOS.map((video) => (
                    <div key={video.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden group hover:border-indigo-500/50 transition-all shadow-lg hover:shadow-indigo-500/10">
                        <div className="relative aspect-video bg-black">
                            <img src={video.thumb} alt={video.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <button 
                                    onClick={() => setPlayingVideo(video.id)}
                                    className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform"
                                >
                                    <Play size={24} fill="white" className="ml-1" />
                                </button>
                            </div>
                            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] px-2 py-1 rounded font-mono">
                                {video.duration}
                            </div>
                        </div>
                        <div className="p-4">
                            <h4 className="text-white font-bold text-sm line-clamp-2 mb-2 group-hover:text-indigo-400 transition-colors">
                                {video.title}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <span className="bg-slate-800 px-2 py-0.5 rounded">New Customer</span>
                                <span>• Tutorials</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}

        {/* Video Player Modal Simulation */}
        {playingVideo && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in">
                <div className="w-full max-w-4xl aspect-video bg-black rounded-xl border border-slate-800 shadow-2xl relative flex flex-col items-center justify-center">
                    <button 
                        onClick={() => setPlayingVideo(null)}
                        className="absolute top-4 right-4 text-white hover:text-red-500 transition-colors"
                    >
                        Close
                    </button>
                    <div className="text-indigo-500 animate-pulse mb-4">
                        <Play size={64} />
                    </div>
                    <div className="text-white font-bold text-xl">Video Player Simulation</div>
                    <p className="text-slate-400 text-sm mt-2">In a production app, this would stream the actual video content.</p>
                </div>
            </div>
        )}
    </div>
  );
};
