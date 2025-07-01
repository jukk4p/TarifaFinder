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
    DÍAS_FACTURADOS: z.number().optional().describe('Número total de días en el periodo de facturación. Si no está explícito, calcúlalo a partir de la fecha de inicio y fin del periodo. Busca "Nº días", "Periodo de facturación", "Días facturados".'),
    POTENCIA_P1_kW: z.number().optional().describe('Potencia contratada para el periodo Punta (P1) en kW. Es el valor principal de potencia contratada. Busca "Potencia Punta", "Potencia P1", "Término de potencia P1", "Potencia contratada Punta", o simplemente "Potencia contratada" si solo hay una.'),
    POTENCIA_P2_kW: z.number().optional().describe('Potencia contratada para el periodo Valle (P2) en kW. A menudo es igual a P1. Busca "Potencia Valle", "Potencia P2", "Término de potencia P2", o "Potencia contratada Valle". Si no se especifica, usa el mismo valor que POTENCIA_P1_kW.'),
    ENERGÍA_P1_kWh: z.number().optional().describe('Consumo de energía en el periodo Punta (P1) en kWh. Busca "Energía Punta", "Consumo P1", "Energía facturada Punta", "Término de energía P1", o similar.'),
    ENERGÍA_P2_kWh: z.number().optional().describe('Consumo de energía en el periodo Llano (P2) en kWh. Busca "Energía Llano", "Consumo P2", "Energía facturada Llano", "Término de energía P2", o similar.'),
    ENERGÍA_P3_kWh: z.number().optional().describe('Consumo de energía en el periodo Valle (P3) en kWh. Busca "Energía Valle", "Consumo P3", "Energía facturada Valle", "Término de energía P3", o similar.'),
});
export type ExtractFromBillOutput = z.infer<typeof ExtractFromBillOutputSchema>;

export async function extractFromBill(input: ExtractFromBillInput): Promise<ExtractFromBillOutput> {
  return extractFromBillFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractFromBillPrompt',
  input: { schema: ExtractFromBillInputSchema },
  output: { schema: ExtractFromBillOutputSchema },
  prompt: `You are an expert system for processing Spanish electricity bills. Your task is to analyze the provided document and extract ONLY the following values. Be extremely precise.
- The output MUST be a valid JSON object matching the requested schema.
- Use a dot as the decimal separator and return only numbers for numerical fields. Do not include units like 'kW' or 'kWh' in the output values.
- If you cannot find a specific value with high confidence, DO NOT include it in the output. Do not guess or calculate values unless explicitly told to.
- Prioritize semantic recognition over visual format. The terms can appear in different orders.

Extract these fields based on common Spanish terms:
- DÍAS_FACTURADOS: Find the total number of days in the billing period. Look for "Nº días" or "Días facturados". If not present, you can calculate it from "Periodo de facturación" start and end dates.
- POTENCIA_P1_kW: Find contracted peak power ("Potencia Punta", "Potencia P1", "Término de potencia P1", "Potencia contratada Punta") in kW. This is the main contracted power.
- POTENCIA_P2_kW: Find contracted off-peak power ("Potencia Valle", "Potencia P2", "Término de potencia P2", "Potencia contratada Valle") in kW. If only one contracted power is listed, use that same value for POTENCIA_P2_kW.
- ENERGÍA_P1_kWh: Find energy consumption for the peak period ("Energía Punta", "Consumo P1", "Energía facturada Punta", "Término de energía P1") in kWh.
- ENERGÍA_P2_kWh: Find energy consumption for the flat period ("Energía Llano", "Consumo P2", "Energía facturada Llano", "Término de energía P2") in kWh.
- ENERGÍA_P3_kWh: Find energy consumption for the off-peak period ("Energía Valle", "Consumo P3", "Energía facturada Valle", "Término de energía P3") in kWh.

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
