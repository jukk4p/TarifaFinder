import { StaticPageLayout } from '@/components/static-page-layout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Términos de Uso - TarifaFinder',
  description: 'Condiciones generales de uso de la plataforma TarifaFinder.',
};

export default function TermsOfUsePage() {
  return (
    <StaticPageLayout title="Términos de Uso">
      <div className="space-y-6">
        <p className="text-sm">Última actualización: 2 de julio de 2024</p>
        
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">1. Objeto</h2>
          <p>Estos Términos de Uso regulan el acceso y la utilización del sitio web TarifaFinder. El acceso y uso de la plataforma implican la aceptación sin reservas de todas las condiciones incluidas en estos términos.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">2. Descripción del Servicio</h2>
          <p>TarifaFinder es una herramienta online gratuita que permite a los usuarios comparar diferentes tarifas de electricidad disponibles en el mercado español. La plataforma realiza cálculos basados en los datos de consumo proporcionados por el usuario para ofrecer una estimación de costes.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">3. Responsabilidades del Usuario</h2>
          <p>El usuario se compromete a:</p>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>Hacer un uso lícito y adecuado de la plataforma, de conformidad con la ley y estos términos.</li>
            <li>Proporcionar datos veraces y precisos para la realización de las comparativas. La exactitud de los resultados depende directamente de la calidad de los datos introducidos.</li>
            <li>No utilizar la plataforma con fines fraudulentos o para realizar actividades ilícitas.</li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">4. Limitación de Responsabilidad</h2>
          <p>TarifaFinder actúa como un mero intermediario informativo. Si bien nos esforzamos por mantener la información de las tarifas actualizada y precisa, no podemos garantizarlo al 100%, ya que las comercializadoras pueden modificar sus condiciones sin previo aviso.</p>
          <p className="mt-2">Las estimaciones de costes son solo eso, estimaciones. No constituyen una oferta vinculante. El usuario es responsable de verificar los términos y condiciones finales en el sitio web de la compañía eléctrica antes de contratar cualquier servicio.</p>
          <p className="mt-2">TarifaFinder no será responsable de las decisiones que el usuario tome basándose en la información proporcionada por la plataforma, ni de los daños y perjuicios que pudieran derivarse de su uso.</p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">5. Propiedad Intelectual</h2>
          <p>Todos los contenidos del sitio web, incluyendo textos, gráficos, logos, código fuente y software, son propiedad de TarifaFinder o de terceros que han autorizado su uso, y están protegidos por las leyes de propiedad intelectual.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">6. Legislación Aplicable</h2>
          <p>Estos Términos de Uso se regirán e interpretarán de acuerdo con la legislación española.</p>
        </section>
      </div>
    </StaticPageLayout>
  );
}
