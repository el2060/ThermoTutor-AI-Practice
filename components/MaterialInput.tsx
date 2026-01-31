import React, { useState } from 'react';
import Button from './Button';
import { PracticeType } from '../types';
import * as pdfjsLib from 'pdfjs-dist';

// Handle ES module default export inconsistency for PDF.js
const pdfjs = (pdfjsLib as any).default || pdfjsLib;

// Initialize PDF.js worker
if (typeof window !== 'undefined' && !pdfjs.GlobalWorkerOptions.workerSrc) {
  pdfjs.GlobalWorkerOptions.workerSrc = `https://esm.sh/pdfjs-dist@3.11.174/build/pdf.worker.min.js`;
}

interface MaterialInputProps {
  onGenerate: (text: string, type: PracticeType) => void;
  isLoading: boolean;
  onBack: () => void;
}

const MaterialInput: React.FC<MaterialInputProps> = ({ onGenerate, isLoading, onBack }) => {
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [practiceType, setPracticeType] = useState<PracticeType>('MCQ');
  const [isParsing, setIsParsing] = useState(false);

  const extractTextFromPdf = async (file: File): Promise<string> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      // Use the resolved pdfjs object
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + '\n\n';
      }
      return fullText;
    } catch (error) {
      console.error("PDF Parsing Error:", error);
      throw new Error("Failed to extract text from PDF");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      
      if (file.type === 'application/pdf') {
        setIsParsing(true);
        try {
          const extractedText = await extractTextFromPdf(file);
          setText(extractedText);
        } catch (error) {
          console.error(error);
          alert("Could not read the PDF file. It might be password protected or scanned images. Please try copying the text manually.");
          setFileName(null);
        } finally {
          setIsParsing(false);
        }
      } else {
        // Handle text-based files
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          setText(content);
        };
        reader.readAsText(file);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim().length > 50) {
      onGenerate(text, practiceType);
    }
  };

  const typeOptions: { id: PracticeType; label: string; icon: React.ReactNode }[] = [
    { 
      id: 'MCQ', 
      label: 'Standard MCQ', 
      icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg> 
    },
    { 
      id: 'SCENARIO', 
      label: 'Scenarios', 
      icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> 
    },
    { 
      id: 'TRUE_FALSE', 
      label: 'True / False', 
      icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> 
    },
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
            <h2 className="text-3xl font-black italic uppercase tracking-tight">Upload your materials</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-lg font-bold font-mono text-black mb-2">
              Paste your notes
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={isParsing}
              className={`w-full h-48 p-4 bg-zinc-50 border-2 border-black focus:outline-none focus:ring-0 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow resize-none font-mono text-sm ${isParsing ? 'opacity-50' : ''}`}
              placeholder={isParsing ? "Extracting text from PDF..." : "Paste lecture notes or tutorial text here..."}
            />
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm font-bold font-mono bg-black text-white px-2">OR</span>
            <div className="flex-1">
               <label className={`flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-black hover:bg-zinc-100 cursor-pointer transition-colors group ${isParsing ? 'bg-zinc-100 cursor-wait' : ''}`}>
                  <div className="flex flex-col items-center justify-center pt-2 pb-3">
                      {isParsing ? (
                         <div className="flex items-center space-x-2">
                             <div className="animate-spin h-4 w-4 border-2 border-black border-t-transparent rounded-full"></div>
                             <p className="font-mono text-sm font-bold">Reading PDF...</p>
                         </div>
                      ) : (
                        <>
                          <p className="font-mono text-sm font-bold group-hover:underline">
                            {fileName ? `> ${fileName}` : "Upload File"}
                          </p>
                          <p className="text-[10px] font-mono text-zinc-500 mt-1">.PDF .TXT .MD</p>
                        </>
                      )}
                  </div>
                  <input type="file" className="hidden" accept=".txt,.md,.csv,.json,.pdf" onChange={handleFileChange} disabled={isParsing} />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-lg font-bold font-mono text-black mb-3">
              What kind of questions?
            </label>
            <div className="grid grid-cols-3 gap-4">
              {typeOptions.map((option) => (
                <div 
                  key={option.id}
                  onClick={() => !isParsing && setPracticeType(option.id)}
                  className={`cursor-pointer border-2 p-4 flex flex-col items-center justify-center transition-all ${
                    practiceType === option.id 
                    ? 'bg-black border-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]' 
                    : 'bg-white border-black hover:bg-zinc-100'
                  } ${isParsing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="mb-2">{option.icon}</div>
                  <span className="text-xs font-bold font-mono text-center uppercase">{option.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t-2 border-black">
            <Button 
              type="submit" 
              variant="primary" 
              fullWidth 
              size="lg" 
              disabled={isLoading || isParsing || text.trim().length < 50}
            >
              {isLoading ? (
                <span className="flex items-center font-mono">
                  Processing... <span className="animate-pulse ml-2">_</span>
                </span>
              ) : isParsing ? (
                <span className="flex items-center font-mono">
                  Reading File...
                </span>
              ) : 'Start Practice'}
            </Button>
            {!isParsing && text.trim().length > 0 && text.trim().length < 50 && (
              <p className="text-xs font-mono text-red-600 mt-2 text-center uppercase">Please enter more text to generate a quiz.</p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default MaterialInput;