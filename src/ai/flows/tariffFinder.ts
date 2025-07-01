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
  tarifa_1: z.tuple([z.string(), z.string(), z.string(), z.number()]).nullable(),
  tarifa_2: z.tuple([z.string(), z.string(), z.string(), z.number()]).nullable(),
  tarifa_3: z.tuple([z.string(), z.string(), z.string(), z.number()]).nullable(),
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

  const costPotencia = 
      (potencia_punta_kW_P1 * tariff.potencia_punta_precio * dias_facturados) + 
      (potencia_valle_kW_P2 * tariff.potencia_valle_precio * dias_facturados);

  let costEnergia;

  if (tariff.periodos_energia === 1) {
    const totalEnergia = energia_punta_kWh_P1 + energia_llano_kWh_P2 + energia_valle_kWh_P3;
    costEnergia = totalEnergia * tariff.energia_punta_precio; // For 1-period tariffs, all energy prices are the same
  } else {
    costEnergia = (energia_punta_kWh_P1 * tariff.energia_punta_precio) +
                  (energia_llano_kWh_P2 * tariff.energia_llano_precio) +
                  (energia_valle_kWh_P3 * tariff.energia_valle_precio);
  }
  
  const subtotal = costPotencia + costEnergia;

  // Based on the provided spreadsheet, using reduced tax rates to match bot results.
  // Impuesto Eléctrico (IEE) at 0.5%
  const impuestoElectrico = subtotal * 0.005;
  
  // Alquiler contador based on spreadsheet's value (2,40€ for 30 days -> 0.08€/day)
  const alquilerContadorPorDia = 0.08;
  const alquilerContador = alquilerContadorPorDia * dias_facturados;
  
  const baseIVA = subtotal + impuestoElectrico + alquilerContador;
  
  // IVA at 10% as per the spreadsheet's calculation context.
  const iva = baseIVA * 0.10;

  const totalNeto = baseIVA + iva;

  // Special calculation for PVPC tariff based on the provided Excel formula
  // =SI(COINCIDIR(E$17;$A69:$A$72;0)=4;MAX(E55-E57;0);E55)
  // This implies that for the PVPC tariff, the total energy cost (including taxes) is deducted
  // from the final bill, with a floor at 0.
  if (tariff.company === "COMERCIALIZADORAS DE REFERENCIA") {
    const energiaImpuestoElectrico = costEnergia * 0.005;
    const energiaBaseIVA = costEnergia + energiaImpuestoElectrico;
    const energiaIVA = energiaBaseIVA * 0.10;
    const costeEnergiaConImpuestos = energiaBaseIVA + energiaIVA;
    
    const finalCost = Math.max(totalNeto - costeEnergiaConImpuestos, 0);
    return finalCost;
  }

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
        company: tariff.company,
        name: tariff.name,
        url: tariff.url,
        cost: cost,
      };
    });

    const sortedTariffs = calculatedCosts.sort((a, b) => a.cost - b.cost);
    
    const top3 = sortedTariffs.slice(0, 3);
    
    const formatTariff = (tariff: typeof top3[0] | undefined): [string, string, string, number] | null => {
        if (!tariff) return null;
        return [tariff.company, tariff.name, tariff.url, tariff.cost];
    };

    return {
      tarifa_1: formatTariff(top3[0]),
      tarifa_2: formatTariff(top3[1]),
      tarifa_3: formatTariff(top3[2]),
    };
  }
);

export async function findTariffs(input: TariffInput): Promise<TariffOutput> {
  return tariffFinderFlow(input);
}
