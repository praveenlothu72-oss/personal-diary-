
import { GoogleGenAI } from "@google/genai";

// Simplified API key retrieval to strictly follow Google GenAI SDK guidelines.
// Always obtain API_KEY from process.env.
export const generateStoryIdea = async (mood: string) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY not found. AI features will be disabled.");
    return "Reflect on a moment from today that made you feel something new.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `I'm feeling ${mood} today. Can you give me a short, inspiring title for my diary entry? Keep it under 10 words.`,
    });
    
    // Accessing .text as a property as per current SDK guidelines.
    return response.text || "Daily Reflection";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Daily Reflection";
  }
};

// Simplified API key retrieval to strictly follow Google GenAI SDK guidelines.
export const refineEntry = async (content: string) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || !content) return content;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Act as a compassionate editor. Refine this diary entry to be more evocative while keeping the original voice: "${content}"`,
    });
    
    // Accessing .text as a property as per current SDK guidelines.
    return response.text || content;
  } catch (error) {
    console.error("Gemini Refinement Error:", error);
    return content;
  }
};
