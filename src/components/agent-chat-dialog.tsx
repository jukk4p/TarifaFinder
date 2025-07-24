"use client";

import { useState, useCallback } from 'react';
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
import { Loader2, Send, Bot, MessageSquareQuote, FileUp, FileText } from 'lucide-react';
import { analyzeDocument } from '@/ai/flows/analyzeDocumentFlow';

const formSchema = z.object({
  instruction: z.string().min(5, { message: 'La instrucción debe tener al menos 5 caracteres.' }),
});

export function AgentChatDialog() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fileDataUri, setFileDataUri] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      instruction: '',
    },
  });

  const handleFileChange = (selectedFile: File) => {
    if (!selectedFile) return;
    setFile(selectedFile);
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onload = () => {
      setFileDataUri(reader.result as string);
    };
    reader.onerror = (error) => {
      console.error("Error reading file:", error);
      toast({
        variant: "destructive",
        title: "Error al leer el archivo",
        description: "Hubo un problema al procesar tu archivo.",
      });
    };
  };

  const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      handleFileChange(event.dataTransfer.files[0]);
    }
  }, []);

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!fileDataUri) {
        toast({ variant: "destructive", title: "Falta el archivo", description: "Por favor, sube un documento para analizar." });
        return;
    }
    setLoading(true);
    setResponse(null);
    try {
      const result = await analyzeDocument({
        document: fileDataUri,
        instruction: values.instruction,
       });
      setResponse(result.analysis);
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

  const resetState = () => {
    setFile(null);
    setFileDataUri(null);
    setResponse(null);
    setLoading(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
        if (!isOpen) {
            resetState();
        }
        setOpen(isOpen);
    }}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <MessageSquareQuote className="mr-2 h-5 w-5" />
          Preguntar al Agente IA
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Analizador de Documentos IA</DialogTitle>
          <DialogDescription>
            Sube un documento y dale una instrucción a la IA para que lo analice. (Utiliza LlamaCloud)
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 pt-4">

            {!file ? (
                 <div
                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-card/50 hover:bg-card/80"
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    onClick={() => document.getElementById('file-upload')?.click()}
                >
                    <FileUp className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">Arrastra y suelta un archivo aquí o haz clic para seleccionar</p>
                    <input id="file-upload" type="file" className="hidden" onChange={(e) => e.target.files && handleFileChange(e.target.files[0])} />
                </div>
            ) : (
                <div className="flex items-center justify-between p-4 rounded-lg border bg-card/50">
                    <div className="flex items-center gap-3">
                        <FileText className="h-6 w-6 text-primary" />
                        <p className="font-medium text-foreground truncate max-w-xs">{file.name}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={resetState}>Cambiar</Button>
                </div>
            )}
            
            {file && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-4">
                    <FormField
                        control={form.control}
                        name="instruction"
                        render={({ field }) => (
                        <FormItem className="flex-grow">
                            <FormControl>
                            <Input placeholder="Ej: 'Resume este documento en 3 puntos clave'" {...field} className="bg-background/80" />
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
            )}
            
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
