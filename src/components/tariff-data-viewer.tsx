"use client";

import { tariffs } from "@/lib/tariffs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Database } from "lucide-react";

export function TariffDataViewer() {
  return (
    <div className="w-full max-w-6xl mt-8">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1" className="border-none bg-card/50 backdrop-blur-sm shadow-xl border-white/10 rounded-lg">
          <AccordionTrigger className="w-full p-6 text-left hover:no-underline">
            <div className="flex items-center gap-4">
              <Database className="h-6 w-6 text-primary shrink-0" />
              <div>
                <p className="text-lg font-semibold">Base de Datos de Tarifas</p>
                <p className="mt-1 text-sm font-normal text-muted-foreground text-left">
                  Aquí se muestran las tarifas disponibles para la comparación.
                </p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="overflow-x-auto px-6 pb-6 pt-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/20">
                    <TableHead>Compañía</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead className="text-right">Pot. Punta (€/kW/día)</TableHead>
                    <TableHead className="text-right">Pot. Valle (€/kW/día)</TableHead>
                    <TableHead className="text-center">Periodos</TableHead>
                    <TableHead className="text-right">Energía Punta (€/kWh)</TableHead>
                    <TableHead className="text-right">Energía Llano (€/kWh)</TableHead>
                    <TableHead className="text-right">Energía Valle (€/kWh)</TableHead>
                    <TableHead>URL</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tariffs.map((tariff, index) => (
                    <TableRow key={index} className="border-white/10 last:border-b-0">
                      <TableCell className="font-medium">{tariff.company}</TableCell>
                      <TableCell>{tariff.name}</TableCell>
                      <TableCell className="text-right">{tariff.potencia_punta_precio.toFixed(5)}</TableCell>
                      <TableCell className="text-right">{tariff.potencia_valle_precio.toFixed(5)}</TableCell>
                      <TableCell className="text-center">{tariff.periodos_energia}</TableCell>
                      <TableCell className="text-right">{tariff.energia_punta_precio.toFixed(5)}</TableCell>
                      <TableCell className="text-right">{tariff.energia_llano_precio.toFixed(5)}</TableCell>
                      <TableCell className="text-right">{tariff.energia_valle_precio.toFixed(5)}</TableCell>
                      <TableCell>
                        <a href={tariff.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline whitespace-nowrap">
                          Ver oferta
                        </a>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
