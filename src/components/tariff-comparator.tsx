"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { findTariffs, type TariffOutput } from '@/ai/flows/tariffFinder';
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
import { Badge } from '@/components/ui/badge';
import { Loader2, Zap, Lightbulb, CalendarDays, Calculator, Trophy } from 'lucide-react';

const formSchema = z.object({
  dias_facturados: z.coerce.number().int().positive("Debe ser un número positivo"),
  potencia_punta_kW_P1: z.coerce.number().positive("Debe ser un número positivo"),
  potencia_valle_kW_P2: z.coerce.number().positive("Debe ser un número positivo"),
  energia_punta_kWh_P1: z.coerce.number().positive("Debe ser un número positivo"),
  energia_llano_kWh_P2: z.coerce.number().positive("Debe ser un número positivo"),
  energia_valle_kWh_P3: z.coerce.number().positive("Debe ser un número positivo"),
});

type TariffInput = z.infer<typeof formSchema>;
type TariffResults = TariffOutput;

const ResultsCard = ({ results }: { results: TariffResults }) => {
  const tariffs = [results.tarifa_1, results.tarifa_2, results.tarifa_3].filter(Boolean);

  const trophyColors = ["text-chart-1", "text-chart-2", "text-chart-3"];

  if (tariffs.length === 0) {
    return null;
  }

  return (
    <Card className="animate-in fade-in-50 duration-500 w-full">
      <CardHeader>
        <CardTitle className="text-accent flex items-center gap-2">
          <Trophy className="h-6 w-6" />
          ¡Aquí tienes tus resultados!
        </CardTitle>
        <CardDescription>
          Estas son las 3 tarifas más baratas según tus datos.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ol className="space-y-4">
          {tariffs.map((tariff, index) => (
            <li
              key={index}
              className="flex items-center gap-4 rounded-lg border bg-card p-4 shadow-sm transition-transform hover:scale-[1.02]"
            >
              <Trophy className={`h-8 w-8 ${trophyColors[index]}`} />
              <div className="flex-grow">
                <span className="text-lg font-semibold text-foreground">{tariff}</span>
              </div>
              <Badge variant={index === 0 ? "default" : "secondary"} className="ml-auto shrink-0">
                {`Top ${index + 1}`}
              </Badge>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
};


export function TariffComparator() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<TariffResults | null>(null);
  const { toast } = useToast();

  const form = useForm<TariffInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dias_facturados: 30,
      potencia_punta_kW_P1: 4.6,
      potencia_valle_kW_P2: 4.6,
      energia_punta_kWh_P1: 100,
      energia_llano_kWh_P2: 150,
      energia_valle_kWh_P3: 200,
    },
  });

  async function onSubmit(values: TariffInput) {
    setLoading(true);
    setResults(null);
    try {
      const result = await findTariffs(values);
      setResults(result);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo completar la comparación. Inténtalo de nuevo.",
      });
    } finally {
      setLoading(false);
    }
  }
  
  const formFields = [
    { name: "dias_facturados", label: "Días facturados", icon: CalendarDays, placeholder: "e.g., 30" },
    { name: "potencia_punta_kW_P1", label: "Potencia Punta (kW) P1", icon: Zap, placeholder: "e.g., 4.6" },
    { name: "potencia_valle_kW_P2", label: "Potencia Valle (kW) P2", icon: Zap, placeholder: "e.g., 4.6" },
    { name: "energia_punta_kWh_P1", label: "Energía Punta (kWh) P1", icon: Lightbulb, placeholder: "e.g., 100" },
    { name: "energia_llano_kWh_P2", label: "Energía Llano (kWh) P2", icon: Lightbulb, placeholder: "e.g., 150" },
    { name: "energia_valle_kWh_P3", label: "Energía Valle (kWh) P3", icon: Lightbulb, placeholder: "e.g., 200" },
  ] as const;

  return (
    <div className="w-full max-w-4xl space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl font-headline">
          TarifaFinder
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Encuentra la tarifa eléctrica más barata para ti.
        </p>
      </div>

      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle>Introduce tus datos de consumo</CardTitle>
          <CardDescription>
            Rellena los campos con los datos de tu última factura.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {formFields.map(item => (
                  <FormField
                    key={item.name}
                    control={form.control}
                    name={item.name}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-muted-foreground">
                          <item.icon className="h-4 w-4 text-accent" />
                          {item.label}
                        </FormLabel>
                        <FormControl>
                          <Input type="number" step="0.1" placeholder={item.placeholder} {...field} />
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
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin"/>
            <span>Buscando las mejores ofertas en nuestra hoja de cálculo...</span>
        </div>
      )}

      {results && <ResultsCard results={results} />}
    </div>
  );
}
