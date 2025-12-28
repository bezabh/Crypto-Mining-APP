
import React, { useState } from 'react';
import { Terminal, Code, Smartphone, Layers, Play, Download, Server, Cpu, CheckCircle2, RefreshCw, Box, ArrowRight, Container } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

export const PlatformIntegrations: React.FC = () => {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<'DJANGO' | 'FLUTTER' | 'DOCKER'>('DJANGO');
  
  // Django State
  const [djangoStatus, setDjangoStatus] = useState<'STOPPED' | 'STARTING' | 'RUNNING'>('STOPPED');
  const [serverLogs, setServerLogs] = useState<string[]>([
    "> Ready to initialize Django 5.0 Environment...",
    "> Waiting for user command."
  ]);

  // Flutter State
  const [buildStatus, setBuildStatus] = useState<'IDLE' | 'COMPILING' | 'SUCCESS'>('IDLE');
  const [buildProgress, setBuildProgress] = useState(0);

  // Docker State
  const [dockerStatus, setDockerStatus] = useState<'STOPPED' | 'BUILDING' | 'RUNNING'>('STOPPED');
  const [dockerLogs, setDockerLogs] = useState<string[]>([]);

  // --- DJANGO LOGIC ---
  const startDjangoServer = () => {
    setDjangoStatus('STARTING');
    setServerLogs(["> initializing virtualenv...", "> pip install -r requirements.txt..."]);
    
    setTimeout(() => {
        setServerLogs(prev => [...prev, "> applying migrations...", "> python manage.py migrate"]);
    }, 1000);

    setTimeout(() => {
        setServerLogs(prev => [...prev, "> starting ASGI server...", "> Django version 5.0.2, using settings 'primemine.settings'", "> Starting development server at http://127.0.0.1:8000/"]);
        setDjangoStatus('RUNNING');
        addToast("Django Node Active", "Python backend is now handling mining logic.", "success");
    }, 2500);
  };

  const stopDjangoServer = () => {
      setDjangoStatus('STOPPED');
      setServerLogs(prev => [...prev, "> Server stopped by user.", "> Waiting for user command."]);
  };

  // --- FLUTTER LOGIC ---
  const buildFlutterApp = () => {
      setBuildStatus('COMPILING');
      setBuildProgress(0);

      const interval = setInterval(() => {
          setBuildProgress(prev => {
              if (prev >= 100) {
                  clearInterval(interval);
                  setBuildStatus('SUCCESS');
                  addToast("Build Complete", "Flutter app-release.apk is ready.", "success");
                  return 100;
              }
              return prev + 5; // increment
          });
      }, 150);
  };

  // --- DOCKER LOGIC ---
  const startDocker = () => {
      setDockerStatus('BUILDING');
      setDockerLogs(["> docker-compose up -d", "> Building mining-node...", "> [1/5] FROM python:3.9-slim"]);
      
      setTimeout(() => {
          setDockerLogs(prev => [...prev, "> [2/5] WORKDIR /app", "> [3/5] COPY requirements.txt ."]);
      }, 1000);

      setTimeout(() => {
          setDockerLogs(prev => [...prev, "> [4/5] RUN pip install --no-cache-dir", "> [5/5] COPY . .", "> Creating network 'primemine_net'"]);
      }, 2000);

      setTimeout(() => {
          setDockerLogs(prev => [...prev, "> Container 'primemine-worker-1' Started", "> Listening on port 3333"]);
          setDockerStatus('RUNNING');
          addToast("Container Deployed", "Mining node is running in isolated Docker environment.", "success");
      }, 3000);
  };

  return (
    <div className="p-6 space-y-6 animate-in fade-in slide-in-from-bottom-4">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Layers className="text-indigo-500" /> Platform SDKs
          </h2>
          <p className="text-slate-400 text-sm mt-1">Deploy Python backends, containerized nodes, and cross-platform apps.</p>
        </div>
        
        <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-800">
           <button 
             onClick={() => setActiveTab('DJANGO')}
             className={`px-6 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-colors ${activeTab === 'DJANGO' ? 'bg-green-700 text-white shadow' : 'text-slate-400 hover:text-white'}`}
           >
             <Terminal size={16} /> Django
           </button>
           <button 
             onClick={() => setActiveTab('DOCKER')}
             className={`px-6 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-colors ${activeTab === 'DOCKER' ? 'bg-blue-500 text-white shadow' : 'text-slate-400 hover:text-white'}`}
           >
             <Container size={16} /> Docker
           </button>
           <button 
             onClick={() => setActiveTab('FLUTTER')}
             className={`px-6 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-colors ${activeTab === 'FLUTTER' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
           >
             <Smartphone size={16} /> Flutter
           </button>
        </div>
      </div>

      {/* --- DJANGO PLATFORM --- */}
      {activeTab === 'DJANGO' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-left-4">
              
              {/* Controller */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
                  <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-[#092E20] rounded-xl flex items-center justify-center border border-[#0C4B33]">
                          <span className="font-bold text-white text-xl">dj</span>
                      </div>
                      <div>
                          <h3 className="text-xl font-bold text-white">Django Relay Node</h3>
                          <p className="text-slate-400 text-sm">Python 3.11 • Django 5.0 • DRF</p>
                      </div>
                  </div>

                  <p className="text-sm text-slate-300 leading-relaxed">
                      Deploy a local Django instance to act as a secure relay between your mining hardware and the PrimeMine Cloud. Enables advanced ORM analytics and custom Python scripting.
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                          <div className="text-xs text-slate-500 font-bold uppercase mb-1">Status</div>
                          <div className={`font-bold flex items-center gap-2 ${djangoStatus === 'RUNNING' ? 'text-green-400' : 'text-slate-400'}`}>
                              <Server size={14} /> {djangoStatus}
                          </div>
                      </div>
                      <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                          <div className="text-xs text-slate-500 font-bold uppercase mb-1">Port</div>
                          <div className="font-mono text-white">8000</div>
                      </div>
                  </div>

                  <div className="flex gap-3">
                      {djangoStatus === 'RUNNING' ? (
                          <button 
                            onClick={stopDjangoServer}
                            className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                          >
                              <RefreshCw size={18} /> Stop Server
                          </button>
                      ) : (
                          <button 
                            onClick={startDjangoServer}
                            disabled={djangoStatus === 'STARTING'}
                            className="flex-1 bg-[#092E20] hover:bg-[#0C4B33] border border-[#0C4B33] text-green-400 font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                          >
                              {djangoStatus === 'STARTING' ? <RefreshCw className="animate-spin" size={18} /> : <Play size={18} />} 
                              {djangoStatus === 'STARTING' ? 'Booting...' : 'Start Django Node'}
                          </button>
                      )}
                      <button className="px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors">
                          <Code size={18} />
                      </button>
                  </div>
              </div>

              {/* Terminal Output */}
              <div className="bg-[#0d1117] border border-slate-800 rounded-xl p-4 font-mono text-xs flex flex-col h-[400px] shadow-2xl relative overflow-hidden">
                  <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-slate-500 ml-2">bash — python manage.py</span>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto space-y-1 text-slate-300 scrollbar-thin">
                      {serverLogs.map((log, i) => (
                          <div key={i} className="break-all animate-in fade-in slide-in-from-left-2 duration-300">
                              <span className="text-green-500 mr-2">$</span>
                              {log}
                          </div>
                      ))}
                      {djangoStatus === 'STARTING' && (
                          <div className="animate-pulse text-indigo-400">_</div>
                      )}
                  </div>

                  {djangoStatus === 'RUNNING' && (
                      <div className="absolute bottom-4 right-4">
                          <div className="bg-green-900/20 border border-green-500/30 text-green-400 px-3 py-1 rounded text-[10px] font-bold uppercase animate-pulse">
                              Serving Traffic
                          </div>
                      </div>
                  )}
              </div>
          </div>
      )}

      {/* --- DOCKER PLATFORM --- */}
      {activeTab === 'DOCKER' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
                  <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-[#0091E2]/20 rounded-xl flex items-center justify-center border border-[#0091E2]">
                          <Container className="text-[#0091E2]" size={32} />
                      </div>
                      <div>
                          <h3 className="text-xl font-bold text-white">Docker Container</h3>
                          <p className="text-slate-400 text-sm">Alpine Linux • Isolated Environment</p>
                      </div>
                  </div>
                  <p className="text-sm text-slate-300">
                      Run the mining node in a containerized environment for maximum stability and portability. Supports restart policies and resource limits.
                  </p>
                  
                  <div className="flex gap-3">
                      {dockerStatus === 'RUNNING' ? (
                          <button 
                            onClick={() => setDockerStatus('STOPPED')}
                            className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                          >
                              <Box size={18} /> Stop Container
                          </button>
                      ) : (
                          <button 
                            onClick={startDocker}
                            disabled={dockerStatus === 'BUILDING'}
                            className="flex-1 bg-[#0091E2] hover:bg-[#0077b5] text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                          >
                              {dockerStatus === 'BUILDING' ? <RefreshCw className="animate-spin" /> : <Play size={18} />}
                              Deploy Container
                          </button>
                      )}
                  </div>
              </div>

              <div className="bg-[#0d1117] border border-slate-800 rounded-xl p-4 font-mono text-xs flex flex-col h-[400px]">
                  <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-2">
                      <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                      <span className="text-slate-500 ml-2">docker-compose logs -f</span>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-1 text-slate-300 scrollbar-thin">
                      {dockerLogs.map((log, i) => (
                          <div key={i} className="break-all animate-in fade-in">
                              <span className="text-blue-500 mr-2">#</span>
                              {log}
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      )}

      {/* --- FLUTTER PLATFORM --- */}
      {activeTab === 'FLUTTER' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-right-4">
              
              {/* Builder Controls */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
                  <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-[#042B59] rounded-xl flex items-center justify-center border border-[#02569B]">
                          <span className="font-bold text-blue-400 text-3xl">F</span>
                      </div>
                      <div>
                          <h3 className="text-xl font-bold text-white">Flutter Mobile SDK</h3>
                          <p className="text-slate-400 text-sm">Dart 3.0 • Material 3 • iOS & Android</p>
                      </div>
                  </div>

                  <p className="text-sm text-slate-300 leading-relaxed">
                      Compile a native, high-performance mobile application from your current dashboard configuration. Uses the Flutter engine for 60fps rendering and hardware access.
                  </p>

                  <div className="bg-slate-950 rounded-xl border border-slate-800 p-4">
                      <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-bold text-slate-500 uppercase">Build Pipeline</span>
                          <span className="text-xs text-blue-400 font-mono">{buildProgress}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-2">
                          <div 
                            className="bg-blue-500 h-full transition-all duration-150 ease-out" 
                            style={{ width: `${buildProgress}%` }}
                          ></div>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                          {buildStatus === 'IDLE' && "Ready to compile"}
                          {buildStatus === 'COMPILING' && "Running 'flutter build apk --release'..."}
                          {buildStatus === 'SUCCESS' && "Build Artifact: app-release.apk (42MB)"}
                      </div>
                  </div>

                  <div className="flex gap-3">
                      <button 
                        onClick={buildFlutterApp}
                        disabled={buildStatus === 'COMPILING'}
                        className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
                      >
                          {buildStatus === 'COMPILING' ? <RefreshCw className="animate-spin" size={18} /> : <Box size={18} />} 
                          {buildStatus === 'COMPILING' ? 'Compiling Dart...' : 'Build Android APK'}
                      </button>
                      
                      {buildStatus === 'SUCCESS' && (
                          <button className="px-4 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors animate-in zoom-in">
                              <Download size={18} />
                          </button>
                      )}
                  </div>
              </div>

              {/* Live Preview (Flutter Style) */}
              <div className="flex justify-center">
                  <div className="relative w-[280px] h-[560px] bg-slate-900 rounded-[2.5rem] border-[8px] border-slate-800 shadow-2xl overflow-hidden">
                      {/* Notch */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-xl z-20"></div>
                      
                      {/* Screen Content */}
                      <div className="w-full h-full bg-[#1e1e1e] pt-12 p-4 flex flex-col relative">
                          {/* Flutter AppBar */}
                          <div className="flex justify-between items-center mb-6">
                              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                                  <Smartphone size={16} />
                              </div>
                              <span className="text-white font-bold">PrimeMine Mobile</span>
                              <div className="w-8"></div>
                          </div>

                          {/* Mining Card (Material 3 Style) */}
                          <div className="bg-blue-500 rounded-2xl p-4 text-white shadow-lg shadow-blue-500/20 mb-4 transform hover:scale-105 transition-transform duration-300">
                              <div className="text-xs opacity-80 mb-1">Total Balance</div>
                              <div className="text-2xl font-bold mb-4">$12,450.00</div>
                              <div className="flex gap-2">
                                  <div className="bg-white/20 px-3 py-1 rounded-full text-[10px] backdrop-blur-sm">Withdraw</div>
                                  <div className="bg-white/20 px-3 py-1 rounded-full text-[10px] backdrop-blur-sm">Deposit</div>
                              </div>
                          </div>

                          {/* List Items */}
                          <div className="space-y-3">
                              <div className="bg-[#2c2c2c] p-3 rounded-xl flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
                                      <Cpu size={20} />
                                  </div>
                                  <div className="flex-1">
                                      <div className="text-white text-sm font-bold">Hashrate</div>
                                      <div className="text-xs text-slate-400">145 TH/s Active</div>
                                  </div>
                              </div>
                              <div className="bg-[#2c2c2c] p-3 rounded-xl flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                                      <CheckCircle2 size={20} />
                                  </div>
                                  <div className="flex-1">
                                      <div className="text-white text-sm font-bold">System Status</div>
                                      <div className="text-xs text-slate-400">All Systems Operational</div>
                                  </div>
                              </div>
                          </div>

                          {/* Floating Action Button (FAB) */}
                          <div className="absolute bottom-6 right-6 w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                              <ArrowRight className="text-white" size={24} />
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};
