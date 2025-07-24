'use server';
/**
 * @fileOverview A flow for extracting structured data from a document using a LlamaCloud agent.
 *
 * - extractWithLlamaCloud - The main function that orchestrates the extraction process.
 * - ExtractWithLlamaCloudInput - The input type for the function.
 * - ExtractWithLlamaCloudOutput - The return type for the function.
 */
import { ai } from '@/ai/genkit';
import { callLlamaCloudExtractor } from '@/services/llamaCloudService';
import { z } from 'zod';

const ExtractWithLlamaCloudInputSchema = z.object({
  document: z
    .string()
    .describe(
      "A document (e.g., PDF, image) as a data URI that must include a MIME type and use Base64 encoding."
    ),
});
export type ExtractWithLlamaCloudInput = z.infer<typeof ExtractWithLlamaCloudInputSchema>;

const ExtractWithLlamaCloudOutputSchema = z.object({
  data: z.any().describe('The structured data extracted from the document.'),
});
export type ExtractWithLlamaCloudOutput = z.infer<typeof ExtractWithLlamaCloudOutputSchema>;

export async function extractWithLlamaCloud(input: ExtractWithLlamaCloudInput): Promise<ExtractWithLlamaCloudOutput> {
  return extractWithLlamaCloudFlow(input);
}

const extractWithLlamaCloudFlow = ai.defineFlow(
  {
    name: 'extractWithLlamaCloudFlow',
    inputSchema: ExtractWithLlamaCloudInputSchema,
    outputSchema: ExtractWithLlamaCloudOutputSchema,
  },
  async ({ document }) => {
    
    // Call the service that encapsulates the multi-step LlamaCloud API process
    const extractedData = await callLlamaCloudExtractor(document);
    
    return {
      data: extractedData,
    };
  }
);
