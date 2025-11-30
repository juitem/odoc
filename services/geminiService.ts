import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysisResult } from "../types";

// Initialize the Gemini client
// We use import.meta.env for Vite-based projects. 
// Make sure .env file has VITE_API_KEY defined.
const apiKey = import.meta.env.VITE_API_KEY;

if (!apiKey) {
  console.warn("Missing VITE_API_KEY. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "" });

const ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    summary: { type: Type.STRING, description: "A brief executive summary of the company's recent situation." },
    bullishCase: { type: Type.STRING, description: "Arguments for why the stock price might go up." },
    bearishCase: { type: Type.STRING, description: "Arguments for why the stock price might go down." },
    keyRisks: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "List of 3-5 major risks facing the company."
    },
    recommendation: { 
      type: Type.STRING, 
      enum: ["Buy", "Hold", "Sell", "Neutral"],
      description: "A general consensus based on the analysis." 
    }
  },
  required: ["summary", "bullishCase", "bearishCase", "keyRisks", "recommendation"],
};

export const analyzeStock = async (symbol: string, market: string): Promise<AIAnalysisResult> => {
  const model = "gemini-2.5-flash"; 
  const prompt = `
    Act as a senior financial analyst. specificially for the ${market} stock market.
    Analyze the stock with ticker/symbol: ${symbol}.
    
    Provide a professional assessment including:
    1. Recent performance summary.
    2. Bullish thesis.
    3. Bearish thesis.
    4. Key structural or market risks.
    5. A general rating (Buy/Hold/Sell/Neutral) based on current market sentiment.
    
    Ensure the tone is objective and professional.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: ANALYSIS_SCHEMA,
        systemInstruction: "You are Odoc AI, a world-class financial analyst specializing in equity markets.",
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from Gemini");
    }

    return JSON.parse(text) as AIAnalysisResult;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};

export const getMarketOverview = async (market: string): Promise<string> => {
    const model = "gemini-2.5-flash";
    const prompt = `Provide a concise, 3-sentence summary of the current sentiment for the ${market} stock market today. Focus on major indices and key macro factors.`;
    
    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });
        return response.text || "Market data currently unavailable.";
    } catch (error) {
        console.error("Overview Error:", error);
        return "Unable to retrieve market overview.";
    }
}