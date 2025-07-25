'use server';
/**
 * @fileOverview An AI flow to extract structured data from an electricity bill document.
 *
 * - extractBillData - A function that takes a document and extracts consumption data.
 * - ExtractBillDataInput - The input type for the extractBillData function.
 * - ExtractBillDataOutput - The return type for the extractBillData function (matches TariffInput).
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { tariffInputSchema } from './schemas';

const ExtractBillDataInputSchema = z.object({
  billDocument: z
    .string()
    .describe(
      "A photo or PDF of an electricity bill, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
});
export type ExtractBillDataInput = z.infer<typeof ExtractBillDataInputSchema>;

// The output is the same as the tariff input schema
export type ExtractBillDataOutput = z.infer<typeof tariffInputSchema>;

export async function extractBillData(input: ExtractBillDataInput): Promise<ExtractBillDataOutput> {
  return extractBillDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractBillDataPrompt',
  input: { schema: ExtractBillDataInputSchema },
  output: { schema: tariffInputSchema },
  prompt: `You are an expert electricity bill analyst. Your task is to extract the following specific information from the provided bill document and return it as a structured JSON object.

You must extract the exact values as they appear in the document for each of the energy periods. Do not calculate or estimate them. If a specific value for an energy period is not found, use 0.

- DÍAS_FACTURADOS: The total number of billed days.
- POTENCIA_P1_kW: The contracted peak power (Potencia Punta) in kW.
- POTENCIA_P2_kW: The contracted off-peak power (Potencia Valle) in kW. If only one power value is present, use it for both P1 and P2.
- ENERGÍA_P1_kWh: The exact energy consumed in the peak period (Punta) in kWh as it appears on the bill.
- ENERGÍA_P2_kWh: The exact energy consumed in the flat period (Llano) in kWh as it appears on the bill.
- ENERGÍA_P3_kWh: The exact energy consumed in the off-peak period (Valle) in kWh as it appears on the bill.
- importe_factura_actual: The total amount of the bill ("Total Importe Factura"). If it's not found, do not include this field.

Carefully analyze the document to find each value. If a value is not explicitly found, return 0 for that field.

Document: {{media url=billDocument}}`,
});

const extractBillDataFlow = ai.defineFlow(
  {
    name: 'extractBillDataFlow',
    inputSchema: ExtractBillDataInputSchema,
    outputSchema: tariffInputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('The AI model failed to extract data from the document.');
    }
    return output;
  }
);
