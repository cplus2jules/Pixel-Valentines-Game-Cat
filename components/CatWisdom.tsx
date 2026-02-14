import React, { useState } from 'react';
import { searchCatWisdom } from '../services/geminiService';
import { Search, Loader2, ExternalLink } from 'lucide-react';

export const CatWisdom: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<{ text: string, sources: string[] } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResult(null);
    try {
      const data = await searchCatWisdom(query);
      setResult(data);
    } catch (err) {
      setResult({ text: "Sorry, I couldn't fetch any feline wisdom right now.", sources: [] });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[800px] mx-auto p-6 bg-white/90 rounded-lg border-2 border-val-pink min-h-[400px]">
      <h2 className="font-pixel text-xl text-bart-orange mb-6 flex items-center gap-2">
        <Search className="w-6 h-6" /> Cat Wisdom
      </h2>
      
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask about cats... (e.g., Why do cats purr?)"
          className="flex-1 p-3 border-2 border-gray-300 rounded font-sans focus:border-val-pink focus:outline-none"
        />
        <button 
          type="submit" 
          disabled={loading}
          className="bg-val-pink text-white px-6 py-2 rounded font-pixel text-xs hover:bg-red-600 disabled:opacity-50 transition-colors"
        >
          {loading ? <Loader2 className="animate-spin" /> : 'ASK'}
        </button>
      </form>

      {result && (
        <div className="animate-fade-in space-y-4">
          <div className="p-4 bg-orange-50 rounded border border-orange-100">
             <p className="font-sans text-gray-800 leading-relaxed whitespace-pre-wrap">{result.text}</p>
          </div>
          
          {result.sources.length > 0 && (
            <div className="text-xs text-gray-500">
              <p className="font-bold mb-1">Sources:</p>
              <ul className="list-disc pl-4 space-y-1">
                {result.sources.map((source, idx) => (
                  <li key={idx}>
                    <a href={source} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center gap-1">
                      {new URL(source).hostname} <ExternalLink size={10} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      
      {!result && !loading && (
        <div className="text-center text-gray-400 mt-12 font-sans italic">
          Curious about your feline friends? Ask away! <br/>
          Powered by Gemini Grounding.
        </div>
      )}
    </div>
  );
};