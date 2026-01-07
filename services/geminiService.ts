import { GoogleGenAI } from "@google/genai";
import { TAX_DATA } from "../constants";

const getSystemInstruction = () => {
  const context = JSON.stringify(TAX_DATA.map(c => ({
    country: c.country,
    cit: c.cit.standardRate,
    pit_top: c.pit.brackets[c.pit.brackets.length - 1].rate,
    vat: c.salesTax.standardRate,
    incentives: c.cit.incentives.join(", ")
  })));

  return `You are a world-class International Tax Strategist and Investment Advisor. 
  You specialize in the following jurisdictions: Pakistan, India, UAE, Bangladesh, Vietnam, Cambodia, and China.
  
  Your goal is to help investors, corporations, and individuals optimize their tax burden and make informed investment decisions.
  
  Here is a summary of the current tax data you have access to:
  ${context}

  Guidelines:
  1. Be professional, concise, and analytical.
  2. When comparing, use the data provided.
  3. If asked about a specific calculation, explain the logic.
  4. Always include a brief disclaimer that you are an AI and this does not constitute legal financial advice.
  5. Format your answers with clear headings and bullet points where appropriate.
  `;
};

export const generateTaxAdvice = async (prompt: string): Promise<string> => {
  if (!process.env.API_KEY) {
    return "Error: API Key is missing. Please check your environment configuration.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Using gemini-3-flash-preview for speed and efficiency in text tasks
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: getSystemInstruction(),
      }
    });

    return response.text || "I apologize, but I couldn't generate a response at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "An error occurred while consulting the AI strategist. Please try again later.";
  }
};