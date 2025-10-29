
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, MessageAuthor } from '../types';
import { PaperAirplaneIcon, LoadingSpinner, UserIcon, SparklesIcon } from './icons';

interface ChatWindowProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  error: string | null;
}

const ChatBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isGemini = message.author === MessageAuthor.GEMINI;

  const formattedText = message.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                   .replace(/\*(.*?)\*/g, '<em>$1</em>')
                                   .replace(/(\d+\.)/g, '<br/>$1')
                                   .replace(/^-/gm, '<br/>-');

  return (
    <div className={`flex items-start gap-3 my-4 ${isGemini ? '' : 'flex-row-reverse'}`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isGemini ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
        {isGemini ? <SparklesIcon className="w-5 h-5" /> : <UserIcon className="w-5 h-5" />}
      </div>
      <div 
        className={`p-4 rounded-lg max-w-lg ${isGemini ? 'bg-slate-100 text-slate-800' : 'bg-indigo-500 text-white'}`}
        dangerouslySetInnerHTML={{ __html: formattedText }}
      />
    </div>
  );
};


export const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onSendMessage, isLoading, error }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
        {messages.map((msg, index) => (
          <ChatBubble key={index} message={msg} />
        ))}
        {isLoading && messages.length > 0 && (
             <div className="flex items-start gap-3 my-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-indigo-600 text-white">
                    <SparklesIcon className="w-5 h-5" />
                </div>
                <div className="p-4 rounded-lg bg-slate-100 flex items-center">
                    <LoadingSpinner className="w-5 h-5 text-indigo-600"/>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
       {error && (
        <div className="p-4 text-center text-red-600 bg-red-100 border-t border-red-200">
            <strong>Error:</strong> {error}
        </div>
       )}
      <div className="p-4 border-t border-slate-200">
        <form onSubmit={handleSubmit} className="flex items-center gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a follow-up question..."
            className="flex-1 px-4 py-2 border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="w-10 h-10 flex-shrink-0 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700 transition-colors disabled:bg-indigo-300 disabled:cursor-not-allowed"
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
