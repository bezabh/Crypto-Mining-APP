
import React, { useState } from 'react';
import { X, Star, Send, MessageSquarePlus, CheckCircle2, Loader2, Smile } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EMOJIS = ['👍', '🔥', '🚀', '💎', '💸', '❤️', '😀', '😂', '😎', '🤔', '🎉', '⭐'];

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
      
      // Reset after showing success
      setTimeout(() => {
        setIsSent(false);
        setRating(0);
        setComment('');
        setEmail('');
        onClose();
      }, 2500);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <MessageSquarePlus className="text-indigo-500" /> Comments & Feedback
          </h3>
          <button 
            onClick={onClose}
            className="text-slate-500 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSent ? (
            <div className="flex flex-col items-center justify-center py-8 text-center animate-in zoom-in duration-300">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mb-4">
                <CheckCircle2 size={32} />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Thank You!</h4>
              <p className="text-slate-400">Your feedback helps us improve PrimeMine AI.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Star Rating */}
              <div className="text-center">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-3">Rate your experience</label>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="transition-transform hover:scale-110 focus:outline-none"
                    >
                      <Star 
                        size={32} 
                        className={`${
                          star <= (hoverRating || rating) 
                            ? 'text-yellow-400 fill-yellow-400' 
                            : 'text-slate-700'
                        } transition-colors`} 
                      />
                    </button>
                  ))}
                </div>
                <div className="h-4 mt-2 text-xs font-bold text-indigo-400">
                  {hoverRating === 1 && "Poor"}
                  {hoverRating === 2 && "Fair"}
                  {hoverRating === 3 && "Good"}
                  {hoverRating === 4 && "Very Good"}
                  {hoverRating === 5 && "Excellent"}
                </div>
              </div>

              {/* Comment Textarea */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Your Comments</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us what you like or how we can improve..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-indigo-500 outline-none h-32 resize-none"
                ></textarea>
                
                {/* Emoji Picker */}
                <div className="flex items-center gap-2 mt-2 overflow-x-auto py-1 no-scrollbar">
                   <Smile size={16} className="text-slate-500 shrink-0" />
                   {EMOJIS.map(emoji => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setComment(prev => prev + emoji)}
                        className="text-lg hover:bg-slate-800 rounded p-1 transition-colors hover:scale-110 transform duration-200"
                      >
                        {emoji}
                      </button>
                   ))}
                </div>
              </div>

              {/* Email (Optional) */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email (Optional)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="For follow-up..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-indigo-500 outline-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={rating === 0 || isSubmitting}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold py-3 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all"
              >
                {isSubmitting ? (
                  <><Loader2 className="animate-spin" size={18} /> Sending...</>
                ) : (
                  <><Send size={18} /> Submit Feedback</>
                )}
              </button>
            </form>
          )}
        </div>
        
        {/* Footer */}
        <div className="bg-slate-950/50 p-3 text-center border-t border-slate-800">
           <p className="text-[10px] text-slate-500">Feedback is reviewed by our QA team daily.</p>
        </div>
      </div>
    </div>
  );
};
