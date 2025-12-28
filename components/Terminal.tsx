
import React, { useEffect, useRef } from 'react';
import { LogEntry } from '../types';

interface TerminalProps {
  logs: LogEntry[];
}

export const Terminal: React.FC<TerminalProps> = ({ logs }) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'INFO': return 'text-blue-500';
      case 'WARN': return 'text-yellow-500';
      case 'ERROR': return 'text-red-600';
      case 'SUCCESS': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="bg-black border border-green-500/20 rounded-lg p-5 h-64 overflow-y-auto font-mono text-[11px] shadow-2xl relative">
      <div className="flex justify-between items-center mb-4 sticky top-0 bg-black/90 backdrop-blur-md pb-2 border-b border-green-500/10 z-10">
        <span className="text-[9px] uppercase tracking-[0.4em] text-green-700 font-black italic">TigApp :: System Console</span>
        <div className="flex space-x-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-900/50 border border-red-500/50"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-900/50 border border-yellow-500/50"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-green-900/50 border border-green-500/50"></div>
        </div>
      </div>
      <div className="space-y-1.5">
        {logs.map((log) => (
          <div key={log.id} className="break-all font-black uppercase tracking-tight leading-relaxed">
            <span className="text-slate-700 mr-2">[{log.timestamp}]</span>
            <span className={`mr-2 ${getLevelColor(log.level)}`}>{log.level}:</span>
            <span className="text-slate-400 group-hover:text-white transition-colors">{log.message}</span>
          </div>
        ))}
        <div ref={endRef} className="h-4 animate-pulse bg-green-500/20 w-2 ml-1"></div>
      </div>
    </div>
  );
};
