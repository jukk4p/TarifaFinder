import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { LanguageProvider } from '@/lib/i18n';
import '@/lib/firebase'; // Import for side effects (Firebase initialization)

export const metadata: Metadata = {
  title: {
    default: 'TarifaFinder',
    template: '%s - TarifaFinder',
  },
  description: 'Comparador de tarifas eléctricas para ayudarte a ahorrar en tu factura de la luz.',
  icons: {
    icon: '/favicon.ico',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased flex flex-col">
        <LanguageProvider>
          <div className="flex-grow">
            {children}
          </div>
        </LanguageProvider>
        <Toaster />
      </body>
    </html>
  );
}
