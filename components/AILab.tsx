
import React, { useState } from 'react';
import { Sparkles, Image as ImageIcon, Download, RefreshCw, Cpu, Zap, Palette, Layers, Box, Paintbrush } from 'lucide-react';
import { generateMiningArt } from '../services/geminiService';
import { useToast } from '../contexts/ToastContext';

interface AILabProps {
  onUpdateAvatar?: (url: string) => void;
}

export const AILab: React.FC<AILabProps> = ({ onUpdateAvatar }) => {
  const { addToast } = useToast();
  const [prompt, setPrompt] = useState('hyper-realistic ASIC miner with neon cooling tubes');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [activeStyle, setActiveStyle] = useState('Cyberpunk');

  const STYLES = ['Cyberpunk', 'Military', 'Futuristic', 'Neon-Abstract', 'Retro-Tech'];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    try {
      const fullPrompt = `${activeStyle} themed ${prompt}`;
      const imageUrl = await generateMiningArt(fullPrompt);
      setGeneratedImage(imageUrl);
      addToast("Art Artifact Forged", "Your custom node visualization is ready.", "success");
    } catch (e) {
      addToast("Forge Failed", "AI node synchronization error. Try a different prompt.", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSetAvatar = () => {
    if (generatedImage && onUpdateAvatar) {
      onUpdateAvatar(generatedImage);
      addToast("Avatar Updated", "Profile identity updated with AI artifact.", "success");
    }
  };

  return (
    <div className="p-6 h-full overflow-y-auto bg-[#050508] animate-in fade-in duration-500 scrollbar-thin">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center gap-4 border-b border-slate-800 pb-6">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.4)]">
            <Sparkles size={32} className="text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">AI Forge Lab</h2>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Generate custom node visualizations and avatars</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                  <Palette size={160} className="text-indigo-500" />
               </div>
               
               <div className="space-y-4 relative z-10">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Visualization Prompt</label>
                  <textarea 
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    placeholder="Describe your mining rig aesthetic..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-6 text-white text-lg focus:border-indigo-500 outline-none resize-none h-40 transition-all font-display"
                  />
               </div>

               <div className="space-y-4 relative z-10">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Architectural Style</label>
                  <div className="flex flex-wrap gap-2">
                    {STYLES.map(style => (
                      <button 
                        key={style}
                        onClick={() => setActiveStyle(style)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${activeStyle === style ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-950 text-slate-500 border border-slate-800 hover:border-slate-600'}`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
               </div>

               <button 
                 onClick={handleGenerate}
                 disabled={isGenerating}
                 className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 shadow-2xl transition-all active:scale-95 uppercase tracking-widest text-sm"
               >
                 {isGenerating ? <RefreshCw className="animate-spin" size={20} /> : <Zap size={20} />}
                 {isGenerating ? 'Forging Artifact...' : 'Execute AI Generation'}
               </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
               <FeatureCard icon={<Cpu size={20}/>} label="GPU Mesh" value="Active" />
               <FeatureCard icon={<Box size={20}/>} label="3D Modeling" value="Linked" />
               <FeatureCard icon={<Paintbrush size={20}/>} label="Style Link" value="v2.5" />
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-6">
             <div className="aspect-square bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden relative shadow-2xl group">
                {generatedImage ? (
                  <>
                    <img src={generatedImage} alt="Generated Art" className="w-full h-full object-cover animate-in zoom-in duration-700" />
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-4">
                       <button onClick={handleSetAvatar} className="bg-indigo-600 text-white p-4 rounded-2xl shadow-xl hover:scale-110 transition-transform flex flex-col items-center gap-1">
                          <ImageIcon size={24}/>
                          <span className="text-[10px] font-black uppercase">Set Avatar</span>
                       </button>
                       <a href={generatedImage} download="tigapp_node_art.png" className="bg-slate-800 text-white p-4 rounded-2xl shadow-xl hover:scale-110 transition-transform flex flex-col items-center gap-1">
                          <Download size={24}/>
                          <span className="text-[10px] font-black uppercase">Download</span>
                       </a>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-700 gap-4 p-12 text-center border-4 border-dashed border-slate-800">
                     <ImageIcon size={64} className="opacity-20" />
                     <div>
                        <h4 className="text-white font-black uppercase tracking-tight">Artifact Viewport</h4>
                        <p className="text-xs font-bold uppercase tracking-widest mt-1 opacity-50">Forge an image to see it here</p>
                     </div>
                  </div>
                )}
             </div>

             <div className="bg-indigo-900/10 border border-indigo-500/20 rounded-2xl p-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-indigo-600/20 rounded-xl flex items-center justify-center shrink-0 border border-indigo-500/30 text-indigo-400">
                    <Layers size={24} />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-white font-black uppercase tracking-tight text-sm italic">NFT Node Export</h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed font-bold uppercase tracking-widest">
                      Generated artifacts can be minted as unique node identification NFTs on the Base or Solana networks. (Coming Soon)
                    </p>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, label, value }: any) => (
  <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-center">
    <div className="mb-2 flex justify-center text-indigo-400">{icon}</div>
    <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</div>
    <div className="text-xs font-black text-white uppercase">{value}</div>
  </div>
);
