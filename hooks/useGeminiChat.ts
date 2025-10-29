
import { useState, useCallback, useRef } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { ChatMessage, MessageAuthor } from '../types';

async function fileToGenerativePart(file: File) {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
}

export const useGeminiChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const chatRef = useRef<Chat | null>(null);

  const getApiKey = () => {
    const key = sessionStorage.getItem('gemini-api-key');
    if (!key) {
      setError('Gemini API key not found. Please refresh and set your API key.');
      return null;
    }
    return key;
  };

  const sendMessage = useCallback(async (text: string, imageFile: File | null) => {
    setIsLoading(true);
    setError(null);

    const apiKey = getApiKey();
    if (!apiKey) {
      setIsLoading(false);
      return;
    }

    try {
        if (!chatRef.current) {
            const ai = new GoogleGenAI({ apiKey });
            chatRef.current = ai.chats.create({ model: 'gemini-2.5-flash' });
        }
        
        // Don't add user prompt for initial analysis to the chat history
        if (!imageFile) {
            setMessages((prevMessages) => [
                ...prevMessages,
                { author: MessageAuthor.USER, text },
            ]);
        }

        const parts = imageFile ? [await fileToGenerativePart(imageFile), { text }] : [{ text }];
        
        const response = await chatRef.current.sendMessage({ message: parts });

        if (response.text) {
            setMessages((prevMessages) => [
            ...prevMessages,
            { author: MessageAuthor.GEMINI, text: response.text },
            ]);
        } else {
             throw new Error('Received an empty response from the API.');
        }

    } catch (e: any) {
      console.error(e);
      setError(e.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
    chatRef.current = null;
  }, []);

  return { messages, sendMessage, isLoading, error, clearChat };
};
