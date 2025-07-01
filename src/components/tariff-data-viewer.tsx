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
import { useTranslation } from "@/lib/i18n";

export function TariffDataViewer() {
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-6xl mt-8">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1" className="border-none bg-card/50 backdrop-blur-sm shadow-xl border-white/10 rounded-lg">
          <AccordionTrigger className="w-full p-6 text-left hover:no-underline">
            <div className="flex items-center gap-4">
              <Database className="h-6 w-6 text-primary shrink-0" />
              <div>
                <p className="text-lg font-semibold">{t('tariff_database.title')}</p>
                <p className="mt-1 text-sm font-normal text-muted-foreground text-left">
                  {t('tariff_database.description')}
                </p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="overflow-x-auto px-6 pb-6 pt-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/20">
                    <TableHead>{t('tariff_database.company')}</TableHead>
                    <TableHead>{t('tariff_database.name')}</TableHead>
                    <TableHead className="text-right">{t('tariff_database.powerPeakPrice')}</TableHead>
                    <TableHead className="text-right">{t('tariff_database.powerOffPeakPrice')}</TableHead>
                    <TableHead className="text-center">{t('tariff_database.periods')}</TableHead>
                    <TableHead className="text-right">{t('tariff_database.energyPeakPrice')}</TableHead>
                    <TableHead className="text-right">{t('tariff_database.energyFlatPrice')}</TableHead>
                    <TableHead className="text-right">{t('tariff_database.energyOffPeakPrice')}</TableHead>
                    <TableHead>{t('tariff_database.url')}</TableHead>
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
                          {t('tariff_database.seeOffer')}
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
