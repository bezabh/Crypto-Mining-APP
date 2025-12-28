
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { ToastMessage } from '../types';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

interface ToastContextType {
  addToast: (title: string, description?: string, type?: ToastMessage['type'], duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((title: string, description?: string, type: ToastMessage['type'] = 'info', duration = 5000) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, title, description, type, duration }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[1000] flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-2xl border min-w-[300px] max-w-md animate-in slide-in-from-right-10 fade-in duration-300 ${
              toast.type === 'success' ? 'bg-slate-900 border-green-500/50 text-white' :
              toast.type === 'error' ? 'bg-slate-900 border-red-500/50 text-white' :
              toast.type === 'warning' ? 'bg-slate-900 border-yellow-500/50 text-white' :
              'bg-slate-900 border-indigo-500/50 text-white'
            }`}
          >
            <div className={`mt-0.5 ${
               toast.type === 'success' ? 'text-green-400' :
               toast.type === 'error' ? 'text-red-400' :
               toast.type === 'warning' ? 'text-yellow-400' : 'text-indigo-400'
            }`}>
                {toast.type === 'success' && <CheckCircle size={20} />}
                {toast.type === 'error' && <AlertCircle size={20} />}
                {toast.type === 'warning' && <AlertTriangle size={20} />}
                {toast.type === 'info' && <Info size={20} />}
            </div>
            <div className="flex-1">
                <h4 className="font-bold text-sm">{toast.title}</h4>
                {toast.description && <p className="text-xs text-slate-400 mt-1">{toast.description}</p>}
            </div>
            <button onClick={() => removeToast(toast.id)} className="text-slate-500 hover:text-white transition-colors">
                <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
