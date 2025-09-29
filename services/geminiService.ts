
import { GoogleGenAI } from "@google/genai";

// Fix: Adhere to Gemini API guidelines for API key initialization.
// The API key is sourced directly from the environment and is assumed to be available.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getMotivationalTip = async (): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: 'Generate a short, motivational, and actionable weight loss tip. Keep it positive and under 200 characters.'
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching motivational tip:", error);
    // Provide a graceful fallback message in case of an API error.
    return "Every step you take, no matter how small, is a step in the right direction. You've got this!";
  }
};
