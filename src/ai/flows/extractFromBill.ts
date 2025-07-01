'use server';
/**
 * @fileOverview An AI flow to extract data from an electricity bill.
 *
 * - extractFromBill - A function that handles the bill data extraction process.
 * - ExtractFromBillInput - The input type for the extractFromBill function.
 * - ExtractFromBillOutput - The return type for the extractFromBill function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ExtractFromBillInputSchema = z.object({
  billDataUri: z
    .string()
    .describe(
      "An image or PDF of a Spanish electricity bill, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractFromBillInput = z.infer<typeof ExtractFromBillInputSchema>;

const ExtractFromBillOutputSchema = z.object({
    DÍAS_FACTURADOS: z.number().optional().describe('El número total de días en el periodo de facturación.'),
    POTENCIA_P1_kW: z.number().optional().describe('La potencia contratada para el periodo Punta (P1) en kW. Busca términos como "Potencia contratada Punta" o similar.'),
    POTENCIA_P2_kW: z.number().optional().describe('La potencia contratada para el periodo Valle (P2) en kW. Busca términos como "Potencia contratada Valle" o similar.'),
    ENERGÍA_P1_kWh: z.number().optional().describe('El consumo de energía en el periodo Punta (P1) en kWh. Busca términos como "Energía Punta", "Consumo P1" o similar.'),
    ENERGÍA_P2_kWh: z.number().optional().describe('El consumo de energía en el periodo Llano (P2) en kWh. Busca términos como "Energía Llano", "Consumo P2" o similar.'),
    ENERGÍA_P3_kWh: z.number().optional().describe('El consumo de energía en el periodo Valle (P3) en kWh. Busca términos como "Energía Valle", "Consumo P3" o similar.'),
});
export type ExtractFromBillOutput = z.infer<typeof ExtractFromBillOutputSchema>;

export async function extractFromBill(input: ExtractFromBillInput): Promise<ExtractFromBillOutput> {
  return extractFromBillFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractFromBillPrompt',
  input: { schema: ExtractFromBillInputSchema },
  output: { schema: ExtractFromBillOutputSchema },
  prompt: `You are an expert OCR system specialized in reading Spanish electricity bills. Your task is to analyze the provided document (image or PDF) and extract the following specific values. Be extremely precise. Use a dot as the decimal separator. If a value is not found, do not include it in the output.

- DÍAS_FACTURADOS: Find the billing period in days ("Días facturados").
- POTENCIA_P1_kW: Find the contracted peak power ("Potencia Punta" or "P1") in kW.
- POTENCIA_P2_kW: Find the contracted off-peak power ("Potencia Valle" or "P2") in kW.
- ENERGÍA_P1_kWh: Find the energy consumption for the peak period ("Energía Punta", "Consumo P1") in kWh.
- ENERGÍA_P2_kWh: Find the energy consumption for the flat period ("Energía Llano", "Consumo P2") in kWh.
- ENERGÍA_P3_kWh: Find the energy consumption for the off-peak period ("Energía Valle", "Consumo P3") in kWh.

Here is the bill: {{media url=billDataUri}}`,
});


const extractFromBillFlow = ai.defineFlow(
  {
    name: 'extractFromBillFlow',
    inputSchema: ExtractFromBillInputSchema,
    outputSchema: ExtractFromBillOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
        throw new Error("AI failed to extract data from the bill.");
    }
    return output;
  }
);
