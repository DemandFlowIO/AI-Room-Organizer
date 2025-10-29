
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { ImageUpload } from './components/ImageUpload';
import { ChatWindow } from './components/ChatWindow';
import { WelcomeSplash } from './components/WelcomeSplash';
import { useGeminiChat } from './hooks/useGeminiChat';
import { ApiKeyModal } from './components/ApiKeyModal';

const App: React.FC = () => {
  const [apiKeySet, setApiKeySet] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { messages, sendMessage, isLoading, error, clearChat } = useGeminiChat();

  useEffect(() => {
    if (sessionStorage.getItem('gemini-api-key')) {
      setApiKeySet(true);
    }
  }, []);

  const handleApiKeySet = (key: string) => {
    sessionStorage.setItem('gemini-api-key', key);
    setApiKeySet(true);
  };

  const handleImageUpload = useCallback((file: File) => {
    setImageFile(file);
    clearChat();
    const initialPrompt = "You are an expert in home organization and interior design. Analyze this image of a room and provide specific, actionable suggestions to organize and declutter it. Present your suggestions in a friendly and encouraging tone, using markdown for formatting (like bullet points or numbered lists).";
    sendMessage(initialPrompt, file);
  }, [sendMessage, clearChat]);

  const handleNewAnalysis = useCallback(() => {
    setImageFile(null);
    clearChat();
  }, [clearChat]);

  const handleSendMessage = useCallback((message: string) => {
    sendMessage(message, null);
  }, [sendMessage]);

  if (!apiKeySet) {
    return <ApiKeyModal onApiKeySet={handleApiKeySet} />;
  }

  return (
    <div className="flex flex-col h-screen font-sans bg-slate-100">
      <Header />
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden gap-4 p-4">
        <div className="md:w-1/3 lg:w-2/5 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200">
          <ImageUpload onImageUpload={handleImageUpload} imageFile={imageFile} onNewAnalysis={handleNewAnalysis} isLoading={isLoading && messages.length === 0} />
        </div>
        <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {messages.length === 0 ? (
            <WelcomeSplash isLoading={isLoading} error={error} />
          ) : (
            <ChatWindow messages={messages} onSendMessage={handleSendMessage} isLoading={isLoading} error={error} />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
