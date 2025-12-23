
import { GoogleGenAI } from "@google/genai";

export const generateStoryIdea = async (mood: string) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY not found in environment. Please set it in your deployment settings.");
    return "Reflect on a moment from today that made you feel something new.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `I'm feeling ${mood} today. Can you give me a short, inspiring title for my diary entry? Keep it under 10 words.`,
    });
    
    return response.text || "Daily Reflection";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Daily Reflection";
  }
};

export const refineEntry = async (content: string) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || !content) return content;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Act as a compassionate editor. Refine this diary entry to be more evocative while keeping the original voice: "${content}"`,
    });
    
    return response.text || content;
  } catch (error) {
    console.error("Gemini Refinement Error:", error);
    return content;
  }
};
