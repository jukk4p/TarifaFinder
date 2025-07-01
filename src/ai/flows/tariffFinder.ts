'use server';

import { ai } from '@/ai/genkit';
import * as z from 'zod';

const tariffInputSchema = z.object({
  dias_facturados: z.number(),
  potencia_punta_kW_P1: z.number(),
  potencia_valle_kW_P2: z.number(),
  energia_punta_kWh_P1: z.number(),
  energia_llano_kWh_P2: z.number(),
  energia_valle_kWh_P3: z.number(),
});

const tariffOutputSchema = z.object({
  tarifa_1: z.string().nullable(),
  tarifa_2: z.string().nullable(),
  tarifa_3: z.string().nullable(),
});

export type TariffInput = z.infer<typeof tariffInputSchema>;
export type TariffOutput = z.infer<typeof tariffOutputSchema>;

const tariffFinderFlow = ai.defineFlow(
  {
    name: 'tariffFinderFlow',
    inputSchema: tariffInputSchema,
    outputSchema: tariffOutputSchema,
  },
  async (input) => {
    // Simulate waiting for Google Sheets to update and recalculate
    await new Promise(resolve => setTimeout(resolve, 2500));

    // This is a mocked response that simulates reading the results from the sheet.
    // In a real scenario, this would involve Google Sheets API calls.
    console.log("Received input for comparison:", input);
    
    return {
      tarifa_1: "Tarifa Sol y Sombra",
      tarifa_2: "Tarifa EcoLuz",
      tarifa_3: "Tarifa AhorroMax",
    };
  }
);

export async function findTariffs(input: TariffInput): Promise<TariffOutput> {
  return tariffFinderFlow(input);
}
