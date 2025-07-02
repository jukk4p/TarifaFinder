import { StaticPageLayout } from '@/components/static-page-layout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sobre Nosotros - TarifaFinder',
  description: 'Conoce nuestra misión, visión y los valores que nos impulsan a ayudarte a encontrar la mejor tarifa eléctrica.',
};

export default function NosotrosPage() {
  return (
    <StaticPageLayout title="Sobre Nosotros">
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Nuestra Misión</h2>
          <p>
            En TarifaFinder, nuestra misión es aportar transparencia y simplicidad al complejo mercado eléctrico. Nacimos de una idea sencilla: ¿por qué tiene que ser tan difícil encontrar una tarifa de luz que se ajuste a tus necesidades y no te cueste una fortuna? Queremos empoderar a los consumidores con herramientas claras, precisas y fáciles de usar para que tomen el control de sus facturas y ahorren dinero sin esfuerzo.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Nuestra Visión</h2>
          <p>
            Aspiramos a convertirnos en la plataforma de comparación de referencia en España, reconocida por nuestra independencia, precisión y compromiso con el usuario. Soñamos con un futuro en el que cualquier persona pueda optimizar sus gastos de energía en cuestión de minutos, con la total confianza de que está tomando la mejor decisión posible.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Nuestros Valores</h2>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Transparencia:</strong> Mostramos todos los cálculos y datos de forma clara. Sin letra pequeña, sin comisiones ocultas.</li>
            <li><strong>Independencia:</strong> No tenemos acuerdos con ninguna compañía eléctrica. Nuestras recomendaciones se basan únicamente en el ahorro para el usuario.</li>
            <li><strong>Precisión:</strong> Mantenemos nuestra base de datos de tarifas constantemente actualizada para asegurar que las comparaciones sean correctas y relevantes.</li>
            <li><strong>Innovación:</strong> Utilizamos la tecnología más avanzada, incluida la inteligencia artificial, para hacer que el proceso sea lo más simple y eficiente posible.</li>
            <li><strong>Enfoque en el usuario:</strong> Cada decisión que tomamos está pensada para mejorar tu experiencia y ayudarte a alcanzar tus objetivos de ahorro.</li>
          </ul>
        </section>
      </div>
    </StaticPageLayout>
  );
}
