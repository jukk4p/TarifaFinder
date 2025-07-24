'use server';
/**
 * @fileOverview A flow for interacting with a document analysis agent.
 *
 * - chatWithAgent - A function that sends a message to the agent and gets a response.
 * - ChatWithAgentInput - The input type for the chatWithAgent function.
 * - ChatWithAgentOutput - The return type for the chatWithAgent function.
 */
import { ai } from '@/ai/genkit';
import { extractDataFromLlamaCloud } from '@/ai/tools/dataExtractorTool';
import { z } from 'zod';

const ChatWithAgentInputSchema = z.object({
  message: z.string().describe('The user\'s message to the agent.'),
});
export type ChatWithAgentInput = z.infer<typeof ChatWithAgentInputSchema>;

const ChatWithAgentOutputSchema = z.object({
  response: z.string().describe('The agent\'s response to the user.'),
});
export type ChatWithAgentOutput = z.infer<typeof ChatWithAgentOutputSchema>;

export async function chatWithAgent(input: ChatWithAgentInput): Promise<ChatWithAgentOutput> {
  return documentAgentFlow(input);
}

const agentPrompt = ai.definePrompt({
    name: 'documentAgentPrompt',
    input: { schema: ChatWithAgentInputSchema },
    output: { schema: ChatWithAgentOutputSchema },
    system: `You are an expert document analysis assistant. 
    If the user asks a question about a document, use the extractDataFromLlamaCloud tool to get the relevant information.
    Answer the user's question based on the data provided by the tool. Be concise and helpful.`,
    tools: [extractDataFromLlamaCloud],
});

const documentAgentFlow = ai.defineFlow(
  {
    name: 'documentAgentFlow',
    inputSchema: ChatWithAgentInputSchema,
    outputSchema: ChatWithAgentOutputSchema,
  },
  async (input) => {
    const llmResponse = await agentPrompt(input);
    return {
      response: llmResponse.output?.response ?? "I'm sorry, I couldn't process that request.",
    };
  }
);
