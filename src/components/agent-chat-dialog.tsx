"use client";

import { useState, useCallback } from 'react';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from '@/hooks/use-toast';
import { Loader2, Bot, FileUp, FileText, Cloud } from 'lucide-react';
import { extractWithLlamaCloud } from '@/ai/flows/extractWithLlamaCloud';

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

  const handleFileChange = (selectedFile: File | null) => {
    if (!selectedFile) {
        resetState();
        return;
    }
    setFile(selectedFile);
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onload = () => {
      const uri = reader.result as string;
      setFileDataUri(uri);
      // Automatically trigger extraction on file selection
      handleExtraction(uri);
    };
    reader.onerror = (error) => {
      console.error("Error reading file:", error);
      toast({
        variant: "destructive",
        title: "Error al leer el archivo",
        description: "Hubo un problema al procesar tu archivo.",
      });
      setLoading(false);
    };
  };

  const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setLoading(true);
    setResponse(null);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      handleFileChange(event.dataTransfer.files[0]);
    }
  }, []);

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  async function handleExtraction(documentUri: string) {
    if (!documentUri) {
        toast({ variant: "destructive", title: "Falta el archivo", description: "Por favor, sube un documento para analizar." });
        return;
    }
    setLoading(true);
    setResponse(null);
    try {
      const result = await extractWithLlamaCloud({
        document: documentUri,
       });
      setResponse(JSON.stringify(result.data, null, 2));
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "No se pudo comunicar con el servicio de extracción.";
      toast({
        variant: "destructive",
        title: "Error de Extracción",
        description: errorMessage,
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
          <Cloud className="mr-2 h-5 w-5" />
          Extraer con LlamaCloud
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Extractor de Datos con LlamaCloud</DialogTitle>
          <DialogDescription>
            Sube tu factura o documento para que el agente IA "TarifaFinder" extraiga los datos estructurados.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 pt-4">

            {!file && !loading && (
                 <div
                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-card/50 hover:bg-card/80"
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    onClick={() => document.getElementById('file-upload-agent')?.click()}
                >
                    <FileUp className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">Arrastra y suelta un archivo aquí o haz clic para seleccionar</p>
                    <input id="file-upload-agent" type="file" className="hidden" onChange={(e) => {
                        setLoading(true);
                        setResponse(null);
                        handleFileChange(e.target.files ? e.target.files[0] : null)
                    }} />
                </div>
            )}
            
            {(file || loading) && (
                <div className="flex items-center justify-between p-4 rounded-lg border bg-card/50">
                    <div className="flex items-center gap-3">
                        <FileText className="h-6 w-6 text-primary" />
                        <p className="font-medium text-foreground truncate max-w-xs">{file?.name}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleFileChange(null)}>Cambiar</Button>
                </div>
            )}
            
            {(loading || response) && (
                <div className="rounded-lg border bg-card/50 p-6 space-y-4 animate-in fade-in-50">
                    <div className="flex items-center gap-3">
                        <Bot className="h-6 w-6 text-primary"/>
                        <h3 className="text-lg font-semibold text-foreground">Datos Extraídos</h3>
                    </div>
                {loading && !response && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>El agente está procesando tu documento...</span>
                    </div>
                )}
                {response && <pre className="text-sm text-muted-foreground whitespace-pre-wrap bg-background/50 p-4 rounded-md">{response}</pre>}
                </div>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
