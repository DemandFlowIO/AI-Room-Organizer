
import React, { useState } from 'react';
import { KeyIcon, SparklesIcon } from './icons';

interface ApiKeyModalProps {
  onApiKeySet: (apiKey: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onApiKeySet }) => {
  const [inputKey, setInputKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputKey.trim()) {
      onApiKeySet(inputKey.trim());
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-slate-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg border border-slate-200">
        <div className="flex flex-col items-center text-center">
            <div className="bg-indigo-600 p-3 rounded-lg mb-4">
              <SparklesIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Room Organizer AI</h1>
            <p className="mt-2 text-slate-500">
                Please enter your Google Gemini API key to begin.
            </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="api-key" className="sr-only">Gemini API Key</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <KeyIcon className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                        id="api-key"
                        type="password"
                        value={inputKey}
                        onChange={(e) => setInputKey(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter your API key"
                        required
                    />
                </div>
            </div>

            <button
                type="submit"
                className="w-full px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                disabled={!inputKey.trim()}
            >
                Start Organizing
            </button>
        </form>

        <p className="text-xs text-center text-slate-500">
            You can get your API key from{' '}
            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="font-medium text-indigo-600 hover:underline">
                Google AI Studio
            </a>. Your key is stored in your browser's session storage and is never sent to any servers.
        </p>
      </div>
    </div>
  );
};
