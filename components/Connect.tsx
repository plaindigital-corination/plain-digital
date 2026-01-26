
import React, { useState, useRef, useEffect } from 'react';

export const Connect: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const formRef = useRef<HTMLDivElement>(null);

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !selectedTier) return;

    const tierTitle = tiers.find(t => t.id === selectedTier)?.title || selectedTier;
    const subject = encodeURIComponent(`Engagement Request: ${tierTitle}`);
    const body = encodeURIComponent(`Hello,\n\nI am interested in a ${tierTitle} live session.\n\nMy Email: ${email}\n\nPlease share more details.\n\nBest regards,\n[My Name]`);
    
    window.location.href = `mailto:corigrigor@gmail.com?subject=${subject}&body=${body}`;
  };

  useEffect(() => {
    if (selectedTier && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [selectedTier]);

  const tiers = [
    {
      id: 'individual',
      title: 'Individual Contributors',
      focus: 'The Clarity Session',
      description: 'For professionals who feel stuck or are changing their job path',
      services: ['Advice & Strategy', 'Decision Help', 'Product Research']
    },
    {
      id: 'startup',
      title: 'Start-ups',
      focus: 'The Discovery Lab',
      description: 'Support for new businesses moving from an idea to a real product',
      services: ['Lean Roadmaps', 'User Flow Help', 'Competition Analysis']
    },
    {
      id: 'scaleup',
      title: 'Scale-ups',
      focus: 'The Systemic Audit',
      description: 'Deep help for growing teams dealing with too much complexity',
      services: ['Expert Consulting', 'Learning Tech Research', 'System Analysis']
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-16 animate-in fade-in duration-500 pb-20">
      {/* Step 1: Selection */}
      <section className="space-y-10">
        <div className="flex items-center gap-4 justify-center md:justify-start">
          <span className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center text-sm font-black text-white shadow-lg">01</span>
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-400">Step 1: Pick a live session type</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <div 
              key={tier.id}
              className={`group p-8 border-2 rounded-[3rem] transition-all flex flex-col h-full cursor-pointer relative ${selectedTier === tier.id ? 'border-neutral-700 bg-white ring-4 ring-neutral-700/5 shadow-2xl scale-[1.03] z-10' : 'border-neutral-100 bg-white hover:border-neutral-300 shadow-sm'}`}
              onClick={() => setSelectedTier(tier.id)}
            >
              {selectedTier === tier.id && (
                <div className="absolute top-6 right-8 text-neutral-700">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path></svg>
                </div>
              )}
              <div className="flex-grow space-y-4 pt-4">
                <h3 className="text-2xl font-black leading-tight text-neutral-700">{tier.title}</h3>
                <p className="text-lg serif italic text-neutral-500 font-medium">{tier.focus}</p>
                <p className="text-neutral-500 leading-relaxed text-sm">
                  {tier.description}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-neutral-100">
                <div className="flex flex-wrap gap-2 mb-8">
                  {tier.services.map(service => (
                    <span key={service} className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400 border border-neutral-100 px-3 py-1 rounded-lg">
                      {service}
                    </span>
                  ))}
                </div>
                <button 
                  className={`w-full py-4 rounded-2xl font-black transition-all text-[10px] uppercase tracking-[0.3em] ${selectedTier === tier.id ? 'bg-neutral-700 text-white' : 'bg-neutral-100 text-neutral-600 group-hover:bg-neutral-700 group-hover:text-white'}`}
                >
                  {selectedTier === tier.id ? 'Selected' : 'Select'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Step 2: Contact Form */}
      <section 
        ref={formRef}
        className={`transition-all duration-700 ${!selectedTier ? 'opacity-30 grayscale pointer-events-none' : 'opacity-100 grayscale-0'}`}
      >
        <div className="space-y-10">
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <span className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black border-2 transition-all ${selectedTier ? 'bg-neutral-700 text-white border-neutral-700 shadow-lg' : 'bg-neutral-100 text-neutral-400 border-neutral-200'}`}>02</span>
            <h3 className={`text-xs font-black uppercase tracking-[0.3em] transition-all ${selectedTier ? 'text-neutral-700' : 'text-neutral-400'}`}>
              Step 2: Leave your email to start
            </h3>
          </div>

          <div className={`bg-neutral-50 border-4 p-10 md:p-16 rounded-[4rem] transition-all ${selectedTier ? 'border-neutral-700 shadow-2xl bg-white' : 'border-neutral-200 shadow-sm'}`}>
            <div className="max-w-xl mx-auto text-center space-y-10">
              {!selectedTier ? (
                <p className="text-neutral-400 text-lg font-bold italic serif">
                  Please pick a live session type above to see the email form.
                </p>
              ) : (
                <div className="animate-in fade-in slide-in-from-top-6 duration-500">
                  <p className="text-neutral-600 text-lg font-medium mb-10 leading-relaxed">
                    Great! You picked the <span className="text-neutral-700 font-black">{tiers.find(t => t.id === selectedTier)?.title}</span> live session. Leave your email and our founder will write to you with a simple plan to help.
                  </p>
                  
                  <form onSubmit={handleBooking} className="flex flex-row items-center w-full max-w-lg mx-auto border-4 border-neutral-700 rounded-full overflow-hidden bg-white shadow-xl focus-within:ring-8 focus-within:ring-neutral-700/10 transition-all">
                    <input 
                      type="email" 
                      required
                      placeholder="Your email address..."
                      className="flex-grow px-8 py-5 bg-transparent border-none outline-none text-neutral-700 text-lg placeholder:text-neutral-300 min-w-0"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <button 
                      type="submit"
                      disabled={!email}
                      className="px-10 py-5 bg-neutral-700 text-white font-black text-xs hover:bg-neutral-600 transition-all disabled:bg-neutral-200 disabled:text-neutral-400 whitespace-nowrap uppercase tracking-[0.2em] border-l-4 border-neutral-700 active:scale-95"
                    >
                      Send Request
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="text-center pt-16 border-t border-neutral-100">
        <p className="text-neutral-400 mb-8 max-w-lg mx-auto text-sm italic serif leading-relaxed">
          "If a system is hard to explain, it isn't finished."
        </p>
        <a 
          href="https://plaindigital.substack.com" 
          target="_blank" 
          rel="noreferrer" 
          className="text-[11px] font-black underline underline-offset-[12px] text-neutral-400 hover:text-neutral-700 transition-colors uppercase tracking-[0.4em]"
        >
          Follow on Substack
        </a>
      </section>
    </div>
  );
};
