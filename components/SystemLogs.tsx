
import React, { useState, useEffect, useRef } from 'react';
import { LogEntry } from '../types';
import { Search, Filter, Download, AlertTriangle, CheckCircle, Info, XCircle, FileText, RefreshCw, Trash2, ArrowDown } from 'lucide-react';

interface SystemLogsProps {
  logs: LogEntry[];
  onClear?: () => void;
}

export const SystemLogs: React.FC<SystemLogsProps> = ({ logs, onClear }) => {
  const [filter, setFilter] = useState<'ALL' | 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS'>('ALL');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const logsEndRef = useRef<HTMLTableRowElement>(null);

  // Debounce logic for search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  // Filter logs but keep them in chronological order (Oldest -> Newest) for terminal feel
  const filteredLogs = logs.filter(log => {
    const matchesFilter = filter === 'ALL' || log.level === filter;
    const matchesSearch = log.message.toLowerCase().includes(debouncedSearch.toLowerCase()) || 
                          log.timestamp.includes(debouncedSearch) ||
                          log.id.includes(debouncedSearch);
    return matchesFilter && matchesSearch;
  });

  // Auto-scroll to bottom when logs update
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, filter, debouncedSearch]); // Trigger on any log change, filter change, or debounced search

  const handleDownload = () => {
    const content = JSON.stringify(logs, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system_logs_${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'SUCCESS': return <CheckCircle size={16} className="text-green-400" />;
      case 'WARN': return <AlertTriangle size={16} className="text-yellow-400" />;
      case 'ERROR': return <XCircle size={16} className="text-red-400" />;
      case 'INFO': default: return <Info size={16} className="text-blue-400" />;
    }
  };

  const getLevelStyle = (level: string) => {
    switch (level) {
      case 'SUCCESS': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'WARN': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'ERROR': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'INFO': default: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    }
  };

  return (
    <div className="p-6 space-y-6 animate-in fade-in slide-in-from-bottom-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="text-indigo-500" /> System Logs
          </h2>
          <p className="text-slate-400 text-sm mt-1">Detailed operational history, mining events, and system alerts.</p>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={onClear}
                className="px-4 py-2 bg-slate-900 border border-slate-700 text-slate-400 hover:text-white hover:bg-red-900/20 hover:border-red-500/50 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
            >
                <Trash2 size={16} /> Clear History
            </button>
            <button 
                onClick={handleDownload}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-bold flex items-center gap-2 transition-colors shadow-lg"
            >
                <Download size={16} /> Export JSON
            </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-3 text-slate-500" size={18} />
              <input 
                type="text" 
                placeholder="Search logs by message, ID, or time..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors text-sm"
              />
          </div>
          
          <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-800 col-span-2 overflow-x-auto">
             {['ALL', 'INFO', 'SUCCESS', 'WARN', 'ERROR'].map((type) => (
                 <button
                    key={type}
                    onClick={() => setFilter(type as any)}
                    className={`flex-1 min-w-[80px] py-1.5 rounded text-xs font-bold transition-colors ${
                        filter === type 
                        ? 'bg-slate-700 text-white shadow' 
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                 >
                    {type}
                 </button>
             ))}
          </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg text-center">
              <div className="text-xs text-slate-500 font-bold uppercase">Total Events</div>
              <div className="text-xl font-mono text-white">{logs.length}</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg text-center">
              <div className="text-xs text-slate-500 font-bold uppercase">Errors</div>
              <div className="text-xl font-mono text-red-400">{logs.filter(l => l.level === 'ERROR').length}</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg text-center">
              <div className="text-xs text-slate-500 font-bold uppercase">Warnings</div>
              <div className="text-xl font-mono text-yellow-400">{logs.filter(l => l.level === 'WARN').length}</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg text-center">
              <div className="text-xs text-slate-500 font-bold uppercase">Success</div>
              <div className="text-xl font-mono text-green-400">{logs.filter(l => l.level === 'SUCCESS').length}</div>
          </div>
      </div>

      {/* Log Table Container (Fixed height for scrolling) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm h-[600px] flex flex-col relative">
          
          <div className="overflow-y-auto flex-1 scrollbar-thin scroll-smooth">
              <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 z-10 bg-slate-950/95 backdrop-blur-sm border-b border-slate-800 shadow-md">
                      <tr className="text-xs text-slate-500 uppercase font-bold">
                          <th className="p-4 w-32">Timestamp</th>
                          <th className="p-4 w-24">Level</th>
                          <th className="p-4">Message</th>
                          <th className="p-4 w-24 text-right">ID</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 font-mono text-sm">
                      {filteredLogs.length > 0 ? (
                          filteredLogs.map((log) => (
                              <tr key={log.id} className="hover:bg-slate-800/30 transition-colors group">
                                  <td className="p-4 text-slate-400 whitespace-nowrap text-xs">{log.timestamp}</td>
                                  <td className="p-4">
                                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-bold border ${getLevelStyle(log.level)}`}>
                                          {getLevelIcon(log.level)}
                                          {log.level}
                                      </span>
                                  </td>
                                  <td className="p-4 text-slate-300 break-all">{log.message}</td>
                                  <td className="p-4 text-slate-600 text-xs text-right font-mono opacity-50 group-hover:opacity-100">{log.id.slice(-6)}</td>
                              </tr>
                          ))
                      ) : (
                          <tr>
                              <td colSpan={4} className="p-12 text-center text-slate-500">
                                  <div className="flex flex-col items-center gap-2">
                                      <RefreshCw size={24} className="opacity-50" />
                                      <p>No logs found matching your criteria.</p>
                                  </div>
                              </td>
                          </tr>
                      )}
                      {/* Invisible anchor for auto-scrolling */}
                      <tr ref={logsEndRef}></tr>
                  </tbody>
              </table>
          </div>
          
          {/* Scroll to bottom indicator (Optional visual cue) */}
          <div className="absolute bottom-4 right-6 pointer-events-none opacity-0 transition-opacity duration-300">
             <div className="bg-indigo-600 text-white p-2 rounded-full shadow-lg animate-bounce">
                <ArrowDown size={16} />
             </div>
          </div>
      </div>
    </div>
  );
};
