
import React, { useState, useEffect } from 'react';
import { Key, Plus, Trash2, Copy, Check, Eye, EyeOff, Terminal, Shield, AlertTriangle, Code, RefreshCw, Activity } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  secret?: string; 
  permissions: string[];
  created: string;
  lastUsed: string;
  status: 'ACTIVE' | 'REVOKED';
}

export const APIManagement: React.FC = () => {
  const { addToast } = useToast();
  const [keys, setKeys] = useState<ApiKey[]>(() => {
      const saved = localStorage.getItem('pm_api_keys');
      return saved ? JSON.parse(saved) : [
        { 
          id: 'key_1', 
          name: 'Primary Remote Monitor', 
          prefix: 'pm_live_88a...', 
          permissions: ['read:stats', 'read:wallet'], 
          created: '2023-10-24', 
          lastUsed: 'Just now', 
          status: 'ACTIVE' 
        }
      ];
  });
  
  const [isCreating, setIsCreating] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [permissions, setPermissions] = useState({
    readStats: true,
    readWallet: false,
    controlMining: false,
    withdrawFunds: false
  });
  const [generatedKey, setGeneratedKey] = useState<{key: string, secret: string} | null>(null);

  useEffect(() => {
      localStorage.setItem('pm_api_keys', JSON.stringify(keys));
  }, [keys]);

  const handleGenerate = () => {
    if (!newKeyName) return;

    const keyId = 'pm_live_' + Math.random().toString(36).substring(2, 15);
    const secret = 'sk_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    const activePermissions = [];
    if (permissions.readStats) activePermissions.push('read:stats');
    if (permissions.readWallet) activePermissions.push('read:wallet');
    if (permissions.controlMining) activePermissions.push('write:mining');
    if (permissions.withdrawFunds) activePermissions.push('write:payouts');

    const newKey: ApiKey = {
      id: Math.random().toString(36).substring(7),
      name: newKeyName,
      prefix: keyId.substring(0, 11) + '...',
      permissions: activePermissions,
      created: new Date().toLocaleDateString(),
      lastUsed: 'Never',
      status: 'ACTIVE'
    };

    setKeys([newKey, ...keys]);
    setGeneratedKey({ key: keyId, secret: secret });
    setIsCreating(false);
    setNewKeyName('');
    addToast("Key Linked", "New API credential has been linked to your account.", "success");
  };

  const handleDelete = (id: string) => {
    if (confirm('Revoke this key? Linked services will lose access immediately.')) {
      setKeys(keys.filter(k => k.id !== id));
      addToast("Key Revoked", "API credential has been unlinked.", "info");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Code className="text-indigo-500" /> Linked API Credentials
          </h2>
          <p className="text-slate-400 text-sm mt-1">Manage external access nodes linked to your mining profile.</p>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          disabled={!!generatedKey}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors"
        >
          <Plus size={18} /> New Credential
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {generatedKey && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 animate-in zoom-in">
               <h3 className="text-lg font-bold text-white mb-2">Linked Snapshot Complete</h3>
               <p className="text-sm text-slate-300 mb-4">Store your client secret in a secure vault. It is now linked to your backup index.</p>
               <div className="space-y-3">
                  <div><label className="text-[10px] font-black text-green-400 uppercase">Public ID</label><div className="bg-slate-950 border border-green-500/20 rounded-lg p-3 font-mono text-sm text-white">{generatedKey.key}</div></div>
                  <div><label className="text-[10px] font-black text-green-400 uppercase">Linked Secret</label><div className="bg-slate-950 border border-green-500/20 rounded-lg p-3 font-mono text-sm text-white break-all">{generatedKey.secret}</div></div>
               </div>
               <button onClick={() => setGeneratedKey(null)} className="mt-6 bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg font-bold text-sm">Save & Exit</button>
            </div>
          )}

          {isCreating && (
            <div className="bg-slate-900 border border-indigo-500/30 rounded-xl p-6 animate-in slide-in-from-top-2">
               <h3 className="text-white font-bold mb-4">Link New Node</h3>
               <div className="space-y-4">
                  <input type="text" value={newKeyName} onChange={(e) => setNewKeyName(e.target.value)} placeholder="Node Identifier (e.g. HiveOS-01)" className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-indigo-500 outline-none text-sm"/>
                  <div className="grid grid-cols-2 gap-3">
                    {['read:stats', 'read:wallet', 'write:mining', 'write:payouts'].map(p => (
                      <div key={p} className="flex items-center gap-2 p-3 bg-slate-950 rounded-lg border border-slate-800 text-[10px] font-bold text-slate-400 uppercase">
                        <Check size={12} className="text-indigo-500"/> {p}
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end gap-3 mt-4">
                     <button onClick={() => setIsCreating(false)} className="text-slate-400 hover:text-white font-bold text-sm px-4">Cancel</button>
                     <button onClick={handleGenerate} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg font-bold text-sm">Generate & Link</button>
                  </div>
               </div>
            </div>
          )}

          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
             <div className="p-4 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center"><h3 className="text-xs font-black text-white uppercase tracking-widest">Active Linked Nodes</h3></div>
             <div className="divide-y divide-slate-800">
                {keys.map(key => (
                   <div key={key.id} className="p-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors">
                      <div>
                         <div className="font-bold text-white text-sm">{key.name}</div>
                         <div className="font-mono text-[10px] text-slate-500">{key.prefix}</div>
                      </div>
                      <button onClick={() => handleDelete(key.id)} className="p-2 text-slate-500 hover:text-red-400 transition-colors"><Trash2 size={18} /></button>
                   </div>
                ))}
             </div>
          </div>
        </div>
        <div className="bg-indigo-900/20 border border-indigo-500/20 rounded-xl p-6 h-fit">
            <Shield className="text-indigo-400 mb-4" size={32} />
            <h4 className="font-bold text-white mb-2">Linked Persistence</h4>
            <p className="text-xs text-slate-400 leading-relaxed">All generated keys are linked to your system hash. In case of a factory reset, use the <b>Continuity Portal</b> to restore your active node credentials from an encrypted snapshot.</p>
        </div>
      </div>
    </div>
  );
};
