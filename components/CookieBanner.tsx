
import React, { useState, useEffect } from 'react';

export const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('plain_digital_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('plain_digital_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-12 md:max-w-md bg-white border border-neutral-200 rounded-[2.5rem] shadow-2xl p-8 z-50 animate-in slide-in-from-bottom-10 duration-500">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-neutral-700"></div>
           <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400">Privacy & Persistence</h3>
        </div>
        <p className="text-sm text-neutral-600 leading-relaxed">
          We use local storage—a cousin of cookies—to remember your workshop progress. No tracking pixels, no selling data. Just a system trying to be helpful and understandable.
        </p>
        <div className="flex gap-4 pt-2">
          <button 
            onClick={handleAccept}
            className="flex-grow px-6 py-4 bg-neutral-700 text-white rounded-2xl text-xs font-bold hover:bg-neutral-600 transition-all shadow-lg"
          >
            I understand
          </button>
        </div>
      </div>
    </div>
  );
};
