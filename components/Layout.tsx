import React from 'react';
import { AppView } from '../types';
import { CookieBanner } from './CookieBanner';

interface LayoutProps {
  children: React.ReactNode;
  activeView: AppView;
  onNavigate: (view: AppView) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeView, onNavigate }) => {
  return (
    <div className="min-h-screen flex flex-col max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 bg-neutral-50">
      <header className="py-8 border-b border-neutral-200 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 
            className="text-2xl font-black tracking-tighter cursor-pointer text-neutral-700" 
            onClick={() => onNavigate(AppView.Home)}
          >
            PLAIN <span className="serif italic font-normal text-neutral-400">Digital</span>
          </h1>
          <p className="text-[10px] text-neutral-400 mt-0.5 uppercase tracking-[0.4em] font-black">
            Understandable Systems
          </p>
        </div>
        <nav className="flex items-center gap-6 overflow-x-auto pb-2 md:pb-0">
          {[
            { id: AppView.Workshop, label: 'Build in 4 steps' },
            { id: AppView.Translator, label: 'Jargon Translator' },
            { id: AppView.Library, label: 'Library' },
            { id: AppView.Connect, label: 'Live Sessions' },
            { id: AppView.About, label: 'About' }
          ].map(item => (
            <button 
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeView === item.id ? 'text-neutral-700 border-b-2 border-neutral-700 pb-1' : 'text-neutral-400 hover:text-neutral-700'}`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </header>
      
      <main className="flex-grow py-12 md:py-16">
        {children}
      </main>

      <footer className="py-12 border-t border-neutral-200 text-[11px] text-neutral-400 font-medium">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <p>© {new Date().getFullYear()} Plain Digital.</p>
            <a href="https://plaindigital.substack.com" target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-neutral-700 transition-colors">
              plaindigital.substack.com
            </a>
            <button 
              onClick={() => onNavigate(AppView.Privacy)}
              className={`hover:text-neutral-700 transition-colors ${activeView === AppView.Privacy ? 'text-neutral-700 font-black' : ''}`}
            >
              Privacy Policy
            </button>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-4">
             <a 
               href="mailto:corigrigor@gmail.com?subject=POC Feedback - Plain Digital" 
               className="px-6 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-neutral-700 hover:text-white transition-all shadow-sm"
             >
               Give Feedback
             </a>
          </div>
        </div>
      </footer>
      <CookieBanner />
    </div>
  );
};