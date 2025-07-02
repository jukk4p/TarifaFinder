'use server';

import { ai } from '@/ai/genkit';
import { tariffs, type Tariff } from '@/lib/tariffs';
import { tariffInputSchema, tariffOutputSchema, type TariffInput, type TariffOutput } from './schemas';

function calculateTariffCost(tariff: Tariff, input: TariffInput): number {
  const { 
    DÍAS_FACTURADOS,
    POTENCIA_P1_kW,
    POTENCIA_P2_kW,
    ENERGÍA_P1_kWh,
    ENERGÍA_P2_kWh,
    ENERGÍA_P3_kWh
  } = input;

  const TARIFA_PP1 = tariff.potencia_punta_precio;
  const TARIFA_PP2 = tariff.potencia_valle_precio;
  const TARIFA_EP1 = tariff.energia_punta_precio;
  const TARIFA_EP2 = tariff.energia_llano_precio;
  const TARIFA_EP3 = tariff.energia_valle_precio;
  
  // 3. Termino de potencia
  const termPot = (POTENCIA_P1_kW * TARIFA_PP1 + POTENCIA_P2_kW * TARIFA_PP2) * DÍAS_FACTURADOS;

  // 4. Término de energía
  const termEner = (ENERGÍA_P1_kWh * TARIFA_EP1 + ENERGÍA_P2_kWh * TARIFA_EP2 + ENERGÍA_P3_kWh * TARIFA_EP3);
  
  const subTotalTerminos = termPot + termEner;
  const IMP_ELEC = subTotalTerminos * 0.0511;

  const ALQUILER = 0.027 * DÍAS_FACTURADOS;
  const BONO_SOC = 0.012742 * DÍAS_FACTURADOS;
  
  const baseIVA = subTotalTerminos + IMP_ELEC + ALQUILER + BONO_SOC;
  const IVA = baseIVA * 0.21;
  const FACTURA = baseIVA + IVA;
  
  return Math.round(FACTURA * 100) / 100;
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
        permanencia: tariff.permanencia,
      };
    });

    const sortedTariffs = calculatedCosts.sort((a, b) => a.cost - b.cost);
    
    const top3 = sortedTariffs.slice(0, 3);
    
    return top3;
  }
);

export async function findTariffs(input: TariffInput): Promise<TariffOutput> {
  return tariffFinderFlow(input);
}
