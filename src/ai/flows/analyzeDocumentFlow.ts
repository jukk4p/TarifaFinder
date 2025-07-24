'use server';
/**
 * @fileOverview A flow for analyzing a document with an instruction.
 *
 * - analyzeDocument - A function that takes a document and an instruction for an AI agent.
 * - AnalyzeDocumentInput - The input type for the analyzeDocument function.
 * - AnalyzeDocumentOutput - The return type for the analyzeDocument function.
 */
import { ai } from '@/ai/genkit';
import { callLlamaParse } from '@/services/llamaCloudService';
import { z } from 'zod';

const AnalyzeDocumentInputSchema = z.object({
  document: z
    .string()
    .describe(
      "A document (e.g., PDF, image) as a data URI that must include a MIME type and use Base64 encoding."
    ),
  instruction: z.string().describe('The user\'s instruction on what to do with the document.'),
});
export type AnalyzeDocumentInput = z.infer<typeof AnalyzeDocumentInputSchema>;

const AnalyzeDocumentOutputSchema = z.object({
  analysis: z.string().describe('The result of the document analysis.'),
});
export type AnalyzeDocumentOutput = z.infer<typeof AnalyzeDocumentOutputSchema>;

export async function analyzeDocument(input: AnalyzeDocumentInput): Promise<AnalyzeDocumentOutput> {
  return analyzeDocumentFlow(input);
}


const analyzeDocumentFlow = ai.defineFlow(
  {
    name: 'analyzeDocumentFlow',
    inputSchema: AnalyzeDocumentInputSchema,
    outputSchema: AnalyzeDocumentOutputSchema,
  },
  async ({ document, instruction }) => {
    
    // Step 1: Parse the document using LlamaParse
    // This flow is currently not used, but kept for potential future use.
    // The active flow for LlamaCloud is extractWithLlamaCloud.ts
    const parsedText = "This flow is not currently connected to a UI component.";

    // Step 2: Send the parsed text and the instruction to the AI model
    const prompt = `You are an expert document analyst. A user has uploaded a document and provided an instruction.
    
    Document Content (in Markdown):
    ---
    ${parsedText}
    ---

    User's Instruction:
    "${instruction}"

    Please provide a clear and concise response based on the document content and the user's instruction.`;

    const { text } = await ai.generate({
      prompt: prompt,
    });
    
    return {
      analysis: text,
    };
  }
);
