
import React, { useState } from 'react';
import { TrendingUp, Loader2, Sparkles } from 'lucide-react';
import { getProfitabilityPrediction } from '../services/geminiService';

export const ProfitPredictor: React.FC = () => {
  const [prediction, setPrediction] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    setLoading(true);
    // Simulate fetching live market data context
    const mockContext = `
      BTC Price: $65,432 (+2.4%)
      ETH Price: $3,450 (-1.2%)
      Global Hashrate: 540 EH/s
      Energy Cost Index: Moderate
      Altcoin Volatility: High
    `;
    
    try {
        const result = await getProfitabilityPrediction(mockContext);
        setPrediction(result);
    } catch (error) {
        setPrediction("Unable to generate prediction. AI Service unavailable.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative overflow-hidden group">
      {/* Glow Effect */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-opacity opacity-50 group-hover:opacity-100"></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                    <TrendingUp size={20} />
                </div>
                <div>
                    <h3 className="font-bold text-white text-sm">Profit Predictor</h3>
                    <p className="text-xs text-slate-500">AI-driven market forecast</p>
                </div>
            </div>
            {prediction && !loading && (
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded border border-emerald-500/20 font-bold uppercase animate-in fade-in">
                    Updated
                </span>
            )}
        </div>

        <div className="min-h-[80px] bg-slate-950/50 rounded-lg border border-slate-800 p-3 mb-4">
            {loading ? (
                <div className="flex flex-col items-center justify-center h-full py-2 gap-2 text-emerald-400">
                    <Loader2 className="animate-spin" size={20} />
                    <span className="text-xs animate-pulse">Analyzing market trends...</span>
                </div>
            ) : prediction ? (
                <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-line animate-in fade-in">
                    <span className="text-emerald-400 font-bold block mb-1">Recommendation:</span>
                    {prediction}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-full py-2 text-slate-500 gap-1">
                    <Sparkles size={16} />
                    <span className="text-xs">Ready to forecast</span>
                </div>
            )}
        </div>

        <button 
            onClick={handlePredict}
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-white text-sm font-bold py-3 rounded-lg transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2"
        >
            {loading ? 'Processing...' : 'Forecast Next 24h'}
        </button>
      </div>
    </div>
  );
};
