
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { UploadIcon, RefreshIcon } from './icons';

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  imageFile: File | null;
  onNewAnalysis: () => void;
  isLoading: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload, imageFile, onNewAnalysis, isLoading }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [imageFile]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
        onImageUpload(file);
    }
  };

  return (
    <div className="p-6 flex flex-col h-full">
      <h2 className="text-lg font-semibold text-slate-700 mb-4">Your Room Photo</h2>
      <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-lg p-4 text-center bg-slate-50 relative overflow-hidden" onDragOver={handleDragOver} onDrop={handleDrop}>
        {previewUrl ? (
          <img src={previewUrl} alt="Room preview" className="max-h-full max-w-full object-contain rounded-md" />
        ) : (
          <div className="flex flex-col items-center text-slate-500">
            <UploadIcon className="w-12 h-12 mb-2" />
            <p className="font-semibold">Drag & drop an image</p>
            <p className="text-sm">or</p>
            <button
              onClick={handleUploadClick}
              disabled={isLoading}
              className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-700 transition-colors disabled:bg-indigo-300"
            >
              Browse Files
            </button>
          </div>
        )}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
      </div>
       {imageFile && (
         <button
            onClick={onNewAnalysis}
            disabled={isLoading}
            className="mt-4 w-full flex items-center justify-center px-4 py-2 bg-slate-600 text-white rounded-md font-semibold hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            <RefreshIcon className="w-5 h-5 mr-2" />
            Analyze a New Photo
          </button>
       )}
    </div>
  );
};
