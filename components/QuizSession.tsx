import React, { useState } from 'react';
import { Quiz, Question, UserAnswer } from '../types';
import Button from './Button';
import LatexRenderer from './LatexRenderer';
import ChatAssistant from './ChatAssistant';

interface QuizSessionProps {
  quiz: Quiz;
  onFinish: (answers: UserAnswer[]) => void;
  onExit: () => void;
}

const QuizSession: React.FC<QuizSessionProps> = ({ quiz, onFinish, onExit }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isHintVisible, setIsHintVisible] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const currentQuestion: Question = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  const handleOptionSelect = (index: number) => {
    if (!isAnswerChecked) {
      setSelectedOption(index);
    }
  };

  const handleCheckAnswer = () => {
    if (selectedOption !== null) {
      setIsAnswerChecked(true);
      setShowFeedback(true);
      
      const newAnswer: UserAnswer = {
        questionId: currentQuestion.id,
        selectedOptionIndex: selectedOption
      };
      
      const existing = [...answers];
      existing[currentQuestionIndex] = newAnswer;
      setAnswers(existing);
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      onFinish(answers);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerChecked(false);
      setShowFeedback(false);
      setIsHintVisible(false); // Hide hint for next question
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)]"> 
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header Info */}
        <div className="mb-8 border-b-2 border-black pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
             <div className="bg-black text-white text-xs font-mono inline-block px-2 py-1 mb-2 tracking-widest uppercase">Quiz in progress</div>
             <h2 className="text-3xl font-black italic uppercase leading-none tracking-tight">{quiz.title}</h2>
          </div>
          <div className="flex flex-col items-end">
             <span className="text-sm font-mono font-bold">
              Question {currentQuestionIndex + 1} <span className="text-zinc-400">/</span> {quiz.questions.length}
             </span>
             {/* Brutalist Progress Bar */}
             <div className="flex gap-1 mt-2">
               {quiz.questions.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`h-3 w-8 border border-black transition-colors duration-300 ${
                      idx < currentQuestionIndex ? 'bg-black' : 
                      idx === currentQuestionIndex ? 'bg-zinc-400' : 'bg-transparent'
                    }`}
                  />
               ))}
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Question Area */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 md:p-10 relative">
              {/* Topic Badge */}
              {currentQuestion.topic && (
                <div className="absolute top-0 right-0 -mt-3 -mr-3">
                   <span className="font-mono text-xs font-bold border-2 border-black px-3 py-1 uppercase bg-yellow-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transform rotate-2">
                    {currentQuestion.topic}
                  </span>
                </div>
              )}
              
              <h3 className="text-2xl font-bold font-mono mb-10 leading-loose text-black">
                <LatexRenderer text={currentQuestion.text} />
              </h3>

              {/* Hint Section */}
              <div className="mb-8">
                 {!isHintVisible ? (
                   <button 
                    onClick={() => setIsHintVisible(true)}
                    className="text-xs font-mono font-bold text-zinc-500 border-b border-dashed border-zinc-400 hover:text-black hover:border-black transition-colors"
                   >
                     Need a nudge? 🤔
                   </button>
                 ) : (
                   <div className="bg-zinc-100 border-l-4 border-black p-4 animate-fade-in-down">
                      <p className="text-xs font-bold font-mono uppercase mb-1">AI Hint:</p>
                      <p className="text-sm font-mono text-zinc-700 italic">
                        "<LatexRenderer text={currentQuestion.hint} />"
                      </p>
                   </div>
                 )}
              </div>

              <div className="space-y-4">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === currentQuestion.correctAnswerIndex;
                  
                  let buttonStyle = "bg-white border-black hover:bg-zinc-50 hover:translate-x-1";
                  let indicator = String.fromCharCode(65 + idx);
                  
                  if (isAnswerChecked) {
                    if (isCorrect) {
                      buttonStyle = "bg-zinc-900 text-white border-black ring-2 ring-black ring-offset-2"; // Correct
                      indicator = "✓";
                    } else if (isSelected && !isCorrect) {
                      buttonStyle = "bg-white text-black border-black opacity-50"; // Wrong
                      indicator = "✗";
                    } else {
                      buttonStyle = "bg-white text-zinc-400 border-zinc-200 grayscale"; // Others
                    }
                  } else if (isSelected) {
                    buttonStyle = "bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] translate-x-1";
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleOptionSelect(idx)}
                      disabled={isAnswerChecked}
                      className={`w-full text-left p-5 border-2 font-mono text-base transition-all duration-200 group ${buttonStyle}`}
                    >
                      <div className="flex items-start">
                        <span className={`flex-shrink-0 w-8 h-8 flex items-center justify-center border-2 border-current mr-5 font-bold text-sm ${isAnswerChecked && isCorrect ? 'bg-white text-black' : ''}`}>
                          {indicator}
                        </span>
                        <span className={`leading-relaxed ${isSelected || (isAnswerChecked && isCorrect) ? 'font-bold' : ''}`}>
                          <LatexRenderer text={option} />
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-4">
               <button onClick={onExit} className="font-mono text-xs font-bold uppercase border-b-2 border-transparent hover:border-black transition-all">
                  ← Exit Practice
               </button>
               
               {!isAnswerChecked ? (
                 <Button 
                   onClick={handleCheckAnswer} 
                   disabled={selectedOption === null}
                   size="lg"
                   className="min-w-[200px]"
                 >
                   Check Answer
                 </Button>
               ) : (
                 <Button onClick={handleNext} size="lg" className="min-w-[200px]">
                   {isLastQuestion ? 'View Results' : 'Next Question →'}
                 </Button>
               )}
            </div>
          </div>

          {/* Feedback Terminal */}
          <div className={`lg:col-span-1 transition-all duration-500 transform ${showFeedback ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 lg:translate-y-0 lg:opacity-100'}`}>
            {showFeedback ? (
              <div className="bg-zinc-900 text-white border-2 border-black p-6 shadow-[8px_8px_0px_0px_rgba(100,100,100,0.5)] sticky top-24">
                <div className="border-b border-zinc-700 pb-3 mb-5 flex justify-between items-center">
                  <span className="text-xs font-mono text-green-400 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    AI_FEEDBACK_MODULE
                  </span>
                  <span className={`text-xs font-mono font-bold px-2 py-1 uppercase tracking-wider ${selectedOption === currentQuestion.correctAnswerIndex ? 'bg-green-500 text-black' : 'bg-red-500 text-black'}`}>
                     {selectedOption === currentQuestion.correctAnswerIndex ? 'Correct' : 'Incorrect'}
                  </span>
                </div>
                
                <div className="space-y-6">
                  <div className="font-mono text-sm leading-7 text-zinc-300">
                    <LatexRenderer text={currentQuestion.explanation} />
                  </div>
                  
                  <div className="pt-4 border-t border-dashed border-zinc-700 mt-4">
                     <div className="flex items-center text-xs font-mono text-zinc-500 uppercase mb-2">
                       <span>Topic Analysis</span>
                     </div>
                     <div className="inline-block border border-zinc-600 px-3 py-1 text-xs font-mono text-zinc-300">
                       {currentQuestion.topic || "Thermodynamics"}
                     </div>
                  </div>
                </div>
              </div>
            ) : (
               <div className="hidden lg:flex flex-col h-full border-2 border-dashed border-zinc-300 items-center justify-center p-8 text-center bg-zinc-50 min-h-[300px]">
                 <div className="w-12 h-12 border-2 border-zinc-300 rounded-full flex items-center justify-center mb-4 text-zinc-300">
                   <span className="text-2xl">?</span>
                 </div>
                 <p className="font-mono text-xs text-zinc-400 uppercase tracking-widest">
                   Awaiting Input...
                 </p>
               </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button 
          onClick={() => setIsChatOpen(true)}
          className="bg-black text-white w-14 h-14 border-2 border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.5)] flex items-center justify-center transition-all active:translate-x-1 active:translate-y-1"
        >
          <span className="text-2xl">💬</span>
        </button>
      </div>

      {/* Chat Assistant Sidebar */}
      <ChatAssistant 
        currentQuestionText={currentQuestion.text}
        currentOptions={currentQuestion.options}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </div>
  );
};

export default QuizSession;