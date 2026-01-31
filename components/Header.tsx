import React from 'react';
import { AppState } from '../types';

interface HeaderProps {
  onHome: () => void;
  currentState: AppState;
}

const Header: React.FC<HeaderProps> = ({ onHome, currentState }) => {
  return (
    <header className="sticky top-0 z-50 bg-white border-b-2 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div 
            className="flex items-center cursor-pointer group" 
            onClick={onHome}
            role="button"
            aria-label="Go to Homepage"
            title="Go to Homepage"
          >
            {/* NP Logo */}
            <img 
              src="https://www.np.edu.sg/images/default-source/default-album/img-logo.png?sfvrsn=764583a6_19" 
              alt="Ngee Ann Polytechnic" 
              className="h-10 w-auto object-contain mr-6 grayscale group-hover:grayscale-0 transition-all duration-300" 
            />
            
            {/* App Icon */}
            <div className="hidden sm:block flex-shrink-0 bg-black text-white p-2 border-2 border-black group-hover:bg-white group-hover:text-black transition-colors">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={3} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            
            <div className="ml-4">
              <h1 className="text-xl sm:text-2xl font-black italic tracking-tighter text-black uppercase group-hover:underline decoration-4 underline-offset-4 decoration-black">Thermo<span className="text-zinc-500">Tutor</span> AI</h1>
            </div>
          </div>
          
          {currentState !== AppState.HOME && (
            <button 
              onClick={onHome}
              className="flex items-center gap-2 px-3 py-2 sm:px-5 sm:py-2 border-2 border-black bg-white hover:bg-black hover:text-white transition-all font-mono text-xs sm:text-sm font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              aria-label="Back to Home"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="square" strokeLinejoin="miter" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="hidden sm:inline">Home</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;