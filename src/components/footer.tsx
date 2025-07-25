import { GiftIcon as Gift } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from './ui/button';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const TwitterIcon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current">
        <title>Twitter</title>
        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
    </svg>
  );

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
                  <TwitterIcon />
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
