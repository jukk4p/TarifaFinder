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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function TariffDataViewer() {
  return (
    <Card className="w-full max-w-6xl mt-8 bg-card/50 backdrop-blur-sm shadow-xl border-white/10">
      <CardHeader>
        <CardTitle>Datos de Tarifas Actuales</CardTitle>
        <CardDescription>
          Aquí están los datos de las tarifas que se están utilizando actualmente en la aplicación.
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
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
              <TableRow key={index}>
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
      </CardContent>
    </Card>
  );
}
