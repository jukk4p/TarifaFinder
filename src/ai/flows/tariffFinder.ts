
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
  
  // 1. Subtotal de potencia
  const subtotalPotencia = (POTENCIA_P1_kW * TARIFA_PP1 + POTENCIA_P2_kW * TARIFA_PP2) * DÍAS_FACTURADOS;

  // 2. Subtotal de energía
  const subtotalEnergia = (ENERGÍA_P1_kWh * TARIFA_EP1 + ENERGÍA_P2_kWh * TARIFA_EP2 + ENERGÍA_P3_kWh * TARIFA_EP3);
  
  // 3. Impuesto eléctrico
  const impuestoElectrico = (subtotalPotencia + subtotalEnergia) * 0.05113;

  // 4. Alquiler del contador
  const alquilerContador = 0.027 * DÍAS_FACTURADOS;

  // 5. Financiación del bono social
  const financiacionBonoSocial = 0.012742 * DÍAS_FACTURADOS;
  
  // 6. Cálculo del IVA
  const baseImponibleIVA = subtotalPotencia + subtotalEnergia + impuestoElectrico + alquilerContador + financiacionBonoSocial;
  const iva = baseImponibleIVA * 0.21;
  
  // 7. Total de la factura
  const totalFactura = baseImponibleIVA + iva;
  
  return Math.round(totalFactura * 100) / 100;
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
        logoUrl: tariff.logoUrl,
        cost: cost,
        potencia_punta_precio: tariff.potencia_punta_precio,
        potencia_valle_precio: tariff.potencia_valle_precio,
        energia_punta_precio: tariff.energia_punta_precio,
        energia_llano_precio: tariff.energia_llano_precio,
        energia_valle_precio: tariff.energia_valle_precio,
        periodos_energia: tariff.periodos_energia,
        commitment: tariff.commitment,
        conditions: tariff.conditions,
      };
    });

    const sortedTariffs = calculatedCosts.sort((a, b) => a.cost - b.cost);
    
    return sortedTariffs;
  }
);

export async function findTariffs(input: TariffInput): Promise<TariffOutput> {
  return tariffFinderFlow(input);
}

    