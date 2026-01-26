import { GoogleGenAI, Type } from "@google/genai";
import { ProductConcept, WorkshopStep, JargonTranslation } from "../types";

const PLAIN_DIGITAL_SYSTEM_INSTRUCTION = `
You are the "Plain Digital" AI assistant. Your rule is: "If a system can’t be explained simply, it isn’t finished." 
You help people who are not technical experts. 
Your tone is professional, clear, and direct, using very simple English. 
Avoid casual greetings or conversational filler.
CRITICAL RULES:
1. NEVER use the word "agency" (use "control", "voice", or "power" instead).
2. NEVER use the word "pervasive" (use "common", "everywhere", or "usual" instead).
3. Use short, simple words. Avoid fancy or complex words.
4. If a word is technical jargon, explain it simply.
5. Focus on helping the user build a "Bet" (Hypothesis) and getting ready for investors.
6. When asked for JSON, return ONLY the JSON object/array.
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

export const generateWorkshop = async (concept: ProductConcept): Promise<WorkshopStep[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Design a simple 4-step plan to build this product. Return a JSON array of 4 steps. 
  Name: ${concept.name}. Problem: ${concept.coreProblem}. Target: ${concept.targetAudience}. Goal: ${concept.opportunity}.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: PLAIN_DIGITAL_SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            actionItem: { type: Type.STRING },
            learningLens: { type: Type.STRING },
            whyThisMatters: { type: Type.STRING }
          },
          required: ["title", "description", "actionItem", "learningLens", "whyThisMatters"]
        }
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("EMPTY_API_RESPONSE");
  return JSON.parse(cleanJsonString(text));
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

  const text = response.text;
  if (!text) throw new Error("EMPTY_API_RESPONSE");
  return JSON.parse(cleanJsonString(text));
};

export const getChapterHelp = async (chapterTitle: string, currentData: Partial<ProductConcept>): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `I need 2 very simple tips for the "${chapterTitle}" part of my product plan. Data: ${JSON.stringify(currentData)}`,
    config: { systemInstruction: PLAIN_DIGITAL_SYSTEM_INSTRUCTION }
  });
  return response.text || "Focus on the simplest version of your idea.";
};

export const getPlainSummary = async (concept: ProductConcept): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Summarize this idea in one sentence (max 12 words): ${concept.name}`,
    config: { systemInstruction: PLAIN_DIGITAL_SYSTEM_INSTRUCTION }
  });
  return response.text?.trim() || "A simple roadmap for your project.";
};

export const chatAboutRoadmap = async (roadmap: WorkshopStep[], query: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Question: ${query}. Plan context: ${JSON.stringify(roadmap)}`,
    config: { systemInstruction: PLAIN_DIGITAL_SYSTEM_INSTRUCTION }
  });
  return response.text || "I'm having trouble thinking of an answer right now.";
};