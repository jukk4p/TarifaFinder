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
import { Loader2, Zap, Lightbulb, CalendarDays, Calculator, Trophy, Sparkles } from 'lucide-react';

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
  const tariffs = [results.tarifa_1, results.tarifa_2, results.tarifa_3].filter((t): t is [string, string, string] => t !== null);

  const trophyColors = ["text-yellow-400", "text-slate-300", "text-orange-400"];
  
  if (tariffs.length === 0) {
    return null;
  }

  return (
    <Card className="w-full animate-in fade-in-50 duration-500 bg-card/50 backdrop-blur-sm shadow-xl border-white/10">
      <CardHeader>
        <CardTitle className="text-accent flex items-center gap-2">
          <Sparkles className="h-6 w-6" />
          ¡Aquí tienes tus resultados!
        </CardTitle>
        <CardDescription>
          Estas son las 3 tarifas más baratas según tus datos. Haz clic para ver la oferta.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {tariffs.map(([company, name, url], index) => (
            <li key={index} className="transition-transform duration-300 hover:scale-[1.02]">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4 shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-background transition-colors group-hover:bg-primary/10`}>
                    <Trophy className={`h-7 w-7 shrink-0 transition-colors ${trophyColors[index]}`} />
                </div>
                <div className="flex-grow">
                  <p className="text-sm font-medium text-muted-foreground">{company}</p>
                  <p className="text-lg font-semibold text-foreground">{name}</p>
                </div>
                <Badge variant={index === 0 ? "default" : index === 1 ? "secondary" : "outline"} className="ml-auto shrink-0">
                  {`Top ${index + 1}`}
                </Badge>
              </a>
            </li>
          ))}
        </ul>
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
    { name: "potencia_punta_kW_P1", label: "Potencia Punta (kW)", icon: Zap, placeholder: "e.g., 4.6" },
    { name: "potencia_valle_kW_P2", label: "Potencia Valle (kW)", icon: Zap, placeholder: "e.g., 4.6" },
    { name: "energia_punta_kWh_P1", label: "Energía Punta (kWh)", icon: Lightbulb, placeholder: "e.g., 100" },
    { name: "energia_llano_kWh_P2", label: "Energía Llano (kWh)", icon: Lightbulb, placeholder: "e.g., 150" },
    { name: "energia_valle_kWh_P3", label: "Energía Valle (kWh)", icon: Lightbulb, placeholder: "e.g., 200" },
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

      {results && <ResultsCard results={results} />}
    </div>
  );
}
