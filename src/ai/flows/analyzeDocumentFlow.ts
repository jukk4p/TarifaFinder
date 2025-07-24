'use server';
/**
 * @fileOverview A flow for analyzing a document with an instruction.
 *
 * - analyzeDocument - A function that takes a document and an instruction for an AI agent.
 * - AnalyzeDocumentInput - The input type for the analyzeDocument function.
 * - AnalyzeDocumentOutput - The return type for the analyzeDocument function.
 */
import { ai } from '@/ai/genkit';
import { callLlamaCloud } from '@/services/llamaCloudService';
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
    // In a real scenario, you might pass the document to a tool
    // that uploads it and gets an ID, then passes the ID and instruction to LlamaCloud.
    // For now, we simulate this by calling our service directly.
    const analysisResult = await callLlamaCloud(instruction, document);

    return {
      analysis: analysisResult,
    };
  }
);
