import { GoogleGenAI, Type } from "@google/genai";

const getClient = () => {
  // Safe check for process.env which might not exist in some browser environments
  const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : null;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const suggestSubtasks = async (taskDescription: string): Promise<string[]> => {
  const client = getClient();
  if (!client) {
    // Return empty array instead of throwing to prevent app crash if AI fails
    console.warn("Gemini API Key not found. AI features disabled.");
    return [];
  }

  try {
    const response = await client.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Break down the following task into 3 to 5 concise, actionable subtasks. 
      Task: "${taskDescription}"
      Return only a JSON array of strings. Do not include markdown code blocks.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    
    try {
        const subtasks = JSON.parse(text);
        if (Array.isArray(subtasks)) {
            return subtasks;
        }
        return [];
    } catch (e) {
        console.error("Failed to parse Gemini response", e);
        return [];
    }

  } catch (error) {
    console.error("Gemini API Error:", error);
    return []; // Graceful failure
  }
};