"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send, Bot, MessageSquareQuote } from 'lucide-react';
import { chatWithAgent } from '@/ai/flows/documentAgentFlow';

const formSchema = z.object({
  message: z.string().min(5, { message: 'El mensaje debe tener al menos 5 caracteres.' }),
});

export function AgentChatDialog() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResponse(null);
    try {
      const result = await chatWithAgent({ message: values.message });
      setResponse(result.response);
      form.reset();
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo comunicar con el agente.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <MessageSquareQuote className="mr-2 h-5 w-5" />
          Preguntar al Agente IA
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Agente de Análisis de Documentos</DialogTitle>
          <DialogDescription>
            Haz una pregunta y el agente usará LlamaCloud para obtener la respuesta. Esta es una demo, la llamada a la API está simulada.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 pt-4">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-4">
                <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                    <FormItem className="flex-grow">
                        <FormControl>
                        <Input placeholder="Pregúntale algo sobre el documento..." {...field} className="bg-background/80" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <Button type="submit" disabled={loading} size="icon">
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                    <span className="sr-only">Enviar</span>
                </Button>
                </form>
            </Form>
            
            {(loading || response) && (
                <div className="rounded-lg border bg-card/50 p-6 space-y-4 animate-in fade-in-50">
                    <div className="flex items-center gap-3">
                        <Bot className="h-6 w-6 text-primary"/>
                        <h3 className="text-lg font-semibold text-foreground">Respuesta del Agente</h3>
                    </div>
                {loading && !response && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>El agente está procesando tu petición...</span>
                    </div>
                )}
                {response && <p className="text-muted-foreground whitespace-pre-wrap">{response}</p>}
                </div>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
