
import React from 'react';
import { AppView } from '../types';

interface AboutProps {
  onNavigate?: (view: AppView) => void;
}

export const About: React.FC<AboutProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-2xl mx-auto text-center animate-in fade-in duration-700 pb-10 space-y-12">
      {/* Intro Section */}
      <section className="space-y-4">
        <p className="text-3xl font-black text-neutral-700 leading-tight uppercase tracking-tight">
          Complexity is often performative.
        </p>
        <p className="text-lg text-neutral-600 leading-relaxed">
          Our founder believes good digital work should be explainable in plain terms. She breaks down digital projects, product decisions, data, and AI systems so that decision-makers can make informed choices.
        </p>
      </section>

      {/* Quote Section - Removed border-y and text-left */}
      <section className="py-4">
        <p className="serif italic text-2xl md:text-3xl text-neutral-500 leading-relaxed">
          "If a system can’t be explained plainly, <br className="hidden md:block"/> it isn’t finished."
        </p>
      </section>

      {/* Learning Lenses - Removed border-l and pl-6, centered text */}
      <section className="space-y-6">
        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-400">The Learning Lenses</h3>
        <p className="text-neutral-600 leading-relaxed">
          She connects technology and art as lenses of learning.
        </p>
        <div className="grid grid-cols-1 gap-8">
          <div className="space-y-2">
            <strong className="text-neutral-700 uppercase tracking-widest text-[10px] block">Art</strong>
            <p className="text-neutral-600">
              Because it helps us understand what’s new and reconsider what’s familiar.
            </p>
          </div>
          <div className="space-y-2">
            <strong className="text-neutral-700 uppercase tracking-widest text-[10px] block">Technology</strong>
            <p className="text-neutral-600">
              Because, what was once a tool, is now an extension of how we think, relate, and operate in the world.
            </p>
          </div>
        </div>
      </section>

      {/* Current Focus */}
      <section className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-400">Current Focus</h3>
        <p className="text-neutral-600 leading-relaxed">
          By day, she researches, designs, and improves user flows in complex digital systems.
        </p>
        <p className="text-neutral-600 leading-relaxed">
          Alongside that, she is completing an <strong className="text-neutral-700">MA in Education and Technology at UCL</strong>, exploring how people learn and adapt inside digital environments.
        </p>
      </section>

      {/* Foundations */}
      <section className="bg-neutral-50 p-8 rounded-[2.5rem] border border-neutral-100 shadow-inner">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-6">Academic & Professional Foundations</h3>
        <ul className="space-y-4 text-sm text-neutral-600 font-medium list-none">
          <li>MA Education & Technology (UCL)</li>
          <li>Oxford AI & Strategic Innovation</li>
          <li>Certified PRINCE2 & Agile Project Management</li>
        </ul>
      </section>

      {/* CTA */}
      <div className="pt-6">
        <a 
          href="https://plaindigital.substack.com" 
          target="_blank" 
          rel="noreferrer"
          className="inline-block px-10 py-5 bg-neutral-700 text-white rounded-full font-bold hover:bg-neutral-600 transition-all active:scale-95 shadow-xl uppercase tracking-widest text-[11px]"
        >
          Subscribe to Substack
        </a>
      </div>
    </div>
  );
};
