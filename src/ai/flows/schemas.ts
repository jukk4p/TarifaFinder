import { z } from 'zod';

export const tariffInputSchema = z.object({
  DÍAS_FACTURADOS: z.number(),
  POTENCIA_P1_kW: z.number(),
  POTENCIA_P2_kW: z.number(),
  ENERGÍA_P1_kWh: z.number(),
  ENERGÍA_P2_kWh: z.number(),
  ENERGÍA_P3_kWh: z.number(),
});

export type TariffInput = z.infer<typeof tariffInputSchema>;

export const tariffOutputSchema = z.array(z.object({
  company: z.string(),
  name: z.string(),
  url: z.string(),
  cost: z.number(),
  permanencia: z.string().optional(),
}));

export type TariffOutput = z.infer<typeof tariffOutputSchema>;
