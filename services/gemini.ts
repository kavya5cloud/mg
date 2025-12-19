
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

export const sendMessageToCurator = async (message: string, history: Array<{role: 'user' | 'model', text: string}>) => {
  // Always initialize fresh to ensure latest API key is used from environment
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
      // Map the simple history format to the API's expected format
      const chatHistory = history.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
      }));

      // Create a chat session with gemini-3-flash-preview
      const chat = ai.chats.create({
          model: 'gemini-3-flash-preview',
          config: {
              systemInstruction: SYSTEM_INSTRUCTION,
          },
          history: chatHistory
      });

      // Send the user's message
      const response = await chat.sendMessage({ message });
      
      // Use .text property as per guidelines
      return response.text;
  } catch (error) {
      console.error("AI Service Error:", error);
      return "I apologize, but I am experiencing a temporary connection issue with the museum archives. Please try again in a moment.";
  }
};

export const initChat = () => {
    return null;
};
