import { GoogleGenAI, Type } from "@google/genai";

// Initialize the API client
// Note: process.env.API_KEY is injected by the environment.
// Robustly handle missing key by creating a dummy client or checking before call, 
// but for this implementation we assume the key is present or we catch errors during the call.
const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const suggestSubtasks = async (taskDescription: string): Promise<string[]> => {
  const client = getClient();
  if (!client) {
    throw new Error("API Key not found");
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
    
    // Parse the JSON response
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
    throw error;
  }
};
