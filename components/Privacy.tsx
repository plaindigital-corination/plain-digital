
import React from 'react';

export const Privacy: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-16 animate-in fade-in duration-700">
      <header className="space-y-6">
        <h2 className="text-4xl font-bold leading-tight">Privacy <span className="serif italic font-normal text-neutral-400">explained plainly.</span></h2>
        <p className="text-xl text-neutral-600 leading-relaxed">
          In keeping with our philosophy, we believe our privacy policy should be as understandable as our product roadmaps. No legalese, just the truth.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-12">
        <section className="space-y-4">
          <h3 className="text-xl font-bold">What we track (and why)</h3>
          <p className="text-neutral-600 leading-relaxed">
            We store basic <strong>click data</strong> in your browser. This helps us understand which tools you find most useful—whether it's the Jargon Translator or the Workshop chapters. We don't sell this data; we use it to decide what to build next.
          </p>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-bold">Cookies</h3>
          <p className="text-neutral-600 leading-relaxed">
            We use "localStorage"—a cousin of cookies—to remember your workshop progress and your interactions. This ensures that if you refresh the page, your blueprint isn't lost to the void.
          </p>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-bold">Your Conversations</h3>
          <p className="text-neutral-600 leading-relaxed">
            When you use the AI tools, the text you enter is sent to Google's Gemini API to generate responses. We do not store these conversations on our own servers once the session is over.
          </p>
        </section>
      </div>

      <footer className="pt-10 border-t border-neutral-100">
        <p className="serif italic text-neutral-500">
          Digital systems should serve people, not exploit their data.
        </p>
      </footer>
    </div>
  );
};
