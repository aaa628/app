
import { GoogleGenAI, Type } from "@google/genai";
import { ThoughtEntry, ModeConfig } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export async function generatePushback(
  thought: string,
  confidence: number,
  mode: ModeConfig,
  history: ThoughtEntry[]
) {
  // Incorporate memory to catch contradictions
  const historyContext = history.length > 0 
    ? `\n\nPrevious thoughts and confidence levels for context:\n${history.map(h => `- "${h.text}" (Confidence: ${h.confidence}%). Mode: ${h.mode}. Reflection: ${h.reflection || 'None'}`).join('\n')}`
    : "";

  const prompt = `
    Thought: "${thought}"
    User's Certainty: ${confidence}%
    ${historyContext}
    
    Instruction: Provide 3-5 short, sharp, and uncomfortable bullet points of pushback using the ${mode.label} lens. 
    If this thought contradicts previous thoughts in the history, call it out specifically.
    Do not be polite. Do not use conversational filler. Be a cognitive sparring partner.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        systemInstruction: mode.systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            bullets: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 to 5 sharp pushback points"
            }
          },
          required: ["bullets"]
        }
      }
    });

    const json = JSON.parse(response.text || '{"bullets": []}');
    return json.bullets as string[];
  } catch (error) {
    console.error("Gemini Error:", error);
    return [
      "The system failed to generate friction. Your thought remains unchallenged.",
      "Consider the possibility that your logic is too opaque for standard analysis.",
      "Check your connection and try again."
    ];
  }
}
