import React from 'react';
import { Quiz, UserAnswer } from '../types';
import Button from './Button';
import LatexRenderer from './LatexRenderer';

interface ResultsViewProps {
  quiz: Quiz;
  userAnswers: UserAnswer[];
  onRetry: () => void;
  onHome: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ quiz, userAnswers, onRetry, onHome }) => {
  const correctCount = userAnswers.reduce((acc, ans) => {
    const question = quiz.questions.find(q => q.id === ans.questionId);
    return question && question.correctAnswerIndex === ans.selectedOptionIndex ? acc + 1 : acc;
  }, 0);

  const percentage = Math.round((correctCount / quiz.questions.length) * 100);
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white border-2 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] mb-12">
        {/* Report Header */}
        <div className="bg-black text-white p-8 flex flex-col md:flex-row justify-between items-center border-b-2 border-black">
          <div>
             <h2 className="text-4xl font-black italic uppercase mb-2">Practice Complete</h2>
          </div>
          <div className="mt-6 md:mt-0 text-right">
             <div className="text-6xl font-black font-mono tracking-tighter">
               {percentage}<span className="text-2xl text-zinc-500">%</span>
             </div>
             <div className="text-xs font-mono uppercase bg-white text-black px-2 inline-block">
               {percentage >= 50 ? 'Well Done!' : 'Keep Practicing'}
             </div>
          </div>
        </div>

        <div className="p-8">
          <h3 className="text-lg font-black italic uppercase mb-6 border-b-2 border-black pb-2">Review Answers</h3>
          <div className="space-y-4">
            {quiz.questions.map((q, idx) => {
              const userAnswer = userAnswers.find(a => a.questionId === q.id);
              const isCorrect = userAnswer?.selectedOptionIndex === q.correctAnswerIndex;
              
              return (
                <div key={q.id} className="border-2 border-black p-4 bg-zinc-50">
                  <div className="flex items-start">
                    <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center border-2 border-black mr-4 font-mono font-bold ${isCorrect ? 'bg-black text-white' : 'bg-white text-black'}`}>
                      {isCorrect ? '✓' : 'X'}
                    </div>
                    <div className="flex-1">
                      <p className="text-black font-mono text-sm font-bold mb-2">
                        {idx + 1}. <LatexRenderer text={q.text} />
                      </p>
                      <div className="text-xs font-mono space-y-2 border-l-2 border-zinc-300 pl-3">
                         <div className={`${isCorrect ? 'text-black' : 'text-zinc-500 line-through'}`}>
                           You answered: <LatexRenderer text={q.options[userAnswer?.selectedOptionIndex || 0]} />
                         </div>
                         {!isCorrect && (
                           <div className="text-black bg-zinc-200 inline-block px-1">
                             Correct answer: <LatexRenderer text={q.options[q.correctAnswerIndex]} />
                           </div>
                         )}
                      </div>
                      {!isCorrect && (
                        <div className="mt-4 text-xs font-mono text-zinc-600 bg-white border border-zinc-300 p-2">
                           <span className="font-bold text-black">Explanation:</span> <LatexRenderer text={q.explanation} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-8 border-t-2 border-black bg-zinc-100 flex flex-col sm:flex-row gap-6 justify-between items-center">
           <Button variant="outline" onClick={onHome} className="sm:w-auto">
             Back to Home
           </Button>
           <Button variant="primary" onClick={onRetry} className="sm:w-auto">
             Try Again
           </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultsView;