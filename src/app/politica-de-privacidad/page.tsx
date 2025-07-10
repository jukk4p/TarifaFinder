import { StaticPageLayout } from '@/components/static-page-layout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidad - TarifaFinder',
  description: 'Información sobre cómo TarifaFinder recopila, usa y protege tus datos personales.',
};

export default function PrivacyPolicyPage() {
  return (
    <StaticPageLayout title="Política de Privacidad">
      <div className="space-y-6">
        <p className="text-sm">Última actualización: 2 de julio de 2024</p>
        
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">1. Introducción</h2>
          <p>En TarifaFinder ("nosotros", "nuestro"), tu privacidad es fundamental. Esta Política de Privacidad explica qué datos recopilamos, cómo los usamos y qué derechos tienes sobre ellos. Al usar nuestro sitio web, aceptas las prácticas descritas en esta política.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">2. Datos que Recopilamos</h2>
          <p>Recopilamos tres tipos de información:</p>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li><strong>Datos de consumo proporcionados por ti:</strong> Cuando utilizas nuestro comparador, introduces datos sobre tu consumo eléctrico (días facturados, potencia, kWh por periodo). Estos datos se utilizan exclusivamente para realizar la comparación y no se almacenan en nuestros servidores una vez que abandonas la sesión.</li>
            <li><strong>Datos de contacto (opcional):</strong> Si utilizas nuestro formulario de contacto, recopilamos tu nombre y correo electrónico para poder responder a tu consulta. Estos datos no se utilizarán para fines de marketing.</li>
            <li><strong>Datos de uso y analítica:</strong> Utilizamos Firebase Analytics para recopilar información anónima sobre cómo interactúas con nuestro sitio (páginas visitadas, clics en botones, tipo de dispositivo). Esto nos ayuda a mejorar la experiencia del usuario. Estos datos no te identifican personalmente.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">3. Cómo Usamos tus Datos</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Para proporcionar y mejorar el servicio de comparación de tarifas.</li>
            <li>Para responder a las consultas enviadas a través del formulario de contacto.</li>
            <li>Para analizar el uso de la plataforma y optimizar su rendimiento y funcionalidad.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">4. Cookies</h2>
          <p>Utilizamos cookies para el funcionamiento de Firebase Analytics. Para más información, por favor, consulta nuestra <a href="/politica-de-cookies" className="underline hover:text-primary">Política de Cookies</a>.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">5. Tus Derechos</h2>
          <p>De acuerdo con la legislación vigente, tienes derecho a acceder, rectificar, cancelar y oponerte al tratamiento de tus datos personales. Puedes ejercer estos derechos contactándonos a través de nuestro correo electrónico. Dado que TarifaFinder no almacena información personal identificable a través de su herramienta principal, el ejercicio de estos derechos se centra principalmente en los datos proporcionados en el formulario de contacto y en la gestión de cookies.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">6. Seguridad de los Datos</h2>
          <p>Tomamos medidas razonables para proteger la información que procesamos. Sin embargo, ninguna transmisión por internet es 100% segura, por lo que no podemos garantizar una seguridad absoluta.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">7. Cambios en esta Política</h2>
          <p>Nos reservamos el derecho de modificar esta Política de Privacidad en cualquier momento. Cualquier cambio será publicado en esta página con la fecha de la última actualización. Te recomendamos revisarla periódicamente.</p>
        </section>
      </div>
    </StaticPageLayout>
  );
}
