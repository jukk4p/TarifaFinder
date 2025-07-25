import { z } from 'zod';

export const tariffInputSchema = z.object({
  DÍAS_FACTURADOS: z.number(),
  POTENCIA_P1_kW: z.number(),
  POTENCIA_P2_kW: z.number(),
  ENERGÍA_P1_kWh: z.number(),
  ENERGÍA_P2_kWh: z.number(),
  ENERGÍA_P3_kWh: z.number(),
  importe_factura_actual: z.number().optional(),
});

export type TariffInput = z.infer<typeof tariffInputSchema>;

export const tariffOutputSchema = z.array(z.object({
  company: z.string(),
  name: z.string(),
  url: z.string(),
  logoUrl: z.string(),
  cost: z.number(),
  potencia_punta_precio: z.number(),
  potencia_valle_precio: z.number(),
  energia_punta_precio: z.number(),
  energia_llano_precio: z.number(),
  energia_valle_precio: z.number(),
  periodos_energia: z.number(),
}));

export type TariffOutput = z.infer<typeof tariffOutputSchema>;
