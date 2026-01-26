import React from 'react';
import { AppView } from '../types';

interface HomeProps {
  onStart: (view: AppView) => void;
}

export const Home: React.FC<HomeProps> = ({ onStart }) => {
  return (
    <div className="space-y-10 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        <div className="lg:col-span-8 space-y-6">
          <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-[1.05] tracking-tight text-neutral-700">
            If a system is hard to explain, <br className="hidden md:block" />
            <span className="serif italic font-normal text-neutral-400">it isn’t finished.</span>
          </h2>
          <p className="text-xl text-neutral-500 leading-relaxed max-w-2xl">
            Digital product thinking, without the jargon. Workshops and tools designed to help you build your ideas and get back control.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <button 
              onClick={() => onStart(AppView.Workshop)}
              className="px-8 py-4 bg-neutral-700 text-white rounded-full font-bold hover:bg-neutral-600 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl text-base"
            >
              Build in 4 steps
            </button>
            <button 
              onClick={() => onStart(AppView.Translator)}
              className="px-8 py-4 border-2 border-neutral-200 bg-white text-neutral-700 rounded-full font-bold hover:bg-neutral-600 hover:text-white transition-all text-base"
            >
              Jargon Translator
            </button>
          </div>
        </div>
        
        {/* Subtle Manifesto */}
        <div className="lg:col-span-4 hidden lg:block">
           <div className="p-8 bg-neutral-50 border border-neutral-200 rounded-[2.5rem] shadow-sm space-y-5">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-neutral-400">Our Belief</h4>
              <p className="serif italic text-2xl text-neutral-500 leading-tight">
                Complexity is a choice, <br/>
                clarity is a skill.
              </p>
              <div className="pt-4 space-y-2 text-[11px] text-neutral-400 uppercase tracking-widest font-bold">
                <p>— Expertise informs. Impact decides.</p>
                <p>— Learning is a lifestyle</p>
              </div>
           </div>
        </div>
      </section>

      {/* Primary Highlight */}
      <section className="bg-neutral-600 text-white p-10 md:p-14 rounded-[3rem] shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-6 max-w-3xl">
          <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-300 mb-2">
            <span className="w-2 h-2 rounded-full bg-white"></span>
            From the Substack
          </div>
          <h4 className="text-2xl sm:text-3xl lg:text-4xl font-bold italic serif leading-tight text-white">
            What systems are measuring you right now? <span className="text-neutral-400">and why it feels personal even when it isn't</span>
          </h4>
          <p className="text-neutral-200 text-lg leading-relaxed opacity-90">
            Discover why good digital work must be easy to explain and how modern systems can sometimes take away our sense of control.
          </p>
          <a 
            href="https://plaindigital.substack.com" 
            target="_blank" 
            rel="noreferrer"
            className="inline-flex items-center gap-3 text-sm font-bold bg-white text-neutral-700 px-8 py-4 rounded-2xl hover:bg-neutral-50 transition-all shadow-lg active:scale-95"
          >
            Read the Article
            <span className="text-xl">→</span>
          </a>
        </div>
      </section>
    </div>
  );
};