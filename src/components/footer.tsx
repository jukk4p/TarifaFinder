import { Twitter, Linkedin, Mail } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 w-full border-t border-white/10 bg-transparent py-8 px-4 sm:px-6 lg:px-8 mt-auto backdrop-blur-sm bg-card/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold text-foreground">TarifaFinder</h3>
            <p className="mt-2 text-sm text-muted-foreground">Tu comparador de tarifas eléctricas inteligente.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 md:col-span-3 gap-8">
            <div>
              <h4 className="text-sm font-semibold text-foreground tracking-wider uppercase">Navegación</h4>
              <ul className="mt-4 space-y-2">
                <li><Link href="/nosotros" className="text-sm text-muted-foreground hover:text-primary">Nosotros</Link></li>
                <li><Link href="/contacto" className="text-sm text-muted-foreground hover:text-primary">Contacto</Link></li>
                <li><Link href="/faq" className="text-sm text-muted-foreground hover:text-primary">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground tracking-wider uppercase">Legal</h4>
              <ul className="mt-4 space-y-2">
                <li><Link href="/politica-de-privacidad" className="text-sm text-muted-foreground hover:text-primary">Política de Privacidad</Link></li>
                <li><Link href="/politica-de-cookies" className="text-sm text-muted-foreground hover:text-primary">Política de Cookies</Link></li>
                <li><Link href="/terminos-de-uso" className="text-sm text-muted-foreground hover:text-primary">Términos de Uso</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground tracking-wider uppercase">Contacto</h4>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="mailto:contacto@tarifafinder.com" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
                    <Mail className="h-4 w-4" />
                    <span>contacto@tarifafinder.com</span>
                  </a>
                </li>
              </ul>
              <div className="flex space-x-4 mt-4">
                <Link href="/#" className="text-muted-foreground hover:text-primary"><span className="sr-only">Twitter</span><Twitter className="h-5 w-5" /></Link>
                <Link href="/#" className="text-muted-foreground hover:text-primary"><span className="sr-only">LinkedIn</span><Linkedin className="h-5 w-5" /></Link>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-white/10 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} TarifaFinder. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
