'use server';
/**
 * @fileOverview An AI flow to explain tariff recommendations.
 *
 * - explainTariff - A function that generates an explanation for the recommended tariffs.
 * - ExplainTariffInput - The input type for the explainTariff function.
 * - ExplainTariffOutput - The return type for the explainTariff function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { tariffInputSchema, tariffOutputSchema } from './schemas';

const ExplainTariffInputSchema = z.object({
  consumption: tariffInputSchema,
  recommendations: tariffOutputSchema,
});
export type ExplainTariffInput = z.infer<typeof ExplainTariffInputSchema>;

const ExplainTariffOutputSchema = z.object({
  explanation: z.string().describe('A brief, easy-to-understand explanation of the tariff recommendations, written in Spanish.'),
});
export type ExplainTariffOutput = z.infer<typeof ExplainTariffOutputSchema>;


export async function explainTariff(input: ExplainTariffInput): Promise<ExplainTariffOutput> {
  return explainTariffFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainTariffPrompt',
  input: { schema: ExplainTariffInputSchema },
  output: { schema: ExplainTariffOutputSchema },
  prompt: `Eres un experto en tarifas eléctricas de España. Tu objetivo es ayudar a los usuarios a entender por qué se les recomiendan ciertas tarifas.

Analiza los datos de consumo del usuario y las 3 tarifas recomendadas. Luego, genera una explicación breve (2-3 frases) y clara en español.

**Datos de consumo del usuario:**
- Días facturados: {{{consumption.DÍAS_FACTURADOS}}}
- Consumo Punta (P1): {{{consumption.ENERGÍA_P1_kWh}}} kWh
- Consumo Llano (P2): {{{consumption.ENERGÍA_P2_kWh}}} kWh
- Consumo Valle (P3): {{{consumption.ENERGÍA_P3_kWh}}} kWh

**Tarifas recomendadas:**
{{#each recommendations}}
- {{name}} ({{company}}): Coste {{cost}}€
{{/each}}

Basándote en si el usuario consume más en horas punta, llano o valle, explica por qué las tarifas recomendadas son una buena opción. Por ejemplo, si el consumo en valle es alto, menciona que las tarifas con un precio reducido en ese periodo son beneficiosas. Sé amable y directo.`,
});

const explainTariffFlow = ai.defineFlow(
  {
    name: 'explainTariffFlow',
    inputSchema: ExplainTariffInputSchema,
    outputSchema: ExplainTariffOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
