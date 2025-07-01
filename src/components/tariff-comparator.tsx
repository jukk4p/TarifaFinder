"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { findTariffs } from '@/ai/flows/tariffFinder';
import { explainTariff } from '@/ai/flows/explainTariff';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Zap, Lightbulb, CalendarDays, Calculator, Sparkles, Gift, Euro, MessageSquareHeart, BarChart as BarChartIcon } from 'lucide-react';
import type { TariffInput, TariffOutput } from '@/ai/flows/schemas';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, LabelList, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"


const formSchema = z.object({
  DÍAS_FACTURADOS: z.coerce.number().int().positive("Debe ser un número positivo"),
  POTENCIA_P1_kW: z.coerce.number().positive("Debe ser un número positivo"),
  POTENCIA_P2_kW: z.coerce.number().positive("Debe ser un número positivo"),
  ENERGÍA_P1_kWh: z.coerce.number().positive("Debe ser un número positivo"),
  ENERGÍA_P2_kWh: z.coerce.number().positive("Debe ser un número positivo"),
  ENERGÍA_P3_kWh: z.coerce.number().positive("Debe ser un número positivo"),
  importe_factura_actual: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.coerce.number().positive("Debe ser un número positivo").optional()
  ),
});

type FormInput = z.infer<typeof formSchema>;
type TariffResults = TariffOutput;

