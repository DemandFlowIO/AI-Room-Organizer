import React from 'react';
import { SparklesIcon, LoadingSpinner, ExclamationTriangleIcon } from './icons';

interface WelcomeSplashProps {
  isLoading: boolean;
  error: string | null;
}

export const WelcomeSplash: React.FC<WelcomeSplashProps> = ({ isLoading, error }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-slate-50 rounded-lg">
      {isLoading ? (
        <>
            <LoadingSpinner className="w-12 h-12 text-indigo-600 mb-4" />
            <h2 className="text-2xl font-bold text-slate-700">Analyzing your space...</h2>
            <p className="text-slate-500 mt-2 max-w-md">Our AI is getting its creative juices flowing to bring you the best ideas!</p>
        </>
      ) : error ? (
        <div className="flex flex-col items-center justify-center text-red-700 bg-red-50 p-6 rounded-lg border border-red-200 shadow-sm max-w-md w-full">
          <ExclamationTriangleIcon className="w-12 h-12 mb-4 text-red-500" />
          <h3 className="text-xl font-bold mb-2">An Error Occurred</h3>
          <p className="text-slate-600 text-sm bg-red-100 p-3 rounded-md w-full text-left font-mono">{error}</p>
        </div>
      ) : (
        <>
          <SparklesIcon className="w-16 h-16 text-indigo-500 mb-4" />
          <h2 className="text-2xl font-bold text-slate-700">Ready to Declutter?</h2>
          <p className="text-slate-500 mt-2 max-w-md">Upload a photo of any room, and our AI will provide personalized organization suggestions and design ideas to create your perfect space.</p>
        </>
      )}
    </div>
  );
};
