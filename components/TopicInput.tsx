import React, { useState } from 'react';
import Button from './Button';
import { PracticeType, PracticeFocus } from '../types';

interface TopicInputProps {
  onGenerate: (topic: string, difficulty: 'Medium' | 'Hard', type: PracticeType, focus: PracticeFocus) => void;
  isLoading: boolean;
  onBack: () => void;
}

const TopicInput: React.FC<TopicInputProps> = ({ onGenerate, isLoading, onBack }) => {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<'Medium' | 'Hard'>('Medium');
  const [practiceType, setPracticeType] = useState<PracticeType>('SCENARIO');
  const [focus, setFocus] = useState<PracticeFocus>('CONCEPTS');

  const quickTopics = [
    "Energy, Work & Heat",
    "First Law: Closed Systems",
    "Ideal Gas Laws & Processes",
    "Steam Properties & Phase Changes",
    "Steady Flow Energy (SFEE)",
    "Second Law & Entropy",
    "Heat Engines & Efficiency",
    "Heat Transfer Basics"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim().length > 3) {
      onGenerate(topic, difficulty, practiceType, focus);
    }
  };

  const typeOptions: { id: PracticeType; label: string; sub: string; icon: React.ReactNode }[] = [
    { 
      id: 'SCENARIO', 
      label: 'Scenarios', 
      sub: '(applied questions)',
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> 
    },
    { 
      id: 'MCQ', 
      label: 'Concepts', 
      sub: '(theory understanding)',
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg> 
    },
    { 
      id: 'TRUE_FALSE', 
      label: 'Quick Check', 
      sub: '(fast questions)',
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> 
    },
  ];

  const focusOptions: { id: PracticeFocus; label: string }[] = [
    { id: 'CONCEPTS', label: 'Key Concepts' },
    { id: 'DIAGRAMS', label: 'Diagrams' },
    { id: 'CALCULATIONS', label: 'Calculations' },
    { id: 'APPLICATIONS', label: 'Applications' },
    { id: 'MISCONCEPTIONS', label: 'Common Pitfalls' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <button 
        onClick={onBack}
        className="mb-6 flex items-center text-sm font-mono font-bold text-zinc-500 hover:text-black transition-colors"
      >
        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Selection
      </button>

      <div className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
        <div className="mb-8 border-b-2 border-black pb-4">
            <h2 className="text-3xl font-black italic uppercase tracking-tight">Pick a topic to practise</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section 1: Quick Select */}
          <div>
            <label className="block text-lg font-bold font-mono text-black mb-4">
              Quick topic picks (common areas)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quickTopics.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTopic(t)}
                  className={`text-left px-4 py-3 border-2 font-mono text-sm font-bold transition-all flex items-center justify-between group ${
                    topic === t
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-black border-black hover:bg-zinc-100'
                  }`}
                >
                  <span>{t}</span>
                  <span className={`transition-opacity ${topic === t ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`}>
                    →
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Custom Input */}
          <div>
            <label className="block text-lg font-bold font-mono text-black mb-2">
              Or type your own topic
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full p-4 bg-zinc-50 border-2 border-black focus:outline-none focus:ring-0 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow font-mono text-sm"
              placeholder="e.g. First Law: Closed Systems"
            />
          </div>

          {/* Section 3: Practice Focus (New) */}
          <div className="pt-6 border-t-2 border-dashed border-zinc-300">
             <label className="block text-lg font-bold font-mono text-black mb-4">
               Target Skill (What to practise?)
             </label>
             <div className="flex flex-wrap gap-2">
               {focusOptions.map((f) => (
                 <button
                   key={f.id}
                   type="button"
                   onClick={() => setFocus(f.id)}
                   className={`px-4 py-2 border-2 font-mono text-xs font-bold uppercase transition-all ${
                     focus === f.id
                       ? 'bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]'
                       : 'bg-white text-black border-black hover:bg-zinc-100'
                   }`}
                 >
                   {f.label}
                 </button>
               ))}
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t-2 border-dashed border-zinc-300">
            <div>
              <label className="block text-lg font-bold font-mono text-black mb-3">
                Question Style
              </label>
              <div className="space-y-2">
                {typeOptions.map((option) => (
                  <div 
                    key={option.id}
                    onClick={() => setPracticeType(option.id)}
                    className={`cursor-pointer border-2 p-3 flex items-center justify-between transition-all ${
                      practiceType === option.id 
                      ? 'bg-black border-black text-white' 
                      : 'bg-white border-black hover:bg-zinc-100'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="mr-3">{option.icon}</span>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold font-mono">{option.label}</span>
                        <span className={`text-[10px] font-mono ${practiceType === option.id ? 'text-zinc-300' : 'text-zinc-500'}`}>{option.sub}</span>
                      </div>
                    </div>
                    {practiceType === option.id && <span className="text-xs">●</span>}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-lg font-bold font-mono text-black mb-3">
                Difficulty level
              </label>
              <div className="space-y-2">
                <div 
                  onClick={() => setDifficulty('Medium')}
                  className={`cursor-pointer border-2 p-3 flex items-center justify-between transition-all ${
                    difficulty === 'Medium' 
                    ? 'bg-black border-black text-white' 
                    : 'bg-white border-black hover:bg-zinc-100'
                  }`}
                >
                    <span className="text-sm font-bold font-mono">Standard</span>
                </div>
                <div 
                  onClick={() => setDifficulty('Hard')}
                  className={`cursor-pointer border-2 p-3 flex items-center justify-between transition-all ${
                    difficulty === 'Hard' 
                    ? 'bg-black border-black text-white' 
                    : 'bg-white border-black hover:bg-zinc-100'
                  }`}
                >
                    <span className="text-sm font-bold font-mono">Advanced</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t-2 border-black">
            <Button 
              type="submit" 
              variant="primary" 
              fullWidth 
              size="lg" 
              disabled={isLoading || topic.trim().length < 3}
            >
              {isLoading ? (
                <span className="flex items-center font-mono">
                  Generating Questions... <span className="animate-pulse ml-2">_</span>
                </span>
              ) : 'Start Practice'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TopicInput;