
import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, ArrowUp } from 'lucide-react';
import { ChatMessage } from '../types';
import { sendMessageToCurator } from '../services/gemini';

const CuratorChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: "Namaste. I am your AI Curator. How can I assist you?",
      timestamp: Date.now()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
        scrollToBottom();
    }
  }, [messages, isOpen, isLoading]);

  const processMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      text: text,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const historyForAI = messages.map(m => ({ role: m.role, text: m.text }));
      const responseText = await sendMessageToCurator(userMessage.text, historyForAI);
      
      const botMessage: ChatMessage = {
        role: 'model',
        text: responseText || "I'm sorry, I'm having trouble connecting to the gallery records. Please try again.",
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    processMessage(input);
  };

  return (
    <>
      {/* Ultra-Minimal Floating Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-12 h-12 rounded-full bg-black text-white shadow-lg hover:scale-105 transition-all duration-300 animate-in fade-in zoom-in"
          aria-label="Open Curator Chat"
        >
          <Sparkles className="w-5 h-5" />
        </button>
      )}

      {/* Minimal Chat Window */}
      <div className={`fixed bottom-6 right-6 w-[90vw] md:w-[320px] h-[450px] max-h-[75vh] bg-white border border-gray-100 z-50 flex flex-col transition-all duration-300 origin-bottom-right shadow-xl rounded-xl overflow-hidden ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}>
          
          {/* Simple Header */}
          <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-semibold text-gray-700">Curator</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-black transition-colors">
                  <X className="w-4 h-4" />
              </button>
          </div>

          {/* Messages Area */}
          <div className="flex-grow overflow-y-auto p-4 space-y-3 scrollbar-hide bg-white">
              {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[90%] px-3 py-2 text-sm leading-snug ${
                          msg.role === 'user' 
                              ? 'bg-black text-white rounded-lg rounded-tr-none' 
                              : 'bg-gray-100 text-gray-800 rounded-lg rounded-tl-none'
                      }`}>
                          {msg.text}
                      </div>
                  </div>
              ))}
              
              {isLoading && (
                  <div className="flex justify-start">
                      <div className="bg-gray-50 px-3 py-2 rounded-lg rounded-tl-none flex gap-1 items-center">
                          <div className="w-1 h-1 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-1 h-1 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-1 h-1 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                  </div>
              )}
              <div ref={messagesEndRef} />
          </div>

          {/* Minimal Input Area */}
          <div className="p-3 border-t border-gray-50 bg-white">
              <form onSubmit={handleSend} className="relative flex items-center">
                  <input 
                      type="text" 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask me anything..."
                      disabled={isLoading}
                      className="w-full bg-gray-50 border-none rounded-lg py-2.5 pl-3 pr-10 text-xs focus:ring-0 outline-none placeholder:text-gray-400"
                  />
                  <button 
                      type="submit" 
                      disabled={!input.trim() || isLoading}
                      className="absolute right-1.5 w-7 h-7 bg-black text-white rounded-md flex items-center justify-center disabled:opacity-10 transition-all"
                  >
                      <ArrowUp className="w-3 h-3" />
                  </button>
              </form>
          </div>
      </div>
    </>
  );
};

export default CuratorChat;
