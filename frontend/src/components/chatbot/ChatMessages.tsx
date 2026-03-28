import React, { useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatMessagesProps {
  messages: Message[];
  isTyping: boolean;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, isTyping }) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="flex-grow overflow-y-auto p-4 bg-gradient-to-b from-gray-100 to-white flex flex-col gap-4">
      {messages.map((msg) => (
        <ChatMessage key={msg.id} message={msg} />
      ))}
      {isTyping && <TypingIndicator />}
      <div ref={endRef} />
    </div>
  );
};

export default ChatMessages;