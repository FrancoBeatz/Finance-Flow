import { GoogleGenAI, Type } from "@google/genai";
import { TransactionType } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-2.5-flash';

/**
 * Parses natural language input into a structured transaction object.
 */
export const parseTransactionFromText = async (input: string): Promise<{
  amount: number;
  type: TransactionType;
  category: string;
  description: string;
  date: string;
} | null> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Parse this financial transaction: "${input}". 
      Return JSON with amount, type (INCOME or EXPENSE), category (pick best fit from: Food, Transport, Housing, Utilities, Entertainment, Health, Shopping, Salary, Investment, Other), description, and date (YYYY-MM-DD, assume today is ${new Date().toISOString().split('T')[0]} if not specified).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            amount: { type: Type.NUMBER },
            type: { type: Type.STRING, enum: ["INCOME", "EXPENSE"] },
            category: { type: Type.STRING },
            description: { type: Type.STRING },
            date: { type: Type.STRING },
          },
          required: ["amount", "type", "category", "description", "date"],
        },
      },
    });

    const text = response.text;
    if (!text) return null;
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Error parsing transaction with Gemini:", error);
    return null;
  }
};

/**
 * Generates financial insights based on recent transaction history.
 */
export const getFinancialInsights = async (transactions: any[]): Promise<string> => {
  try {
    // Limit to last 20 transactions to save tokens
    const recent = transactions.slice(0, 20);
    const summary = JSON.stringify(recent);

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Analyze these recent financial transactions and provide 3 brief, actionable bullet points of advice or observations about spending habits. Keep it encouraging but realistic.
      Data: ${summary}`,
    });

    return response.text || "No insights available at the moment.";
  } catch (error) {
    console.error("Error generating insights:", error);
    return "Could not generate insights at this time.";
  }
};