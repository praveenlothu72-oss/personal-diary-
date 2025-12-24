
import { GoogleGenAI } from "@google/genai";

// Simplified API key retrieval to strictly follow Google GenAI SDK guidelines.
// Always initialize GoogleGenAI with { apiKey: process.env.API_KEY } directly before making an API call.
export const generateStoryIdea = async (mood: string) => {
  try {
    // Initializing with API_KEY directly from process.env as per SDK instructions.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `I'm feeling ${mood} today. Can you give me a short, inspiring title for my diary entry? Keep it under 10 words.`,
    });
    
    // Accessing .text as a property (not a method) as per current SDK guidelines.
    return response.text || "Daily Reflection";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Daily Reflection";
  }
};

// Simplified API key retrieval to strictly follow Google GenAI SDK guidelines.
export const refineEntry = async (content: string) => {
  if (!content) return content;

  try {
    // Initializing with API_KEY directly from process.env as per SDK instructions.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Act as a compassionate editor. Refine this diary entry to be more evocative while keeping the original voice: "${content}"`,
    });
    
    // Accessing .text as a property (not a method) as per current SDK guidelines.
    return response.text || content;
  } catch (error) {
    console.error("Gemini Refinement Error:", error);
    return content;
  }
};
