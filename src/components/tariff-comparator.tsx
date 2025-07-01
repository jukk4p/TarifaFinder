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
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { useTranslation } from '@/lib/i18n';


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
  const { t } = useTranslation();
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
          {t('results.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-6 text-muted-foreground">
          {t('results.subtitle')}
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
                    {t('results.estimatedCost')}: <span className="font-semibold text-foreground">{cost.toFixed(2)} €</span>
                  </p>
                  {savings !== null && (
                    <p className={`text-sm font-medium ${savings > 0 ? 'text-primary' : 'text-destructive'}`}>
                      {savings > 0 ? `${t('results.estimatedSavings')}: ${savings.toFixed(2)}€` : `${t('results.extraCost')}: ${Math.abs(savings).toFixed(2)}€`}
                    </p>
                  )}
                  <p className="text-muted-foreground">
                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">{t('results.seeOffer')}</a>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
      <CardFooter className="pt-6 border-t border-white/10 mt-6">
        <p className="w-full text-center text-xs text-muted-foreground">
          {t('results.footnote')}
        </p>
      </CardFooter>
    </Card>
  );
};

const ConsumptionChart = ({ data, chartConfig }: { data: { name: string; consumo: number }[], chartConfig: ChartConfig }) => {
  const { t } = useTranslation();
  return (
    <Card className="w-full animate-in fade-in-50 duration-500 bg-card/50 backdrop-blur-sm shadow-xl border-white/10">
      <CardHeader>
        <CardTitle className="text-primary flex items-center gap-2">
          <BarChartIcon className="h-6 w-6" />
          {t('consumption_chart.title')}
        </CardTitle>
        <CardDescription>
          {t('consumption_chart.description')}
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
                  fill={entry.consumo > 0 ? chartConfig[entry.name as keyof typeof chartConfig].color : 'transparent'}
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
  const { t } = useTranslation();
  return (
    <Card className="w-full animate-in fade-in-50 duration-500 bg-card/50 backdrop-blur-sm shadow-xl border-white/10">
      <CardHeader>
        <CardTitle className="text-primary flex items-center gap-2">
          <MessageSquareHeart className="h-6 w-6" />
          {t('explanation.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
           <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin"/>
              <span>{t('explanation.loading')}</span>
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
  const { t, locale } = useTranslation();

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

  const languageMap: Record<string, string> = {
    es: 'Spanish',
    en: 'English',
    ca: 'Catalan'
  };

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

      explainTariff({ consumption: tariffValues, recommendations: result, language: languageMap[locale] })
        .then(explanationResult => {
          setExplanation(explanationResult.explanation);
        })
        .catch(err => {
          console.error("Failed to get tariff explanation:", err);
          setExplanation(t('explanation.error'));
        })
        .finally(() => {
          setExplanationLoading(false);
        });

    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: t('error.title'),
        description: t('error.description'),
      });
      setExplanationLoading(false);
    } finally {
      setLoading(false);
    }
  }
  
  const formFields = [
    { name: "DÍAS_FACTURADOS", label: t('form.daysBilled'), icon: CalendarDays, placeholder: t('form.daysBilledPlaceholder') },
    { name: "POTENCIA_P1_kW", label: t('form.powerPeak'), icon: Zap, placeholder: t('form.powerPeakPlaceholder') },
    { name: "POTENCIA_P2_kW", label: t('form.powerOffPeak'), icon: Zap, placeholder: t('form.powerOffPeakPlaceholder') },
    { name: "ENERGÍA_P1_kWh", label: t('form.energyPeak'), icon: Lightbulb, placeholder: t('form.energyPeakPlaceholder') },
    { name: "ENERGÍA_P2_kWh", label: t('form.energyFlat'), icon: Lightbulb, placeholder: t('form.energyFlatPlaceholder') },
    { name: "ENERGÍA_P3_kWh", label: t('form.energyOffPeak'), icon: Lightbulb, placeholder: t('form.energyOffPeakPlaceholder') },
    { name: "importe_factura_actual", label: t('form.currentBill'), icon: Euro, placeholder: t('form.currentBillPlaceholder') },
  ] as const;

  const chartConfig = {
    consumo: {
      label: "Consumo",
    },
    p1: {
      label: t('consumption_chart.peak'),
      color: "hsl(var(--chart-1))",
    },
    p2: {
      label: t('consumption_chart.flat'),
      color: "hsl(var(--chart-2))",
    },
    p3: {
      label: t('consumption_chart.offpeak'),
      color: "hsl(var(--chart-3))",
    },
  } satisfies ChartConfig;

  return (
    <div className="w-full max-w-4xl space-y-8 py-12">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl lg:text-6xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {t('header')}
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
          {t('subtitle')}
        </p>
      </div>

      <Card className="w-full shadow-lg border-white/10 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>{t('form.title')}</CardTitle>
          <CardDescription>
            {t('form.description')}
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
                    {t('form.calculatingButton')}
                  </>
                ) : (
                  <>
                    <Calculator className="mr-2 h-5 w-5" />
                    {t('form.compareButton')}
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
            <span>{t('form.searching')}</span>
        </div>
      )}

      {results && <ResultsCard results={results} currentBill={currentBill} />}
      
      {chartData && <ConsumptionChart data={chartData} chartConfig={chartConfig} />}

      {(explanation || explanationLoading) && (
        <div className="pt-2 w-full">
          <ExplanationCard explanation={explanation!} loading={explanationLoading} />
        </div>
      )}

      <div className="w-full text-center mt-12 border-t border-white/10 pt-8">
        <p className="text-muted-foreground mb-4">{t('donation.text')}</p>
        <Button asChild>
          <a
            href="https://paypal.me/jukk4p"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Gift className="mr-2 h-5 w-5" />
            {t('donation.button')}
          </a>
        </Button>
      </div>
    </div>
  );
}
