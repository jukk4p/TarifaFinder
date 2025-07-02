import { StaticPageLayout } from '@/components/static-page-layout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Cookies - TarifaFinder',
  description: 'Descubre qué cookies utilizamos en TarifaFinder y cómo puedes gestionarlas.',
};

export default function CookiePolicyPage() {
  return (
    <StaticPageLayout title="Política de Cookies">
      <div className="space-y-6">
        <p className="text-sm">Última actualización: 2 de julio de 2024</p>
        
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">1. ¿Qué son las cookies?</h2>
          <p>Una cookie es un pequeño fichero de texto que se almacena en tu navegador cuando visitas casi cualquier página web. Su utilidad es que la web sea capaz de recordar tu visita cuando vuelvas a navegar por esa página. Las cookies suelen almacenar información de carácter técnico, preferencias personales, personalización de contenidos, estadísticas de uso, etc.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">2. ¿Qué cookies utilizamos?</h2>
          <p>En TarifaFinder, utilizamos los siguientes tipos de cookies:</p>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li><strong>Cookies de análisis:</strong> Utilizamos cookies de terceros, concretamente de Firebase Analytics (propiedad de Google), para recopilar información estadística y anónima sobre la navegación de los usuarios en nuestro sitio. Esto nos ayuda a entender qué páginas son más populares, cuánto tiempo pasan los usuarios en el sitio y cómo podemos mejorar la experiencia general. Estas cookies no recopilan información personal identificable.</li>
            <li><strong>Cookies funcionales:</strong> Podemos usar cookies para recordar tus preferencias, como el idioma seleccionado, para que no tengas que configurarlo cada vez que nos visites.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">3. ¿Cómo puedes gestionar las cookies?</h2>
          <p>Puedes permitir, bloquear o eliminar las cookies instaladas en tu equipo mediante la configuración de las opciones del navegador instalado en tu ordenador. A continuación, te proporcionamos enlaces a las instrucciones de los navegadores más populares:</p>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">Google Chrome</a></li>
            <li><a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">Mozilla Firefox</a></li>
            <li><a href="https://support.microsoft.com/es-es/windows/eliminar-y-administrar-cookies-168dab11-0753-043d-7c16-ede5947fc64d" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">Microsoft Edge</a></li>
            <li><a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">Safari</a></li>
          </ul>
          <p className="mt-2">Ten en cuenta que si decides desactivar las cookies, es posible que algunas funcionalidades de TarifaFinder no funcionen correctamente.</p>
        </section>
      </div>
    </StaticPageLayout>
  );
}
