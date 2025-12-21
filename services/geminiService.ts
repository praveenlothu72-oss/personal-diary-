
import { GoogleGenAI } from "@google/genai";

export const generateStoryIdea = async (mood: string) => {
  // Check if API Key exists before attempting connection
  if (!process.env.API_KEY) {
    console.warn("API_KEY is missing. AI features are disabled.");
    return "Reflect on a moment from today that changed your perspective.";
  }

  // Create instance right before call as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `I'm feeling ${mood} today. Can you give me a short, inspiring prompt or a title for my diary entry to help me start writing? Keep it brief and soulful.`,
    });
    
    return response.text || "Start with what's on your mind...";
  } catch (error) {
    console.error("Gemini Connection Error:", error);
    return "Start with what's on your mind...";
  }
};

export const refineEntry = async (content: string) => {
  if (!process.env.API_KEY || !content) return content;

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Act as a compassionate editor. Help me refine this personal experience to be more evocative and clear while keeping my original voice. Content: "${content}"`,
    });
    
    return response.text || content;
  } catch (error) {
    console.error("Gemini Refinement Error:", error);
    return content;
  }
};
