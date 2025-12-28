
import React, { useState } from 'react';
import { User, UserRole, Transaction, UserActivity, Feedback } from '../types';
import { Trash2, UserPlus, User as UserIcon, Check, X, ShieldAlert, ShieldCheck, Loader2, Users, Wallet, Landmark, RefreshCw, Crown, Shield, Layers, Zap, Bot, Eye, Fingerprint, Network, Cpu, Settings, Copy, Plus, CheckCircle2 } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

interface UserManagementProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  currentUser: User | null;
  transactions?: Transaction[];
  userActivities?: UserActivity[];
  feedbacks?: Feedback[];
}

interface RegistrationTemplate {
    id: string;
    label: string;
    role: UserRole;
    description: string;
    icon: React.ReactNode;
    color: string;
    permissions: string[];
    blueprint: string;
}

const REGISTRATION_TEMPLATES: RegistrationTemplate[] = [
    { 
        id: 'rt-ops', 
        label: 'Mining Vanguard', 
        role: 'Operator', 
        description: 'Standard mining deployment with full telemetry access.', 
        icon: <Cpu size={24}/>, 
        color: 'indigo',
        permissions: ['Mining Core', 'AI Advisor', 'Local Payouts'],
        blueprint: "PROTO-O-1"
    },
    { 
        id: 'rt-adm', 
        label: 'System Auditor', 
        role: 'Admin', 
        description: 'High-level node management and registry authority.', 
        icon: <Shield size={24}/>, 
        color: 'purple',
        permissions: ['User Registry', 'Global Logs', 'API Vault'],
        blueprint: "PROTO-A-7"
    },
    { 
        id: 'rt-trn', 
        label: 'Neural Trainer', 
        role: 'Operator', 
        description: 'Optimized for AI Forge and RLHF training modules.', 
        icon: <Bot size={24}/>, 
        color: 'emerald',
        permissions: ['AI Forge', 'Strategic Brain', 'Lab Access'],
        blueprint: "PROTO-N-4"
    },
    { 
        id: 'rt-gst', 
        label: 'Data Watcher', 
        role: 'Guest', 
        description: 'Read-only node for cluster monitoring.', 
        icon: <Eye size={24}/>, 
        color: 'slate',
        permissions: ['Dashboard Read', 'Market Pulse'],
        blueprint: "PROTO-G-0"
    },
];

