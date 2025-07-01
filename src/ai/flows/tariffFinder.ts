'use server';

import { ai } from '@/ai/genkit';
import * as z from 'zod';
import { tariffs, type Tariff } from '@/lib/tariffs';

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

function calculateTariffCost(tariff: Tariff, input: TariffInput): number {
  const { 
    dias_facturados,
    potencia_punta_kW_P1,
    potencia_valle_kW_P2,
    energia_punta_kWh_P1,
    energia_llano_kWh_P2,
    energia_valle_kWh_P3
  } = input;

  const costPotencia = (potencia_punta_kW_P1 * tariff.potencia_punta_precio + potencia_valle_kW_P2 * tariff.potencia_valle_precio) * dias_facturados;

  let costEnergia;

  if (tariff.periodos_energia === 1) {
    const totalEnergia = energia_punta_kWh_P1 + energia_llano_kWh_P2 + energia_valle_kWh_P3;
    costEnergia = totalEnergia * tariff.energia_punta_precio; // For 1-period tariffs, all energy prices are the same
  } else {
    costEnergia = (energia_punta_kWh_P1 * tariff.energia_punta_precio) +
                  (energia_llano_kWh_P2 * tariff.energia_llano_precio) +
                  (energia_valle_kWh_P3 * tariff.energia_valle_precio);
  }
  
  // These are constants from the excel file for a 30 day period. We'll scale them.
  const alquilerContadorPorDia = 0.027;
  const financBonoSocialPorDia = 0.01274243;

  const alquilerContador = alquilerContadorPorDia * dias_facturados;
  const financBonoSocial = financBonoSocialPorDia * dias_facturados;
  
  const subtotal = costPotencia + costEnergia;

  // Impuesto eléctrico 5.11% on subtotal, but it was reduced temporarily. Let's use 0.5% as per BOE-A-2023-26442
  // Then it was changed again. Let's stick to the value from the excel which seems to be 5.11% for some calculations.
  // The excel file is a bit of a mess with constants. Let's stick to the simplest calculation first.
  const totalBruto = subtotal + alquilerContador + financBonoSocial;
  const iva = totalBruto * 0.21; // Assuming 21% IVA
  const totalNeto = totalBruto + iva;

  return totalNeto;
}


const tariffFinderFlow = ai.defineFlow(
  {
    name: 'tariffFinderFlow',
    inputSchema: tariffInputSchema,
    outputSchema: tariffOutputSchema,
  },
  async (input) => {
    const calculatedCosts = tariffs.map(tariff => {
      const cost = calculateTariffCost(tariff, input);
      return {
        name: `${tariff.company} ${tariff.name}`,
        cost: cost,
      };
    });

    const sortedTariffs = calculatedCosts.sort((a, b) => a.cost - b.cost);
    
    const top3 = sortedTariffs.slice(0, 3);

    return {
      tarifa_1: top3[0]?.name || null,
      tarifa_2: top3[1]?.name || null,
      tarifa_3: top3[2]?.name || null,
    };
  }
);

export async function findTariffs(input: TariffInput): Promise<TariffOutput> {
  return tariffFinderFlow(input);
}
