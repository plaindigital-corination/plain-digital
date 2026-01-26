import React, { useState } from 'react';
import { WorkshopStep, AppView } from '../types';
import { getClarifyingQuestions, generateFinalWorkflow, getPlainSummary } from '../services/geminiService';

interface WorkshopProps {
  onNavigate?: (view: AppView) => void;
}

type WorkshopStage = 'input' | 'questions' | 'result';

export const Workshop: React.FC<WorkshopProps> = ({ onNavigate }) => {
  const [stage, setStage] = useState<WorkshopStage>('input');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Input Data
  const [userInput, setUserInput] = useState('');
  
  // Questions Stage
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  // Result Stage
  const [results, setResults] = useState<{ steps: WorkshopStep[], summary: string } | null>(null);

  const startWorkflow = async () => {
    if (!userInput.trim()) {
      setError("Please tell us a bit about your goal or project first.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const qs = await getClarifyingQuestions(userInput);
      if (qs.length > 0) {
        setQuestions(qs);
        setStage('questions');
      } else {
        await fetchFinalWorkflow("");
      }
    } catch (err) {
      setError("I'm having trouble starting the builder. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchFinalWorkflow = async (answeredStr: string) => {
    setLoading(true);
    try {
      const steps = await generateFinalWorkflow(userInput, answeredStr);
      const summary = await getPlainSummary(steps);
      setResults({ steps, summary });
      setStage('result');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError("I'm having trouble finishing the plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const submitAnswers = () => {
    const answeredStr = questions.map((q, i) => `Q: ${q} A: ${answers[i] || 'No answer'}`).join('; ');
    fetchFinalWorkflow(answeredStr);
  };

  const reset = () => {
    setStage('input');
    setUserInput('');
    setQuestions([]);
    setAnswers({});
    setResults(null);
    setError(null);
  };

  return (
    <div className="max-w-6xl text-left animate-in fade-in duration-500 pb-10">
      <header className="mb-12">
        <h2 className="text-4xl font-bold leading-none text-neutral-700 uppercase tracking-tight">
          BUILD <span className="serif italic font-normal text-neutral-400 lowercase"> in 5 steps</span>
        </h2>
        <p className="text-xl text-neutral-500 max-w-lg leading-relaxed mt-4">
          A personalized, practical action plan designed for humans, not systems.
        </p>
      </header>

      {stage === 'input' && (
        <div className="max-w-2xl space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          <div className="space-y-4">
            <label className="text-xs font-black text-neutral-700 uppercase tracking-widest block">
              Describe your goal or career stage
            </label>
            <textarea 
              className="w-full px-8 py-6 bg-white border-4 border-neutral-100 rounded-[2.5rem] focus:border-neutral-700 outline-none transition-all text-lg placeholder:text-neutral-300 shadow-xl min-h-[200px]"
              placeholder="e.g. 'I am a marketing lead trying to understand how to build a basic data dashboard without code...'"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500 text-sm font-bold">{error}</p>}
          <button 
            onClick={startWorkflow}
            disabled={loading}
            className="px-10 py-5 bg-neutral-700 text-white rounded-full font-black uppercase tracking-widest text-xs shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? 'Analyzing...' : 'Begin Building →'}
          </button>
        </div>
      )}

      {stage === 'questions' && (
        <div className="max-w-2xl space-y-10 animate-in slide-in-from-right-4 duration-500">
          <div className="bg-white border-4 border-neutral-700 p-8 rounded-[2.5rem] shadow-sm">
             <h4 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-4">Personalization Check</h4>
             <p className="text-xl serif italic text-neutral-800 leading-relaxed font-medium">
                To make this plan practical, I have {questions.length} simple questions for you.
             </p>
          </div>
          
          <div className="space-y-8">
            {questions.map((q, i) => (
              <div key={i} className="space-y-3">
                <label className="text-xs font-black text-neutral-500 uppercase tracking-widest">{q}</label>
                <input 
                  type="text"
                  className="w-full px-6 py-4 bg-neutral-50 border-2 border-transparent rounded-xl focus:border-neutral-700 focus:bg-white outline-none transition-all text-base shadow-inner font-medium text-neutral-700"
                  value={answers[i] || ''}
                  onChange={(e) => setAnswers({...answers, [i]: e.target.value})}
                  placeholder="Your answer..."
                />
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <button 
              onClick={submitAnswers}
              disabled={loading}
              className="px-10 py-5 bg-neutral-700 text-white rounded-full font-black uppercase tracking-widest text-xs shadow-xl hover:scale-105 active:scale-95 transition-all"
            >
              {loading ? 'Building Plan...' : 'Generate My Workflow →'}
            </button>
            <button onClick={reset} className="text-xs font-black text-neutral-400 uppercase tracking-widest hover:text-neutral-700 transition-colors">Start Over</button>
          </div>
        </div>
      )}

      {stage === 'result' && results && (
        <div className="space-y-12 animate-in fade-in duration-700 max-w-4xl pb-20">
          <header className="flex flex-col md:flex-row justify-between items-start gap-6 pb-4">
            <div>
              <button onClick={reset} className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-4 hover:text-neutral-700 flex items-center gap-2">
                ← Start New Workflow
              </button>
              <h2 className="text-3xl font-black mb-2 text-neutral-700 uppercase tracking-tight">Your Action Plan</h2>
              <p className="text-xl serif italic text-neutral-500 leading-relaxed">"{results.summary}"</p>
            </div>
            <button 
              className="px-6 py-3 bg-neutral-700 text-white rounded-full text-[10px] font-black hover:bg-neutral-600 transition-all shadow-lg uppercase tracking-widest"
              onClick={() => onNavigate?.(AppView.Connect)}
            >
              Live Expert Review
            </button>
          </header>

          <div className="space-y-12">
            {results.steps.map((s, idx) => (
              <div key={idx} className="group grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                <div className="md:col-span-1 flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-neutral-700 text-white flex items-center justify-center font-black text-sm mb-2 shadow-md">
                    {idx + 1}
                  </div>
                  {idx < results.steps.length - 1 && <div className="w-px h-full bg-neutral-200 hidden md:block mt-2"></div>}
                </div>
                <div className="md:col-span-11 space-y-6">
                  <div>
                    <h3 className="text-2xl font-black mb-1 text-neutral-700 uppercase tracking-tight">{s.title}</h3>
                    <div className="space-y-4">
                      <div className="bg-white p-8 rounded-[2.5rem] border border-neutral-200 shadow-sm space-y-6">
                        <div className="space-y-2">
                           <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-400">What to do</h4>
                           <p className="text-xl font-medium leading-relaxed text-neutral-700">{s.whatToDo}</p>
                        </div>
                        <div className="pt-6 space-y-2">
                           <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Output</h4>
                           <p className="text-neutral-800 font-black tracking-tight">{s.output}</p>
                        </div>
                      </div>
                      
                      <div className="px-8">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2">Why this matters</h4>
                        <p className="text-neutral-500 italic serif text-base">"{s.whyMatters}"</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <section className="bg-neutral-700 text-white p-10 md:p-14 rounded-[3.5rem] shadow-xl text-left">
            <h3 className="text-2xl font-bold italic serif mb-4">Next Steps</h3>
            <p className="text-neutral-300 text-lg mb-8 max-w-xl">
              This workflow is practical and executable. If you want to dive deeper into the specific tools or need an expert eye, consider a live session.
            </p>
            <div className="flex flex-wrap gap-4">
               <button 
                onClick={() => onNavigate?.(AppView.Connect)}
                className="px-8 py-4 bg-white text-neutral-700 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-neutral-100 transition-all shadow-lg"
              >
                Book a Session
              </button>
              <button onClick={reset} className="px-8 py-4 border border-white/20 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                Try Another Goal
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};