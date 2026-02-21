
import { GoogleGenAI, GenerateContentParameters, GenerateContentResponse } from '@google/genai';

declare global {
  interface Window {
    aistudio?: {
      openSelectKey: () => Promise<void>;
      hasSelectedApiKey: () => Promise<boolean>;
    };
  }
}

/**
 * Robust execution wrapper for Gemini API calls.
 * Includes basic retry logic and standardized error formatting.
 */
export const executeGenAiTask = async (
  task: (ai: GoogleGenAI) => Promise<any>,
  onError?: (error: any) => void
): Promise<any> => {
  const maxRetries = 2;
  let attempt = 0;

  const run = async (): Promise<any> => {
    try {
      // Fixed: Directly use process.env.API_KEY as per coding guidelines.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      return await task(ai);
    } catch (error: any) {
      console.error(`Gemini Task Failure (Attempt ${attempt + 1}):`, error);

      // Handle specific API Key error as per guidelines
      if (error?.message?.includes("Requested entity was not found.")) {
        if (window.aistudio?.openSelectKey) {
          alert("API configuration issue. Please re-select your AI Studio key.");
          await window.aistudio.openSelectKey();
        }
        throw new Error("API Key Selection Required");
      }

      // Retry on transient errors (like rate limits 429)
      if (attempt < maxRetries && (error?.status === 429 || error?.status >= 500)) {
        attempt++;
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        return run();
      }

      if (onError) onError(error);
      throw error;
    }
  };

  return run();
};

/**
 * Service to handle clinical note processing and medical assistance.
 * All logic relies on Gemini for intelligent parsing and professional formatting.
 */
export const refineMedicalNotes = async (rawNotes: string): Promise<string> => {
  if (!rawNotes.trim()) return rawNotes;
  
  return executeGenAiTask(async (ai) => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Refine these medical notes into a professional clinical summary, fixing grammar and ensuring standard medical terminology is used. If it's dictated text, fix common misheard words. Format as a professional SOAP note section if applicable: ${rawNotes}`,
      config: {
        temperature: 0.1,
        systemInstruction: "You are a senior clinical analyst. Your goal is to improve the readability and professionalism of medical dictations and rough notes without changing the diagnostic meaning."
      }
    });
    return response.text || rawNotes;
  });
};

export const suggestPrescription = async (diagnosis: string): Promise<string[]> => {
    return executeGenAiTask(async (ai) => {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Based on a diagnosis of ${diagnosis}, suggest common medication options for review by a doctor. Include generic names and common dosages.`,
        });
        return [response.text || "No suggestions available"];
    });
};
