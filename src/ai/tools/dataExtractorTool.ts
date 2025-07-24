'use server';
/**
 * @fileOverview A Genkit tool for extracting data from LlamaCloud.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { callLlamaCloud } from '@/services/llamaCloudService';

export const extractDataFromLlamaCloud = ai.defineTool(
  {
    name: 'extractDataFromLlamaCloud',
    description: 'Extracts information from a document using the LlamaCloud API based on a user query.',
    inputSchema: z.object({
      query: z.string().describe('The specific question or query to ask about the document.'),
    }),
    outputSchema: z.string().describe('The extracted data or answer from LlamaCloud.'),
  },
  async (input) => {
    // In a real application, you might pass a document ID or other context.
    // For this example, we're just passing the query.
    return await callLlamaCloud(input.query);
  }
);
