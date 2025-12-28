
import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, MessageSquare, Book, ChevronRight, Loader2, Sparkles, ChevronLeft, Search, Activity } from 'lucide-react';
import { getAIChatResponse, getAIGuide } from '../services/geminiService';

const ADVANCED_ROBOT_URL = "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop";

interface Message {
  role: 'user' | 'ai';
  text: string;
}

const GUIDE_TOPICS = [
  "Getting Started with TigAppMining",
  "How to Deposit via CBE Mobile",
  "Connecting Binance Account",
  "Understanding TigApp Hashrates",
  "Wallet Security Best Practices",
  "Optimizing Power Consumption"
];

export const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'CHAT' | 'GUIDES'>('CHAT');
  
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: 'Operational handshake complete. TigApp AI Core v4.0 is active. State your query.' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [selectedGuide, setSelectedGuide] = useState<string | null>(null);
  const [guideContent, setGuideContent] = useState<string>('');
  const [isLoadingGuide, setIsLoadingGuide] = useState(false);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen, activeTab]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = inputText;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInputText('');
    setIsTyping(true);

    const aiResponse = await getAIChatResponse(userMsg);
    
    setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
    setIsTyping(false);
  };

  const handleSelectGuide = async (topic: string) => {
    setSelectedGuide(topic);
    setIsLoadingGuide(true);
    const content = await getAIGuide(topic);
    setGuideContent(content);
    setIsLoadingGuide(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      {isOpen && (
        <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-xl border border-indigo-500/30 rounded-3xl shadow-2xl w-80 md:w-[420px] h-[600px] flex flex-col overflow-hidden mb-6 animate-in slide-in-from-bottom-10 fade-in duration-500 shadow-[0_0_100px_rgba(0,0,0,0.5)]">
          <div className="bg-slate-950 p-6 border-b border-slate-800 flex justify-between items-center">
             <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-indigo-600 rounded-2xl overflow-hidden border-2 border-indigo-400/50 shadow-lg relative group">
                   <img src={ADVANCED_ROBOT_URL} alt="Advanced AI" className="w-full h-full object-cover brightness-110" />
                   <div className="absolute inset-0 bg-indigo-500/20 mix-blend-overlay"></div>
                </div>
                <div>
                   <h3 className="text-white font-black uppercase text-sm italic">AI Forge Core</h3>
                   <div className="flex items-center gap-2 mt-0.5"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span><span className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em]">Synthesis Active</span></div>
                </div>
             </div>
             <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white transition-colors p-2"><X size={24} /></button>
          </div>
          <div className="flex border-b border-slate-800 bg-slate-950/50">
             <button onClick={() => setActiveTab('CHAT')} className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all ${activeTab === 'CHAT' ? 'text-indigo-400 border-b-2 border-indigo-500 bg-indigo-500/5' : 'text-slate-500'}`}>Neural Chat</button>
             <button onClick={() => setActiveTab('GUIDES')} className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all ${activeTab === 'GUIDES' ? 'text-indigo-400 border-b-2 border-indigo-500 bg-indigo-500/5' : 'text-slate-500'}`}>Node Archive</button>
          </div>
          <div className="flex-1 overflow-y-auto bg-slate-900/30 p-6">
             {activeTab === 'CHAT' ? (
               <div className="space-y-6">
                  {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                       <div className={`max-w-[85%] rounded-[1.5rem] p-4 text-sm font-medium shadow-xl ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'}`}>
                          {msg.text}
                          <div className="mt-2 text-[8px] opacity-40 uppercase font-black tracking-widest">
                             {new Date().toLocaleTimeString().slice(0,5)} {msg.role === 'ai' ? ':: AI-NODE' : ':: OPERATOR'}
                          </div>
                       </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex gap-2 p-4 bg-slate-800 rounded-2xl w-fit border border-slate-700 animate-pulse">
                        <Activity size={14} className="text-indigo-400 animate-spin" />
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Synthesizing...</span>
                    </div>
                  )}
                  <div ref={chatEndRef} />
               </div>
             ) : (
               <div className="space-y-3">
                 {selectedGuide ? (
                   <div className="animate-in fade-in slide-in-from-left-4">
                     <button onClick={() => setSelectedGuide(null)} className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mb-6 flex items-center gap-2 hover:text-white transition-colors">
                        <ChevronLeft size={14}/> Back to Index
                     </button>
                     {isLoadingGuide ? <div className="py-10 flex justify-center"><Loader2 className="animate-spin text-indigo-500" size={32} /></div> : <div className="text-sm text-slate-300 leading-relaxed bg-slate-950 border border-slate-800 p-6 rounded-[2rem] font-medium italic">"{guideContent}"</div>}
                   </div>
                 ) : (
                   GUIDE_TOPICS.map(t => (
                    <button key={t} onClick={() => handleSelectGuide(t)} className="w-full text-left p-5 bg-slate-800/50 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/30 rounded-2xl transition-all flex items-center justify-between group">
                      <span className="text-xs font-black text-slate-200 uppercase tracking-wide group-hover:text-white">{t}</span>
                      <ChevronRight size={16} className="text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                    </button>
                   ))
                 )}
               </div>
             )}
          </div>
          {activeTab === 'CHAT' && (
            <form onSubmit={handleSendMessage} className="p-4 bg-slate-950 border-t border-slate-800 flex gap-3">
               <input value={inputText} onChange={e => setInputText(e.target.value)} placeholder="Query AI Forge..." className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-6 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 shadow-inner font-medium" />
               <button type="submit" className="bg-indigo-600 p-4 rounded-2xl text-white shadow-xl hover:bg-indigo-500 transition-all active:scale-90"><Send size={20} /></button>
            </form>
          )}
        </div>
      )}
      <button onClick={() => setIsOpen(!isOpen)} className="pointer-events-auto bg-slate-900 p-1.5 rounded-full shadow-2xl transition-all hover:scale-110 active:scale-95 group relative border-4 border-indigo-500/50 overflow-hidden">
        <div className="w-14 h-14 rounded-full overflow-hidden relative z-10">
           <img src={ADVANCED_ROBOT_URL} className={`w-full h-full object-cover transition-all duration-700 ${isOpen ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100 grayscale hover:grayscale-0'}`} />
           {isOpen && <X size={28} className="text-white absolute inset-0 m-auto animate-in zoom-in" />}
        </div>
        {!isOpen && <div className="absolute inset-0 bg-indigo-500/20 group-hover:bg-indigo-500/40 transition-colors animate-pulse"></div>}
      </button>
    </div>
  );
};
