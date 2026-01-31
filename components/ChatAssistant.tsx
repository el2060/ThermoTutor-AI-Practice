import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import LatexRenderer from './LatexRenderer';
import { generateChatResponse } from '../services/geminiService';

interface ChatAssistantProps {
  currentQuestionText: string;
  currentOptions: string[];
  isOpen: boolean;
  onClose: () => void;
}

const ChatAssistant: React.FC<ChatAssistantProps> = ({ 
  currentQuestionText, 
  currentOptions, 
  isOpen, 
  onClose 
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Stuck? Ask me anything about this question! I won\'t give you the answer, but I can help u figure it out. 🤓' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  // Reset chat when question changes (detected by prop change? 
  // Ideally parent handles this, but for now we keep history per session 
  // or we could add a "Clear" button. Let's keep history to maintain context.)

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const responseText = await generateChatResponse(
        currentQuestionText,
        currentOptions,
        messages,
        userMsg.text
      );
      
      const aiMsg: ChatMessage = { role: 'model', text: responseText };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: 'Alamak, error connecting to server. Try again?' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div 
      className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-white border-l-4 border-black shadow-[-10px_0px_20px_rgba(0,0,0,0.2)] transform transition-transform duration-300 z-50 flex flex-col ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Header */}
      <div className="bg-black text-white p-4 flex justify-between items-center border-b-2 border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
          <h3 className="font-mono font-bold uppercase tracking-widest">Tutor Bot</h3>
        </div>
        <button onClick={onClose} className="text-white hover:text-red-400 font-bold text-xl">
          &times;
        </button>
      </div>

      {/* Messages Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 bg-zinc-50 space-y-4">
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`max-w-[85%] p-3 font-mono text-sm border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] ${
              msg.role === 'user' 
                ? 'ml-auto bg-black text-white' 
                : 'mr-auto bg-white text-black'
            }`}
          >
             <LatexRenderer text={msg.text} />
          </div>
        ))}
        {isTyping && (
          <div className="mr-auto bg-white border-2 border-black p-3 rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-black rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-black rounded-full animate-bounce delay-75"></div>
              <div className="w-2 h-2 bg-black rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-4 border-t-2 border-black bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask for help..."
            className="flex-1 p-3 font-mono text-sm border-2 border-black focus:outline-none focus:bg-zinc-100"
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isTyping}
            className="bg-black text-white px-4 border-2 border-black font-bold hover:bg-zinc-800 disabled:opacity-50"
          >
            ➤
          </button>
        </div>
        <p className="text-[10px] font-mono text-zinc-400 mt-2 text-center uppercase">
          AI can make mistakes. Check your notes.
        </p>
      </form>
    </div>
  );
};

export default ChatAssistant;