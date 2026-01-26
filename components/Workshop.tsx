import React, { useState } from 'react';
import { ProductConcept, WorkshopStep, AppView } from '../types';
import { generateWorkshop, getPlainSummary, chatAboutRoadmap, getChapterHelp } from '../services/geminiService';

interface WorkshopProps {
  onNavigate?: (view: AppView) => void;
}

export const Workshop: React.FC<WorkshopProps> = ({ onNavigate }) => {
  const [loading, setLoading] = useState(false);
  const [activeChapter, setActiveChapter] = useState(1);
  const [concept, setConcept] = useState<ProductConcept>({
    name: '',
    targetAudience: '',
    coreProblem: '',
    opportunity: '',
    inspiration: '',
    hypothesis: '',
    testConcepts: '',
    gaps: '',
    challenges: '',
    teamStatus: 'solo'
  });
  const [results, setResults] = useState<{ steps: WorkshopStep[], summary: string } | null>(null);
  const [userQuestion, setUserQuestion] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  
  const [chapterHelp, setChapterHelp] = useState<string | null>(null);
  const [helpLoading, setHelpLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValid = concept.name.trim().length > 0 && concept.coreProblem.trim().length > 0;

  const handleSubmit = async () => {
    if (!isValid) {
      setError("Please provide a project name and describe the problem you are solving.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const [steps, summary] = await Promise.all([
        generateWorkshop(concept),
        getPlainSummary(concept)
      ]);
      
      if (steps && steps.length > 0) {
        setResults({ steps, summary });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        throw new Error("EMPTY_DATA");
      }
    } catch (err: any) {
      console.error("Workshop Error:", err);
      setError("I'm having trouble connecting to the system. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  const handleGetHelp = async () => {
    const currentChapter = chapters.find(c => c.id === activeChapter);
    if (!currentChapter) return;
    setHelpLoading(true);
    try {
      const helpText = await getChapterHelp(currentChapter.title, concept);
      setChapterHelp(helpText);
    } catch (err: any) {
      setChapterHelp("Keep your description focused on the human problem, not the tech.");
    } finally {
      setHelpLoading(false);
    }
  };

  const handleChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuestion || !results) return;
    setChatLoading(true);
    try {
      const response = await chatAboutRoadmap(results.steps, userQuestion);
      setChatResponse(response);
    } catch (err: any) {
      setChatResponse("I'm unable to answer that right now.");
    } finally {
      setChatLoading(false);
    }
  };

  const reset = () => {
    setResults(null);
    setActiveChapter(1);
    setChatResponse('');
    setUserQuestion('');
    setChapterHelp(null);
    setError(null);
  };

  const chapters = [
    {
      id: 1,
      title: "The Vision",
      subtitle: "Idea & Inspiration",
      why: "Investors want to see that you care about the idea. What is the soul of your product?",
      fields: [
        { label: "Idea Name", key: "name", type: "text", hint: "What do you call it?" },
        { label: "The Opportunity", key: "opportunity", type: "textarea", hint: "What special chance did you see?" },
        { label: "The Spark", key: "inspiration", type: "textarea", hint: "What gave you this idea?" }
      ]
    },
    {
      id: 2,
      title: "The People",
      subtitle: "Users & Need",
      why: "Products are for people. We need to know exactly whose life will get better because of your idea.",
      fields: [
        { label: "Target Audience", key: "targetAudience", type: "text", hint: "Who is this for?" },
        { label: "The Core Problem", key: "coreProblem", type: "textarea", hint: "What is their biggest struggle?" }
      ]
    },
    {
      id: 3,
      title: "The Bet",
      subtitle: "Testing Strategy",
      why: "Building products is a risk. We turn your guesses into a 'bet' that we can actually test.",
      fields: [
        { label: "Your Guess", key: "hypothesis", type: "textarea", hint: "If we build this, what happens?" },
        { label: "The Simple Test", key: "testConcepts", type: "textarea", hint: "How can we prove this easily?" }
      ]
    },
    {
      id: 4,
      title: "The Reality",
      subtitle: "Gaps & Blockers",
      why: "Being honest about gaps shows you are a good leader. It helps people trust you.",
      fields: [
        { label: "What is missing?", key: "gaps", type: "textarea", hint: "Money, skills, or data?" },
        { label: "Main Obstacles", key: "challenges", type: "textarea", hint: "What is the hardest part?" }
      ]
    }
  ];

  if (results) {
    return (
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl text-left pb-20">
        <header className="flex flex-col md:flex-row justify-between items-start gap-6 pb-8">
          <div>
            <button onClick={reset} className="text-xs font-black uppercase tracking-widest text-neutral-500 mb-4 hover:text-neutral-700 flex items-center gap-2">
              <span className="text-lg">←</span> Start New Plan
            </button>
            <h2 className="text-3xl font-black mb-2 text-neutral-700 uppercase tracking-tight">{concept.name} Roadmap</h2>
            <p className="text-xl serif italic text-neutral-500 leading-relaxed">"{results.summary}"</p>
          </div>
          <button 
            className="px-6 py-3 bg-neutral-700 text-white rounded-full text-xs font-bold hover:bg-neutral-600 transition-all shadow-lg whitespace-nowrap uppercase tracking-widest"
            onClick={() => onNavigate?.(AppView.Connect)}
          >
            Live Expert Review
          </button>
        </header>

        <div className="space-y-12">
          {results.steps.map((s, idx) => (
            <div key={idx} className="group grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              <div className="md:col-span-1 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-neutral-700 text-white flex items-center justify-center font-black text-sm mb-2 shadow-md">
                  {idx + 1}
                </div>
                <div className="w-px h-full bg-neutral-200 hidden md:block"></div>
              </div>
              <div className="md:col-span-11 space-y-4">
                <div>
                  <h3 className="text-2xl font-black mb-1 text-neutral-700">{s.title}</h3>
                  <p className="text-neutral-600 leading-relaxed text-lg">{s.description}</p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 bg-white p-6 rounded-[2rem] border border-neutral-200 shadow-sm space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-widest text-neutral-500">Next Action</h4>
                    <p className="text-xl font-black leading-tight text-neutral-700">{s.actionItem}</p>
                    <div className="pt-4">
                       <h4 className="text-xs font-black uppercase tracking-widest text-neutral-500 mb-2">Why it matters</h4>
                       <p className="text-sm text-neutral-600 italic">"{s.whyThisMatters}"</p>
                    </div>
                  </div>
                  <div className="bg-neutral-50 p-6 rounded-[2rem] border border-neutral-100 flex flex-col justify-center">
                    <h4 className="text-xs font-black uppercase tracking-widest text-neutral-500 mb-2">Focus Lens</h4>
                    <p className="text-neutral-600 text-base leading-relaxed serif italic">"{s.learningLens}"</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <section className="bg-neutral-700 text-white p-10 rounded-[3rem] space-y-8 shadow-xl mt-16 text-left">
          <div className="max-w-xl space-y-3">
            <h3 className="text-2xl font-bold italic serif">Have questions?</h3>
            <p className="text-neutral-300 text-base">Ask our AI for clarity on these steps, or book a live session for deep strategy.</p>
          </div>
          
          <form onSubmit={handleChat} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="text" 
                value={userQuestion}
                onChange={(e) => setUserQuestion(e.target.value)}
                placeholder="Ask about your roadmap..."
                className="flex-grow bg-neutral-600 border-none rounded-2xl px-6 py-4 text-white placeholder-neutral-400 focus:ring-2 focus:ring-white/20 outline-none"
              />
              <button 
                type="submit"
                disabled={chatLoading || !userQuestion}
                className="px-8 py-4 bg-white text-neutral-700 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-neutral-100 transition-all disabled:opacity-50"
              >
                {chatLoading ? '...' : 'Ask'}
              </button>
            </div>
            {chatResponse && (
              <div className="p-6 bg-neutral-600 rounded-2xl animate-in fade-in duration-300 border border-white/10">
                <p className="text-neutral-100 text-base leading-relaxed">{chatResponse}</p>
              </div>
            )}
          </form>
        </section>
      </div>
    );
  }

  return (
    <div className="max-w-6xl text-left animate-in fade-in duration-500 pb-10">
      <header className="mb-8 pb-4">
        <h2 className="text-4xl font-bold leading-none text-neutral-700 uppercase tracking-tight">
          BUILD <span className="serif italic font-normal text-neutral-400 lowercase"> in 4 steps</span>
        </h2>
        <p className="text-xl text-neutral-500 max-w-lg leading-relaxed mt-2">A map to turn your goal into clear, actionable next steps.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Vertical Navigation */}
        <div className="lg:col-span-3 space-y-4 sticky top-6">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-neutral-500 mb-2 px-2">Navigation</h4>
            {chapters.map((ch) => (
              <button
                key={ch.id}
                onClick={() => {
                  setActiveChapter(ch.id);
                  setChapterHelp(null);
                  setError(null);
                }}
                className={`text-left px-5 py-4 rounded-xl transition-all border-2 flex items-center gap-4 ${activeChapter === ch.id ? 'bg-neutral-700 border-neutral-700 text-white shadow-lg translate-x-1' : 'bg-white border-neutral-100 text-neutral-600 hover:border-neutral-300'}`}
              >
                <span className={`text-xs font-black ${activeChapter === ch.id ? 'text-white' : 'text-neutral-400'}`}>0{ch.id}</span>
                <span className="font-bold text-xs uppercase tracking-tight">{ch.title}</span>
              </button>
            ))}

            <div className="mt-6 pt-4">
               <button 
                onClick={handleGetHelp}
                disabled={helpLoading || loading}
                className="w-full py-3 rounded-lg border-2 border-dashed border-neutral-300 font-black text-[10px] uppercase tracking-widest hover:border-neutral-700 hover:bg-white transition-all text-neutral-500 hover:text-neutral-700"
              >
                {helpLoading ? 'Thinking...' : 'Get Hints'}
              </button>
              
              {chapterHelp && (
                <div className="mt-3 p-4 bg-white rounded-lg border border-neutral-200 text-xs text-neutral-600 italic leading-relaxed animate-in fade-in duration-300">
                  {chapterHelp}
                </div>
              )}
            </div>
        </div>

        {/* Right Column: Question Content */}
        <div className="lg:col-span-9 flex flex-col gap-6">
          {/* Distinct Highlighted Tip */}
          <div className="bg-white border-4 border-neutral-700 p-6 md:p-8 rounded-[2.5rem] shadow-sm relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
             </div>
             <div className="relative z-10 text-left">
                <h4 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-3">Expert Strategy Highlight</h4>
                <p className="text-xl md:text-2xl leading-snug serif italic text-neutral-800 font-medium">
                   "{chapters[activeChapter - 1].why}"
                </p>
             </div>
          </div>

          {/* Form Area */}
          <div className="bg-white border border-neutral-200 rounded-[3rem] p-8 md:p-10 shadow-sm relative min-h-[400px]">
            {loading && (
              <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center space-y-4">
                <div className="w-8 h-8 border-4 border-neutral-200 border-t-neutral-700 rounded-full animate-spin"></div>
                <p className="font-black text-neutral-700 uppercase tracking-widest text-xs">Building your plan...</p>
              </div>
            )}

            {chapters.map((ch) => ch.id === activeChapter && (
              <div key={ch.id} className="space-y-8 animate-in fade-in slide-in-from-right-2 duration-500 text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  {ch.fields.map((field) => (
                    <div key={field.key} className={`space-y-2 ${field.type === 'textarea' ? 'md:col-span-2' : ''}`}>
                      <div className="flex justify-between items-end">
                        <label className="text-xs font-black text-neutral-700 uppercase tracking-widest">{field.label}</label>
                        <span className="text-[11px] text-neutral-500 italic font-medium">{field.hint}</span>
                      </div>
                      {field.type === 'text' ? (
                        <input 
                          type="text"
                          className="w-full px-5 py-3.5 bg-neutral-50 border-2 border-transparent rounded-xl focus:border-neutral-700 focus:bg-white outline-none transition-all text-base shadow-inner font-medium text-neutral-700"
                          value={(concept as any)[field.key]}
                          onChange={(e) => setConcept({...concept, [field.key]: e.target.value})}
                        />
                      ) : (
                        <textarea 
                          rows={ch.id === 1 ? 2 : 3}
                          className="w-full px-5 py-3.5 bg-neutral-50 border-2 border-transparent rounded-2xl focus:border-neutral-700 focus:bg-white outline-none transition-all resize-none text-base shadow-inner font-medium text-neutral-700"
                          value={(concept as any)[field.key]}
                          onChange={(e) => setConcept({...concept, [field.key]: e.target.value})}
                        />
                      )}
                    </div>
                  ))}
                </div>

                {error && (
                  <div className="p-4 bg-red-50 text-red-600 rounded-xl text-xs font-bold text-center border border-red-100">
                    {error}
                  </div>
                )}

                <div className="flex items-center justify-between pt-6">
                  <button 
                    onClick={() => setActiveChapter(prev => Math.max(1, prev - 1))}
                    className={`text-xs font-black uppercase tracking-widest px-4 py-2 rounded-lg hover:bg-neutral-50 transition-colors ${activeChapter === 1 ? 'invisible' : 'text-neutral-500 hover:text-neutral-700'}`}
                    disabled={activeChapter === 1}
                  >
                    ← Previous
                  </button>
                  
                  <div className="flex gap-4">
                     {activeChapter === chapters.length ? (
                        <button 
                          onClick={handleSubmit}
                          disabled={loading || !isValid}
                          className="px-8 py-4 bg-neutral-700 text-white rounded-full font-black uppercase tracking-[0.2em] text-xs shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-30"
                        >
                          Generate Roadmap →
                        </button>
                     ) : (
                        <button 
                          onClick={() => {
                            setActiveChapter(next => Math.min(chapters.length, next + 1));
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="px-8 py-4 border-2 border-neutral-700 text-neutral-700 bg-white rounded-full font-black uppercase tracking-widest text-xs hover:bg-neutral-700 hover:text-white transition-all active:scale-95 shadow-md"
                        >
                           Next Step →
                        </button>
                     )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};