export const UserManagement: React.FC<UserManagementProps> = ({ 
    users,
    setUsers,
    currentUser,
}) => {
  const { addToast } = useToast();
  const isSuper = currentUser?.role === 'Super Admin';
  const [view, setView] = useState<'LIST' | 'TEMPLATES'>('LIST');
  const [isAdding, setIsAdding] = useState(false);
  const [newUser, setNewUser] = useState({ 
    name: '', 
    email: '', 
    role: 'Guest' as UserRole
  });

  const applyTemplate = (template: RegistrationTemplate) => {
      setNewUser({
          name: `${template.label} Node`,
          email: `${template.blueprint.toLowerCase()}@tigapp.ai`,
          role: template.role
      });
      setIsAdding(true);
      setView('LIST');
      addToast("Blueprint Loaded", `${template.label} parameters injected.`, "success");
  };

  const handleAdd = () => {
    if (!newUser.name || !newUser.email) {
        addToast('Validation Error', 'Identity markers required.', 'error');
        return;
    }
    
    const node: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: 'Offline',
      verificationStatus: 'unverified',
      lastLogin: 'Never',
      parentId: currentUser?.id
    };

    setUsers([...users, node]);
    setIsAdding(false);
    setNewUser({ name: '', email: '', role: 'Guest' });
    addToast("Registration Complete", `${newUser.name} synced to registry.`, 'success');
  };

  const handleRemove = (id: string) => {
    if(confirm('Terminate node synchronization?')) {
        setUsers(users.filter(u => u.id !== id));
        addToast("Node Terminated", "Uplink destroyed.", "info");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-8">
        <div>
          <h2 className="text-4xl font-black text-white flex items-center gap-4 uppercase tracking-tighter italic">
            {isSuper ? <Crown className="text-amber-500" /> : <Users className="text-indigo-500" />} 
            {view === 'LIST' ? "Node Registry" : "Registration Hub"}
          </h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-2">
            {isSuper ? 'Sovereign Root Access :: Layer-0' : 'Node Architecture Protocol :: V5'}
          </p>
        </div>
        
        <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-white/5">
            <button onClick={() => setView('LIST')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'LIST' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>Directories</button>
            <button onClick={() => setView('TEMPLATES')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'TEMPLATES' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>Blueprints</button>
        </div>
      </div>

      {view === 'TEMPLATES' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in zoom-in duration-500">
              {REGISTRATION_TEMPLATES.filter(t => isSuper || t.role !== 'Admin').map(template => (
                  <div key={template.id} className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 relative overflow-hidden group hover:border-indigo-500/50 transition-all duration-500 flex flex-col justify-between shadow-2xl">
                      <div className="relative z-10 space-y-6">
                          <div className={`w-14 h-14 rounded-2xl bg-slate-950 border border-white/5 flex items-center justify-center text-indigo-400 shadow-inner`}>
                              {template.icon}
                          </div>
                          <div>
                              <h3 className="text-xl font-black text-white uppercase tracking-tight italic">{template.label}</h3>
                              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{template.blueprint}</p>
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed font-medium min-h-[48px]">{template.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {template.permissions.map(p => (
                                <span key={p} className="bg-slate-950 border border-white/5 text-[8px] font-black text-slate-400 px-2 py-1 rounded uppercase">{p}</span>
                            ))}
                          </div>
                      </div>
                      <button onClick={() => applyTemplate(template)} className="w-full mt-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2">
                         <Plus size={14} /> Deploy Node
                      </button>
                  </div>
              ))}
          </div>
      ) : (
          <div className="space-y-6">
            {isAdding && (
                <div className="bg-slate-900 border border-indigo-500/30 rounded-[2.5rem] p-10 space-y-10 animate-in slide-in-from-top-4 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none rotate-12"><Layers size={200} /></div>
                    <div className="flex items-center justify-between border-b border-white/5 pb-6 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white"><UserPlus size={24}/></div>
                            <div>
                                <h3 className="text-white font-black uppercase text-xl italic tracking-tight">Node Forging Terminal</h3>
                                <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest">Manual identity configuration active</p>
                            </div>
                        </div>
                        <button onClick={() => setIsAdding(false)} className="text-slate-500 hover:text-white transition-colors p-2"><X size={24}/></button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Entity Name</label>
                            <input type="text" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white text-sm outline-none focus:border-indigo-500 transition-all font-bold" placeholder="E.g. Cluster-Node-01" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Uplink ID (Email)</label>
                            <input type="email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white text-sm outline-none focus:border-indigo-500 transition-all font-mono" placeholder="node@tigapp.ai" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Access protocol</label>
                            <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value as UserRole})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white text-sm outline-none focus:border-indigo-500 transition-all font-bold">
                                {isSuper && <option value="Admin">Admin Authority</option>}
                                <option value="Operator">Operator Core</option>
                                <option value="Guest">Guest Node</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 relative z-10 border-t border-white/5 pt-8">
                        <button onClick={() => setIsAdding(false)} className="px-8 py-3 text-slate-500 font-black text-xs uppercase tracking-widest hover:text-white transition-colors">Abort</button>
                        <button onClick={handleAdd} className="bg-indigo-600 hover:bg-indigo-500 text-white px-12 py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-xl flex items-center gap-3 active:scale-95">
                            <Zap size={16} /> Forge Identity
                        </button>
                    </div>
                </div>
            )}

            <div className={`bg-slate-900 border border-slate-800 rounded-[3rem] overflow-hidden shadow-2xl glass-shadow`}>
                <div className="bg-slate-950/50 p-6 border-b border-white/5 flex justify-between items-center">
                    <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-2 italic">
                        <Network size={14} className="text-indigo-500" /> Synchronization Ledger
                    </h3>
                    <button onClick={() => setIsAdding(true)} className="bg-white/5 hover:bg-white/10 text-slate-300 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border border-white/5">Manual Add</button>
                </div>
                <div className="overflow-x-auto scrollbar-thin">
                    <table className="w-full text-left font-mono text-xs min-w-[800px]">
                        <thead className="bg-slate-950/30 text-slate-500 uppercase font-black">
                            <tr>
                                <th className="p-6">Node Identifier</th>
                                <th className="p-6">Sync Class</th>
                                <th className="p-6">Stability</th>
                                <th className="p-6 text-right">Ops</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 font-sans">
                            {users.map(u => (
                                <tr key={u.id} className="hover:bg-slate-800/30 transition-all group">
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-500 group-hover:border-indigo-500 transition-all ${u.role === 'Super Admin' ? 'text-amber-500' : ''}`}>
                                                {u.role === 'Super Admin' ? <Crown size={18} /> : <UserIcon size={18}/>}
                                            </div>
                                            <div>
                                                <div className="text-white font-black uppercase text-xs">{u.name}</div>
                                                <div className="text-[10px] text-slate-500 font-bold">{u.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${u.role === 'Super Admin' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : (u.role === 'Admin' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' : 'bg-slate-800 text-slate-400 border-slate-700')}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Sync</span>
                                        </div>
                                    </td>
                                    <td className="p-6 text-right">
                                        <button onClick={() => handleRemove(u.id)} disabled={u.role === 'Super Admin'} className="p-2 bg-slate-950 border border-white/5 rounded-lg text-slate-500 hover:text-red-500 transition-colors disabled:opacity-0"><Trash2 size={14}/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
          </div>
      )}
    </div>
  );
};