const ResultsCard = ({ results, currentBill }: { results: TariffResults, currentBill?: number }) => {
  const tariffs = results;
  const numberEmojis = ["1️⃣", "2️⃣", "3️⃣"];

  if (tariffs.length === 0) {
    return null;
  }

  return (
    <Card className="w-full animate-in fade-in-50 duration-500 bg-card/50 backdrop-blur-sm shadow-xl border-white/10">
      <CardHeader>
        <CardTitle className="text-accent flex items-center gap-2">
          <Sparkles className="h-6 w-6" />
          Tus Mejores Ofertas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-6 text-muted-foreground">
          Según los datos que has facilitado, estas son las tres ofertas más económicas:
        </p>
        <div className="space-y-6">
          {tariffs.map(({ company, name, url, cost }, index) => {
            const savings = currentBill && currentBill > 0 ? currentBill - cost : null;
            return (
              <div key={index}>
                <p className="font-semibold text-lg flex items-start">
                  <span className="mr-3 text-2xl">{numberEmojis[index]}</span>
                  <span className="mt-1">{company} - {name}</span>
                </p>
                <div className="pl-10 space-y-1 mt-1">
                  <p className="text-muted-foreground">
                    Coste estimado: <span className="font-semibold text-foreground">{cost.toFixed(2)} €</span>
                  </p>
                  {savings !== null && (
                    <p className={`text-sm font-medium ${savings > 0 ? 'text-primary' : 'text-destructive'}`}>
                      {savings > 0 ? `Ahorro estimado: ${savings.toFixed(2)}€` : `Coste extra: ${Math.abs(savings).toFixed(2)}€`}
                    </p>
                  )}
                  <p className="text-muted-foreground">
                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">(Ver oferta)</a>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
      <CardFooter className="pt-6 border-t border-white/10 mt-6">
        <p className="w-full text-center text-xs text-muted-foreground">
          📌 El importe incluye término de potencia y de energía para el período indicado.
        </p>
      </CardFooter>
    </Card>
  );
};

const chartConfig = {
  consumo: {
    label: "Consumo",
  },
  p1: {
    label: "Punta",
    color: "hsl(var(--chart-1))",
  },
  p2: {
    label: "Llano",
    color: "hsl(var(--chart-2))",
  },
  p3: {
    label: "Valle",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;


const ConsumptionChart = ({ data }: { data: { name: keyof typeof chartConfig; consumo: number }[] }) => {
  return (
    <Card className="w-full animate-in fade-in-50 duration-500 bg-card/50 backdrop-blur-sm shadow-xl border-white/10">
      <CardHeader>
        <CardTitle className="text-primary flex items-center gap-2">
          <BarChartIcon className="h-6 w-6" />
          Tu Distribución de Consumo
        </CardTitle>
        <CardDescription>
          Este gráfico muestra cómo se reparte tu consumo en los diferentes periodos.
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-0">
        <ChartContainer config={chartConfig} className="h-[150px] w-full">
          <BarChart
            accessibilityLayer
            data={data}
            layout="vertical"
            margin={{ left: 10, right: 50 }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              width={60}
              tickFormatter={(value) => chartConfig[value as keyof typeof chartConfig]?.label}
            />
            <XAxis dataKey="consumo" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" hideLabel />}
            />
            <Bar dataKey="consumo" layout="vertical" radius={5}>
              <LabelList
                dataKey="consumo"
                position="right"
                offset={8}
                className="fill-foreground font-semibold"
                fontSize={12}
                formatter={(value: number) => `${value} kWh`}
              />
              {data.map((entry) => (
                <Cell
                  key={`cell-${entry.name}`}
                  fill={entry.consumo > 0 ? chartConfig[entry.name].color : 'transparent'}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};


const ExplanationCard = ({ explanation, loading }: { explanation: string, loading: boolean }) => {
  return (
    <Card className="w-full animate-in fade-in-50 duration-500 bg-card/50 backdrop-blur-sm shadow-xl border-white/10">
      <CardHeader>
        <CardTitle className="text-primary flex items-center gap-2">
          <MessageSquareHeart className="h-6 w-6" />
          Análisis Personalizado
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
           <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin"/>
              <span>Generando análisis...</span>
           </div>
        ) : (
          <p className="text-muted-foreground whitespace-pre-wrap">{explanation}</p>
        )}
      </CardContent>
    </Card>
  );
};


export function TariffComparator() {
  const [loading, setLoading] = useState(false);
  const [explanationLoading, setExplanationLoading] = useState(false);
  const [results, setResults] = useState<TariffResults | null>(null);
  const [chartData, setChartData] = useState<any[] | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      DÍAS_FACTURADOS: 30,
      POTENCIA_P1_kW: 4.6,
      POTENCIA_P2_kW: 4.6,
      ENERGÍA_P1_kWh: 100,
      ENERGÍA_P2_kWh: 150,
      ENERGÍA_P3_kWh: 200,
      importe_factura_actual: '',
    },
  });

  const currentBill = form.watch("importe_factura_actual");

  async function onSubmit(values: FormInput) {
    setLoading(true);
    setResults(null);
    setChartData(null);
    setExplanation(null);
    setExplanationLoading(true);

    try {
      const { importe_factura_actual, ...tariffValues } = values;
      const result = await findTariffs(tariffValues);
      setResults(result);

      const consumptionDataForChart = [
        { name: 'p1', consumo: values.ENERGÍA_P1_kWh },
        { name: 'p2', consumo: values.ENERGÍA_P2_kWh },
        { name: 'p3', consumo: values.ENERGÍA_P3_kWh },
      ].sort((a,b) => b.consumo - a.consumo);

      setChartData(consumptionDataForChart);

      explainTariff({ consumption: tariffValues, recommendations: result })
        .then(explanationResult => {
          setExplanation(explanationResult.explanation);
        })
        .catch(err => {
          console.error("Failed to get tariff explanation:", err);
          setExplanation("No se pudo generar el análisis personalizado en este momento.");
        })
        .finally(() => {
          setExplanationLoading(false);
        });

    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo completar la comparación. Inténtalo de nuevo.",
      });
      setExplanationLoading(false);
    } finally {
      setLoading(false);
    }
  }
  
  const formFields = [
    { name: "DÍAS_FACTURADOS", label: "Días facturados", icon: CalendarDays, placeholder: "e.g., 30" },
    { name: "POTENCIA_P1_kW", label: "Potencia Punta (kW) P1", icon: Zap, placeholder: "e.g., 4.6" },
    { name: "POTENCIA_P2_kW", label: "Potencia Valle (kW) P2", icon: Zap, placeholder: "e.g., 4.6" },
    { name: "ENERGÍA_P1_kWh", label: "Energía Punta (kWh) P1", icon: Lightbulb, placeholder: "e.g., 100" },
    { name: "ENERGÍA_P2_kWh", label: "Energía Llano (kWh) P2", icon: Lightbulb, placeholder: "e.g., 150" },
    { name: "ENERGÍA_P3_kWh", label: "Energía Valle (kWh) P3", icon: Lightbulb, placeholder: "e.g., 200" },
    { name: "importe_factura_actual", label: "Importe factura actual (€) (Opcional)", icon: Euro, placeholder: "e.g., 75.50" },
  ] as const;

  return (
    <div className="w-full max-w-4xl space-y-8 py-12">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl lg:text-6xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          TarifaFinder
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
          Introduce tu consumo y encuentra la tarifa eléctrica más barata para ti.
        </p>
      </div>

      <Card className="w-full shadow-lg border-white/10 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Introduce tus datos de consumo</CardTitle>
          <CardDescription>
            Rellena los campos con los datos de tu última factura para obtener una comparación precisa.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {formFields.map(item => (
                  <FormField
                    key={item.name}
                    control={form.control}
                    name={item.name}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-muted-foreground">
                          <item.icon className="h-4 w-4 text-primary" />
                          {item.label}
                        </FormLabel>
                        <FormControl>
                          <Input type="number" step="0.1" placeholder={item.placeholder} {...field} className="bg-background/80" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={loading} className="w-full" size="lg">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Calculando...
                  </>
                ) : (
                  <>
                    <Calculator className="mr-2 h-5 w-5" />
                    Comparar Tarifas
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      
      {loading && (
        <div className="flex items-center justify-center gap-2 text-muted-foreground animate-pulse pt-4">
            <Loader2 className="h-5 w-5 animate-spin"/>
            <span>Buscando las mejores ofertas...</span>
        </div>
      )}

      {results && <ResultsCard results={results} currentBill={currentBill} />}
      
      {chartData && <ConsumptionChart data={chartData} />}

      {(explanation || explanationLoading) && (
        <div className="pt-2 w-full">
          <ExplanationCard explanation={explanation!} loading={explanationLoading} />
        </div>
      )}

      <div className="w-full text-center mt-12 border-t border-white/10 pt-8">
        <p className="text-muted-foreground mb-4">Si esta herramienta te resulta útil, considera hacer una donación.</p>
        <Button asChild>
          <a
            href="https://paypal.me/jukk4p"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Gift className="mr-2 h-5 w-5" />
            Invítame a un café en PayPal
          </a>
        </Button>
      </div>
    </div>
  );
}
