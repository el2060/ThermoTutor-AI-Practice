import React from 'react';
import Button from './Button';

interface ModeSelectionProps {
  onSelectMode1: () => void;
  onSelectMode2: () => void;
}

const ModeSelection: React.FC<ModeSelectionProps> = ({ onSelectMode1, onSelectMode2 }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-5xl font-black italic text-black mb-6 uppercase tracking-tighter leading-tight">
          CHOOSE HOW YOU WANT TO PRACTISE
        </h2>
        <p className="text-lg font-mono text-zinc-600 max-w-xl mx-auto border-l-4 border-zinc-300 pl-4 text-left">
          Start a practice session<br/>
          Choose your question source
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl">
        {/* Mode 1 Card */}
        <div className="relative group bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 flex flex-col">
          <div className="p-8 h-full flex flex-col">
            <div className="w-16 h-16 border-2 border-black bg-zinc-100 mb-6 flex items-center justify-center text-black">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="square" strokeLinejoin="miter" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-black italic uppercase mb-2">Practise From My Materials</h3>
            <p className="font-bold text-sm mb-4 bg-zinc-100 inline-block px-2 py-1 border border-zinc-300">
              "Test me using what I’m studying."
            </p>
            <p className="font-mono text-sm text-zinc-600 mb-8 border-t-2 border-dashed border-zinc-300 pt-4 flex-grow">
              Upload or paste your notes, slides, or tutorials.<br />
              I’ll quiz you strictly from those materials.
            </p>
            <Button variant="secondary" fullWidth onClick={onSelectMode1}>
              START PRACTICE →
            </Button>
          </div>
        </div>

        {/* Mode 2 Card */}
        <div className="relative group bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 flex flex-col">
          <div className="p-8 h-full flex flex-col">
            <div className="w-16 h-16 border-2 border-black bg-zinc-100 mb-6 flex items-center justify-center text-black">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="square" strokeLinejoin="miter" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </div>
            <h3 className="text-2xl font-black italic uppercase mb-2">Challenge Beyond My Materials</h3>
            <p className="font-bold text-sm mb-4 bg-zinc-100 inline-block px-2 py-1 border border-zinc-300">
              "Test me beyond what I’m studying."
            </p>
            <p className="font-mono text-sm text-zinc-600 mb-8 border-t-2 border-dashed border-zinc-300 pt-4 flex-grow">
               Tell me a topic.<br />
               I’ll generate new thermodynamics questions using broader AI knowledge, real scenarios, and unseen problem variations.
            </p>
            <Button variant="primary" fullWidth onClick={onSelectMode2}>
              START CHALLENGE →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModeSelection;