import { StaticPageLayout } from '@/components/static-page-layout';
import { AgentChat } from '@/components/agent-chat';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Agente IA - TarifaFinder',
  description: 'Habla con nuestro agente de IA para analizar documentos y extraer información.',
};

export default function AgentPage() {
  return (
    <StaticPageLayout title="Agente de Análisis de Documentos">
        <div className="prose-p:text-muted-foreground">
            <p>
                Este es un ejemplo de cómo puedes integrar un agente de IA externo como LlamaCloud.
                Hazle una pregunta y el agente usará una herramienta para llamar a la API externa y obtener la respuesta.
            </p>
             <p className="text-sm">
              <strong>Nota:</strong> Esta es una implementación de demostración. La llamada a LlamaCloud está simulada. Para que funcione, necesitas añadir tu API Key en el fichero <code>.env</code>.
            </p>
        </div>
        <div className="mt-8">
            <AgentChat />
        </div>
    </StaticPageLayout>
  );
}
