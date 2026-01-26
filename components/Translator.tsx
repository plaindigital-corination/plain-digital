import React, { useState } from 'react';
import { translateJargon } from '../services/geminiService';
import { JargonTranslation } from '../types';

const SUGGESTIONS = [
  'Technical Debt',
  'Iterative Deployment',
  'MVP',
  'Stakeholder Management'
];

export const Translator: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [translation, setTranslation] = useState<JargonTranslation | null>(null);
  const [copied, setCopied] = useState(false);

  const handleTranslate = async (e?: React.FormEvent, overrideInput?: string) => {
    if (e) e.preventDefault();
    const termToTranslate = overrideInput || input;
    if (!termToTranslate.trim()) return;
    
    setLoading(true);
    setError(null);
    setTranslation(null);
    try {
      const result = await translateJargon(termToTranslate);
      setTranslation(result);
    } catch (err: any) {
      console.error(err);
      const errorMessage = err.message || String(err);
      
      if (errorMessage.includes('safety') || errorMessage.includes('blocked')) {
        setError('The AI was unable to translate this specific term due to safety filters. Try another term.');
      } else {
        setError("I'm having trouble simplifying this term right now. Please try again in a few moments.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    handleTranslate(undefined, suggestion);
  };

  const copyToClipboard = () => {
    if (!translation) return;
    const text = `Word: ${translation.original}\nEasy English: ${translation.plainVersion}\nSimple Comparison: ${translation.analogy}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl text-left space-y-12 animate-in fade-in duration-700">
      <header className="pb-4">
        <h2 className="text-4xl font-bold text-neutral-700 uppercase tracking-tight">JARGON <span className="serif italic font-normal text-neutral-400 lowercase">Translator</span></h2>
        <div className="mt-4">
          <p className="text-xl text-neutral-500 max-w-lg leading-relaxed">
            Paste in complex tech terms, PRD pieces, or AI concepts to get the plain explanation.
          </p>
        </div>
      </header>

      <div className="space-y-6">
        <form onSubmit={handleTranslate} className="relative group max-w-2xl">
          <input 
            type="text"
            className="w-full pl-8 pr-40 py-6 border-4 border-neutral-100 rounded-[2.5rem] focus:border-neutral-700 focus:outline-none transition-all shadow-xl text-lg placeholder:text-neutral-300 bg-white text-neutral-700"
            placeholder="e.g. 'Microservices architecture'..."
            value={input}
            onChange={e => setInput(e.target.value)}
          />
          <button 
            type="submit"
            disabled={loading || !input}
            className="absolute right-3 top-3 bottom-3 px-8 bg-neutral-700 text-white rounded-[2rem] font-black uppercase tracking-widest text-[10px] hover:bg-neutral-600 transition-all disabled:opacity-50 active:scale-95"
          >
            {loading ? 'Working...' : 'Simplify'}
          </button>
        </form>

        <div className="flex flex-wrap gap-2 justify-start items-center">
          <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mr-2">Try:</span>
          {SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => handleSuggestionClick(suggestion)}
              disabled={loading}
              className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 rounded-full text-[10px] font-black uppercase tracking-wider transition-all active:scale-95 disabled:opacity-50"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-6 bg-red-50 border-2 border-red-100 text-red-600 rounded-3xl text-sm font-bold text-left max-w-2xl">
          {error}
        </div>
      )}

      {translation && (
        <div className="bg-white border border-neutral-200 rounded-[3.5rem] p-10 space-y-10 animate-in zoom-in-95 duration-300 shadow-2xl relative overflow-hidden max-w-2xl text-left">
          <button 
            onClick={copyToClipboard}
            className="absolute top-8 right-10 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 hover:text-neutral-700 transition-colors"
          >
            {copied ? 'Copied!' : 'Copy Info'}
          </button>

          <div className="space-y-3">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">Technical Word</h3>
            <p className="text-2xl font-bold line-through text-neutral-300 decoration-neutral-700 decoration-4">{translation.original}</p>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">In Easy English</h3>
            <p className="text-3xl font-black leading-tight text-neutral-700">{translation.plainVersion}</p>
          </div>

          <div className="bg-neutral-50 p-8 rounded-[2.5rem] border border-neutral-100 shadow-inner">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 mb-4">A simple comparison</h3>
            <p className="serif italic text-2xl leading-relaxed text-neutral-700">"{translation.analogy}"</p>
          </div>

          <div className="flex justify-between items-center pt-8">
             <span className="text-[11px] text-neutral-400 font-bold italic">By Plain Digital AI</span>
             <button 
              onClick={() => { setTranslation(null); setInput(''); }}
              className="text-sm font-black text-neutral-700 hover:underline transition-all uppercase tracking-widest"
            >
              Try another word
            </button>
          </div>
        </div>
      )}
    </div>
  );
};