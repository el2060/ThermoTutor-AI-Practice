import React, { useState } from 'react';
import { AppState, Quiz, UserAnswer, PracticeType, PracticeFocus } from './types';
import { generateMode1Quiz, generateMode2Quiz } from './services/geminiService';
import Header from './components/Header';
import ModeSelection from './components/ModeSelection';
import MaterialInput from './components/MaterialInput';
import TopicInput from './components/TopicInput';
import QuizSession from './components/QuizSession';
import ResultsView from './components/ResultsView';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.HOME);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleHome = () => {
    setAppState(AppState.HOME);
    setCurrentQuiz(null);
    setUserAnswers([]);
  };

  const startMode1 = async (text: string, type: PracticeType) => {
    setIsLoading(true);
    try {
      const quiz = await generateMode1Quiz(text, type);
      setCurrentQuiz(quiz);
      setAppState(AppState.QUIZ);
    } catch (error) {
      alert("Failed to generate quiz. Please try again with valid text.");
    } finally {
      setIsLoading(false);
    }
  };

  const startMode2 = async (topic: string, difficulty: 'Medium' | 'Hard', type: PracticeType, focus: PracticeFocus) => {
    setIsLoading(true);
    try {
      const quiz = await generateMode2Quiz(topic, difficulty, type, focus);
      setCurrentQuiz(quiz);
      setAppState(AppState.QUIZ);
    } catch (error) {
      alert("Failed to generate quiz. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuizFinish = (answers: UserAnswer[]) => {
    setUserAnswers(answers);
    setAppState(AppState.RESULTS);
  };

  const handleRetry = () => {
    // Retry essentially means going back to input to regenerate or re-take?
    // Let's reset to Home for now to allow picking a new path, 
    // or we could re-use currentQuiz to just re-take it.
    // Let's re-take the current quiz for practice effect.
    setUserAnswers([]);
    setAppState(AppState.QUIZ);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header onHome={handleHome} currentState={appState} />
      
      <main className="flex-grow">
        {appState === AppState.HOME && (
          <ModeSelection 
            onSelectMode1={() => setAppState(AppState.SETUP_MODE_1)}
            onSelectMode2={() => setAppState(AppState.SETUP_MODE_2)}
          />
        )}

        {appState === AppState.SETUP_MODE_1 && (
          <MaterialInput 
            onGenerate={startMode1} 
            isLoading={isLoading} 
            onBack={handleHome}
          />
        )}

        {appState === AppState.SETUP_MODE_2 && (
          <TopicInput 
            onGenerate={startMode2} 
            isLoading={isLoading} 
            onBack={handleHome}
          />
        )}

        {appState === AppState.QUIZ && currentQuiz && (
          <QuizSession 
            quiz={currentQuiz} 
            onFinish={handleQuizFinish} 
            onExit={handleHome}
          />
        )}

        {appState === AppState.RESULTS && currentQuiz && (
          <ResultsView 
            quiz={currentQuiz} 
            userAnswers={userAnswers} 
            onRetry={handleRetry}
            onHome={handleHome}
          />
        )}
      </main>
      
      <footer className="bg-white border-t-2 border-black py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-black font-mono text-xs font-bold uppercase tracking-widest">
          ThermoTutor AI — Proof of concept by Junying (LSCT) and Ee-Lon (CLTE)
        </div>
      </footer>
    </div>
  );
};

export default App;