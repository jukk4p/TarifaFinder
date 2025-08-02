
"use client";

import { tariffs, type Tariff } from "@/lib/tariffs";
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
import { CircleStackIcon as Database, ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "@/lib/i18n";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export function TariffDataViewer() {
  const { t } = useTranslation();

  const handleDownloadCSV = () => {
    const headers = [
      "company",
      "name",
      "logoUrl",
      "potencia_punta_precio",
      "potencia_valle_precio",
      "periodos_energia",
      "energia_punta_precio",
      "energia_llano_precio",
      "energia_valle_precio",
      "url",
      "commitment",
    ];

    const csvContent = [
      headers.join(","),
      ...tariffs.map((tariff: Tariff) =>
        headers
          .map((header) => {
            const value = tariff[header as keyof Tariff];
            if (typeof value === "string" && value.includes(",")) {
              return `"${value}"`;
            }
            return value;
          })
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "tarifafinder_data.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-6xl mt-8 px-4 sm:px-0">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1" className="border-none bg-card/50 backdrop-blur-sm shadow-xl border-white/10 rounded-lg">
          <AccordionTrigger className="w-full p-4 sm:p-6 text-left hover:no-underline">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4">
              <div className="flex items-center gap-4">
                <Database className="h-6 w-6 text-primary shrink-0" />
                <div>
                  <p className="text-lg font-semibold">{t('tariff_database.title')}</p>
                  <p className="mt-1 text-sm font-normal text-muted-foreground text-left">
                    {t('tariff_database.description')}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownloadCSV();
                }}
                className="w-full sm:w-auto"
              >
                <ArrowDownTrayIcon className="mr-2 h-4 w-4" />
                {t('tariff_database.downloadCsv')}
              </Button>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="overflow-x-auto px-4 sm:px-6 pb-6 pt-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/20">
                    <TableHead>{t('tariff_database.company')}</TableHead>
                    <TableHead>{t('tariff_database.name')}</TableHead>
                    <TableHead>{t('tariff_database.commitment')}</TableHead>
                    <TableHead className="text-right">{t('tariff_database.powerPrice')}</TableHead>
                    <TableHead className="text-right">{t('tariff_database.energyPrice')}</TableHead>
                    <TableHead>{t('tariff_database.url')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tariffs.map((tariff, index) => (
                    <TableRow key={index} className="border-white/10 last:border-b-0">
                      <TableCell className="font-medium">{tariff.company}</TableCell>
                      <TableCell>{tariff.name}</TableCell>
                      <TableCell>{tariff.commitment ? t('common.yes') : t('common.no')}</TableCell>
                      <TableCell className="text-right font-mono text-xs">
                        <div>P1: {tariff.potencia_punta_precio.toFixed(5)}</div>
                        <div>P2: {tariff.potencia_valle_precio.toFixed(5)}</div>
                      </TableCell>
                      <TableCell className={cn("text-right font-mono text-xs", { "space-y-1": tariff.periodos_energia === 3 })}>
                        {tariff.periodos_energia === 1 ? (
                          <span>{tariff.energia_punta_precio.toFixed(5)}</span>
                        ) : (
                          <>
                            <div>P1: {tariff.energia_punta_precio.toFixed(5)}</div>
                            <div>P2: {tariff.energia_llano_precio.toFixed(5)}</div>
                            <div>P3: {tariff.energia_valle_precio.toFixed(5)}</div>
                          </>
                        )}
                      </TableCell>
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
