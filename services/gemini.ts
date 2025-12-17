
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

// Initialize AI Client
// Note: Requires process.env.API_KEY to be set in the environment
const ai = process.env.API_KEY ? new GoogleGenAI({ apiKey: process.env.API_KEY }) : null;

export const sendMessageToCurator = async (message: string, history: Array<{role: 'user' | 'model', text: string}>) => {
  if (!ai) {
    // Fallback if no key is provided (for demo purposes)
    return new Promise<string>(resolve => 
        setTimeout(() => resolve("Welcome to MOCA Gandhinagar. I am your AI Curator. My connection to the knowledge base (API Key) is currently not configured, but I am here to welcome you."), 1000)
    );
  }

  try {
      // Map the simple history format to the API's expected format
      const chatHistory = history.map(msg => ({
          role: msg.role,
          parts: [{ text: msg.text }]
      }));

      // Create a chat session with the specific model and system instruction
      const chat = ai.chats.create({
          model: 'gemini-2.5-flash',
          config: {
              systemInstruction: SYSTEM_INSTRUCTION,
          },
          history: chatHistory
      });

      // Send the user's message
      const response = await chat.sendMessage({ message });
      
      return response.text;
  } catch (error) {
      console.error("AI Service Error:", error);
      return "I apologize, but I am experiencing a temporary connection issue with the museum archives. Please try again in a moment.";
  }
};

export const initChat = () => {
    // Placeholder if needed for future initialization logic
    return null;
};
