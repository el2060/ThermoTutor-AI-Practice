import { GoogleGenAI, Type } from "@google/genai";
import { Quiz, PracticeType, ChatMessage, PracticeFocus } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Schema for the Quiz output to ensure strict JSON structure
const quizSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "A catchy, short title for the quiz" },
    description: { type: Type.STRING, description: "A very brief description (1 sentence)" },
    questions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.INTEGER, description: "Unique numeric ID for the question" },
          text: { type: Type.STRING, description: "The question text. Use LaTeX for math. Start with a relevant emoji." },
          options: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Array of options. Use LaTeX for math." 
          },
          correctAnswerIndex: { type: Type.INTEGER, description: "Index of the correct option" },
          explanation: { type: Type.STRING, description: "Short explanation. Use LaTeX for math. Use emojis like 💡 or ✅." },
          hint: { type: Type.STRING, description: "A subtle clue. Use Singlish (lah, leh). Don't give the answer. Max 1 sentence." },
          topic: { type: Type.STRING, description: "Sub-topic" }
        },
        required: ["id", "text", "options", "correctAnswerIndex", "explanation", "hint"]
      }
    }
  },
  required: ["title", "description", "questions"]
};

const SYSTEM_INSTRUCTION = `You are a friendly, encouraging Thermodynamics tutor for Singaporean students.

STYLE GUIDE:
1.  **Tone**: Casual, "text-message" style. Use Singlish particles naturally (lah, lor, sia, meh).
2.  **Length**: Explanations must be SUPER SHORT & SUCCINCT. Max 2-3 sentences.
3.  **Visuals**: Use emojis liberally to create visual interest.
    - Start every question with a context emoji.
    - Use 💡, ✅, ⚠️ in explanations.
4.  **Content**: Physics must be 100% accurate.
5.  **Hinting**: When asked for a hint, never give the answer. Just nudge them on the formula or concept to use.
6.  **FORMATTING**: 
    - You **MUST** use LaTeX for ALL variables, units, and formulas. 
    - Enclose inline math in single dollar signs, e.g., $Q = mc\\Delta T$.
    - Enclose display/block math in double dollar signs, e.g., $$ \\Delta S = \\int \\frac{dQ}{T} $$.
    - Ensure units like $kJ/kg$ are formatted in LaTeX too.
    - **CRITICAL**: Output valid JSON. Escape backslashes for LaTeX commands properly.`;

export const generateMode1Quiz = async (materials: string, practiceType: PracticeType): Promise<Quiz> => {
  const model = "gemini-3-flash-preview";
  
  let typeSpecificPrompt = "";
  if (practiceType === 'TRUE_FALSE') {
    typeSpecificPrompt = "Generate 5-8 TRUE/FALSE questions based on the text. Options MUST be ['True', 'False'].";
  } else if (practiceType === 'SCENARIO') {
    typeSpecificPrompt = "Generate 4-6 SCENARIO-BASED questions. Give a short real-life situation and ask a concept application question.";
  } else {
    typeSpecificPrompt = "Generate 5-8 standard Multiple Choice Questions (MCQ) based on the text.";
  }

  const prompt = `
    TASK: Create a practice quiz from the provided student materials.
    TYPE: ${typeSpecificPrompt}
    
    RULES:
    1. Strictly use the provided text.
    2. Keep questions relevant to exams.
    3. Use LaTeX ($...$) for all math and units.
    4. Make it visually engaging with emojis in the text.
    5. Include a 'hint' for every question that sounds like a helpful senior student.
    
    MATERIALS:
    """
    ${materials.substring(0, 30000)} 
    """
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: quizSchema,
        systemInstruction: SYSTEM_INSTRUCTION
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as Quiz;
    }
    throw new Error("No response text generated");
  } catch (error) {
    console.error("Mode 1 Generation Error:", error);
    throw error;
  }
};

export const generateMode2Quiz = async (topic: string, difficulty: 'Medium' | 'Hard', practiceType: PracticeType, focus: PracticeFocus): Promise<Quiz> => {
  const model = "gemini-3-pro-preview"; 
  
  // Define Focus instructions
  const focusInstructions: Record<PracticeFocus, string> = {
    'CONCEPTS': "Focus on RECALL and DEFINITIONS. Test understanding of fundamental laws, properties, and terminology. Avoid complex math.",
    'DIAGRAMS': "Focus on P-v, T-s, and h-s DIAGRAMS. Since you cannot generate images, strictly describe the graph in text (e.g. 'Process 1-2 is a vertical line up on a T-s diagram') and ask questions about what that implies.",
    'CALCULATIONS': "Focus on PROBLEM SOLVING. Require use of formulas and numbers. Keep numbers simple enough for estimation or standard calculation.",
    'APPLICATIONS': "Focus on REAL-WORLD systems (Turbines, Nozzles, Fridges, Engines). Ask about how thermodynamics applies to engineering devices.",
    'MISCONCEPTIONS': "Focus on COMMON MISTAKES. Create trick questions or questions that test deep conceptual traps where students usually go wrong."
  };

  let typeSpecificPrompt = "";
  if (practiceType === 'TRUE_FALSE') {
    typeSpecificPrompt = "Generate 5 TRUE/FALSE questions. Options MUST be ['True', 'False'].";
  } else if (practiceType === 'SCENARIO') {
    typeSpecificPrompt = "Generate 5 SCENARIO-BASED questions. Give a short real-life situation.";
  } else {
    typeSpecificPrompt = "Generate 5 standard Multiple Choice Questions (MCQ).";
  }

  const prompt = `
    TASK: Create a ${difficulty} difficulty quiz on the topic: "${topic}".
    TARGET SKILL: ${focus} (${focusInstructions[focus]})
    TYPE: ${typeSpecificPrompt}
    
    RULES:
    1. Focus strictly on the TARGET SKILL requested.
    2. Use LaTeX ($...$) for all math and units.
    3. If 'Hard', test misconceptions or multi-step logic.
    4. Use emojis to make the questions look less dry.
    5. Include a 'hint' for every question that sounds like a helpful senior student.
    
    TOPIC FOCUS: ${topic}
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: quizSchema,
        systemInstruction: SYSTEM_INSTRUCTION
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as Quiz;
    }
    throw new Error("No response text generated");
  } catch (error) {
    console.error("Mode 2 Generation Error:", error);
    throw error;
  }
};

export const generateChatResponse = async (
  currentQuestion: string, 
  currentOptions: string[], 
  chatHistory: ChatMessage[],
  userMessage: string
): Promise<string> => {
  const model = "gemini-3-flash-preview";

  const prompt = `
    CONTEXT: The student is attempting this Thermodynamics question:
    "${currentQuestion}"
    Options: ${JSON.stringify(currentOptions)}

    CHAT HISTORY:
    ${chatHistory.map(m => `${m.role}: ${m.text}`).join('\n')}

    USER'S LATEST MESSAGE:
    "${userMessage}"

    TASK:
    Answer the user. 
    1. Do NOT give the direct answer (A, B, C, D) unless they have tried multiple times.
    2. Guide them using Socratic questioning or pointing out keywords.
    3. Use Singlish/Casual Singaporean student tone (e.g. "Eh check the units first", "Use First Law la").
    4. Use LaTeX for math.
    5. Keep it short.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION
      }
    });
    return response.text || "Sorry ah, I cannot think right now. Try again later.";
  } catch (error) {
    console.error("Chat Error:", error);
    return "System overloaded sia. Wait a while.";
  }
};