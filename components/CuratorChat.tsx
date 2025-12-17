
import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Sparkles, X, ArrowUp } from 'lucide-react';
import { ChatMessage } from '../types';
import { sendMessageToCurator } from '../services/gemini';

const CuratorChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: "Namaste. I am your AI Curator. Ask me about exhibitions, tickets, or the collection.",
      timestamp: Date.now()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    "Opening hours?",
    "Ticket prices?",
    "Current exhibitions?",
    "Where is the museum?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
        scrollToBottom();
    }
  }, [messages, isOpen]);

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
        text: responseText || "I apologize, I'm having trouble retrieving that information right now.",
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

  const handleQuickQuestion = (question: string) => {
    processMessage(question);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 group flex items-center justify-center w-16 h-16 rounded-full transition-all duration-300 shadow-2xl ${isOpen ? 'bg-white text-black border-2 border-black rotate-90 scale-0 opacity-0 pointer-events-none' : 'bg-black text-white border-2 border-black hover:scale-110'}`}
        aria-label="Open AI Curator"
      >
          <div className="relative">
              <Sparkles className="w-6 h-6" />
          </div>
          {/* Tooltip */}
          <span className="absolute right-full mr-4 bg-black text-white text-xs font-bold px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none uppercase tracking-wider">
            Ask Curator
          </span>
      </button>

      {/* Chat Popup Window */}
      <div className={`fixed bottom-6 right-6 w-[90vw] md:w-[380px] h-[600px] max-h-[80vh] bg-white border-2 border-black z-50 flex flex-col transition-all duration-500 origin-bottom-right shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 pointer-events-none translate-y-12'}`}>
          
          {/* Header */}
          <div className="bg-black text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center border border-white">
                      <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                      <h3 className="font-bold text-lg leading-none tracking-tight">AI Curator</h3>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Virtual Guide</p>
                  </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                aria-label="Close Chat"
              >
                  <X className="w-5 h-5 text-white" />
              </button>
          </div>

          {/* Messages Area */}
          <div className="flex-grow overflow-y-auto p-5 space-y-6 bg-white">
              {messages.map((msg, idx) => (
                  <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 border-black ${msg.role === 'user' ? 'bg-black text-white' : 'bg-white text-black'}`}>
                          {msg.role === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                      </div>
                      <div className={`max-w-[80%] p-3 text-sm font-medium leading-relaxed border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                          msg.role === 'user' 
                              ? 'bg-black text-white' 
                              : 'bg-white text-black'
                      }`}>
                          {msg.text}
                      </div>
                  </div>
              ))}
              
              {isLoading && (
                  <div className="flex gap-3 animate-pulse">
                       <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 border-black bg-white text-black">
                          <Sparkles className="w-4 h-4" />
                      </div>
                      <div className="bg-white border-2 border-black p-4 flex items-center gap-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                          <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                  </div>
              )}
              <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions (Only show if not loading) */}
          {!isLoading && messages.length < 4 && (
             <div className="px-5 pb-2 flex gap-2 overflow-x-auto scrollbar-hide">
                {suggestedQuestions.map((q, i) => (
                    <button 
                        key={i}
                        onClick={() => handleQuickQuestion(q)}
                        className="whitespace-nowrap px-3 py-1.5 bg-gray-50 border border-black text-xs font-bold hover:bg-black hover:text-white transition-colors flex-shrink-0"
                    >
                        {q}
                    </button>
                ))}
             </div>
          )}

          {/* Input Area */}
          <div className="p-5 bg-white border-t-2 border-black">
              <form onSubmit={handleSend} className="relative flex items-center">
                  <input 
                      type="text" 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Type your query..."
                      disabled={isLoading}
                      className="w-full bg-white border-2 border-black text-black placeholder:text-gray-400 py-3 pl-4 pr-12 focus:outline-none focus:bg-gray-50 transition-all font-bold text-sm"
                  />
                  <button 
                      type="submit" 
                      disabled={!input.trim() || isLoading}
                      className="absolute right-3 p-1.5 bg-black text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                      <ArrowUp className="w-4 h-4" />
                  </button>
              </form>
          </div>
      </div>
    </>
  );
};

export default CuratorChat;
