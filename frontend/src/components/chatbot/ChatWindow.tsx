import React from 'react';
import { motion } from 'framer-motion';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import { useChatbot } from '../../hooks/useChatbot';

const ChatWindow: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { messages, isTyping, sendMessage } = useChatbot();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: 'bottom right' }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className="absolute bottom-20 right-0 w-[420px] h-[620px] max-w-[calc(100vw-1.5rem)] bg-white rounded-3xl shadow-2xl border border-primary-200 flex flex-col overflow-hidden"
    >
      <ChatHeader onClose={onClose} />
      <ChatMessages messages={messages} isTyping={isTyping} />
      <ChatInput onSend={(text) => sendMessage(text, 'business')} />
    </motion.div>
  );
};

export default ChatWindow;