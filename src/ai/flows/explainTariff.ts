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
  language: z.string().describe('The language for the explanation (e.g., "Spanish", "English", "Catalan").'),
});
export type ExplainTariffInput = z.infer<typeof ExplainTariffInputSchema>;

const ExplainTariffOutputSchema = z.object({
  explanation: z.string().describe('A detailed, friendly, and helpful explanation of the tariff recommendations, written in the requested language. It should analyze the user\'s consumption pattern and provide actionable advice.'),
});
export type ExplainTariffOutput = z.infer<typeof ExplainTariffOutputSchema>;


export async function explainTariff(input: ExplainTariffInput): Promise<ExplainTariffOutput> {
  return explainTariffFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainTariffPrompt',
  input: { schema: ExplainTariffInputSchema },
  output: { schema: ExplainTariffOutputSchema },
  prompt: `Eres un asesor energético experto, amable y didáctico. Tu objetivo es ayudar a los usuarios a entender sus resultados y a ahorrar en su factura de la luz.

**Tarea:**
Analiza los datos de consumo del usuario y las tarifas recomendadas para generar un análisis personalizado y útil en el idioma solicitado: {{{language}}}.

**Formato de respuesta (explanation):**
1.  **Análisis del Consumo (1-2 frases):** Empieza analizando el perfil de consumo del usuario. Identifica en qué periodo (Punta, Llano o Valle) tiene el mayor consumo y menciónalo.
2.  **Justificación de las Tarifas (1-2 frases):** Explica por qué las tarifas recomendadas son una buena opción para ese perfil. Por ejemplo, "Dado que tu mayor consumo es en horas valle, la tarifa '{{recommendations.[0].name}}' de {{recommendations.[0].company}} te beneficia con precios muy bajos en ese periodo". Si las tarifas son de precio fijo, explica la ventaja de la estabilidad.
3.  **Consejo de Optimización (1-2 frases):** Ofrece un consejo práctico y accionable para que el usuario pueda ahorrar aún más. Por ejemplo, "Para maximizar tu ahorro, intenta programar electrodomésticos como la lavadora o el lavavajillas durante las horas valle (de 00h a 08h)".
4.  **Tono:** Usa un tono cercano, positivo y alentador.

**Datos de consumo del usuario:**
- Días facturados: {{{consumption.DÍAS_FACTURADOS}}}
- Consumo Punta (P1): {{{consumption.ENERGÍA_P1_kWh}}} kWh
- Consumo Llano (P2): {{{consumption.ENERGÍA_P2_kWh}}} kWh
- Consumo Valle (P3): {{{consumption.ENERGÍA_P3_kWh}}} kWh

**Tarifas recomendadas:**
{{#each recommendations}}
- {{name}} ({{company}}): Coste {{cost}}€
{{/each}}

Genera la respuesta en el campo 'explanation'. No te presentes como una IA.`,
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
