import React, { useState, useRef } from 'react';
import { editCatImage } from '../services/geminiService';
import { Wand2, ImagePlus, Loader2, Download } from 'lucide-react';

export const MagicStudio: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!image || !prompt) return;

    setLoading(true);
    try {
      const newImage = await editCatImage(image, prompt);
      if (newImage) {
        setImage(newImage);
      } else {
        alert("Failed to generate image.");
      }
    } catch (err) {
      alert("Error processing image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[800px] mx-auto p-6 bg-white/90 rounded-lg border-2 border-val-pink min-h-[400px]">
      <h2 className="font-pixel text-xl text-purple-600 mb-6 flex items-center gap-2">
        <Wand2 className="w-6 h-6" /> Magic Studio
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
           <div 
             className="w-full aspect-square bg-gray-100 rounded border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden cursor-pointer hover:bg-gray-50 transition-colors relative"
             onClick={() => !loading && fileInputRef.current?.click()}
           >
             {image ? (
               <img src={image} alt="Preview" className="w-full h-full object-contain" />
             ) : (
               <div className="text-center text-gray-400 p-4">
                 <ImagePlus className="w-12 h-12 mx-auto mb-2" />
                 <p className="text-sm font-sans">Click to upload an image</p>
               </div>
             )}
             {loading && (
               <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white">
                 <Loader2 className="w-8 h-8 animate-spin" />
               </div>
             )}
           </div>
           <input 
             type="file" 
             ref={fileInputRef} 
             className="hidden" 
             accept="image/*"
             onChange={handleFileChange}
           />
           
           {image && (
             <button 
               onClick={() => {
                 const a = document.createElement('a');
                 a.href = image;
                 a.download = 'pixel-cat-magic.png';
                 a.click();
               }}
               className="w-full flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-val-pink"
             >
               <Download size={16} /> Download Result
             </button>
           )}
        </div>

        <div className="flex flex-col justify-center space-y-4">
          <p className="text-sm text-gray-600 font-sans">
            Upload a photo (or a game screenshot) and use AI to transform it!
          </p>
          
          <div className="space-y-2">
            <label className="font-pixel text-xs text-gray-700">Magic Prompt</label>
            <textarea
              className="w-full p-3 border-2 border-gray-300 rounded focus:border-purple-500 focus:outline-none font-sans h-32 resize-none"
              placeholder="e.g., Make it look like a cyberpunk city, Add fireworks in the background..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>

          <button
            onClick={handleEdit}
            disabled={!image || !prompt || loading}
            className="w-full bg-purple-600 text-white font-pixel py-3 rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : <><Wand2 size={16} /> CAST SPELL</>}
          </button>
        </div>
      </div>
    </div>
  );
};