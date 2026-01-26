import React from 'react';
import { Book } from '../types';

const books: Book[] = [
  {
    title: "The Design of Everyday Things",
    author: "Don Norman",
    note: "The bible of usability. It explains why complexity is usually a design failure, not a user failure.",
    category: "Design"
  },
  {
    title: "Inspired",
    author: "Marty Cagan",
    note: "Essential for understanding how modern product teams actually work, stripped of the corporate theater.",
    category: "Product Management"
  },
  {
    title: "Simple and Usable",
    author: "Giles Colborne",
    note: "A masterclass in reduction. It teaches you how to remove, hide, and displace complexity.",
    category: "Strategy"
  },
  {
    title: "Art as Experience",
    author: "John Dewey",
    note: "Helps connect the digital 'user flow' to the human 'experience.' Learning as an aesthetic process.",
    category: "Philosophy"
  },
  {
    title: "Escaping the Build Trap",
    author: "Melissa Perri",
    note: "Why shipping features isn't the same as creating value. Perfect for non-PMs to hold teams accountable.",
    category: "Product Management"
  }
];

export const Library: React.FC = () => {
  return (
    <div className="space-y-12 animate-in fade-in duration-500 text-left">
      <section className="max-w-2xl">
        <h2 className="text-4xl font-bold mb-4 text-neutral-700 uppercase tracking-tight">PLAIN <span className="serif italic font-normal text-neutral-400 lowercase">Library</span></h2>
        <p className="text-lg text-neutral-600">
          A curated collection of works that shaped the Plain Digital philosophy. These books help bridge the gap between technology and human understanding.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {books.map((book, i) => (
          <div key={i} className="group p-6 border border-neutral-200 rounded-2xl hover:border-neutral-700 transition-all flex flex-col h-full bg-white shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-4 inline-block px-2 py-1 bg-neutral-100 rounded self-start">
              {book.category}
            </span>
            <h3 className="text-xl font-bold mb-1 group-hover:underline text-neutral-700">{book.title}</h3>
            <p className="text-sm text-neutral-500 mb-6">by {book.author}</p>
            <div className="mt-auto">
              <p className="serif italic text-neutral-700 leading-relaxed border-t border-neutral-100 pt-4">
                "{book.note}"
              </p>
            </div>
          </div>
        ))}
      </div>

      <section className="bg-neutral-600 text-white p-10 rounded-3xl shadow-xl">
        <h3 className="text-2xl font-bold mb-4">Suggest a Book</h3>
        <p className="text-neutral-200 mb-6">Found something that explains a complex system perfectly? We'd love to hear about it.</p>
        <a 
          href="mailto:corigrigor@gmail.com?subject=Book Recommendation - Plain Digital" 
          className="inline-block font-bold border-b-2 border-white pb-1 hover:text-neutral-100 transition-colors"
        >
          Click to send your recommendation
        </a>
      </section>
    </div>
  );
};