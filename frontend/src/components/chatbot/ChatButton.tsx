import React from 'react';
import { MessageCircle, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChatButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

const ChatButton: React.FC<ChatButtonProps> = ({ isOpen, onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.08, y: -2 }}
      whileTap={{ scale: 0.94 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-700 to-primary-900 border-4 border-white shadow-xl flex items-center justify-center text-white focus:outline-none relative overflow-hidden"
    >
      <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.35),transparent_58%)]" />
      <motion.div
        animate={{ rotate: isOpen ? 100 : 0, opacity: isOpen ? 0 : 1, scale: isOpen ? 0.7 : 1 }}
        transition={{ duration: 0.22 }}
        className="absolute"
      >
        <MessageCircle size={28} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, rotate: -90 }}
        animate={{ rotate: isOpen ? 0 : -90, opacity: isOpen ? 1 : 0, scale: isOpen ? 1 : 0.75 }}
        transition={{ duration: 0.2 }}
        className="absolute"
      >
        <X size={28} />
      </motion.div>
      
      {/* Pulse effect */}
      {!isOpen && (
        <span className="absolute inset-0 rounded-full bg-yelp-red opacity-25 animate-ping"></span>
      )}
    </motion.button>
  );
};

export default ChatButton;