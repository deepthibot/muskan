
import { GoogleGenAI, Type } from "@google/genai";

export const generateBirthdayWish = async (name: string, age: number, tone: 'heartfelt' | 'funny' | 'roast') => {
  // Always initialize GoogleGenAI with a named parameter using process.env.API_KEY directly
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = tone === 'roast' 
    ? `Write a funny, lighthearted birthday roast for ${name} who is turning ${age}. Mention that she is short (but cute) and keep it witty but kind.`
    : `Write a beautiful, personalized birthday poem for ${name} who is turning ${age}. Make it ${tone} and memorable. Mention "${name}" means smile and emphasize her bringing joy to others.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.8,
        topP: 0.9,
      },
    });

    // .text is a property on the response object
    return response.text || "Happy Birthday! You are amazing.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return `Happy ${age}th Birthday, ${name}! May your day be as bright and beautiful as your Muskaan (smile)!`;
  }
};

export const generateReasonsToCelebrate = async (name: string, age: number) => {
  // Always initialize GoogleGenAI with a named parameter using process.env.API_KEY directly
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate exactly ${age} short (5-10 words each), sweet, and diverse reasons to celebrate ${name} on her ${age}th birthday. "${name}" means smile. Focus on her personality, her age, her future, and the joy she brings. Return as a JSON array of strings.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      },
    });

    // .text is a property on the response object
    const parsed = JSON.parse(response.text || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Gemini Error generating reasons:", error);
    return Array(age).fill("Because you're absolutely wonderful and unique!");
  }
};
