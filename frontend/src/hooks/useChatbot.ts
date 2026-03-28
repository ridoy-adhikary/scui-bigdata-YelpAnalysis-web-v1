import { useState } from "react";
import { queryChatbot } from "../services/chatService";
import { getApiErrorMessage } from "../services/apiClient";
import type { ChatQueryResponse, Message } from "../types/chatbot.types";
export const useChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const [lastResult, setLastResult] = useState<ChatQueryResponse | null>(null);
  const [messages, setMessages] = useState<Message[]>([{
    id: "1", text: "Hello! Ask me anything about Yelp analytics and I will query the backend data pipeline for you.", sender: "bot", timestamp: new Date()
  }]);
  const sendMessage = async (text: string, mode: 'business' | 'friend' = 'business') => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const userMsg: Message = { id: Date.now().toString(), text: trimmed, sender: "user", timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);
    setError(null);
    try {
      const result = await queryChatbot({
        sessionId,
        query: trimmed,
        mode,
      });
      if (result.sessionId) {
        setSessionId(result.sessionId);
      }
      setLastResult(result);
      const botMsg: Message = { id: (Date.now() + 1).toString(), text: result.answer || "The backend returned an empty answer.", sender: "bot", timestamp: new Date() };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      const message = getApiErrorMessage(err);
      setError(message);
      const botMsg: Message = { id: (Date.now() + 1).toString(), text: `Backend request failed: ${message}`, sender: "bot", timestamp: new Date() };
      setMessages(prev => [...prev, botMsg]);
    } finally {
      setIsTyping(false);
    }
  };
  return { isOpen, setIsOpen, messages, isTyping, error, lastResult, sendMessage };
};
