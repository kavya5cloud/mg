
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, User, Sparkles, ChevronRight } from 'lucide-react';
import { sendMessageToCurator } from '../services/gemini';
import { ChatMessage } from '../types';

const CuratorChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Namaste! I am the MOCA AI Curator. How can I help you plan your visit today?', timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    "What are the ticket prices?",
    "When are you open?",
    "Where is the museum?",
    "What's on display?",
    "Is there parking?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent, textOverride?: string) => {
    e?.preventDefault();
    const textToSend = textOverride || input;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = { role: 'user', text: textToSend, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const responseText = await sendMessageToCurator(textToSend);
    
    const botMsg: ChatMessage = { role: 'model', text: responseText, timestamp: Date.now() };
    setMessages(prev => [...prev, botMsg]);
    setIsLoading(false);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 bg-white/90 backdrop-blur-sm border border-gray-200 hover:border-black px-4 py-3 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl flex items-center gap-3 group ${isOpen ? 'opacity-0 pointer-events-none translate-y-10' : 'opacity-100'}`}
      >
        <Sparkles className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors" />
        <span className="text-xs font-bold uppercase tracking-widest text-gray-500 group-hover:text-black transition-colors">AI Curator</span>
      </button>

      {/* Chat Interface */}
      <div 
        className={`fixed bottom-0 right-0 md:bottom-8 md:right-8 z-50 w-full md:w-[400px] h-[100dvh] md:h-[600px] bg-white md:rounded-2xl shadow-2xl flex flex-col transition-all duration-500 transform ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-[110%] opacity-0'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-black text-white md:rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm">MOCA Curator AI</h3>
              <p className="text-[10px] text-gray-400">Ask me anything</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-black text-white rounded-tr-sm' 
                    : 'bg-white border border-gray-200 shadow-sm text-gray-800 rounded-tl-sm'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
               <div className="bg-white border border-gray-200 p-4 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-2">
                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies & Input */}
        <div className="bg-white border-t border-gray-100 md:rounded-b-2xl">
           {/* Quick Chips */}
           <div className="px-4 pt-4 pb-2 flex gap-2 overflow-x-auto scrollbar-hide">
              {quickQuestions.map((q, i) => (
                  <button 
                    key={i}
                    onClick={() => handleSend(undefined, q)}
                    disabled={isLoading}
                    className="flex-shrink-0 bg-gray-100 hover:bg-black hover:text-white transition-colors text-xs font-medium px-3 py-2 rounded-lg whitespace-nowrap border border-gray-200"
                  >
                    {q}
                  </button>
              ))}
           </div>

           {/* Text Input */}
           <form onSubmit={(e) => handleSend(e)} className="p-4">
            <div className="flex items-center gap-2">
                <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your question..."
                className="flex-grow bg-gray-50 border border-gray-200 rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-black transition-all"
                />
                <button 
                type="submit"
                disabled={isLoading || !input.trim()}
                className="p-3 bg-black text-white rounded-full hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
                >
                <Send className="w-4 h-4" />
                </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CuratorChat;
