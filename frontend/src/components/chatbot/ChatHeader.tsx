import React from 'react';
import { Bot, Minus, Sparkles, X } from 'lucide-react';

interface ChatHeaderProps {
  onClose: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ onClose }) => {
  return (
    <div className="h-16 bg-gradient-to-r from-primary-900 to-primary-700 p-4 flex items-center justify-between text-white shrink-0 border-b border-primary-300/30">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white/18 flex items-center justify-center">
          <Bot size={19} />
        </div>
        <div>
          <h3 className="font-display font-semibold text-base leading-tight">Yelp AI Analyst</h3>
          <p className="text-[10px] uppercase tracking-widest font-medium flex items-center gap-1 text-primary-100">
            <Sparkles size={10} className="text-yelp-red" />
            Online
          </p>
        </div>
      </div>
      <div className="flex gap-1">
        <button className="p-2 hover:bg-white/15 rounded-lg transition-colors" aria-label="Minimize">
          <Minus size={18} />
        </button>
        <button onClick={onClose} className="p-2 hover:bg-yelp-red rounded-lg transition-colors" aria-label="Close chatbot">
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;