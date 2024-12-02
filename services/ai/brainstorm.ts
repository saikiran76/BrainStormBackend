import { GoogleGenerativeAI } from '@google/generative-ai';
import type { BrainstormRequest } from '../../types/ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY as string);

export async function generateBrainstormQuestions(params: BrainstormRequest): Promise<string[]> {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  
  try {
    const textsArray = typeof params.texts === 'string'
      ? params.texts.split('\n').filter((text: string) => text.trim().length > 0)
      : Array.isArray(params.texts)
        ? params.texts
        : [];

    const prompt = `The whiteboard contains the following elements:\n` +
               `${textsArray.join('\n')}\n` +
               `The content is related to business planning or logic. For example, if the whiteboard contains a diagram labeled "Marketing Plan," the questions could be:\n` +
               `1. What are our target customer segments?\n` +
               `2. What channels will maximize reach?\n` +
               `Based on the provided content, generate 3 to 5 questions that would help brainstorm or expand on the ideas presented.`;

    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().split("\n").filter(q => q.trim().length > 0);
  } catch (error) {
    console.error("AI generation error:", error);
    return [
      "What are the key elements in this design?",
      "How could this be simplified?",
      "What alternative approaches could work here?",
    ];
  }
} 
