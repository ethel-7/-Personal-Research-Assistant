import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getAnswerFromGemini(question: string, context: string): Promise<string> {
  try {
    const prompt = `
      You are a Personal Research Assistant. Your sole purpose is to answer questions based ONLY on the provided document excerpts.

      Follow these rules STRICTLY:
      1. Synthesize your answer from the provided "CONTEXT" below. Do not use any external knowledge.
      2. After a sentence or paragraph that uses information from a document, you MUST add a citation in the format \`[Source: document_name.pdf]\`.
      3. If the answer is not in the context, you MUST reply with: "Based on the provided documents, I could not find an answer to this question."

      Here is an example of how to answer:
      ---EXAMPLE CONTEXT---
      Source: science-report.pdf
      Content: The mitochondria is the powerhouse of the cell.
      ---END EXAMPLE CONTEXT---

      QUESTION: "What is the mitochondria?"

      CORRECT ANSWER:
      The mitochondria is the powerhouse of the cell [Source: science-report.pdf].
      
      ---
      Now, use the REAL context below to answer the user's question.
      ---

      ---CONTEXT---
      ${context}
      ---END OF CONTEXT---

      QUESTION: "${question}"

      ANSWER:
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        return `Failed to get response from AI: ${error.message}`;
    }
    return "An unknown error occurred while contacting the AI."
  }
}
