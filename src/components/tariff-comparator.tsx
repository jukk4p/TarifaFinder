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
import { Loader2, Zap, Lightbulb, CalendarDays, Calculator, Trophy, Sparkles, Gift, Euro } from 'lucide-react';

const formSchema = z.object({
  DÍAS_FACTURADOS: z.coerce.number().int().positive("Debe ser un número positivo"),
  POTENCIA_P1_kW: z.coerce.number().positive("Debe ser un número positivo"),
  POTENCIA_P2_kW: z.coerce.number().positive("Debe ser un número positivo"),
  ENERGÍA_P1_kWh: z.coerce.number().positive("Debe ser un número positivo"),
  ENERGÍA_P2_kWh: z.coerce.number().positive("Debe ser un número positivo"),
  ENERGÍA_P3_kWh: z.coerce.number().positive("Debe ser un número positivo"),
  importe_factura_actual: z.coerce.number().positive("Debe ser un número positivo").optional(),
});

type FormInput = z.infer<typeof formSchema>;
type TariffResults = TariffOutput;

const ResultsCard = ({ results, currentBill }: { results: TariffResults, currentBill?: number }) => {
  const tariffs = results;
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
          Estas son las 3 tarifas más baratas para tu consumo. {currentBill && currentBill > 0 ? "También te mostramos el ahorro estimado." : "Haz clic para ver la oferta."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {tariffs.map(({ company, name, url, cost }, index) => {
            const savings = currentBill && currentBill > 0 ? currentBill - cost : null;
            return (
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
                     {savings !== null && (
                      <p className={`mt-1 text-sm font-medium ${savings > 0 ? 'text-primary' : 'text-destructive'}`}>
                        {savings > 0 ? `Ahorro estimado: ${savings.toFixed(2)}€` : `Coste extra: ${Math.abs(savings).toFixed(2)}€`}
                      </p>
                    )}
                  </div>
                  <div className="ml-auto flex shrink-0 items-center gap-4 text-right">
                    <div>
                        <p className="text-xl font-bold text-foreground">{cost.toFixed(2)}€</p>
                        <p className="text-xs text-muted-foreground">/mes estimado</p>
                    </div>
                    <Badge variant={index === 0 ? "default" : index === 1 ? "secondary" : "outline"} className="w-12 justify-center py-2 text-lg">
                      #{index + 1}
                    </Badge>
                  </div>
                </a>
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  );
};


export function TariffComparator() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<TariffResults | null>(null);
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
      importe_factura_actual: undefined,
    },
  });

  const currentBill = form.watch("importe_factura_actual");

  async function onSubmit(values: FormInput) {
    setLoading(true);
    setResults(null);
    try {
      const { importe_factura_actual, ...tariffValues } = values;
      const result = await findTariffs(tariffValues);
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

      <div className="w-full text-center mt-12 border-t border-white/10 pt-8">
        <p className="text-muted-foreground mb-4">Si esta herramienta te resulta útil, considera hacer una donación.</p>
        <Button asChild>
          <a
            href="https://paypal.me/jukk4p?country.x=ES&locale.x=es_ES"
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
