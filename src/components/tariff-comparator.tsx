
"use client";

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { findTariffs } from '@/ai/flows/tariffFinder';
import { explainTariff } from '@/ai/flows/explainTariff';
import { extractBillData } from '@/ai/flows/extractBillDataFlow';
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
import { Loader2, Zap, Lightbulb, CalendarDays, Calculator, Sparkles, Euro, MessageSquareHeart, PieChart as PieChartIcon, PiggyBank, ExternalLink, UploadCloud, ChevronDown, TrendingUp, Info } from 'lucide-react';
import type { TariffInput, TariffOutput } from '@/ai/flows/schemas';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { useTranslation } from '@/lib/i18n';
import { analytics, performance } from '@/lib/firebase';
import { logEvent } from 'firebase/analytics';
import { trace } from 'firebase/performance';
import { useMemo } from 'react';
import Image from 'next/image';
import { AgentChatDialog } from './agent-chat-dialog';
import { Separator } from './ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';

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

const TariffResultCard = ({ tariff, currentBill, isBestOption }: { tariff: TariffOutput[0], currentBill?: number, isBestOption: boolean }) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const savings = currentBill && currentBill > 0 ? currentBill - tariff.cost : null;

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className={`w-full rounded-lg transition-all duration-300 ${isBestOption ? 'shadow-primary/20 shadow-2xl' : ''}`}>
            <Card className={`relative flex flex-col bg-card/50 backdrop-blur-sm shadow-xl border-white/10 ${isBestOption ? 'border-primary' : ''}`}>
                <CardHeader className="text-center items-center pb-4">
                    <div className="w-24 h-12 relative mb-4">
                        <Image 
                            src={tariff.logoUrl} 
                            alt={`Logo de ${tariff.company}`} 
                            fill
                            className="object-contain"
                            sizes="(max-width: 768px) 20vw, 10vw"
                        />
                    </div>
                    <CardTitle className="text-lg font-semibold">{tariff.name}</CardTitle>
                    <CardDescription>{tariff.company}</CardDescription>
                </CardHeader>

                <CardContent className="flex-grow space-y-4 px-6">
                    <Separator className="bg-white/10" />
                    <div className="flex justify-between items-center py-2">
                        <p className="text-muted-foreground text-sm">{t('results.estimatedCost')}</p>
                        <p className="font-bold text-2xl text-foreground">{tariff.cost.toFixed(2)}€</p>
                    </div>
                    {savings !== null && (
                        <>
                            <Separator className="bg-white/10" />
                            <div className="flex justify-between items-center py-2">
                                <p className="text-accent text-sm font-semibold flex items-center gap-2"><TrendingUp className="h-4 w-4" /> {t('results.estimatedSavings')}</p>
                                <p className={`text-xl font-bold ${savings > 0 ? 'text-accent' : 'text-destructive'}`}>
                                    {savings > 0 ? `${savings.toFixed(2)}€` : `${Math.abs(savings).toFixed(2)}€`}
                                </p>
                            </div>
                        </>
                    )}
                </CardContent>

                <CardFooter className="flex-col !p-0">
                    <CollapsibleContent className="w-full p-6 pt-0 space-y-4">
                         <Separator className="bg-white/10" />
                         <div className="space-y-2 text-sm">
                            <h4 className="font-semibold text-foreground mb-2">{t('results.priceDetails')}</h4>
                            <div className="flex justify-between text-muted-foreground"><span>{t('results.powerPeakPrice')}</span> <span className="font-mono">{tariff.potencia_punta_precio.toFixed(4)} €/kW/día</span></div>
                            <div className="flex justify-between text-muted-foreground"><span>{t('results.powerOffPeakPrice')}</span> <span className="font-mono">{tariff.potencia_valle_precio.toFixed(4)} €/kW/día</span></div>
                             { tariff.periodos_energia === 3 ? (
                                <>
                                    <div className="flex justify-between text-muted-foreground"><span>{t('results.energyPeakPrice')}</span> <span className="font-mono">{tariff.energia_punta_precio.toFixed(4)} €/kWh</span></div>
                                    <div className="flex justify-between text-muted-foreground"><span>{t('results.energyFlatPrice')}</span> <span className="font-mono">{tariff.energia_llano_precio.toFixed(4)} €/kWh</span></div>
                                    <div className="flex justify-between text-muted-foreground"><span>{t('results.energyOffPeakPrice')}</span> <span className="font-mono">{tariff.energia_valle_precio.toFixed(4)} €/kWh</span></div>
                                </>
                             ) : (
                                <div className="flex justify-between text-muted-foreground"><span>{t('results.energyPrice')}</span> <span className="font-mono">{tariff.energia_punta_precio.toFixed(4)} €/kWh</span></div>
                             )
                            }
                         </div>
                         <Button asChild className="w-full" variant="secondary">
                             <a href={tariff.url} target="_blank" rel="noopener noreferrer" onClick={() => {
                                 if (analytics) { logEvent(analytics, 'view_offer_details', { company: tariff.company, tariff_name: tariff.name }); }
                             }}>
                                {t('results.seeOfferOnWeb')}
                                 <ExternalLink className="ml-2 h-4 w-4" />
                             </a>
                         </Button>
                    </CollapsibleContent>
                    
                    <CollapsibleTrigger asChild>
                        <Button variant="ghost" className="w-full rounded-t-none !p-6">
                            {t('results.seeOffer')}
                            <ChevronDown className={`ml-2 h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                        </Button>
                    </CollapsibleTrigger>
                </CardFooter>
            </Card>
        </Collapsible>
    );
};

const ResultsCard = ({ results, currentBill }: { results: TariffResults, currentBill?: number }) => {
  const { t } = useTranslation();

  if (results.length === 0) {
    return null;
  }

  return (
    <div className="w-full animate-in fade-in-50 duration-500">
      <div className="space-y-4">
        <div className="text-center mb-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent flex items-center justify-center gap-2">
            <Sparkles className="h-7 w-7" />
            {t('results.title')}
            </h2>
            <p className="max-w-xl mx-auto text-muted-foreground mt-2">
            {t('results.subtitle')}
            </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {results.map((tariff, index) => (
            <TariffResultCard 
                key={index} 
                tariff={tariff} 
                currentBill={currentBill} 
                isBestOption={index === 0} 
            />
          ))}
        </div>
        <p className="w-full text-center text-xs text-muted-foreground pt-4 flex items-center justify-center gap-2">
            <Info className="h-3 w-3" />
            {t('results.footnote')}
        </p>
      </div>
    </div>
  );
};

const ConsumptionChart = ({ data, chartConfig }: { data: { name: string; consumo: number; fill: string; }[], chartConfig: ChartConfig }) => {
  const { t } = useTranslation();
  const totalConsumption = useMemo(() => data.reduce((acc, curr) => acc + curr.consumo, 0), [data]);
  
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, payload }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 1.3;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 20) * cos;
    const my = cy + (outerRadius + 20) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 12;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';
  
    return (
      <g>
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={payload.fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={payload.fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 8} y={ey} textAnchor={textAnchor} fill="hsl(var(--foreground))" dominantBaseline="central" className="text-sm font-semibold">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
      </g>
    );
  };
  
  
  const legendFormatter = (value: string, entry: any) => {
    const { color, payload } = entry;
    const consumptionValue = payload.consumo;
    const percentage = totalConsumption > 0 ? ((consumptionValue / totalConsumption) * 100).toFixed(1) : 0;
    return (
      <span className="text-muted-foreground">
        <span style={{ color }} className="font-semibold">{chartConfig[value as keyof typeof chartConfig]?.label}</span>
        : {consumptionValue} kWh ({percentage}%)
      </span>
    );
  };

  return (
    <Card className="w-full animate-in fade-in-50 duration-500 bg-card/50 backdrop-blur-sm shadow-xl border-white/10">
      <CardHeader>
        <CardTitle className="text-primary flex items-center gap-2">
          <PieChartIcon className="h-6 w-6" />
          {t('consumption_chart.title')}
        </CardTitle>
        <CardDescription>
          {t('consumption_chart.description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-[350px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 20, right: 40, bottom: 20, left: 40 }}>
              <Tooltip
                cursor={{ fill: "hsl(var(--muted))" }}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="consumo"
                nameKey="name"
              >
                {data.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" height={36} formatter={legendFormatter}/>
            </PieChart>
          </ResponsiveContainer>
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
  const [extracting, setExtracting] = useState(false);
  const [explanationLoading, setExplanationLoading] = useState(false);
  const [results, setResults] = useState<TariffResults | null>(null);
  const [chartData, setChartData] = useState<any[] | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const { toast } = useToast();
  const { t, locale } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      DÍAS_FACTURADOS: 30,
      POTENCIA_P1_kW: 4.6,
      POTENCIA_P2_kW: 4.6,
      ENERGÍA_P1_kWh: 100,
      ENERGÍA_P2_kWh: 150,
      ENERGÍA_P3_kWh: 200,
      importe_factura_actual: undefined,
    },
  });

  const currentBill = form.watch("importe_factura_actual");

  const languageMap: Record<string, string> = {
    es: 'Spanish',
    en: 'English',
    ca: 'Catalan'
  };
  
  const chartConfig = {
    p1: { label: t('consumption_chart.peak'), color: "hsl(var(--chart-1))" },
    p2: { label: t('consumption_chart.flat'), color: "hsl(var(--chart-2))" },
    p3: { label: t('consumption_chart.offpeak'), color: "hsl(var(--chart-3))" },
  } satisfies ChartConfig;

  async function onSubmit(values: FormInput) {
    setLoading(true);
    setResults(null);
    setChartData(null);
    setExplanation(null);
    setExplanationLoading(true);

    if (analytics) {
      const { importe_factura_actual, ...analyticsValues } = values;
      logEvent(analytics, 'compare_tariffs', {
          ...analyticsValues,
          includes_current_bill: !!importe_factura_actual,
      });
    }

    try {
      const { importe_factura_actual, ...tariffValues } = values;
      
      const findTariffsTrace = performance ? trace(performance, 'findTariffs_flow') : null;
      findTariffsTrace?.start();
      const result = await findTariffs(tariffValues);
      findTariffsTrace?.stop();
      
      setResults(result);

      const consumptionDataForChart = [
        { name: 'p1', consumo: values.ENERGÍA_P1_kWh, fill: "var(--color-p1)" },
        { name: 'p2', consumo: values.ENERGÍA_P2_kWh, fill: "var(--color-p2)" },
        { name: 'p3', consumo: values.ENERGÍA_P3_kWh, fill: "var(--color-p3)" },
      ];

      setChartData(consumptionDataForChart);

      const explainTariffTrace = performance ? trace(performance, 'explainTariff_flow') : null;
      explainTariffTrace?.start();
      explainTariff({ consumption: tariffValues, recommendations: result, language: languageMap[locale] })
        .then(explanationResult => {
          setExplanation(explanationResult.explanation);
        })
        .catch(err => {
          console.error("Failed to get tariff explanation:", err);
          if (analytics) {
            logEvent(analytics, 'exception', {
              description: 'explainTariff_failed',
              fatal: false,
            });
          }
          setExplanation(t('explanation.error'));
        })
        .finally(() => {
          explainTariffTrace?.stop();
          setExplanationLoading(false);
        });

    } catch (error) {
      console.error(error);
      if (analytics) {
        logEvent(analytics, 'exception', {
          description: 'findTariffs_failed',
          fatal: true,
        });
      }
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

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setExtracting(true);
    setResults(null);
    setChartData(null);
    setExplanation(null);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Data = reader.result as string;
      try {
        if (analytics) {
          logEvent(analytics, 'extract_bill_start', { file_type: file.type, file_size: file.size });
        }
        const extractedData = await extractBillData({ billDocument: base64Data });
        
        // Populate form with extracted data
        form.reset(extractedData);
        if (analytics) {
          logEvent(analytics, 'extract_bill_success');
        }

        toast({
          title: t('success.title'),
          description: "Datos extraídos de la factura y rellenados en el formulario.",
        });

      } catch (error) {
        console.error("Failed to extract data from bill:", error);
        if (analytics) {
          logEvent(analytics, 'exception', {
            description: 'extractBillData_failed',
            fatal: false,
          });
        }
        toast({
          variant: "destructive",
          title: t('error.title'),
          description: "No se pudieron extraer los datos de la factura. Por favor, introdúcelos manualmente.",
        });
      } finally {
        setExtracting(false);
         // Reset file input value to allow re-uploading the same file
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    };
    reader.onerror = (error) => {
        console.error("Error reading file:", error);
        toast({
            variant: "destructive",
            title: t('error.title'),
            description: "Error al leer el archivo. Inténtalo de nuevo.",
        });
        setExtracting(false);
    };
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };
  
  const formFields = [
    { name: "DÍAS_FACTURADOS", label: t('form.daysBilled'), icon: CalendarDays, placeholder: t('form.daysBilledPlaceholder') },
    { name: "POTENCIA_P1_kW", label: t('form.powerPeak'), icon: Zap, placeholder: t('form.powerPeakPlaceholder') },
    { name: "POTENCIA_P2_kW", label: t('form.powerOffPeak'), icon: Zap, placeholder: t('form.powerOffPeakPlaceholder') },
    { name: "ENERGÍA_P1_kWh", label: t('form.energyPeak'), icon: Lightbulb, placeholder: t('form.energyPeakPlaceholder') },
    { name: "ENERGÍA_P2_kWh", label: t('form.energyFlat'), icon: Lightbulb, placeholder: t('form.energyFlatPlaceholder') },
    { name: "ENERGÍA_P3_kWh", label: t('form.energyOffPeak'), icon: Lightbulb, placeholder: t('form.energyOffPeakPlaceholder') },
    { name: "importe_factura_actual", label: t('form.currentBill'), icon: Euro, placeholder: t('form.currentBillPlaceholder') },
  ] as const;

  return (
    <div className="w-full max-w-4xl space-y-8 py-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl lg:text-6xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {t('header')}
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
          {t('subtitle')}
        </p>
      </div>

      <Card className="w-full shadow-lg border-white/10 bg-card/50 backdrop-blur-sm">
        <CardHeader>
           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div className="flex-1">
                <CardTitle>{t('form.title')}</CardTitle>
                <CardDescription className="mt-1">
                  {t('form.description')}
                </CardDescription>
              </div>
               <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*,application/pdf"
                />
              <div className="flex items-center gap-2 mt-4 sm:mt-0">
                <Button
                    variant="outline"
                    onClick={triggerFileSelect}
                    disabled={extracting}
                >
                    {extracting ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                    <UploadCloud className="mr-2 h-5 w-5" />
                    )}
                    {extracting ? t('form.extractingButton') : t('form.extractButton')}
                </Button>
                <AgentChatDialog />
              </div>
           </div>
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
              <Button type="submit" disabled={loading || extracting} className="w-full" size="lg">
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
      
      {(loading || extracting) && (
        <div className="flex items-center justify-center gap-2 text-muted-foreground animate-pulse pt-4">
            <Loader2 className="h-5 w-5 animate-spin"/>
            <span>{extracting ? t('form.extractingProcess') : t('form.searching')}</span>
        </div>
      )}

      {results && <ResultsCard results={results} currentBill={currentBill} />}
      
      {chartData && (chartData.reduce((acc, cv) => acc + cv.consumo, 0) > 0) && (
        <ConsumptionChart data={chartData} chartConfig={chartConfig} />
      )}

      {(explanation || explanationLoading) && (
        <div className="pt-2 w-full">
          <ExplanationCard explanation={explanation!} loading={explanationLoading} />
        </div>
      )}
    </div>
  );
}
