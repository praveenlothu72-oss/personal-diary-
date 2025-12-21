
import { GoogleGenAI } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateStoryIdea = async (mood: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `I'm feeling ${mood} today. Can you give me a short, inspiring prompt or a title for my diary entry to help me start writing? Keep it brief and soulful.`,
    });
    return response.text || "Start with what's on your mind...";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Reflect on a moment from today that changed your perspective.";
  }
};

export const refineEntry = async (content: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Act as a compassionate editor. Help me refine this personal experience to be more evocative and clear while keeping my original voice. Content: "${content}"`,
    });
    return response.text || content;
  } catch (error) {
    console.error("Gemini Error:", error);
    return content;
  }
};
