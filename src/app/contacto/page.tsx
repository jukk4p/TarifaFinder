import { StaticPageLayout } from '@/components/static-page-layout';
import { ContactForm } from '@/components/contact-form';
import type { Metadata } from 'next';
import { EnvelopeIcon as Mail } from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Contacto - TarifaFinder',
  description: 'Ponte en contacto con el equipo de TarifaFinder. Envíanos tus dudas, sugerencias o comentarios.',
};

export default function ContactoPage() {
  return (
    <StaticPageLayout title="Contacto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <p className="mb-8">
            ¿Tienes alguna pregunta, sugerencia o has encontrado un error? Nos encantaría escucharte. Rellena el formulario y nos pondremos en contacto contigo lo antes posible.
          </p>
          <ContactForm />
        </div>
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Otras formas de contactar</h2>
            <p className="mb-4">Si prefieres no usar el formulario, puedes contactarnos directamente a través de nuestro correo electrónico.</p>
            <div className="flex items-center gap-4">
              <Mail className="h-5 w-5 text-primary" />
              <a href="mailto:contacto@tarifafinder.com" className="hover:underline">contacto@tarifafinder.com</a>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Aviso de Privacidad</h3>
            <p className="text-sm">
              Al usar este formulario, aceptas que los datos que proporcionas se utilizarán únicamente para responder a tu consulta. No compartiremos tu información con terceros. Para más detalles, consulta nuestra <a href="/politica-de-privacidad" className="underline hover:text-primary">Política de Privacidad</a>.
            </p>
          </div>
        </div>
      </div>
    </StaticPageLayout>
  );
}
