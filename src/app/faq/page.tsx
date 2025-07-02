import { StaticPageLayout } from '@/components/static-page-layout';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Preguntas Frecuentes - TarifaFinder',
  description: 'Encuentra respuestas a las preguntas más comunes sobre TarifaFinder, nuestro comparador de tarifas eléctricas.',
};

const faqs = [
  {
    question: '¿Cómo calcula TarifaFinder el coste de las tarifas?',
    answer: 'Utilizamos los datos de consumo que introduces (potencia y energía en los diferentes periodos) y los aplicamos a las fórmulas de precios de cada tarifa en nuestra base de datos. El cálculo incluye los términos de potencia, energía, el impuesto eléctrico, el alquiler del contador y el IVA para darte una estimación lo más real posible de lo que pagarías.',
  },
  {
    question: '¿Está actualizada la base de datos de tarifas?',
    answer: 'Sí, nos esforzamos por mantener nuestra base de datos lo más actualizada posible. Revisamos periódicamente las tarifas de las principales comercializadoras para asegurar la precisión de las comparaciones. Sin embargo, los precios del mercado libre pueden cambiar, por lo que siempre recomendamos verificar la oferta final en la web de la compañía.',
  },
  {
    question: '¿TarifaFinder es un servicio gratuito?',
    answer: 'Sí, el uso de nuestro comparador es completamente gratuito para los usuarios. Nuestro objetivo es ayudarte a ahorrar, sin ningún coste para ti.',
  },
  {
    question: '¿Cómo manejáis mis datos personales?',
    answer: 'Tu privacidad es nuestra prioridad. Los datos de consumo que introduces se utilizan únicamente para realizar la comparación en el momento y no se almacenan. No te pedimos ningún dato personal para usar el comparador. Para más detalles, puedes consultar nuestra Política de Privacidad.',
  },
  {
    question: '¿Puedo confiar en las recomendaciones?',
    answer: 'Nuestras recomendaciones se basan en un cálculo matemático puro y duro: te mostramos las tarifas que resultarían más baratas según los datos que nos proporcionas. Somos totalmente independientes y no favorecemos a ninguna compañía.',
  },
  {
    question: '¿Qué hago si encuentro un error en los datos o en un cálculo?',
    answer: 'Agradecemos enormemente tu ayuda. Si detectas cualquier posible error, por favor, no dudes en contactarnos a través de nuestro formulario o correo electrónico de contacto. Lo investigaremos lo antes posible.',
  },
  {
    question: '¿Qué significan los periodos P1, P2 y P3?',
    answer: 'Son los periodos horarios de la tarifa eléctrica regulada en España. P1 (Punta) es el más caro, P2 (Llano) tiene un precio intermedio, y P3 (Valle) es el más económico. Conocer tu consumo en cada periodo es clave para encontrar la tarifa que mejor se adapta a tus hábitos.',
  },
];

export default function FAQPage() {
  return (
    <StaticPageLayout title="Preguntas Frecuentes">
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem value={`item-${index + 1}`} key={index} className="border-b-white/10">
            <AccordionTrigger className="text-left text-lg hover:no-underline text-foreground">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="pt-2">
              <p>{faq.answer}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </StaticPageLayout>
  );
}
