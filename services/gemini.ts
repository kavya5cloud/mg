import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';

let chatSession: Chat | null = null;

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const initChat = () => {
  const ai = getAiClient();
  if (!ai) return null;

  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7,
      maxOutputTokens: 500,
    },
  });
  return chatSession;
};

export const sendMessageToCurator = async (message: string): Promise<string> => {
  if (!chatSession) {
    initChat();
  }
  
  if (!chatSession) {
    return "I'm having trouble connecting to the museum archives right now. Please try again later.";
  }

  try {
    const response: GenerateContentResponse = await chatSession.sendMessage({ message });
    return response.text || "I'm contemplating that... could you rephrase?";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "My apologies, I seem to have lost my train of thought. Please try again.";
  }
};
