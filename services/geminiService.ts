
import { GoogleGenAI, Type } from "@google/genai";
import { ProductConcept, WorkshopStep, JargonTranslation } from "../types";

const PLAIN_DIGITAL_SYSTEM_INSTRUCTION = `
You are the "Plain Digital" assistant. Your rule is: "If a system can’t be explained simply, it isn’t finished." 
You help non-technical people reclaim control in digital systems.
Your tone is professional, clear, and direct. Avoid casual greetings or conversational filler.
CRITICAL RULES:
1. NEVER use the word "agency" (use "control", "voice", or "power" instead).
2. NEVER use the word "pervasive" (use "common", "everywhere", or "usual" instead).
3. Use short, simple words. Explain technical jargon if used.
`;

const WORKFLOW_BUILDER_INSTRUCTION = `
You are a personalised workflow builder for non-technical people.
Your goal is to generate a clear, realistic action plan in maximum 5 steps.

Flow:
1. Identify the user’s profile based on their input (career stage, goal, experience).
2. If you need more info to be practical, ask NO MORE than 4 clarifying questions.
3. Once ready, generate a personalised workflow.

The workflow MUST be:
- Practical (things a human can actually do)
- Non-technical
- Focused on learning + execution, not theory
- No jargon, no fluff, no buzzwords.

When providing the final workflow, use JSON format.
`;

const cleanJsonString = (str: string): string => {
  try {
    const start = Math.min(
      str.indexOf('{') === -1 ? Infinity : str.indexOf('{'),
      str.indexOf('[') === -1 ? Infinity : str.indexOf('[')
    );
    const end = Math.max(
      str.lastIndexOf('}'),
      str.lastIndexOf(']')
    );
    
    if (start !== Infinity && end !== -1 && end > start) {
      return str.substring(start, end + 1);
    }
    return str.replace(/```json\n?|```/g, '').trim();
  } catch (e) {
    return str.trim();
  }
};

export const getClarifyingQuestions = async (context: string): Promise<string[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `User context: "${context}". Based on this, identify their profile and ask up to 4 simple, non-technical clarifying questions to help build a realistic workflow. Return a JSON array of strings (questions). If no questions are needed, return an empty array.`,
    config: {
      systemInstruction: PLAIN_DIGITAL_SYSTEM_INSTRUCTION + WORKFLOW_BUILDER_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    }
  });
  return JSON.parse(cleanJsonString(response.text || "[]"));
};

export const generateFinalWorkflow = async (context: string, answers: string): Promise<WorkshopStep[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Initial Context: ${context}. User Answers: ${answers}. Generate the final personalized workflow (max 5 steps).`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: PLAIN_DIGITAL_SYSTEM_INSTRUCTION + WORKFLOW_BUILDER_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            whatToDo: { type: Type.STRING },
            whyMatters: { type: Type.STRING },
            output: { type: Type.STRING }
          },
          required: ["title", "whatToDo", "whyMatters", "output"]
        }
      }
    }
  });

  return JSON.parse(cleanJsonString(response.text || "[]"));
};

export const translateJargon = async (jargon: string): Promise<JargonTranslation> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Explain this technical word in very simple, professional English: "${jargon}". Return JSON.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: PLAIN_DIGITAL_SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          original: { type: Type.STRING },
          plainVersion: { type: Type.STRING },
          analogy: { type: Type.STRING }
        },
        required: ["original", "plainVersion", "analogy"]
      }
    }
  });

  return JSON.parse(cleanJsonString(response.text || "{}"));
};

export const getPlainSummary = async (steps: WorkshopStep[]): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Summarize this workflow in one simple sentence (max 12 words): ${JSON.stringify(steps)}`,
    config: { systemInstruction: PLAIN_DIGITAL_SYSTEM_INSTRUCTION }
  });
  return response.text?.trim() || "A practical plan for your goal.";
};
