
import React, { useState, useEffect } from 'react';
import { Smartphone, Download, Terminal, Copy, CheckCircle2, Shield, Cpu, QrCode, Server, Play, Lock, Check, AlertTriangle, Settings, Box } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

interface DownloadCenterProps {
  installPrompt?: any;
  onInstall?: () => void;
}

export const DownloadCenter: React.FC<DownloadCenterProps> = ({ installPrompt, onInstall }) => {
  const [activeTab, setActiveTab] = useState<'ANDROID' | 'LINUX'>('ANDROID');
  const [copied, setCopied] = useState(false);
  const { addToast } = useToast();
  
  // License & System State
  const [hasLicense, setHasLicense] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'HALF' | 'FULL'>('FULL');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // System Check State
  const [isCheckingSystem, setIsCheckingSystem] = useState(false);
  const [systemCheckComplete, setSystemCheckComplete] = useState(false);

  const installScript = "curl -sL https://primemine.ai/install.sh | sudo bash";

  const downloadManualGuide = () => {
      // Safe fallback: Text file instructions instead of corrupted APK
      const content = `
PRIME MINE AI - MANUAL INSTALLATION GUIDE
=========================================
Version: 2.5.0 (WebAPK Release)

Your device requires the secure WebAPK installation method.

INSTRUCTIONS:
1. Return to the web dashboard in Google Chrome.
2. Tap the Menu (3 dots top right).
3. Select "Install App" or "Add to Home Screen".
4. Confirm installation.

This ensures:
- Native fullscreen performance
- Background mining capabilities
- Automatic updates
- Zero commission fees

Support: help@primemine.ai
      `;
      
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = "PrimeMine_Install_Guide.txt"; 
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      addToast("Guide Downloaded", "Follow instructions in PrimeMine_Install_Guide.txt", "info");
  };

  const handleDownloadAttempt = () => {
      if (!hasLicense) {
          setShowPaymentModal(true);
          return;
      }

      if (activeTab === 'LINUX') {
          handleCopy();
      } else {
          // Android Logic: Prefer Native Install, Fallback to Guide
          if (onInstall && installPrompt) {
              onInstall();
          } else {
              // If no native prompt available (already installed or iOS), show guide
              downloadManualGuide();
          }
      }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(installScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addToast("Copied to Clipboard", "Install script copied. Paste into your terminal.", "success");
  };

  const handlePurchase = () => {
      setIsProcessing(true);
      setTimeout(() => {
          setIsProcessing(false);
          setHasLicense(true);
          setShowPaymentModal(false);
          addToast("License Activated", "Payment successful! System requirements upgraded.", "success");
          
          // Run System Check Animation
          setIsCheckingSystem(true);
          setTimeout(() => {
              setSystemCheckComplete(true);
              setIsCheckingSystem(false);
          }, 2000);

      }, 2000);
  };

  return (
    <div className="p-6 space-y-6 relative">
       
       {/* LICENSE PAYMENT MODAL */}
       {showPaymentModal && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in zoom-in duration-200">
               <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">
                   <div className="bg-indigo-600 p-6 text-center">
                       <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                           <Lock size={32} className="text-white" />
                       </div>
                       <h3 className="text-2xl font-black text-white uppercase tracking-tight">Miner License Required</h3>
                       <p className="text-indigo-100 text-sm mt-2">
                           To deploy the native PrimeMine software, a valid operational license is required.
                       </p>
                   </div>
                   
                   <div className="p-6 space-y-6">
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                           <button 
                               onClick={() => setSelectedPlan('HALF')}
                               className={`relative p-4 rounded-xl border-2 text-left transition-all ${selectedPlan === 'HALF' ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-700 bg-slate-800 hover:border-slate-600'}`}
                           >
                               <div className="flex justify-between items-start mb-2">
                                   <span className="text-xs font-bold text-slate-400 uppercase">Half Year</span>
                                   {selectedPlan === 'HALF' && <CheckCircle2 size={16} className="text-indigo-500" />}
                               </div>
                               <div className="text-2xl font-bold text-white mb-1">$200</div>
                               <div className="text-xs text-slate-400">6 Months Access</div>
                           </button>

                           <button 
                               onClick={() => setSelectedPlan('FULL')}
                               className={`relative p-4 rounded-xl border-2 text-left transition-all ${selectedPlan === 'FULL' ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-700 bg-slate-800 hover:border-slate-600'}`}
                           >
                               <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                                   Best Value
                               </div>
                               <div className="flex justify-between items-start mb-2">
                                   <span className="text-xs font-bold text-slate-400 uppercase">Full Year</span>
                                   {selectedPlan === 'FULL' && <CheckCircle2 size={16} className="text-emerald-500" />}
                               </div>
                               <div className="text-2xl font-bold text-white mb-1">$300</div>
                               <div className="text-xs text-slate-400">12 Months Access</div>
                           </button>
                       </div>

                       <div className="space-y-3">
                           <button 
                               onClick={handlePurchase}
                               disabled={isProcessing}
                               className="w-full bg-white text-slate-900 font-bold py-4 rounded-xl shadow-lg hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
                           >
                               {isProcessing ? 'Processing Payment...' : `Pay $${selectedPlan === 'FULL' ? 300 : 200} & Upgrade System`}
                           </button>
                           <button 
                               onClick={() => setShowPaymentModal(false)}
                               className="w-full text-slate-500 text-xs hover:text-white"
                           >
                               Cancel
                           </button>
                       </div>
                   </div>
               </div>
           </div>
       )}

       {/* Header */}
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Download className="text-indigo-500" /> Download Center
          </h2>
          <p className="text-slate-400 text-sm mt-1">Install PrimeMine AI native clients on your devices.</p>
        </div>
        
        <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-800">
           <button 
             onClick={() => setActiveTab('ANDROID')}
             className={`px-6 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-colors ${activeTab === 'ANDROID' ? 'bg-green-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
           >
             <Smartphone size={16} /> Android
           </button>
           <button 
             onClick={() => setActiveTab('LINUX')}
             className={`px-6 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-colors ${activeTab === 'LINUX' ? 'bg-orange-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
           >
             <Terminal size={16} /> Linux
           </button>
        </div>
      </div>

      {/* System Requirement Status Panel */}
      {hasLicense && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 animate-in fade-in slide-in-from-top-4">
              <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-bold flex items-center gap-2">
                      <Settings size={18} className="text-indigo-400" /> System Compatibility Check
                  </h3>
                  {isCheckingSystem && <span className="text-xs text-yellow-400 animate-pulse">Analyzing Device...</span>}
                  {systemCheckComplete && <span className="text-xs text-green-400 font-bold flex items-center gap-1"><CheckCircle2 size={14}/> All Systems Go</span>}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
                      <span className="text-xs text-slate-400">Android Runtime</span>
                      {isCheckingSystem ? <div className="w-4 h-4 border-2 border-slate-600 border-t-transparent rounded-full animate-spin"></div> : <Check size={16} className="text-green-500" />}
                  </div>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
                      <span className="text-xs text-slate-400">Parse Engine</span>
                      {isCheckingSystem ? <div className="w-4 h-4 border-2 border-slate-600 border-t-transparent rounded-full animate-spin"></div> : <span className="text-xs font-bold text-green-400">Upgraded (v2.5)</span>}
                  </div>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
                      <span className="text-xs text-slate-400">Package Security</span>
                      {isCheckingSystem ? <div className="w-4 h-4 border-2 border-slate-600 border-t-transparent rounded-full animate-spin"></div> : <Shield size={16} className="text-green-500" />}
                  </div>
              </div>
          </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2">
            
            {/* ANDROID SECTION */}
            {activeTab === 'ANDROID' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-left-4">
                    <div className="bg-gradient-to-br from-green-900/40 to-slate-900 border border-green-500/30 rounded-2xl p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                        
                        <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
                            <div className="w-48 h-auto bg-slate-950 border-4 border-slate-800 rounded-[2.5rem] p-2 shadow-2xl hidden sm:block">
                                <div className="w-full h-full bg-slate-900 rounded-[2rem] overflow-hidden flex flex-col items-center justify-center relative">
                                    <div className="absolute top-0 w-24 h-6 bg-slate-800 rounded-b-xl"></div>
                                    <img 
                                        src="https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=400&h=400&fit=crop&auto=format" 
                                        alt="Mobile App" 
                                        className="w-20 h-20 rounded-xl mb-4 shadow-lg shadow-green-500/20"
                                    />
                                    <div className="text-white font-bold text-lg">PrimeMine</div>
                                    <div className="text-slate-500 text-xs mb-6">Mobile Miner v2.5</div>
                                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                                        <Play fill="white" className="text-white ml-1" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 space-y-6">
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-2">PrimeMine Mobile Miner</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">
                                        Turn your spare Android devices into mining nodes. Features background mining, battery optimization, and real-time dashboard sync.
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button 
                                        onClick={handleDownloadAttempt}
                                        className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-600/20 flex items-center justify-center gap-2 transition-all"
                                    >
                                        {hasLicense ? (
                                            installPrompt ? <><Download size={20} /> Install App (PWA)</> : <><Box size={20} /> Download Installer</>
                                        ) : (
                                            <><Lock size={20} /> Purchase License</>
                                        )}
                                    </button>
                                    <div className="bg-white p-2 rounded-xl w-fit hidden sm:block">
                                        <QrCode className="text-black" size={48} />
                                    </div>
                                </div>
                                {hasLicense && !installPrompt && (
                                    <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-lg text-xs text-blue-200 flex items-start gap-2">
                                        <CheckCircle2 size={14} className="mt-0.5 text-blue-400" />
                                        <span>System Ready. Tap "Download Installer" if native prompt doesn't appear.</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* LINUX SECTION */}
            {activeTab === 'LINUX' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-0 overflow-hidden font-mono text-sm shadow-2xl">
                        <div className="bg-slate-900 p-3 border-b border-slate-800 flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <div className="ml-4 text-slate-500">user@rig-01: ~</div>
                        </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <div className="text-slate-400 mb-2"># Quick Install (Ubuntu/Debian/CentOS)</div>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-4 text-green-400 break-all relative">
                                        {!hasLicense && (
                                            <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-[2px] flex items-center justify-center rounded-lg border border-slate-800">
                                                <span className="text-slate-400 flex items-center gap-2"><Lock size={14} /> License Required</span>
                                            </div>
                                        )}
                                        {installScript}
                                    </div>
                                    <button 
                                      onClick={handleDownloadAttempt}
                                      className={`p-4 rounded-lg font-bold transition-all ${copied ? 'bg-green-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                                    >
                                        {copied ? <CheckCircle2 size={20} /> : (hasLicense ? <Copy size={20} /> : <Lock size={20} />)}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
         </div>

         {/* Sidebar */}
         <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="font-bold text-white mb-4">System Requirements</h3>
                <ul className="space-y-3 text-sm text-slate-400">
                    <li className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-green-500" /> Android 8.0 (Oreo) or later
                    </li>
                    <li className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-green-500" /> 4GB RAM Recommended
                    </li>
                    <li className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-green-500" /> 64-bit Processor (ARM64)
                    </li>
                </ul>
            </div>
         </div>
      </div>
    </div>
  );
};
