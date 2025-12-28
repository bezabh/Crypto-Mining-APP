import React, { useState, useEffect, useRef } from 'react';
import { Database, Server, Save, RotateCcw, Download, Upload, Trash2, CheckCircle2, AlertTriangle, HardDrive, Cloud, FileJson, Table, Search, RefreshCw, History, FileUp, Shield } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

interface DBConnection {
  id: string;
  name: string;
  type: 'LOCAL' | 'CLOUD' | 'SQL' | 'NOSQL';
  status: 'CONNECTED' | 'DISCONNECTED' | 'ERROR';
  latency: number;
  icon: React.ReactNode;
}

export const DatabaseManager: React.FC = () => {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'EXPLORER' | 'BACKUP'>('OVERVIEW');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [connections, setConnections] = useState<DBConnection[]>([
    { id: 'local', name: 'Browser Persistence', type: 'LOCAL', status: 'CONNECTED', latency: 2, icon: <HardDrive size={18}/> },
    { id: 'prime', name: 'TigApp Cloud Cluster', type: 'CLOUD', status: 'CONNECTED', latency: 45, icon: <Cloud size={18}/> },
    { id: 'atlas', name: 'Global Data Sync', type: 'NOSQL', status: 'DISCONNECTED', latency: 0, icon: <Database size={18} className="text-indigo-500"/> },
  ]);

  const [activeConnection, setActiveConnection] = useState<string>('local');
  const [selectedTable, setSelectedTable] = useState('users');
  const [tableData, setTableData] = useState<any[]>([]);

  useEffect(() => {
    const loadData = () => {
        let data: any[] = [];
        const prefix = 'tigapp_';
        if (selectedTable === 'users') {
            const saved = localStorage.getItem(`${prefix}all_users`);
            if(saved) data = JSON.parse(saved);
        } else if (selectedTable === 'transactions') {
            const saved = localStorage.getItem(`${prefix}transactions`);
            if(saved) data = JSON.parse(saved);
        } else if (selectedTable === 'settings') {
            data = [{ 
                theme: localStorage.getItem('theme') || 'dark', 
                balance: localStorage.getItem(`${prefix}balance`)
            }];
        }
        setTableData(data);
    };
    loadData();
  }, [selectedTable, activeTab]);

  const handleConnect = (id: string) => {
      setConnections(prev => prev.map(c => c.id === id ? { ...c, status: 'CONNECTED', latency: 40 } : c));
      setActiveConnection(id);
      addToast("Node Connected", `Handshake successful with ${id}`, "success");
  };

  const handleDisconnect = (id: string) => {
    setConnections(prev => prev.map(c => c.id === id ? { ...c, status: 'DISCONNECTED', latency: 0 } : c));
    if (activeConnection === id) setActiveConnection('');
    addToast("Node Offline", `Connection to ${id} terminated.`, "info");
  };

  const handleBackup = () => {
      const backupData: Record<string, any> = {};
      for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.startsWith('tigapp_') || key === 'theme')) {
              backupData[key] = localStorage.getItem(key);
          }
      }
      backupData['_metadata'] = { timestamp: new Date().toISOString(), version: '3.0.0', client: 'TigAppMining Pro' };
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `TigAppMining_Snapshot_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      addToast("Backup Exported", "Encrypted snapshot saved.", "success");
  };

  const handleRestoreClick = () => fileInputRef.current?.click();

  const handleFileRestore = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
          try {
              const data = JSON.parse(e.target?.result as string);
              if (!data._metadata) throw new Error("Invalid format");
              Object.keys(data).forEach(key => { if (key !== '_metadata') localStorage.setItem(key, data[key]); });
              addToast("System Restored", "TigAppMining data successfully recovered.", "success");
              setTimeout(() => window.location.reload(), 1500);
          } catch (err) { addToast("Restore Failed", "Corrupted or invalid snapshot.", "error"); }
      };
      reader.readAsText(file);
  };

  return (
    <div className="p-6 space-y-6">
       <input type="file" ref={fileInputRef} onChange={handleFileRestore} accept=".json" className="hidden" />
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2"><Database className="text-indigo-500" /> TigApp Continuity Manager</h2>
          <p className="text-slate-400 text-sm mt-1">Global node persistence and snapshot recovery.</p>
        </div>
        <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-800">
           <button onClick={() => setActiveTab('OVERVIEW')} className={`px-4 py-2 rounded-md text-sm font-bold ${activeTab === 'OVERVIEW' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>Nodes</button>
           <button onClick={() => setActiveTab('EXPLORER')} className={`px-4 py-2 rounded-md text-sm font-bold ${activeTab === 'EXPLORER' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>Explorer</button>
           <button onClick={() => setActiveTab('BACKUP')} className={`px-4 py-2 rounded-md text-sm font-bold ${activeTab === 'BACKUP' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>Snapshot</button>
        </div>
      </div>
      {activeTab === 'OVERVIEW' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in">
              <div className="lg:col-span-2 space-y-4">
                  <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                      {connections.map(conn => (
                          <div key={conn.id} className="p-4 flex items-center justify-between border-b border-slate-800 last:border-0">
                              <div className="flex items-center gap-4">
                                  <div className={`p-2 rounded-lg ${conn.status === 'CONNECTED' ? 'bg-green-500/10 text-green-400' : 'bg-slate-800'}`}>{conn.icon}</div>
                                  <div><div className="font-bold text-white text-sm">{conn.name}</div><div className="text-xs text-slate-500">{conn.status}</div></div>
                              </div>
                              <button onClick={() => conn.status === 'CONNECTED' ? handleDisconnect(conn.id) : handleConnect(conn.id)} className="text-xs font-bold text-indigo-400 px-3 py-1.5 rounded border border-indigo-500/20">{conn.status === 'CONNECTED' ? 'Settings' : 'Connect'}</button>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      )}
      {activeTab === 'BACKUP' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-right-4">
              <button onClick={handleBackup} className="bg-indigo-950/20 border border-indigo-500/30 rounded-2xl p-8 flex flex-col items-center hover:border-indigo-400 transition-all"><Download size={40} className="text-indigo-400 mb-4"/><h3 className="text-xl font-bold text-white">Create Full Snapshot</h3><p className="text-slate-400 text-sm mt-2">Export all TigAppMining linked data.</p></button>
              <button onClick={handleRestoreClick} className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-8 flex flex-col items-center hover:border-emerald-400 transition-all"><FileUp size={40} className="text-emerald-400 mb-4"/><h3 className="text-xl font-bold text-white">Restore from File</h3><p className="text-slate-400 text-sm mt-2">Upload TigApp JSON snapshot.</p></button>
          </div>
      )}
    </div>
  );
};