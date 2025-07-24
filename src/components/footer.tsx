import { Gift, Twitter } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 w-full border-t border-white/10 bg-transparent py-8 px-4 sm:px-6 lg:px-8 backdrop-blur-sm bg-card/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-foreground">TarifaFinder</h3>
            <p className="mt-2 text-sm text-muted-foreground">Tu comparador de tarifas eléctricas inteligente.</p>
          </div>
          <div className="grid grid-cols-2 md:col-span-2 gap-8">
            <div>
              <h4 className="text-sm font-semibold text-foreground tracking-wider uppercase">Navegación</h4>
              <ul className="mt-4 space-y-2">
                <li><Link href="/faq" className="text-sm text-muted-foreground hover:text-primary">FAQ</Link></li>
                 <li><Link href="/nosotros" className="text-sm text-muted-foreground hover:text-primary">Sobre Nosotros</Link></li>
                 <li><Link href="/contacto" className="text-sm text-muted-foreground hover:text-primary">Contacto</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground tracking-wider uppercase">Síguenos</h4>
              <div className="flex space-x-4 mt-4">
                <Link href="https://twitter.com/TarifaFinder" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                  <span className="sr-only">Twitter</span>
                  <Twitter className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full text-center mt-12 border-t border-white/10 pt-8">
          <p className="text-muted-foreground mb-4">Si esta herramienta te ha resultado útil, considera apoyar el proyecto.</p>
          <Button asChild>
            <a
              href="https://paypal.me/jukk4p"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Gift className="mr-2 h-5 w-5" />
              Invítame a un café
            </a>
          </Button>
        </div>
        
        <div className="mt-8 border-t border-white/10 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} TarifaFinder</p>
        </div>
      </div>
    </footer>
  );
}
